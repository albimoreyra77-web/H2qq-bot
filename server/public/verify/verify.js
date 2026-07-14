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

const verificationCard =
  document.querySelector(
    ".verification-card"
  );

const guildId =
  window.location.pathname
    .split("/")
    .filter(Boolean)
    .at(-1);

let stars = [];
let animationFrameId = null;
let pageIsAuthenticated = false;
let verificationInProgress = false;

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

function wait(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

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

function escapeVerificationText(
  value
) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setButtonState({
  disabled,
  icon,
  text,
  loading = false,
}) {
  if (!completeButton) {
    return;
  }

  completeButton.disabled =
    Boolean(disabled);

  completeButton.classList.toggle(
    "is-loading",
    Boolean(loading)
  );

  completeButton.innerHTML = `
    ${
      loading
        ? `
          <span
            class="verification-button-spinner"
            aria-hidden="true"
          ></span>
        `
        : `
          <span class="button-shield">
            ${icon}
          </span>
        `
    }

    <span class="button-copy">
      ${text}
    </span>

    <span
      class="button-arrow"
      aria-hidden="true"
    >
      ›
    </span>
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
      user.avatar ||
      "https://cdn.discordapp.com/embed/avatars/0.png";

    avatarElement.alt =
      `Avatar de ${user.username}`;
  }

  setButtonState({
    disabled: false,
    icon: "✓",
    text:
      "COMPLETAR VERIFICACIÓN",
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
    text:
      "INICIAR SESIÓN CON DISCORD",
  });
}

function getBrowserInformation() {
  const userAgent =
    navigator.userAgent || "";

  let browser = "Desconocido";

  if (
    userAgent.includes("Edg/")
  ) {
    browser = "Microsoft Edge";
  } else if (
    userAgent.includes("OPR/") ||
    userAgent.includes("Opera")
  ) {
    browser = "Opera";
  } else if (
    userAgent.includes("Firefox/")
  ) {
    browser = "Firefox";
  } else if (
    userAgent.includes("Chrome/")
  ) {
    browser = "Google Chrome";
  } else if (
    userAgent.includes("Safari/")
  ) {
    browser = "Safari";
  }

  let operatingSystem =
    "Desconocido";

  if (
    userAgent.includes("Windows")
  ) {
    operatingSystem = "Windows";
  } else if (
    userAgent.includes("Android")
  ) {
    operatingSystem = "Android";
  } else if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  ) {
    operatingSystem = "iOS";
  } else if (
    userAgent.includes("Mac OS")
  ) {
    operatingSystem = "macOS";
  } else if (
    userAgent.includes("Linux")
  ) {
    operatingSystem = "Linux";
  }

  let device = "Computadora";

  if (
    /Mobi|Android|iPhone/i.test(
      userAgent
    )
  ) {
    device = "Celular";
  } else if (
    /Tablet|iPad/i.test(
      userAgent
    )
  ) {
    device = "Tablet";
  }

  return {
    browser,
    operatingSystem,
    device,
    userAgent,
  };
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
        Accept:
          "application/json",
      },

      credentials:
        "same-origin",
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
      completeButton.disabled =
        true;
    }

    return;
  }

  setStatus(
    "Cargando datos del servidor...",
    "loading"
  );

  try {
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

          credentials:
            "same-origin",
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
      completeButton.disabled =
        true;
    }
  }
}

/* =========================================================
   PANTALLA DE PROCESAMIENTO
   ========================================================= */

function showProcessingScreen({
  title,
  description,
  step,
}) {
  if (!verificationCard) {
    setStatus(
      description,
      "loading"
    );

    return;
  }

  verificationCard.classList.add(
    "verification-processing-state"
  );

  verificationCard.innerHTML = `
    <div class="verification-processing-content">

      <div class="processing-orbit">
        <div class="processing-ring processing-ring-one"></div>
        <div class="processing-ring processing-ring-two"></div>
        <div class="processing-ring processing-ring-three"></div>

        <div class="processing-core">
          <span></span>
        </div>
      </div>

      <span class="processing-eyebrow">
        NEBULA SECURITY CENTER
      </span>

      <h2 id="processingTitle">
        ${escapeVerificationText(
          title
        )}
      </h2>

      <p id="processingDescription">
        ${escapeVerificationText(
          description
        )}
      </p>

      <div class="processing-progress">
        <div class="processing-progress-track">
          <span
            id="processingProgressBar"
            style="width:${step}%"
          ></span>
        </div>

        <small id="processingProgressText">
          ${step}% completado
        </small>
      </div>

      <div class="processing-points">
        <span class="${step >= 25 ? "active" : ""}"></span>
        <span class="${step >= 55 ? "active" : ""}"></span>
        <span class="${step >= 80 ? "active" : ""}"></span>
        <span class="${step >= 100 ? "active" : ""}"></span>
      </div>

    </div>
  `;
}

function updateProcessingScreen({
  title,
  description,
  step,
}) {
  const titleElement =
    document.getElementById(
      "processingTitle"
    );

  const descriptionElement =
    document.getElementById(
      "processingDescription"
    );

  const progressBar =
    document.getElementById(
      "processingProgressBar"
    );

  const progressText =
    document.getElementById(
      "processingProgressText"
    );

  if (titleElement) {
    titleElement.textContent =
      title;
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      description;
  }

  if (progressBar) {
    progressBar.style.width =
      `${step}%`;
  }

  if (progressText) {
    progressText.textContent =
      `${step}% completado`;
  }

  document
    .querySelectorAll(
      ".processing-points span"
    )
    .forEach(
      (point, index) => {
        const limits = [
          25,
          55,
          80,
          100,
        ];

        point.classList.toggle(
          "active",
          step >= limits[index]
        );
      }
    );
}

/* =========================================================
   PANTALLA DE ÉXITO
   ========================================================= */

function showVerificationSuccess(
  verificationData
) {
  verificationInProgress = false;

  document.body.classList.remove(
    "verification-processing"
  );

  if (!verificationCard) {
    setStatus(
      "✓ Verificación completada correctamente.",
      "success"
    );

    return;
  }

  const verifiedDate = new Date(
    verificationData?.verifiedAt ||
    Date.now()
  );

  const dateText =
    verifiedDate.toLocaleDateString(
      "es-AR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  const timeText =
    verifiedDate.toLocaleTimeString(
      "es-AR",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone || "Local";

  const username =
    verificationData?.username ||
    usernameElement?.textContent ||
    "Usuario";

  const displayName =
    verificationData?.displayName ||
    displayNameElement?.textContent ||
    username;

  const userId =
    verificationData?.userId ||
    "No disponible";

  const roleName =
    verificationData?.roleName ||
    "Miembro";

  const guildName =
    verificationData?.guildName ||
    serverNameElement?.textContent ||
    "Servidor de Discord";

  const avatarUrl =
    avatarElement?.src ||
    "https://cdn.discordapp.com/embed/avatars/0.png";

  const alreadyVerified =
    Boolean(
      verificationData?.alreadyVerified
    );

  verificationCard.classList.remove(
    "verification-processing-state",
    "verification-error-state"
  );

  verificationCard.classList.add(
    "verification-success-state"
  );

  verificationCard.innerHTML = `
    <div class="success-page-content">

      <div class="success-check-area">
        <div class="success-check-orbit">
          <div class="success-check-ring"></div>

          <div class="success-check-circle">
            <span>✓</span>
          </div>
        </div>

        <h2>
          ${
            alreadyVerified
              ? "Cuenta verificada"
              : "Verificación exitosa"
          }
        </h2>

        <p>
          ${
            alreadyVerified
              ? "Tu cuenta ya tenía acceso."
              : "Tu cuenta fue verificada correctamente."
          }
        </p>
      </div>

      <section class="success-user-panel">

        <div class="success-user-main">

          <div class="success-avatar-wrap">
            <img
              class="success-user-avatar"
              src="${escapeHtmlAttribute(
                avatarUrl
              )}"
              alt="Avatar de Discord"
            >

            <span
              class="success-online-dot"
              aria-hidden="true"
            ></span>
          </div>

          <div class="success-user-copy">
            <strong>
              ${escapeVerificationText(
                displayName
              )}
            </strong>

            <span>
              ${escapeVerificationText(
                username
              )}
            </span>

            <small>
              ID:
              ${escapeVerificationText(
                userId
              )}
            </small>
          </div>

          <div class="success-role-card">
            <span>ROL ASIGNADO</span>

            <strong>
              @${escapeVerificationText(
                roleName
              )}
            </strong>
          </div>

        </div>

        <div class="success-information">

          <div class="success-info-row">
            <div class="success-info-label">
              <span class="success-info-icon">▣</span>
              SERVIDOR
            </div>

            <strong>
              ${escapeVerificationText(
                guildName
              )}
            </strong>
          </div>

          <div class="success-info-row">
            <div class="success-info-label">
              <span class="success-info-icon">◷</span>
              FECHA
            </div>

            <strong>
              ${escapeVerificationText(
                dateText
              )}
            </strong>
          </div>

          <div class="success-info-row">
            <div class="success-info-label">
              <span class="success-info-icon">◉</span>
              HORA
            </div>

            <strong>
              ${escapeVerificationText(
                timeText
              )}
              <small>
                ${escapeVerificationText(
                  timezone
                )}
              </small>
            </strong>
          </div>

          <div class="success-info-row">
            <div class="success-info-label">
              <span class="success-info-icon">◇</span>
              ESTADO
            </div>

            <strong class="success-authorized">
              Acceso autorizado
              <i></i>
            </strong>
          </div>

        </div>

      </section>

      <a
        class="return-discord-button"
        href="https://discord.com/app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="discord-button-icon">
          ◉
        </span>

        <strong>
          VOLVER A DISCORD
        </strong>

        <span class="discord-button-arrow">
          ↗
        </span>
      </a>

    </div>
  `;
}
/* =========================================================
   PANTALLA DE ERROR
   ========================================================= */

function showVerificationError(
  message
) {
  verificationInProgress =
    false;

  document.body.classList.remove(
    "verification-processing"
  );

  if (!verificationCard) {
    setStatus(
      message,
      "error"
    );

    return;
  }

  verificationCard.classList.remove(
    "verification-processing-state"
  );

  verificationCard.classList.add(
    "verification-error-state"
  );

  verificationCard.innerHTML = `
    <div class="verification-result verification-error-result">

      <div class="error-animation">
        <div class="error-circle">
          <span>!</span>
        </div>
      </div>

      <span class="error-eyebrow">
        VERIFICACIÓN INTERRUMPIDA
      </span>

      <h2>
        No se pudo verificar
      </h2>

      <p>
        ${escapeVerificationText(
          message
        )}
      </p>

      <button
        id="retryVerification"
        class="return-discord-button retry-verification-button"
        type="button"
      >
        <span>↻</span>

        VOLVER A INTENTAR
      </button>

      <small>
        Revisá tu sesión de Discord y los permisos del servidor.
      </small>

    </div>
  `;

  document
    .getElementById(
      "retryVerification"
    )
    ?.addEventListener(
      "click",
      () => {
        window.location.reload();
      }
    );
}

/* =========================================================
   COMPLETAR VERIFICACIÓN
   ========================================================= */

async function completeVerification() {
  const technicalData =
    getBrowserInformation();

  const response = await fetch(
    `/api/verify/${encodeURIComponent(
      guildId
    )}/complete`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },

      credentials:
        "same-origin",

      body: JSON.stringify({
        browser:
          technicalData.browser,

        operatingSystem:
          technicalData.operatingSystem,

        device:
          technicalData.device,

        userAgent:
          technicalData.userAgent,

        resolution:
          `${window.screen.width}x${window.screen.height}`,

        viewport:
          `${window.innerWidth}x${window.innerHeight}`,

        language:
          navigator.language || "",

        timezone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone || "",

        platform:
          navigator.platform || "",

        touchPoints:
          navigator.maxTouchPoints || 0,
      }),
    }
  );

  let result;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta inválida."
    );
  }

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
      "No se pudo completar la verificación."
    );
  }

  return result;
}

/* =========================================================
   BOTÓN PRINCIPAL
   ========================================================= */

completeButton?.addEventListener(
  "click",
  async () => {
    if (
      verificationInProgress ||
      completeButton.disabled
    ) {
      return;
    }

    /*
      Si todavía no inició sesión,
      lo enviamos directamente a OAuth2.
    */

    if (!pageIsAuthenticated) {
      setButtonState({
        disabled: true,
        icon: "…",
        text:
          "ABRIENDO DISCORD",
        loading: true,
      });

      setStatus(
        "Redirigiendo a Discord...",
        "loading"
      );

      window.location.href =
        `/auth/discord?guildId=${encodeURIComponent(
          guildId
        )}`;

      return;
    }

    verificationInProgress =
      true;

    document.body.classList.add(
      "verification-processing"
    );

    try {
      showProcessingScreen({
        title:
          "Verificando tu cuenta",
        description:
          "Estamos comprobando tu sesión de Discord.",
        step: 20,
      });

      await wait(650);

      updateProcessingScreen({
        title:
          "Validando servidor",
        description:
          "Comprobando que pertenecés al servidor seleccionado.",
        step: 45,
      });

      await wait(600);

      updateProcessingScreen({
        title:
          "Registrando datos",
        description:
          "Preparando el registro de seguridad y los datos activados.",
        step: 65,
      });

      /*
        La llamada real al backend ocurre acá.
        El backend entrega el rol y envía el log.
      */

      const result =
        await completeVerification();

      updateProcessingScreen({
        title:
          "Entregando el rol",
        description:
          "Aplicando el rol correspondiente en Discord.",
        step: 85,
      });

      await wait(650);

      updateProcessingScreen({
        title:
          "Finalizando",
        description:
          "La verificación fue completada correctamente.",
        step: 100,
      });

      await wait(550);

      showVerificationSuccess(
        result.data
      );
    } catch (error) {
      console.error(
        "Error completando la verificación:",
        error
      );

      showVerificationError(
        error.message ||
        "No se pudo completar la verificación."
      );
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