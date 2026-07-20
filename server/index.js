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
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  SlashCommandBuilder,
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
   COMANDO /KEYBOT
   ========================================================= */

const keyBotCommand =
  new SlashCommandBuilder()
    .setName(
      "keybot"
    )
    .setDescription(
      "Administrar las licencias de Nebula."
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    )
    .addSubcommand(
      subcommand =>
        subcommand
          .setName(
            "generate"
          )
          .setDescription(
            "Generar una nueva licencia."
          )
          .addIntegerOption(
            option =>
              option
                .setName(
                  "dias"
                )
                .setDescription(
                  "Cantidad de días."
                )
                .setMinValue(
                  0
                )
                .setRequired(
                  false
                )
          )
          .addIntegerOption(
            option =>
              option
                .setName(
                  "horas"
                )
                .setDescription(
                  "Cantidad de horas."
                )
                .setMinValue(
                  0
                )
                .setMaxValue(
                  23
                )
                .setRequired(
                  false
                )
          )
          .addIntegerOption(
            option =>
              option
                .setName(
                  "minutos"
                )
                .setDescription(
                  "Cantidad de minutos."
                )
                .setMinValue(
                  0
                )
                .setMaxValue(
                  59
                )
                .setRequired(
                  false
                )
          )
          .addIntegerOption(
            option =>
              option
                .setName(
                  "segundos"
                )
                .setDescription(
                  "Cantidad de segundos."
                )
                .setMinValue(
                  0
                )
                .setMaxValue(
                  59
                )
                .setRequired(
                  false
                )
          )
          .addBooleanOption(
            option =>
              option
                .setName(
                  "permanente"
                )
                .setDescription(
                  "Crear una licencia sin vencimiento."
                )
                .setRequired(
                  false
                )
          )
          .addIntegerOption(
            option =>
              option
                .setName(
                  "cantidad"
                )
                .setDescription(
                  "Cantidad de Keys que se generarán."
                )
                .setMinValue(
                  1
                )
                .setMaxValue(
                  10
                )
                .setRequired(
                  false
                )
          )
          .addStringOption(
            option =>
              option
                .setName(
                  "descripcion"
                )
                .setDescription(
                  "Descripción opcional de la licencia."
                )
                .setMaxLength(
                  500
                )
                .setRequired(
                  false
                )
          )

.addUserOption(
  option =>
    option
      .setName(
        "entregar_a"
      )
      .setDescription(
        "Usuario que recibirá la licencia por mensaje privado."
      )
      .setRequired(
        false
      )
)

    );

async function registerKeyBotCommand(
  guild
) {
  try {
    const commands =
      await guild.commands.fetch();

    const existingCommand =
      commands.find(
        command =>
          command.name ===
          "keybot"
      );

    if (existingCommand) {
      await guild.commands.edit(
        existingCommand.id,
        keyBotCommand.toJSON()
      );

      console.log(
        `Comando /keybot actualizado en ${guild.name}`
      );

      return;
    }

    await guild.commands.create(
      keyBotCommand.toJSON()
    );

    console.log(
      `Comando /keybot registrado en ${guild.name}`
    );

  } catch (error) {
    console.error(
      `No se pudo registrar /keybot en ${guild.name}:`,
      error
    );
  }
}


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

const TOKENS_FOLDER = path.join(
  process.cwd(),
  "server",
  "data",
  "tokens"
);

const LICENSES_FOLDER = path.join(
  process.cwd(),
  "server",
  "data",
  "licenses"
);

const TOKENS_FILE = path.join(
  TOKENS_FOLDER,
  "tokens.json"
);

if (!fs.existsSync(VERIFY_FOLDER)) {
  fs.mkdirSync(VERIFY_FOLDER, {
    recursive: true,
  });
}

if (!fs.existsSync(TOKENS_FOLDER)) {
  fs.mkdirSync(TOKENS_FOLDER, {
    recursive: true,
  });
}

if (!fs.existsSync(LICENSES_FOLDER)) {
  fs.mkdirSync(LICENSES_FOLDER, {
    recursive: true,
  });
}

if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(
    TOKENS_FILE,
    "[]",
    "utf8"
  );
}

if (!fs.existsSync(WELCOME_FOLDER)) {
  fs.mkdirSync(WELCOME_FOLDER, {
    recursive: true,
  });
}

function loadTokens() {
  try {
    return JSON.parse(
      fs.readFileSync(
        TOKENS_FILE,
        "utf8"
      )
    );
  } catch (error) {
    console.error(
      "Error cargando tokens:",
      error
    );

    return [];
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(
    TOKENS_FILE,
    JSON.stringify(tokens, null, 2),
    "utf8"
  );
}

function generateLicenseKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const random = (length) => {
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  };

  return `NEBULA-${random(4)}-${random(4)}-${random(4)}`;
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

function getDefaultLicenseConfig() {
  return {
    logsChannelId: "",
    creation: true,
    activation: true,
    expiration: true,
    deletion: true,
    revocation: true,
  };
}

function saveLicenseConfig(
  guildId,
  config
) {
  const file = path.join(
    LICENSES_FOLDER,
    `${guildId}.json`
  );

  fs.writeFileSync(
    file,
    JSON.stringify(
      config,
      null,
      2
    ),
    "utf8"
  );
}

function loadLicenseConfig(
  guildId
) {
  const file = path.join(
    LICENSES_FOLDER,
    `${guildId}.json`
  );

  if (!fs.existsSync(file)) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(
      file,
      "utf8"
    )
  );
}

function getLicenseConfig(
  guildId
) {
  const defaults =
    getDefaultLicenseConfig();

  try {
    const savedConfig =
      loadLicenseConfig(
        guildId
      );

    if (!savedConfig) {
      return defaults;
    }

    return {
      ...defaults,
      ...savedConfig,
    };
  } catch (error) {
    console.error(
      `No se pudo leer la configuración de licencias de ${guildId}:`,
      error
    );

    return defaults;
  }
}

async function sendLicenseLog(
  guildId,
  eventType,
  license,
  extraData = {}
) {
  try {
    if (!guildId) {
      return false;
    }

    const guild =
      client.guilds.cache.get(
        String(guildId)
      );

    if (!guild) {
      console.log(
        `No se encontró el servidor ${guildId} para enviar el log.`
      );

      return false;
    }

    const config =
      getLicenseConfig(
        guild.id
      );

    if (!config.logsChannelId) {
      return false;
    }

    const eventEnabled = {
      creation:
        config.creation,

      activation:
        config.activation,

      expiration:
        config.expiration,

      deletion:
        config.deletion,

      revocation:
        config.revocation,
    };

    if (
      eventEnabled[eventType] !==
      true
    ) {
      return false;
    }

    const channel =
      guild.channels.cache.get(
        config.logsChannelId
      );

    if (
      !channel ||
      !channel.isTextBased()
    ) {
      console.log(
        `El canal de logs de licencias no es válido en ${guild.name}.`
      );

      return false;
    }

    const eventStyles = {
      creation: {
        title:
          "🔑 Licencia creada",

        color:
          "#ffffff",

        description:
          "Se creó una nueva licencia.",
      },

      activation: {
        title:
          "✅ Licencia activada",

        color:
          "#22c55e",

        description:
          "Una licencia fue activada correctamente.",
      },

      expiration: {
        title:
          "⌛ Licencia expirada",

        color:
          "#f59e0b",

        description:
          "Una licencia llegó a su fecha de vencimiento.",
      },

      deletion: {
        title:
          "🗑️ Licencia eliminada",

        color:
          "#ef4444",

        description:
          "Una licencia fue eliminada del sistema.",
      },

      revocation: {
        title:
          "🚫 Licencia revocada",

        color:
          "#dc2626",

        description:
          "Una licencia fue revocada.",
      },
    };

    const style =
      eventStyles[eventType];

    if (!style) {
      return false;
    }

    const permanent =
      license?.permanent === true ||
      !license?.expiresAt;

    const expirationText =
      permanent
        ? "Permanente"
        : new Date(
            Number(
              license.expiresAt
            )
          ).toLocaleString(
            "es-AR"
          );

    const createdBy =
      license?.createdBy
        ?.displayName ||
      license?.createdBy
        ?.username ||
      extraData.createdBy ||
      "Administrador";

const sourceTypes = {
  dashboard: {
    name:
      "🖥️ Dashboard Web",

    command: "",
  },

  discord_command: {
    name:
      "🤖 Comando de Discord",

    command:
      extraData.command ||
      "/keybot",
  },

  api: {
    name:
      "🌐 API",

    command: "",
  },

  system: {
    name:
      "⚙️ Sistema automático",

    command: "",
  },
};

const source =
  sourceTypes[
    extraData.source
  ] ||
  sourceTypes.dashboard;

const sourceText =
  source.command
    ? `${source.name}\nComando: \`${source.command}\``
    : source.name;


    const embed =
      new EmbedBuilder()
        .setColor(
          style.color
        )
        .setTitle(
          style.title
        )
        .setDescription(
          style.description
        )
        .addFields(
  {
    name:
      "📍 Origen",

    value:
      sourceText,

    inline:
      true,
  },

  {
    name:
      "🏠 Servidor",

    value:
      `${guild.name}\n\`${guild.id}\``,

    inline:
      true,
  },

  {
    name:
      "🔐 Clave",

    value:
      `\`${license?.key || "Sin datos"}\``,

    inline:
      false,
  },

          {
            name:
              "📊 Estado",

            value:
              String(
                license?.status ||
                "Sin datos"
              ),

            inline:
              true,
          },

          {
            name:
              "⏳ Vencimiento",

            value:
              expirationText,

            inline:
              true,
          },

          {
            name:
              "👤 Creada por",

            value:
              createdBy,

            inline:
              true,
          },

          {
            name:
              "🆔 ID de licencia",

            value:
              `\`${license?.id || "Sin datos"}\``,

            inline:
              false,
          }
        )
        .setFooter({
          text:
            `${guild.name} • Sistema de Licencias`,
        })
        .setTimestamp();

    if (
      license?.description
    ) {
      embed.addFields({
        name:
          "📝 Descripción",

        value:
          String(
            license.description
          ).slice(
            0,
            1024
          ),

        inline:
          false,
      });
    }

    if (
      eventType ===
      "activation"
    ) {
      embed.addFields(
        {
          name:
            "👤 Activada por",

          value:
            license
              ?.activatedDisplayName ||
            license
              ?.activatedUsername ||
            extraData.activatedBy ||
            "Usuario",

          inline:
            true,
        },

        {
          name:
            "🆔 Usuario de Discord",

          value:
            license
              ?.activatedBy
              ? `<@${license.activatedBy}>`
              : "Sin datos",

          inline:
            true,
        }
      );

      if (
        license?.activatedAvatar
      ) {
        embed.setThumbnail(
          license
            .activatedAvatar
        );
      }
    }

    if (
      extraData.reason
    ) {
      embed.addFields({
        name:
          "📌 Motivo",

        value:
          String(
            extraData.reason
          ).slice(
            0,
            1024
          ),

        inline:
          false,
      });
    }

    await channel.send({
      embeds: [
        embed,
      ],
    });

    return true;

  } catch (error) {
    console.error(
      "Error enviando log de licencia:",
      error
    );

    return false;
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

/* =====================================================
   MENSAJE PRIVADO DEL BOTÓN DE INTERACCIÓN
   ===================================================== */

interactionTitle:
  "🔒 Verificá tu cuenta",

interactionMessage:
  [
    "¡Hola {mention}! 👋",
    "",
    "Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.",
    "",
    "El enlace es personal y solo puede utilizarse una vez.",
    "",
    "Si no solicitaste esto, ignorá este mensaje.",
  ].join("\n"),

interactionColor:
  "#8b5cf6",

interactionImage:
  "",

interactionButtonEmoji:
  "🛡️",

interactionButtonText:
  "Continuar verificación",

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

     detectVpnLogChannelId: "",
     detectProxyLogChannelId: "",
     detectTorLogChannelId: "",
     detectHostingLogChannelId: "",
     detectAltAccountsLogChannelId: "",
     blockWithoutAvatarLogChannelId: "",
     blockWithoutBannerLogChannelId: "",

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
  resolveDynamicVariables,
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
/* =========================================================
   RESOLVEDOR GENERAL DE VARIABLES
   ========================================================= */

function formatRelativeTime(date, now = new Date()) {
  if (!(date instanceof Date)) {
    return "Sin datos";
  }

  const difference =
    Math.max(
      0,
      now.getTime() - date.getTime()
    );

  const totalMinutes =
    Math.floor(
      difference / 60000
    );

  const days =
    Math.floor(
      totalMinutes / 1440
    );

  const hours =
    Math.floor(
      (totalMinutes % 1440) / 60
    );

  const minutes =
    totalMinutes % 60;

  if (days > 0) {
    return `${days} días, ${hours} horas`;
  }

  if (hours > 0) {
    return `${hours} horas, ${minutes} minutos`;
  }

  return `${minutes} minutos`;
}

function resolveDynamicVariables(
  text,
  context = {}
) {
  const now =
    context.now instanceof Date
      ? context.now
      : new Date();

  const member =
    context.member ||
    null;

  const user =
    context.user ||
    member?.user ||
    null;

  const guild =
    context.guild ||
    member?.guild ||
    context.channel?.guild ||
    null;

  const channel =
    context.channel ||
    null;

  const botUser =
    context.bot ||
    client.user ||
    null;

const verification =
  context.verification ||
  {};

  const memberRoles =
    member?.roles?.cache
      ? [...member.roles.cache.values()]
          .filter(
            currentRole =>
              currentRole.name !==
              "@everyone"
          )
          .sort(
            (roleA, roleB) =>
              roleB.position -
              roleA.position
          )
      : [];

  const selectedRole =
    context.role ||
    memberRoles[0] ||
    null;

  const highestRole =
    memberRoles[0] ||
    null;

  const lowestRole =
    memberRoles[
      memberRoles.length - 1
    ] ||
    null;

  const username =
    user?.username ||
    "Usuario";

  const globalName =
    user?.globalName ||
    username;

  const displayName =
    member?.displayName ||
    globalName;

  const nickname =
    member?.nickname ||
    displayName;

  const joinedAt =
    member?.joinedAt instanceof Date
      ? member.joinedAt
      : null;

  const createdAt =
    user?.createdAt instanceof Date
      ? user.createdAt
      : null;

 
 const avatar =
  user?.displayAvatarURL
    ? user.displayAvatarURL({
        extension: "png",
        size: 512,
      })
    : "";

  const banner =
    user?.bannerURL
      ? user.bannerURL({
          extension: "png",
          size: 1024,
        }) || "Sin banner"
      : "Sin banner";

  const serverIcon =
    guild?.iconURL
      ? guild.iconURL({
          extension: "png",
          size: 512,
        }) || "Sin icono"
      : "Sin icono";

  const serverBanner =
    guild?.bannerURL
      ? guild.bannerURL({
          extension: "png",
          size: 1024,
        }) || "Sin banner"
      : "Sin banner";

  const cachedMembers =
    guild?.members?.cache
      ? [...guild.members.cache.values()]
      : [];

  const bots =
    cachedMembers.filter(
      currentMember =>
        currentMember.user?.bot
    ).length;

  const humans =
    Math.max(
      0,
      Number(
        guild?.memberCount || 0
      ) - bots
    );

  const online =
    cachedMembers.filter(
      currentMember =>
        currentMember.presence?.status &&
        currentMember.presence.status !==
          "offline"
    ).length;

  const offline =
    Math.max(
      0,
      Number(
        guild?.memberCount || 0
      ) - online
    );

  const guildChannels =
    guild?.channels?.cache;

  const textChannels =
    guildChannels
      ? guildChannels.filter(
          currentChannel =>
            currentChannel.type ===
            ChannelType.GuildText
        ).size
      : 0;

  const voiceChannels =
    guildChannels
      ? guildChannels.filter(
          currentChannel =>
            currentChannel.type ===
            ChannelType.GuildVoice
        ).size
      : 0;

  const categories =
    guildChannels
      ? guildChannels.filter(
          currentChannel =>
            currentChannel.type ===
            ChannelType.GuildCategory
        ).size
      : 0;

  const status =
    member?.presence?.status ||
    "Sin datos";

  const activity =
    member?.presence?.activities?.[0]
      ?.name ||
    "Sin actividad";

  const permissions =
    member?.permissions?.toArray
      ? member.permissions
          .toArray()
          .join(", ") ||
        "Sin permisos"
      : "Sin datos";

  const rolesText =
    memberRoles.length
      ? memberRoles
          .map(role => role.name)
          .join(", ")
      : "Sin roles";

  const memberCount =
    Number(
      guild?.memberCount || 0
    ).toLocaleString("es-AR");


const verificationExpiresAt =
  verification.expiresAt instanceof Date
    ? verification.expiresAt
    : verification.expiresAt
      ? new Date(
          verification.expiresAt
        )
      : null;

const verificationExpiresUnix =
  verificationExpiresAt &&
  !Number.isNaN(
    verificationExpiresAt.getTime()
  )
    ? Math.floor(
        verificationExpiresAt.getTime() /
        1000
      )
    : null;

  const unix =
    Math.floor(
      now.getTime() / 1000
    );

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone ||
    "America/Argentina/Buenos_Aires";

  const latency =
    Number.isFinite(
      client.ws.ping
    )
      ? `${Math.round(
          client.ws.ping
        )} ms`
      : "0 ms";

  const memory =
    `${(
      process.memoryUsage().rss /
      1024 /
      1024
    ).toFixed(1)} MB`;

  const values = {
    /* USUARIO */

    "{user}":
      username,

    "{username}":
      username,

    "{displayname}":
      displayName,

    "{globalname}":
      globalName,

    "{nickname}":
      nickname,

    "{mention}":
      user?.id
        ? `<@${user.id}>`
        : "Usuario",

    "{userid}":
      user?.id ||
      "Sin datos",

    "{avatar}":
      avatar ||
      "Sin avatar",

    "{banner}":
      banner,

    "{created}":
      createdAt
        ? createdAt.toLocaleDateString(
            "es-AR"
          )
        : "Sin datos",

    "{joined}":
      joinedAt
        ? joinedAt.toLocaleDateString(
            "es-AR"
          )
        : "Sin datos",

    "{joindate}":
      joinedAt
        ? joinedAt.toLocaleDateString(
            "es-AR"
          )
        : now.toLocaleDateString(
            "es-AR"
          ),

    "{joinedrelative}":
      joinedAt
        ? formatRelativeTime(
            joinedAt,
            now
          )
        : "Sin datos",

    "{status}":
      status,

    "{activity}":
      activity,

    "{roles}":
      rolesText,

    "{rolecount}":
      String(
        memberRoles.length
      ),

    "{highestrole}":
      highestRole?.name ||
      "Sin rol",

    "{permissions}":
      permissions,

    "{boosting}":
      member?.premiumSince
        ? "Sí"
        : "No",

    /* SERVIDOR */

    "{server}":
      guild?.name ||
      "Servidor",

    "{serverid}":
      guild?.id ||
      "Sin datos",

    "{servericon}":
      serverIcon,

    "{serverbanner}":
      serverBanner,

    "{serverdescription}":
      guild?.description ||
      "Sin descripción",

    "{owner}":
      guild?.ownerId
        ? `<@${guild.ownerId}>`
        : "Sin datos",

    "{ownerid}":
      guild?.ownerId ||
      "Sin datos",

    "{membercount}":
      memberCount,

    "{members}":
      memberCount,

    "{bots}":
      String(bots),

    "{humans}":
      String(humans),

    "{online}":
      String(online),

    "{offline}":
      String(offline),

    "{boosts}":
      String(
        guild?.premiumSubscriptionCount ||
        0
      ),

    "{boostlevel}":
      String(
        guild?.premiumTier ||
        0
      ),

    "{verificationlevel}":
      String(
        guild?.verificationLevel ??
        "Sin datos"
      ),

    "{channels}":
      String(
        guildChannels?.size ||
        0
      ),

    "{textchannels}":
      String(textChannels),

    "{voicechannels}":
      String(voiceChannels),

    "{categories}":
      String(categories),

    "{rolescount}":
      String(
        guild?.roles?.cache?.size ||
        0
      ),

    "{emojis}":
      String(
        guild?.emojis?.cache?.size ||
        0
      ),

    "{stickers}":
      String(
        guild?.stickers?.cache?.size ||
        0
      ),

    "{createdserver}":
      guild?.createdAt
        ? guild.createdAt
            .toLocaleDateString(
              "es-AR"
            )
        : "Sin datos",

    /* ROLES */

    "{role}":
      selectedRole?.name ||
      "Sin rol",

    "{roleid}":
      selectedRole?.id ||
      "Sin datos",

    "{rolename}":
      selectedRole?.name ||
      "Sin rol",

    "{rolecolor}":
      selectedRole?.hexColor ||
      "#000000",

    "{roleicon}":
      selectedRole?.iconURL
        ? selectedRole.iconURL() ||
          "Sin icono"
        : "Sin icono",

    "{lowestrole}":
      lowestRole?.name ||
      "Sin rol",

    "{autorole}":
      selectedRole?.name ||
      "Sin rol",

    /* CANAL */

    "{channel}":
      channel?.name ||
      "Sin canal",

    "{channelid}":
      channel?.id ||
      "Sin datos",

    "{channelmention}":
      channel?.id
        ? `<#${channel.id}>`
        : "Sin canal",

    "{channeltopic}":
      channel?.topic ||
      "Sin tema",

    "{category}":
      channel?.parent?.name ||
      "Sin categoría",

    "{categoryid}":
      channel?.parentId ||
      "Sin datos",

    "{thread}":
      channel?.isThread?.()
        ? channel.name
        : "No es un hilo",

    "{threadid}":
      channel?.isThread?.()
        ? channel.id
        : "Sin datos",

    "{slowmode}":
      `${channel?.rateLimitPerUser || 0} segundos`,

    "{channeltype}":
      String(
        channel?.type ??
        "Sin datos"
      ),

    /* BOT */

    "{bot}":
      botUser?.username ||
      "VTX Bot",

    "{botid}":
      botUser?.id ||
      "Sin datos",

    "{botavatar}":
      botUser?.displayAvatarURL
        ? botUser.displayAvatarURL({
            extension: "png",
            size: 512,
          })
        : "Sin avatar",

    "{botversion}":
      "2.4.1",

    "{latency}":
      latency,

    "{ping}":
      latency,

    "{uptime}":
      formatUptime(
        Date.now() -
        startedAt
      ),

    "{commands}":
      String(
        statistics.commands
      ),

    "{servers}":
      String(
        client.guilds.cache.size
      ),

    "{users}":
      String(
        getTotalUsers()
      ),

    "{memory}":
      memory,

    "{cpu}":
      "Disponible en el sistema",

    "{node}":
      process.version,

    "{library}":
      "discord.js v14",

/* VERIFICACIÓN */

"{verifylink}":
  verification.link ||
  "Sin enlace",

"{verificationcode}":
  verification.code ||
  "Sin código",

"{verificationid}":
  verification.id ||
  "Sin datos",

"{verificationmethod}":
  verification.method ||
  "Sin método",

"{verificationrole}":
  verification.role ||
  selectedRole?.name ||
  "Sin rol",

"{verificationchannel}":
  verification.channel ||
  channel?.name ||
  "Sin canal",

"{verificationtime}":
  now.toLocaleTimeString(
    "es-AR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ),

"{verificationdate}":
  now.toLocaleDateString(
    "es-AR"
  ),

"{verifyexpires}":
  verificationExpiresUnix
    ? `<t:${verificationExpiresUnix}:R>`
    : "Sin vencimiento",

"{verified}":
  verification.verified === true
    ? "Verificado"
    : "Pendiente",

"{verifybrowser}":
  verification.browser ||
  "Sin datos",

"{verifyos}":
  verification.os ||
  "Sin datos",

"{verifydevice}":
  verification.device ||
  "Sin datos",

"{verifycountry}":
  verification.country ||
  "Sin datos",

"{verifycity}":
  verification.city ||
  "Sin datos",

"{verifylanguage}":
  verification.language ||
  "Sin datos",

"{verifyisp}":
  verification.isp ||
  "Sin datos",

    /* FECHA Y HORA */

    "{date}":
      now.toLocaleDateString(
        "es-AR"
      ),

    "{time}":
      now.toLocaleTimeString(
        "es-AR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

    "{datetime}":
      now.toLocaleString(
        "es-AR"
      ),

    "{timestamp}":
      `<t:${unix}:F>`,

    "{year}":
      String(
        now.getFullYear()
      ),

    "{month}":
      String(
        now.getMonth() + 1
      ).padStart(2, "0"),

    "{monthname}":
      now.toLocaleDateString(
        "es-AR",
        {
          month: "long",
        }
      ),

    "{day}":
      String(
        now.getDate()
      ).padStart(2, "0"),

    "{weekday}":
      now.toLocaleDateString(
        "es-AR",
        {
          weekday: "long",
        }
      ),

    "{hour}":
      String(
        now.getHours()
      ).padStart(2, "0"),

    "{minute}":
      String(
        now.getMinutes()
      ).padStart(2, "0"),

    "{second}":
      String(
        now.getSeconds()
      ).padStart(2, "0"),

    "{timezone}":
      timezone,

    "{unix}":
      String(unix),

    "{shortdate}":
      now.toLocaleDateString(
        "es-AR"
      ),

    "{longdate}":
      now.toLocaleDateString(
        "es-AR",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
  };

  let result =
    String(text || "");

  for (
    const [
      variable,
      value,
    ] of Object.entries(values)
  ) {
    result =
      result.replaceAll(
        variable,
        String(value)
      );
  }

  return result;
}

/*
  Conservamos el nombre anterior para que
  la bienvenida siga funcionando sin modificar
  el resto del archivo.
*/

function replaceWelcomeVariables(
  text,
  member
) {
  return resolveDynamicVariables(
    text,
    {
      member,
      user:
        member?.user,
      guild:
        member?.guild,
      bot:
        client.user,
    }
  );
}

/* =========================================================
   EVENTOS DE DISCORD
   ========================================================= */

client.once(
  Events.ClientReady,
  async readyClient => {
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

for (
  const guild of
  readyClient.guilds.cache.values()
) {
  try {
    await registerKeyBotCommand(
      guild
    );

    const savedConfig =
      loadWelcomeConfig(
        guild.id
      );

    if (savedConfig) {
      welcomeConfigs.set(
        guild.id,
        savedConfig
      );

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
  async guild => {
    console.log(
      `Nuevo servidor conectado: ${guild.name}`
    );

await registerKeyBotCommand(
  guild
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

     const interactionButtonText =
  String(
    config.interactionButtonText ||
    "Continuar verificación"
  )
    .trim()
    .slice(
      0,
      80
    ) ||
  "Continuar verificación";

const interactionButtonEmoji =
  String(
    config.interactionButtonEmoji ||
    ""
  ).trim();

const continueButton =
  new ButtonBuilder()
    .setLabel(
      interactionButtonText
    )
    .setStyle(
      ButtonStyle.Link
    )
    .setURL(
      verificationUrl
    );

if (interactionButtonEmoji) {
  try {
    continueButton.setEmoji(
      interactionButtonEmoji
    );
  } catch (emojiError) {
    console.log(
      "Emoji inválido en el botón de interacción:",
      interactionButtonEmoji
    );
  }
}

      const row =
        new ActionRowBuilder()
          .addComponents(
            continueButton
          );

const verificationContext = {
  member,
  user: interaction.user,
  guild: interaction.guild,
  channel: interaction.channel,
  role,
  bot: client.user,
  verification: {
    link: verificationUrl,
    code: verificationToken,
    id: verificationToken,
    method:
      config.verificationMethod,
    role:
      role.name,
    channel:
      interaction.channel?.name ||
      "Sin canal",
    expiresAt:
      new Date(expiresAt),
    verified:
      false,
  },
};

const interactionColor =
  /^#[0-9A-Fa-f]{6}$/.test(
    String(
      config.interactionColor ||
      ""
    )
  )
    ? config.interactionColor
    : "#8b5cf6";

const verificationEmbed =
  new EmbedBuilder()
    .setColor(
      interactionColor
    )
    .setTitle(
      resolveDynamicVariables(
        config.interactionTitle ||
          "🔒 Verificá tu cuenta",
        verificationContext
      )
    )
    .setDescription(
      resolveDynamicVariables(
        config.interactionMessage ||
          [
            "¡Hola {mention}! 👋",
            "",
            "Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.",
            "",
            "El enlace es personal y solo puede utilizarse una vez.",
            "",
            "Si no solicitaste esto, ignorá este mensaje.",
          ].join("\n"),
        verificationContext
      )
    );

/*
  Imagen opcional configurada desde
  el Dashboard.
*/

const interactionImage =
  String(
    config.interactionImage ||
    ""
  ).trim();

if (
  interactionImage &&
  /^https?:\/\//i.test(
    interactionImage
  )
) {
  verificationEmbed.setImage(
    interactionImage
  );
}

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
  /^\/(?!api|auth|verify|verify-assets|socket\.io|health).*/,
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


/* =========================================================
   OBTENER CONFIGURACIÓN DE LICENCIAS
   ========================================================= */

app.get(
  "/api/servers/:guildId/license-settings",
  (request, response) => {
    try {
      const dashboardUser =
        request.session?.dashboardUser;

      if (!dashboardUser?.id) {
        return response
          .status(401)
          .json({
            success: false,
            message:
              "Tenés que iniciar sesión.",
          });
      }

      const guildId =
        String(
          request.params.guildId || ""
        ).trim();

      if (!guildId) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "No se recibió el servidor.",
          });
      }

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
              "El bot no está conectado a ese servidor.",
          });
      }

      const config =
        getLicenseConfig(
          guildId
        );

      return response.json({
        success: true,
        data: config,
      });
    } catch (error) {
      console.error(
        "Error cargando configuración de licencias:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudo cargar la configuración.",
        });
    }
  }
);

/* =========================================================
   GUARDAR CONFIGURACIÓN DE LICENCIAS
   ========================================================= */

app.post(
  "/api/servers/:guildId/license-settings",
  (request, response) => {
    try {
      const dashboardUser =
        request.session?.dashboardUser;

      if (!dashboardUser?.id) {
        return response
          .status(401)
          .json({
            success: false,
            message:
              "Tenés que iniciar sesión.",
          });
      }

      if (!dashboardUser.isOwner) {
        return response
          .status(403)
          .json({
            success: false,
            message:
              "No tenés permisos para modificar esta configuración.",
          });
      }

      const guildId =
        String(
          request.params.guildId || ""
        ).trim();

      if (!guildId) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "No se recibió el servidor.",
          });
      }

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
              "El bot no está conectado a ese servidor.",
          });
      }

      const logsChannelId =
        String(
          request.body?.logsChannelId ||
          ""
        ).trim();

      if (logsChannelId) {
        const selectedChannel =
          guild.channels.cache.get(
            logsChannelId
          );

        if (
          !selectedChannel ||
          !selectedChannel.isTextBased()
        ) {
          return response
            .status(400)
            .json({
              success: false,
              message:
                "El canal seleccionado no es válido.",
            });
        }
      }

      const config = {
        logsChannelId,

        creation:
          request.body?.creation ===
          true,

        activation:
          request.body?.activation ===
          true,

        expiration:
          request.body?.expiration ===
          true,

        deletion:
          request.body?.deletion ===
          true,

        revocation:
          request.body?.revocation ===
          true,

        updatedAt:
          new Date().toISOString(),

        updatedBy:
          dashboardUser.username ||
          dashboardUser.id,
      };

      saveLicenseConfig(
        guildId,
        config
      );

      console.log(
        `Configuración de licencias guardada para ${guild.name}`,
        {
          guildId,
          logsChannelId,
          updatedBy:
            dashboardUser.username ||
            dashboardUser.id,
        }
      );

      return response.json({
        success: true,
        message:
          "Configuración guardada correctamente.",
        data: config,
      });
    } catch (error) {
      console.error(
        "Error guardando configuración de licencias:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudo guardar la configuración.",
        });
    }
  }
);

/* =========================================================
   OBTENER TODAS LAS LICENCIAS GUARDADAS
   ========================================================= */

app.get(
  "/api/licenses",
  (request, response) => {
    try {
      const licenses =
        loadTokens();

      return response.json({
        success: true,
        licenses,
      });
    } catch (error) {
      console.error(
        "Error obteniendo licencias:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudieron cargar las licencias.",
          licenses: [],
        });
    }
  }
);
/* =========================================================
   BORRAR TODAS LAS LICENCIAS
========================================================= */

app.delete(
  "/api/licenses",
  (request, response) => {
    try {
      const dashboardUser =
        request.session
          ?.dashboardUser;

      if (!dashboardUser?.id) {
        return response
          .status(401)
          .json({
            success: false,
            message:
              "Tenés que iniciar sesión.",
          });
      }

      const code =
        String(
          request.body?.code || ""
        ).trim();

      if (code !== "1912") {
        return response
          .status(403)
          .json({
            success: false,
            message:
              "El código de seguridad es incorrecto.",
          });
      }

      const existingLicenses =
        loadTokens();

      const deletedCount =
        Array.isArray(
          existingLicenses
        )
          ? existingLicenses.length
          : 0;

      saveTokens([]);

      console.log(
        `Se eliminaron ${deletedCount} licencias.`,
        {
          deletedBy:
            dashboardUser.username ||
            dashboardUser.id,
        }
      );

      return response.json({
        success: true,

        message:
          "Todas las licencias fueron eliminadas.",

        deletedCount,
      });
    } catch (error) {
      console.error(
        "Error borrando licencias:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudieron borrar las licencias.",
        });
    }
  }
);

/* =========================================================
   BORRAR UNA LICENCIA
========================================================= */

app.delete(
  "/api/licenses/:key",
  (request, response) => {
    try {
      const dashboardUser =
        request.session?.dashboardUser;

      if (!dashboardUser?.id) {
        return response
          .status(401)
          .json({
            success: false,
            message:
              "Tenés que iniciar sesión.",
          });
      }

      const key =
        String(
          request.params.key || ""
        )
          .trim()
          .toUpperCase();

      if (!key) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "No se recibió la Key.",
          });
      }

      const licenses =
        loadTokens();

      const licenseIndex =
        licenses.findIndex(
          license =>
            String(
              license.key || ""
            )
              .trim()
              .toUpperCase() === key
        );

      if (licenseIndex === -1) {
        return response
          .status(404)
          .json({
            success: false,
            message:
              "La licencia no existe.",
          });
      }

      const deletedLicense =
        licenses.splice(
          licenseIndex,
          1
        )[0];

      saveTokens(licenses);

      console.log(
        `Licencia eliminada: ${key}`,
        {
          deletedBy:
            dashboardUser.username ||
            dashboardUser.id,
        }
      );

      return response.json({
        success: true,
        message:
          "Licencia eliminada correctamente.",
        license:
          deletedLicense,
      });
    } catch (error) {
      console.error(
        "Error eliminando licencia:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudo eliminar la licencia.",
        });
    }
  }
);

/* =========================================================
   GENERAR Y GUARDAR UNA LICENCIA
   ========================================================= */


app.post(
  "/api/licenses/generate",
  async (request, response) => {
    try {

const guildId =
  String(
    request.body?.guildId || ""
  ).trim();

if (!guildId) {
  return response
    .status(400)
    .json({
      success: false,
      message:
        "Primero seleccioná un servidor.",
    });
}


console.log("================================");
console.log("Guild solicitado:", guildId);
console.log(
  "Servidores del bot:",
  client.guilds.cache.map(g => ({
    id: g.id,
    name: g.name,
  }))
);
console.log("================================");

const licenseGuild =
  client.guilds.cache.get(
    guildId
  );

if (!licenseGuild) {
  return response
    .status(404)
    .json({
      success: false,
      message:
        "El bot no está conectado al servidor seleccionado.",
    });
}

    const requestedDays =
  Number(
    request.body?.days ??
    request.body?.durationDays ??
    request.body?.duration ??
    0
  );

const requestedHours =
  Number(
    request.body?.hours ??
    0
  );

const requestedMinutes =
  Number(
    request.body?.minutes ??
    0
  );

const requestedSeconds =
  Number(
    request.body?.seconds ??
    0
  );

const durationDays =
  Number.isFinite(requestedDays)
    ? Math.min(
        9999,
        Math.max(
          0,
          Math.floor(requestedDays)
        )
      )
    : 0;

const durationHours =
  Number.isFinite(requestedHours)
    ? Math.min(
        23,
        Math.max(
          0,
          Math.floor(requestedHours)
        )
      )
    : 0;

const durationMinutes =
  Number.isFinite(requestedMinutes)
    ? Math.min(
        59,
        Math.max(
          0,
          Math.floor(requestedMinutes)
        )
      )
    : 0;

const durationSeconds =
  Number.isFinite(requestedSeconds)
    ? Math.min(
        59,
        Math.max(
          0,
          Math.floor(requestedSeconds)
        )
      )
    : 0;

const permanent =
  request.body?.permanent === true ||
  durationDays >= 9999;

const durationMilliseconds =
  permanent
    ? null
    : (
        durationDays *
        24 *
        60 *
        60 *
        1000
      ) +
      (
        durationHours *
        60 *
        60 *
        1000
      ) +
      (
        durationMinutes *
        60 *
        1000
      ) +
      (
        durationSeconds *
        1000
      );

if (
  !permanent &&
  (
    !Number.isFinite(
      durationMilliseconds
    ) ||
    durationMilliseconds < 1000
  )
) {
  return response
    .status(400)
    .json({
      success: false,
      message:
        "La duración mínima es de 1 segundo.",
    });
}

      const description =
        String(
          request.body?.description ||
          ""
        )
          .trim()
          .slice(
            0,
            500
          );

      const requestedAmount =
        Number(
          request.body?.amount ??
          1
        );

      const amount =
        Number.isFinite(
          requestedAmount
        )
          ? Math.min(
              50,
              Math.max(
                1,
                Math.floor(
                  requestedAmount
                )
              )
            )
          : 1;

      const licenses =
        loadTokens();

      const created = [];

      for (
        let index = 0;
        index < amount;
        index += 1
      ) {
        const key =
          generateLicenseKey();

        const createdAt =
          Date.now();

       const expiresAt =
  permanent
    ? null
    : createdAt +
      durationMilliseconds;

        const dashboardUser =
          request.session
            ?.dashboardUser ||
          null;

        const license = {
          id:
            crypto
              .randomUUID(),

          key,

          botName:
            client.user?.username ||
            "Nebula Bot",

          description,

         duration:
  durationDays,

durationDays,

durationHours,

durationMinutes,

durationSeconds,

durationMilliseconds,

          permanent,

          createdAt,

          expiresAt,

          createdBy: {
            id:
              dashboardUser?.id ||
              null,

            username:
              dashboardUser
                ?.username ||
              "Administrador",

            displayName:
              dashboardUser
                ?.displayName ||
              dashboardUser
                ?.globalName ||
              dashboardUser
                ?.username ||
              "Administrador",
          },

          status:
            "available",

          activated:
            false,

          activatedBy:
            null,

          activatedUsername:
            null,

          activatedAt:
            null,

         guildId:
  guildId,

guildName:
  licenseGuild.name,

          revoked:
            false,

          revokedAt:
            null,
        };

        licenses.push(
          license
        );

        created.push(
          license
        );
      }

      saveTokens(
        licenses
      );


await Promise.all(
  created.map(
    createdLicense =>

sendLicenseLog(
  guildId,
  "creation",
  createdLicense,
  {
    source:
      "dashboard",

    createdBy:
      request.session
        ?.dashboardUser
        ?.displayName ||
      request.session
        ?.dashboardUser
        ?.username ||
      "Administrador",
  }
)

       )
);

      return response.json({
        success: true,

        message:
          amount === 1
            ? "Licencia creada correctamente."
            : `${amount} licencias creadas correctamente.`,

        licenses:
          created,
      });
    } catch (error) {
      console.error(
        "Error generando licencia:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudo generar la licencia.",
        });
    }
  }
);

app.post(
  "/api/licenses/activate",
  (request, response) => {
    try {
      const dashboardUser =
        request.session?.dashboardUser;

      if (!dashboardUser?.id) {
        return response
          .status(401)
          .json({
            success: false,
            message:
              "Primero tenés que iniciar sesión con Discord.",
          });
      }

      const key =
        String(
          request.body?.key || ""
        )
          .trim()
          .toUpperCase();

      if (!key) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "Ingresá una Key de acceso.",
          });
      }

      const tokens =
        loadTokens();

      const license =
        tokens.find(
          savedLicense =>
            String(
              savedLicense?.key || ""
            ).toUpperCase() === key
        );

      if (!license) {
        return response
          .status(404)
          .json({
            success: false,
            message:
              "La Key ingresada no existe.",
          });
      }

      if (license.revoked === true) {
        return response
          .status(403)
          .json({
            success: false,
            message:
              "Esta Key fue revocada.",
          });
      }

      if (
        license.expiresAt &&
        Number(license.expiresAt) <=
          Date.now()
      ) {
        return response
          .status(403)
          .json({
            success: false,
            message:
              "Esta Key está vencida.",
          });
      }

      if (
        license.activated === true &&
        String(
          license.activatedBy || ""
        ) !== String(dashboardUser.id)
      ) {
        return response
          .status(409)
          .json({
            success: false,
            message:
              "Esta Key ya fue utilizada por otra cuenta.",
          });
      }

  if (license.activated !== true) {
  const activatedAt =
    Date.now();

  license.activated =
    true;

  license.status =
    "active";

  license.activatedBy =
    String(dashboardUser.id);

  license.activatedUsername =
    dashboardUser.username ||
    "Usuario";

  license.activatedDisplayName =
    dashboardUser.displayName ||
    dashboardUser.globalName ||
    dashboardUser.username ||
    "Usuario";

  license.activatedAvatar =
    dashboardUser.avatar ||
    "";

  license.activatedAt =
    activatedAt;

        const duration =
          String(
            license.duration || "never"
          ).toLowerCase();

        const durationTimes = {
          "1d":
            24 * 60 * 60 * 1000,

          "7d":
            7 * 24 * 60 * 60 * 1000,

          "30d":
            30 * 24 * 60 * 60 * 1000,

          "90d":
            90 * 24 * 60 * 60 * 1000,
        };

        license.expiresAt =
          duration === "never"
            ? null
            : activatedAt +
              (
                durationTimes[
                  duration
                ] || 0
              );

        saveTokens(tokens);
      }

      request.session
        .dashboardUser
        .hasAccess =
        true;

      request.session.save(
        error => {
          if (error) {
            console.error(
              "No se pudo guardar el acceso:",
              error
            );

            return response
              .status(500)
              .json({
                success: false,
                message:
                  "La Key era válida, pero no se pudo guardar la sesión.",
              });
          }

          return response.json({
            success: true,

            message:
              "Key activada correctamente.",

            data: {
              hasAccess:
                true,

              expiresAt:
                license.expiresAt,
            },
          });
        }
      );
    } catch (error) {
      console.error(
        "Error activando la Key:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudo validar la Key.",
        });
    }
  }
);

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

app.get("/health", (request, response) => {
  const botConnected = client.isReady();

  response.status(botConnected ? 200 : 503).json({
    success: botConnected,
    status: botConnected ? "online" : "starting",
    bot: botConnected ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


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

  let guild =
  client.guilds.cache.get(guildId);

if (!guild) {
  try {
    guild =
      await client.guilds.fetch(
        guildId
      );
  } catch {
    return response
      .status(404)
      .json({
        success: false,
        message:
          "El servidor no existe o el bot no está dentro de él",
      });
  }
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

      const testMember =
  guild.members.cache.get(
    guild.ownerId
  ) ||
  guild.members.cache.find(
    member =>
      !member.user.bot
  ) ||
  guild.members.me;

if (!testMember) {
  return response
    .status(400)
    .json({
      success: false,

      message:
        "No se encontró un miembro para realizar la prueba",
    });
}

const title =
  replaceWelcomeVariables(
    config.title,
    testMember
  );

const message =
  replaceWelcomeVariables(
    config.message,
    testMember
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

if (config.showAvatar) {
  embed.setThumbnail(
    testMember.user
      .displayAvatarURL({
        extension: "png",
        size: 256,
      })
  );
}

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
   COMANDO /KEYBOT
   ========================================================= */

client.on(
  Events.InteractionCreate,
  async interaction => {

    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.commandName !== "keybot") {
      return;
    }

    const subcommand =
      interaction.options.getSubcommand();

   if (subcommand === "generate") {
  try {
    await interaction.deferReply({
      ephemeral: true,
    });

    if (!interaction.guild) {
      await interaction.editReply({
        content:
          "❌ Este comando solamente puede utilizarse dentro de un servidor.",
      });

      return;
    }

    const durationDays =
      interaction.options.getInteger("dias") ?? 0;

    const durationHours =
      interaction.options.getInteger("horas") ?? 0;

    const durationMinutes =
      interaction.options.getInteger("minutos") ?? 0;

    const durationSeconds =
      interaction.options.getInteger("segundos") ?? 0;

    const permanent =
      interaction.options.getBoolean("permanente") === true;

    const amount =
      interaction.options.getInteger("cantidad") ?? 1;

    const description =
      interaction.options.getString("descripcion")?.trim() || "";

const deliveryUser =
  interaction.options.getUser(
    "entregar_a"
  );

if (deliveryUser?.bot) {
  await interaction.editReply({
    content:
      "❌ No podés entregar una licencia a otro bot.",
  });

  return;
}

    const durationMilliseconds =
      permanent
        ? null
        : (
            durationDays *
            24 *
            60 *
            60 *
            1000
          ) +
          (
            durationHours *
            60 *
            60 *
            1000
          ) +
          (
            durationMinutes *
            60 *
            1000
          ) +
          (
            durationSeconds *
            1000
          );

    if (
      !permanent &&
      (
        !Number.isFinite(durationMilliseconds) ||
        durationMilliseconds < 1000
      )
    ) {
      await interaction.editReply({
        content:
          "❌ Tenés que indicar una duración mínima de 1 segundo o seleccionar `permanente: Sí`.",
      });

      return;
    }

    const licenses =
      loadTokens();

    const createdLicenses = [];

    for (
      let index = 0;
      index < amount;
      index += 1
    ) {
      let key =
        generateLicenseKey();

      while (
        licenses.some(
          existingLicense =>
            existingLicense.key === key
        )
      ) {
        key =
          generateLicenseKey();
      }

      const createdAt =
        Date.now();

      const expiresAt =
        permanent
          ? null
          : createdAt +
            durationMilliseconds;

      const license = {
        id:
          crypto.randomUUID(),

        key,

        botName:
          client.user?.username ||
          "Nebula Bot",

        description,

        duration:
          durationDays,

        durationDays,
        durationHours,
        durationMinutes,
        durationSeconds,
        durationMilliseconds,

        permanent,

        createdAt,
        expiresAt,

        createdBy: {
          id:
            interaction.user.id,

          username:
            interaction.user.username,

          displayName:
            interaction.member?.displayName ||
            interaction.user.globalName ||
            interaction.user.username,
        },

        status:
          "available",

        activated:
          false,

        activatedBy:
          null,

        activatedUsername:
          null,

        activatedAt:
          null,

        guildId:
          interaction.guild.id,

        guildName:
          interaction.guild.name,


deliveredTo:
  deliveryUser
    ? {
        id:
          deliveryUser.id,

        username:
          deliveryUser.username,

        displayName:
          deliveryUser.globalName ||
          deliveryUser.username,

        avatar:
          deliveryUser.displayAvatarURL({
            extension:
              "png",

            size:
              256,
          }),
      }
    : null,

deliveredAt:
  deliveryUser
    ? Date.now()
    : null,

        revoked:
          false,

        revokedAt:
          null,
      };

      licenses.push(
        license
      );

      createdLicenses.push(
        license
      );
    }

    saveTokens(
      licenses
    );

    io.emit(
      "licenses:update",
      licenses
    );

    await Promise.all(
      createdLicenses.map(
        createdLicense =>
          sendLicenseLog(
            interaction.guild.id,
            "creation",
            createdLicense,
            {
              source:
                "discord_command",

              command:
                "/keybot generate",

              createdBy:
                interaction.member?.displayName ||
                interaction.user.globalName ||
                interaction.user.username,
            }
          )
      )
    );

    const keysText =
      createdLicenses
        .map(
          (license, index) =>
            `${index + 1}. \`${license.key}\``
        )
        .join("\n");

    const expirationText =
      permanent
        ? "Permanente"
        : [
            durationDays > 0
              ? `${durationDays} día${durationDays === 1 ? "" : "s"}`
              : null,

            durationHours > 0
              ? `${durationHours} hora${durationHours === 1 ? "" : "s"}`
              : null,

            durationMinutes > 0
              ? `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`
              : null,

            durationSeconds > 0
              ? `${durationSeconds} segundo${durationSeconds === 1 ? "" : "s"}`
              : null,
          ]
            .filter(Boolean)
            .join(", ");


let deliverySucceeded =
  false;

if (deliveryUser) {
  const deliveredKeysText =
    createdLicenses
      .map(
        (license, index) =>
          `${index + 1}. \`${license.key}\``
      )
      .join("\n");

  const deliveryEmbed =
    new EmbedBuilder()
      .setColor(
        "#5865F2"
      )
      .setTitle(
        createdLicenses.length === 1
          ? "🔑 Recibiste una licencia"
          : "🔑 Recibiste nuevas licencias"
      )
      .setDescription(
        [
          `Hola <@${deliveryUser.id}>.`,
          "",
          "Se te entregó una licencia para utilizar el bot.",
          "",
          deliveredKeysText,
        ].join("\n")
      )
      .addFields(
        {
          name:
            "🤖 Bot",

          value:
            client.user?.username ||
            "Nebula Bot",

          inline:
            true,
        },

        {
          name:
            "⏳ Duración",

          value:
            expirationText,

          inline:
            true,
        },

        {
          name:
            "📦 Cantidad",

          value:
            String(
              createdLicenses.length
            ),

          inline:
            true,
        },

        {
          name:
            "🏠 Servidor de entrega",

          value:
            `${interaction.guild.name}\n\`${interaction.guild.id}\``,

          inline:
            false,
        },

        {
          name:
            "👤 Entregada por",

          value:
            `${interaction.user}\n\`${interaction.user.id}\``,

          inline:
            false,
        }
      )
      .setFooter({
        text:
          "Guardá esta clave en un lugar seguro y no la compartas.",
      })
      .setTimestamp();

  if (description) {
    deliveryEmbed.addFields({
      name:
        "📝 Descripción",

      value:
        description,

      inline:
        false,
    });
  }

  try {
    await deliveryUser.send({
      embeds: [
        deliveryEmbed,
      ],
    });

    deliverySucceeded =
      true;

  } catch (error) {
    deliveryError =
      true;

    console.log(
      `No se pudo enviar la licencia por MD a ${deliveryUser.tag}:`,
      error.message
    );
  }
}

    const resultEmbed =
      new EmbedBuilder()
        .setColor(
          "#22c55e"
        )
        .setTitle(
          amount === 1
            ? "🔑 Licencia generada"
            : "🔑 Licencias generadas"
        )
        .setDescription(
          keysText
        )
        .addFields(
          {
            name:
              "📦 Cantidad",

            value:
              String(
                createdLicenses.length
              ),

            inline:
              true,
          },

          {
            name:
              "⏳ Duración",

            value:
              expirationText,

            inline:
              true,
          },

          {
            name:
              "📊 Estado",

            value:
              "Disponible",

            inline:
              true,
          },


{
  name:
    "🏠 Servidor",

  value:
    `${interaction.guild.name}\n\`${interaction.guild.id}\``,

  inline:
    false,
},

{
  name:
    "📨 Entrega",

  value:
    !deliveryUser
      ? "No se seleccionó un destinatario."
      : deliverySucceeded
        ? `Enviada por privado a ${deliveryUser}\n\`${deliveryUser.id}\``
        : `No se pudo enviar el mensaje privado a ${deliveryUser}.\nLa licencia igualmente fue creada.`,

  inline:
    false,
}

                 )
        .setFooter({
          text:
            "Las licencias ya fueron guardadas y aparecerán en el Dashboard.",
        })
        .setTimestamp();

    if (description) {
      resultEmbed.addFields({
        name:
          "📝 Descripción",

        value:
          description,

        inline:
          false,
      });
    }

    await interaction.editReply({
      embeds: [
        resultEmbed,
      ],
    });

  } catch (error) {
    console.error(
      "Error ejecutando /keybot generate:",
      error
    );

    const errorMessage = {
      content:
        "❌ Ocurrió un error al generar las licencias.",
      embeds: [],
    };

    if (
      interaction.deferred ||
      interaction.replied
    ) {
      await interaction
        .editReply(
          errorMessage
        )
        .catch(() => {});
    } else {
      await interaction
        .reply({
          ...errorMessage,
          ephemeral: true,
        })
        .catch(() => {});
    }
  }
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
