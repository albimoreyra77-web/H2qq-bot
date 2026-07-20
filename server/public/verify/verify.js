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
let currentPreviewAppearance = {};

/*
  Token temporal recibido después del OAuth.
  Se conserva solamente en esta pestaña.
*/
const verificationTokenStorageKey =
  `nebulaVerificationToken:${guildId}`;

let currentVerificationToken =
  sessionStorage.getItem(
    verificationTokenStorageKey
  ) || "";

/*
  Lee el token privado enviado por el botón
  de interacción de Discord.
*/

function importVerificationTokenFromUrl() {
  const currentUrl =
    new URL(
      window.location.href
    );

  const urlToken =
    String(
      currentUrl.searchParams.get(
        "verificationToken"
      ) ||
      ""
    ).trim();

  if (!urlToken) {
    return false;
  }

  if (
    !/^[a-f0-9]{96}$/i.test(
      urlToken
    )
  ) {
    currentUrl.searchParams.delete(
      "verificationToken"
    );

    window.history.replaceState(
      {},
      document.title,
      `${currentUrl.pathname}${
        currentUrl.search
      }${currentUrl.hash}`
    );

    throw new Error(
      "El enlace privado de verificación no es válido."
    );
  }

  currentVerificationToken =
    urlToken;

  sessionStorage.setItem(
    verificationTokenStorageKey,
    currentVerificationToken
  );

  /*
    Sacamos el token de la barra de direcciones
    para que no quede visible ni se copie por error.
  */

  currentUrl.searchParams.delete(
    "verificationToken"
  );

  window.history.replaceState(
    {},
    document.title,
    `${currentUrl.pathname}${
      currentUrl.search
    }${currentUrl.hash}`
  );

  return true;
}

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
  hexToRgba(
    currentPreviewAppearance.primaryColor ||
      "#a855f7",
    alpha
  );

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
  disabled: true,
  icon: "!",
  text:
    "VOLVÉ A DISCORD",
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
   INTERCAMBIAR CÓDIGO OAUTH TEMPORAL
   ========================================================= */

async function exchangeTemporaryAuthCode() {
  const currentUrl =
    new URL(
      window.location.href
    );

  const authCode =
    currentUrl.searchParams.get(
      "authCode"
    );

  if (!authCode) {
    return null;
  }

  setStatus(
    "Conectando tu cuenta de Discord...",
    "loading"
  );

  const response =
    await fetch(
      `/api/verify/${encodeURIComponent(
        guildId
      )}/exchange`,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        credentials:
          "include",

        body:
          JSON.stringify({
            authCode,
          }),
      }
    );

  let result;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "El servidor devolvió una respuesta inválida al autenticar."
    );
  }

  /*
    Quitamos el código OAuth de la URL
    para que no quede visible ni pueda
    reutilizarse desde el historial.
  */
  currentUrl.searchParams.delete(
    "authCode"
  );

  currentUrl.searchParams.delete(
    "authenticated"
  );

  window.history.replaceState(
    {},
    document.title,
    `${currentUrl.pathname}${
      currentUrl.search
    }${currentUrl.hash}`
  );

  if (
    !response.ok ||
    !result.success ||
    !result.authenticated ||
    !result.verificationToken
  ) {
    throw new Error(
      result.message ||
      "No se pudo conectar la cuenta de Discord."
    );
  }

  currentVerificationToken =
    result.verificationToken;

  sessionStorage.setItem(
    verificationTokenStorageKey,
    currentVerificationToken
  );

  return result.data;
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
        "include",
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
   CONSULTAR USUARIO MEDIANTE TOKEN
   ========================================================= */

async function getTokenSession() {
  if (!currentVerificationToken) {
    return {
      response: null,
      result: null,
    };
  }

  const response =
    await fetch(
      `/api/verify/${encodeURIComponent(
        guildId
      )}/token-session`,
      {
        method:
          "GET",

        headers: {
          Accept:
            "application/json",

          "x-verification-token":
            currentVerificationToken,
        },

        credentials:
          "include",
      }
    );

  let result;

  try {
    result =
      await response.json();
  } catch {
    result = {
      success: false,
      authenticated: false,
      message:
        "El servidor devolvió una respuesta inválida.",
    };
  }

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    currentVerificationToken =
      "";

    sessionStorage.removeItem(
      verificationTokenStorageKey
    );
  }

  return {
    response,
    result,
  };
}

/* =========================================================
   CARGAR DATOS REALES
   ========================================================= */

async function loadVerificationPage() {
  try {
    importVerificationTokenFromUrl();
  } catch (error) {
    console.error(
      "Error leyendo el enlace privado:",
      error
    );

    setStatus(
      error.message ||
      "El enlace privado no es válido.",
      "error"
    );

    if (completeButton) {
      completeButton.disabled =
        true;
    }

    return;
  }

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
          method:
            "GET",

          headers: {
            Accept:
              "application/json",
          },

          credentials:
            "include",
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

    const exchangedUser =
      await exchangeTemporaryAuthCode();

    if (exchangedUser) {
      showAuthenticatedUser(
        exchangedUser
      );

  applyPreviewAppearance({
  ...(pageData.webAppearance || {}),

  successTitle:
    pageData.successTitle ??
    pageData.webAppearance
      ?.successTitle ??
    "✅ Verificación completada",

  successMessage:
    pageData.successMessage ??
    pageData.webAppearance
      ?.successMessage ??
    `Tu cuenta fue verificada correctamente.

¡Bienvenido a {servidor}!

Ya podés acceder a todos los canales.`,

  successColor:
    pageData.successColor ??
    pageData.webAppearance
      ?.successColor ??
    "#22c55e",

  successAnimation:
    pageData.successAnimation ??
    pageData.webAppearance
      ?.successAnimation ??
    "check",

  showCountdown:
    pageData.showCountdown ??
    pageData.webAppearance
      ?.showCountdown ??
    true,

  closePageEnabled:
    pageData.closePageEnabled ??
    pageData.webAppearance
      ?.closePageEnabled ??
    false,
});

      setStatus("");

      console.log(
        "Autenticación temporal completada:",
        exchangedUser
      );

      return;
    }

    const {
      response:
        tokenSessionResponse,

      result:
        tokenSessionResult,
    } =
      await getTokenSession();

    if (
      tokenSessionResponse?.ok &&
      tokenSessionResult?.success &&
      tokenSessionResult?.authenticated
    ) {
      showAuthenticatedUser(
        tokenSessionResult.data
      );
    } else {
      const {
        response:
          sessionResponse,

        result:
          sessionResult,
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
    }

   applyPreviewAppearance({
  ...(pageData.webAppearance || {}),

  successTitle:
    pageData.successTitle ??
    pageData.webAppearance
      ?.successTitle ??
    "✅ Verificación completada",

  successMessage:
    pageData.successMessage ??
    pageData.webAppearance
      ?.successMessage ??
    `Tu cuenta fue verificada correctamente.

¡Bienvenido a {servidor}!

Ya podés acceder a todos los canales.`,

  successColor:
    pageData.successColor ??
    pageData.webAppearance
      ?.successColor ??
    "#22c55e",

  successAnimation:
    pageData.successAnimation ??
    pageData.webAppearance
      ?.successAnimation ??
    "check",

  showCountdown:
    pageData.showCountdown ??
    pageData.webAppearance
      ?.showCountdown ??
    true,

  closePageEnabled:
    pageData.closePageEnabled ??
    pageData.webAppearance
      ?.closePageEnabled ??
    false,
});

    setStatus("");

    console.log(
      "Datos reales de verificación:",
      {
        server:
          pageData,

        authenticated:
          pageIsAuthenticated,

        tokenAvailable:
          Boolean(
            currentVerificationToken
          ),
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

  const activeDesign =
    currentPreviewAppearance
      ?.cardDesign ||
    document.body.dataset
      .cardDesign ||
    "classic";

  const processingContent = `
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
        <span class="${
          step >= 25
            ? "active"
            : ""
        }"></span>

        <span class="${
          step >= 55
            ? "active"
            : ""
        }"></span>

        <span class="${
          step >= 80
            ? "active"
            : ""
        }"></span>

        <span class="${
          step >= 100
            ? "active"
            : ""
        }"></span>
      </div>

    </div>
  `;

  verificationCard.classList.remove(
    "verification-success-state",
    "verification-error-state"
  );

  verificationCard.classList.add(
    "verification-processing-state"
  );

  verificationCard.dataset
    .activeDesign =
    activeDesign;


if (
  activeDesign === "split" ||
  activeDesign === "split_premium"
) {

const splitImageUrl =
  String(
    currentPreviewAppearance
      ?.splitImageUrl ||
    ""
  ).trim();

const splitImageFit =
  currentPreviewAppearance
    ?.splitImageFit ||
  "cover";

const splitImageDarkness =
  Math.min(
    100,
    Math.max(
      0,
      Number(
        currentPreviewAppearance
          ?.splitImageDarkness ??
        45
      )
    )
  ) / 100;

    verificationCard.innerHTML = `
   <div class="split-processing-layout">

     <div class="split-processing-image">

  ${
    splitImageUrl
      ? `

<img
  class="split-processing-background-image"
  src="${escapeHtmlAttribute(
    splitImageUrl
  )}"
  alt=""
  onerror="
    this.style.display='none';
    this.parentElement.classList.add('image-load-failed');
  "
>
      `
      : `
        <div class="split-processing-fallback"></div>
      `
  }

          <div class="split-processing-overlay"></div>

          <div class="split-processing-image-copy">
            <span>VERIFICACIÓN SEGURA</span>

            <strong>
              Protegiendo tu acceso
            </strong>

            <small>
              No cierres esta ventana mientras finaliza el proceso.
            </small>
          </div>
        </div>

        <div class="split-processing-content">
          ${processingContent}
        </div>

      </div>
    `;
const processingImage =
  verificationCard.querySelector(
    ".split-processing-background-image"
  );

if (processingImage) {
  processingImage.style.objectFit =
    splitImageFit;

  processingImage.style.filter =
    `brightness(${
      Math.max(
        0,
        1 - splitImageDarkness
      )
    })`;
}
    return;
  }

  if (
    activeDesign ===
    "terminal"
  ) {
    verificationCard.innerHTML = `
      <div class="terminal-processing-layout">

        <div class="terminal-processing-header">
          <span class="terminal-processing-dot"></span>

          <strong>
            NEBULA SECURITY TERMINAL
          </strong>
        </div>

        <div class="terminal-processing-command">
          <span class="terminal-prefix">
            ${
              currentPreviewAppearance
                ?.terminalPrefix ||
              ">"
            }
          </span>

          <span>
            Ejecutando proceso de verificación...
          </span>
        </div>

        ${processingContent}

      </div>
    `;

    return;
  }

  verificationCard.innerHTML =
    processingContent;
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
let automaticCloseInterval = null;


function startAutomaticCloseTimer(
  seconds = 20,
  {
    showNotice = true,
    closePage = true,
  } = {}
) {

  /*
    Detenemos un temporizador anterior.
  */

  if (automaticCloseInterval) {
    clearInterval(
      automaticCloseInterval
    );

    automaticCloseInterval =
      null;
  }

  /*
    Eliminamos avisos anteriores.
  */

  document
    .getElementById(
      "automaticCloseNotice"
    )
    ?.remove();

  document
    .getElementById(
      "automaticCloseBottomNotice"
    )
    ?.remove();

  /*
    CREAMOS SOLAMENTE
    EL TEMPORIZADOR SUPERIOR.
  */

  const timerNotice =
    document.createElement("aside");

  timerNotice.id =
    "automaticCloseNotice";

  timerNotice.innerHTML = `
    <div class="automatic-mini-icon">
      ◷
    </div>

    <div class="automatic-mini-content">
      <span>
        Cierre automático
      </span>

      <strong id="automaticCloseTimer">
        00:${String(
          seconds
        ).padStart(2, "0")}
      </strong>
    </div>

    <div class="automatic-mini-progress">
      <span
        id="automaticCloseProgressBar"
      ></span>
    </div>
  `;

if (showNotice) {
  document.body.appendChild(
    timerNotice
  );
}

  /*
    ESTILOS DEL TEMPORIZADOR.
  */

  document
    .getElementById(
      "automaticCloseStyles"
    )
    ?.remove();

  const style =
    document.createElement("style");

  style.id =
    "automaticCloseStyles";

  style.textContent = `
    #automaticCloseNotice {
      position: fixed;
      top: 28px;
      right: 32px;

      width: 175px;
      min-height: 72px;

      padding:
        12px
        14px
        17px;

      z-index: 99999;

      display: grid;

      grid-template-columns:
        36px 1fr;

      align-items: center;

      gap: 10px;

      overflow: hidden;

      color: #ffffff;

      border:
        1px solid
        rgba(
          168,
          85,
          247,
          0.48
        );

      border-radius: 14px;

      background:
        linear-gradient(
          145deg,
          rgba(
            13,
            16,
            48,
            0.94
          ),
          rgba(
            7,
            9,
            28,
            0.96
          )
        );

      box-shadow:
        0 14px 38px
        rgba(
          0,
          0,
          0,
          0.42
        ),
        0 0 18px
        rgba(
          139,
          92,
          246,
          0.11
        );

      backdrop-filter:
        blur(14px);

      -webkit-backdrop-filter:
        blur(14px);

      animation:
        automaticMiniEnter
        0.35s
        ease
        both;
    }

    .automatic-mini-icon {
      width: 34px;
      height: 34px;

      display: grid;
      place-items: center;

      border:
        2px solid
        var(
          --purple,
          #a855f7
        );

      border-radius: 50%;

      color:
        var(
          --purple-light,
          #c084fc
        );

      font-size: 17px;
      font-weight: 800;
    }

    .automatic-mini-content {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .automatic-mini-content span {
      color: #d8daea;

      font-size: 10px;
      font-weight: 800;

      letter-spacing: 0.2px;
    }

    #automaticCloseTimer {
      color:
        var(
          --purple-light,
          #c084fc
        );

      font-size: 20px;
      line-height: 1;

      letter-spacing: 0.5px;

      font-variant-numeric:
        tabular-nums;
    }

    .automatic-mini-progress {
      position: absolute;

      right: 13px;
      bottom: 8px;
      left: 13px;

      height: 3px;

      overflow: hidden;

      border-radius: 999px;

      background:
        rgba(
          255,
          255,
          255,
          0.09
        );
    }

    #automaticCloseProgressBar {
      display: block;

      width: 100%;
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          var(
            --purple-dark,
            #6d28d9
          ),
          var(
            --purple,
            #a855f7
          )
        );

      transition:
        width
        1s
        linear;
    }

    #automaticCloseNotice.is-ending {
      border-color:
        rgba(
          244,
          63,
          94,
          0.68
        );
    }

    #automaticCloseNotice.is-ending
    #automaticCloseTimer {
      color: #fb7185;
    }

    #automaticCloseNotice.is-ending
    .automatic-mini-icon {
      color: #fb7185;
      border-color: #fb7185;
    }

    #automaticCloseNotice.is-ending
    #automaticCloseProgressBar {
      background:
        linear-gradient(
          90deg,
          #be123c,
          #fb7185
        );
    }

    @keyframes automaticMiniEnter {
      from {
        opacity: 0;

        transform:
          translateX(20px);
      }

      to {
        opacity: 1;

        transform:
          translateX(0);
      }
    }

    @media (
      max-width: 900px
    ) {
      #automaticCloseNotice {
        top: 12px;
        right: 12px;

        width: 155px;
      }
    }
  `;

  document.head.appendChild(
    style
  );

  const timerElement =
    document.getElementById(
      "automaticCloseTimer"
    );

  const progressBar =
    document.getElementById(
      "automaticCloseProgressBar"
    );

  const totalSeconds =
    Math.max(
      1,
      Number(seconds) || 20
    );

  let remainingSeconds =
    totalSeconds;

  /*
    ACCIÓN FINAL.
  */

  function closeVerificationPage() {
    /*
      Primero reemplazamos todo el contenido.
      Así no quedan visibles los datos.
    */

    document.body.innerHTML = "";

    document.body.style.margin =
      "0";

    document.body.style.background =
      "#000000";

    document.title =
      "Verificación completada";

    /*
      Intento normal de cierre.
      Funciona cuando la pestaña fue abierta
      mediante JavaScript.
    */

    try {
      window.open(
        "",
        "_self"
      );

      window.close();
    } catch (error) {
      console.warn(
        "El navegador bloqueó el cierre:",
        error
      );
    }

    /*
      Si el navegador no permite cerrar
      una pestaña abierta manualmente,
      la enviamos a una página vacía.
    */

    setTimeout(
      () => {
        if (!window.closed) {
          window.location.replace(
            "about:blank"
          );
        }
      },
      150
    );
  }

  function updateAutomaticTimer() {
    if (timerElement) {
      timerElement.textContent =
        `00:${String(
          remainingSeconds
        ).padStart(2, "0")}`;
    }

    if (progressBar) {
      const percentage =
        Math.max(
          0,
          (
            remainingSeconds /
            totalSeconds
          ) * 100
        );

      progressBar.style.width =
        `${percentage}%`;
    }

    timerNotice.classList.toggle(
      "is-ending",
      remainingSeconds <= 5
    );

   if (
  remainingSeconds <= 0
) {
  clearInterval(
    automaticCloseInterval
  );

  automaticCloseInterval =
    null;

 if (closePage) {
  timerNotice.remove();

  try {
    window.open("", "_self");
    window.close();
  } catch (error) {
    console.error(
      "No se pudo cerrar la ventana:",
      error
    );
  }

  /*
    Algunos navegadores no permiten cerrar
    una pestaña que el usuario abrió manualmente.
    Si sigue abierta, mostramos una pantalla final.
  */
  setTimeout(() => {
    if (!window.closed) {
      document.body.innerHTML = `
        <div style="
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#050505;
          color:#fff;
          font-family:Arial,sans-serif;
          text-align:center;
        ">
          <div>
            <h1>✓ Verificación completada</h1>
            <p>Ya podés cerrar esta pestaña y volver a Discord.</p>
          </div>
        </div>
      `;
    }
  }, 500);

} else {
  timerNotice.remove();
}

  return;
}

    remainingSeconds -= 1;
  }

  /*
    Mostramos inmediatamente
    el tiempo inicial.
  */

  updateAutomaticTimer();

  automaticCloseInterval =
    setInterval(
      updateAutomaticTimer,
      1000
    );
}

function launchSuccessConfetti() {
  document
    .querySelector(
      ".success-confetti-container"
    )
    ?.remove();

  if (
    !document.getElementById(
      "successConfettiStyle"
    )
  ) {
    const confettiStyle =
      document.createElement(
        "style"
      );

    confettiStyle.id =
      "successConfettiStyle";

    confettiStyle.textContent = `
      .success-confetti-container {
        position: fixed;
        inset: 0;
        z-index: 999999;
        overflow: hidden;
        pointer-events: none;
      }

      .success-confetti-piece {
        position: absolute;
        top: -30px;

        width: 10px;
        height: 17px;

        border-radius: 2px;

        opacity: 0;

        animation-name:
          successConfettiFall;

        animation-timing-function:
          cubic-bezier(
            0.15,
            0.75,
            0.35,
            1
          );

        animation-fill-mode:
          forwards;
      }

      @keyframes successConfettiFall {
        0% {
          opacity: 0;

          transform:
            translateY(-40px)
            rotate(0deg);
        }

        10% {
          opacity: 1;
        }

        100% {
          opacity: 0;

          transform:
            translateY(110vh)
            rotate(900deg);
        }
      }
    `;

    document.head.appendChild(
      confettiStyle
    );
  }

  const confettiContainer =
    document.createElement("div");

  confettiContainer.className =
    "success-confetti-container";

  const colors = [
    "#22c55e",
    "#a855f7",
    "#facc15",
    "#38bdf8",
    "#fb7185",
    "#ffffff",
  ];

  for (
    let index = 0;
    index < 100;
    index += 1
  ) {
    const piece =
      document.createElement("span");

    piece.className =
      "success-confetti-piece";

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.backgroundColor =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    piece.style.animationDelay =
      `${Math.random() * 0.8}s`;

    piece.style.animationDuration =
      `${
        2.5 +
        Math.random() * 2
      }s`;

    piece.style.width =
      `${6 + Math.random() * 8}px`;

    piece.style.height =
      `${10 + Math.random() * 12}px`;

    confettiContainer.appendChild(
      piece
    );
  }

  document.body.appendChild(
    confettiContainer
  );

  setTimeout(() => {
    confettiContainer.remove();
  }, 5500);
}

function showVerificationSuccess(
  verificationData
) {
  verificationInProgress =
    false;

  currentVerificationToken =
    "";

  sessionStorage.removeItem(
    verificationTokenStorageKey
  );

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
const activeDesign =
  currentPreviewAppearance
    ?.cardDesign ||
  document.body.dataset
    .cardDesign ||
  "classic";

const splitImageUrl =
  String(
    currentPreviewAppearance
      ?.splitImageUrl ||
    ""
  ).trim();

const splitImageFit =
  currentPreviewAppearance
    ?.splitImageFit ||
  "cover";

const splitImageDarkness =
  Math.min(
    100,
    Math.max(
      0,
      Number(
        currentPreviewAppearance
          ?.splitImageDarkness ??
        45
      )
    )
  ) / 100;

const successTitle =
  String(
    currentPreviewAppearance
      ?.successTitle ||
    (
      alreadyVerified
        ? "Cuenta verificada"
        : "✅ Verificación completada"
    )
  ).trim();

const successMessage =
  String(
    currentPreviewAppearance
      ?.successMessage ||
    (
      alreadyVerified
        ? "Tu cuenta ya tenía acceso."
        : `Tu cuenta fue verificada correctamente.

¡Bienvenido a {servidor}!

Ya podés acceder a todos los canales.`
    )
  )
    .replaceAll(
      "{servidor}",
      guildName
    )
    .replaceAll(
      "{server}",
      guildName
    );

const successColor =
  /^#[0-9a-f]{6}$/i.test(
    currentPreviewAppearance
      ?.successColor ||
    ""
  )
    ? currentPreviewAppearance
        .successColor
    : "#22c55e";

const successAnimation =
  currentPreviewAppearance
    ?.successAnimation ||
  "check";

const showCountdown =
  currentPreviewAppearance
    ?.showCountdown !== false;

const closePageEnabled =
  Boolean(
    currentPreviewAppearance
      ?.closePageEnabled
  );

console.log(
  "successAnimation:",
  successAnimation
);

console.log(
  "showCountdown:",
  showCountdown
);

console.log(
  "closePageEnabled:",
  closePageEnabled
);

console.log(
  "currentPreviewAppearance:",
  JSON.stringify(
    currentPreviewAppearance,
    null,
    2
  )
);

 const successContent = `
    <div class="success-page-content">

      <div class="success-check-area">
        <div class="success-check-orbit">
          <div class="success-check-ring"></div>

          <div class="success-check-circle">
            <span>✓</span>
          </div>
        </div>


<h2>
  ${escapeVerificationText(
    successTitle
  )}
</h2>

<p>
  ${escapeVerificationText(
    successMessage
  )}
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


if (
  activeDesign === "split" ||
  activeDesign === "split_premium"
) {
  verificationCard.innerHTML = `
    <div class="split-success-layout">

      <div class="split-success-image">
        ${
          splitImageUrl
            ? `
              <img
                class="split-success-background-image"
                src="${escapeHtmlAttribute(
                  splitImageUrl
                )}"
                alt=""
                onerror="
                  this.style.display='none';
                  this.parentElement.classList.add('image-load-failed');
                "
              >
            `
            : `
              <div class="split-success-fallback"></div>
            `
        }

        <div class="split-success-overlay"></div>

        <div class="split-success-image-copy">
          <span>ACCESO AUTORIZADO</span>

          <strong>
            Verificación completada
          </strong>

          <small>
            Ya podés volver a Discord y usar el servidor normalmente.
          </small>
        </div>
      </div>

      <div class="split-success-content">
        ${successContent}
      </div>

    </div>
  `;

  const successImage =
    verificationCard.querySelector(
      ".split-success-background-image"
    );

  if (successImage) {
    successImage.style.objectFit =
      splitImageFit;

    successImage.style.filter =
      `brightness(${
        Math.max(
          0,
          1 - splitImageDarkness
        )
      })`;
  }
} else {
  verificationCard.innerHTML =
    successContent;
}

const successCircle =
  verificationCard.querySelector(
    ".success-check-circle"
  );

const successRing =
  verificationCard.querySelector(
    ".success-check-ring"
  );

const successAuthorized =
  verificationCard.querySelector(
    ".success-authorized"
  );

const returnButton =
  verificationCard.querySelector(
    ".return-discord-button"
  );

if (successCircle) {
  successCircle.style.setProperty(
    "background-color",
    successColor,
    "important"
  );

  successCircle.style.setProperty(
    "box-shadow",
    `0 0 30px ${successColor}88`,
    "important"
  );
}

if (successRing) {
  successRing.style.setProperty(
    "border-color",
    successColor,
    "important"
  );
}

if (successAuthorized) {
  successAuthorized.style.setProperty(
    "color",
    successColor,
    "important"
  );
}

if (returnButton) {
  returnButton.style.setProperty(
    "border-color",
    successColor,
    "important"
  );
}

const successCheckArea =
  verificationCard.querySelector(
    ".success-check-area"
  );

const successCheckIcon =
  verificationCard.querySelector(
    ".success-check-circle span"
  );

if (
  successAnimation === "none"
) {
  if (successCheckArea) {
    successCheckArea.classList.add(
      "success-animation-none"
    );
  }

  if (successCircle) {
    successCircle.style.display =
      "none";
  }

  if (successRing) {
    successRing.style.display =
      "none";
  }
} else if (
  [
  "confetti",
  "confeti",
  "confetti_animation",
].includes(
  String(
    successAnimation
  ).toLowerCase()
)

) {
  if (successCheckArea) {
    successCheckArea.classList.add(
      "success-animation-confetti"
    );
  }

  if (successCheckIcon) {
    successCheckIcon.textContent =
      "🎉";
  }
launchSuccessConfetti();

} else {
  if (successCheckArea) {
    successCheckArea.classList.add(
      "success-animation-check"
    );
  }

  if (successCheckIcon) {
    successCheckIcon.textContent =
      "✓";
  }
}

 if (
  showCountdown ||
  closePageEnabled
) {
  startAutomaticCloseTimer(
    20,
    {
      showNotice:
        showCountdown,

      closePage:
        closePageEnabled,
    }
  );
} else {
  if (automaticCloseInterval) {
    clearInterval(
      automaticCloseInterval
    );

    automaticCloseInterval =
      null;
  }

  document
    .getElementById(
      "automaticCloseNotice"
    )
    ?.remove();

  document
    .getElementById(
      "automaticCloseBottomNotice"
    )
    ?.remove();
}

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

  const activeDesign =
    currentPreviewAppearance
      ?.cardDesign ||
    document.body.dataset
      .cardDesign ||
    "classic";

  verificationCard.classList.remove(
    "verification-processing-state",
    "verification-success-state"
  );

  verificationCard.classList.add(
    "verification-error-state"
  );

  verificationCard.dataset
    .activeDesign =
    activeDesign;

  const errorContent = `
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

      <p class="verification-error-message">
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

        <strong>
          VOLVER A INTENTAR
        </strong>

        <b>›</b>
      </button>

      <small class="verification-error-help">
        Revisá tu cuenta de Discord y volvé a intentar.
      </small>

    </div>
  `;

  if (
    activeDesign === "split" ||
    activeDesign === "split_premium"
  ) {
    const splitImageUrl =
      String(
        currentPreviewAppearance
          ?.splitImageUrl ||
        ""
      ).trim();

    const splitImageFit =
      currentPreviewAppearance
        ?.splitImageFit ||
      "cover";

    const splitImageDarkness =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            currentPreviewAppearance
              ?.splitImageDarkness ??
            45
          )
        )
      ) / 100;

    verificationCard.innerHTML = `
      <div class="split-error-layout">

        <div class="split-error-image">
          ${
            splitImageUrl
              ? `
                <img
                  class="split-error-background-image"
                  src="${escapeHtmlAttribute(
                    splitImageUrl
                  )}"
                  alt=""
                  onerror="
                    this.style.display='none';
                    this.parentElement.classList.add('image-load-failed');
                  "
                >
              `
              : `
                <div class="split-error-fallback"></div>
              `
          }

          <div class="split-error-overlay"></div>

          <div class="split-error-image-copy">
            <span>
              ACCESO RECHAZADO
            </span>

            <strong>
              Verificación bloqueada
            </strong>

            <small>
              Nebula Security protegió el acceso al servidor.
            </small>
          </div>
        </div>

        <div class="split-error-content">
          ${errorContent}
        </div>

      </div>
    `;

    const errorImage =
      verificationCard.querySelector(
        ".split-error-background-image"
      );

    if (errorImage) {
      errorImage.style.objectFit =
        splitImageFit;

      errorImage.style.filter =
        `brightness(${
          Math.max(
            0,
            1 - splitImageDarkness
          )
        })`;
    }
  } else {
    verificationCard.innerHTML =
      errorContent;
  }

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

  "x-verification-token":
    currentVerificationToken,
},

      credentials:
        "include",

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
  setStatus(
    "El enlace privado venció o no es válido. Volvé a Discord y presioná nuevamente Verificar.",
    "error"
  );

  setButtonState({
    disabled: true,
    icon: "!",
    text:
      "ENLACE VENCIDO",
  });

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
   APARIENCIA EN TIEMPO REAL
   ========================================================= */

function hexToRgba(
  hex,
  alpha = 1
) {
  const value =
    String(hex || "")
      .replace("#", "")
      .trim();

  if (!/^[0-9a-f]{6}$/i.test(value)) {
    return `rgba(139, 92, 246, ${alpha})`;
  }

  const number =
    Number.parseInt(value, 16);

  const red =
    (number >> 16) & 255;

  const green =
    (number >> 8) & 255;

  const blue =
    number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function rebuildPreviewStars(
  amount
) {
  const safeAmount =
    Math.min(
      300,
      Math.max(
        0,
        Number(amount) || 0
      )
    );

  stars = Array.from(
    { length: safeAmount },
    () => ({
      x:
        Math.random() *
        window.innerWidth,

      y:
        Math.random() *
        window.innerHeight,

      radius:
        Math.random() *
          1.4 +
        0.25,

      alpha:
        Math.random() *
          0.55 +
        0.08,

      speed:
        Math.random() *
          0.12 +
        0.025,

      pulse:
        Math.random() *
        Math.PI *
        2,
    })
  );
}

function applyPreviewAppearance(
  appearance = {}
) {
  currentPreviewAppearance = {
    ...currentPreviewAppearance,
    ...appearance,
  };

  const settings =
    currentPreviewAppearance;

  const root =
    document.documentElement;

  const body =
    document.body;

  const cardDesign =
    settings.cardDesign ||
    "classic";
  const splitImageUrl =
    settings.splitImageUrl ||
    "";

  const splitShowImage =
    settings.splitShowImage !==
    false;

  const splitImagePosition =
    settings.splitImagePosition ||
    "left";

  const splitImageFit =
    settings.splitImageFit ||
    "cover";

  const splitImageDarkness =
    Number(
      settings.splitImageDarkness ??
      45
    );

  const splitImageWidth =
    Number(
      settings.splitImageWidth ??
      48
    );

  root.style.setProperty(
    "--split-image-url",
    splitImageUrl && splitShowImage
      ? `url("${splitImageUrl}")`
      : "none"
  );

  root.style.setProperty(
    "--split-image-fit",
    splitImageFit
  );

  root.style.setProperty(
    "--split-image-darkness",
    String(
      splitImageDarkness / 100
    )
  );

  root.style.setProperty(
    "--split-image-width",
    `${splitImageWidth}%`
  );

  body.dataset.splitImagePosition =
    splitImagePosition;

  body.classList.toggle(
    "split-image-hidden",
    !splitShowImage ||
    !splitImageUrl
  );

  body.dataset.cardDesign =
    cardDesign;

  /*
    CONFIGURACIÓN DEL DISEÑO TERMINAL
  */

  const terminalBackgroundColor =
    settings.terminalBackgroundColor ||
    "#020703";

  const terminalTextColor =
    settings.terminalTextColor ||
    "#d9ffe0";

  const terminalAccentColor =
    settings.terminalAccentColor ||
    "#22c55e";

  const terminalBorderColor =
    settings.terminalBorderColor ||
    "#14532d";

  const terminalGlow =
    Math.min(
      70,
      Math.max(
        0,
        Number(
          settings.terminalGlow ??
          25
        )
      )
    );

  const terminalRadius =
    Math.min(
      30,
      Math.max(
        0,
        Number(
          settings.terminalRadius ??
          10
        )
      )
    );

  root.style.setProperty(
    "--terminal-background",
    terminalBackgroundColor
  );

  root.style.setProperty(
    "--terminal-text",
    terminalTextColor
  );

  root.style.setProperty(
    "--terminal-accent",
    terminalAccentColor
  );

  root.style.setProperty(
    "--terminal-border",
    terminalBorderColor
  );

  root.style.setProperty(
    "--terminal-glow",
    `${terminalGlow}px`
  );

  root.style.setProperty(
    "--terminal-radius",
    `${terminalRadius}px`
  );

  body.classList.toggle(
    "terminal-cursor-hidden",
    settings.terminalShowCursor ===
      false
  );

  body.classList.toggle(
    "terminal-lines-hidden",
    settings.terminalShowLines ===
      false
  );

  body.classList.toggle(
    "terminal-server-hidden",
    settings.terminalShowServer ===
      false
  );

  body.classList.toggle(
    "terminal-role-hidden",
    settings.terminalShowRole ===
      false
  );

  const card =
    document.querySelector(
      ".verification-card"
    );

  const profileRing =
    document.querySelector(
      ".profile-ring"
    );

const pageGlows =
  document.querySelectorAll(
    ".page-glow"
  );

const brandTitle =
  document.querySelector(
    ".brand-copy h1"
  );

const brandDescription =
  document.querySelector(
    ".brand-copy p"
  );

const brandShield =
  document.querySelector(
    ".brand-shield"
  );

const terminalPanel =
  document.getElementById(
    "terminalPanel"
  );

const terminalTitleElement =
  document.getElementById(
    "terminalTitle"
  );

const terminalStatusElement =
  document.getElementById(
    "terminalStatusText"
  );

const terminalPrefixElements =
  document.querySelectorAll(
    ".terminal-prefix"
  );

const primaryColor =
  settings.primaryColor ||
  "#8b5cf6";

  const secondaryColor =
    settings.secondaryColor ||
    "#6d28d9";

  const buttonColor =
    settings.buttonColor ||
    "#7c3aed";

  const textColor =
    settings.textColor ||
    "#ffffff";

  const cardColor =
    settings.cardColor ||
    "#0f0f1a";

  /*
    COLORES GENERALES
  */

  root.style.setProperty(
    "--purple",
    primaryColor
  );

  root.style.setProperty(
    "--purple-light",
    primaryColor
  );

  root.style.setProperty(
    "--purple-dark",
    secondaryColor
  );

  root.style.setProperty(
    "--text",
    textColor
  );

  /*
    TEXTOS DEL DISEÑO TERMINAL
  */

  if (terminalTitleElement) {
    terminalTitleElement.textContent =
      settings.terminalTitle ||
      "NEBULA SECURITY TERMINAL";
  }

  if (terminalStatusElement) {
    terminalStatusElement.textContent =
      settings.terminalStatusText ||
      "Sistema preparado";
  }

  terminalPrefixElements.forEach(
    element => {
      element.textContent =
        settings.terminalPrefix ||
        ">";
    }
  );

  if (terminalPanel) {
    terminalPanel.hidden =
      cardDesign !==
      "terminal";
  }

/*
  NOMBRE, DESCRIPCIÓN Y LOGO
*/

if (
  brandTitle &&
  settings.pageName
) {
  brandTitle.textContent =
    settings.pageName;
}

if (
  brandDescription &&
  settings.pageDescription
) {
  brandDescription.textContent =
    settings.pageDescription;
}

if (brandShield) {
  if (settings.logoUrl) {
    brandShield.innerHTML = `
      <img
        src="${escapeHtmlAttribute(
          settings.logoUrl
        )}"
        alt="Logo"
        style="
          width:100%;
          height:100%;
          display:block;
          object-fit:cover;
          border-radius:inherit;
        "
      >
    `;
  } else {
    brandShield.innerHTML =
      "<span>✓</span>";
  }
}

  /*
    FONDO
  */

  const backgroundType =
    settings.backgroundType ||
    "space";

  if (
    backgroundType === "image" &&
    settings.backgroundUrl
  ) {
    body.style.background = `
      linear-gradient(
        rgba(0, 0, 0, 0.35),
        rgba(0, 0, 0, 0.72)
      ),
      url("${settings.backgroundUrl}")
      center / cover fixed
    `;
  } else if (
    backgroundType === "gradient"
  ) {
    body.style.background = `
      linear-gradient(
        135deg,
        ${
          settings.gradientStart ||
          "#05050a"
        },
        ${
          settings.gradientEnd ||
          "#160c2b"
        }
      )
    `;
  } else if (
    backgroundType === "solid"
  ) {
    body.style.background =
      settings.backgroundSolidColor ||
      "#05050a";
  } else {
    body.style.background = `
      radial-gradient(
        circle at 50% 25%,
        ${hexToRgba(
          primaryColor,
          0.18
        )},
        transparent 42%
      ),
      ${
        settings.backgroundSolidColor ||
        "#05050a"
      }
    `;
  }

  /*
    TARJETA PRINCIPAL
  */

  if (card) {
    const opacity =
      Math.min(
        100,
        Math.max(
          10,
          Number(
            settings.cardOpacity ??
            88
          )
        )
      ) / 100;

    const blur =
      Math.min(
        50,
        Math.max(
          0,
          Number(
            settings.cardBlur ??
            18
          )
        )
      );

    const radius =
      Math.min(
        50,
        Math.max(
          0,
          Number(
            settings.cardRadius ??
            24
          )
        )
      );

    const shadow =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            settings.cardShadow ??
            80
          )
        )
      );

    const glowIntensity =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            settings.glowIntensity ??
            80
          )
        )
      );

    card.style.background =
      hexToRgba(
        cardColor,
        opacity
      );

    card.style.color =
      textColor;

    card.style.backdropFilter =
      `blur(${blur}px)`;

    card.style.webkitBackdropFilter =
      `blur(${blur}px)`;

    card.style.borderRadius =
      `${radius}px`;

    card.style.borderColor =
      hexToRgba(
        primaryColor,
        0.4
      );

    card.style.boxShadow =
      settings.glowEnabled === false
        ? `
          0 30px 90px
          rgba(
            0,
            0,
            0,
            ${shadow / 125}
          )
        `
        : `
          0 30px 90px
          rgba(
            0,
            0,
            0,
            ${shadow / 125}
          ),
          0 0
          ${glowIntensity / 2}px
          ${hexToRgba(
            primaryColor,
            glowIntensity / 300
          )}
        `;
  }

  /*
    BOTÓN
  */

  if (completeButton) {
    completeButton.style.background = `
      linear-gradient(
        110deg,
        ${secondaryColor},
        ${buttonColor} 50%,
        ${primaryColor}
      )
    `;

    completeButton.style.color =
      textColor;

    completeButton.style.borderColor =
      primaryColor;

    completeButton.style.borderRadius =
      `${
        Number(
          settings.verifyButtonRadius ??
          14
        )
      }px`;

    const sizes = {
      small: {
        height: "48px",
        fontSize: "13px",
      },

      medium: {
        height: "56px",
        fontSize: "15px",
      },

      large: {
        height: "64px",
        fontSize: "18px",
      },
    };

    const selectedSize =
      sizes[
        settings.verifyButtonSize
      ] ||
      sizes.large;

    completeButton.style.minHeight =
      selectedSize.height;

    completeButton.style.fontSize =
      selectedSize.fontSize;

    if (
      settings.verifyButtonText
    ) {
      const icons = {
        discord: "◈",
        shield: "🛡",
        check: "✓",
        none: "",
      };

      const icon =
        icons[
          settings.verifyButtonIcon
        ] ?? "◈";

completeButton.innerHTML = `
  <span class="button-shield">
    ${icon}
  </span>

  <span class="button-copy">
    ${escapeVerificationText(
      settings.verifyButtonText
    )}
  </span>

  <span
    class="button-arrow"
    aria-hidden="true"
  >
    ›
  </span>
`;
     }

    completeButton.style.animation =
      settings.buttonAnimationEnabled ===
      false
        ? "none"
        : "";
  }

  /*
    ANILLO DEL AVATAR
  */

  if (profileRing) {
    profileRing.style.background = `
      conic-gradient(
        from 0deg,
        ${secondaryColor},
        ${primaryColor},
        ${buttonColor},
        ${secondaryColor}
      )
    `;

    profileRing.style.boxShadow =
      settings.glowEnabled === false
        ? "none"
        : `
          0 0
          ${
            Number(
              settings.glowIntensity ??
              80
            ) / 2
          }px
          ${hexToRgba(
            primaryColor,
            0.45
          )}
        `;

    profileRing.style.animation =
      settings.logoAnimationEnabled ===
      false
        ? "none"
        : "";
  }

  /*
    PARTÍCULAS
  */

  if (canvas) {
    const particlesVisible =
      settings.spaceBackground !==
        false &&
      settings.particlesEnabled !==
        false;

    canvas.style.display =
      particlesVisible
        ? "block"
        : "none";

    if (particlesVisible) {
      rebuildPreviewStars(
        settings.particleCount ??
        100
      );
    }
  }

  /*
    BRILLOS DE FONDO
  */

  pageGlows.forEach(
    glow => {
      glow.style.background =
        primaryColor;

      glow.style.opacity =
        settings.glowEnabled === false
          ? "0"
          : String(
              Math.min(
                0.5,
                Number(
                  settings.glowIntensity ??
                  80
                ) / 300
              )
            );
    }
  );

  /*
    ANIMACIONES GENERALES
  */

  document.body.classList.toggle(
    "preview-animations-disabled",
    settings.animationsEnabled ===
      false
  );

  document.body.classList.toggle(
    "preview-hover-disabled",
    settings.hoverEnabled ===
      false
  );
}

/*
  RECIBIR LOS CAMBIOS DEL DASHBOARD
*/

window.addEventListener(
  "message",
  event => {
    if (
      event.origin !==
      window.location.origin
    ) {
      return;
    }

    if (
      event.data?.type !==
      "nebula-appearance-preview"
    ) {
      return;
    }

    applyPreviewAppearance(
      event.data.appearance ||
      {}
    );
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