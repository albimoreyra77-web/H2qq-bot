import crypto from "node:crypto";

const DISCORD_API_URL =
  "https://discord.com/api/v10";

function createDiscordAvatarUrl(user) {
  if (!user?.avatar) {
    const defaultAvatarIndex =
      user?.discriminator &&
      user.discriminator !== "0"
        ? Number(user.discriminator) % 5
        : Number(
            (BigInt(user.id) >> 22n) % 6n
          );

    return (
      "https://cdn.discordapp.com/embed/avatars/" +
      `${defaultAvatarIndex}.png`
    );
  }

  const extension =
    user.avatar.startsWith("a_")
      ? "gif"
      : "png";

  return (
    "https://cdn.discordapp.com/avatars/" +
    `${user.id}/${user.avatar}.${extension}` +
    "?size=256"
  );
}

function getRequiredEnvironmentVariables() {
  const clientId =
    process.env.DISCORD_CLIENT_ID;

  const clientSecret =
    process.env.DISCORD_CLIENT_SECRET;

  const redirectUri =
    process.env.DISCORD_REDIRECT_URI;

  if (
    !clientId ||
    !clientSecret ||
    !redirectUri
  ) {
    throw new Error(
      "Faltan variables OAuth2 en el archivo .env"
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

export function registerAuthRoutes({
  app,
  client,
  oauthTickets,
  oauthTicketDuration,
}) {

  /* =========================================================
     INICIAR AUTORIZACIÓN CON DISCORD
     ========================================================= */

  app.get(
    "/auth/discord",
    (request, response) => {
      try {
        const guildId = String(
          request.query.guildId || ""
        );

        if (!guildId) {
          return response.status(400).send(
            "Falta el ID del servidor."
          );
        }

        const guild =
          client.guilds.cache.get(guildId);

        if (!guild) {
          return response.status(404).send(
            "El servidor no existe o el bot no está dentro."
          );
        }

        const {
          clientId,
          redirectUri,
        } =
          getRequiredEnvironmentVariables();

        const state =
          crypto.randomBytes(32).toString(
            "hex"
          );

        request.session.oauthState =
          state;

        request.session.oauthGuildId =
          guildId;

        request.session.discordUser =
          null;

        const authorizationUrl =
          new URL(
            "https://discord.com/oauth2/authorize"
          );

        authorizationUrl.searchParams.set(
          "client_id",
          clientId
        );

        authorizationUrl.searchParams.set(
          "redirect_uri",
          redirectUri
        );

        authorizationUrl.searchParams.set(
          "response_type",
          "code"
        );

        /*
          Solamente identify:
          no solicita acceso al correo.
        */
        authorizationUrl.searchParams.set(
          "scope",
          "identify"
        );

        authorizationUrl.searchParams.set(
          "state",
          state
        );

        authorizationUrl.searchParams.set(
          "prompt",
          "consent"
        );

        request.session.save(error => {
          if (error) {
            console.error(
              "No se pudo guardar la sesión OAuth:",
              error
            );

            return response
              .status(500)
              .send(
                "No se pudo iniciar la autenticación."
              );
          }

          response.redirect(
            authorizationUrl.toString()
          );
        });
      } catch (error) {
        console.error(
          "Error iniciando OAuth2:",
          error
        );

        response.status(500).send(
          "No se pudo iniciar sesión con Discord."
        );
      }
    }
  );

  /* =========================================================
     RETORNO DE DISCORD
     ========================================================= */

  app.get(
    "/auth/discord/callback",
    async (request, response) => {
      try {
        const code = String(
          request.query.code || ""
        );

        const returnedState = String(
          request.query.state || ""
        );

        const storedState =
          request.session.oauthState;

        const guildId =
          request.session.oauthGuildId;

        if (request.query.error) {
          return response.redirect(
            guildId
              ? `/verify/${guildId}?error=authorization_cancelled`
              : "/?error=authorization_cancelled"
          );
        }

        if (!code) {
          return response.status(400).send(
            "Discord no devolvió el código de autorización."
          );
        }

        if (
          !storedState ||
          !returnedState ||
          returnedState !== storedState
        ) {
          return response.status(403).send(
            "La solicitud de autenticación no es válida o expiró."
          );
        }

        if (!guildId) {
          return response.status(400).send(
            "No se encontró el servidor asociado a la sesión."
          );
        }

        const guild =
          client.guilds.cache.get(guildId);

        if (!guild) {
          return response.status(404).send(
            "El servidor ya no está disponible."
          );
        }

        const {
          clientId,
          clientSecret,
          redirectUri,
        } =
          getRequiredEnvironmentVariables();

        const tokenBody =
          new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type:
              "authorization_code",
            code,
            redirect_uri: redirectUri,
          });

        const tokenResponse =
          await fetch(
            `${DISCORD_API_URL}/oauth2/token`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded",
              },

              body: tokenBody,
            }
          );

        const tokenData =
          await tokenResponse.json();

        if (
          !tokenResponse.ok ||
          !tokenData.access_token
        ) {
          console.error(
            "Respuesta del token de Discord:",
            tokenData
          );

          throw new Error(
            "Discord rechazó el código de autorización."
          );
        }

        const userResponse =
          await fetch(
            `${DISCORD_API_URL}/users/@me`,
            {
              headers: {
                Authorization:
                  `Bearer ${tokenData.access_token}`,
              },
            }
          );

        const discordUser =
          await userResponse.json();

        if (
          !userResponse.ok ||
          !discordUser.id
        ) {
          console.error(
            "Respuesta del usuario de Discord:",
            discordUser
          );

          throw new Error(
            "No se pudo obtener el usuario de Discord."
          );
        }

        /*
          Verificamos que el usuario realmente
          pertenezca al servidor seleccionado.
        */
        const member =
          await guild.members
            .fetch(discordUser.id)
            .catch(() => null);

        if (!member) {
          request.session.discordUser =
            null;

          return response.redirect(
            `/verify/${guildId}?error=not_a_member`
          );
        }

const now =
  Date.now();

const authCode =
  crypto
    .randomBytes(48)
    .toString("hex");

const ticket = {
  guildId:
    String(guildId),

  userId:
    String(discordUser.id),

  username:
    discordUser.username,

  globalName:
    discordUser.global_name ||
    discordUser.username,

  avatar:
    createDiscordAvatarUrl(
      discordUser
    ),

  displayName:
    member.displayName ||
    discordUser.global_name ||
    discordUser.username,

  createdAt:
    now,

  createdAtIso:
    new Date(
      now
    ).toISOString(),

  expiresAt:
    now +
    oauthTicketDuration,

  expiresAtIso:
    new Date(
      now +
      oauthTicketDuration
    ).toISOString(),

  userAgent:
    String(
      request.headers[
        "user-agent"
      ] ||
      ""
    ).slice(0, 500),

  ip:
    String(
      request.ip ||
      request.socket
        ?.remoteAddress ||
      ""
    ).slice(0, 100),
};

oauthTickets.set(
  authCode,
  ticket
);

delete request.session.oauthState;
delete request.session.oauthGuildId;
delete request.session.discordUser;

console.log(
  "Código temporal OAuth creado:",
  {
    guildId:
      ticket.guildId,

    userId:
      ticket.userId,

    createdAt:
      ticket.createdAtIso,

    expiresAt:
      ticket.expiresAtIso,
  }
);

const destination =
  new URL(
    `/verify/${guildId}`,
    process.env.PUBLIC_URL ||
    `${request.protocol}://${request.get(
      "host"
    )}`
  );

destination.searchParams.set(
  "authCode",
  authCode
);

return response.redirect(
  destination.toString()
);

           } catch (error) {
        console.error(
          "Error procesando OAuth2:",
          error
        );

        const guildId =
          request.session
            ?.oauthGuildId;

        response.redirect(
          guildId
            ? `/verify/${guildId}?error=oauth_failed`
            : "/?error=oauth_failed"
        );
      }
    }
  );
/* =========================================================
   INTERCAMBIAR CÓDIGO TEMPORAL
   ========================================================= */

app.post(
  "/api/verify/:guildId/exchange",
  async (request, response) => {
    try {
      const guildId =
        String(
          request.params.guildId ||
          ""
        );

      const authCode =
        String(
          request.body
            ?.authCode ||
          ""
        ).trim();

      if (
        !authCode ||
        !/^[a-f0-9]{96}$/i.test(
          authCode
        )
      ) {
        return response
          .status(400)
          .json({
            success: false,
            authenticated: false,
            message:
              "El código de autenticación no es válido.",
          });
      }

      const ticket =
        oauthTickets.get(
          authCode
        );

      if (!ticket) {
        return response
          .status(401)
          .json({
            success: false,
            authenticated: false,
            message:
              "El código ya fue utilizado, venció o no existe.",
          });
      }

      if (
        ticket.expiresAt <=
        Date.now()
      ) {
        oauthTickets.delete(
          authCode
        );

        return response
          .status(401)
          .json({
            success: false,
            authenticated: false,
            message:
              "El código de autenticación venció.",
          });
      }

      if (
        String(
          ticket.guildId
        ) !== guildId
      ) {
        return response
          .status(403)
          .json({
            success: false,
            authenticated: false,
            message:
              "El código pertenece a otro servidor.",
          });
      }

      const guild =
        client.guilds.cache.get(
          guildId
        );

      if (!guild) {
        oauthTickets.delete(
          authCode
        );

        return response
          .status(404)
          .json({
            success: false,
            authenticated: false,
            message:
              "El servidor ya no está disponible.",
          });
      }

      const member =
        await guild.members
          .fetch(
            ticket.userId
          )
          .catch(
            () => null
          );

      if (!member) {
        oauthTickets.delete(
          authCode
        );

        return response
          .status(403)
          .json({
            success: false,
            authenticated: false,
            message:
              "La cuenta no pertenece al servidor.",
          });
      }

      request.session
        .discordUser = {
          id:
            ticket.userId,

          username:
            ticket.username,

          globalName:
            ticket.globalName,

          avatar:
            ticket.avatar,

          guildId:
            ticket.guildId,

          displayName:
            ticket.displayName,

          authenticatedAt:
            Date.now(),

          oauthCreatedAt:
            ticket.createdAt,

          oauthExpiresAt:
            ticket.expiresAt,
        };

      request.session.save(
        error => {
          if (error) {
            console.error(
              "No se pudo guardar la sesión intercambiada:",
              error
            );

            return response
              .status(500)
              .json({
                success: false,
                authenticated: false,
                message:
                  "No se pudo guardar la autenticación.",
              });
          }

          /*
            Se elimina después de guardar
            correctamente la sesión.
            Ya no puede utilizarse otra vez.
          */
          oauthTickets.delete(
            authCode
          );

          console.log(
            "Código OAuth intercambiado y eliminado:",
            {
              guildId:
                ticket.guildId,

              userId:
                ticket.userId,

              createdAt:
                ticket.createdAtIso,

              exchangedAt:
                new Date()
                  .toISOString(),
            }
          );

          return response.json({
            success: true,
            authenticated: true,

            data: {
              id:
                member.id,

              username:
                member.user
                  .username,

              globalName:
                member.user
                  .globalName ||
                ticket.globalName ||
                "",

              displayName:
                member.displayName ||
                member.user
                  .globalName ||
                member.user
                  .username,

              avatar:
                member.user
                  .displayAvatarURL({
                    extension:
                      "png",

                    size:
                      256,
                  }),

              guildId:
                guild.id,

              guildName:
                guild.name,

              guildIcon:
                guild.iconURL({
                  extension:
                    "png",

                  size:
                    256,
                }),

              authenticatedAt:
                Date.now(),
            },
          });
        }
      );
    } catch (error) {
      console.error(
        "Error intercambiando código OAuth:",
        error
      );

      return response
        .status(500)
        .json({
          success: false,
          authenticated: false,
          message:
            "No se pudo completar el intercambio de autenticación.",
        });
    }
  }
);

  /* =========================================================
     DATOS DEL USUARIO AUTENTICADO
     ========================================================= */

  app.get(
    "/api/verify/:guildId/session",
    async (request, response) => {
      try {
        const { guildId } =
          request.params;

        const sessionUser =
          request.session.discordUser;

        if (
          !sessionUser ||
          sessionUser.guildId !== guildId
        ) {
          return response.status(401).json({
            success: false,
            authenticated: false,
            message:
              "Todavía no iniciaste sesión con Discord.",
          });
        }

        const guild =
          client.guilds.cache.get(guildId);

        if (!guild) {
          return response.status(404).json({
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
          request.session.discordUser =
            null;

          return response.status(403).json({
            success: false,
            authenticated: false,
            message:
              "Tu cuenta no pertenece al servidor.",
          });
        }

        const user =
          member.user;

        response.json({
          success: true,
          authenticated: true,

          data: {
            id: user.id,

            username:
              user.username,

            displayName:
              member.displayName ||
              user.globalName ||
              user.username,

            globalName:
              user.globalName ||
              user.username,

            avatar:
              user.displayAvatarURL({
                extension: "png",
                size: 256,
              }),

            guildId:
              guild.id,

            serverName:
              guild.name,
          },
        });
      } catch (error) {
        console.error(
          "Error consultando la sesión:",
          error
        );

        response.status(500).json({
          success: false,
          authenticated: false,
          message:
            "No se pudo consultar la sesión.",
        });
      }
    }
  );

  /* =========================================================
     CERRAR SESIÓN
     ========================================================= */

  app.post(
    "/auth/discord/logout",
    (request, response) => {
      request.session.destroy(error => {
        if (error) {
          return response.status(500).json({
            success: false,
            message:
              "No se pudo cerrar la sesión.",
          });
        }

      response.clearCookie(
  "nebula.sid",
  {
    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite:
      process.env.NODE_ENV ===
      "production"
        ? "none"
        : "lax",
  }
);

        response.json({
          success: true,
          message:
            "Sesión cerrada correctamente.",
        });
      });
    }
  );

  console.log(
    "Rutas OAuth2 preparadas correctamente"
  );
}