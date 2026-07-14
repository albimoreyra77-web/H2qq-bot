import axios from "axios";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
} from "discord.js";

/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

function isValidHexColor(value) {
  return /^#[0-9A-F]{6}$/i.test(
    String(value || "")
  );
}

function cleanString(
  value,
  fallback = "",
  maximumLength = 100
) {
  return String(value ?? fallback)
    .trim()
    .slice(0, maximumLength);
}

function cleanBoolean(value) {
  return Boolean(value);
}

function cleanNumber(
  value,
  fallback,
  minimum,
  maximum
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(minimum, number)
  );
}

function getVerificationMethod(value) {
  const allowedMethods = [
    "oauth_link",
    "interaction_button",
    "emoji_reaction",
  ];

  return allowedMethods.includes(value)
    ? value
    : "oauth_link";
}

/* =========================================================
   OBTENER IP DEL USUARIO
   ========================================================= */

function getClientIp(request) {
  const cloudflareIp =
    request.headers["cf-connecting-ip"];

  if (cloudflareIp) {
    return String(cloudflareIp).trim();
  }

  const forwardedFor =
    request.headers["x-forwarded-for"];

  if (forwardedFor) {
    return String(forwardedFor)
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers["x-real-ip"];

  if (realIp) {
    return String(realIp).trim();
  }

  return (
    request.ip ||
    request.socket?.remoteAddress ||
    ""
  );
}

function normalizeIp(ip) {
  return String(ip || "")
    .replace(/^::ffff:/, "")
    .trim();
}

function isLocalOrPrivateIp(ip) {
  const value = normalizeIp(ip).toLowerCase();

  if (
    !value ||
    value === "::1" ||
    value === "127.0.0.1" ||
    value === "localhost"
  ) {
    return true;
  }

  if (/^10\./.test(value)) return true;
  if (/^192\.168\./.test(value)) return true;
  if (/^169\.254\./.test(value)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(value)) return true;
  if (/^(fc|fd|fe80):/i.test(value)) return true;

  return false;
}

function maskIp(ip) {
  const normalized = normalizeIp(ip);

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(normalized)) {
    const parts = normalized.split(".");
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }

  if (normalized.includes(":")) {
    const parts = normalized.split(":");
    return `${parts.slice(0, 3).join(":")}::xxxx`;
  }

  return "No disponible";
}

/* =========================================================
   INFORMACIÓN DE RED
   ========================================================= */

async function getNetworkInformation(request) {
  const ip = normalizeIp(getClientIp(request));

  if (isLocalOrPrivateIp(ip)) {
    return {
      ip: "Localhost",
      maskedIp: "Localhost",
      country: "",
      countryCode: "",
      region: "",
      city: "",
      isp: "",
      asn: "",
      vpn: null,
      proxy: null,
      hosting: null,
      tor: null,
      mobile: null,
    };
  }

  try {
    const apiKey = String(
      process.env.IPAPI_IS_KEY || ""
    ).trim();

    const apiResponse = await axios.get(
      "https://api.ipapi.is/",
      {
        params: {
          q: ip,
          ...(apiKey ? { key: apiKey } : {}),
        },
        timeout: 7000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = apiResponse.data || {};

    if (data.error) {
      throw new Error(String(data.error));
    }

    const location = data.location || {};
    const asnData = data.asn || {};
    const company = data.company || {};

    const asnNumber =
      asnData.asn !== undefined &&
      asnData.asn !== null
        ? `AS${asnData.asn}`
        : "";

    return {
      ip,
      maskedIp: maskIp(ip),
      country: String(location.country || "").slice(0, 100),
      countryCode: String(location.country_code || "").slice(0, 10),
      region: String(location.state || location.region || "").slice(0, 100),
      city: String(location.city || "").slice(0, 100),
      isp: String(
        company.name ||
        asnData.org ||
        asnData.descr ||
        ""
      ).slice(0, 150),
      asn: asnNumber.slice(0, 50),
      vpn: Boolean(data.is_vpn),
      proxy: Boolean(data.is_proxy),
      hosting: Boolean(data.is_datacenter),
      tor: Boolean(data.is_tor),
      mobile: Boolean(data.is_mobile),
    };
  } catch (error) {
    console.error(
      "No se pudo obtener la información de red:",
      error.message
    );

    return {
      ip,
      maskedIp: maskIp(ip),
      country: "",
      countryCode: "",
      region: "",
      city: "",
      isp: "",
      asn: "",
      vpn: null,
      proxy: null,
      hosting: null,
      tor: null,
      mobile: null,
    };
  }
}
/* =========================================================
   CONSTRUIR CAMPOS DEL LOG
   ========================================================= */

function buildLogFields({
  config,
  member,
  role,
  verifiedAt,
  technicalData = {},
  networkData = {},
}) {
  const options =
    config.logOptions || {};

  const fields = [];

  const codeValue = (
    value,
    fallback = "No disponible"
  ) => {
    const cleanValue =
      String(value || fallback)
        .replaceAll("`", "'")
        .trim()
        .slice(0, 1000);

    return `\`${cleanValue}\``;
  };

  const accountCreatedTimestamp =
    Math.floor(
      member.user.createdTimestamp /
        1000
    );

  const joinedTimestamp =
    member.joinedTimestamp
      ? Math.floor(
          member.joinedTimestamp /
            1000
        )
      : null;

  const verifiedTimestamp =
    Math.floor(
      verifiedAt / 1000
    );

  const displayName =
    member.displayName ||
    member.user.globalName ||
    member.user.username;

  const serverName =
    member.guild?.name ||
    "Servidor de Discord";

  /* =======================================================
     INFORMACIÓN DEL USUARIO
     ======================================================= */

  const hasUserInformation =
    options.username ||
    options.displayName ||
    options.userId ||
    options.deliveredRole;

  if (hasUserInformation) {
    fields.push({
      name:
        "👤 INFORMACIÓN DEL USUARIO",

      value:
        "──────────────────────────────",

      inline: false,
    });
  }

  if (options.username) {
    fields.push({
      name: "Usuario",

      value:
        codeValue(
          member.user.username
        ),

      inline: true,
    });
  }

  if (options.displayName) {
    fields.push({
      name: "Apodo",

      value:
        codeValue(
          displayName
        ),

      inline: true,
    });
  }

  if (options.userId) {
    fields.push({
      name: "Discord ID",

      value:
        codeValue(
          member.id
        ),

      inline: true,
    });
  }

  if (options.deliveredRole) {
    fields.push({
      name: "Rol",

      value:
        codeValue(
          role.name
        ),

      inline: true,
    });
  }

  fields.push({
    name: "Servidor",

    value:
      codeValue(
        serverName
      ),

    inline: true,
  });

  fields.push({
    name: "Estado",

    value:
      codeValue(
        "Verificado"
      ),

    inline: true,
  });

  /* =======================================================
     FECHAS
     ======================================================= */

  const hasDateInformation =
    options.accountCreatedAt ||
    options.joinedAt ||
    options.verifiedAt;

  if (hasDateInformation) {
    fields.push({
      name: "📅 FECHAS",

      value:
        "──────────────────────────────",

      inline: false,
    });
  }

  if (options.accountCreatedAt) {
    fields.push({
      name: "Cuenta creada",

      value:
        `<t:${accountCreatedTimestamp}:d>\n` +
        `<t:${accountCreatedTimestamp}:R>`,

      inline: true,
    });
  }

  if (options.joinedAt) {
    fields.push({
      name: "Ingreso",

      value:
        joinedTimestamp
          ? (
              `<t:${joinedTimestamp}:d>\n` +
              `<t:${joinedTimestamp}:R>`
            )
          : codeValue(
              "No disponible"
            ),

      inline: true,
    });
  }

  if (options.verifiedAt) {
    fields.push({
      name: "Verificado",

      value:
        `<t:${verifiedTimestamp}:d>\n` +
        `<t:${verifiedTimestamp}:R>`,

      inline: true,
    });
  }

  /* =======================================================
     INFORMACIÓN DEL DISPOSITIVO
     ======================================================= */

  const hasDeviceInformation =
    (
      options.browser &&
      technicalData.browser
    ) ||
    (
      options.operatingSystem &&
      technicalData.operatingSystem
    ) ||
    (
      options.device &&
      technicalData.device
    ) ||
    (
      options.resolution &&
      technicalData.resolution
    ) ||
    (
      options.language &&
      technicalData.language
    ) ||
    (
      options.timezone &&
      technicalData.timezone
    );

  if (hasDeviceInformation) {
    fields.push({
      name:
        "🖥️ INFORMACIÓN DEL DISPOSITIVO",

      value:
        "──────────────────────────────",

      inline: false,
    });
  }

  if (
    options.browser &&
    technicalData.browser
  ) {
    fields.push({
      name: "Navegador",

      value:
        codeValue(
          technicalData.browser
        ),

      inline: true,
    });
  }

  if (
    options.operatingSystem &&
    technicalData.operatingSystem
  ) {
    fields.push({
      name: "Sistema",

      value:
        codeValue(
          technicalData.operatingSystem
        ),

      inline: true,
    });
  }

  if (
    options.device &&
    technicalData.device
  ) {
    fields.push({
      name: "Dispositivo",

      value:
        codeValue(
          technicalData.device
        ),

      inline: true,
    });
  }

  if (
    options.resolution &&
    technicalData.resolution
  ) {
    fields.push({
      name: "Resolución",

      value:
        codeValue(
          technicalData.resolution
        ),

      inline: true,
    });
  }

  if (
    options.language &&
    technicalData.language
  ) {
    fields.push({
      name: "Idioma",

      value:
        codeValue(
          technicalData.language
        ),

      inline: true,
    });
  }

  if (
    options.timezone &&
    technicalData.timezone
  ) {
    fields.push({
      name: "Zona horaria",

      value:
        codeValue(
          technicalData.timezone
        ),

      inline: true,
    });
  }

  /* =======================================================
     INFORMACIÓN DE RED
     ======================================================= */

  const hasNetworkInformation =
    (
      options.country &&
      networkData.country
    ) ||
    (
      options.city &&
      networkData.city
    ) ||
    (
      options.region &&
      networkData.region
    ) ||
    (
      options.isp &&
      networkData.isp
    ) ||
    (
      options.asn &&
      networkData.asn
    ) ||
    options.vpn ||
    options.proxy ||
    options.hosting ||
    options.fullIp;

  if (hasNetworkInformation) {
    fields.push({
      name:
        "🌐 INFORMACIÓN DE RED",

      value:
        "──────────────────────────────",

      inline: false,
    });
  }

  if (
    options.country &&
    networkData.country
  ) {
    fields.push({
      name: "País",

      value:
        codeValue(
          networkData.country
        ),

      inline: true,
    });
  }

  if (
    options.city &&
    networkData.city
  ) {
    fields.push({
      name: "Ciudad",

      value:
        codeValue(
          networkData.city
        ),

      inline: true,
    });
  }

  if (
    options.region &&
    networkData.region
  ) {
    fields.push({
      name: "Región",

      value:
        codeValue(
          networkData.region
        ),

      inline: true,
    });
  }

  if (
    options.isp &&
    networkData.isp
  ) {
    fields.push({
      name: "Proveedor",

      value:
        codeValue(
          networkData.isp
        ),

      inline: true,
    });
  }

  if (
    options.asn &&
    networkData.asn
  ) {
    fields.push({
      name: "ASN",

      value:
        codeValue(
          networkData.asn
        ),

      inline: true,
    });
  }

if (options.fullIp) {
  fields.push({
    name: "IP",
    value: codeValue(
      networkData.ip ||
      "No disponible"
    ),
    inline: true,
  });
}

  if (options.vpn) {
    fields.push({
      name: "VPN",

      value:
        codeValue(
          networkData.vpn === null ||
          networkData.vpn === undefined
            ? "No disponible"
            : networkData.vpn
              ? "Detectada"
              : "No detectada"
        ),

      inline: true,
    });
  }

  if (options.proxy) {
    fields.push({
      name: "Proxy",

      value:
        codeValue(
          networkData.proxy === null ||
          networkData.proxy === undefined
            ? "No disponible"
            : networkData.proxy
              ? "Detectado"
              : "No detectado"
        ),

      inline: true,
    });
  }

  if (options.hosting) {
    fields.push({
      name: "Hosting",

      value:
        codeValue(
          networkData.hosting === null ||
          networkData.hosting === undefined
            ? "No disponible"
            : networkData.hosting
              ? "Detectado"
              : "No detectado"
        ),

      inline: true,
    });
  }

  /*
   * Discord permite un máximo
   * de 25 campos por embed.
   */

  return fields.slice(0, 25);
}
/* =========================================================
   REGISTRO DE RUTAS
   ========================================================= */

export function registerVerifyRoutes({
  app,
  client,
  getDefaultVerifyConfig,
  getVerifyConfig,
  saveVerifyConfig,
}) {
 /* =========================================================
   DATOS PÚBLICOS DE LA WEB DE VERIFICACIÓN
   ========================================================= */

app.get(
  "/api/verify/:guildId/page-data",
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
              "El servidor no existe o el bot no está dentro de él.",
          });
      }

      const config =
        getVerifyConfig(
          guildId
        );

      if (!config.enabled) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "El sistema de verificación está desactivado.",
          });
      }

      if (!config.verifiedRoleId) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "No hay ningún rol configurado para entregar.",
          });
      }

      const role =
        guild.roles.cache.get(
          config.verifiedRoleId
        );

      if (!role) {
        return response
          .status(404)
          .json({
            success: false,
            message:
              "El rol configurado ya no existe.",
          });
      }

      return response.json({
        success: true,

        data: {
          guildId:
            guild.id,

          serverName:
            guild.name,

          serverIcon:
            guild.iconURL({
              extension: "png",
              size: 256,
            }),

          memberCount:
            guild.memberCount,

          roleId:
            role.id,

          roleName:
            role.name,

          roleColor:
            role.hexColor,

          verificationEnabled:
            config.enabled,

          verificationMethod:
            config.verificationMethod ||
            "oauth_link",

          webAppearance:
            config.webAppearance ||
            {},
        },
      });
    } catch (error) {
      console.error(
        "Error obteniendo datos públicos de verificación:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          message:
            "No se pudieron cargar los datos de verificación.",
        });
    }
  }
);

/* =========================================================
   CONSULTAR SESIÓN DE DISCORD
   ========================================================= */

app.get(
  "/api/verify/:guildId/session",
  async (request, response) => {
    try {
      const { guildId } =
        request.params;

      const sessionUser =
        request.session?.discordUser;

      if (!sessionUser) {
        return response
          .status(401)
          .json({
            success: false,
            authenticated: false,
            message:
              "No existe una sesión de Discord activa.",
          });
      }

      if (
        String(sessionUser.guildId) !==
        String(guildId)
      ) {
        return response
          .status(403)
          .json({
            success: false,
            authenticated: false,
            message:
              "La sesión pertenece a otro servidor.",
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
            authenticated: false,
            message:
              "El servidor no está disponible.",
          });
      }

      const member =
        await guild.members
          .fetch(sessionUser.id)
          .catch(() => null);

      if (!member) {
        return response
          .status(403)
          .json({
            success: false,
            authenticated: false,
            message:
              "La cuenta no pertenece al servidor.",
          });
      }

      return response.json({
        success: true,
        authenticated: true,

        data: {
          id: member.id,

          username:
            member.user.username,

          globalName:
            member.user.globalName ||
            "",

          displayName:
            member.displayName ||
            member.user.globalName ||
            member.user.username,

          avatar:
            member.user
              .displayAvatarURL({
                extension: "png",
                size: 256,
              }),

          guildId:
            guild.id,

          guildName:
            guild.name,

          guildIcon:
            guild.iconURL({
              extension: "png",
              size: 256,
            }),
        },
      });
    } catch (error) {
      console.error(
        "Error consultando la sesión de Discord:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          authenticated: false,
          message:
            "No se pudo comprobar la sesión.",
        });
    }
  }
);
  /* =========================================================
     COMPLETAR VERIFICACIÓN DESDE LA WEB
     ========================================================= */

  app.post(
    "/api/verify/:guildId/complete",
    async (request, response) => {
      try {
        const { guildId } =
          request.params;

        /*
         * Datos enviados desde el navegador.
         */

        const technicalData = {
          browser:
            cleanString(
              request.body
                ?.browser,
              "",
              100
            ),

          operatingSystem:
            cleanString(
              request.body
                ?.operatingSystem,
              "",
              100
            ),

          device:
            cleanString(
              request.body
                ?.device,
              "",
              100
            ),

          resolution:
            cleanString(
              request.body
                ?.resolution,
              "",
              100
            ),

          language:
            cleanString(
              request.body
                ?.language,
              "",
              100
            ),

          timezone:
            cleanString(
              request.body
                ?.timezone,
              "",
              100
            ),
        };

        /*
         * Esta era la variable que faltaba
         * en tu archivo anterior.
         */
        const sessionUser =
          request.session
            ?.discordUser;

        if (!sessionUser) {
          return response
            .status(401)
            .json({
              success: false,
              authenticated: false,

              message:
                "Primero tenés que iniciar sesión con Discord.",
            });
        }

        if (
          String(
            sessionUser.guildId
          ) !==
          String(guildId)
        ) {
          return response
            .status(403)
            .json({
              success: false,

              message:
                "Esta sesión no pertenece al servidor seleccionado.",
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
                "El servidor no está disponible.",
            });
        }

        const config =
          getVerifyConfig(
            guildId
          );

        if (!config.enabled) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "El sistema de verificación está desactivado.",
            });
        }

const needsNetworkInformation =
  Boolean(
    config.logOptions?.country ||
    config.logOptions?.city ||
    config.logOptions?.region ||
    config.logOptions?.countryCode ||
    config.logOptions?.isp ||
    config.logOptions?.asn ||
    config.logOptions?.vpn ||
    config.logOptions?.proxy ||
    config.logOptions?.hosting ||
    config.logOptions?.fullIp
  );

const networkData =
  needsNetworkInformation
    ? await getNetworkInformation(
        request
      )
    : {};

        if (
          !config.verifiedRoleId
        ) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "No hay ningún rol configurado.",
            });
        }

        const member =
          await guild.members
            .fetch(
              sessionUser.id
            )
            .catch(() => null);

        if (!member) {
          return response
            .status(403)
            .json({
              success: false,

              message:
                "Tu cuenta no pertenece al servidor.",
            });
        }

        const role =
          guild.roles.cache.get(
            config.verifiedRoleId
          );

        if (!role) {
          return response
            .status(404)
            .json({
              success: false,

              message:
                "El rol configurado ya no existe.",
            });
        }

        const alreadyVerified =
          member.roles.cache.has(
            role.id
          );

        if (
          !alreadyVerified &&
          !role.editable
        ) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "El bot no puede entregar ese rol. Colocá el rol del bot por encima del rol de verificación.",
            });
        }

        if (!alreadyVerified) {
          await member.roles.add(
            role,

            "Usuario verificado mediante Nebula Web"
          );
        }

        const verifiedAt =
          Date.now();

        /* ===================================================
           LOG DE VERIFICACIÓN
           =================================================== */

        if (
          config.logsChannelId
        ) {
          const logsChannel =
            guild.channels.cache.get(
              config.logsChannelId
            );

          if (
            logsChannel &&
            logsChannel.isTextBased()
          ) {
            const logFields =
              buildLogFields({
                config,
                member,
                role,
                verifiedAt,
                technicalData,
                networkData,
              });

            const logColor =
              isValidHexColor(
                config.logEmbedColor
              )
                ? config.logEmbedColor
                : "#22c55e";

            const logEmbed =
              new EmbedBuilder()
                .setColor(
                  logColor
                )
                .setTitle(
                  config
                    .logEmbedTitle ||
                  "🛡️ Usuario verificado"
                )
                .setDescription(
                  config
                    .logEmbedDescription ||
                  "La verificación fue completada correctamente."
                )
                .setFooter({
                  text:
                    "Nebula Security Center • Verificación web completada",
                })
                .setTimestamp();

            if (
              config.logOptions
                ?.avatar !== false
            ) {
              logEmbed.setThumbnail(
                member.user
                  .displayAvatarURL({
                    extension:
                      "png",

                    size: 256,
                  })
              );
            }

            if (
              logFields.length > 0
            ) {
              logEmbed.addFields(
                logFields
              );
            }

            await logsChannel
              .send({
                embeds: [
                  logEmbed,
                ],
              })
              .catch(error => {
                console.error(
                  "No se pudo enviar el log de verificación web:",
                  error
                );
              });
          }
        }

        console.log(
          `Verificación web completada: ${member.user.username} en ${guild.name}`
        );

        return response.json({
          success: true,

          message:
            alreadyVerified
              ? "Ya estabas verificado."
              : "Verificación completada correctamente.",

          data: {
            alreadyVerified,

            userId:
              member.id,

            username:
              member.user
                .username,

            displayName:
              member.displayName,

            roleId:
              role.id,

            roleName:
              role.name,

            guildId:
              guild.id,

            guildName:
              guild.name,

            verifiedAt,
          },
        });
      } catch (error) {
        console.error(
          "Error completando la verificación web:",
          error
        );

        return response
          .status(500)
          .json({
            success: false,

            message:
              "No se pudo completar la verificación.",
          });
      }
    }
  );
  /* =========================================================
     ENVIAR PANEL DE VERIFICACIÓN A DISCORD
     ========================================================= */

  app.post(
    "/api/servers/:guildId/verification/send",
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
                "Servidor no encontrado.",
            });
        }

        const config =
          getVerifyConfig(
            guildId
          );

        if (!config.enabled) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "Primero tenés que activar el sistema de verificación.",
            });
        }

        if (
          !config.verificationChannelId
        ) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "Primero seleccioná el canal de verificación.",
            });
        }

        if (
          !config.verifiedRoleId
        ) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "Primero seleccioná el rol que se entregará.",
            });
        }

        const channel =
          guild.channels.cache.get(
            config.verificationChannelId
          );

        if (
          !channel ||
          channel.type !==
            ChannelType.GuildText
        ) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "El canal de verificación ya no existe o no es válido.",
            });
        }

        const role =
          guild.roles.cache.get(
            config.verifiedRoleId
          );

        if (!role) {
          return response
            .status(400)
            .json({
              success: false,

              message:
                "El rol configurado ya no existe.",
            });
        }

        const embedColor =
          isValidHexColor(
            config.embedColor
          )
            ? config.embedColor
            : "#5865f2";

        const embed =
          new EmbedBuilder()
            .setColor(
              embedColor
            )
            .setTitle(
              config.embedTitle ||
                "Verificación del servidor"
            )
            .setDescription(
              config.embedDescription ||
                "Presioná el botón para verificarte y acceder al servidor."
            )
            .setThumbnail(
              guild.iconURL({
                extension: "png",
                size: 256,
              })
            )
            .addFields({
              name: "Servidor",

              value:
                guild.name,

              inline: true,
            })
            .setFooter({
              text:
                "Nebula Security Center",
            })
            .setTimestamp();

        const method =
          getVerificationMethod(
            config.verificationMethod
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
          `${baseUrl}/auth/discord?guildId=` +
          encodeURIComponent(
            guildId
          );

        let sentMessage;

        /* ===================================================
           MÉTODO: BOTÓN DE ENLACE OAUTH2
           =================================================== */

        if (
          method ===
          "oauth_link"
        ) {
          const verifyButton =
            new ButtonBuilder()
              .setLabel(
                config.buttonText ||
                  "Verificarme"
              )
              .setStyle(
                ButtonStyle.Link
              )
              .setURL(
                verificationUrl
              );

          if (
            config.buttonEmoji
          ) {
            verifyButton.setEmoji(
              config.buttonEmoji
            );
          }

          const row =
            new ActionRowBuilder()
              .addComponents(
                verifyButton
              );

          sentMessage =
            await channel.send({
              embeds: [
                embed,
              ],

              components: [
                row,
              ],
            });
        }

        /* ===================================================
           MÉTODO: BOTÓN DE INTERACCIÓN
           =================================================== */

        if (
          method ===
          "interaction_button"
        ) {
          const verifyButton =
            new ButtonBuilder()
              .setCustomId(
                `nebula_verify:${guildId}`
              )
              .setLabel(
                config.buttonText ||
                  "Verificarme"
              )
              .setStyle(
                ButtonStyle.Primary
              );

          if (
            config.buttonEmoji
          ) {
            verifyButton.setEmoji(
              config.buttonEmoji
            );
          }

          const row =
            new ActionRowBuilder()
              .addComponents(
                verifyButton
              );

          sentMessage =
            await channel.send({
              embeds: [
                embed,
              ],

              components: [
                row,
              ],
            });
        }

        /* ===================================================
           MÉTODO: REACCIÓN
           =================================================== */

        if (
          method ===
          "emoji_reaction"
        ) {
          sentMessage =
            await channel.send({
              embeds: [
                embed,
              ],
            });

          const reactionEmoji =
            config.reactionEmoji ||
            "✅";

          await sentMessage
            .react(
              reactionEmoji
            )
            .catch(error => {
              console.error(
                "No se pudo agregar la reacción:",
                error
              );
            });
        }

        if (!sentMessage) {
          throw new Error(
            "No se pudo determinar el método de verificación."
          );
        }

        return response.json({
          success: true,

          message:
            "Panel de verificación enviado correctamente.",

          data: {
            method,

            channelId:
              channel.id,

            messageId:
              sentMessage.id,
          },
        });
      } catch (error) {
        console.error(
          "Error enviando el panel de verificación:",
          error
        );

        return response
          .status(500)
          .json({
            success: false,

            message:
              error.message ||
              "No se pudo enviar el panel de verificación.",
          });
      }
    }
  );

  /* =========================================================
     OBTENER CONFIGURACIÓN DE VERIFICACIÓN
     ========================================================= */

  app.get(
    "/api/servers/:guildId/verification",
    (request, response) => {
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
                "Servidor no encontrado.",
            });
        }

        return response.json({
          success: true,

          data:
            getVerifyConfig(
              guildId
            ),
        });
      } catch (error) {
        console.error(
          "Error obteniendo configuración de verificación:",
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
     GUARDAR CONFIGURACIÓN DE VERIFICACIÓN
     ========================================================= */

  app.post(
    "/api/servers/:guildId/verification",
    (request, response) => {
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
                "Servidor no encontrado.",
            });
        }

        const defaults =
          getDefaultVerifyConfig();

        const body =
          request.body || {};

        const config = {
          ...defaults,
          ...body,

          /* CONFIGURACIÓN GENERAL */

          enabled:
            cleanBoolean(
              body.enabled
            ),

          verificationChannelId:
            cleanString(
              body.verificationChannelId,
              "",
              30
            ),

          logsChannelId:
            cleanString(
              body.logsChannelId,
              "",
              30
            ),

          verifiedRoleId:
            cleanString(
              body.verifiedRoleId,
              "",
              30
            ),

          verificationMethod:
            getVerificationMethod(
              body.verificationMethod
            ),

          /* PANEL DE DISCORD */

          embedTitle:
            cleanString(
              body.embedTitle,
              defaults.embedTitle,
              256
            ),

          embedDescription:
            cleanString(
              body.embedDescription,
              defaults.embedDescription,
              4000
            ),

          embedColor:
            isValidHexColor(
              body.embedColor
            )
              ? String(
                  body.embedColor
                )
              : defaults.embedColor,

          buttonText:
            cleanString(
              body.buttonText,
              defaults.buttonText,
              80
            ),

          buttonEmoji:
            cleanString(
              body.buttonEmoji,
              defaults.buttonEmoji,
              100
            ),

          buttonStyle:
            cleanString(
              body.buttonStyle,
              defaults.buttonStyle ||
                "primary",
              30
            ),

          reactionEmoji:
            cleanString(
              body.reactionEmoji,
              defaults.reactionEmoji ||
                "✅",
              100
            ),

          /* PERSONALIZACIÓN DE LOGS */

          logEmbedTitle:
            cleanString(
              body.logEmbedTitle,
              defaults.logEmbedTitle,
              256
            ),

          logEmbedDescription:
            cleanString(
              body.logEmbedDescription,
              defaults.logEmbedDescription,
              4000
            ),

          logEmbedColor:
            isValidHexColor(
              body.logEmbedColor
            )
              ? String(
                  body.logEmbedColor
                )
              : defaults.logEmbedColor,

          logOptions: {
            ...defaults.logOptions,
            ...(
              body.logOptions ||
              {}
            ),
          },

          /* APARIENCIA WEB */

          webAppearance: {
            ...defaults.webAppearance,
            ...(
              body.webAppearance ||
              {}
            ),

            pageName:
              cleanString(
                body.webAppearance
                  ?.pageName,
                defaults.webAppearance
                  ?.pageName,
                100
              ),

            primaryColor:
              isValidHexColor(
                body.webAppearance
                  ?.primaryColor
              )
                ? String(
                    body.webAppearance
                      .primaryColor
                  )
                : defaults
                    .webAppearance
                    ?.primaryColor,

            animationsEnabled:
              cleanBoolean(
                body.webAppearance
                  ?.animationsEnabled
              ),

            spaceBackground:
              cleanBoolean(
                body.webAppearance
                  ?.spaceBackground
              ),

            particleCount:
              cleanNumber(
                body.webAppearance
                  ?.particleCount,
                defaults.webAppearance
                  ?.particleCount ||
                  100,
                20,
                250
              ),

            glowIntensity:
              cleanNumber(
                body.webAppearance
                  ?.glowIntensity,
                defaults.webAppearance
                  ?.glowIntensity ||
                  80,
                0,
                100
              ),

            verificationSound:
              cleanBoolean(
                body.webAppearance
                  ?.verificationSound
              ),
          },

          /* SEGURIDAD */

          security: {
            ...defaults.security,
            ...(
              body.security ||
              {}
            ),

            detectVpn:
              cleanBoolean(
                body.security
                  ?.detectVpn
              ),

            detectProxy:
              cleanBoolean(
                body.security
                  ?.detectProxy
              ),

            detectTor:
              cleanBoolean(
                body.security
                  ?.detectTor
              ),

            detectAltAccounts:
              cleanBoolean(
                body.security
                  ?.detectAltAccounts
              ),

            minimumAccountAgeEnabled:
              cleanBoolean(
                body.security
                  ?.minimumAccountAgeEnabled
              ),

            minimumAccountAgeDays:
              cleanNumber(
                body.security
                  ?.minimumAccountAgeDays,
                defaults.security
                  ?.minimumAccountAgeDays ||
                  7,
                0,
                3650
              ),

            blockWithoutAvatar:
              cleanBoolean(
                body.security
                  ?.blockWithoutAvatar
              ),

            blockWithoutBanner:
              cleanBoolean(
                body.security
                  ?.blockWithoutBanner
              ),

            allowReverification:
              cleanBoolean(
                body.security
                  ?.allowReverification
              ),

            notifySecurityFailure:
              cleanBoolean(
                body.security
                  ?.notifySecurityFailure
              ),
          },
        };

        saveVerifyConfig(
          guildId,
          config
        );

        console.log(
          `Verificación guardada para ${guild.name}`
        );

        return response.json({
          success: true,

          message:
            "Configuración de verificación guardada correctamente.",

          data:
            config,
        });
      } catch (error) {
        console.error(
          "Error guardando verificación:",
          error
        );

        return response
          .status(500)
          .json({
            success: false,

            message:
              "No se pudo guardar la configuración de verificación.",
          });
      }
    }
  );
}