const canvas =
  document.getElementById("space");

const context =
  canvas?.getContext("2d");

const completeButton =
  document.getElementById(
    "completeVerification"
  );

const statusElement =
  document.getElementById(
    "verificationStatus"
  );

const usernameElement =
  document.getElementById(
    "discordUsername"
  );

const displayNameElement =
  document.getElementById(
    "discordDisplayName"
  );

const avatarElement =
  document.getElementById(
    "discordAvatar"
  );

const serverNameElement =
  document.getElementById(
    "serverName"
  );

const roleNameElement =
  document.getElementById(
    "roleName"
  );

const roleDisplayElement =
  document.getElementById(
    "roleDisplay"
  );

const serverIconElement =
  document.querySelector(
    ".discord-icon"
  );

const guildId =
  window.location.pathname
    .split("/")
    .filter(Boolean)
    .at(-1);

let stars = [];
let animationFrameId = null;
let pageIsAuthenticated = false;

/* =========================================================
   FONDO ESPACIAL
   ========================================================= */

function createStars() {
  const amount = Math.min(
    115,
    Math.max(
      45,
      Math.floor(
        window.innerWidth / 12
      )
    )
  );

  stars = Array.from(
    { length: amount },
    () => ({
      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      radius:
        Math.random() * 1.4 + 0.25,

      alpha:
        Math.random() * 0.55 + 0.08,

      speed:
        Math.random() * 0.12 + 0.025,

      pulse:
        Math.random() *
        Math.PI *
        2,
    })
  );
}

function resizeCanvas() {
  if (!canvas || !context) {
    return;
  }

  const ratio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width = Math.floor(
    window.innerWidth * ratio
  );

  canvas.height = Math.floor(
    window.innerHeight * ratio
  );

  canvas.style.width =
    `${window.innerWidth}px`;

  canvas.style.height =
    `${window.innerHeight}px`;

  context.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

  createStars();
}

function animateSpace() {
  if (!context) {
    return;
  }

  context.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  for (const star of stars) {
    star.y -= star.speed;
    star.pulse += 0.015;

    if (star.y < -5) {
      star.y =
        window.innerHeight + 5;

      star.x =
        Math.random() *
        window.innerWidth;
    }

    const pulseValue =
      0.72 +
      Math.sin(star.pulse) *
        0.28;

    const alpha = Math.max(
      0,
      star.alpha * pulseValue
    );

    context.beginPath();

    context.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      `rgba(168, 85, 247, ${alpha})`;

    context.fill();
  }

  animationFrameId =
    requestAnimationFrame(
      animateSpace
    );
}

/* =========================================================
   UTILIDADES
   ========================================================= */

function setStatus(
  message = "",
  type = ""
) {
  if (!statusElement) {
    return;
  }

  statusElement.className =
    type
      ? `verification-status ${type}`
      : "verification-status";

  statusElement.textContent =
    message;
}

function escapeHtmlAttribute(
  value
) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setButtonState({
  disabled,
  icon,
  text,
}) {
  if (!completeButton) {
    return;
  }

  completeButton.disabled =
    Boolean(disabled);

  completeButton.innerHTML = `
    <span class="button-shield">
      ${icon}
    </span>

    ${text}
  `;
}

function setRoleInformation(
  roleName,
  roleColor
) {
  const visibleRoleName =
    roleName
      ? `@${roleName}`
      : "@Miembro";

  if (roleNameElement) {
    roleNameElement.textContent =
      visibleRoleName;
  }

  if (roleDisplayElement) {
    roleDisplayElement.textContent =
      visibleRoleName;
  }

  const validRoleColor =
    roleColor &&
    roleColor !== "#000000";

  if (validRoleColor) {
    if (roleNameElement) {
      roleNameElement.style.color =
        roleColor;
    }

    if (roleDisplayElement) {
      roleDisplayElement.style.color =
        roleColor;
    }
  } else {
    roleNameElement?.style.removeProperty(
      "color"
    );

    roleDisplayElement?.style.removeProperty(
      "color"
    );
  }
}

function setServerIcon(
  serverIcon,
  serverName
) {
  if (!serverIconElement) {
    return;
  }

  if (serverIcon) {
    serverIconElement.innerHTML = `
      <img
        src="${escapeHtmlAttribute(
          serverIcon
        )}"
        alt="${escapeHtmlAttribute(
          serverName ||
          "Servidor de Discord"
        )}"
      >
    `;

    serverIconElement.classList.add(
      "has-server-icon"
    );

    return;
  }

  serverIconElement.textContent =
    "◉";

  serverIconElement.classList.remove(
    "has-server-icon"
  );
}

function showAuthenticatedUser(
  user
) {
  pageIsAuthenticated = true;

  if (usernameElement) {
    usernameElement.textContent =
      user.username;
  }

  if (displayNameElement) {
    displayNameElement.textContent =
      user.displayName ||
      user.globalName ||
      user.username;
  }

  if (avatarElement) {
    avatarElement.src =
      user.avatar;

    avatarElement.alt =
      `Avatar de ${user.username}`;
  }

  setButtonState({
    disabled: false,
    icon: "✓",
    text: "COMPLETAR VERIFICACIÓN",
  });
}

function showLoginRequired() {
  pageIsAuthenticated = false;

  if (usernameElement) {
    usernameElement.textContent =
      "Iniciá sesión con Discord";
  }

  if (displayNameElement) {
    displayNameElement.textContent =
      "Tu cuenta aparecerá aquí";
  }

  if (avatarElement) {
    avatarElement.src =
      "https://cdn.discordapp.com/embed/avatars/0.png";

    avatarElement.alt =
      "Avatar de Discord";
  }

  setButtonState({
    disabled: false,
    icon: "↗",
    text: "INICIAR SESIÓN CON DISCORD",
  });
}

/* =========================================================
   CONSULTAR SESIÓN DE DISCORD
   ========================================================= */

async function getDiscordSession() {
  const response = await fetch(
    `/api/verify/${encodeURIComponent(
      guildId
    )}/session`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },

      credentials: "same-origin",
    }
  );

  const result =
    await response.json();

  return {
    response,
    result,
  };
}

/* =========================================================
   CARGAR DATOS REALES
   ========================================================= */

async function loadVerificationPage() {
  if (!guildId) {
    setStatus(
      "No se encontró el ID del servidor.",
      "error"
    );

    if (completeButton) {
      completeButton.disabled = true;
    }

    return;
  }

  setStatus(
    "Cargando datos del servidor...",
    "loading"
  );

  try {
    /*
      Cargamos primero el servidor
      y el rol configurado.
    */

    const pageResponse =
      await fetch(
        `/api/verify/${encodeURIComponent(
          guildId
        )}/page-data`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const pageResult =
      await pageResponse.json();

    if (
      !pageResponse.ok ||
      !pageResult.success
    ) {
      throw new Error(
        pageResult.message ||
          "No se pudieron cargar los datos."
      );
    }

    const pageData =
      pageResult.data;

    if (serverNameElement) {
      serverNameElement.textContent =
        pageData.serverName ||
        "Servidor de Discord";
    }

    setRoleInformation(
      pageData.roleName,
      pageData.roleColor
    );

    setServerIcon(
      pageData.serverIcon,
      pageData.serverName
    );

    /*
      Después comprobamos si el usuario
      ya inició sesión con Discord.
    */

    const {
      response: sessionResponse,
      result: sessionResult,
    } =
      await getDiscordSession();

    if (
      sessionResponse.ok &&
      sessionResult.success &&
      sessionResult.authenticated
    ) {
      showAuthenticatedUser(
        sessionResult.data
      );
    } else {
      showLoginRequired();
    }

    setStatus("");

    console.log(
      "Datos reales de verificación:",
      {
        server: pageData,
        session: sessionResult,
      }
    );
  } catch (error) {
    console.error(
      "Error cargando la página:",
      error
    );

    setStatus(
      error.message ||
        "No se pudo cargar la verificación.",
      "error"
    );

    if (completeButton) {
      completeButton.disabled = true;
    }
  }
}

/* =========================================================
   BOTÓN PRINCIPAL
   ========================================================= */

completeButton?.addEventListener(
  "click",
  async () => {
    setButtonState({
      disabled: true,
      icon: "…",
      text: "COMPROBANDO SESIÓN",
    });

    setStatus(
      "Comprobando tu cuenta de Discord...",
      "loading"
    );

    try {
      const {
        response: sessionResponse,
        result: sessionResult,
      } =
        await getDiscordSession();

      /*
        Si no está autenticado,
        lo mandamos al OAuth2.
      */

      if (
        sessionResponse.status === 401 ||
        !sessionResult.authenticated
      ) {
        window.location.href =
          `/auth/discord?guildId=${encodeURIComponent(
            guildId
          )}`;

        return;
      }

      if (
        !sessionResponse.ok ||
        !sessionResult.success
      ) {
        throw new Error(
          sessionResult.message ||
            "No se pudo comprobar la sesión."
        );
      }

      pageIsAuthenticated = true;

      showAuthenticatedUser(
        sessionResult.data
      );

      /*
        Todavía no entregamos el rol.
        En el siguiente paso conectamos
        la ruta de verificación final.
      */

      setStatus(
        "✓ Sesión de Discord verificada.",
        "success"
      );

      setButtonState({
        disabled: false,
        icon: "✓",
        text: "COMPLETAR VERIFICACIÓN",
      });
    } catch (error) {
      console.error(
        "Error comprobando la sesión:",
        error
      );

      setStatus(
        error.message ||
          "No se pudo comprobar la sesión.",
        "error"
      );

      setButtonState({
        disabled: false,
        icon: "!",
        text: pageIsAuthenticated
          ? "VOLVER A INTENTAR"
          : "INICIAR SESIÓN CON DISCORD",
      });
    }
  }
);

/* =========================================================
   INICIAR PÁGINA
   ========================================================= */

function initializePage() {
  if (!canvas || !context) {
    console.error(
      "No se encontró el canvas del fondo."
    );
  } else {
    resizeCanvas();

    if (animationFrameId) {
      cancelAnimationFrame(
        animationFrameId
      );
    }

    animateSpace();
  }

  loadVerificationPage();
}

/* =========================================================
   EVENTOS DEL NAVEGADOR
   ========================================================= */

let resizeTimer = null;

window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(
      () => {
        resizeCanvas();
      },
      120
    );
  }
);

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(
          animationFrameId
        );

        animationFrameId = null;
      }

      return;
    }

    if (!animationFrameId) {
      animateSpace();
    }
  }
);

initializePage();