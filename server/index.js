import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import http from "node:http";
import { Server } from "socket.io";
import { registerVerifyRoutes } from "./routes/verify.js";
import { registerAuthRoutes } from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import {
  ActivityType,
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from "discord.js";

dotenv.config();

/* =========================================================
   CONFIGURACIÓN GENERAL
   ========================================================= */

const app = express();
/*
  Códigos temporales generados después de OAuth.
  Cada código puede utilizarse una sola vez.
*/

/*
  Código recibido después del OAuth.
  Dura 60 segundos y se usa una sola vez.
*/
const oauthTickets =
  new Map();

/*
  Token utilizado para mostrar el usuario
  y completar la verificación sin cookies.
*/
const verificationTickets =
  new Map();

const OAUTH_TICKET_DURATION =
  60_000; // 60 segundos

const VERIFICATION_TICKET_DURATION =
  1000 * 60 * 5; // 5 minutos

// Permite obtener la IP real cuando la app está detrás de Render,
// Cloudflare u otro proxy inverso.
app.set("trust proxy", true);

const httpServer = http.createServer(app);

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

const isProduction =
  process.env.NODE_ENV ===
  "production";

app.use(
  session({
    name: "nebula.sid",

    secret:
      process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    proxy: true,

    rolling: true,

    cookie: {
      httpOnly: true,

      secure:
        isProduction,

      sameSite:
        isProduction
          ? "none"
          : "lax",

      maxAge:
        1000 *
        60 *
        60 *
        24,
    },
  })
);

app.use(
  "/verify-assets",
  express.static(
    path.join(__dirname, "public", "verify")
  )
);

app.get("/verify/:guildId", (request, response) => {
  response.sendFile(
    path.join(
      __dirname,
      "public",
      "verify",
      "index.html"
    )
  );
});

/* =========================================================
   CLIENTE DE DISCORD
   ========================================================= */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

/* =========================================================
   DATOS INTERNOS DEL DASHBOARD
   ========================================================= */

const statistics = {
  commands: 0,
  messages: 0,
};

const startedAt = Date.now();
/*
  Configuraciones de bienvenida.
  Se guardan en archivos JSON dentro de server/data/welcome.
*/
const welcomeConfigs = new Map();
const WELCOME_FOLDER = path.join(
  process.cwd(),
  "server",
  "data",
  "welcome"
);
const VERIFY_FOLDER = path.join(
  process.cwd(),
  "server",
  "data",
  "verify"
);

if (!fs.existsSync(VERIFY_FOLDER)) {
  fs.mkdirSync(VERIFY_FOLDER, {
    recursive: true,
  });
}

if (!fs.existsSync(WELCOME_FOLDER)) {
  fs.mkdirSync(WELCOME_FOLDER, {
    recursive: true,
  });
}
function saveWelcomeConfig(guildId, config) {
  const file = path.join(
    WELCOME_FOLDER,
    `${guildId}.json`
  );

  fs.writeFileSync(
    file,
    JSON.stringify(config, null, 2)
  );
}
function loadWelcomeConfig(guildId) {
  const file = path.join(
    WELCOME_FOLDER,
    `${guildId}.json`
  );

  if (!fs.existsSync(file)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}
function getWelcomeConfig(guildId) {
  const memoryConfig = welcomeConfigs.get(guildId);

  if (memoryConfig) {
    return memoryConfig;
  }

  try {
    const savedConfig = loadWelcomeConfig(guildId);

    if (savedConfig) {
      welcomeConfigs.set(guildId, savedConfig);
      return savedConfig;
    }
  } catch (error) {
    console.error(
      `No se pudo leer la bienvenida de ${guildId}:`,
      error
    );
  }

  return null;
}
function saveVerifyConfig(guildId, config) {
  const file = path.join(
    VERIFY_FOLDER,
    `${guildId}.json`
  );

  fs.writeFileSync(
    file,
    JSON.stringify(config, null, 2),
    "utf8"
  );
}

function loadVerifyConfig(guildId) {
  const file = path.join(
    VERIFY_FOLDER,
    `${guildId}.json`
  );

  if (!fs.existsSync(file)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}
function getVerifyConfig(guildId) {
  const defaults =
    getDefaultVerifyConfig();

  try {
    const savedConfig =
      loadVerifyConfig(guildId);

    if (!savedConfig) {
      return defaults;
    }

    return {
      ...defaults,
      ...savedConfig,

      logOptions: {
        ...defaults.logOptions,
        ...(savedConfig.logOptions || {}),
      },

      webAppearance: {
        ...defaults.webAppearance,
        ...(savedConfig.webAppearance || {}),
      },

      security: {
        ...defaults.security,
        ...(savedConfig.security || {}),
      },
    };
  } catch (error) {
    console.error(
      `No se pudo leer la verificación de ${guildId}:`,
      error
    );

    return defaults;
  }
}

/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

function formatUptime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getTotalUsers() {
  if (!client.isReady()) {
    return 0;
  }

  return client.guilds.cache.reduce(
    (total, guild) => total + guild.memberCount,
    0
  );
}

function getDashboardData() {
  const connected = client.isReady();

  return {
    bot: {
      id: connected ? client.user.id : null,

      name: connected
        ? client.user.username
        : "Nebula Bot",

      avatar: connected
        ? client.user.displayAvatarURL({
            extension: "png",
            size: 256,
          })
        : null,

      status: connected ? "online" : "offline",

      latency:
        connected && Number.isFinite(client.ws.ping)
          ? Math.round(client.ws.ping)
          : 0,

      uptime: formatUptime(Date.now() - startedAt),

      version: "2.4.1",
    },

    statistics: {
      servers: connected
        ? client.guilds.cache.size
        : 0,

      users: connected
        ? getTotalUsers()
        : 0,

      commands: statistics.commands,

      messages: statistics.messages,

      uptimePercentage: connected ? 100 : 0,
    },

    system: {
      discordApi: connected,

      /*
        Todavía no hay base de datos,
        por eso aparece desconectada.
      */
      database: false,

      servers: connected,

      dashboard: true,

      logs: true,
    },
  };
}

function emitDashboardUpdate() {
  io.emit(
    "dashboard:update",
    getDashboardData()
  );
}

 function getDefaultWelcomeConfig() {
  return {
    // Bienvenida pública
    enabled: false,
    channelId: "",
    title: "¡Bienvenido al servidor!",
    message: "Hola {user}, bienvenido a **{server}**.",
    color: "#8b5cf6",
    showAvatar: true,

    // Mensaje privado
    dmEnabled: false,
    dmTitle: "¡Bienvenido a {server}!",
    dmMessage:
      "Hola {username}. Gracias por unirte a **{server}**.\n\nEsperamos que disfrutes de la comunidad.",
    dmColor: "#5865f2",
    dmShowAvatar: true,
  };
}
function getDefaultVerifyConfig() {
  return {
    /* =====================================================
       CONFIGURACIÓN GENERAL
       ===================================================== */

    enabled: false,

    verificationChannelId: "",
    logsChannelId: "",
    verifiedRoleId: "",

    /* =====================================================
       MÉTODO DE VERIFICACIÓN
       ===================================================== */

    verificationMethod: "oauth_link",

    /*
      Métodos disponibles:

      oauth_link
      interaction_button
      emoji_reaction
    */

    /* =====================================================
       PANEL DE VERIFICACIÓN
       ===================================================== */

    embedTitle:
      "Verificación del servidor",

    embedDescription:
      "Presioná el botón para verificarte y obtener acceso completo al servidor.",

    embedColor: "#8b5cf6",

  buttonText:
  "Verificar con Discord",

buttonEmoji:
  "✅",

buttonStyle:
  "primary",

reactionEmoji:
  "✅",

/* TEXTOS DEL EMBED */

embedFieldName:
  "📌 Servidor",

embedFieldValue:
  "{server}",

embedFooterText:
  "Nebula Security • Todos los derechos reservados",

/* IMÁGENES DEL EMBED */

embedThumbnailUrl:
  "",

embedImageUrl:
  "",

/* ELEMENTOS VISIBLES */

showBotAvatar:
  true,

showServerIcon:
  true,

showCustomThumbnail:
  false,

showEmbedImage:
  false,

showTimestamp:
  true,

    /* =====================================================
       PERSONALIZACIÓN DEL LOG
       ===================================================== */

    logEmbedTitle:
      "🛡️ Usuario verificado",

    logEmbedDescription:
      "La verificación fue completada correctamente.",

    logEmbedColor: "#22c55e",

    /* =====================================================
       DATOS QUE APARECERÁN EN LOGS
       ===================================================== */

    logOptions: {
      /* Información de Discord */

      avatar: true,
      username: true,
      displayName: true,
      userId: true,
      deliveredRole: true,

      accountCreatedAt: true,
      joinedAt: true,
      verifiedAt: true,
      verificationDuration: true,
      attempts: true,

      banner: true,
      nitro: true,

      /* Información técnica */

      operatingSystem: true,
      browser: true,
      device: true,
      resolution: true,
      language: true,
      timezone: true,

      /* Ubicación aproximada */

      country: true,
      city: true,
      region: true,
      countryCode: true,
      approximateLocalTime: true,

      /* Red */

      fullIp: false,
      ipType: true,
      isp: true,
      asn: true,
      vpn: true,
      proxy: true,
      hosting: true,
      mobileNetwork: true,

      /* Seguridad */

      riskLevel: true,
      trustScore: true,
    },

    /* =====================================================
       APARIENCIA DE LA WEB
       ===================================================== */
webAppearance: {
  /* INFORMACIÓN PRINCIPAL */

  pageName:
    "Trade Room Verification",

  pageDescription:
    "Completá la verificación para acceder al servidor.",

  logoUrl: "",
  backgroundUrl: "",

  /* COLORES */

  primaryColor:
    "#8b5cf6",

  secondaryColor:
    "#6d28d9",

  buttonColor:
    "#7c3aed",

  textColor:
    "#ffffff",

  cardColor:
    "#0f0f1a",

  /* FONDO */

  backgroundType:
    "space",

  backgroundSolidColor:
    "#05050a",

  gradientStart:
    "#05050a",

  gradientEnd:
    "#160c2b",

  spaceBackground: true,

  /* ANIMACIONES */

  animationsEnabled: true,

  particlesEnabled: true,
  glowEnabled: true,
  fadeEnabled: true,
  hoverEnabled: true,
  cursorGlowEnabled: false,
  buttonAnimationEnabled: true,
  logoAnimationEnabled: true,

  particleCount: 100,
  glowIntensity: 80,

  /* TARJETA */

  cardBlur: 18,
  cardOpacity: 88,
  cardRadius: 24,
  cardShadow: 80,

  /* BOTÓN */

  verifyButtonText:
    "Verificar con Discord",

  verifyButtonIcon:
    "discord",

  verifyButtonSize:
    "large",

  verifyButtonRadius: 14,

  /* SONIDOS */

  verificationSound: false,
  errorSound: false,
  openingSound: false,

  soundVolume: 50,
},

     /* =====================================================
       SEGURIDAD
       ===================================================== */

    security: {
      detectVpn: false,
      detectProxy: false,
      detectTor: false,
      detectAltAccounts: false,

      minimumAccountAgeEnabled: false,
      minimumAccountAgeDays: 7,

      blockWithoutAvatar: false,
      blockWithoutBanner: false,

      allowReverification: true,

      notifySecurityFailure: true,
    },
  };
}

registerVerifyRoutes({
  app,
  client,
  getDefaultVerifyConfig,
  getVerifyConfig,
  saveVerifyConfig,
  verificationTickets,
});

registerAuthRoutes({
  app,
  client,
  oauthTickets,

  oauthTicketDuration:
    OAUTH_TICKET_DURATION,

  verificationTickets,

  verificationTicketDuration:
    VERIFICATION_TICKET_DURATION,
});

function replaceWelcomeVariables(text, member) {
  const displayName =
    member.displayName ||
    member.user.globalName ||
    member.user.username;

  return String(text)
    .replaceAll("{user}", `<@${member.id}>`)
    .replaceAll("{mention}", `<@${member.id}>`)
    .replaceAll("{username}", member.user.username)
    .replaceAll("{displayname}", displayName)
    .replaceAll("{userid}", member.id)
    .replaceAll("{server}", member.guild.name)
    .replaceAll("{serverid}", member.guild.id)
    .replaceAll(
      "{members}",
      member.guild.memberCount.toLocaleString("es-AR")
    )
    .replaceAll(
      "{membercount}",
      member.guild.memberCount.toLocaleString("es-AR")
    )
    .replaceAll(
      "{joindate}",
      new Date().toLocaleDateString("es-AR")
    );
}
/* =========================================================
   EVENTOS DE DISCORD
   ========================================================= */

client.once(
  Events.ClientReady,
  readyClient => {
    console.log(
      "===================================="
    );

    console.log(
      `BOT CONECTADO: ${readyClient.user.tag}`
    );

    console.log(
      `SERVIDORES: ${readyClient.guilds.cache.size}`
    );

    console.log(
      "===================================="
    );

    readyClient.user.setActivity(
      "Administrando servidores",
      {
        type: ActivityType.Watching,
      }
    );
for (const guild of readyClient.guilds.cache.values()) {
  try {
    const savedConfig = loadWelcomeConfig(guild.id);

    if (savedConfig) {
      welcomeConfigs.set(guild.id, savedConfig);

      console.log(
        `Configuración cargada: ${guild.name}`
      );
    }
  } catch (error) {
    console.error(
      `Error cargando configuración de ${guild.name}:`,
      error
    );
  }
}
    emitDashboardUpdate();
  }
);

client.on(
  Events.GuildCreate,
  guild => {
    console.log(
      `Nuevo servidor conectado: ${guild.name}`
    );

    emitDashboardUpdate();
  }
);

client.on(
  Events.GuildDelete,
  guild => {
    console.log(
      `Bot eliminado del servidor: ${guild.name}`
    );

    welcomeConfigs.delete(guild.id);


    emitDashboardUpdate();
  }
);

/* =========================================================
   EVENTO DE BIENVENIDA
   ========================================================= */
client.on(Events.GuildMemberAdd, async member => {
  try {
   const config = getWelcomeConfig(member.guild.id);

    if (!config) {
      return;
    }

    /*
      BIENVENIDA PÚBLICA
    */

    if (config.enabled && config.channelId) {
      const channel = member.guild.channels.cache.get(
        config.channelId
      );

      if (channel?.isTextBased()) {
        const publicEmbed = new EmbedBuilder()
          .setColor(config.color)
          .setTitle(
            replaceWelcomeVariables(config.title, member)
          )
          .setDescription(
            replaceWelcomeVariables(config.message, member)
          )
          .setFooter({
            text:
              `${member.guild.name} · ` +
              `Miembro número ${member.guild.memberCount}`,
          })
          .setTimestamp();

        if (config.showAvatar) {
          publicEmbed.setThumbnail(
            member.user.displayAvatarURL({
              extension: "png",
              size: 256,
            })
          );
        }

        await channel.send({
          content: `<@${member.id}>`,
          embeds: [publicEmbed],
        });

        console.log(
          `Bienvenida pública enviada a ${member.user.tag}`
        );
      }
    }

    /*
      MENSAJE PRIVADO
    */

    if (config.dmEnabled) {
      const dmEmbed = new EmbedBuilder()
        .setColor(config.dmColor)
        .setTitle(
          replaceWelcomeVariables(config.dmTitle, member)
        )
        .setDescription(
          replaceWelcomeVariables(config.dmMessage, member)
        )
        .setFooter({
          text: member.guild.name,
        })
        .setTimestamp();

      if (config.dmShowAvatar) {
        dmEmbed.setThumbnail(
          member.user.displayAvatarURL({
            extension: "png",
            size: 256,
          })
        );
      }

      try {
        await member.user.send({
          embeds: [dmEmbed],
        });

        console.log(
          `Mensaje privado enviado a ${member.user.tag}`
        );
      } catch (dmError) {
        /*
          No detenemos el bot si el usuario no puede recibir MD.
        */
        console.log(
          `No se pudo enviar MD a ${member.user.tag}: ` +
          dmError.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error procesando la bienvenida:",
      error
    );
  }
});
/* =========================================================
   BOTÓN DE VERIFICACIÓN
   ========================================================= */

client.on(
  Events.InteractionCreate,
  async interaction => {
    if (!interaction.isButton()) {
      return;
    }

    if (
      !interaction.customId.startsWith(
        "nebula_verify:"
      )
    ) {
      return;
    }

    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      if (!interaction.guild) {
        await interaction.editReply({
          content:
            "❌ Esta verificación solo funciona dentro de un servidor.",
        });

        return;
      }

      const guildIdFromButton =
        interaction.customId
          .split(":")[1];

      if (
        !guildIdFromButton ||
        guildIdFromButton !==
          interaction.guild.id
      ) {
        await interaction.editReply({
          content:
            "❌ Este botón no pertenece a este servidor.",
        });

        return;
      }

      const config =
        getVerifyConfig(
          interaction.guild.id
        );

      if (!config.enabled) {
        await interaction.editReply({
          content:
            "❌ El sistema de verificación está desactivado.",
        });

        return;
      }

      if (!config.verifiedRoleId) {
        await interaction.editReply({
          content:
            "❌ No hay ningún rol configurado.",
        });

        return;
      }

      const member =
        await interaction.guild.members
          .fetch(
            interaction.user.id
          );

      const role =
        interaction.guild.roles.cache
          .get(
            config.verifiedRoleId
          );

      if (!role) {
        await interaction.editReply({
          content:
            "❌ El rol configurado ya no existe.",
        });

        return;
      }

      if (
        member.roles.cache.has(
          role.id
        ) &&
        config.security
          ?.allowReverification ===
          false
      ) {
        await interaction.editReply({
          content:
            `✅ Ya estás verificado y tenés el rol **${role.name}**.`,
        });

        return;
      }

      /*
        Generamos un token aleatorio para
        identificar al usuario sin OAuth
        y sin depender de cookies.
      */

      const verificationToken =
        crypto
          .randomBytes(48)
          .toString("hex");

      const createdAt =
        Date.now();

      const expiresAt =
        createdAt +
        VERIFICATION_TICKET_DURATION;

      /*
        Eliminamos tokens anteriores de este
        usuario para este mismo servidor.
      */

      for (
        const [
          savedToken,
          savedTicket,
        ] of verificationTickets.entries()
      ) {
        if (
          String(
            savedTicket?.guildId
          ) ===
            String(
              interaction.guild.id
            ) &&
          String(
            savedTicket?.userId
          ) ===
            String(
              interaction.user.id
            )
        ) {
          verificationTickets.delete(
            savedToken
          );
        }
      }

      const verificationTicket = {
        token:
          verificationToken,

        guildId:
          interaction.guild.id,

        guildName:
          interaction.guild.name,

        guildIcon:
          interaction.guild.iconURL({
            extension: "png",
            size: 256,
          }),

        userId:
          interaction.user.id,

        username:
          interaction.user.username,

        globalName:
          interaction.user.globalName ||
          interaction.user.username,

        displayName:
          member.displayName ||
          interaction.user.globalName ||
          interaction.user.username,

        avatar:
          interaction.user
            .displayAvatarURL({
              extension: "png",
              size: 256,
            }),

        createdAt,

        createdAtIso:
          new Date(
            createdAt
          ).toISOString(),

        expiresAt,

        expiresAtIso:
          new Date(
            expiresAt
          ).toISOString(),

        source:
          "discord_interaction",

        used:
          false,
      };

      verificationTickets.set(
        verificationToken,
        verificationTicket
      );

      const baseUrl =
        String(
          process.env.PUBLIC_URL ||
          "http://localhost:3000"
        ).replace(
          /\/+$/,
          ""
        );

      const verificationUrl =
        `${baseUrl}/verify/` +
        `${encodeURIComponent(
          interaction.guild.id
        )}` +
        `?verificationToken=` +
        encodeURIComponent(
          verificationToken
        );

      const continueButton =
        new ButtonBuilder()
          .setLabel(
            "Continuar verificación"
          )
          .setEmoji("🛡️")
          .setStyle(
            ButtonStyle.Link
          )
          .setURL(
            verificationUrl
          );

      const row =
        new ActionRowBuilder()
          .addComponents(
            continueButton
          );

      const verificationEmbed =
        new EmbedBuilder()
          .setColor(
            config.embedColor ||
            "#8b5cf6"
          )
          .setTitle(
            "🛡️ Verificación preparada"
          )
          .setDescription(
            [
              `Hola **${member.displayName}**.`,
              "",
              "Tu enlace privado está listo.",
              "Presioná el botón de abajo para continuar.",
              "",
              "El enlace es personal, temporal y solo puede utilizarse una vez.",
            ].join("\n")
          )
          .setThumbnail(
            interaction.user
              .displayAvatarURL({
                extension: "png",
                size: 256,
              })
          )
          .addFields({
            name:
              "Servidor",

            value:
              interaction.guild.name,

            inline:
              true,
          })
          .setFooter({
            text:
              "Nebula Security Center • No compartas este enlace",
          })
          .setTimestamp();

      await interaction.editReply({
        embeds: [
          verificationEmbed,
        ],

        components: [
          row,
        ],
      });

      console.log(
        "Enlace privado de verificación generado:",
        {
          guildId:
            interaction.guild.id,

          userId:
            interaction.user.id,

          expiresAt:
            verificationTicket
              .expiresAtIso,
        }
      );
    } catch (error) {
      console.error(
        "Error generando enlace privado de verificación:",
        error
      );

      const message =
        "❌ No se pudo preparar la verificación. Volvé a intentarlo.";

      if (
        interaction.deferred ||
        interaction.replied
      ) {
        await interaction
          .editReply({
            content:
              message,

            embeds:
              [],

            components:
              [],
          })
          .catch(
            () => {}
          );
      } else {
        await interaction
          .reply({
            content:
              message,

            ephemeral:
              true,
          })
          .catch(
            () => {}
          );
      }
    }
  }
);

/* =========================================================
   FRONTEND COMPILADO CON VITE
   ========================================================= */

const frontendDistPath =
  path.join(
    process.cwd(),
    "dist"
  );

app.use(
  express.static(
    frontendDistPath
  )
);

app.get("/", (request, response) => {
  response.sendFile(
    path.join(
      frontendDistPath,
      "index.html"
    )
  );
});

/*
  Permite abrir rutas del dashboard directamente
  sin recibir un error 404.
*/
app.get(
  /^\/(?!api|auth|verify|verify-assets|socket\.io).*/,
  (request, response) => {
    response.sendFile(
      path.join(
        frontendDistPath,
        "index.html"
      )
    );
  }
);
/* =========================================================
   API DEL DASHBOARD
   ========================================================= */

app.get(
  "/api/dashboard",
  (request, response) => {
    response.json({
      success: true,
      data: getDashboardData(),
    });
  }
);

app.get(
  "/api/bot/status",
  (request, response) => {
    response.json({
      success: true,
      data: getDashboardData().bot,
    });
  }
);

/* =========================================================
   LISTA DE SERVIDORES
   ========================================================= */

app.get(
  "/api/servers",
  (request, response) => {
    if (!client.isReady()) {
      return response
        .status(503)
        .json({
          success: false,

          message:
            "El bot todavía no está conectado con Discord",

          data: [],
        });
    }

    const guilds =
      client.guilds.cache.map(guild => ({
        id: guild.id,

        name: guild.name,

        members: guild.memberCount,

        icon: guild.iconURL({
          extension: "png",
          size: 128,
        }),
      }));

    response.json({
      success: true,
      data: guilds,
    });
  }
);

/* =========================================================
   INFORMACIÓN DE UN SERVIDOR
   ========================================================= */

app.get(
  "/api/servers/:guildId",
  async (request, response) => {
    try {
      if (!client.isReady()) {
        return response
          .status(503)
          .json({
            success: false,

            message:
              "El bot todavía no está conectado con Discord",
          });
      }

      const { guildId } =
        request.params;

      const guild =
        client.guilds.cache.get(guildId);

      if (!guild) {
        return response
          .status(404)
          .json({
            success: false,

            message:
              "El servidor no existe o el bot no está dentro de él",
          });
      }

      const roles =
        guild.roles.cache
          .filter(
            role =>
              role.name !== "@everyone"
          )
          .sort(
            (roleA, roleB) =>
              roleB.position -
              roleA.position
          )
          .map(role => ({
            id: role.id,

            name: role.name,

            color: role.hexColor,

            members: role.members.size,

            position: role.position,
          }))
          .slice(0, 10);

      const channels =
        guild.channels.cache
          .filter(
            channel =>
              !channel.isThread()
          )
          .map(channel => ({
            id: channel.id,

            name: channel.name,

            type: channel.type,

            position: channel.position,
          }))
          .sort(
            (channelA, channelB) =>
              channelA.position -
              channelB.position
          )
          .slice(0, 15);

      const serverData = {
        id: guild.id,

        name: guild.name,

        icon: guild.iconURL({
          extension: "png",
          size: 256,
        }),

        banner: guild.bannerURL({
          extension: "png",
          size: 1024,
        }),

        members: guild.memberCount,

        createdAt: guild.createdAt,

        ownerId: guild.ownerId,

        statistics: {
          roles:
            guild.roles.cache.size,

          channels:
            guild.channels.cache.size,

          emojis:
            guild.emojis.cache.size,

          stickers:
            guild.stickers.cache.size,
        },

        roles,

        channels,
      };

      response.json({
        success: true,
        data: serverData,
      });
    } catch (error) {
      console.error(
        "Error obteniendo servidor:"
      );

      console.error(error);

      response
        .status(500)
        .json({
          success: false,

          message:
            "Ocurrió un error obteniendo el servidor",
        });
    }
  }
);

/* =========================================================
   CANALES DE TEXTO DEL SERVIDOR
   ========================================================= */

app.get(
  "/api/servers/:guildId/text-channels",
  (request, response) => {
    if (!client.isReady()) {
      return response
        .status(503)
        .json({
          success: false,

          message:
            "El bot todavía no está conectado",
        });
    }

    const { guildId } =
      request.params;

    const guild =
      client.guilds.cache.get(guildId);

    if (!guild) {
      return response
        .status(404)
        .json({
          success: false,

          message:
            "Servidor no encontrado",
        });
    }

    const channels =
      guild.channels.cache
        .filter(
          channel =>
            channel.type ===
            ChannelType.GuildText
        )
        .sort(
          (channelA, channelB) =>
            channelA.position -
            channelB.position
        )
        .map(channel => ({
          id: channel.id,

          name: channel.name,
        }));

    response.json({
      success: true,
      data: channels,
    });
  }
);

/* =========================================================
   OBTENER CONFIGURACIÓN DE BIENVENIDA
   ========================================================= */

app.get(
  "/api/servers/:guildId/welcome",
  (request, response) => {
    const { guildId } =
      request.params;

    if (
      !client.guilds.cache.has(guildId)
    ) {
      return response
        .status(404)
        .json({
          success: false,

          message:
            "Servidor no encontrado",
        });
    }

   const config =
  getWelcomeConfig(guildId) ||
  getDefaultWelcomeConfig();
  
    response.json({
      success: true,
      data: config,
    });
  }
);

/* =========================================================
   GUARDAR CONFIGURACIÓN DE BIENVENIDA
   ========================================================= */

app.post(
  "/api/servers/:guildId/welcome",
  (request, response) => {
    const { guildId } =
      request.params;

    const guild =
      client.guilds.cache.get(guildId);

    if (!guild) {
      return response
        .status(404)
        .json({
          success: false,

          message:
            "Servidor no encontrado",
        });
    }

  const {
  enabled,
  channelId,
  title,
  message,
  color,
  showAvatar,

  dmEnabled,
  dmTitle,
  dmMessage,
  dmColor,
  dmShowAvatar,
} = request.body;

    if (
      Boolean(enabled) &&
      !channelId
    ) {
      return response
        .status(400)
        .json({
          success: false,

          message:
            "Tenés que seleccionar un canal",
        });
    }

    if (channelId) {
      const selectedChannel =
        guild.channels.cache.get(
          String(channelId)
        );

      if (
        !selectedChannel ||
        selectedChannel.type !==
          ChannelType.GuildText
      ) {
        return response
          .status(400)
          .json({
            success: false,

            message:
              "El canal seleccionado no es válido",
          });
      }
    }

  const validColor =
  /^#[0-9A-F]{6}$/i.test(String(color));

const validDmColor =
  /^#[0-9A-F]{6}$/i.test(String(dmColor));

 const config = {
  enabled: Boolean(enabled),
  channelId: String(channelId || ""),
  title: String(
    title || "¡Bienvenido al servidor!"
  ).slice(0, 256),
  message: String(
    message ||
      "Hola {user}, bienvenido a **{server}**."
  ).slice(0, 2000),
  color: validColor
    ? String(color)
    : "#8b5cf6",
  showAvatar: Boolean(showAvatar),
  dmEnabled: Boolean(dmEnabled),
  dmTitle: String(
    dmTitle || "¡Bienvenido a {server}!"
  ).slice(0, 256),
  dmMessage: String(
    dmMessage ||
      "Hola {username}. Gracias por unirte a **{server}**."
  ).slice(0, 2000),
  dmColor: validDmColor
    ? String(dmColor)
    : "#5865f2",
  dmShowAvatar: Boolean(dmShowAvatar),
};

welcomeConfigs.set(guildId, config);

saveWelcomeConfig(
  guildId,
  config
);

console.log(
  `Bienvenida guardada para ${guild.name}`
);

response.json({
  success: true,
  message: "Configuración guardada correctamente",
  data: config,
});
  }
);
/* =========================================================
   ENVIAR MENSAJE DE PRUEBA
   ========================================================= */

app.post(
  "/api/servers/:guildId/welcome/test",
  async (request, response) => {
    try {
      const { guildId } =
        request.params;

      const guild =
        client.guilds.cache.get(
          guildId
        );

      if (!guild) {
        return response
          .status(404)
          .json({
            success: false,

            message:
              "Servidor no encontrado",
          });
      }

     const config =
  getWelcomeConfig(guildId);

      if (
        !config ||
        !config.channelId
      ) {
        return response
          .status(400)
          .json({
            success: false,

            message:
              "Primero tenés que guardar la configuración",
          });
      }

      const channel =
        guild.channels.cache.get(
          config.channelId
        );

      if (
        !channel ||
        !channel.isTextBased()
      ) {
        return response
          .status(400)
          .json({
            success: false,

            message:
              "El canal configurado no es válido",
          });
      }

      const title =
        String(config.title)
          .replaceAll(
            "{user}",
            "@Usuario"
          )
          .replaceAll(
            "{username}",
            "Usuario"
          )
          .replaceAll(
            "{server}",
            guild.name
          )
          .replaceAll(
            "{members}",
            guild.memberCount.toLocaleString(
              "es-AR"
            )
          );

      const message =
        String(config.message)
          .replaceAll(
            "{user}",
            "@Usuario"
          )
          .replaceAll(
            "{username}",
            "Usuario"
          )
          .replaceAll(
            "{server}",
            guild.name
          )
          .replaceAll(
            "{members}",
            guild.memberCount.toLocaleString(
              "es-AR"
            )
          );

      const embed =
        new EmbedBuilder()
          .setColor(config.color)
          .setTitle(title)
          .setDescription(message)
          .setFooter({
            text:
              `${guild.name} · ` +
              `Mensaje de prueba`,
          })
          .setTimestamp();

      await channel.send({
        embeds: [embed],
      });

      response.json({
        success: true,

        message:
          "Mensaje de prueba enviado correctamente",
      });
    } catch (error) {
      console.error(
        "Error enviando prueba:"
      );

      console.error(error);

      response
        .status(500)
        .json({
          success: false,

          message:
            "No se pudo enviar el mensaje de prueba",
        });
    }
  }
);

/* =========================================================
   SOCKET.IO
   ========================================================= */

io.on(
  "connection",
  socket => {
    console.log(
      `Dashboard conectado: ${socket.id}`
    );

    socket.emit(
      "dashboard:update",
      getDashboardData()
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          `Dashboard desconectado: ${socket.id}`
        );
      }
    );
  }
);

/*
  Actualiza el dashboard cada cinco segundos.
*/
setInterval(
  () => {
    emitDashboardUpdate();
  },
  5000
);

/* =========================================================
   MANEJO DE ERRORES DEL BOT
   ========================================================= */

client.on(
  Events.Error,
  error => {
    console.error(
      "Error del cliente de Discord:"
    );

    console.error(error);
  }
);

client.on(
  Events.Warn,
  warning => {
    console.warn(
      "Advertencia de Discord:"
    );

    console.warn(warning);
  }
);

process.on(
  "unhandledRejection",
  error => {
    console.error(
      "Promesa rechazada sin controlar:"
    );

    console.error(error);
  }
);

process.on(
  "uncaughtException",
  error => {
    console.error(
      "Error inesperado:"
    );

    console.error(error);
  }
);
/*
  Elimina códigos OAuth vencidos cada minuto.
*/

/*
  Elimina automáticamente los códigos
  y tokens vencidos.
*/
setInterval(() => {
  const now =
    Date.now();

  for (
    const [
      authCode,
      ticket,
    ] of oauthTickets.entries()
  ) {
    if (
      !ticket ||
      ticket.expiresAt <= now
    ) {
      oauthTickets.delete(
        authCode
      );
    }
  }

  for (
    const [
      verificationToken,
      ticket,
    ] of verificationTickets.entries()
  ) {
    if (
      !ticket ||
      ticket.expiresAt <= now
    ) {
      verificationTickets.delete(
        verificationToken
      );
    }
  }
}, 60_000);

/* =========================================================
   INICIO DEL SERVIDOR
   ========================================================= */

httpServer.listen(
  PORT,
  () => {
    console.log(
      "===================================="
    );

    console.log(
      "NEBULA API INICIADA"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "===================================="
    );
  }
);

/* =========================================================
   INICIO DEL BOT
   ========================================================= */

if (!process.env.DISCORD_TOKEN) {
  console.error(
    "Falta DISCORD_TOKEN en las variables de entorno"
  );
} else {
  client
    .login(
      process.env.DISCORD_TOKEN
    )
    .catch(error => {

  console.error(
        "No se pudo conectar el bot con Discord:"
      );

      console.error(
        error.message
      );
    });
}
