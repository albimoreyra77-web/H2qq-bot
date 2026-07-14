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

        request.session.discordUser = {
          id: discordUser.id,

          username:
            discordUser.username,

          globalName:
            discordUser.global_name ||
            discordUser.username,

          avatar:
            createDiscordAvatarUrl(
              discordUser
            ),

          guildId,

          displayName:
            member.displayName ||
            discordUser.global_name ||
            discordUser.username,

          authenticatedAt:
            Date.now(),
        };

        delete request.session.oauthState;
        delete request.session.oauthGuildId;

        request.session.save(error => {
          if (error) {
            console.error(
              "No se pudo guardar el usuario:",
              error
            );

            return response
              .status(500)
              .send(
                "No se pudo guardar la sesión."
              );
          }

          response.redirect(
            `/verify/${guildId}?authenticated=1`
          );
        });
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
          "connect.sid"
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