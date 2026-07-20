import "./style.css";
import { io } from "socket.io-client";

const API_URL =
  window.location.origin;

const menuSections = [
  {
    title: "SERVIDORES",
    items: [
      ["◈", "Servidor actual", ""],
      ["⌁", "Invitaciones", ""],
      ["♧", "Miembros", ""],
      ["♙", "Roles", ""],
      ["▣", "Canales", ""],
      ["▤", "Logs del servidor", ""],
    ]
  },
  {
    title: "COMANDOS",
    items: [
      ["⚙", "Comandos", "»"],
      ["✣", "Slash Commands", ""],
      ["▢", "Mensajes", ""],
      ["◫", "Auto Respuestas", ""],
    ]
  },
  {
    title: "MODERACIÓN",
    items: [
      ["◆", "Moderación", "»"],
      ["◉", "Advertencias", ""],
      ["⊗", "Baneos", ""],
      ["◔", "Muteos", ""],
      ["⌁", "Anti Raid", ""],
      ["✦", "Auto Mod", ""],
    ]
  },
  {
    title: "SISTEMA",
    items: [
      ["▤", "Logs", "»"],
      ["◷", "Auditoría", ""],
      ["□", "Tareas programadas", ""],
      ["▣", "Backups", ""],
      ["⌘", "Webhooks", ""],
    ]
  },
  {
    title: "CONFIGURACIÓN",
    items: [
      ["⚙", "Configuración", "»"],
      ["✎", "Personalización", ""],
      ["⌁", "Variables de entorno", ""],
      ["◇", "Tokens", ""],
      ["⊙", "Permisos", ""],
      ["⌘", "Integraciones", ""],
    ]
  }
];

const sidebarMenus = menuSections.map(section => `
  <div class="side-group">
    <div class="side-title">${section.title}</div>
    ${section.items.map(([icon,label,badge]) => `
      <button class="side-item">
        <span class="side-icon">${icon}</span>
        <span>${label}</span>
        ${badge ? `<b>${badge}</b>` : ""}
      </button>
    `).join("")}
  </div>
`).join("");

document.querySelector("#app").innerHTML = `
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>

  <div class="layout">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-logo">N</div>
        <div>
          <strong>Nebula</strong>
          <span>BOT CONTROL</span>
        </div>
      </div>
<nav
  class="public-sidebar-menu"
  id="publicSidebarMenu"
>
  <button
    class="public-side-item active"
    id="publicMyServers"
    type="button"
  >
    <span class="public-side-icon">
      ▱
    </span>

    <span>
      Mis servidores
    </span>
  </button>

  <button
    class="public-side-item"
    id="publicInviteBot"
    type="button"
  >
    <span class="public-side-icon">
      ＋
    </span>

    <span>
      Invitar bot
    </span>
  </button>

  <button
    class="public-side-item"
    id="publicBotStatus"
    type="button"
  >
    <span class="public-side-icon">
      ◉
    </span>

    <span>
      Estado del bot
    </span>
  </button>


<button
  class="public-side-item owner-only"
  id="publicLicenses"
  type="button"
>

     <span class="public-side-icon">
      🔑
    </span>

    <span>
      Licencias
    </span>
  </button>


  <button
    class="public-side-item"
    id="publicSupport"
    type="button"
  >
    <span class="public-side-icon">
      ?
    </span>

    <span>
      Soporte
    </span>
  </button>

  <button
    class="public-side-item public-logout"
    id="publicLogout"
    type="button"
  >
    <span class="public-side-icon">
      ↪
    </span>

    <span>
      Cerrar sesión
    </span>
  </button>
</nav>
<div
  class="server-switcher dashboard-only"
  id="serverSwitcher"
>
  <button
    class="server-current"
    id="serverCurrent"
    type="button"
  >
    <div
      class="server-current-icon"
      id="serverCurrentIcon"
    >
      N
    </div>

    <div class="server-current-copy">
      <span>Servidor actual</span>

      <strong id="serverCurrentName">
        Cargando...
      </strong>
    </div>

    <span class="server-current-arrow">
      ⌄
    </span>
  </button>

  <div
    class="server-dropdown"
    id="serverDropdown"
  >
    <div class="server-dropdown-head">
      <strong>Tus servidores</strong>

      <span id="serverDropdownCount">
        0
      </span>
    </div>

    <div
      class="server-dropdown-list"
      id="serverDropdownList"
    >
      <div class="server-dropdown-empty">
        Cargando servidores...
      </div>
    </div>
  </div>
</div>

      <button
  class="side-item dashboard-link active dashboard-only"
>
        <span class="side-icon">⌂</span>
        <span>Dashboard</span>
        <b>⌁</b>
      </button>

    <div class="sidebar-scroll dashboard-only">
        ${sidebarMenus}
      </div>

<div class="owner-card">
  <div
    class="owner-avatar"
    id="ownerAvatar"
  >
    U
  </div>

  <div class="owner-info">
    <strong id="ownerDisplayName">
      Cargando...
    </strong>

    <span id="ownerUsername">
      @discord
    </span>

    <small>
      Administrador
    </small>
  </div>

  <button
    id="ownerMenuButton"
    type="button"
  >
    ⚙
  </button>
</div>

<div
  class="key-time-card"
  id="keyTimeCard"
  hidden
>
  <div class="key-time-head">
    <span>
      TIME KEY
    </span>

    <span
      class="key-time-icon"
      aria-hidden="true"
    >
      🔑
    </span>
  </div>

  <strong
    class="key-time-countdown"
    id="keyTimeCountdown"
  >
    00d 00h 00m 00s
  </strong>

  <div class="key-time-divider"></div>

  <div class="key-time-expiration">
    <span>Vence:</span>

    <strong id="keyTimeExpiration">
      --/--/---- --:--:--
    </strong>
  </div>
</div>

          </aside>

    <main class="main">
      <header class="topbar">
        <div class="top-left">
          <button class="hamburger" id="hamburger">☰</button>
          <div class="search">
            <span>⌕</span>
            <input placeholder="Buscar en el panel..." />
            <kbd>Ctrl K</kbd>
          </div>
        </div>

        <div class="top-right">
          <button class="circle-btn">♢</button>
          <button class="circle-btn">▣</button>
          <button class="circle-btn">⚙</button>
          <button class="circle-btn">?</button>
<button
  class="top-profile"
  id="topProfile"
  type="button"
>
  <div
    class="profile-avatar"
    id="profileAvatar"
  >
    AM
  </div>

  <div>
    <strong id="profileDisplayName">
      Cargando...
    </strong>

    <span id="profileUsername">
      <i></i>
      Discord
    </span>
  </div>

  <b>⌄</b>
</button>
        </div>
      </header>

      <section class="welcome-row">
        <div>
         <h1>
  ¡Bienvenido de vuelta,
  <span id="welcomeUsername">
    usuario
  </span>! 👋
</h1>
          <p>Aquí tienes un resumen completo de tu bot y servidores.</p>
        </div>
        <div class="welcome-actions">
          <div class="status-card">
            <i></i>
            <div>
              <span>Estado del bot</span>
              <strong>En línea</strong>
            </div>
          </div>
          <button class="invite-btn">＋ Invitar bot</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card purple-border">
          <div class="stat-icon purple">♛</div>
          <div><span>Servidores</span><strong data-count="12">0</strong><small>+2 este mes</small></div>
        </article>
        <article class="stat-card">
          <div class="stat-icon blue">♣</div>
          <div><span>Usuarios Totales</span><strong data-count="8745">0</strong><small>+342 este mes</small></div>
        </article>
        <article class="stat-card purple-border">
          <div class="stat-icon green">⌘</div>
          <div><span>Comandos Usados</span><strong data-count="25683">0</strong><small>+18.7% este mes</small></div>
        </article>
        <article class="stat-card">
          <div class="stat-icon yellow">▣</div>
          <div><span>Mensajes Enviados</span><strong data-count="134245">0</strong><small>+29.4% este mes</small></div>
        </article>
        <article class="stat-card purple-border">
          <div class="stat-icon pink">〽</div>
          <div><span>Uptime</span><strong>99.99%</strong><small>30 días</small></div>
        </article>
      </section>

      <section class="main-grid">
        <article class="panel performance">
          <div class="panel-head">
            <div><h3>Rendimiento del Bot</h3></div>
            <button>Últimos 7 días⌄</button>
          </div>

          <div class="chart-wrap">
            <div class="chart-labels"><span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span></div>
            <div class="chart">
              <div class="grid-line g1"></div><div class="grid-line g2"></div><div class="grid-line g3"></div><div class="grid-line g4"></div><div class="grid-line g5"></div>
              <svg viewBox="0 0 760 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8b5cf6" stop-opacity=".65"/>
                    <stop offset="100%" stop-color="#8b5cf6" stop-opacity=".04"/>
                  </linearGradient>
                </defs>
                <path class="area" d="M0 235 C55 185 90 165 140 125 C195 84 255 150 310 135 C375 118 420 100 475 122 C530 138 580 90 635 105 C690 118 720 82 760 72 L760 300 L0 300 Z"/>
                <path class="line" d="M0 235 C55 185 90 165 140 125 C195 84 255 150 310 135 C375 118 420 100 475 122 C530 138 580 90 635 105 C690 118 720 82 760 72"/>
                <g class="points">
                  <circle cx="0" cy="235" r="4"/><circle cx="140" cy="125" r="4"/><circle cx="310" cy="135" r="4"/><circle cx="475" cy="122" r="4"/><circle cx="635" cy="105" r="4"/><circle cx="760" cy="72" r="4"/>
                </g>
              </svg>
              <div class="chart-days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div>
            </div>
          </div>

          <div class="metric-strip">
            <div><span>◔</span><strong>25.6K</strong><small>Comandos</small></div>
            <div><span>⌘</span><strong>134K</strong><small>Mensajes</small></div>
            <div><span>♣</span><strong>8.7K</strong><small>Usuarios</small></div>
            <div><span>◉</span><strong>99.99%</strong><small>Uptime</small></div>
          </div>
        </article>

        <article class="panel health">
          <div class="panel-head"><h3>Estado del Sistema</h3></div>
          <div class="health-ring">
            <div class="health-core"><strong>100%</strong><span>Salud del sistema</span></div>
          </div>
          <div class="health-list">
            ${["API Discord","Base de Datos","Servidores","Web Dashboard","Sistema de Logs"].map(x => `<div><span><i></i>${x}</span><strong>Operativo</strong></div>`).join("")}
          </div>
        </article>

        <article class="panel activity">
          <div class="panel-head"><h3>Actividad Reciente</h3><button>Ver todo</button></div>
          <div class="activity-list">
            <div class="activity-item"><i class="green">◎</i><div><strong>Nuevo servidor conectado</strong><span>Nebula Community</span></div><time>hace 2 min</time></div>
            <div class="activity-item"><i class="purple">⌘</i><div><strong>Comando ejecutado</strong><span>/verify @usuario</span></div><time>hace 3 min</time></div>
            <div class="activity-item"><i class="red">●</i><div><strong>Usuario baneado</strong><span>Usuario#1234</span></div><time>hace 8 min</time></div>
            <div class="activity-item"><i class="blue">⌁</i><div><strong>Nueva invitación creada</strong><span>discord.gg/nebula</span></div><time>hace 15 min</time></div>
            <div class="activity-item"><i class="purple">▣</i><div><strong>Backup automático</strong><span>Base de datos</span></div><time>hace 30 min</time></div>
            <div class="activity-item"><i class="green">□</i><div><strong>Actualización del sistema</strong><span>Versión 2.4.1</span></div><time>hace 1 hora</time></div>
          </div>
        </article>
      </section>

      <section class="lower-grid">
        <article class="panel commands-panel">
          <div class="panel-head"><h3>Uso de Comandos</h3><button>Últimos 7 días⌄</button></div>
          <div class="donut-wrap">
            <div class="donut"><div><strong>25.683</strong><span>Total</span></div></div>
            <div class="command-legend">
              <div><span><i class="c1"></i>/verify</span><strong>8.429</strong><small>32.8%</small></div>
              <div><span><i class="c2"></i>/setup</span><strong>4.326</strong><small>16.8%</small></div>
              <div><span><i class="c3"></i>/ban</span><strong>3.782</strong><small>14.7%</small></div>
              <div><span><i class="c4"></i>/kick</span><strong>2.945</strong><small>11.5%</small></div>
              <div><span><i class="c5"></i>/mute</span><strong>2.156</strong><small>8.4%</small></div>
              <div><span><i class="c6"></i>Otros</span><strong>3.045</strong><small>11.8%</small></div>
            </div>
          </div>
        </article>

        <article class="panel servers-panel">
          <div class="panel-head"><h3>Servidores Más Activos</h3><button>Ver todos</button></div>
          <div class="server-list">
            ${[
              ["NC","Nebula Community","1.245 usuarios","89%"],
              ["GZ","Gaming Zone","987 usuarios","75%"],
              ["TD","Team Developers","756 usuarios","62%"],
              ["AW","Anime World","654 usuarios","48%"],
              ["CL","Chill Lounge","432 usuarios","35%"]
            ].map(([logo,name,users,pct]) => `
              <div class="server-item">
                <div class="server-logo">${logo}</div>
                <div class="server-copy"><strong>${name}</strong><span>${users}</span></div>
                <div class="server-progress"><span style="width:${pct}"></span></div>
                <b>${pct}</b>
              </div>`).join("")}
          </div>
        </article>

        <article class="panel bot-info">
          <div class="panel-head"><h3>Información del Bot</h3></div>
          <div class="bot-visual">
            <div class="bot-orbit orbit-1"></div>
            <div class="bot-orbit orbit-2"></div>
            <div class="bot-orbit orbit-3"></div>
            <div class="bot-core">N</div>
          </div>
          <div class="bot-table">
            <div><span>Nombre</span><strong>Nebula Bot</strong></div>
            <div><span>Versión</span><strong>2.4.1</strong></div>
            <div><span>Desarrollador</span><strong>Alvi Moreyra</strong></div>
            <div><span>Librería</span><strong>Discord.js v14</strong></div>
            <div><span>Servidor</span><strong>Render (Free)</strong></div>
            <div><span>RAM</span><strong>86.4 MB</strong></div>
            <div><span>CPU</span><strong>2.3%</strong></div>
          </div>
        </article>
      </section>

      <section class="footer-status">
        <div><span class="footer-icon purple">〽</span><div><small>Latencia</small><strong>38ms</strong></div></div>
        <div><span class="footer-icon purple">◎</span><div><small>Región</small><strong>South America</strong></div></div>
        <div><span class="footer-icon green">⌁</span><div><small>Conexión</small><strong class="green-text">Estable</strong></div></div>
        <div><span class="footer-icon yellow">◉</span><div><small>Bot Uptime</small><strong>30d 14h 23m</strong></div></div>
        <div><span class="footer-icon red">▣</span><div><small>Versión del Panel</small><strong>2.4.1</strong></div></div>
      </section>
    </main>
  </div>

  <div class="toast" id="toast">
    <span>✓</span>
    <div><strong>Demo visual</strong><p>Esta función se conectará en el siguiente paso.</p></div>
  </div>
`;
/* =========================================================
   SELECTOR DE SERVIDORES Y PERFIL
   ========================================================= */

const serverSwitcher =
  document.getElementById(
    "serverSwitcher"
  );

const serverCurrent =
  document.getElementById(
    "serverCurrent"
  );

const serverCurrentIcon =
  document.getElementById(
    "serverCurrentIcon"
  );

const serverCurrentName =
  document.getElementById(
    "serverCurrentName"
  );

const serverDropdown =
  document.getElementById(
    "serverDropdown"
  );

const serverDropdownList =
  document.getElementById(
    "serverDropdownList"
  );

const serverDropdownCount =
  document.getElementById(
    "serverDropdownCount"
  );

const profileAvatar =
  document.getElementById(
    "profileAvatar"
  );

const profileDisplayName =
  document.getElementById(
    "profileDisplayName"
  );

const profileUsername =
  document.getElementById(
    "profileUsername"
  );
const ownerAvatar =
  document.getElementById(
    "ownerAvatar"
  );

const ownerDisplayName =
  document.getElementById(
    "ownerDisplayName"
  );

const ownerUsername =
  document.getElementById(
    "ownerUsername"
  );


const keyTimeCard =
  document.getElementById(
    "keyTimeCard"
  );

const keyTimeCountdown =
  document.getElementById(
    "keyTimeCountdown"
  );

const keyTimeExpiration =
  document.getElementById(
    "keyTimeExpiration"
  );

let keyCountdownInterval =
  null;

const welcomeUsername =
  document.getElementById(
    "welcomeUsername"
  );
let dashboardServers = [];

let selectedServerId =
  localStorage.getItem(
    "nebulaSelectedServerId"
  ) || "";

function getServerInitials(name) {
  return String(name || "N")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word =>
      word.charAt(0)
    )
    .join("")
    .toUpperCase();
}

function renderSelectedServer(server) {
  if (!server) {
    serverCurrentName.textContent =
      "Seleccioná un servidor";

    serverCurrentIcon.textContent =
      "N";

    return;
  }

  serverCurrentName.textContent =
    server.name ||
    "Servidor";

  if (server.icon) {
    serverCurrentIcon.innerHTML = `
      <img
        src="${server.icon}"
        alt="${server.name}"
      >
    `;
  } else {
    serverCurrentIcon.textContent =
      getServerInitials(
        server.name
      );
  }
}

function selectDashboardServer(server) {
  if (!server?.id) {
    return;
  }

  selectedServerId =
    String(server.id);

  localStorage.setItem(
    "nebulaSelectedServerId",
    selectedServerId
  );

  renderSelectedServer(server);

  serverDropdown.classList.remove(
    "open"
  );

  window.dispatchEvent(
    new CustomEvent(
      "nebula:server-changed",
      {
        detail: {
          server,
        },
      }
    )
  );
}

function renderServerDropdown() {
  serverDropdownCount.textContent =
    String(
      dashboardServers.length
    );

  if (
    dashboardServers.length === 0
  ) {
    serverDropdownList.innerHTML = `
      <div class="server-dropdown-empty">
        No se encontraron servidores.
      </div>
    `;

    renderSelectedServer(null);

    return;
  }

  let selectedServer =
    dashboardServers.find(
      server =>
        String(server.id) ===
        String(selectedServerId)
    );

  if (!selectedServer) {
    selectedServer =
      dashboardServers[0];

    selectedServerId =
      String(
        selectedServer.id
      );

    localStorage.setItem(
      "nebulaSelectedServerId",
      selectedServerId
    );
  }

  serverDropdownList.innerHTML =
    dashboardServers
      .map(server => {
        const active =
          String(server.id) ===
          String(selectedServerId);

        const icon =
          server.icon
            ? `<img
                 src="${server.icon}"
                 alt="${server.name}"
               >`
            : getServerInitials(
                server.name
              );

        return `
          <button
            class="server-dropdown-item ${
              active
                ? "active"
                : ""
            }"
            data-server-id="${server.id}"
            type="button"
          >
            <span class="server-dropdown-icon">
              ${icon}
            </span>

            <span class="server-dropdown-copy">
              <strong>
                ${server.name}
              </strong>

              <small>
                ${
                  Number(
                    server.members ||
                    server.memberCount ||
                    0
                  ).toLocaleString(
                    "es-AR"
                  )
                } miembros
              </small>
            </span>

            ${
              active
                ? `
                  <span class="server-dropdown-check">
                    ✓
                  </span>
                `
                : ""
            }
          </button>
        `;
      })
      .join("");

  renderSelectedServer(
    selectedServer
  );

  serverDropdownList
    .querySelectorAll(
      "[data-server-id]"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          const server =
            dashboardServers.find(
              item =>
                String(item.id) ===
                String(
                  button.dataset
                    .serverId
                )
            );


selectDashboardServer(
  server
);

renderServerDropdown();

if (server?.botPresent) {
  abrirPanelServidor(
    server.id
  );
}
             }
      );
    });
}

/* =========================================================
   SESIÓN REAL DEL DASHBOARD
   ========================================================= */

let dashboardSessionUser =
  null;

let dashboardBotData = {
  name: "Nebula Bot",
  avatar: "",
};

function formatKeyCountdown(
  milliseconds
) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        milliseconds / 1000
      )
    );

  const days =
    Math.floor(
      totalSeconds / 86400
    );

  const hours =
    Math.floor(
      (
        totalSeconds % 86400
      ) / 3600
    );

  const minutes =
    Math.floor(
      (
        totalSeconds % 3600
      ) / 60
    );

  const seconds =
    totalSeconds % 60;

  return (
    `${days}d ` +
    `${String(hours).padStart(2, "0")}h ` +
    `${String(minutes).padStart(2, "0")}m ` +
    `${String(seconds).padStart(2, "0")}s`
  );
}

function hideKeyCountdown() {
  if (keyCountdownInterval) {
    clearInterval(
      keyCountdownInterval
    );

    keyCountdownInterval =
      null;
  }

  if (keyTimeCard) {
    keyTimeCard.hidden =
      true;
  }
}

function startKeyCountdown(
  license
) {
  if (
    !keyTimeCard ||
    !keyTimeCountdown ||
    !keyTimeExpiration
  ) {
    return;
  }

  if (keyCountdownInterval) {
    clearInterval(
      keyCountdownInterval
    );

    keyCountdownInterval =
      null;
  }

  keyTimeCard.hidden =
    false;

  if (license.permanent === true) {
    keyTimeCountdown.textContent =
      "Permanente";

    keyTimeExpiration.textContent =
      "Sin vencimiento";

    return;
  }

  const expiresAt =
    Number(
      license.expiresAt
    );

  if (
    !Number.isFinite(
      expiresAt
    )
  ) {
    hideKeyCountdown();

    return;
  }

  keyTimeExpiration.textContent =
    new Date(
      expiresAt
    ).toLocaleString(
      "es-AR",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",
      }
    );

  const updateCountdown =
    () => {
      const remaining =
        expiresAt -
        Date.now();

      if (remaining <= 0) {
        if (keyCountdownInterval) {
          clearInterval(
            keyCountdownInterval
          );

          keyCountdownInterval =
            null;
        }

        keyTimeCountdown.textContent =
          "00d 00h 00m 00s";

        keyTimeExpiration.textContent =
          "Key vencida";

        showExpiredLicenseScreen();

        return;
      }

      keyTimeCountdown.textContent =
        formatKeyCountdown(
          remaining
        );
    };

  updateCountdown();

  keyCountdownInterval =
    setInterval(
      updateCountdown,
      1000
    );
}

function showExpiredLicenseScreen() {
  if (
    document.getElementById(
      "expiredLicenseOverlay"
    )
  ) {
    return;
  }

  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "expiredLicenseOverlay";

  overlay.innerHTML = `
    <div class="expired-license-card">
      <div class="expired-license-icon">
        🔐
      </div>

      <span class="expired-license-label">
        NEBULA DASHBOARD
      </span>

      <h1>
        Key vencida
      </h1>

      <p>
        Tu licencia ya expiró.
        Solicitá una nueva Key en nuestro Discord
        para continuar usando el dashboard.
      </p>

      <button
        id="expiredLicenseReturnButton"
        type="button"
      >
        Volver al inicio
      </button>
    </div>
  `;

  document.body.appendChild(
    overlay
  );

  document
    .getElementById(
      "expiredLicenseReturnButton"
    )
    .addEventListener(
      "click",
      () => {
        overlay.remove();

        if (dashboardSessionUser) {
          dashboardSessionUser.hasAccess =
            false;
        }

        hideKeyCountdown();

        showAccessPage();

        window.history.replaceState(
          {},
          "",
          "/?view=access"
        );
      }
    );
}

async function loadCurrentLicense() {

  try {
    const response =
      await fetch(
        `${API_URL}/api/licenses/current`,
        {
          method:
            "GET",

          headers: {
            Accept:
              "application/json",
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      hideKeyCountdown();

      return;
    }

 if (result.isOwner === true) {
  hideKeyCountdown();

  return;
}

if (
  result.license?.status ===
    "expired" ||
  (
    result.license?.expiresAt &&
    Number(
      result.license.expiresAt
    ) <= Date.now()
  )
) {
  const currentView =
    new URLSearchParams(
      window.location.search
    ).get("view");

  if (dashboardSessionUser) {
    dashboardSessionUser.hasAccess =
      false;
  }

  if (currentView === "access") {
    hideKeyCountdown();

    document
      .getElementById(
        "expiredLicenseOverlay"
      )
      ?.remove();

    return;
  }

  if (keyTimeCard) {
    keyTimeCard.hidden =
      false;
  }

  if (keyTimeCountdown) {
    keyTimeCountdown.textContent =
      "00d 00h 00m 00s";
  }

  if (keyTimeExpiration) {
    keyTimeExpiration.textContent =
      "Key vencida";
  }

  showExpiredLicenseScreen();

  return;
}

if (
  result.hasLicense !== true ||
  !result.license
) {
  hideKeyCountdown();

  return;
}

    startKeyCountdown(
      result.license
    );
  } catch (error) {
    console.error(
      "No se pudo cargar el contador de la Key:",
      error
    );

    hideKeyCountdown();
  }
}

async function loadDashboardSession() {
  const sessionController =
    new AbortController();

  const sessionTimeout =
    setTimeout(
      () => {
        sessionController.abort();
      },
      10000
    );

  try {
    const response =
      await fetch(
        `${API_URL}/api/dashboard/session`,
        {
          method:
            "GET",

          headers: {
            Accept:
              "application/json",
          },

          credentials:
            "include",

          cache:
            "no-store",

          signal:
            sessionController.signal,
        }
      );

    const result =
      await response.json();

    if (
      response.status === 401 ||
      !result.authenticated
    ) {
      window.location.replace(
        "/auth/dashboard"
      );

      return;
    }

    if (
      !response.ok ||
      !result.success ||
      !result.data
    ) {
      throw new Error(
        result.message ||
        "No se pudo cargar la sesión."
      );
    }

    const sessionData =
      result.data;

    dashboardSessionUser =
      sessionData.user ||
      null;

const hasDashboardAccess =
  dashboardSessionUser?.hasAccess === true ||
  dashboardSessionUser?.isOwner === true;

    dashboardServers =
      Array.isArray(
        sessionData.guilds
      )
        ? sessionData.guilds
        : [];

    updateDashboardUser(
      dashboardSessionUser
    );

    renderServerDropdown();

    await loadCurrentLicense();
 

    const query =
      new URLSearchParams(
        window.location.search
      );


if (
  query.get("view") === "access" ||
  !hasDashboardAccess
) {
  showAccessPage();

  window.history.replaceState(
    {},
    "",
    "/?view=access"
  );
} else if (
  query.get("view") ===
    "servers"
) {

  showSessionServersPage();
} else {
  pageContent.innerHTML =
    dashboardHTML;

  updateDashboardUser(
    dashboardSessionUser
  );

  renderServerDropdown();

  cargarDatosDashboard();
}

  } catch (error) {
    console.error(
      "Error cargando la sesión:",
      error
    );

    if (
      error.name ===
      "AbortError"
    ) {
      profileDisplayName.textContent =
        "Servidor sin respuesta";

      profileUsername.innerHTML =
        "<i></i> Reintentá";

      ownerDisplayName.textContent =
        "Servidor sin respuesta";

      ownerUsername.textContent =
        "Recargá la página";

      serverCurrentName.textContent =
        "Sin respuesta";

      return;
    }

    profileDisplayName.textContent =
      "Sesión no disponible";

    profileUsername.innerHTML =
      "<i></i> Discord";

    ownerDisplayName.textContent =
      "Sesión no disponible";

    ownerUsername.textContent =
      "@discord";

    serverCurrentName.textContent =
      "Sin conexión";

    setTimeout(
      () => {
        window.location.replace(
          "/auth/dashboard"
        );
      },
      1500
    );
  } finally {
    clearTimeout(
      sessionTimeout
    );
  }
}

function updateDashboardUser(user) {
  if (!user) {
    return;
  }

  const displayName =
    user.displayName ||
    user.globalName ||
    user.username ||
    "Usuario";

  const username =
    user.username ||
    "discord";

  profileDisplayName.textContent =
    displayName;

  profileUsername.innerHTML = `
    <i></i>
    @${username}
  `;

  ownerDisplayName.textContent =
    displayName;

  ownerUsername.textContent =
    `@${username}`;

const currentWelcomeUsername =
  document.getElementById(
    "welcomeUsername"
  );
const licensesButton =
  document.getElementById(
    "publicLicenses"
  );

if (licensesButton) {
  licensesButton.style.display =
    user?.isOwner
      ? "flex"
      : "none";
}

if (currentWelcomeUsername) {
  currentWelcomeUsername.textContent =
    displayName;
}

  if (user.avatar) {
    const avatarImage = `
      <img
        src="${user.avatar}"
        alt="${displayName}"
      >
    `;

    profileAvatar.innerHTML =
      avatarImage;

    ownerAvatar.innerHTML =
      avatarImage;
  } else {
    const initials =
      getServerInitials(
        displayName
      );

    profileAvatar.textContent =
      initials;

    ownerAvatar.textContent =
      initials;
  }
}

function showAccessPage() {
  document.body.classList.add(
    "servers-selection-mode"
  );

  const displayName =
    dashboardSessionUser?.displayName ||
    dashboardSessionUser?.username ||
    "Usuario";

  const username =
    dashboardSessionUser?.username ||
    "discord";

  pageContent.innerHTML = `
    <div class="dynamic-page access-page">
      <section class="access-card">
        <div class="access-lock">
          🔒
        </div>

        <span class="access-eyebrow">
          NEBULA DASHBOARD
        </span>

        <h1>
          Acceso restringido
        </h1>

        <p>
          Hola <strong>${displayName}</strong>.
          Tu cuenta de Discord todavía no tiene acceso al dashboard.
        </p>

        <small>
          @${username}
        </small>

        <div class="access-key-inputs">
          <input
            id="accessKeyInput"
            type="text"
            placeholder="NEBULA-XXXX-XXXX-XXXX"
            maxlength="24"
            autocomplete="off"
          >
        </div>

        <button
          id="validateAccessKey"
          type="button"
        >
          Validar Key
        </button>

        <div
          class="access-message"
          id="accessMessage"
        ></div>

        <p class="access-help">
          ¿No tenés una key?
          Solicitásela al administrador.
        </p>
      </section>
    </div>
  `;

  const keyInput =
    document.getElementById(
      "accessKeyInput"
    );

  const validateButton =
    document.getElementById(
      "validateAccessKey"
    );

  const message =
    document.getElementById(
      "accessMessage"
    );

  keyInput?.addEventListener(
    "input",
    () => {
      keyInput.value =
        keyInput.value
          .toUpperCase()
          .replace(
            /[^A-Z0-9-]/g,
            ""
          );
    }
  );

validateButton?.addEventListener(
  "click",
  async () => {
    const key =
      keyInput.value
        .trim()
        .toUpperCase();

    if (!key) {
      message.textContent =
        "Ingresá una Key de acceso.";

      return;
    }

    validateButton.disabled = true;
    validateButton.textContent =
      "Validando...";

    message.textContent =
      "Comprobando la Key...";

    try {
      const response =
        await fetch(
          `${API_URL}/api/licenses/activate`,
          {
            method: "POST",

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
                key,
              }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          "La Key no es válida."
        );
      }

      message.textContent =
        "Key activada correctamente. Entrando...";

      if (dashboardSessionUser) {
        dashboardSessionUser.hasAccess =
          true;
      }

      setTimeout(
        () => {
          window.location.replace(
            "/?view=servers"
          );
        },
        700
      );
    } catch (error) {
      message.textContent =
        error.message ||
        "No se pudo validar la Key.";

      validateButton.disabled =
        false;

      validateButton.textContent =
        "Validar Key";
    }
  }
);

}

function showSessionServersPage() {
  document.body.classList.add(
    "servers-selection-mode"
  );

  const manageableServers =
    dashboardServers;

  const serverCards =
    manageableServers
      .map(server => {
        const initials =
          getServerInitials(
            server.name
          );

        const icon =
          server.icon
            ? `
              <img
                src="${server.icon}"
                alt="${server.name}"
              >
            `
            : `
              <span>
                ${initials}
              </span>
            `;

        const botStatus =
          server.botPresent
            ? `
              <span class="session-server-online">
                ● Bot conectado
              </span>
            `
            : `
              <span class="session-server-missing">
                Bot no agregado
              </span>
            `;

        const actionButton =
          server.botPresent
            ? `
              <button
                class="session-manage-server"
                data-server-id="${server.id}"
                type="button"
              >
                Administrar
              </button>
            `
            : `
              <button
                class="session-invite-server"
                data-server-id="${server.id}"
                type="button"
              >
                Agregar bot
              </button>
            `;

        return `
          <article class="session-server-card">
            <div class="session-server-icon">
              ${icon}
            </div>

            <div class="session-server-info">
              <strong>
                ${server.name}
              </strong>

              <span>
                ${
                  server.memberCount
                    ? `${Number(
                        server.memberCount
                      ).toLocaleString(
                        "es-AR"
                      )} miembros`
                    : "Cantidad no disponible"
                }
              </span>

              ${botStatus}
            </div>

            ${actionButton}
          </article>
        `;
      })
      .join("");

  pageContent.innerHTML = `
    <div class="dynamic-page session-servers-page">
      <section class="section-header">
        <div>
          <span>
            CUENTA DE DISCORD
          </span>

          <h1>
            Mis servidores
          </h1>

          <p>
            Seleccioná un servidor que puedas administrar.
          </p>
        </div>

        <button
          id="sessionInviteBot"
          class="section-action"
          type="button"
        >
          ＋ Invitar bot
        </button>
      </section>

      <section class="session-user-summary">
        <div class="session-user-avatar">
          ${
            dashboardSessionUser?.avatar
              ? `
                <img
                  src="${dashboardSessionUser.avatar}"
                  alt="${dashboardSessionUser.displayName}"
                >
              `
              : getServerInitials(
                  dashboardSessionUser?.displayName
                )
          }
        </div>

        <div>
          <span>
            Sesión iniciada como
          </span>

          <strong>
            ${
              dashboardSessionUser?.displayName ||
              dashboardSessionUser?.username ||
              "Usuario"
            }
          </strong>

          <small>
            @${
              dashboardSessionUser?.username ||
              "discord"
            }
          </small>
        </div>
      </section>

      <section class="session-server-list">
        ${
          serverCards ||
          `
            <div class="session-servers-empty">
              No administrás ningún servidor.
            </div>
          `
        }
      </section>
    </div>
  `;

  document
    .querySelectorAll(
      ".session-manage-server"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        async () => {
          const serverId =
            button.dataset.serverId;

          const selectedServer =
            dashboardServers.find(
              server =>
                String(server.id) ===
                String(serverId)
            );

          if (!selectedServer) {
            return;
          }


selectDashboardServer(
  selectedServer
);

document.body.classList.remove(
  "servers-selection-mode"
);

await abrirPanelServidor(
  serverId
);
               }
      );
    });

document
  .querySelectorAll(
    ".session-invite-server"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        const serverId =
          button.dataset.serverId;

        invitarBotYEsperar(
          serverId,
          button
        );
      }
    );
  });

document
  .getElementById(
    "sessionInviteBot"
  )
  ?.addEventListener(
    "click",
    () => {
      window.open(
        "/auth/bot/invite",
        "_blank",
        "noopener,noreferrer"
      );
    }
  );
 }
/* =========================================================
   INVITAR BOT Y DETECTAR CUANDO ENTRA
   ========================================================= */

async function invitarBotYEsperar(
  serverId,
  button
) {
  const originalText =
    button.textContent;

  button.disabled =
    true;

  button.textContent =
    "Esperando autorización...";

  const inviteWindow =
    window.open(
      `/auth/bot/invite?guildId=${encodeURIComponent(
        serverId
      )}`,
      "_blank",
      "noopener,noreferrer"
    );

  /*
    Algunos navegadores bloquean ventanas
    nuevas si no se abren directamente
    desde el clic.
  */

  if (!inviteWindow) {
    window.location.href =
      `/auth/bot/invite?guildId=${encodeURIComponent(
        serverId
      )}`;

    return;
  }

  const startedAt =
    Date.now();

  const maximumWait =
    120000;

  const checkInterval =
    2500;

  async function checkBotPresence() {
    try {
      const response =
        await fetch(
          `${API_URL}/api/servers/${encodeURIComponent(
            serverId
          )}`,
          {
            credentials:
              "include",

            cache:
              "no-store",
          }
        );

      const result =
        await response.json();

      if (
        response.ok &&
        result.success &&
        result.data
      ) {
        clearInterval(
          watcher
        );

        button.textContent =
          "Bot agregado ✓";

        /*
          Seleccionamos el servidor
          y abrimos automáticamente
          su panel.
        */

        const selectedServer =
          dashboardServers.find(
            server =>
              String(
                server.id
              ) ===
              String(
                serverId
              )
          );

        if (selectedServer) {
          selectedServer.botPresent =
            true;

          selectDashboardServer(
            selectedServer
          );
        }

        setTimeout(
          () => {
            abrirPanelServidor(
              serverId
            );
          },
          600
        );

        return;
      }

      if (
        Date.now() -
          startedAt >
        maximumWait
      ) {
        clearInterval(
          watcher
        );

        button.disabled =
          false;

        button.textContent =
          "Comprobar nuevamente";
      }
    } catch (error) {
      console.log(
        "El bot todavía no aparece en el servidor:",
        error.message
      );
    }
  }

  const watcher =
    setInterval(
      checkBotPresence,
      checkInterval
    );

  checkBotPresence();

  setTimeout(
    () => {
      clearInterval(
        watcher
      );

      if (
        button.textContent ===
        "Esperando autorización..."
      ) {
        button.disabled =
          false;

        button.textContent =
          originalText;
      }
    },
    maximumWait
  );
}
serverCurrent.addEventListener(
  "click",
  event => {
    event.stopPropagation();

    serverDropdown.classList.toggle(
      "open"
    );
  }
);

document.addEventListener(
  "click",
  event => {
    if (
      !serverSwitcher.contains(
        event.target
      )
    ) {
      serverDropdown.classList.remove(
        "open"
      );
    }
  }
);

const toast = document.getElementById("toast");
const showToast = () => {
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
};

document
  .querySelectorAll("button")
  .forEach(btn => {
    btn.addEventListener(
      "click",
      () => {

const ignoredButton =
  btn.id === "openWelcomeVariables" ||
  btn.id === "hamburger" ||
  btn.id === "serverCurrent" ||
  btn.id === "topProfile" ||
  btn.id === "sessionInviteBot" ||
  btn.id === "publicMyServers" ||
  btn.id === "publicInviteBot" ||
  btn.id === "publicBotStatus" ||
  btn.id === "publicSupport" ||
  btn.id === "publicLogout" ||
  btn.id === "publicDiscordSupport" ||
  btn.id === "publicLicenses" ||
  btn.classList.contains(
    "public-support-button"
  ) ||
  btn.classList.contains(
    "server-dropdown-item"
  ) ||
  btn.classList.contains(
    "session-invite-server"
  ) ||
  btn.classList.contains(
    "session-manage-server"
  ) ||
  btn.classList.contains(
    "verify-variable-button"
  );

if (!ignoredButton) {
             showToast();
        }
      }
    );
  });

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-item").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
  });
});
/* =========================================================
   NAVEGACIÓN PÚBLICA DE MIS SERVIDORES
   ========================================================= */

let publicBotStatusInterval =
  null;

function stopPublicBotStatusUpdates() {
  if (
    publicBotStatusInterval
  ) {
    clearInterval(
      publicBotStatusInterval
    );

    publicBotStatusInterval =
      null;
  }
}

document
  .getElementById("publicMyServers")
  ?.addEventListener("click", () => {
    stopPublicBotStatusUpdates();

    const hasDashboardAccess =
      dashboardSessionUser?.hasAccess === true ||
      dashboardSessionUser?.isOwner === true;

    if (!hasDashboardAccess) {
      showAccessPage();

      window.history.replaceState(
        {},
        "",
        "/?view=access"
      );

      return;
    }

    showSessionServersPage();

    window.history.replaceState(
      {},
      "",
      "/?view=servers"
    );
  });

document
  .getElementById(
    "publicInviteBot"
  )
  ?.addEventListener(
    "click",
    () => {
      stopPublicBotStatusUpdates();

      window.open(
        "/auth/bot/invite",
        "_blank",
        "noopener,noreferrer"
      );
    }
  );

document
  .getElementById(
    "publicBotStatus"
  )
  ?.addEventListener(
    "click",
    () => {
      document.body.classList.add(
        "servers-selection-mode"
      );

      stopPublicBotStatusUpdates();

      pageContent.innerHTML = `
        <div class="dynamic-page">
          <section class="section-header">
            <div>
              <span>
                ESTADO DEL SERVICIO
              </span>

              <h1>
                Estado del bot
              </h1>

              <p>
                Información actualizada automáticamente cada segundo.
              </p>
            </div>
          </section>

          <section class="public-status-grid">
            <article class="public-info-card">
              <span>
                CONEXIÓN
              </span>

              <strong id="liveBotConnection">
                Consultando...
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                LATENCIA
              </span>

              <strong id="liveBotLatency">
                -- ms
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                TIEMPO ACTIVO
              </span>

              <strong id="liveBotUptime">
                Sin datos
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                ÚLTIMA ACTUALIZACIÓN
              </span>

              <strong id="liveBotUpdatedAt">
                --
              </strong>
            </article>
          </section>
        </div>
      `;

      async function updatePublicBotStatus() {
        const connectionElement =
          document.getElementById(
            "liveBotConnection"
          );

        const latencyElement =
          document.getElementById(
            "liveBotLatency"
          );

        const uptimeElement =
          document.getElementById(
            "liveBotUptime"
          );

        const updatedElement =
          document.getElementById(
            "liveBotUpdatedAt"
          );

        /*
          Si la persona salió de esta página,
          detenemos el intervalo.
        */

        if (
          !connectionElement ||
          !latencyElement ||
          !uptimeElement ||
          !updatedElement
        ) {
          stopPublicBotStatusUpdates();

          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/api/bot/status`,
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",

                credentials:
                  "include",
              }
            );

          const result =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.message ||
              "No se pudo consultar el bot."
            );
          }

          const bot =
            result.data ||
            {};

          const online =
            bot.status ===
              "online" ||
            bot.online ===
              true;

          connectionElement.textContent =
            online
              ? "En línea"
              : "Desconectado";

          connectionElement.classList.toggle(
            "live-status-online",
            online
          );

          connectionElement.classList.toggle(
            "live-status-offline",
            !online
          );

       /*
  La latencia se actualiza mediante
  actualizarLatenciaRapida().
*/
          uptimeElement.textContent =
            bot.uptime ||
            "Sin datos";

          updatedElement.textContent =
            new Date()
              .toLocaleTimeString(
                "es-AR"
              );
        } catch (error) {
          console.error(
            "Error actualizando el estado del bot:",
            error
          );

          connectionElement.textContent =
            "Sin conexión";

          connectionElement.classList.remove(
            "live-status-online"
          );

          connectionElement.classList.add(
            "live-status-offline"
          );

          updatedElement.textContent =
            "Error";
        }
      }

      updatePublicBotStatus();


publicBotStatusInterval =
  setInterval(
    updatePublicBotStatus,
    500
  );
         }
  );

document
  .getElementById("publicLicenses")
  ?.addEventListener(
    "click",
    () => {

      stopPublicBotStatusUpdates();

if (!dashboardSessionUser?.isOwner) {
  alert("No tenés permisos para acceder a esta sección.");
  return;
}

const currentSelectedServer =
  dashboardServers.find(
    server =>
      String(server.id) ===
        String(selectedServerId) &&
      server.botPresent === true
  );

const serverWithBot =
  currentSelectedServer ||
  dashboardServers.find(
    server =>
      server.botPresent === true
  );

if (!serverWithBot) {
  alert(
    "El bot no está agregado a ningún servidor. Primero agregalo desde Mis servidores."
  );

  return;
}

selectedServerId =
  String(serverWithBot.id);

localStorage.setItem(
  "nebulaSelectedServerId",
  selectedServerId
);

renderSelectedServer(
  serverWithBot
);

      document.body.classList.add(
        "servers-selection-mode"
      );

    pageContent.innerHTML = `
<div class="dynamic-page">

<section class="section-header">
<div>
<span>LICENCIAS</span>
<h1>Administrador de Licencias</h1>
<p>
Gestioná todas las licencias del dashboard desde un solo lugar.
</p>
</div>
</section>

<div class="licenses-top-layout">

  <section class="public-status-grid licenses-stats-grid">

    <article class="public-info-card">
      <span>TOTAL</span>
      <strong id="licenseTotal">0</strong>
      <p>Licencias creadas</p>
    </article>

    <article class="public-info-card">
      <span>ACTIVAS</span>
      <strong id="licenseActive">0</strong>
      <p>Licencias en uso</p>
    </article>

    <article class="public-info-card">
      <span>DISPONIBLES</span>
      <strong id="licenseUnused">0</strong>
      <p>Sin activar</p>
    </article>

    <article class="public-info-card">
      <span>REVOCADAS</span>
      <strong id="licenseRevoked">0</strong>
      <p>Deshabilitadas</p>
    </article>

  </section>

  <aside class="license-settings-card">

    <div class="license-settings-title">
      <span class="license-settings-icon">
        ⚙
      </span>

      <div>
        <h3>Configuración de Licencias</h3>
        <p>
          Configurá dónde se enviarán los registros.
        </p>
      </div>
    </div>

    <div class="license-setting-group">
      <label for="licenseLogsChannel">
        Canal de Logs
      </label>


<select
  id="licenseLogsChannel"
  class="license-setting-select"
>
  <option value="">
    Cargando canales...
  </option>
</select>
       </div>

    <div class="license-checkbox-list">

      <label class="license-checkbox-item">
        <input
          id="licenseLogCreation"
          type="checkbox"
          checked
        >
        <span>Registrar creación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogActivation"
          type="checkbox"
          checked
        >
        <span>Registrar activación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogExpiration"
          type="checkbox"
          checked
        >
        <span>Registrar expiración</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogDeletion"
          type="checkbox"
          checked
        >
        <span>Registrar eliminación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogRevocation"
          type="checkbox"
          checked
        >
        <span>Registrar revocación</span>
      </label>

    </div>

    <button
      id="saveLicenseSettings"
      class="license-save-button"
      type="button"
    >
      💾 Guardar configuración
    </button>

  </aside>

</div>

<section class="panel licenses-list-panel">

  <div class="panel-head licenses-list-header">

    <div>
      <h3>Listado de Licencias</h3>

      <p class="licenses-list-description">
        Administrá, generá y controlá todas las licencias del sistema.
      </p>
    </div>

    <div class="licenses-header-actions">

      <button
        id="deleteAllLicensesButton"
        class="delete-all-licenses-button"
        type="button"
      >
        🗑 Borrar Keys
      </button>

      <button
        id="generateLicenseButton"
        class="generate-license-button"
        type="button"
      >
        🔑 Generar Key
      </button>

    </div>

  </div>

  <div
    id="licensesTable"
    class="licenses-table"
  >
    <div class="server-dropdown-empty">
      Todavía no hay licencias.
    </div>
  </div>

</section>

</div>
      `;

const generateLicenseButton =
  document.getElementById(
    "generateLicenseButton"
  );

const deleteAllLicensesButton =
  document.getElementById(
    "deleteAllLicensesButton"
  );

const licensesTable =
  document.getElementById(
    "licensesTable"
  );

const licenseTotal =
  document.getElementById(
    "licenseTotal"
  );

const licenseActive =
  document.getElementById(
    "licenseActive"
  );

const licenseUnused =
  document.getElementById(
    "licenseUnused"
  );

const licenseRevoked =
  document.getElementById(
    "licenseRevoked"
  );
const licenseLogsChannel =
  document.getElementById(
    "licenseLogsChannel"
  );

const saveLicenseSettings =
  document.getElementById(
    "saveLicenseSettings"
  );

const licenseLogCreation =
  document.getElementById(
    "licenseLogCreation"
  );

const licenseLogActivation =
  document.getElementById(
    "licenseLogActivation"
  );

const licenseLogExpiration =
  document.getElementById(
    "licenseLogExpiration"
  );

const licenseLogDeletion =
  document.getElementById(
    "licenseLogDeletion"
  );

const licenseLogRevocation =
  document.getElementById(
    "licenseLogRevocation"
  );
async function loadLicenseLogChannels() {
  if (!licenseLogsChannel) {
    return false;
  }

  if (!selectedServerId) {
    licenseLogsChannel.innerHTML = `
      <option value="">
        Primero seleccioná un servidor
      </option>
    `;

    licenseLogsChannel.disabled = true;

    return false;
  }

  licenseLogsChannel.disabled = true;

  licenseLogsChannel.innerHTML = `
    <option value="">
      Cargando canales...
    </option>
  `;

  try {
    const response = await fetch(
      `${API_URL}/api/servers/${encodeURIComponent(
        selectedServerId
      )}/text-channels`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        credentials: "include",
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudieron cargar los canales."
      );
    }

    /*
      Aceptamos result.data y también
      result.channels por seguridad.
    */

    const channels =
      Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.channels)
          ? result.channels
          : [];

    licenseLogsChannel.innerHTML = `
      <option value="">
        Seleccionar un canal
      </option>

      ${channels
        .map(
          channel => `
            <option value="${channel.id}">
              #${channel.name}
            </option>
          `
        )
        .join("")}
    `;

    licenseLogsChannel.disabled = false;

    return true;

  } catch (error) {
    console.error(
      "Error cargando canales de logs:",
      error
    );

    licenseLogsChannel.innerHTML = `
      <option value="">
        No se pudieron cargar los canales
      </option>
    `;

    licenseLogsChannel.disabled = true;

    return false;
  }
}

async function loadLicenseSettings() {
  if (
    !selectedServerId ||
    !licenseLogsChannel
  ) {
    return false;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/servers/${encodeURIComponent(
        selectedServerId
      )}/license-settings`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",
        },

        credentials: "include",
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudo cargar la configuración."
      );
    }

    const config =
      result.data || {};

    const savedLogsChannelId =
      String(
        config.logsChannelId || ""
      );

    /*
      Primero comprobamos que el canal
      guardado exista entre las opciones.
    */

    const channelExists = [
      ...licenseLogsChannel.options,
    ].some(
      option =>
        String(option.value) ===
        savedLogsChannelId
    );

    licenseLogsChannel.value =
      channelExists
        ? savedLogsChannelId
        : "";

    if (licenseLogCreation) {
      licenseLogCreation.checked =
        config.creation !== false;
    }

    if (licenseLogActivation) {
      licenseLogActivation.checked =
        config.activation !== false;
    }

    if (licenseLogExpiration) {
      licenseLogExpiration.checked =
        config.expiration !== false;
    }

    if (licenseLogDeletion) {
      licenseLogDeletion.checked =
        config.deletion !== false;
    }

    if (licenseLogRevocation) {
      licenseLogRevocation.checked =
        config.revocation !== false;
    }

    return true;

  } catch (error) {
    console.error(
      "Error cargando configuración de licencias:",
      error
    );

    return false;
  }
}


async function initializeLicenseSettings() {
  try {
    const channelsLoaded =
      await loadLicenseLogChannels();

    /*
      Solo buscamos la configuración
      si los canales pudieron cargarse.
    */

    if (channelsLoaded) {
      await loadLicenseSettings();
    }

  } catch (error) {
    console.error(
      "No se pudo inicializar la configuración de licencias:",
      error
    );
  }
}

window.addEventListener(
  "nebula:server-changed",
  async () => {
    const currentLicenseSelector =
      document.getElementById(
        "licenseLogsChannel"
      );

    if (currentLicenseSelector) {
      await initializeLicenseSettings();
    }
  }
);

async function saveCurrentLicenseSettings() {
  if (!selectedServerId) {
    alert(
      "Primero seleccioná un servidor."
    );

    return;
  }

  if (!saveLicenseSettings) {
    return;
  }

  const originalText =
    saveLicenseSettings.textContent;

  saveLicenseSettings.disabled =
    true;

  saveLicenseSettings.textContent =
    "Guardando...";

  try {
    const response =
      await fetch(
        `${API_URL}/api/servers/${encodeURIComponent(
          selectedServerId
        )}/license-settings`,
        {
          method: "POST",

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
              logsChannelId:
                licenseLogsChannel
                  ?.value || "",

              creation:
                licenseLogCreation
                  ?.checked === true,

              activation:
                licenseLogActivation
                  ?.checked === true,

              expiration:
                licenseLogExpiration
                  ?.checked === true,

              deletion:
                licenseLogDeletion
                  ?.checked === true,

              revocation:
                licenseLogRevocation
                  ?.checked === true,
            }),
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudo guardar la configuración."
      );
    }

    saveLicenseSettings.textContent =
      "✓ Configuración guardada";

    setTimeout(
      () => {
        saveLicenseSettings.textContent =
          originalText;
      },
      1800
    );

  } catch (error) {
    console.error(
      "Error guardando configuración de licencias:",
      error
    );

    alert(
      error.message ||
      "No se pudo guardar la configuración."
    );

    saveLicenseSettings.textContent =
      originalText;

  } finally {
    saveLicenseSettings.disabled =
      false;
  }
}

saveLicenseSettings
  ?.addEventListener(
    "click",
    saveCurrentLicenseSettings
  );

initializeLicenseSettings();

/* =========================================================
   FUNCIONES DEL ADMINISTRADOR DE LICENCIAS
========================================================= */

/* =========================================================
   ABRIR MODAL NUEVA LICENCIA
========================================================= */

function showGenerateLicenseModal() {
  document
    .querySelector(
      ".license-config-overlay"
    )
    ?.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="license-config-overlay">

        <div class="license-config-modal">

          <div class="license-config-header">

            <div class="license-config-title">
              <span>🔑</span>

              <div>
                <h2>Nueva Licencia</h2>

                <p>
                  Configurá la licencia antes de generarla.
                </p>
              </div>
            </div>

            <button
              class="license-config-close"
              id="closeLicenseModal"
              type="button"
            >
              ×
            </button>

          </div>

          <div class="license-config-field">

            <label>
              Duración
            </label>

            <div class="license-time-grid">

              <div class="license-time-field">
                <span>DÍAS</span>

                <input
                  id="licenseDays"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="9999"
                  value="30"
                >
              </div>

              <div class="license-time-field">
                <span>HORAS</span>

                <input
                  id="licenseHours"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="23"
                  value="0"
                >
              </div>

              <div class="license-time-field">
                <span>MINUTOS</span>

                <input
                  id="licenseMinutes"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="59"
                  value="0"
                >
              </div>

              <div class="license-time-field">
                <span>SEGUNDOS</span>

                <input
                  id="licenseSeconds"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="59"
                  value="0"
                >
              </div>

            </div>

          </div>

          <div class="license-duration-preview">

            <div>
              <span>
                VIGENCIA
              </span>

              <strong
                id="licenseExpirePreview"
              >
                Calculando...
              </strong>
            </div>

            <div
              class="license-modal-countdown"
              id="licenseModalCountdown"
            >
              ⏱ Calculando tiempo restante...
            </div>

            <b
              id="licensePermanentTag"
              class="license-permanent-badge"
              style="display:none"
            >
              PERMANENTE
            </b>

          </div>

          <div class="license-config-field">

            <label>
              Descripción
            </label>

            <textarea
              id="licenseDescription"
              class="license-config-textarea"
              placeholder="Ej: Licencia de prueba, cliente premium, etc."
            ></textarea>

          </div>

          <div class="license-config-actions">

            <button
              id="cancelGenerateLicense"
              class="license-config-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              id="continueGenerateLicense"
              class="license-config-confirm"
              type="button"
            >
              Continuar →
            </button>

          </div>

        </div>

      </div>
    `
  );

  initializeGenerateLicenseModal();
}

function initializeGenerateLicenseModal() {
  const daysInput =
    document.getElementById(
      "licenseDays"
    );

  const hoursInput =
    document.getElementById(
      "licenseHours"
    );

  const minutesInput =
    document.getElementById(
      "licenseMinutes"
    );

  const secondsInput =
    document.getElementById(
      "licenseSeconds"
    );

  const preview =
    document.getElementById(
      "licenseExpirePreview"
    );

  const countdown =
    document.getElementById(
      "licenseModalCountdown"
    );

  const permanent =
    document.getElementById(
      "licensePermanentTag"
    );

  let previewInterval =
    null;


  function clampInput(
    input,
    minimum,
    maximum
  ) {
    let value =
      Number(input?.value || 0);

    if (!Number.isFinite(value)) {
      value = minimum;
    }

    value =
      Math.floor(value);

    value =
      Math.min(
        maximum,
        Math.max(
          minimum,
          value
        )
      );

    input.value =
      String(value);

    return value;
  }

  function getDurationData() {
    const days =
      clampInput(
        daysInput,
        0,
        9999
      );

    const hours =
      clampInput(
        hoursInput,
        0,
        23
      );

    const minutes =
      clampInput(
        minutesInput,
        0,
        59
      );

    const seconds =
      clampInput(
        secondsInput,
        0,
        59
      );

    const isPermanent =
      days >= 9999;

    const milliseconds =
      isPermanent
        ? null
        : (
            days *
            24 *
            60 *
            60 *
            1000
          ) +
          (
            hours *
            60 *
            60 *
            1000
          ) +
          (
            minutes *
            60 *
            1000
          ) +
          (
            seconds *
            1000
          );

    return {
      days,
      hours,
      minutes,
      seconds,
      permanent:
        isPermanent,
      milliseconds,
    };
  }

  function formatCountdown(
    milliseconds
  ) {
    const totalSeconds =
      Math.max(
        0,
        Math.floor(
          milliseconds / 1000
        )
      );

    const days =
      Math.floor(
        totalSeconds / 86400
      );

    const hours =
      Math.floor(
        (
          totalSeconds % 86400
        ) / 3600
      );

    const minutes =
      Math.floor(
        (
          totalSeconds % 3600
        ) / 60
      );

    const seconds =
      totalSeconds % 60;

    return (
      `${days}d ` +
      `${String(hours).padStart(2, "0")}h ` +
      `${String(minutes).padStart(2, "0")}m ` +
      `${String(seconds).padStart(2, "0")}s restantes`
    );
  }

  function updatePreview() {
    const duration =
      getDurationData();

    if (duration.permanent) {
      preview.textContent =
        "Licencia permanente";

      countdown.textContent =
        "∞ Sin vencimiento";

      countdown.classList.add(
        "permanent"
      );

      permanent.style.display =
        "inline-flex";

      return;
    }

    permanent.style.display =
      "none";

    countdown.classList.remove(
      "permanent"
    );

    if (
      !duration.milliseconds ||
      duration.milliseconds < 1000
    ) {
      preview.textContent =
        "Duración no válida";

      countdown.textContent =
        "La duración mínima es de 1 segundo";

      return;
    }

    const expiresAt =
      Date.now() +
      duration.milliseconds;

    const expirationDate =
      new Date(expiresAt);

    preview.textContent =
      "Vence el " +
      expirationDate.toLocaleString(
        "es-AR",
        {
          day:
            "2-digit",

          month:
            "2-digit",

          year:
            "numeric",

          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",
        }
      );

    countdown.textContent =
      "⏱ " +
      formatCountdown(
        duration.milliseconds
      );
  }

  function closeModal() {
    if (previewInterval) {
      clearInterval(
        previewInterval
      );

      previewInterval =
        null;
    }

    document
      .querySelector(
        ".license-config-overlay"
      )
      ?.remove();
  }

  [
    daysInput,
    hoursInput,
    minutesInput,
    secondsInput,
  ].forEach(input => {
    input?.addEventListener(
      "input",
      updatePreview
    );

    input?.addEventListener(
      "change",
      updatePreview
    );
  });

  document
    .getElementById(
      "closeLicenseModal"
    )
    ?.addEventListener(
      "click",
      closeModal
    );

  document
    .getElementById(
      "cancelGenerateLicense"
    )
    ?.addEventListener(
      "click",
      closeModal
    );

  document
    .getElementById(
      "continueGenerateLicense"
    )
    ?.addEventListener(
      "click",
      async () => {
        const duration =
          getDurationData();

        const descriptionInput =
          document.getElementById(
            "licenseDescription"
          );

        const continueButton =
          document.getElementById(
            "continueGenerateLicense"
          );

        const description =
          String(
            descriptionInput?.value ||
            ""
          ).trim();

        if (
          !duration.permanent &&
          (
            !duration.milliseconds ||
            duration.milliseconds < 1000
          )
        ) {
          window.alert(
            "La duración mínima es de 1 segundo."
          );

          return;
        }

        continueButton.disabled =
          true;

        continueButton.textContent =
          "Generando...";

        closeModal();

        await generateConfiguredLicense({
          days:
            duration.days,

          hours:
            duration.hours,

          minutes:
            duration.minutes,

          seconds:
            duration.seconds,

          permanent:
            duration.permanent,

          durationMilliseconds:
            duration.milliseconds,

          description,
        });
      }
    );

  updatePreview();

  previewInterval =
    setInterval(
      updatePreview,
      1000
    );
}


function escapeLicenseHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLicenseDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return date.toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function getLicenseStatusData(
  license
) {
  const rawStatus =
    String(
      license?.status ||
      license?.state ||
      ""
    )
      .trim()
      .toLowerCase();

  const revoked =
    license?.revoked === true ||
    license?.disabled === true ||
    rawStatus === "revoked" ||
    rawStatus === "revocada" ||
    rawStatus === "disabled";

 const used =
  license?.used === true ||
  license?.active === true ||
  license?.activated === true ||
  Boolean(
    license?.userId ||
    license?.discordId ||
    license?.discordUserId ||
    license?.activatedBy ||
    license?.user?.id
  ) ||
  rawStatus === "used" ||
  rawStatus === "active" ||
  rawStatus === "activa";

  if (revoked) {
    return {
      className: "revoked",
      label: "Revocada",
      description:
        license?.revokedAt
          ? `Revocada: ${formatLicenseDate(
              license.revokedAt
            )}`
          : "Licencia deshabilitada",
    };
  }

  if (used) {
    return {
      className: "active",
      label: "Activa",
      description:
        license?.activatedAt
          ? `Activada: ${formatLicenseDate(
              license.activatedAt
            )}`
          : "Licencia en uso",
    };
  }

  return {
    className: "available",
    label: "Disponible",
    description:
      "Nunca utilizada",
  };
}

function getLicenseUserData(
  license
) {
  const user =
  license?.user ||
  license?.discordUser ||
  (
    typeof license?.activatedBy ===
    "object"
      ? license.activatedBy
      : {}
  );

 const userId =
  user?.id ||
  license?.userId ||
  license?.discordId ||
  license?.discordUserId ||
  (
    typeof license?.activatedBy ===
    "string"
      ? license.activatedBy
      : ""
  );

 const displayName =
  user?.displayName ||
  user?.globalName ||
  user?.username ||
  license?.activatedDisplayName ||
  license?.activatedUsername ||
  license?.displayName ||
  license?.username ||
  "";

  const username =
    user?.username ||
    license?.username ||
    "";

 const avatar =
  user?.avatar ||
  license?.activatedAvatar ||
  license?.avatar ||
  license?.userAvatar ||
  "";

  const assigned =
    Boolean(
      userId ||
      displayName ||
      username
    );

  return {
    assigned,
    id: String(userId || ""),
    displayName:
      displayName ||
      username ||
      "Sin asignar",
    username:
      username
        ? `@${username}`
        : assigned
          ? "Usuario de Discord"
          : "Nunca utilizada",
    avatar,
  };
}

function getUserInitials(name) {
  return String(
    name || "?"
  )
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word =>
      word.charAt(0)
    )
    .join("")
    .toUpperCase();
}

function createLicenseUserHTML(
  license
) {
  const user =
    getLicenseUserData(
      license
    );

  const avatarContent =
    user.avatar
      ? `
          <img
            src="${escapeLicenseHTML(
              user.avatar
            )}"
            alt="${escapeLicenseHTML(
              user.displayName
            )}"
          >
        `
      : escapeLicenseHTML(
          user.assigned
            ? getUserInitials(
                user.displayName
              )
            : "?"
        );

  return `
    <div class="license-user ${
      user.assigned
        ? ""
        : "unassigned"
    }">

      <div class="license-user-avatar">
        ${avatarContent}
      </div>

      <div class="license-user-copy">

        <strong>
          ${escapeLicenseHTML(
            user.displayName
          )}
        </strong>

        <span>
          ${
            user.id
              ? `ID: ${escapeLicenseHTML(
                  user.id
                )}`
              : escapeLicenseHTML(
                  user.username
                )
          }
        </span>

      </div>

    </div>
  `;
}

function createLicenseCardHTML(
  license,
  isNew = false
) {
  const key =
    license?.key ||
    license?.licenseKey ||
    license?.token ||
    "KEY NO DISPONIBLE";

  const createdAt =
    license?.createdAt ||
    license?.created ||
    new Date().toISOString();

  const duration =
    Number(
      license?.durationDays ??
      license?.duration ??
      0
    );

const durationHours =
  Number(
    license?.durationHours ??
    0
  );

const durationMinutes =
  Number(
    license?.durationMinutes ??
    0
  );

const durationSeconds =
  Number(
    license?.durationSeconds ??
    0
  );

const durationMilliseconds =
  Number(
    license?.durationMilliseconds ??
    (
      duration * 86400000 +
      durationHours * 3600000 +
      durationMinutes * 60000 +
      durationSeconds * 1000
    )
  );

  const permanent =
    license?.permanent === true ||
    duration >= 9999 ||
    String(
      license?.type || ""
    ).toLowerCase() ===
      "permanente";

  const description =
    String(
      license?.description ||
      "Sin descripción"
    ).trim();

  const type =
    permanent
      ? "Permanente"
      : duration > 0
        ? `${duration} ${
            duration === 1
              ? "día"
              : "días"
          }`
        : (
            license?.type ||
            license?.plan ||
            "Dashboard"
          );

const expirationDate =
  permanent
    ? null
    : (
        license?.expiresAt ||
        license?.expirationDate ||
        license?.expires ||
        (
          durationMilliseconds > 0
            ? new Date(
                new Date(createdAt).getTime() +
                durationMilliseconds
              ).toISOString()
            : null
        )
      );

  const status =
    getLicenseStatusData(
      license
    );

  const durationText =
    permanent
      ? "Duración: Permanente"
      : duration > 0
        ? `Duración: ${duration} ${
            duration === 1
              ? "día"
              : "días"
          }`
        : "Duración no disponible";

  const expirationText =
    permanent
      ? "Sin vencimiento"
      : expirationDate
        ? `Vence: ${formatLicenseDate(
            expirationDate
          )}`
        : "Vencimiento no disponible";

  return `
    <div
      class="license-generated-card ${
        isNew
          ? "license-new-entry"
          : ""
      }"
      data-license-key="${escapeLicenseHTML(
        key
      )}"
      data-license-duration="${escapeLicenseHTML(
        String(duration)
      )}"
      data-license-permanent="${
        permanent
          ? "true"
          : "false"
      }"
      data-license-description="${escapeLicenseHTML(
        description
      )}"
      data-license-created-at="${escapeLicenseHTML(
        createdAt
      )}"
      data-license-expires-at="${escapeLicenseHTML(
        expirationDate || ""
      )}"
    >

      <div class="license-generated-info">

        <span>
          LICENCIA
        </span>

        <strong title="${escapeLicenseHTML(
          key
        )}">
          ${escapeLicenseHTML(
            key
          )}
        </strong>

        <div class="license-meta">

          <span class="license-created-date">
            Creada:
            ${escapeLicenseHTML(
              formatLicenseDate(
                createdAt
              )
            )}
          </span>

          <span class="license-meta-separator">
            •
          </span>

          <span class="license-type">
            ${escapeLicenseHTML(
              type
            )}
          </span>

        </div>

      ${
  permanent
    ? `
      <div class="license-permanent-timer">
        <strong>∞</strong>
        <span>LICENCIA PERMANENTE</span>
      </div>
    `
    : `
      <div
        class="license-live-timer"
        data-license-countdown
        data-expires-at="${escapeLicenseHTML(
          expirationDate || ""
        )}"
      >

        <div class="license-time-box">
          <strong data-countdown-days>
            00
          </strong>

          <span>
            DÍAS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-hours>
            00
          </strong>

          <span>
            HORAS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-minutes>
            00
          </strong>

          <span>
            MINUTOS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-seconds>
            00
          </strong>

          <span>
            SEGUNDOS
          </span>
        </div>

      </div>
    `
}

</div>

      ${createLicenseUserHTML(
        license
      )}

      <div class="license-state-column">

        <b class="license-status ${status.className}">
          ${status.label}
        </b>

        <span class="license-state-date">
          ${escapeLicenseHTML(
            status.description
          )}
        </span>

      </div>

      <div class="license-actions">

        <button
          class="license-action-btn view"
          title="Ver detalles"
          type="button"
          data-license-action="view"
        >
          👁
        </button>

        <button
          class="license-action-btn edit"
          title="Editar"
          type="button"
          data-license-action="edit"
        >
          ✏️
        </button>

        <button
          class="license-action-btn copy"
          title="Copiar Key"
          type="button"
          data-license-action="copy"
          data-license-key="${escapeLicenseHTML(
            key
          )}"
        >
          📋
        </button>

        <button
          class="license-action-btn delete"
          title="Eliminar"
          type="button"
          data-license-action="delete"
        >
          🗑
        </button>

      </div>

    </div>
  `;
}

let licensesCountdownInterval =
  null;

function updateLicenseCountdowns() {
  const countdowns =
    document.querySelectorAll(
      "[data-license-countdown]"
    );

  countdowns.forEach(countdown => {
    const expiresAt =
      countdown.dataset.expiresAt;

    const daysElement =
      countdown.querySelector(
        "[data-countdown-days]"
      );

    const hoursElement =
      countdown.querySelector(
        "[data-countdown-hours]"
      );

    const minutesElement =
      countdown.querySelector(
        "[data-countdown-minutes]"
      );

    const secondsElement =
      countdown.querySelector(
        "[data-countdown-seconds]"
      );

  const expirationTime =
  /^\d+$/.test(
    String(expiresAt)
  )
    ? Number(expiresAt)
    : new Date(
        expiresAt
      ).getTime();

    if (
      !expiresAt ||
      Number.isNaN(expirationTime)
    ) {
      countdown.innerHTML = `
        <span class="license-countdown-error">
          Vencimiento no disponible
        </span>
      `;

      return;
    }

    const remaining =
      expirationTime - Date.now();

    
      if (remaining <= 0) {

        countdown.innerHTML = `
            <span class="license-countdown-expired">
                LICENCIA EXPIRADA
            </span>
        `;

        const card =
          countdown.closest(
            ".license-generated-card"
          );

        if (
          card &&
          !card.dataset.expired
        ) {
            card.dataset.expired = "true";

            deleteExpiredLicense(
              card.dataset.licenseKey
            );
        }

        return;
    }

    const days =
      Math.floor(
        remaining / 86400000
      );

    const hours =
      Math.floor(
        remaining % 86400000 /
        3600000
      );

    const minutes =
      Math.floor(
        remaining % 3600000 /
        60000
      );

    const seconds =
      Math.floor(
        remaining % 60000 /
        1000
      );

    if (daysElement) {
      daysElement.textContent =
        String(days).padStart(2, "0");
    }

    if (hoursElement) {
      hoursElement.textContent =
        String(hours).padStart(2, "0");
    }

    if (minutesElement) {
      minutesElement.textContent =
        String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
      secondsElement.textContent =
        String(seconds).padStart(2, "0");
    }
  });
}

async function deleteExpiredLicense(key) {
  try {
    await fetch(
      `/api/licenses/${encodeURIComponent(key)}`,
      {
        method: "DELETE"
      }
    );

    const card =
      document.querySelector(
        `[data-license-key="${CSS.escape(key)}"]`
      );

    if (card) {
      card.remove();
    }

    updateLicenseCounters();

  } catch (error) {
    console.error(
      "Error eliminando licencia:",
      error
    );
  }
}

function startLicenseCountdowns() {
  clearInterval(
    licensesCountdownInterval
  );

  updateLicenseCountdowns();

  licensesCountdownInterval =
    setInterval(
      updateLicenseCountdowns,
      1000
    );
}

function createLicensesHeaderHTML() {
  return `
    <div class="licenses-table-header">
      <span>Licencia</span>
      <span>Usuario</span>
      <span>Estado</span>
      <span style="text-align:right">
        Acciones
      </span>
    </div>
  `;
}

function createEmptyLicensesHTML() {
  return `
    ${createLicensesHeaderHTML()}

    <div class="licenses-empty-state">
      Todavía no hay licencias.
    </div>
  `;
}

/* =========================================================
   MODAL PARA BORRAR TODAS LAS LICENCIAS
========================================================= */

function showDeleteAllLicensesModal() {
  document
    .querySelector(
      ".delete-licenses-overlay"
    )
    ?.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="delete-licenses-overlay">

        <div class="delete-licenses-modal">

          <button
            class="delete-licenses-close"
            id="closeDeleteLicensesModal"
            type="button"
          >
            ×
          </button>

          <div class="delete-licenses-icon">
            🗑
          </div>

          <span class="delete-licenses-eyebrow">
            ACCIÓN DE SEGURIDAD
          </span>

          <h2>
            ¿Querés borrar todas las Keys?
          </h2>

          <p>
            Esta acción eliminará definitivamente todas
            las licencias guardadas y no se podrá deshacer.
          </p>

          <label for="deleteLicensesCode">
            Ingresá el código de seguridad
          </label>

          <input
            id="deleteLicensesCode"
            type="password"
            inputmode="numeric"
            maxlength="4"
            placeholder="••••"
            autocomplete="off"
          >

          <div
            class="delete-licenses-message"
            id="deleteLicensesMessage"
          ></div>

          <div class="delete-licenses-actions">

            <button
              id="cancelDeleteLicenses"
              class="delete-licenses-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              id="confirmDeleteLicenses"
              class="delete-licenses-confirm"
              type="button"
            >
              Borrar todas
            </button>

          </div>

        </div>

      </div>
    `
  );

  initializeDeleteAllLicensesModal();
}

function initializeDeleteAllLicensesModal() {
  const overlay =
    document.querySelector(
      ".delete-licenses-overlay"
    );

  const codeInput =
    document.getElementById(
      "deleteLicensesCode"
    );

  const message =
    document.getElementById(
      "deleteLicensesMessage"
    );

  const confirmButton =
    document.getElementById(
      "confirmDeleteLicenses"
    );

  const closeModal = () => {
    overlay?.remove();
  };

  document
    .getElementById(
      "closeDeleteLicensesModal"
    )
    ?.addEventListener(
      "click",
      closeModal
    );

  document
    .getElementById(
      "cancelDeleteLicenses"
    )
    ?.addEventListener(
      "click",
      closeModal
    );

  overlay?.addEventListener(
    "click",
    event => {
      if (
        event.target === overlay
      ) {
        closeModal();
      }
    }
  );

  codeInput?.addEventListener(
    "input",
    () => {
      codeInput.value =
        codeInput.value.replace(
          /\D/g,
          ""
        );

      message.textContent =
        "";
    }
  );

  codeInput?.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter"
      ) {
        confirmButton?.click();
      }
    }
  );

  confirmButton?.addEventListener(
    "click",
    async () => {
      const code =
        String(
          codeInput?.value || ""
        ).trim();

      if (!code) {
        message.textContent =
          "Ingresá el código de seguridad.";

        return;
      }

      confirmButton.disabled =
        true;

      confirmButton.textContent =
        "Eliminando...";

      message.textContent =
        "Comprobando código...";

      try {
        const response =
          await fetch(
            `${API_URL}/api/licenses`,
            {
              method:
                "DELETE",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  code,
                }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
            "No se pudieron borrar las Keys."
          );
        }

        if (licensesTable) {
          licensesTable.innerHTML =
            createEmptyLicensesHTML();
        }

        updateLicenseCounters();

        message.textContent =
          "Todas las Keys fueron eliminadas.";

        setTimeout(
          () => {
            closeModal();
          },
          700
        );
      } catch (error) {
        message.textContent =
          error.message ||
          "No se pudieron borrar las Keys.";

        confirmButton.disabled =
          false;

        confirmButton.textContent =
          "Borrar todas";

        codeInput?.focus();
        codeInput?.select();
      }
    }
  );

  setTimeout(
    () => {
      codeInput?.focus();
    },
    100
  );
}

function ensureLicensesHeader() {
  if (!licensesTable) {
    return;
  }

  const existingHeader =
    licensesTable.querySelector(
      ".licenses-table-header"
    );

  if (!existingHeader) {
    licensesTable.insertAdjacentHTML(
      "afterbegin",
      createLicensesHeaderHTML()
    );
  }
}
/* =========================================================
   CARGAR LICENCIAS GUARDADAS DEL SERVIDOR
========================================================= */

async function loadSavedLicenses() {
  if (!licensesTable) {
    return;
  }

  licensesTable.innerHTML = `
    ${createLicensesHeaderHTML()}

    <div class="licenses-empty-state">
      Cargando licencias...
    </div>
  `;

  try {
    const response =
      await fetch(
        `${API_URL}/api/licenses`,
        {
          method: "GET",

          credentials:
            "include",

          headers: {
            Accept:
              "application/json",
          },

          cache:
            "no-store",
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudieron cargar las licencias."
      );
    }

    const licenses =
      Array.isArray(
        result.licenses
      )
        ? result.licenses
        : [];

    if (
      licenses.length === 0
    ) {
      licensesTable.innerHTML =
        createEmptyLicensesHTML();

      updateLicenseCounters();

      return;
    }

    licensesTable.innerHTML = `
      ${createLicensesHeaderHTML()}

      ${licenses
        .map(
          license =>
            createLicenseCardHTML(
              license,
              false
            )
        )
        .join("")}
    `;

    updateLicenseCounters();

startLicenseCountdowns();

  } catch (error) {
    console.error(
      "Error cargando licencias:",
      error
    );

    licensesTable.innerHTML = `
      ${createLicensesHeaderHTML()}

      <div class="license-generation-error">
        ❌ ${
          error.message ||
          "No se pudieron cargar las licencias."
        }
      </div>
    `;

    updateLicenseCounters();
  }
}

function removeLicensesEmptyState() {
  licensesTable
    ?.querySelector(
      ".server-dropdown-empty"
    )
    ?.remove();

  licensesTable
    ?.querySelector(
      ".licenses-empty-state"
    )
    ?.remove();

  licensesTable
    ?.querySelector(
      ".license-generation-error"
    )
    ?.remove();
}

function updateLicenseCounters() {
  if (!licensesTable) {
    return;
  }

  const cards = [
    ...licensesTable.querySelectorAll(
      ".license-generated-card"
    ),
  ];

  const total =
    cards.length;

  const active =
    cards.filter(card =>
      card.querySelector(
        ".license-status.active, .license-status.used"
      )
    ).length;

  const available =
    cards.filter(card =>
      card.querySelector(
        ".license-status.available"
      )
    ).length;

  const revoked =
    cards.filter(card =>
      card.querySelector(
        ".license-status.revoked"
      )
    ).length;

  if (licenseTotal) {
    licenseTotal.textContent =
      String(total);
  }

  if (licenseActive) {
    licenseActive.textContent =
      String(active);
  }

  if (licenseUnused) {
    licenseUnused.textContent =
      String(available);
  }

  if (licenseRevoked) {
    licenseRevoked.textContent =
      String(revoked);
  }
}

function showLicenseGenerator() {
  if (!licensesTable) {
    return;	
  }

  licensesTable
    .querySelector(
      ".license-generating-overlay"
    )
    ?.remove();

document.body.insertAdjacentHTML(
  "beforeend", 
    `
      <div class="license-generating-overlay">

        <div class="license-generating-box">

          <div class="license-generating-icon">
            🔑
          </div>

          <strong>
            Generando licencia...
          </strong>

          <p>
            Preparando una nueva Key de acceso.
          </p>

          <div class="license-generating-progress">
            <span></span>
          </div>

          <small class="license-generating-step">
            Conectando con Nebula...
          </small>

        </div>

      </div>
    `
  );
}

function updateLicenseGeneratorStep(
  text
) {
  const step =
    document.querySelector(
      ".license-generating-step"
    );

  if (step) {
    step.textContent =
      text;
  }
}

function showLicenseGeneratorSuccess() {
  const box =
    document.querySelector(
      ".license-generating-box"
    );

  if (!box) {
    return;
  }

  box.classList.add(
    "is-success"
  );

  const icon =
    box.querySelector(
      ".license-generating-icon"
    );

  const title =
    box.querySelector(
      "strong"
    );

  const description =
    box.querySelector(
      "p"
    );

  const step =
    box.querySelector(
      ".license-generating-step"
    );

  if (icon) {
    icon.textContent =
      "✓";
  }

  if (title) {
    title.textContent =
      "Licencia creada";
  }

  if (description) {
    description.textContent =
      "La nueva Key fue agregada correctamente.";
  }

  if (step) {
    step.textContent =
      "Proceso completado";
  }
}

function hideLicenseGenerator() {
  const overlay =
    document.querySelector(
      ".license-generating-overlay"
    );

  if (!overlay) {
    return;
  }

  overlay.style.opacity =
    "0";

  setTimeout(
    () => {
      overlay.remove();
    },
    220
  );
}

function waitLicense(ms) {
  return new Promise(resolve =>
    setTimeout(
      resolve,
      ms
    )
  );
}

async function copyLicenseKey(
  button
) {
  const key =
    button.dataset.licenseKey ||
    button
      .closest(
        ".license-generated-card"
      )
      ?.dataset.licenseKey ||
    "";

  if (!key) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      key
    );

    const originalText =
      button.textContent;

    button.textContent =
      "✓";

    button.classList.add(
      "is-copied"
    );

    setTimeout(
      () => {
        button.textContent =
          originalText;

        button.classList.remove(
          "is-copied"
        );
      },
      1300
    );
  } catch (error) {
    console.error(
      "No se pudo copiar la licencia:",
      error
    );
  }
}

function showLicenseDetails(
  card
) {
  const key =
    card?.dataset.licenseKey ||
    "Sin Key";

  const userName =
    card
      ?.querySelector(
        ".license-user-copy strong"
      )
      ?.textContent
      ?.trim() ||
    "Sin asignar";

  const userId =
    card
      ?.querySelector(
        ".license-user-copy span"
      )
      ?.textContent
      ?.trim() ||
    "Sin datos";

const status =
  card
    ?.querySelector(
      ".license-status"
    )
    ?.textContent
    ?.trim() ||
  "Sin estado";

const durationInfo =
  card
    ?.querySelector(
      ".license-duration-text"
    )
    ?.textContent
    ?.replace(/\s+/g, " ")
    ?.trim() ||
  "Duración no disponible";

const expirationInfo =
  card
    ?.querySelector(
      ".license-expiration-text"
    )
    ?.textContent
    ?.replace(/\s+/g, " ")
    ?.trim() ||
  "Vencimiento no disponible";

alert(
  `DETALLES DE LA LICENCIA\n\n` +
  `Key: ${key}\n` +
  `Usuario: ${userName}\n` +
  `${userId}\n` +
  `${durationInfo}\n` +
  `${expirationInfo}\n` +
  `Estado: ${status}`
);

}

function editLicenseCard(
  card
) {
  const currentKey =
    card?.dataset.licenseKey ||
    "";

  const newKey =
    prompt(
      "Editar el nombre visible de la Key:",
      currentKey
    );

  if (
    !newKey ||
    newKey.trim() ===
      currentKey
  ) {
    return;
  }

  const normalizedKey =
    newKey
      .trim()
      .toUpperCase();

  card.dataset.licenseKey =
    normalizedKey;

  const keyElement =
    card.querySelector(
      ".license-generated-info > strong"
    );

  const copyButton =
    card.querySelector(
      ".license-action-btn.copy"
    );

  if (keyElement) {
    keyElement.textContent =
      normalizedKey;

    keyElement.title =
      normalizedKey;
  }

  if (copyButton) {
    copyButton.dataset.licenseKey =
      normalizedKey;
  }
}

async function deleteLicenseCard(
  card
) {
  const key =
    card?.dataset.licenseKey ||
    "";

  if (!key) {
    window.alert(
      "No se pudo obtener la Key."
    );

    return;
  }

  const confirmed =
    window.confirm(
      `¿Querés eliminar ${key} definitivamente?`
    );

  if (!confirmed) {
    return;
  }

  try {
    const response =
      await fetch(
        `${API_URL}/api/licenses/${encodeURIComponent(
          key
        )}`,
        {
          method: "DELETE",

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

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudo eliminar la licencia."
      );
    }

    card.style.opacity =
      "0";

    card.style.transform =
      "translateX(20px)";

    setTimeout(
      () => {
        card.remove();

        updateLicenseCounters();

        const remainingCards =
          licensesTable.querySelectorAll(
            ".license-generated-card"
          );

        if (
          remainingCards.length === 0
        ) {
          licensesTable.innerHTML =
            createEmptyLicensesHTML();
        }
      },
      220
    );
  } catch (error) {
    console.error(
      "Error eliminando licencia:",
      error
    );

    window.alert(
      error.message ||
      "No se pudo eliminar la licencia."
    );
  }
}

/* =========================================================
   EVENTOS DE LOS BOTONES DE LAS FILAS
========================================================= */

licensesTable?.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        "[data-license-action]"
      );

    if (!button) {
      return;
    }

    const card =
      button.closest(
        ".license-generated-card"
      );

    const action =
      button.dataset.licenseAction;

    if (
      action === "copy"
    ) {
      copyLicenseKey(
        button
      );

      return;
    }

    if (
      action === "view"
    ) {
      showLicenseDetails(
        card
      );

      return;
    }

    if (
      action === "edit"
    ) {
      editLicenseCard(
        card
      );

      return;
    }

    if (
      action === "delete"
    ) {
      deleteLicenseCard(
        card
      );
    }
  }
);

/* Ponemos el encabezado desde que se abre la página */

if (licensesTable) {
  loadSavedLicenses();
}


/*
  Actualización en tiempo real de las licencias.
  Cuando una licencia cambia desde Discord
  o desde otra sesión del dashboard,
  volvemos a cargar la tabla.
*/

socket.off("licenses:update");

socket.on(
  "licenses:update",
  async () => {
    const currentLicensesTable =
      document.getElementById(
        "licensesTable"
      );

    /*
      Solo actualizamos si la página
      de licencias está abierta.
    */

    if (!currentLicensesTable) {
      return;
    }

    console.log(
      "Cambio de licencias recibido en tiempo real."
    );

    await loadSavedLicenses();
  }
);

async function generateConfiguredLicense(
  settings
) {
const days =
  Number(
    settings.days || 0
  );

const hours =
  Number(
    settings.hours || 0
  );

const minutes =
  Number(
    settings.minutes || 0
  );

const seconds =
  Number(
    settings.seconds || 0
  );

const permanent =
  settings.permanent === true ||
  days >= 9999;

const duration =
  days;

  const originalText =
    generateLicenseButton.innerHTML;

  generateLicenseButton.disabled =
    true;

  generateLicenseButton.innerHTML =
    "Generando Key...";

  showLicenseGenerator();

  try {
    updateLicenseGeneratorStep(
      "Validando datos..."
    );

    await waitLicense(
      350
    );

    updateLicenseGeneratorStep(
      "Generando código único..."
    );

 const response =
  await fetch(
    `${API_URL}/api/licenses/generate`,
    {
      method:
        "POST",

      credentials:
        "include",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",
      },

      body:
        JSON.stringify({

guildId:
  selectedServerId,

          days,
          hours,
          minutes,
          seconds,

          durationDays:
            days,

          duration:
            days,

          permanent,

          description:
            settings.description,
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
        "No se pudo generar la Key."
      );
    }

    const generatedLicense =
      Array.isArray(
        result.licenses
      )
        ? result.licenses[0]
        : result.license ||
          result.data ||
          null;

    const generatedKey =
      generatedLicense?.key ||
      generatedLicense?.licenseKey ||
      generatedLicense?.token;


const createdAt =
  generatedLicense?.createdAt ||
  new Date().toISOString();

const calculatedExpiresAt =
  permanent
    ? null
    : (
        generatedLicense?.expiresAt ||
        generatedLicense?.expirationDate ||
        generatedLicense?.expires ||
        (
          settings.durationMilliseconds
            ? new Date(
                new Date(createdAt).getTime() +
                settings.durationMilliseconds
              ).toISOString()
            : null
        )
      );

if (!generatedKey) {

    throw new Error(
     "El servidor no devolvió la Key."
      );
    }

    updateLicenseGeneratorStep(
      "Guardando en el sistema..."
    );

    await waitLicense(
      450
    );

    showLicenseGeneratorSuccess();

    await waitLicense(
      650
    );

    hideLicenseGenerator();

    removeLicensesEmptyState();
    ensureLicensesHeader();

    licensesTable.insertAdjacentHTML(
      "beforeend",
      createLicenseCardHTML(
        {
          ...generatedLicense,

          key:
            generatedKey,

        duration:
  days,

durationDays:
  days,

durationHours:
  hours,

durationMinutes:
  minutes,

durationSeconds:
  seconds,

durationMilliseconds:
  settings.durationMilliseconds,

permanent:
  permanent,

          description:
            settings.description,

          type:
            permanent
              ? "Permanente"
              : `${duration} ${
                  duration === 1
                    ? "día"
                    : "días"
                }`,

          
createdAt,

expiresAt:
  calculatedExpiresAt,

        },
        true
      )
    );

startLicenseCountdowns();

    updateLicenseCounters();

    licensesTable.scrollTo({
      top:
        licensesTable.scrollHeight,

      behavior:
        "smooth",
    });
  } catch (error) {
    console.error(
      "Error generando licencia:",
      error
    );

    hideLicenseGenerator();

    alert(
      error.message ||
      "No se pudo generar la licencia."
    );
  } finally {
    generateLicenseButton.disabled =
      false;

    generateLicenseButton.innerHTML =
      originalText;
  }
}

/* =========================================================
   ABRIR MODAL GENERAR LICENCIA
========================================================= */

generateLicenseButton
  ?.addEventListener(
    "click",
    () => {
      showGenerateLicenseModal();
    }
  );


deleteAllLicensesButton
  ?.addEventListener(
    "click",
    () => {
      showDeleteAllLicensesModal();

    }
  );

    }
  );

document
  .getElementById(
    "publicSupport"
  )

  ?.addEventListener(
    "click",
    () => {
  stopPublicBotStatusUpdates();
      document.body.classList.add(
        "servers-selection-mode"
      );

      pageContent.innerHTML = `
        <div class="dynamic-page">
          <section class="section-header">
            <div>
              <span>
                AYUDA
              </span>

              <h1>
                Centro de soporte
              </h1>

              <p>
                Encontrá ayuda para configurar y administrar Nebula.
              </p>
            </div>
          </section>

          <section class="public-support-grid">
            <article class="public-info-card">
              <span>
                CONFIGURACIÓN
              </span>

              <strong>
                Primeros pasos
              </strong>

              <p>
                Elegí un servidor y presioná Administrar.
              </p>
            </article>

        <article
  class="public-info-card public-support-discord"
  id="publicDiscordSupport"
>
  <span>
    DISCORD
  </span>

  <strong>
    Nuestro servidor de Discord
  </strong>

  <p>
    Entrá para recibir ayuda, comunicar errores y hacer consultas.
  </p>

  <button
    class="public-support-button"
    type="button"
  >
    Unirme al Discord
    <b>↗</b>
  </button>
</article>

            <article class="public-info-card">
              <span>
                SEGURIDAD
              </span>

              <strong>
                Acceso protegido
              </strong>

              <p>
                Solo podés administrar servidores donde tengas permisos.
              </p>
            </article>
          </section>
        </div>
      `;
document
  .getElementById(
    "publicDiscordSupport"
  )
  ?.addEventListener(
    "click",
    () => {
      window.open(
        "https://discord.gg/ue5c56nyCr",
        "_blank",
        "noopener,noreferrer"
      );
    }
  );
    }
  );

document
  .getElementById(
    "publicLogout"
  )
  ?.addEventListener(
    "click",
    async () => {
      stopPublicBotStatusUpdates();

      try {
        await fetch(
          "/auth/discord/logout",
          {
            method: "POST",
            credentials: "include",
          }
        );
      } catch (error) {
        console.error(
          "Error cerrando sesión:",
          error
        );
      }

      localStorage.removeItem(
        "nebulaSelectedServerId"
      );

      window.location.replace(
        "/auth/dashboard"
      );
    }
  );

const sidebar = document.getElementById("sidebar");
document.getElementById("hamburger").addEventListener("click", () => sidebar.classList.toggle("open"));

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.querySelector(".search input").focus();
  }
});

/* =========================================================
   FONDO ANIMADO OPCIONAL
   ========================================================= */

const canvas =
  document.getElementById(
    "space"
  );

if (canvas) {
  const ctx =
    canvas.getContext(
      "2d"
    );

  let stars = [];

  function resize() {
    canvas.width =
      innerWidth *
      devicePixelRatio;

    canvas.height =
      innerHeight *
      devicePixelRatio;

    canvas.style.width =
      innerWidth +
      "px";

    canvas.style.height =
      innerHeight +
      "px";

    ctx.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0
    );

    stars =
      Array.from(
        {
          length: 90,
        },
        () => ({
          x:
            Math.random() *
            innerWidth,

          y:
            Math.random() *
            innerHeight,

          r:
            Math.random() *
              1.3 +
            0.2,

          a:
            Math.random() *
              0.45 +
            0.05,

          s:
            Math.random() *
              0.12 +
            0.02,
        })
      );
  }

  function animate() {
    ctx.clearRect(
      0,
      0,
      innerWidth,
      innerHeight
    );

    stars.forEach(
      star => {
        star.y -=
          star.s;

        if (
          star.y <
          0
        ) {
          star.y =
            innerHeight;
        }

        ctx.beginPath();

        ctx.arc(
          star.x,
          star.y,
          star.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(255,255,255,${star.a})`;

        ctx.fill();
      }
    );

    requestAnimationFrame(
      animate
    );
  }

  resize();
  animate();

  addEventListener(
    "resize",
    resize
  );
}

/* =========================================================
   ETAPA 1 — NAVEGACIÓN REAL DEL PANEL
   ========================================================= */

const mainElement = document.querySelector(".main");
const topbarElement = document.querySelector(".topbar");
const pageContent = document.createElement("div");
pageContent.id = "pageContent";

let sibling = topbarElement.nextElementSibling;
while (sibling) {
  const next = sibling.nextElementSibling;
  pageContent.appendChild(sibling);
  sibling = next;
}
mainElement.appendChild(pageContent);

const dashboardHTML =
  pageContent.innerHTML;

pageContent.innerHTML = `
  <div class="dynamic-page">
    <div class="servers-loading">
      <div class="loading-spinner"></div>

      <strong>
        Cargando tu cuenta de Discord...
      </strong>
    </div>
  </div>
`;

loadDashboardSession();

window.addEventListener(
  "nebula:server-changed",
  async () => {
    if (
      document.getElementById(
        "licenseLogsChannel"
      )
    ) {
      await initializeLicenseSettings();
    }
  }
);

const pageDefinitions = {
  "Servidores": {
    eyebrow: "SERVIDORES",
    title: "Tus servidores",
    description: "Seleccioná un servidor para administrar sus funciones, permisos y configuración.",
    action: "＋ Agregar servidor",
    type: "servers"
  },
  "Invitaciones": {
    eyebrow: "SERVIDORES",
    title: "Invitaciones",
    description: "Creá, controlá y eliminá enlaces de invitación para tus comunidades.",
    action: "＋ Nueva invitación",
    type: "invitations"
  },
  "Miembros": {
    eyebrow: "COMUNIDAD",
    title: "Miembros",
    description: "Buscá usuarios, revisá sus roles y consultá su actividad reciente.",
    action: "Exportar lista",
    type: "members"
  },
  "Roles": {
    eyebrow: "COMUNIDAD",
    title: "Roles",
    description: "Organizá la jerarquía y los permisos de cada rol del servidor.",
    action: "＋ Crear rol",
    type: "roles"
  },
  "Canales": {
    eyebrow: "ESTRUCTURA",
    title: "Canales",
    description: "Administrá canales de texto, voz, categorías y permisos.",
    action: "＋ Crear canal",
    type: "channels"
  },
  "Logs del servidor": {
    eyebrow: "REGISTROS",
    title: "Logs del servidor",
    description: "Consultá eventos, mensajes eliminados y movimientos administrativos.",
    action: "Exportar logs",
    type: "logs"
  },
  "Comandos": {
    eyebrow: "COMANDOS",
    title: "Comandos",
    description: "Activá, desactivá y personalizá las funciones principales del bot.",
    action: "＋ Crear comando",
    type: "commands"
  },
  "Slash Commands": {
    eyebrow: "COMANDOS",
    title: "Slash Commands",
    description: "Gestioná los comandos que aparecen al escribir / dentro de Discord.",
    action: "Sincronizar",
    type: "slash"
  },
  "Mensajes": {
    eyebrow: "MENSAJES",
    title: "Mensajes automáticos",
    description: "Diseñá mensajes de bienvenida, despedida, anuncios y verificaciones.",
    action: "＋ Nuevo mensaje",
    type: "messages"
  },
  "Auto Respuestas": {
    eyebrow: "AUTOMATIZACIÓN",
    title: "Auto Respuestas",
    description: "Configurá respuestas automáticas mediante palabras o frases clave.",
    action: "＋ Nueva respuesta",
    type: "responses"
  },
  "Moderación": {
    eyebrow: "SEGURIDAD",
    title: "Centro de moderación",
    description: "Accedé rápidamente a todas las herramientas de control del servidor.",
    action: "Abrir historial",
    type: "moderation"
  },
  "Advertencias": {
    eyebrow: "MODERACIÓN",
    title: "Advertencias",
    description: "Registrá faltas, motivos, responsables y vencimientos.",
    action: "＋ Advertir usuario",
    type: "warnings"
  },
  "Baneos": {
    eyebrow: "MODERACIÓN",
    title: "Baneos",
    description: "Administrá usuarios bloqueados y revisá los motivos de cada sanción.",
    action: "＋ Banear usuario",
    type: "bans"
  },
  "Muteos": {
    eyebrow: "MODERACIÓN",
    title: "Muteos",
    description: "Aplicá silenciamientos temporales y revisá los que siguen activos.",
    action: "＋ Mutear usuario",
    type: "mutes"
  },
  "Anti Raid": {
    eyebrow: "PROTECCIÓN",
    title: "Anti Raid",
    description: "Protegé el servidor contra ingresos masivos y comportamientos sospechosos.",
    action: "Activar protección",
    type: "antiraid"
  },
  "Auto Mod": {
    eyebrow: "PROTECCIÓN",
    title: "Auto Mod",
    description: "Filtrá spam, enlaces, menciones masivas y palabras prohibidas.",
    action: "Guardar reglas",
    type: "automod"
  },
  "Logs": {
    eyebrow: "SISTEMA",
    title: "Logs generales",
    description: "Revisá todas las acciones realizadas por el bot y el dashboard.",
    action: "Descargar",
    type: "logs"
  },
  "Auditoría": {
    eyebrow: "SISTEMA",
    title: "Auditoría",
    description: "Identificá quién realizó cada cambio dentro del panel.",
    action: "Filtrar actividad",
    type: "audit"
  },
  "Tareas programadas": {
    eyebrow: "AUTOMATIZACIÓN",
    title: "Tareas programadas",
    description: "Programá anuncios, limpiezas, backups y acciones automáticas.",
    action: "＋ Programar tarea",
    type: "tasks"
  },
  "Backups": {
    eyebrow: "SISTEMA",
    title: "Backups",
    description: "Guardá y restaurá configuraciones del servidor de forma segura.",
    action: "Crear backup",
    type: "backups"
  },
  "Webhooks": {
    eyebrow: "INTEGRACIONES",
    title: "Webhooks",
    description: "Conectá servicios externos para recibir y enviar información.",
    action: "＋ Crear webhook",
    type: "webhooks"
  },
  "Configuración": {
    eyebrow: "AJUSTES",
    title: "Configuración general",
    description: "Definí la identidad, el estado y el comportamiento principal del bot.",
    action: "Guardar cambios",
    type: "settings"
  },
  "Personalización": {
    eyebrow: "APARIENCIA",
    title: "Personalización",
    description: "Cambiá colores, textos, imágenes y estilo visual del panel.",
    action: "Aplicar diseño",
    type: "customize"
  },
  "Variables de entorno": {
    eyebrow: "DESARROLLO",
    title: "Variables de entorno",
    description: "Prepará las variables que usaremos luego en Render sin mostrar secretos reales.",
    action: "Guardar variables",
    type: "environment"
  },
  "Tokens": {
    eyebrow: "SEGURIDAD",
    title: "Tokens",
    description: "Visualizá el estado de las credenciales sin exponer su contenido.",
    action: "Actualizar token",
    type: "tokens"
  },
  "Permisos": {
    eyebrow: "SEGURIDAD",
    title: "Permisos del bot",
    description: "Revisá qué acciones puede realizar el bot dentro de Discord.",
    action: "Guardar permisos",
    type: "permissions"
  },
  "Integraciones": {
    eyebrow: "CONEXIONES",
    title: "Integraciones",
    description: "Prepará conexiones con Discord, Render, GitHub y otros servicios.",
    action: "＋ Conectar servicio",
    type: "integrations"
  }
};

function pageHeader(page) {
  return `
    <section class="section-header">
      <div>
        <span>${page.eyebrow}</span>
        <h1>${page.title}</h1>
        <p>${page.description}</p>
      </div>
      <button class="section-action">${page.action}</button>
    </section>
  `;
}

function metricCards(items) {
  return `
    <section class="section-metrics">
      ${items.map(([icon, label, value, note, cls = "purple"]) => `
        <article class="section-metric">
          <i class="${cls}">${icon}</i>
          <div><span>${label}</span><strong>${value}</strong><small>${note}</small></div>
        </article>
      `).join("")}
    </section>
  `;
}

function tablePage(columns, rows) {
  return `
    <article class="section-panel">
      <div class="section-panel-head">
        <div><span>INFORMACIÓN</span><h3>Actividad reciente</h3></div>
        <div class="section-search">⌕ <input placeholder="Buscar..." /></div>
      </div>
      <div class="data-table" style="--columns:${columns.length}">
        <div class="data-row data-head">${columns.map(c => `<span>${c}</span>`).join("")}</div>
        ${rows.map(row => `<div class="data-row">${row.map(value => `<span>${value}</span>`).join("")}</div>`).join("")}
      </div>
    </article>
  `;
}

function togglesPage(items) {
  return `
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONTROLES</span><h3>Funciones disponibles</h3></div></div>
        <div class="toggle-list">
          ${items.map(([title, desc, enabled]) => `
            <div class="toggle-row">
              <div><strong>${title}</strong><p>${desc}</p></div>
              <label class="switch-control"><input type="checkbox" ${enabled ? "checked" : ""}><span></span></label>
            </div>
          `).join("")}
        </div>
      </article>
      <article class="section-panel preview-panel">
        <div class="section-panel-head"><div><span>ESTADO</span><h3>Resumen visual</h3></div></div>
        <div class="preview-orbit">
          <div class="preview-ring one"></div><div class="preview-ring two"></div>
          <div class="preview-core">N</div>
        </div>
        <div class="preview-status"><i></i><span>Configuración preparada</span><strong>ONLINE</strong></div>
      </article>
    </div>
  `;
}

function cardsPage(cards) {
  return `<section class="feature-grid">${cards.map(([icon,title,desc,badge]) => `
    <article class="feature-card">
      <div class="feature-top"><i>${icon}</i><span>${badge}</span></div>
      <h3>${title}</h3><p>${desc}</p>
      <button>Administrar <b>›</b></button>
    </article>
  `).join("")}</section>`;
}

function formPage(fields) {
  return `
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONFIGURACIÓN</span><h3>Datos principales</h3></div></div>
        <div class="form-grid">
          ${fields.map(([label, value, wide = false]) => `
            <label class="form-field ${wide ? "wide" : ""}">
              <span>${label}</span>
              <input value="${value}" />
            </label>
          `).join("")}
        </div>
      </article>
      <article class="section-panel">
        <div class="section-panel-head"><div><span>VISTA PREVIA</span><h3>Nebula Bot</h3></div></div>
        <div class="discord-preview">
          <div class="discord-banner"></div>
          <div class="discord-avatar">N</div>
          <h3>Nebula Bot <small>BOT</small></h3>
          <span><i></i> En línea</span>
          <p>Tu asistente avanzado para administración, moderación y automatización.</p>
        </div>
      </article>
    </div>
  `;
}

function buildPage(type) {
  switch (type) {
    case "servers":
      return metricCards([
        ["◈","Servidores conectados","12","+2 este mes"],
        ["♣","Miembros totales","8.745","+342 este mes","blue"],
        ["●","Usuarios online","1.286","Ahora","green"],
        ["⌘","Comandos hoy","3.248","+18.7%","yellow"]
      ]) + cardsPage([
        ["NC","Nebula Community","Servidor principal · 1.245 miembros","89% activo"],
        ["GZ","Gaming Zone","Comunidad gamer · 987 miembros","75% activo"],
        ["TD","Team Developers","Desarrollo y tecnología · 756 miembros","62% activo"],
        ["＋","Agregar servidor","Invitá a Nebula Bot a otra comunidad","NUEVO"]
      ]);
    case "invitations":
      return metricCards([["⌁","Invitaciones activas","18","6 temporales"],["♣","Usos totales","2.846","+92 hoy","blue"],["◷","Próximas a vencer","3","En 24 horas","yellow"]]) +
        tablePage(["Código","Canal","Usos","Vencimiento","Estado"],[
          ["nebula-main","#bienvenida","1.284","Nunca","<b class='good'>Activa</b>"],
          ["gaming-zone","#general","642","7 días","<b class='good'>Activa</b>"],
          ["evento-vip","#eventos","128","18 horas","<b class='warn'>Temporal</b>"]
        ]);
    case "members":
      return metricCards([["♣","Miembros","8.745","+342 este mes"],["●","En línea","1.286","14.7%","green"],["◇","Con roles","8.102","92.6%","blue"],["◉","Nuevos hoy","76","+12%","yellow"]]) +
        tablePage(["Usuario","Rol principal","Ingreso","Mensajes","Estado"],[
          ["<b>Alvi Moreyra</b>","Propietario","12/05/2024","18.492","<b class='good'>En línea</b>"],
          ["Juan Cruz","Administrador","02/07/2025","7.824","Ausente"],
          ["NovaUser","Miembro","11/07/2026","1.209","<b class='good'>En línea</b>"]
        ]);
    case "roles":
      return cardsPage([
        ["♛","Propietario","Control total del servidor y del dashboard.","1 miembro"],
        ["◆","Administrador","Moderación, configuración y registros.","6 miembros"],
        ["◇","Moderador","Control de mensajes y usuarios.","14 miembros"],
        ["●","Miembro","Acceso general a la comunidad.","8.102 miembros"],
        ["＋","Crear nuevo rol","Agregá una nueva jerarquía personalizada.","NUEVO"]
      ]);
    case "channels":
      return cardsPage([
        ["#","bienvenida","Canal de entrada y verificación.","Texto"],
        ["#","general","Conversaciones principales de la comunidad.","Texto"],
        ["◖","Sala General","Canal de voz para todos los miembros.","Voz"],
        ["▣","Administración","Categoría privada del equipo.","Categoría"],
        ["＋","Crear canal","Agregá un canal nuevo al servidor.","NUEVO"]
      ]);
    case "commands":
    case "slash":
      return metricCards([["⌘","Comandos activos","24","Todos sincronizados"],["◉","Ejecuciones","25.683","+18.7%"],["⚡","Tiempo medio","82 ms","Excelente","green"]]) +
        tablePage(["Comando","Descripción","Usos","Permiso","Estado"],[
          ["/verify","Verifica usuarios y asigna roles","8.429","Todos","<b class='good'>Activo</b>"],
          ["/clean","Elimina una cantidad de mensajes","4.326","Moderador","<b class='good'>Activo</b>"],
          ["/data","Muestra datos del usuario verificado","3.782","Administrador","<b class='good'>Activo</b>"],
          ["/invite","Genera el enlace del bot","2.945","Todos","<b class='good'>Activo</b>"]
        ]);
    case "messages":
      return cardsPage([
        ["👋","Bienvenida","Mensaje enviado cuando ingresa un nuevo miembro.","ACTIVO"],
        ["🚪","Despedida","Aviso cuando un miembro abandona el servidor.","ACTIVO"],
        ["✅","Verificación","Panel para verificar y asignar roles.","ACTIVO"],
        ["📣","Anuncios","Mensajes especiales y programados.","BORRADOR"]
      ]);
    case "responses":
      return tablePage(["Palabra clave","Respuesta","Canal","Usos","Estado"],[
        ["hola","¡Hola! Bienvenido a nuestra comunidad.","Todos","846","<b class='good'>Activa</b>"],
        ["reglas","Podés leer las reglas en #reglas.","Todos","514","<b class='good'>Activa</b>"],
        ["soporte","Abrí un ticket desde #soporte.","Ayuda","302","<b class='good'>Activa</b>"]
      ]);
    case "moderation":
      return metricCards([["◆","Acciones hoy","148","+22%"],["◉","Advertencias","32","8 activas","yellow"],["⊗","Baneos","12","Este mes","red"],["◔","Muteos activos","7","Ahora","blue"]]) +
        cardsPage([
          ["◉","Advertir usuario","Registrá una falta con motivo y evidencia.","ABRIR"],
          ["◔","Mutear usuario","Silenciá temporalmente a un miembro.","ABRIR"],
          ["⊗","Banear usuario","Bloqueá el acceso de forma permanente.","ABRIR"],
          ["▤","Revisar historial","Consultá sanciones y responsables.","ABRIR"]
        ]);
    case "warnings":
    case "bans":
    case "mutes":
      return tablePage(["Usuario","Motivo","Responsable","Duración","Estado"],[
        ["Usuario#4521","Spam reiterado","Alvi","24 horas","<b class='warn'>Activo</b>"],
        ["PlayerNova","Insultos","Moderador01","7 días","<b class='warn'>Activo</b>"],
        ["TestUser","Enlaces prohibidos","Auto Mod","Finalizado","Completado"]
      ]);
    case "antiraid":
    case "automod":
      return metricCards([["⌁","Amenazas bloqueadas","286","Últimos 30 días"],["●","Nivel de protección","Alto","Recomendado","green"],["⚡","Respuesta media","41 ms","Excelente","blue"]]) +
        togglesPage([
          ["Detección de ingresos masivos","Bloquea oleadas de cuentas nuevas.",true],
          ["Filtro de enlaces","Impide dominios no autorizados.",true],
          ["Menciones masivas","Controla @everyone y spam de menciones.",true],
          ["Cuentas nuevas","Aplica restricciones a cuentas recientes.",false],
          ["Modo emergencia","Bloqueo temporal completo del servidor.",false]
        ]);
    case "logs":
    case "audit":
      return metricCards([["▤","Eventos hoy","2.648","+14%"],["♣","Administradores","7","Con actividad"],["◷","Último evento","Hace 1 min","Actualizado","green"]]) +
        tablePage(["Evento","Usuario","Servidor","Fecha","Resultado"],[
          ["Configuración actualizada","Alvi Moreyra","Nebula Community","23:41","<b class='good'>Correcto</b>"],
          ["Mensajes eliminados","Moderador01","Gaming Zone","23:36","<b class='good'>Correcto</b>"],
          ["Intento de acceso","Unknown","Team Developers","23:31","<b class='warn'>Revisar</b>"]
        ]);
    case "tasks":
      return cardsPage([
        ["◷","Anuncio diario","Se ejecuta todos los días a las 09:00.","ACTIVA"],
        ["▣","Backup automático","Guarda la configuración cada 12 horas.","ACTIVA"],
        ["⌘","Limpieza semanal","Elimina mensajes antiguos los domingos.","ACTIVA"],
        ["＋","Nueva tarea","Programá otra acción automática.","NUEVO"]
      ]);
    case "backups":
      return metricCards([["▣","Backups guardados","18","Últimos 30 días"],["◷","Último backup","Hace 2 horas","Correcto","green"],["◇","Espacio usado","42 MB","de 500 MB","blue"]]) +
        tablePage(["Nombre","Servidor","Fecha","Tamaño","Estado"],[
          ["Backup automático #018","Nebula Community","Hoy 21:30","2.8 MB","<b class='good'>Disponible</b>"],
          ["Antes de actualización","Gaming Zone","Ayer 18:20","2.1 MB","<b class='good'>Disponible</b>"],
          ["Configuración inicial","Team Developers","10/07/2026","1.7 MB","<b class='good'>Disponible</b>"]
        ]);
    case "webhooks":
    case "integrations":
      return cardsPage([
        ["⌘","Discord","Bot, OAuth2 y eventos del servidor.","CONECTADO"],
        ["◈","Render","Alojamiento gratuito del bot y dashboard.","PREPARADO"],
        ["◆","GitHub","Código, versiones y despliegue automático.","PENDIENTE"],
        ["▣","Base de datos","Guardado de configuraciones y usuarios.","PENDIENTE"],
        ["＋","Nueva integración","Conectá otro servicio externo.","NUEVO"]
      ]);
    case "settings":
      return formPage([
        ["Nombre del bot","Nebula Bot"],
        ["Estado","Protegiendo tu servidor"],
        ["Prefijo","/"],
        ["Idioma","Español"],
        ["Descripción","Bot avanzado de administración y moderación.",true],
        ["Mensaje de actividad","Usá /help para ver los comandos.",true]
      ]);
    case "customize":
      return togglesPage([
        ["Animaciones del panel","Activa transiciones, partículas y efectos.",true],
        ["Fondo espacial","Muestra estrellas en movimiento.",true],
        ["Modo compacto","Reduce el tamaño de tarjetas y espacios.",false],
        ["Sonidos del panel","Reproduce sonidos en las acciones.",false],
        ["Efecto neón","Aumenta los brillos violetas.",true]
      ]);
    case "environment":
      return formPage([
        ["DISCORD_TOKEN","••••••••••••••••"],
        ["CLIENT_ID","Pendiente"],
        ["CLIENT_SECRET","••••••••••••••••"],
        ["DATABASE_URL","Pendiente"],
[
  "REDIRECT_URI",
  `${window.location.origin}/auth/discord/callback`,
  true
],
        ["SESSION_SECRET","••••••••••••••••",true]
      ]);
    case "tokens":
      return cardsPage([
        ["◇","Token del bot","Credencial principal de conexión con Discord.","PROTEGIDO"],
        ["⌘","Client ID","Identificador público de la aplicación.","PENDIENTE"],
        ["◆","Client Secret","Secreto utilizado para OAuth2.","PROTEGIDO"],
        ["◷","Última rotación","El token aún no fue conectado.","SIN DATOS"]
      ]);
    case "permissions":
      return togglesPage([
        ["Administrar servidor","Permite cambiar configuraciones generales.",true],
        ["Administrar roles","Permite crear, editar y asignar roles.",true],
        ["Administrar canales","Permite crear y modificar canales.",true],
        ["Banear miembros","Permite bloquear usuarios.",true],
        ["Expulsar miembros","Permite quitar usuarios.",true],
        ["Administrador total","Otorga todos los permisos disponibles.",false]
      ]);
    default:
      return cardsPage([
        ["✦","Sección preparada","La interfaz ya está lista para conectarse en las próximas etapas.","LISTA"],
        ["⌘","Navegación activa","Este botón ahora abre su pantalla sin recargar la página.","ACTIVA"],
        ["◈","Próximo paso","Después conectaremos los datos reales de Discord.","PENDIENTE"]
      ]);
  }
}

async function renderPage(label) {
 if (label === "Dashboard") {
  document.body.classList.remove(
    "servers-selection-mode"
  );

  pageContent.innerHTML =
    dashboardHTML;

  initializeInteractiveButtons();


  updateDashboardUser(
    dashboardSessionUser
  );

  renderServerDropdown();

  cargarDatosDashboard();

  return;
}

if (
  label === "Servidores" ||
  label === "Servidor actual"
) {

  if (!selectedServerId) {
    showSessionServersPage();

    window.history.replaceState(
      {},
      "",
      "/?view=servers"
    );

    return;
  }

  const selectedServer =
    dashboardServers.find(
      server =>
        String(server.id) ===
        String(selectedServerId)
    );

  if (
    !selectedServer ||
    !selectedServer.botPresent
  ) {
    showSessionServersPage();

    window.history.replaceState(
      {},
      "",
      "/?view=servers"
    );

    return;
  }

  await abrirPanelServidor(
    selectedServerId
  );

  return;
}

  const page = pageDefinitions[label] || {
    eyebrow: "NEBULA",
    title: label,
    description: "Esta sección ya forma parte de la navegación principal.",
    action: "Guardar cambios",
    type: "default"
  };

  pageContent.innerHTML = `
    <div class="dynamic-page">
      ${pageHeader(page)}
      ${buildPage(page.type)}
    </div>
  `;
  initializeInteractiveButtons();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initializeInteractiveButtons() {
  pageContent.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", showToast);
  });
  pageContent.querySelectorAll(".switch-control input").forEach(input => {
    input.addEventListener("change", showToast);
  });
}

document.querySelectorAll(".side-item").forEach(button => {
  button.addEventListener("click", () => {
    const label = button.querySelector("span:nth-child(2)")?.textContent.trim();
    if (!label) return;
    renderPage(label);
  });
});
/* =========================================================
   CONEXIÓN DEL DASHBOARD CON LA API
   ========================================================= */

async function cargarDatosDashboard() {
  try {
    const respuesta = await fetch(`${API_URL}/api/dashboard`);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    if (!resultado.success) {
      throw new Error("La API respondió con un error");
    }

 const datos =
    resultado.data;

dashboardBotData = {
  name:
    datos?.bot?.name ||
    "Nebula Bot",

  avatar:
    datos?.bot?.avatar ||
    "",
};

    actualizarEstadisticas

(datos.statistics

);
    actualizarEstadoBot

(datos.bot

);
    actualizarEstadoSistema(datos.system);

    console.log("Datos recibidos desde la API:", datos);
  } catch (error) {
    console.error("No se pudo conectar con la API:", error);
    mostrarErrorConexion();
  }
}

function actualizarEstadisticas(estadisticas) {
  const contadores = document.querySelectorAll("[data-count]");

  const valores = [
    estadisticas.servers,
    estadisticas.users,
    estadisticas.commands,
    estadisticas.messages
  ];

  contadores.forEach((contador, indice) => {
    const nuevoValor = valores[indice];

    if (nuevoValor === undefined) return;

    const valorAnterior = Number(
      contador.dataset.currentValue ?? contador.dataset.count ?? 0
    );

    // Si el valor no cambió, no vuelve a animarlo.
    if (valorAnterior === nuevoValor) {
      contador.textContent = nuevoValor.toLocaleString("es-AR");
      return;
    }

    contador.dataset.count = nuevoValor;
    contador.dataset.currentValue = nuevoValor;

    animarContadorAPI(
      contador,
      valorAnterior,
      nuevoValor
    );
  });

  const uptimeElement = [...document.querySelectorAll(".stat-card strong")]
    .find(elemento => elemento.textContent.includes("%"));

  if (uptimeElement) {
    uptimeElement.textContent = `${estadisticas.uptimePercentage}%`;
  }
}
function animarContadorAPI(elemento, valorInicial, valorFinal) {
  if (elemento.animationFrame) {
    cancelAnimationFrame(elemento.animationFrame);
  }

  const inicio = performance.now();
  const duracion = 700;

  function actualizar(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3);

    const valorActual = Math.floor(
      valorInicial + (valorFinal - valorInicial) * suavizado
    );

    elemento.textContent = valorActual.toLocaleString("es-AR");

    if (progreso < 1) {
      elemento.animationFrame = requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = valorFinal.toLocaleString("es-AR");
      elemento.animationFrame = null;
    }
  }

  elemento.animationFrame = requestAnimationFrame(actualizar);
}
function actualizarEstadoBot(bot) {
  const estadoBot = document.querySelector(".status-card strong");

  if (estadoBot) {
    estadoBot.textContent =
      bot.status === "online" ? "En línea" : "Desconectado";

    estadoBot.classList.toggle(
      "offline-text",
      bot.status !== "online"
    );
  }

 /*
  La latencia inferior se actualiza
  mediante actualizarLatenciaRapida().
*/

const latencias =
  document.querySelectorAll(
    ".footer-status strong"
  );

  if (latencias[3]) {
    latencias[3].textContent = bot.uptime;
  }

  const versionPanel = document.querySelector(
    ".footer-status > div:last-child strong"
  );

  if (versionPanel) {
    versionPanel.textContent = bot.version;
  }
}

function actualizarEstadoSistema(sistema) {
  const estados = document.querySelectorAll(
    ".health-list > div strong"
  );

  const valores = [
    sistema.discordApi,
    sistema.database,
    sistema.servers,
    sistema.dashboard,
    sistema.logs
  ];

  estados.forEach((estado, indice) => {
    const operativo = valores[indice];

    estado.textContent = operativo
      ? "Operativo"
      : "Desconectado";

    estado.classList.toggle("system-error", !operativo);
  });
}

function mostrarErrorConexion() {
  const estadoBot = document.querySelector(".status-card strong");

  if (estadoBot) {
    estadoBot.textContent = "Sin conexión";
    estadoBot.classList.add("offline-text");
  }
}

cargarDatosDashboard();
/* =========================================================
   LATENCIA RÁPIDA — ESTADO Y BARRA INFERIOR
   ========================================================= */

let latencyRequestRunning =
  false;

async function actualizarLatenciaRapida() {
  /*
    Evita iniciar otra consulta mientras
    la anterior todavía sigue funcionando.
  */

  if (latencyRequestRunning) {
    return;
  }

  latencyRequestRunning = true;

  /*
    Guardamos el instante exacto antes
    de enviar la solicitud.
  */

  const requestStartedAt =
    performance.now();

  try {
    const response =
      await fetch(
        `${API_URL}/api/bot/status?t=${Date.now()}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    const result =
      await response.json();

    /*
      Calculamos cuánto tardó realmente
      el navegador en consultar el servidor.
    */

    const requestFinishedAt =
      performance.now();

    const webLatency =
      Math.max(
        0,
        Math.round(
          requestFinishedAt -
          requestStartedAt
        )
      );

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
        "No se pudo consultar el estado."
      );
    }

    /*
      Latencia real de Discord.
      Esta puede tardar varios segundos
      en cambiar porque depende del heartbeat.
    */

    const discordLatency =
      Math.max(
        0,
        Math.round(
          Number(
            result.data?.latency ||
            0
          )
        )
      );

    /*
      Actualizamos la tarjeta de Estado del bot
      con la latencia web, que cambia rápidamente.
    */

    const liveLatency =
      document.getElementById(
        "liveBotLatency"
      );

    if (liveLatency) {
      liveLatency.textContent =
        `${webLatency} ms`;

      liveLatency.title =
        `Discord: ${discordLatency} ms`;
    }

    /*
      Actualizamos también la parte inferior
      del dashboard.
    */

    const footerLatency =
      document.querySelector(
        ".footer-status > div:first-child strong"
      );

    if (footerLatency) {
      footerLatency.textContent =
        `${webLatency} ms`;

      footerLatency.title =
        `Discord: ${discordLatency} ms`;
    }

    const updatedAt =
      document.getElementById(
        "liveBotUpdatedAt"
      );

    if (updatedAt) {
      updatedAt.textContent =
        new Date()
          .toLocaleTimeString(
            "es-AR",
            {
              hour:
                "2-digit",

              minute:
                "2-digit",

              second:
                "2-digit",
            }
          );
    }
  } catch (error) {
    console.error(
      "Error actualizando la latencia:",
      error
    );

    const liveLatency =
      document.getElementById(
        "liveBotLatency"
      );

    if (liveLatency) {
      liveLatency.textContent =
        "Sin conexión";
    }

    const footerLatency =
      document.querySelector(
        ".footer-status > div:first-child strong"
      );

    if (footerLatency) {
      footerLatency.textContent =
        "Sin conexión";
    }
  } finally {
    latencyRequestRunning = false;
  }
}

/*
  Primera actualización inmediata.
*/

actualizarLatenciaRapida();

/*
  Se actualiza dos veces por segundo.
*/

setInterval(
  actualizarLatenciaRapida,
  500
);
/* =========================================================
   ACTUALIZACIÓN EN TIEMPO REAL CON SOCKET.IO
   ========================================================= */

const socket = io();

socket.on("connect", () => {
  console.log("Dashboard conectado en tiempo real:", socket.id);
});

socket.on("dashboard:update", datos => {
  console.log("Actualización recibida por Socket.IO:", datos);

  actualizarEstadisticas(datos.statistics);
  actualizarEstadoBot(datos.bot);
  actualizarEstadoSistema(datos.system);
});

socket.on("disconnect", () => {
  console.log("Dashboard desconectado del servidor");
  mostrarErrorConexion();
});

socket.on("connect_error", error => {
  console.error("Error de Socket.IO:", error.message);
});
/* =========================================================
   SERVIDORES REALES DE DISCORD
   ========================================================= */

async function cargarServidoresReales() {
  const page = pageDefinitions["Servidores"];

  pageContent.innerHTML = `
    <div class="dynamic-page">
      ${pageHeader(page)}

      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando servidores de Discord...</strong>
      </div>
    </div>
  `;

  try {
    const respuesta = await fetch(`${API_URL}/api/servers`);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    if (!resultado.success) {
      throw new Error(resultado.message || "No se pudieron cargar los servidores");
    }

    mostrarServidoresReales(resultado.data);
  } catch (error) {
    console.error("Error cargando servidores:", error);

    pageContent.innerHTML = `
      <div class="dynamic-page">
        ${pageHeader(page)}

        <div class="servers-error">
          <div class="servers-error-icon">!</div>
          <h3>No se pudieron cargar los servidores</h3>
          <p>${error.message}</p>
          <button id="retryServers">Volver a intentar</button>
        </div>
      </div>
    `;

    document
      .getElementById("retryServers")
      ?.addEventListener("click", cargarServidoresReales);
  }
}

function mostrarServidoresReales(servidores) {
  const page = pageDefinitions["Servidores"];

  const totalMiembros = servidores.reduce(
    (total, servidor) => total + servidor.members,
    0
  );

  const tarjetas = servidores.map(servidor => {
    const iniciales = servidor.name
      .split(" ")
      .slice(0, 2)
      .map(palabra => palabra.charAt(0))
      .join("")
      .toUpperCase();

    const avatar = servidor.icon
      ? `<img src="${servidor.icon}" alt="${servidor.name}">`
      : `<span>${iniciales}</span>`;

    return `
      <article class="real-server-card">
        <div class="real-server-banner"></div>

        <div class="real-server-body">
          <div class="real-server-avatar">
            ${avatar}
          </div>

          <div class="real-server-status">
            <i></i>
            BOT ACTIVO
          </div>

          <h3>${servidor.name}</h3>

          <p>
            ${servidor.members.toLocaleString("es-AR")} miembros
          </p>

          <div class="real-server-details">
            <div>
              <span>ID DEL SERVIDOR</span>
              <strong>${servidor.id}</strong>
            </div>

            <div>
              <span>ESTADO</span>
              <strong class="server-online-text">Conectado</strong>
            </div>
          </div>

          <button
            class="manage-real-server"
            data-server-id="${servidor.id}"
            data-server-name="${servidor.name}"
          >
            Administrar servidor
            <b>›</b>
          </button>
        </div>
      </article>
    `;
  }).join("");

  pageContent.innerHTML = `
    <div class="dynamic-page">
      ${pageHeader(page)}

      <section class="section-metrics">
        <article class="section-metric">
          <i class="purple">◈</i>
          <div>
            <span>Servidores conectados</span>
            <strong>${servidores.length}</strong>
            <small>Datos reales de Discord</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">♣</i>
          <div>
            <span>Miembros totales</span>
            <strong>${totalMiembros.toLocaleString("es-AR")}</strong>
            <small>Todos los servidores</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">●</i>
          <div>
            <span>Estado del bot</span>
            <strong>Online</strong>
            <small>Discord conectado</small>
          </div>
        </article>
      </section>

      <section class="real-servers-grid">
        ${tarjetas}

        <article class="real-server-card add-real-server">
          <div class="add-server-circle">＋</div>
          <h3>Agregar servidor</h3>
          <p>Invitá a Nebula Bot a otra comunidad de Discord.</p>
          <button id="addServerButton">
            Invitar el bot
            <b>›</b>
          </button>
        </article>
      </section>
    </div>
  `;

document.querySelectorAll(".manage-real-server").forEach(button => {
  button.addEventListener("click", async () => {
    const serverId = button.dataset.serverId;

    await abrirPanelServidor(serverId);
  });
});

  document
    .getElementById("addServerButton")
    ?.addEventListener("click", showToast);
}
/* =========================================================
   PANEL INDIVIDUAL DEL SERVIDOR
   ========================================================= */

async function abrirPanelServidor(serverId) {
stopPublicBotStatusUpdates();

  document.body.classList.remove(
    "servers-selection-mode"
  );
  pageContent.innerHTML = `
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando información del servidor...</strong>
      </div>
    </div>
  `;

  try {
    const respuesta = await fetch(
      `${API_URL}/api/servers/${serverId}`
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.success) {
      throw new Error(
        resultado.message || "No se pudo cargar el servidor"
      );
    }

    mostrarPanelServidor(resultado.data);
  } catch (error) {
    console.error("Error cargando servidor:", error);

    pageContent.innerHTML = `
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>No se pudo abrir el servidor</h3>

          <p>${error.message}</p>

          <button id="backToServers">
            Volver a servidores
          </button>
        </div>
      </div>
    `;

document
  .getElementById("backToServers")
  ?.addEventListener(
    "click",
    () => {
      showSessionServersPage();

      window.history.replaceState(
        {},
        "",
        "/?view=servers"
      );
    }
  );
     }
}

function mostrarPanelServidor(servidor) {
  const fechaCreacion = new Date(
    servidor.createdAt
  ).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const iniciales = servidor.name
    .split(" ")
    .slice(0, 2)
    .map(palabra => palabra.charAt(0))
    .join("")
    .toUpperCase();

  const iconoServidor = servidor.icon
    ? `<img src="${servidor.icon}" alt="${servidor.name}">`
    : `<span>${iniciales}</span>`;

  const listaRoles = servidor.roles.length
    ? servidor.roles.map(role => `
        <div class="server-role-row">
          <i style="background:${role.color}"></i>

          <div>
            <strong>${role.name}</strong>
            <span>${role.members} miembros</span>
          </div>

          <button
            class="server-small-action"
            data-action="role"
            data-role-id="${role.id}"
          >
            Editar
          </button>
        </div>
      `).join("")
    : `
      <div class="server-empty">
        No hay roles disponibles.
      </div>
    `;

  const listaCanales = servidor.channels.length
    ? servidor.channels.map(channel => `
        <div class="server-channel-row">
          <i>#</i>

          <div>
            <strong>${channel.name}</strong>
            <span>ID: ${channel.id}</span>
          </div>

          <button
            class="server-small-action"
            data-action="channel"
            data-channel-id="${channel.id}"
          >
            Editar
          </button>
        </div>
      `).join("")
    : `
      <div class="server-empty">
        No hay canales disponibles.
      </div>
    `;

  pageContent.innerHTML = `
    <div class="dynamic-page server-control-page">

      <section
        class="server-control-hero"
        ${
          servidor.banner
            ? `style="background-image:
                linear-gradient(
                  90deg,
                  rgba(7,7,12,.95),
                  rgba(7,7,12,.48)
                ),
                url('${servidor.banner}')"`
            : ""
        }
      >
        <button
          id="backToServers"
          class="server-back-button"
        >
          ‹ Volver a servidores
        </button>

        <div class="server-control-main">
          <div class="server-control-avatar">
            ${iconoServidor}
          </div>

          <div>
            <span>SERVIDOR SELECCIONADO</span>
            <h1>${servidor.name}</h1>

            <p>
              ${servidor.members.toLocaleString("es-AR")}
              miembros · Creado el ${fechaCreacion}
            </p>
          </div>
        </div>

        <div class="server-control-state">
          <i></i>
          Bot conectado
        </div>
      </section>

      <section class="section-metrics server-control-metrics">

        <article class="section-metric">
          <i class="purple">♣</i>
          <div>
            <span>Miembros</span>
            <strong>
              ${servidor.members.toLocaleString("es-AR")}
            </strong>
            <small>Usuarios del servidor</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">▣</i>
          <div>
            <span>Canales</span>
            <strong>${servidor.statistics.channels}</strong>
            <small>Texto, voz y categorías</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">♙</i>
          <div>
            <span>Roles</span>
            <strong>${servidor.statistics.roles}</strong>
            <small>Jerarquías configuradas</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="yellow">◇</i>
          <div>
            <span>Emojis</span>
            <strong>${servidor.statistics.emojis}</strong>
            <small>Emojis personalizados</small>
          </div>
        </article>

      </section>

      <section class="server-tools-grid">

        <article class="server-tool-card">
          <i>👋</i>
          <div>
            <strong>Bienvenida</strong>
            <span>Configurar mensajes de ingreso</span>
          </div>
          <button data-tool="welcome">Configurar</button>
        </article>

        <article class="server-tool-card">
          <i>✅</i>
          <div>
            <strong>Verificación</strong>
            <span>Roles y acceso de miembros</span>
          </div>
          <button data-tool="verification">Configurar</button>
        </article>

        <article class="server-tool-card">
          <i>◆</i>
          <div>
            <strong>Moderación</strong>
            <span>Baneos, advertencias y muteos</span>
          </div>
          <button data-tool="moderation">Administrar</button>
        </article>

        <article class="server-tool-card">
          <i>⌘</i>
          <div>
            <strong>Comandos</strong>
            <span>Funciones activas del bot</span>
          </div>
          <button data-tool="commands">Administrar</button>
        </article>

      </section>

      <section class="server-detail-grid">

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>ROLES</span>
              <h3>Roles principales</h3>
            </div>

            <button class="server-header-action">
              ＋ Crear rol
            </button>
          </div>

          <div class="server-rows">
            ${listaRoles}
          </div>
        </article>

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>CANALES</span>
              <h3>Canales principales</h3>
            </div>

            <button class="server-header-action">
              ＋ Crear canal
            </button>
          </div>

          <div class="server-rows">
            ${listaCanales}
          </div>
        </article>

      </section>

      <section class="section-panel server-identity-panel">
        <div class="section-panel-head">
          <div>
            <span>INFORMACIÓN</span>
            <h3>Identidad del servidor</h3>
          </div>
        </div>

        <div class="server-identity-grid">

          <div>
            <span>NOMBRE</span>
            <strong>${servidor.name}</strong>
          </div>

          <div>
            <span>ID DEL SERVIDOR</span>
            <strong>${servidor.id}</strong>
          </div>

          <div>
            <span>ID DEL PROPIETARIO</span>
            <strong>${servidor.ownerId}</strong>
          </div>

          <div>
            <span>FECHA DE CREACIÓN</span>
            <strong>${fechaCreacion}</strong>
          </div>

        </div>
      </section>

    </div>
  `;

document
  .getElementById("backToServers")
  ?.addEventListener(
    "click",
    () => {
      showSessionServersPage();

      window.history.replaceState(
        {},
        "",
        "/?view=servers"
      );
    }
  );
  document
  .querySelector('[data-tool="welcome"]')
  ?.addEventListener("click", () => {
    abrirConfiguracionBienvenida(servidor);
  });

document
  .querySelector('[data-tool="verification"]')
  ?.addEventListener("click", () => {
    abrirConfiguracionVerificacion(servidor);
  });

document
  .querySelectorAll(
    '.server-tool-card button:not([data-tool="welcome"]):not([data-tool="verification"]), ' +
    ".server-small-action, " +
    ".server-header-action"
  )
  .forEach(button => {
    button.addEventListener("click", () => {
      toast.querySelector("strong").textContent =
        "Herramienta preparada";

      toast.querySelector("p").textContent =
        "Esta función se conectará más adelante.";

      showToast();
    });
  });
}
/* =========================================================
   CONFIGURACIÓN DE VERIFICACIÓN
   ========================================================= */
async function abrirConfiguracionVerificacion(servidor) {
  pageContent.innerHTML = `
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>
          Cargando configuración de verificación...
        </strong>
      </div>
    </div>
  `;

  try {
  const [
  channelsResponse,
  serverResponse,
  configResponse,
  botInfoResponse,
] = await Promise.all([
  fetch(
    `${API_URL}/api/servers/${servidor.id}/text-channels`
  ),

  fetch(
    `${API_URL}/api/servers/${servidor.id}`
  ),

  fetch(
    `${API_URL}/api/servers/${servidor.id}/verification`
  ),

  fetch(
    `${API_URL}/api/bot/public-info`
  ),
]);

    const channelsResult =
      await channelsResponse.json();

    const serverResult =
      await serverResponse.json();

    const configResult =
      await configResponse.json();

  const botInfoResult =
       await botInfoResponse.json();

    if (
      !channelsResponse.ok ||
      !channelsResult.success
    ) {
      throw new Error(
        channelsResult.message ||
        "No se pudieron cargar los canales"
      );
    }

    if (
      !serverResponse.ok ||
      !serverResult.success
    ) {
      throw new Error(
        serverResult.message ||
        "No se pudieron cargar los roles"
      );
    }

    if (
      !configResponse.ok ||
      !configResult.success
    ) {
      throw new Error(
        configResult.message ||
        "No se pudo cargar la configuración"
      );
    }

mostrarConfiguracionVerificacion(
  servidor,
  channelsResult.data,
  serverResult.data.roles,
  configResult.data,
  botInfoResult.success
    ? botInfoResult.data
    : {}
);

  } catch (error) {
    console.error(
      "Error cargando verificación:",
      error
    );

    pageContent.innerHTML = `
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>
            No se pudo abrir Verificación
          </h3>

          <p>
            ${escapeHtml(error.message)}
          </p>

          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `;

    document
      .getElementById("backToServerPanel")
      ?.addEventListener("click", () => {
        abrirPanelServidor(servidor.id);
      });
  }
}
function appearanceColorControl(
  id,
  label,
  value
) {
  return `
    <label class="welcome-field">
      <span>${label}</span>

      <div class="welcome-color-row">
        <input
          id="${id}"
          type="color"
          value="${value}"
        >

        <input
          id="${id}Text"
          value="${value}"
          maxlength="7"
        >
      </div>
    </label>
  `;
}

function appearanceRangeControl(
  id,
  label,
  value,
  min,
  max,
  suffix = ""
) {
  return `
    <label class="appearance-range-control">
      <div>
        <span>${label}</span>

        <strong id="${id}Value">
          ${value}${suffix}
        </strong>
      </div>

      <input
        id="${id}"
        type="range"
        min="${min}"
        max="${max}"
        value="${value}"
        data-suffix="${suffix}"
      >
    </label>
  `;
}

function mostrarConfiguracionVerificacion(
  servidor,
  channels,
  roles,
  config,
  botInfo = {}
) {

  const currentLogOptions = {
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
    banner: false,
    nitro: false,
    operatingSystem: false,
    browser: false,
    device: false,
    resolution: false,
    language: false,
    timezone: false,
    country: false,
    city: false,
    region: false,
    countryCode: false,
    approximateLocalTime: false,
    fullIp: false,
    ipType: false,
    isp: false,
    asn: false,
    vpn: false,
    proxy: false,
    hosting: false,
    mobileNetwork: false,
    riskLevel: false,
    trustScore: false,
    ...(config.logOptions || {}),
  };

const currentAppearance = {

  cardDesign:
    "classic",

  splitImageUrl:
    "",

  splitImagePosition:
    "left",

  splitImageFit:
    "cover",

  splitImageDarkness:
    45,

  splitImageWidth:
    48,

  splitShowImage:
    true,

  splitShowDate:
    true,

  splitShowAccess:
    true,

  terminalTitle:
    "NEBULA SECURITY TERMINAL",

  terminalPrefix:
    ">",

  terminalStatusText:
    "Sistema preparado",

  terminalBackgroundColor:
    "#020703",

  terminalTextColor:
    "#d9ffe0",

  terminalAccentColor:
    "#22c55e",

  terminalBorderColor:
    "#14532d",

  terminalShowCursor:
    true,

  terminalShowLines:
    true,

  terminalShowServer:
    true,

  terminalShowRole:
    true,

  terminalGlow:
    25,

  terminalRadius:
    10,

  pageName:
    "Trade Room Verification",

  pageDescription:
    "Completá la verificación para acceder al servidor.",

  logoUrl: "",
  backgroundUrl: "",

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

  backgroundType:
    "space",

  backgroundSolidColor:
    "#05050a",

  gradientStart:
    "#05050a",

  gradientEnd:
    "#160c2b",

  spaceBackground: true,

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

  cardBlur: 18,
  cardOpacity: 88,
  cardRadius: 24,
  cardShadow: 80,

  verifyButtonText:
    "Verificar con Discord",

  verifyButtonIcon:
    "discord",

  verifyButtonSize:
    "large",

  verifyButtonRadius: 14,

  verificationSound: false,
  errorSound: false,
  openingSound: false,

  soundVolume: 50,

  ...(config.webAppearance || {}),
};

  const currentSecurity = {
  detectVpn: false,
  detectVpnLogChannelId: "",

  detectProxy: false,
  detectProxyLogChannelId: "",

  detectTor: false,
  detectTorLogChannelId: "",

  blockHosting: false,
  blockHostingLogChannelId: "",

  detectAltAccounts: false,
  detectAltAccountsLogChannelId: "",

  minimumAccountAgeEnabled: false,
  minimumAccountAgeDays: 7,
  minimumAccountAgeLogChannelId: "",

  blockWithoutAvatar: false,
  blockWithoutAvatarLogChannelId: "",

  blockWithoutBanner: false,
  blockWithoutBannerLogChannelId: "",

  allowReverification: true,

  notifySecurityFailure: true,

  ...(config.security || {}),
};

  const channelOptions = channels
    .map(
      channel => `
        <option
          value="${channel.id}"
          ${
            channel.id === config.verificationChannelId
              ? "selected"
              : ""
          }
        >
          # ${escapeHtml(channel.name)}
        </option>
      `
    )
    .join("");

  const logsOptions = channels
    .map(
      channel => `
        <option
          value="${channel.id}"
          ${
            channel.id === config.logsChannelId
              ? "selected"
              : ""
          }
        >
          # ${escapeHtml(channel.name)}
        </option>
      `
    )
    .join("");

  const roleOptions = roles
    .map(
      role => `
        <option
          value="${role.id}"
          ${
            role.id === config.verifiedRoleId
              ? "selected"
              : ""
          }
        >
          @ ${escapeHtml(role.name)}
        </option>
      `
    )
    .join("");

  const createToggle = (
    id,
    title,
    description,
    checked
  ) => `
    <div class="verify-option-row">
      <div>
        <strong>${title}</strong>
        <p>${description}</p>
      </div>

      <label class="switch-control">
        <input
          id="${id}"
          type="checkbox"
          ${checked ? "checked" : ""}
        >
        <span></span>
      </label>
    </div>
  `;


const createSecurityCard = ({
  id,
  title,
  description,
  enabled,
  logChannelId = "",
  channels = "",
  showLogChannel = true,
  icon = "◈",
  extraContent = "",
  cardClass = "",
}) => {
  const selectedChannels = String(channels).replace(
    new RegExp(
      `value="${String(logChannelId)}"`,
      "g"
    ),
    `value="${String(logChannelId)}" selected`
  );

  return `
    <article
      class="verify-security-card ${cardClass}"
      data-security-card="${id}"
    >
      <div class="verify-security-card-glow"></div>

      <div class="verify-security-card-header">

        <div class="verify-security-card-icon">
          ${icon}
        </div>

        <div class="verify-security-card-copy">
          <strong>
            ${escapeHtml(title)}
          </strong>

          <p>
            ${escapeHtml(description)}
          </p>
        </div>

        <label class="switch-control verify-security-switch">
          <input
            id="${id}"
            type="checkbox"
            ${enabled ? "checked" : ""}
          >

          <span></span>
        </label>

      </div>

      ${extraContent}

      ${
        showLogChannel
          ? `
            <label class="verify-security-field">

              <span class="verify-security-field-label">
                <i></i>
                CANAL DE LOGS
              </span>

              <div class="verify-security-select-wrapper">
                <select
                  id="${id}LogChannel"
                  class="verify-security-channel"
                >
                  <option value="">
                    No enviar logs
                  </option>

                  ${selectedChannels}
                </select>

                <span class="verify-security-select-arrow">
                 ⌄
                </span>
              </div>

            </label>
          `
          : ""
      }

      <div class="verify-security-card-status">
        <span class="verify-security-status-dot"></span>

        <span class="verify-security-status-text">
          ${enabled ? "Protección activada" : "Protección desactivada"}
        </span>
      </div>

    </article>
  `;
};

  const createLogToggle = (
    key,
    title,
    description
  ) =>
    createToggle(
      `verifyLog_${key}`,
      title,
      description,
      Boolean(currentLogOptions[key])
    );

  pageContent.innerHTML = `
    <div class="dynamic-page verification-config-page">

      <section class="section-header">
        <div>
          <span>SEGURIDAD DEL SERVIDOR</span>

          <h1>Verificación</h1>

          <p>
            Administrá el sistema de acceso de
            ${escapeHtml(servidor.name)}.
          </p>
        </div>

        <button
          id="backToServerPanel"
          class="section-action"
        >
          ‹ Volver al servidor
        </button>
      </section>

      <nav class="verify-tabs">
        <button
          class="verify-tab active"
          data-verify-tab="general"
        >
          ⚙ General
        </button>

        <button
          class="verify-tab"
          data-verify-tab="panel"
        >
          📨 Panel
        </button>

        <button
          class="verify-tab"
          data-verify-tab="logs"
        >
          📋 Logs
        </button>

        <button
          class="verify-tab"
          data-verify-tab="appearance"
        >
          ✨ Apariencia
        </button>

        <button
          class="verify-tab"
          data-verify-tab="security"
        >
          🛡 Seguridad
        </button>

        <button
          class="verify-tab"
          data-verify-tab="configuration"
        >
          ⚙ Configuración
        </button>
      </nav>

      <div class="verify-tab-content">

        <!-- GENERAL -->

        <section
          class="verify-tab-panel active"
          data-verify-panel="general"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>CONFIGURACIÓN GENERAL</span>
                <h3>Sistema de verificación</h3>
              </div>

              <span
                id="verifySystemStatus"
                class="verify-status-badge ${
                  config.enabled
                    ? "enabled"
                    : "disabled"
                }"
              >
                ${
                  config.enabled
                    ? "ACTIVADO"
                    : "DESACTIVADO"
                }
              </span>
            </div>

            ${createToggle(
              "verifyEnabled",
              "Activar sistema de verificación",
              "Permite que los usuarios obtengan el rol configurado.",
              config.enabled
            )}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANAL DE VERIFICACIÓN</span>

                <select id="verifyChannel">
                  <option value="">
                    Seleccionar canal...
                  </option>

                  ${channelOptions}
                </select>
              </label>

              <label class="welcome-field">
                <span>ROL A ENTREGAR</span>

                <select id="verifyRole">

                  <option value="">
                    Seleccionar rol...
                  </option>

                  ${roleOptions}
                </select>
              </label>
            </div>
          </article>

          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>MÉTODO</span>
                <h3>Tipo de verificación</h3>
              </div>
            </div>

            <div class="verify-method-grid">

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="oauth_link"
                  ${
                    config.verificationMethod ===
                    "oauth_link"
                      ? "checked"
                      : ""
                  }
                >

                <div>
                  <i>🔗</i>
                  <strong>Botón de enlace</strong>
                  <p>
                    Abre OAuth2 y redirige a la
                    página web.
                  </p>
                  <span>RECOMENDADO</span>
                </div>
              </label>

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="interaction_button"
                  ${
                    config.verificationMethod ===
                    "interaction_button"
                      ? "checked"
                      : ""
                  }
                >

                <div>
                  <i>🔘</i>
                  <strong>Botón de interacción</strong>
                  <p>
                    El bot procesa la verificación
                    desde Discord.
                  </p>
                </div>
              </label>

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="emoji_reaction"
                  ${
                    config.verificationMethod ===
                    "emoji_reaction"
                      ? "checked"
                      : ""
                  }
                >

                <div>
                  <i>😀</i>
                  <strong>Reacción</strong>
                  <p>
                    El usuario reacciona al mensaje
                    para verificarse.
                  </p>
                </div>
              </label>

            </div>
          </article>
        </section>

             <!-- PANEL -->

<section
  class="verify-tab-panel"
  data-verify-panel="panel"
>
  <div class="verify-panel-editor-layout">

    <!-- CONTROLES -->

    <div class="verify-panel-controls">

      <article class="section-panel">

    <div class="section-panel-head">
  <div>
    <span>PANEL DE DISCORD</span>

    <h3>
      Configuración del embed
    </h3>
  </div>

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
</div>

        <label class="welcome-field">
          <span>TÍTULO DEL EMBED</span>

          <input
            id="verifyEmbedTitle"
            maxlength="256"
            value="${escapeHtmlAttribute(
              config.embedTitle ||
              "🔒 Verificación requerida"
            )}"
          >
        </label>

        <label class="welcome-field">
          <span>DESCRIPCIÓN</span>

          <textarea
            id="verifyEmbedDescription"
            rows="5"
            maxlength="4000"
          >${escapeHtml(
            config.embedDescription ||
            "Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord."
          )}</textarea>
        </label>

        <label class="welcome-field">
          <span>COLOR DEL EMBED</span>

          <div class="welcome-color-row">
            <input
              id="verifyEmbedColor"
              type="color"
              value="${
                config.embedColor ||
                "#8b5cf6"
              }"
            >

            <input
              id="verifyEmbedColorText"
              maxlength="7"
              value="${
                config.embedColor ||
                "#8b5cf6"
              }"
            >
          </div>
        </label>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>TEXTO DEL BOTÓN</span>

            <input
              id="verifyButtonText"
              maxlength="80"
              value="${escapeHtmlAttribute(
                config.buttonText ||
                "Verificar con Discord"
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>EMOJI DEL BOTÓN</span>

            <input
              id="verifyButtonEmoji"
              maxlength="100"
              value="${escapeHtmlAttribute(
                config.buttonEmoji ||
                "✅"
              )}"
            >
          </label>

        </div>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>NOMBRE DEL CAMPO</span>

            <input
              id="verifyEmbedFieldName"
              maxlength="256"
              value="${escapeHtmlAttribute(
                config.embedFieldName ||
                "📌 Servidor"
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>VALOR DEL CAMPO</span>

            <input
              id="verifyEmbedFieldValue"
              maxlength="1024"
              value="${escapeHtmlAttribute(
                config.embedFieldValue ||
                "{server}"
              )}"
            >
          </label>

        </div>

        <label class="welcome-field">
          <span>TEXTO DEL PIE</span>

          <input
            id="verifyEmbedFooterText"
            maxlength="2048"
            value="${escapeHtmlAttribute(
              config.embedFooterText ||
              "Nebula Security • Todos los derechos reservados"
            )}"
          >
        </label>

        <label class="welcome-field">
          <span>EMOJI DE REACCIÓN</span>

          <input
            id="verifyReactionEmoji"
            maxlength="100"
            value="${escapeHtmlAttribute(
              config.reactionEmoji ||
              "✅"
            )}"
          >
        </label>

      </article>

      <article class="section-panel">

        <div class="section-panel-head">
          <div>
            <span>IMÁGENES Y ELEMENTOS</span>
            <h3>Contenido visual</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${createToggle(
            "verifyShowBotAvatar",
            "Mostrar avatar del bot",
            "Usa la foto de perfil real del bot.",
            config.showBotAvatar !== false
          )}

          ${createToggle(
            "verifyShowServerIcon",
            "Mostrar icono del servidor",
            "Usa el icono del servidor como miniatura.",
            config.showServerIcon !== false
          )}

          ${createToggle(
            "verifyShowCustomThumbnail",
            "Miniatura personalizada",
            "Muestra una imagen pequeña en el embed.",
            Boolean(
              config.showCustomThumbnail
            )
          )}

          ${createToggle(
            "verifyShowEmbedImage",
            "Imagen grande",
            "Muestra una imagen en la parte inferior.",
            Boolean(
              config.showEmbedImage
            )
          )}

          ${createToggle(
            "verifyShowTimestamp",
            "Mostrar fecha y hora",
            "Agrega el timestamp real de Discord.",
            config.showTimestamp !== false
          )}

        </div>

        <label class="welcome-field">
          <span>URL DE LA MINIATURA</span>

          <input
            id="verifyEmbedThumbnailUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${escapeHtmlAttribute(
              config.embedThumbnailUrl ||
              ""
            )}"
          >
        </label>

        <label class="welcome-field">
          <span>URL DE LA IMAGEN GRANDE</span>

          <input
            id="verifyEmbedImageUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${escapeHtmlAttribute(
              config.embedImageUrl ||
              ""
            )}"
          >
        </label>

      </article>

    
      </article>

    </div>

    <!-- VISTA PREVIA -->

    <aside class="verify-discord-preview-column">

      <article class="section-panel verify-discord-preview-panel">

        <div class="section-panel-head">
          <div>
            <span>VISTA PREVIA</span>
            <h3>Así se verá en Discord</h3>
          </div>
        </div>

        <div class="discord-message-preview">

          <div
            id="verifyPreviewAuthor"
            class="discord-message-author"
          >
            <img
              id="verifyPreviewBotAvatar"
              src="${escapeHtmlAttribute(
                botInfo.avatar ||
                "https://cdn.discordapp.com/embed/avatars/0.png"
              )}"
              alt="Avatar del bot"
            >

            <div>
              <strong id="verifyPreviewBotName">
                ${escapeHtml(
                  botInfo.displayName ||
                  botInfo.username ||
                  "Nebula Bot"
                )}
              </strong>

              <span>BOT</span>

              <small>
                Hoy a las
                ${new Date().toLocaleTimeString(
                  "es-AR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </small>
            </div>
          </div>

          <div
            id="verifyPreviewEmbed"
            class="discord-embed-preview"
            style="
              --preview-embed-color:
              ${
                config.embedColor ||
                "#8b5cf6"
              };
            "
          >

            <div class="discord-embed-body">

              <div class="discord-embed-content">

                <h3 id="verifyPreviewTitle">
                  ${escapeHtml(
                    config.embedTitle ||
                    "🔒 Verificación requerida"
                  )}
                </h3>

                <p id="verifyPreviewDescription">
                  ${escapeHtml(
                    (
                      config.embedDescription ||
                      "Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord."
                    )
                      .replaceAll(
                        "{server}",
                        servidor.name
                      )
                      .replaceAll("**", "")
                  )}
                </p>

                <div
                  id="verifyPreviewField"
                  class="discord-embed-field"
                >
                  <strong id="verifyPreviewFieldName">
                    ${escapeHtml(
                      config.embedFieldName ||
                      "📌 Servidor"
                    )}
                  </strong>

                  <span id="verifyPreviewFieldValue">
                    ${escapeHtml(
                      (
                        config.embedFieldValue ||
                        "{server}"
                      ).replaceAll(
                        "{server}",
                        servidor.name
                      )
                    )}
                  </span>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewButtonEmoji">
                    ${escapeHtml(
                      config.buttonEmoji ||
                      "✅"
                    )}
                  </span>

                  <strong id="verifyPreviewButtonText">
                    ${escapeHtml(
                      config.buttonText ||
                      "Verificar con Discord"
                    )}
                  </strong>
                </button>

              </div>

              <img
                id="verifyPreviewThumbnail"
                class="discord-embed-thumbnail"
                src="${escapeHtmlAttribute(
                  config.showCustomThumbnail &&
                  config.embedThumbnailUrl
                    ? config.embedThumbnailUrl
                    : servidor.icon ||
                      servidor.iconURL ||
                      ""
                )}"
                alt="Miniatura"
              >

            </div>

            <img
              id="verifyPreviewImage"
              class="discord-embed-large-image"
              src="${escapeHtmlAttribute(
                config.embedImageUrl ||
                ""
              )}"
              alt="Imagen del embed"
              ${
                config.showEmbedImage &&
                config.embedImageUrl
                  ? ""
                  : 'style="display:none"'
              }
            >

            <div class="discord-embed-footer">

              <img
                id="verifyPreviewFooterAvatar"
                src="${escapeHtmlAttribute(
                  botInfo.avatar ||
                  "https://cdn.discordapp.com/embed/avatars/0.png"
                )}"
                alt=""
              >

              <span id="verifyPreviewFooterText">
                ${escapeHtml(
                  config.embedFooterText ||
                  "Nebula Security • Todos los derechos reservados"
                )}
              </span>

              <small
                id="verifyPreviewTimestamp"
                ${
                  config.showTimestamp === false
                    ? 'style="display:none"'
                    : ""
                }
              >
                • Hoy a las
                ${new Date().toLocaleTimeString(
                  "es-AR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </small>

            </div>

          </div>

        </div>

        <p class="discord-preview-help">
          Los cambios se muestran en tiempo real.
        </p>

      </article>

    </aside>

  </div>
</section>

        <!-- LOGS -->

        <section
          class="verify-tab-panel"
          data-verify-panel="logs"
        >
          <article class="section-panel">
<div class="section-panel-head">
  <div>
    <span>CANAL DE REGISTROS</span>

    <h3>
      Logs de verificación
    </h3>
  </div>

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
</div>
            
        <label class="welcome-field">
          <span>CANAL DE LOGS</span>

          <select id="verifyLogs">
            <option value="">
                Seleccionar canal...
              </option>

                ${logsOptions}
              </select>
            </label>
          </article>

          <div
            id="verifyLogsSettings"
            class="verify-logs-settings ${
              config.logsChannelId
                ? "visible"
                : ""
            }"
          >
            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>PERSONALIZACIÓN</span>
                  <h3>Embed del registro</h3>
                </div>
              </div>

              <label class="welcome-field">
                <span>TÍTULO DEL LOG</span>

                <input
                  id="verifyLogTitle"
                  maxlength="256"
                  value="${escapeHtmlAttribute(
                    config.logEmbedTitle ||
                    "🛡️ Usuario verificado"
                  )}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN DEL LOG</span>

                <textarea
                  id="verifyLogDescription"
                  rows="4"
                  maxlength="4000"
                >${escapeHtml(
                  config.logEmbedDescription ||
                  ""
                )}</textarea>
              </label>

              <label class="welcome-field">
                <span>COLOR DEL LOG</span>

                <div class="welcome-color-row">
                  <input
                    id="verifyLogColor"
                    type="color"
                    value="${
                      config.logEmbedColor ||
                      "#22c55e"
                    }"
                  >

                  <input
                    id="verifyLogColorText"
                    value="${
                      config.logEmbedColor ||
                      "#22c55e"
                    }"
                    maxlength="7"
                  >
                </div>
              </label>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>DISCORD</span>
                  <h3>Datos del usuario</h3>
                </div>
              </div>

              <div class="verify-options-grid">
                ${createLogToggle(
                  "avatar",
                  "Avatar",
                  "Foto de perfil del usuario."
                )}

                ${createLogToggle(
                  "username",
                  "Usuario de Discord",
                  "Nombre de usuario."
                )}

                ${createLogToggle(
                  "displayName",
                  "Nombre para mostrar",
                  "Apodo o nombre global."
                )}

                ${createLogToggle(
                  "userId",
                  "Discord ID",
                  "Identificador de la cuenta."
                )}

                ${createLogToggle(
                  "deliveredRole",
                  "Rol entregado",
                  "Rol recibido al verificarse."
                )}

                ${createLogToggle(
                  "accountCreatedAt",
                  "Cuenta creada",
                  "Fecha de creación de Discord."
                )}

                ${createLogToggle(
                  "joinedAt",
                  "Ingreso al servidor",
                  "Fecha en que se unió."
                )}

                ${createLogToggle(
                  "verifiedAt",
                  "Fecha de verificación",
                  "Momento exacto de la verificación."
                )}
              </div>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>DISPOSITIVO</span>
                  <h3>Información técnica</h3>
                </div>
              </div>

              <div class="verify-options-grid">
                ${createLogToggle(
                  "browser",
                  "Navegador",
                  "Chrome, Edge, Firefox, etc."
                )}

                ${createLogToggle(
                  "operatingSystem",
                  "Sistema operativo",
                  "Windows, Android, iOS, etc."
                )}

                ${createLogToggle(
                  "device",
                  "Dispositivo",
                  "Computadora, celular o tablet."
                )}

                ${createLogToggle(
                  "resolution",
                  "Resolución",
                  "Tamaño de la pantalla."
                )}

                ${createLogToggle(
                  "language",
                  "Idioma",
                  "Idioma configurado."
                )}

                ${createLogToggle(
                  "timezone",
                  "Zona horaria",
                  "Zona horaria del navegador."
                )}
              </div>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>RED Y UBICACIÓN</span>
                  <h3>Información aproximada</h3>
                </div>
              </div>

              <div class="verify-privacy-note">
                Los datos de red deben utilizarse
                únicamente con una finalidad legítima,
                protección adecuada y aviso claro al usuario.
              </div>

              <div class="verify-options-grid">
                ${createLogToggle(
                  "country",
                  "País aproximado",
                  "País estimado por la conexión."
                )}

                ${createLogToggle(
                  "city",
                  "Ciudad aproximada",
                  "Ciudad estimada."
                )}

                ${createLogToggle(
                  "vpn",
                  "VPN",
                  "Indica posible uso de VPN."
                )}

                ${createLogToggle(
                  "proxy",
                  "Proxy",
                  "Indica posible uso de proxy."
                )}

                ${createLogToggle(
                  "isp",
                  "Proveedor de internet",
                  "Empresa de conexión."
                )}

                ${createLogToggle(
                  "asn",
                  "ASN",
                  "Identificador de la red."
                )}

                ${createLogToggle(
                  "fullIp",
                  "Dirección IP completa",
                  "Dato sensible. Debe permanecer desactivado salvo que exista una necesidad legítima y aviso claro."
                )}
              </div>
            </article>
          </div>
        </section>

        <!-- APARIENCIA -->

   <section
  class="verify-tab-panel"
  data-verify-panel="appearance"
>
  <div class="appearance-editor-layout">

    <div class="appearance-editor-controls">


      <!-- IDENTIDAD -->

<!-- DISEÑOS -->

<article class="section-panel appearance-design-section">
  <div class="section-panel-head">
    <div>
      <span>ESTILO DE LA TARJETA</span>
      <h3>Diseños</h3>
    </div>
  </div>

  <div class="appearance-design-grid">

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="classic"
        ${
          currentAppearance.cardDesign === "classic"
            ? "checked"
            : ""
        }
      >

      <div>
        <span class="appearance-design-icon">
          ◫
        </span>

        <strong>
          Clásico
        </strong>

        <p>
          Diseño actual de Nebula.
        </p>
      </div>
    </label>

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="split"
        ${
          currentAppearance.cardDesign === "split"
            ? "checked"
            : ""
        }
      >

      <div>
        <span class="appearance-design-icon">
          ◧
        </span>

        <strong>
          Split Premium
        </strong>

        <p>
          Imagen a la izquierda y datos a la derecha.
        </p>
      </div>
    </label>

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="terminal"
        ${
          currentAppearance.cardDesign === "terminal"
            ? "checked"
            : ""
        }
      >

      <div>
        <span class="appearance-design-icon">
          &gt;_
        </span>

        <strong>
          Terminal
        </strong>

        <p>
          Diseño serio con estilo de consola.
        </p>
      </div>
    </label>

  </div>
</article>
<!-- OPCIONES ESPECÍFICAS DE SPLIT PREMIUM -->

<div
  class="design-settings-panel"
  data-design-settings="split"
>
  <article class="section-panel">

    <div class="section-panel-head">
      <div>
        <span>SPLIT PREMIUM</span>

        <h3>
          Imagen y distribución
        </h3>
      </div>
    </div>

    <div class="appearance-form-grid">

      <label class="welcome-field appearance-wide">
        <span>
          URL DE LA IMAGEN LATERAL
        </span>

        <input
          id="verifySplitImageUrl"
          maxlength="1000"
          placeholder="https://..."
          value="${escapeHtmlAttribute(
            currentAppearance.splitImageUrl ||
            ""
          )}"
        >
      </label>

      <label class="welcome-field">
        <span>
          POSICIÓN DE LA IMAGEN
        </span>

        <select id="verifySplitImagePosition">

          <option
            value="left"
            ${
              currentAppearance.splitImagePosition !==
              "right"
                ? "selected"
                : ""
            }
          >
            Izquierda
          </option>

          <option
            value="right"
            ${
              currentAppearance.splitImagePosition ===
              "right"
                ? "selected"
                : ""
            }
          >
            Derecha
          </option>

        </select>
      </label>

      <label class="welcome-field">
        <span>
          AJUSTE DE LA IMAGEN
        </span>

        <select id="verifySplitImageFit">

          <option
            value="cover"
            ${
              currentAppearance.splitImageFit !==
              "contain"
                ? "selected"
                : ""
            }
          >
            Cubrir
          </option>

          <option
            value="contain"
            ${
              currentAppearance.splitImageFit ===
              "contain"
                ? "selected"
                : ""
            }
          >
            Contener
          </option>

        </select>
      </label>

    </div>

    <div class="appearance-range-grid">

      ${appearanceRangeControl(
        "verifySplitImageDarkness",
        "OSCURIDAD DE LA IMAGEN",
        currentAppearance.splitImageDarkness ?? 45,
        0,
        90,
        "%"
      )}

      ${appearanceRangeControl(
        "verifySplitImageWidth",
        "ANCHO DE LA IMAGEN",
        currentAppearance.splitImageWidth ?? 48,
        35,
        65,
        "%"
      )}

    </div>

    <div class="verify-options-grid">

      ${createToggle(
        "verifySplitShowImage",
        "Mostrar imagen lateral",
        "Activa o desactiva la imagen del diseño.",
        currentAppearance.splitShowImage !== false
      )}

      ${createToggle(
        "verifySplitShowDate",
        "Mostrar fecha",
        "Muestra la fecha actual dentro de la tarjeta.",
        currentAppearance.splitShowDate !== false
      )}

      ${createToggle(
        "verifySplitShowAccess",
        "Mostrar acceso",
        "Muestra el estado de acceso instantáneo.",
        currentAppearance.splitShowAccess !== false
      )}

    </div>

  </article>
</div>

<!-- OPCIONES ESPECÍFICAS DE TERMINAL -->

<div
  class="design-settings-panel"
  data-design-settings="terminal"
>
  <article class="section-panel">

    <div class="section-panel-head">
      <div>
        <span>TERMINAL</span>

        <h3>
          Consola de seguridad
        </h3>
      </div>
    </div>

    <div class="appearance-form-grid">

      <label class="welcome-field appearance-wide">
        <span>
          TÍTULO DE LA TERMINAL
        </span>

        <input
          id="verifyTerminalTitle"
          maxlength="100"
          value="${escapeHtmlAttribute(
            currentAppearance.terminalTitle ||
            "NEBULA SECURITY TERMINAL"
          )}"
        >
      </label>

      <label class="welcome-field">
        <span>
          PREFIJO DE LAS LÍNEAS
        </span>

        <input
          id="verifyTerminalPrefix"
          maxlength="5"
          value="${escapeHtmlAttribute(
            currentAppearance.terminalPrefix ||
            ">"
          )}"
        >
      </label>

      <label class="welcome-field">
        <span>
          TEXTO DE ESTADO
        </span>

        <input
          id="verifyTerminalStatusText"
          maxlength="80"
          value="${escapeHtmlAttribute(
            currentAppearance.terminalStatusText ||
            "Sistema preparado"
          )}"
        >
      </label>

    </div>

    <div class="appearance-colors-grid">

      ${appearanceColorControl(
        "verifyTerminalBackgroundColor",
        "COLOR DEL FONDO",
        currentAppearance.terminalBackgroundColor ||
        "#020703"
      )}

      ${appearanceColorControl(
        "verifyTerminalTextColor",
        "COLOR DEL TEXTO",
        currentAppearance.terminalTextColor ||
        "#d9ffe0"
      )}

      ${appearanceColorControl(
        "verifyTerminalAccentColor",
        "COLOR PRINCIPAL",
        currentAppearance.terminalAccentColor ||
        "#22c55e"
      )}

      ${appearanceColorControl(
        "verifyTerminalBorderColor",
        "COLOR DEL BORDE",
        currentAppearance.terminalBorderColor ||
        "#14532d"
      )}

    </div>

    <div class="verify-options-grid">

      ${createToggle(
        "verifyTerminalShowCursor",
        "Cursor parpadeante",
        "Muestra un cursor discreto al final de la terminal.",
        currentAppearance.terminalShowCursor !== false
      )}

      ${createToggle(
        "verifyTerminalShowLines",
        "Líneas separadoras",
        "Muestra divisiones con estilo de consola.",
        currentAppearance.terminalShowLines !== false
      )}

      ${createToggle(
        "verifyTerminalShowServer",
        "Mostrar servidor",
        "Muestra el nombre del servidor.",
        currentAppearance.terminalShowServer !== false
      )}

      ${createToggle(
        "verifyTerminalShowRole",
        "Mostrar rol",
        "Muestra el rol que recibirá el usuario.",
        currentAppearance.terminalShowRole !== false
      )}

    </div>

    <div class="appearance-range-grid">

      ${appearanceRangeControl(
        "verifyTerminalGlow",
        "INTENSIDAD DEL BRILLO",
        currentAppearance.terminalGlow ?? 25,
        0,
        70,
        "%"
      )}

      ${appearanceRangeControl(
        "verifyTerminalRadius",
        "BORDES REDONDEADOS",
        currentAppearance.terminalRadius ?? 10,
        0,
        30,
        "px"
      )}

    </div>

  </article>
</div>


     <article
  class="section-panel"
  data-appearance-section="identity"
>
        <div class="section-panel-head">
          <div>
            <span>IDENTIDAD</span>
            <h3>Información de la página</h3>
          </div>
        </div>

        <div class="appearance-form-grid">
          <label class="welcome-field appearance-wide">
            <span>NOMBRE DE LA PÁGINA</span>

            <input
              id="verifyPageName"
              maxlength="100"
              value="${escapeHtmlAttribute(
                currentAppearance.pageName
              )}"
            >
          </label>

          <label class="welcome-field appearance-wide">
            <span>DESCRIPCIÓN</span>

            <textarea
              id="verifyPageDescription"
              maxlength="300"
              rows="3"
            >${escapeHtml(
              currentAppearance.pageDescription
            )}</textarea>
          </label>

          <label class="welcome-field">
            <span>URL DEL LOGO</span>

            <input
              id="verifyLogoUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${escapeHtmlAttribute(
                currentAppearance.logoUrl
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>URL DEL FONDO</span>

            <input
              id="verifyBackgroundUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${escapeHtmlAttribute(
                currentAppearance.backgroundUrl
              )}"
            >
          </label>
        </div>
      </article>

      <!-- COLORES -->

<article
  class="section-panel"
  data-appearance-section="palette"
>
          <div class="section-panel-head">
          <div>
            <span>PALETA</span>
            <h3>Colores de la página</h3>
          </div>
        </div>

        <div class="appearance-colors-grid">

          ${appearanceColorControl(
            "verifyPrimaryColor",
            "COLOR PRINCIPAL",
            currentAppearance.primaryColor
          )}

          ${appearanceColorControl(
            "verifySecondaryColor",
            "COLOR SECUNDARIO",
            currentAppearance.secondaryColor
          )}

          ${appearanceColorControl(
            "verifyButtonColor",
            "COLOR DEL BOTÓN",
            currentAppearance.buttonColor
          )}

          ${appearanceColorControl(
            "verifyTextColor",
            "COLOR DEL TEXTO",
            currentAppearance.textColor
          )}

          ${appearanceColorControl(
            "verifyCardColor",
            "COLOR DE LA TARJETA",
            currentAppearance.cardColor
          )}

          ${appearanceColorControl(
            "verifyBackgroundSolidColor",
            "COLOR DEL FONDO",
            currentAppearance.backgroundSolidColor
          )}

          ${appearanceColorControl(
            "verifyGradientStart",
            "INICIO DEL DEGRADADO",
            currentAppearance.gradientStart
          )}

          ${appearanceColorControl(
            "verifyGradientEnd",
            "FINAL DEL DEGRADADO",
            currentAppearance.gradientEnd
          )}

        </div>
      </article>

      <!-- FONDO -->

<article
  class="section-panel"
  data-appearance-section="background"
>
            <div class="section-panel-head">
          <div>
            <span>FONDO</span>
            <h3>Diseño del escenario</h3>
          </div>
        </div>

        <label class="welcome-field">
          <span>TIPO DE FONDO</span>

          <select id="verifyBackgroundType">
            <option
              value="space"
              ${
                currentAppearance.backgroundType === "space"
                  ? "selected"
                  : ""
              }
            >
              Espacial
            </option>

            <option
              value="gradient"
              ${
                currentAppearance.backgroundType === "gradient"
                  ? "selected"
                  : ""
              }
            >
              Degradado
            </option>

            <option
              value="image"
              ${
                currentAppearance.backgroundType === "image"
                  ? "selected"
                  : ""
              }
            >
              Imagen
            </option>

            <option
              value="video"
              ${
                currentAppearance.backgroundType === "video"
                  ? "selected"
                  : ""
              }
            >
              Video
            </option>

            <option
              value="solid"
              ${
                currentAppearance.backgroundType === "solid"
                  ? "selected"
                  : ""
              }
            >
              Color sólido
            </option>
          </select>
        </label>

        <div class="verify-options-grid">
          ${createToggle(
            "verifySpaceBackground",
            "Fondo espacial",
            "Muestra estrellas y partículas.",
            currentAppearance.spaceBackground
          )}

          ${createToggle(
            "verifyParticlesEnabled",
            "Partículas",
            "Activa partículas animadas.",
            currentAppearance.particlesEnabled
          )}
        </div>

        <div class="appearance-range-grid">
          ${appearanceRangeControl(
            "verifyParticleCount",
            "CANTIDAD DE PARTÍCULAS",
            currentAppearance.particleCount,
            0,
            300
          )}

          ${appearanceRangeControl(
            "verifyGlowIntensity",
            "INTENSIDAD DEL BRILLO",
            currentAppearance.glowIntensity,
            0,
            100
          )}
        </div>
      </article>

      <!-- ANIMACIONES -->

     <article
  class="section-panel"
  data-appearance-section="animations"
>
        <div class="section-panel-head">
          <div>
            <span>EFECTOS</span>
            <h3>Animaciones</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${createToggle(
            "verifyAnimationsEnabled",
            "Animaciones generales",
            "Activa todos los efectos visuales.",
            currentAppearance.animationsEnabled
          )}

          ${createToggle(
            "verifyGlowEnabled",
            "Efecto glow",
            "Agrega brillo alrededor de los elementos.",
            currentAppearance.glowEnabled
          )}

          ${createToggle(
            "verifyFadeEnabled",
            "Entrada suave",
            "Los elementos aparecen con un efecto fade.",
            currentAppearance.fadeEnabled
          )}

          ${createToggle(
            "verifyHoverEnabled",
            "Efectos hover",
            "Los elementos reaccionan al pasar el cursor.",
            currentAppearance.hoverEnabled
          )}

          ${createToggle(
            "verifyCursorGlowEnabled",
            "Cursor luminoso",
            "Agrega un resplandor alrededor del cursor.",
            currentAppearance.cursorGlowEnabled
          )}

          ${createToggle(
            "verifyButtonAnimationEnabled",
            "Animación del botón",
            "Anima el botón principal.",
            currentAppearance.buttonAnimationEnabled
          )}

          ${createToggle(
            "verifyLogoAnimationEnabled",
            "Animación del logo",
            "Agrega movimiento suave al logo.",
            currentAppearance.logoAnimationEnabled
          )}

        </div>
      </article>

      <!-- TARJETA -->

<article
  class="section-panel"
  data-appearance-section="card"
>
           <div class="section-panel-head">
          <div>
            <span>CONTENEDOR</span>
            <h3>Tarjeta principal</h3>
          </div>
        </div>

        <div class="appearance-range-grid">

          ${appearanceRangeControl(
            "verifyCardBlur",
            "DESENFOQUE",
            currentAppearance.cardBlur,
            0,
            50,
            "px"
          )}

          ${appearanceRangeControl(
            "verifyCardOpacity",
            "OPACIDAD",
            currentAppearance.cardOpacity,
            10,
            100,
            "%"
          )}

          ${appearanceRangeControl(
            "verifyCardRadius",
            "BORDES REDONDEADOS",
            currentAppearance.cardRadius,
            0,
            50,
            "px"
          )}

          ${appearanceRangeControl(
            "verifyCardShadow",
            "INTENSIDAD DE SOMBRA",
            currentAppearance.cardShadow,
            0,
            100,
            "%"
          )}

        </div>
      </article>

      <!-- BOTÓN -->

      <article
  class="section-panel"
  data-appearance-section="button"
>
        <div class="section-panel-head">
          <div>
            <span>ACCIÓN PRINCIPAL</span>
            <h3>Botón de verificación</h3>
          </div>
        </div>

        <div class="appearance-form-grid">

          <label class="welcome-field appearance-wide">
            <span>TEXTO DEL BOTÓN</span>

            <input
              id="verifyAppearanceButtonText"
              maxlength="80"
              value="${escapeHtmlAttribute(
                currentAppearance.verifyButtonText
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>ICONO</span>

            <select id="verifyButtonIcon">
              <option
                value="discord"
                ${
                  currentAppearance.verifyButtonIcon === "discord"
                    ? "selected"
                    : ""
                }
              >
                Discord
              </option>

              <option
                value="shield"
                ${
                  currentAppearance.verifyButtonIcon === "shield"
                    ? "selected"
                    : ""
                }
              >
                Escudo
              </option>

              <option
                value="check"
                ${
                  currentAppearance.verifyButtonIcon === "check"
                    ? "selected"
                    : ""
                }
              >
                Verificado
              </option>

              <option
                value="none"
                ${
                  currentAppearance.verifyButtonIcon === "none"
                    ? "selected"
                    : ""
                }
              >
                Sin icono
              </option>
            </select>
          </label>

          <label class="welcome-field">
            <span>TAMAÑO</span>

            <select id="verifyButtonSize">
              <option
                value="small"
                ${
                  currentAppearance.verifyButtonSize === "small"
                    ? "selected"
                    : ""
                }
              >
                Pequeño
              </option>

              <option
                value="medium"
                ${
                  currentAppearance.verifyButtonSize === "medium"
                    ? "selected"
                    : ""
                }
              >
                Mediano
              </option>

              <option
                value="large"
                ${
                  currentAppearance.verifyButtonSize === "large"
                    ? "selected"
                    : ""
                }
              >
                Grande
              </option>
            </select>
          </label>

        </div>

        <div class="appearance-range-grid">
          ${appearanceRangeControl(
            "verifyButtonRadius",
            "BORDES DEL BOTÓN",
            currentAppearance.verifyButtonRadius,
            0,
            40,
            "px"
          )}
        </div>
      </article>

      <!-- SONIDOS -->

      <article
  class="section-panel"
  data-appearance-section="sounds"
>
        <div class="section-panel-head">
          <div>
            <span>AUDIO</span>
            <h3>Sonidos</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${createToggle(
            "verifyOpeningSound",
            "Sonido al abrir",
            "Reproduce un sonido cuando carga la página.",
            currentAppearance.openingSound
          )}

          ${createToggle(
            "verifyVerificationSound",
            "Sonido al verificar",
            "Reproduce un sonido cuando la verificación termina.",
            currentAppearance.verificationSound
          )}

          ${createToggle(
            "verifyErrorSound",
            "Sonido de error",
            "Reproduce un sonido cuando ocurre un problema.",
            currentAppearance.errorSound
          )}

        </div>

        <div class="appearance-range-grid">
          ${appearanceRangeControl(
            "verifySoundVolume",
            "VOLUMEN",
            currentAppearance.soundVolume,
            0,
            100,
            "%"
          )}
        </div>
      </article>

    </div>

    <!-- VISTA PREVIA -->

    <aside class="appearance-preview-column">
      <article class="section-panel appearance-preview-panel">
        <div class="section-panel-head">
          <div>
            <span>VISTA PREVIA</span>
            <h3>Verificación web</h3>
          </div>
        </div>

<div class="real-verification-preview">
  <iframe
    id="verifyAppearanceFrame"
    class="real-verification-preview-frame"
    src="/verify/${encodeURIComponent(
      servidor.id
    )}?preview=1"
    title="Vista previa real de la verificación"
  ></iframe>
</div>
          </article>
    </aside>

  </div>
</section>
      <!-- SEGURIDAD -->

<section
  class="verify-tab-panel"
  data-verify-panel="security"
>

  <article class="section-panel verify-security-section">

    <div class="verify-security-heading">

      <div class="verify-security-heading-icon">
        ◈
      </div>

      <div class="verify-security-heading-copy">
        <span>
          PROTECCIÓN AVANZADA
        </span>

        <h3>
          Reglas de seguridad
        </h3>

        <p>
          Configurá cómo se controlarán y registrarán las verificaciones sospechosas.
        </p>
      </div>

      <div class="verify-security-counter">
        <strong id="verifySecurityActiveCount">
          0
        </strong>

        <span>
          reglas activas
        </span>
      </div>

    </div>

    <div class="verify-security-list">

      ${createSecurityCard({
        id: "verifyDetectVpn",
        title: "Detectar VPN",
        description: "Marca conexiones que utilizan redes privadas virtuales.",
        enabled: currentSecurity.detectVpn,
        logChannelId: currentSecurity.detectVpnLogChannelId,
        channels: channelOptions,
        icon: "◉"
      })}

      ${createSecurityCard({
        id: "verifyDetectProxy",
        title: "Detectar Proxy",
        description: "Bloquea conexiones realizadas mediante servidores Proxy.",
        enabled: currentSecurity.detectProxy,
        logChannelId: currentSecurity.detectProxyLogChannelId,
        channels: channelOptions,
        icon: "⌁"
      })}

      ${createSecurityCard({
        id: "verifyDetectTor",
        title: "Detectar Tor",
        description: "Detecta conexiones realizadas desde la red anónima Tor.",
        enabled: currentSecurity.detectTor,
        logChannelId: currentSecurity.detectTorLogChannelId,
        channels: channelOptions,
        icon: "◎"
      })}

      ${createSecurityCard({
        id: "verifyBlockHosting",
        title: "Bloquear Hosting",
        description: "Impide verificaciones desde servidores, datacenters o VPS.",
        enabled: currentSecurity.blockHosting,
        logChannelId: currentSecurity.blockHostingLogChannelId,
        channels: channelOptions,
        icon: "▣"
      })}

      ${createSecurityCard({
        id: "verifyDetectAltAccounts",
        title: "Detectar Multicuentas",
        description: "Detecta usuarios que podrían utilizar cuentas alternativas.",
        enabled: currentSecurity.detectAltAccounts,
        logChannelId: currentSecurity.detectAltAccountsLogChannelId,
        channels: channelOptions,
        icon: "♧"
      })}

      ${createSecurityCard({
        id: "verifyMinimumAgeEnabled",
        title: "Edad mínima de la cuenta",
        description: "Bloquea cuentas de Discord creadas recientemente.",
        enabled: currentSecurity.minimumAccountAgeEnabled,
        logChannelId: currentSecurity.minimumAccountAgeLogChannelId,
        channels: channelOptions,
        icon: "◷",
        cardClass: "verify-security-age-card",
        extraContent: `
          <label class="verify-security-field verify-security-age-field">

            <span class="verify-security-field-label">
              <i></i>
              DÍAS MÍNIMOS DE ANTIGÜEDAD
            </span>

            <div class="verify-security-number-wrapper">
              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${
                  currentSecurity.minimumAccountAgeDays
                }"
              >

              <span>
                días
              </span>
            </div>

          </label>
        `
      }).replace(
        'id="verifyMinimumAgeEnabledLogChannel"',
        'id="verifyMinimumAgeLogChannel"'
      )}

      ${createSecurityCard({
        id: "verifyBlockWithoutAvatar",
        title: "Bloquear sin Avatar",
        description: "Impide verificar usuarios que no tengan foto de perfil.",
        enabled: currentSecurity.blockWithoutAvatar,
        logChannelId: currentSecurity.blockWithoutAvatarLogChannelId,
        channels: channelOptions,
        icon: "●"
      })}

      ${createSecurityCard({
        id: "verifyBlockWithoutBanner",
        title: "Bloquear sin Banner",
        description: "Impide verificar usuarios que no tengan banner configurado.",
        enabled: currentSecurity.blockWithoutBanner,
        logChannelId: currentSecurity.blockWithoutBannerLogChannelId,
        channels: channelOptions,
        icon: "▰"
      })}

      ${createSecurityCard({
        id: "verifyAllowReverification",
        title: "Permitir Re-verificación",
        description: "Permite que un usuario vuelva a realizar el proceso.",
        enabled: currentSecurity.allowReverification,
        showLogChannel: false,
        icon: "↻",
        cardClass: "verify-security-simple-card"
      })}

      ${createSecurityCard({
        id: "verifyNotifySecurityFailure",
        title: "Notificar fallo de seguridad",
        description: "Envía un aviso cuando una verificación es rechazada.",
        enabled: currentSecurity.notifySecurityFailure,
        showLogChannel: false,
        icon: "!",
        cardClass: "verify-security-simple-card"
      })}

    </div>

  </article>

</section>

<!-- CONFIGURACIÓN -->

<section
  class="verify-tab-panel"
  data-verify-panel="configuration"
>
  <div class="configuration-flow">

    <!-- ===================================================
         1. MENSAJE DEL BOTÓN DE INTERACCIÓN
         =================================================== -->

    <article
      class="section-panel configuration-flow-card"
      id="interactionMessageConfiguration"
      ${
        config.verificationMethod === "interaction_button"
          ? ""
          : 'style="display:none;"'
      }
    >
     <div class="verification-section-heading">
  <div>
    <h2>
      1. Mensaje del botón de interacción
    </h2>

    <p>
      Este es el mensaje privado que el bot enviará al usuario cuando presione el botón de verificación.
    </p>
  </div>

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
</div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifyInteractionTitle"
              maxlength="256"
              value="${escapeHtmlAttribute(
                config.interactionTitle ||
                "🔒 Verificá tu cuenta"
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifyInteractionMessage"
              rows="8"
              maxlength="2000"
            >${escapeHtml(
              config.interactionMessage ||
              `¡Hola {usuario}! 👋

Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.

El enlace es personal y solo puede utilizarse una vez.

Si no solicitaste esto, ignorá este mensaje.`
            )}</textarea>
          </label>

          <div class="configuration-variable-help">
            <span>Variables disponibles:</span>

            <code>{usuario}</code>
            <code>{servidor}</code>
            <code>{rol}</code>
            <code>{fecha}</code>
            <code>{hora}</code>
          </div>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR DEL EMBED</span>

            <div class="welcome-color-row">
              <input
                id="verifyInteractionColor"
                type="color"
                value="${
                  config.interactionColor ||
                  "#8b5cf6"
                }"
              >

              <input
                id="verifyInteractionColorText"
                maxlength="7"
                value="${escapeHtmlAttribute(
                  config.interactionColor ||
                  "#8b5cf6"
                )}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>IMAGEN OPCIONAL</span>

            <input
              id="verifyInteractionImage"
              placeholder="https://i.imgur.com/imagen.png"
              value="${escapeHtmlAttribute(
                config.interactionImage ||
                ""
              )}"
            >
          </label>

 <div class="configuration-button-fields">

  <label class="welcome-field">
    <span>EMOJI DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonEmoji"
      maxlength="16"
      placeholder="🛡️"
      value="${escapeHtmlAttribute(
        config.interactionButtonEmoji ||
        "🛡️"
      )}"
    >
  </label>

  <label class="welcome-field">
    <span>NOMBRE DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonText"
      maxlength="80"
      placeholder="Continuar verificación"
      value="${escapeHtmlAttribute(
        config.interactionButtonText ||
        "Continuar verificación"
      )}"
    >
  </label>

</div>

<div class="configuration-link-button-note">
  <span>↗</span>

  <p>
    Este botón se mostrará como un enlace externo de Discord.
  </p>
</div>

             </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA DEL MENSAJE
          </span>

          <div
            class="configuration-discord-preview"
            id="interactionMessagePreview"
          >
            <div
              class="configuration-preview-embed"
              id="interactionMessagePreviewEmbed"
              style="--preview-color:${
                config.interactionColor ||
                "#8b5cf6"
              };"
            >
              <strong id="interactionPreviewTitle">
                ${
                  escapeHtml(
                    config.interactionTitle ||
                    "🔒 Verificá tu cuenta"
                  )
                }
              </strong>

              <p id="interactionPreviewMessage">${
                escapeHtml(
                  config.interactionMessage ||
                  `¡Hola Usuario! 👋

Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.

El enlace es personal y solo puede utilizarse una vez.

Si no solicitaste esto, ignorá este mensaje.`
                )
              }</p>

              <img
                id="interactionPreviewImage"
                class="configuration-preview-image"
                src="${escapeHtmlAttribute(
                  config.interactionImage ||
                  ""
                )}"
                alt=""
                ${
                  config.interactionImage
                    ? ""
                    : 'style="display:none;"'
                }
              >
            </div>

            <button
              class="configuration-preview-button"
              id="interactionPreviewButton"
              type="button"
            >
              ${
                escapeHtml(
                  config.interactionButtonText ||
                  "Verificar mi cuenta"
                )
              }
            </button>
          </div>
        </div>

      </div>
    </article>

    <!-- ===================================================
         2. MENSAJE DESPUÉS DE VERIFICAR
         =================================================== -->

    <article class="section-panel configuration-flow-card">
      <div class="configuration-flow-header">
        <div>
          <h3>
            2. Mensaje después de verificar
          </h3>

          <p>
            Este es el mensaje que verá el usuario en la página web
            cuando complete correctamente la verificación.
          </p>
        </div>
      </div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifySuccessTitle"
              maxlength="256"
              value="${escapeHtmlAttribute(
                config.successTitle ||
                "✅ Verificación completada"
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessMessage"
              rows="7"
              maxlength="1000"
            >${escapeHtml(
              config.successMessage ||
              `Tu cuenta fue verificada correctamente.

¡Bienvenido a {servidor}!

Ya podés acceder a todos los canales.`
            )}</textarea>
          </label>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR</span>

            <div class="welcome-color-row">
              <input
                id="verifySuccessColor"
                type="color"
                value="${
                  config.successColor ||
                  "#22c55e"
                }"
              >

              <input
                id="verifySuccessColorText"
                maxlength="7"
                value="${escapeHtmlAttribute(
                  config.successColor ||
                  "#22c55e"
                )}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>ANIMACIÓN DE ÉXITO</span>

            <select id="verifySuccessAnimation">
              <option value="check">
                Confirmación
              </option>

              <option value="confetti">
                Confeti
              </option>

              <option value="none">
                Sin animación
              </option>
            </select>
          </label>

          ${createToggle(
            "verifyShowCountdown",
            "Mostrar cuenta regresiva",
            "Muestra los segundos antes de cerrar o redirigir.",
            config.showCountdown !== false
          )}

          ${createToggle(
            "verifyClosePageEnabled",
            "Cerrar página automáticamente",
            "Intenta cerrar la página al finalizar.",
            Boolean(config.closePageEnabled)
          )}

        </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA
          </span>

          <div class="configuration-success-preview">
            <div
              class="configuration-success-icon"
              id="successPreviewIcon"
            >
              ✓
            </div>

            <strong id="successPreviewTitle">
              ${
                escapeHtml(
                  config.successTitle ||
                  "Verificación completada"
                )
              }
            </strong>

            <p id="successPreviewMessage">${
              escapeHtml(
                config.successMessage ||
                `Tu cuenta fue verificada correctamente.

¡Bienvenido al servidor!

Ya podés acceder a todos los canales.`
              )
            }</p>

            <small>
              Redirigiendo en 3 segundos...
            </small>

            <div class="configuration-progress-track">
              <span></span>
            </div>
          </div>
        </div>

      </div>
    </article>

    <!-- ===================================================
         3. MENSAJE PRIVADO DESPUÉS DE VERIFICAR
         =================================================== -->

    <article class="section-panel configuration-flow-card">
      <div class="configuration-flow-header">
        <div class="configuration-flow-title-row">
          <div>
            <h3>
              3. Mensaje privado (MD)
            </h3>

            <p>
              Este mensaje se enviará por privado al usuario
              después de verificar correctamente su cuenta.
            </p>
          </div>

          <span class="configuration-condition-badge">
            OPCIONAL
          </span>
        </div>
      </div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          ${createToggle(
            "verifySuccessDmEnabled",
            "Enviar mensaje privado",
            "Envía un MD cuando el usuario completa la verificación.",
            Boolean(config.successDmEnabled)
          )}

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifySuccessDmTitle"
              maxlength="256"
              value="${escapeHtmlAttribute(
                config.successDmTitle ||
                "🎉 ¡Verificado!"
              )}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessDmMessage"
              rows="7"
              maxlength="2000"
            >${escapeHtml(
              config.successDmMessage ||
              `¡Hola {usuario}! 🎉

Tu cuenta fue verificada correctamente en {servidor}.

Gracias por formar parte de nuestra comunidad.`
            )}</textarea>
          </label>

          <div class="configuration-variable-help">
            <span>Variables disponibles:</span>

            <code>{usuario}</code>
            <code>{servidor}</code>
            <code>{rol}</code>
            <code>{fecha}</code>
            <code>{hora}</code>
          </div>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR DEL EMBED</span>

            <div class="welcome-color-row">
              <input
                id="verifySuccessDmColor"
                type="color"
                value="${
                  config.successDmColor ||
                  "#3b82f6"
                }"
              >

              <input
                id="verifySuccessDmColorText"
                maxlength="7"
                value="${escapeHtmlAttribute(
                  config.successDmColor ||
                  "#3b82f6"
                )}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>THUMBNAIL OPCIONAL</span>

            <input
              id="verifySuccessDmThumbnail"
              placeholder="https://i.imgur.com/imagen.png"
              value="${escapeHtmlAttribute(
                config.successDmThumbnail ||
                ""
              )}"
            >
          </label>

        </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA DEL MD
          </span>

          <div class="configuration-discord-preview">
            <div
              class="configuration-preview-embed"
              id="successDmPreviewEmbed"
              style="--preview-color:${
                config.successDmColor ||
                "#3b82f6"
              };"
            >
              <div class="configuration-dm-preview-head">
                <div>
                  <strong id="successDmPreviewTitle">
                    ${
                      escapeHtml(
                        config.successDmTitle ||
                        "🎉 ¡Verificado!"
                      )
                    }
                  </strong>

                  <p id="successDmPreviewMessage">${
                    escapeHtml(
                      config.successDmMessage ||
                      `¡Hola Usuario! 🎉

Tu cuenta fue verificada correctamente en el servidor.

Gracias por formar parte de nuestra comunidad.`
                    )
                  }</p>
                </div>

                <img
                  id="successDmPreviewThumbnail"
                  class="configuration-preview-thumbnail"
                  src="${escapeHtmlAttribute(
                    config.successDmThumbnail ||
                    ""
                  )}"
                  alt=""
                  ${
                    config.successDmThumbnail
                      ? ""
                      : 'style="display:none;"'
                  }
                >
              </div>
            </div>
          </div>
        </div>

      </div>
    </article>

  </div>
</section>
      </div>

      <div
  class="variables-modal"
  id="variablesModal"
  aria-hidden="true"
>
  <div
    class="variables-modal-backdrop"
    data-close-variables
  ></div>

  <section
    class="variables-modal-dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="variablesModalTitle"
  >
    <header class="variables-modal-header">
      <div>
        <span>
          VARIABLES DISPONIBLES
        </span>

        <h2 id="variablesModalTitle">
          Textos dinámicos
        </h2>

        <p>
          Presioná una variable para copiarla.
        </p>
      </div>

      <button
        class="variables-modal-close"
        data-close-variables
        type="button"
        aria-label="Cerrar variables"
      >
        ×
      </button>
    </header>

    <div class="variables-modal-search">
      <span>⌕</span>

      <input
        id="variablesSearch"
        type="search"
        placeholder="Buscar una variable..."
        autocomplete="off"
      >
    </div>

<div class="variables-modal-content">

  <aside class="variables-categories">

    <button
      type="button"
      class="variables-category active"
      data-variable-category="user"
    >
      <span>👤</span>
      Usuario
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="server"
    >
      <span>🌍</span>
      Servidor
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="roles"
    >
      <span>🛡️</span>
      Roles
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="channel"
    >
      <span>📢</span>
      Canal
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="bot"
    >
      <span>🤖</span>
      Bot
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="date"
    >
      <span>📅</span>
      Fecha y hora
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="verification"
    >
      <span>✅</span>
      Verificación
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="tickets"
    >
      <span>🎫</span>
      Tickets
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="moderation"
    >
      <span>👮</span>
      Moderación
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="web"
    >
      <span>🌐</span>
      Web
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="messages"
    >
      <span>💬</span>
      Mensajes
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="invites"
    >
      <span>🎉</span>
      Invitaciones
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="emojis"
    >
      <span>😀</span>
      Emojis
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="system"
    >
      <span>⚙️</span>
      Sistema
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="stats"
    >
      <span>📊</span>
      Estadísticas
    </button>

  </aside>

  <section class="variables-results">

    <div
      class="variables-modal-list"
      id="variablesModalList"
    >
    </div>

  </section>

</div>

<div
  class="variables-modal-empty"
  id="variablesModalEmpty"
  hidden
>
  No se encontraron variables.
</div>

<footer class="variables-modal-footer">

  <span>
    Después de copiar, pegala usando
    <kbd>Ctrl</kbd> + <kbd>V</kbd>
  </span>

  <button
    data-close-variables
    type="button"
  >
    Cerrar
  </button>
</footer>

  </section>
</div>

      <div class="verify-sticky-actions">

         <button
          id="sendVerificationPanel"
          class="welcome-test-button"
          type="button"
        >
          Enviar panel a Discord
        </button>

        <button
          id="saveVerification"
          class="welcome-save-button"
          type="button"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  `;


/* =========================================================
   TARJETAS DE SEGURIDAD — ESTADOS Y CONTADOR
   ========================================================= */

const updateVerificationSecurityCards = () => {
  const securityCards =
    document.querySelectorAll(
      ".verify-security-card"
    );

  const securityCounter =
    document.getElementById(
      "verifySecurityActiveCount"
    );

  const updateSecurityCounter = () => {
    const activeRules =
      document.querySelectorAll(
        '.verify-security-switch input[type="checkbox"]:checked'
      ).length;

    if (securityCounter) {
      securityCounter.textContent =
        String(activeRules);
    }
  };

  securityCards.forEach(card => {
    const checkbox =
      card.querySelector(
        '.verify-security-switch input[type="checkbox"]'
      );

    const statusText =
      card.querySelector(
        ".verify-security-status-text"
      );

    if (!checkbox) {
      return;
    }

    const updateCardStatus = () => {
      const isActive =
        checkbox.checked;

      card.classList.toggle(
        "is-active",
        isActive
      );

      if (statusText) {
        statusText.textContent =
          isActive
            ? "Protección activada"
            : "Protección desactivada";
      }
    };

    checkbox.addEventListener(
      "change",
      () => {
        updateCardStatus();
        updateSecurityCounter();
      }
    );

    updateCardStatus();
  });

  updateSecurityCounter();
};

updateVerificationSecurityCards();

  const getElement =
    id => document.getElementById(id);
async function copiarVariable(
  variable,
  button
) {
  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        variable
      );
    } else {
      const temporaryInput =
        document.createElement(
          "textarea"
        );

      temporaryInput.value =
        variable;

      temporaryInput.setAttribute(
        "readonly",
        ""
      );

      temporaryInput.style.position =
        "fixed";

      temporaryInput.style.opacity =
        "0";

      document.body.appendChild(
        temporaryInput
      );

      temporaryInput.select();

      const copied =
        document.execCommand(
          "copy"
        );

      temporaryInput.remove();

      if (!copied) {
        throw new Error(
          "No se pudo copiar."
        );
      }
    }

    const buttonText =
      button.querySelector("b");

    button.classList.add(
      "copied"
    );

    if (buttonText) {
      buttonText.textContent =
        "Copiado ✓";
    }

    showMessage(
      "Variable copiada",
      `${variable} se copió correctamente.`
    );

    setTimeout(
      () => {
        button.classList.remove(
          "copied"
        );

        if (buttonText) {
          buttonText.textContent =
            "Copiar";
        }
      },
      1500
    );
  } catch (error) {
    console.error(
      "Error copiando variable:",
      error
    );

    showMessage(
      "No se pudo copiar",
      `Copiá manualmente ${variable}.`
    );
  }
}

const verificationVariables = [
  /* =========================
     USUARIO
     ========================= */
  {
    category: "user",
    key: "{user}",
    label: "Nombre del usuario",
  },
  {
    category: "user",
    key: "{username}",
    label: "Nombre de usuario",
  },
  {
    category: "user",
    key: "{displayname}",
    label: "Nombre visible",
  },
  {
    category: "user",
    key: "{globalname}",
    label: "Nombre global",
  },
  {
    category: "user",
    key: "{nickname}",
    label: "Apodo en el servidor",
  },
  {
    category: "user",
    key: "{mention}",
    label: "Mención del usuario",
  },
  {
    category: "user",
    key: "{userid}",
    label: "ID del usuario",
  },
  {
    category: "user",
    key: "{avatar}",
    label: "Avatar del usuario",
  },
  {
    category: "user",
    key: "{banner}",
    label: "Banner del usuario",
  },
  {
    category: "user",
    key: "{created}",
    label: "Fecha de creación de la cuenta",
  },
  {
    category: "user",
    key: "{joined}",
    label: "Fecha de ingreso al servidor",
  },
  {
    category: "user",
    key: "{joinedrelative}",
    label: "Tiempo desde que ingresó",
  },
  {
    category: "user",
    key: "{status}",
    label: "Estado del usuario",
  },
  {
    category: "user",
    key: "{activity}",
    label: "Actividad actual",
  },
  {
    category: "user",
    key: "{roles}",
    label: "Roles del usuario",
  },
  {
    category: "user",
    key: "{rolecount}",
    label: "Cantidad de roles",
  },
  {
    category: "user",
    key: "{highestrole}",
    label: "Rol más alto",
  },
  {
    category: "user",
    key: "{permissions}",
    label: "Permisos del usuario",
  },
  {
    category: "user",
    key: "{boosting}",
    label: "Estado de boost",
  },

  /* =========================
     SERVIDOR
     ========================= */
  {
    category: "server",
    key: "{server}",
    label: "Nombre del servidor",
  },
  {
    category: "server",
    key: "{serverid}",
    label: "ID del servidor",
  },
  {
    category: "server",
    key: "{servericon}",
    label: "Icono del servidor",
  },
  {
    category: "server",
    key: "{serverbanner}",
    label: "Banner del servidor",
  },
  {
    category: "server",
    key: "{serverdescription}",
    label: "Descripción del servidor",
  },
  {
    category: "server",
    key: "{owner}",
    label: "Propietario del servidor",
  },
  {
    category: "server",
    key: "{ownerid}",
    label: "ID del propietario",
  },
  {
    category: "server",
    key: "{membercount}",
    label: "Cantidad de miembros",
  },
  {
    category: "server",
    key: "{members}",
    label: "Cantidad de miembros",
  },
  {
    category: "server",
    key: "{bots}",
    label: "Cantidad de bots",
  },
  {
    category: "server",
    key: "{humans}",
    label: "Cantidad de usuarios reales",
  },
  {
    category: "server",
    key: "{online}",
    label: "Miembros conectados",
  },
  {
    category: "server",
    key: "{offline}",
    label: "Miembros desconectados",
  },
  {
    category: "server",
    key: "{boosts}",
    label: "Cantidad de boosts",
  },
  {
    category: "server",
    key: "{boostlevel}",
    label: "Nivel de boost",
  },
  {
    category: "server",
    key: "{verificationlevel}",
    label: "Nivel de verificación",
  },
  {
    category: "server",
    key: "{channels}",
    label: "Cantidad de canales",
  },
  {
    category: "server",
    key: "{textchannels}",
    label: "Canales de texto",
  },
  {
    category: "server",
    key: "{voicechannels}",
    label: "Canales de voz",
  },
  {
    category: "server",
    key: "{categories}",
    label: "Cantidad de categorías",
  },
  {
    category: "server",
    key: "{rolescount}",
    label: "Cantidad de roles",
  },
  {
    category: "server",
    key: "{emojis}",
    label: "Cantidad de emojis",
  },
  {
    category: "server",
    key: "{stickers}",
    label: "Cantidad de stickers",
  },
  {
    category: "server",
    key: "{createdserver}",
    label: "Fecha de creación del servidor",
  },

  /* =========================
     ROLES
     ========================= */
  {
    category: "roles",
    key: "{role}",
    label: "Nombre del rol entregado",
  },
  {
    category: "roles",
    key: "{roleid}",
    label: "ID del rol entregado",
  },
  {
    category: "roles",
    key: "{rolename}",
    label: "Nombre del rol",
  },
  {
    category: "roles",
    key: "{rolecolor}",
    label: "Color del rol",
  },
  {
    category: "roles",
    key: "{roleicon}",
    label: "Icono del rol",
  },
  {
    category: "roles",
    key: "{highestrole}",
    label: "Rol más alto",
  },
  {
    category: "roles",
    key: "{lowestrole}",
    label: "Rol más bajo",
  },
  {
    category: "roles",
    key: "{autorole}",
    label: "Rol automático",
  },

  /* =========================
     CANAL
     ========================= */
  {
    category: "channel",
    key: "{channel}",
    label: "Canal actual",
  },
  {
    category: "channel",
    key: "{channelid}",
    label: "ID del canal",
  },
  {
    category: "channel",
    key: "{channelmention}",
    label: "Mención del canal",
  },
  {
    category: "channel",
    key: "{channeltopic}",
    label: "Tema del canal",
  },
  {
    category: "channel",
    key: "{category}",
    label: "Categoría del canal",
  },
  {
    category: "channel",
    key: "{categoryid}",
    label: "ID de la categoría",
  },
  {
    category: "channel",
    key: "{thread}",
    label: "Nombre del hilo",
  },
  {
    category: "channel",
    key: "{threadid}",
    label: "ID del hilo",
  },
  {
    category: "channel",
    key: "{slowmode}",
    label: "Modo lento",
  },
  {
    category: "channel",
    key: "{channeltype}",
    label: "Tipo de canal",
  },

  /* =========================
     BOT
     ========================= */
  {
    category: "bot",
    key: "{bot}",
    label: "Nombre del bot",
  },
  {
    category: "bot",
    key: "{botid}",
    label: "ID del bot",
  },
  {
    category: "bot",
    key: "{botavatar}",
    label: "Avatar del bot",
  },
  {
    category: "bot",
    key: "{botversion}",
    label: "Versión del bot",
  },
  {
    category: "bot",
    key: "{latency}",
    label: "Latencia del bot",
  },
  {
    category: "bot",
    key: "{ping}",
    label: "Ping del bot",
  },
  {
    category: "bot",
    key: "{uptime}",
    label: "Tiempo activo",
  },
  {
    category: "bot",
    key: "{commands}",
    label: "Cantidad de comandos",
  },
  {
    category: "bot",
    key: "{servers}",
    label: "Cantidad de servidores",
  },
  {
    category: "bot",
    key: "{users}",
    label: "Cantidad de usuarios",
  },
  {
    category: "bot",
    key: "{memory}",
    label: "Memoria usada",
  },
  {
    category: "bot",
    key: "{cpu}",
    label: "Uso del procesador",
  },
  {
    category: "bot",
    key: "{node}",
    label: "Versión de Node.js",
  },
  {
    category: "bot",
    key: "{library}",
    label: "Librería utilizada",
  },

  /* =========================
     FECHA Y HORA
     ========================= */
  {
    category: "date",
    key: "{date}",
    label: "Fecha actual",
  },
  {
    category: "date",
    key: "{time}",
    label: "Hora actual",
  },
  {
    category: "date",
    key: "{datetime}",
    label: "Fecha y hora actual",
  },
  {
    category: "date",
    key: "{timestamp}",
    label: "Marca de tiempo",
  },
  {
    category: "date",
    key: "{year}",
    label: "Año actual",
  },
  {
    category: "date",
    key: "{month}",
    label: "Número del mes",
  },
  {
    category: "date",
    key: "{monthname}",
    label: "Nombre del mes",
  },
  {
    category: "date",
    key: "{day}",
    label: "Día actual",
  },
  {
    category: "date",
    key: "{weekday}",
    label: "Día de la semana",
  },
  {
    category: "date",
    key: "{hour}",
    label: "Hora",
  },
  {
    category: "date",
    key: "{minute}",
    label: "Minuto",
  },
  {
    category: "date",
    key: "{second}",
    label: "Segundo",
  },
  {
    category: "date",
    key: "{timezone}",
    label: "Zona horaria",
  },
  {
    category: "date",
    key: "{unix}",
    label: "Tiempo Unix",
  },
  {
    category: "date",
    key: "{shortdate}",
    label: "Fecha corta",
  },
  {
    category: "date",
    key: "{longdate}",
    label: "Fecha completa",
  },

  /* =========================
     VERIFICACIÓN
     ========================= */
  {
    category: "verification",
    key: "{verifylink}",
    label: "Enlace de verificación",
  },
  {
    category: "verification",
    key: "{verificationcode}",
    label: "Código de verificación",
  },
  {
    category: "verification",
    key: "{verificationid}",
    label: "ID de verificación",
  },
  {
    category: "verification",
    key: "{verificationmethod}",
    label: "Método de verificación",
  },
  {
    category: "verification",
    key: "{verificationrole}",
    label: "Rol de verificación",
  },
  {
    category: "verification",
    key: "{verificationchannel}",
    label: "Canal de verificación",
  },
  {
    category: "verification",
    key: "{verificationtime}",
    label: "Hora de verificación",
  },
  {
    category: "verification",
    key: "{verificationdate}",
    label: "Fecha de verificación",
  },
  {
    category: "verification",
    key: "{verifyexpires}",
    label: "Vencimiento del enlace",
  },
  {
    category: "verification",
    key: "{verified}",
    label: "Estado de verificación",
  },
  {
    category: "verification",
    key: "{verifybrowser}",
    label: "Navegador utilizado",
  },
  {
    category: "verification",
    key: "{verifyos}",
    label: "Sistema operativo",
  },
  {
    category: "verification",
    key: "{verifydevice}",
    label: "Dispositivo utilizado",
  },
  {
    category: "verification",
    key: "{verifycountry}",
    label: "País aproximado",
  },
  {
    category: "verification",
    key: "{verifycity}",
    label: "Ciudad aproximada",
  },
  {
    category: "verification",
    key: "{verifylanguage}",
    label: "Idioma del navegador",
  },
  {
    category: "verification",
    key: "{verifyisp}",
    label: "Proveedor de internet",
  },

  /* =========================
     TICKETS
     ========================= */
  {
    category: "tickets",
    key: "{ticket}",
    label: "Nombre del ticket",
  },
  {
    category: "tickets",
    key: "{ticketid}",
    label: "ID del ticket",
  },
  {
    category: "tickets",
    key: "{ticketnumber}",
    label: "Número del ticket",
  },
  {
    category: "tickets",
    key: "{ticketowner}",
    label: "Creador del ticket",
  },
  {
    category: "tickets",
    key: "{ticketownerid}",
    label: "ID del creador",
  },
  {
    category: "tickets",
    key: "{ticketcategory}",
    label: "Categoría del ticket",
  },
  {
    category: "tickets",
    key: "{ticketreason}",
    label: "Motivo del ticket",
  },
  {
    category: "tickets",
    key: "{ticketcreated}",
    label: "Fecha de creación",
  },
  {
    category: "tickets",
    key: "{ticketclosed}",
    label: "Fecha de cierre",
  },
  {
    category: "tickets",
    key: "{ticketclosedby}",
    label: "Cerrado por",
  },
  {
    category: "tickets",
    key: "{ticketmessages}",
    label: "Cantidad de mensajes",
  },
  {
    category: "tickets",
    key: "{ticketclaim}",
    label: "Miembro del staff asignado",
  },
  {
    category: "tickets",
    key: "{ticketpriority}",
    label: "Prioridad",
  },
  {
    category: "tickets",
    key: "{ticketstatus}",
    label: "Estado del ticket",
  },

  /* =========================
     MODERACIÓN
     ========================= */
  {
    category: "moderation",
    key: "{moderator}",
    label: "Moderador responsable",
  },
  {
    category: "moderation",
    key: "{moderatorid}",
    label: "ID del moderador",
  },
  {
    category: "moderation",
    key: "{reason}",
    label: "Motivo",
  },
  {
    category: "moderation",
    key: "{duration}",
    label: "Duración",
  },
  {
    category: "moderation",
    key: "{case}",
    label: "Número de caso",
  },
  {
    category: "moderation",
    key: "{warns}",
    label: "Cantidad de advertencias",
  },
  {
    category: "moderation",
    key: "{bans}",
    label: "Cantidad de baneos",
  },
  {
    category: "moderation",
    key: "{kicks}",
    label: "Cantidad de expulsiones",
  },
  {
    category: "moderation",
    key: "{timeouts}",
    label: "Cantidad de aislamientos",
  },
  {
    category: "moderation",
    key: "{punishment}",
    label: "Tipo de sanción",
  },
  {
    category: "moderation",
    key: "{appeal}",
    label: "Apelación",
  },
  {
    category: "moderation",
    key: "{appealid}",
    label: "ID de apelación",
  },
  {
    category: "moderation",
    key: "{appealstatus}",
    label: "Estado de apelación",
  },

  /* =========================
     WEB
     ========================= */
  {
    category: "web",
    key: "{ip}",
    label: "Dirección IP",
  },
  {
    category: "web",
    key: "{country}",
    label: "País aproximado",
  },
  {
    category: "web",
    key: "{city}",
    label: "Ciudad aproximada",
  },
  {
    category: "web",
    key: "{region}",
    label: "Región aproximada",
  },
  {
    category: "web",
    key: "{timezone}",
    label: "Zona horaria",
  },
  {
    category: "web",
    key: "{browser}",
    label: "Navegador",
  },
  {
    category: "web",
    key: "{browserversion}",
    label: "Versión del navegador",
  },
  {
    category: "web",
    key: "{os}",
    label: "Sistema operativo",
  },
  {
    category: "web",
    key: "{osversion}",
    label: "Versión del sistema",
  },
  {
    category: "web",
    key: "{device}",
    label: "Dispositivo",
  },
  {
    category: "web",
    key: "{platform}",
    label: "Plataforma",
  },
  {
    category: "web",
    key: "{language}",
    label: "Idioma",
  },
  {
    category: "web",
    key: "{resolution}",
    label: "Resolución de pantalla",
  },
  {
    category: "web",
    key: "{isp}",
    label: "Proveedor de internet",
  },

  /* =========================
     MENSAJES
     ========================= */
  {
    category: "messages",
    key: "{message}",
    label: "Contenido del mensaje",
  },
  {
    category: "messages",
    key: "{messageid}",
    label: "ID del mensaje",
  },
  {
    category: "messages",
    key: "{author}",
    label: "Autor del mensaje",
  },
  {
    category: "messages",
    key: "{authorid}",
    label: "ID del autor",
  },
  {
    category: "messages",
    key: "{reply}",
    label: "Mensaje respondido",
  },
  {
    category: "messages",
    key: "{attachments}",
    label: "Cantidad de archivos",
  },
  {
    category: "messages",
    key: "{embeds}",
    label: "Cantidad de embeds",
  },
  {
    category: "messages",
    key: "{mentions}",
    label: "Menciones",
  },
  {
    category: "messages",
    key: "{wordcount}",
    label: "Cantidad de palabras",
  },
  {
    category: "messages",
    key: "{characters}",
    label: "Cantidad de caracteres",
  },
  {
    category: "messages",
    key: "{lines}",
    label: "Cantidad de líneas",
  },
  {
    category: "messages",
    key: "{jumpurl}",
    label: "Enlace al mensaje",
  },

  /* =========================
     INVITACIONES
     ========================= */
  {
    category: "invites",
    key: "{invite}",
    label: "Enlace de invitación",
  },
  {
    category: "invites",
    key: "{invitecode}",
    label: "Código de invitación",
  },
  {
    category: "invites",
    key: "{inviter}",
    label: "Creador de la invitación",
  },
  {
    category: "invites",
    key: "{inviterid}",
    label: "ID del creador",
  },
  {
    category: "invites",
    key: "{uses}",
    label: "Cantidad de usos",
  },
  {
    category: "invites",
    key: "{maxuses}",
    label: "Máximo de usos",
  },
  {
    category: "invites",
    key: "{expires}",
    label: "Fecha de vencimiento",
  },
  {
    category: "invites",
    key: "{temporary}",
    label: "Invitación temporal",
  },

  /* =========================
     EMOJIS
     ========================= */
  {
    category: "emojis",
    key: "{emoji}",
    label: "Emoji",
  },
  {
    category: "emojis",
    key: "{emojiid}",
    label: "ID del emoji",
  },
  {
    category: "emojis",
    key: "{emojiurl}",
    label: "URL del emoji",
  },
  {
    category: "emojis",
    key: "{success}",
    label: "Emoji de éxito",
  },
  {
    category: "emojis",
    key: "{error}",
    label: "Emoji de error",
  },
  {
    category: "emojis",
    key: "{warning}",
    label: "Emoji de advertencia",
  },
  {
    category: "emojis",
    key: "{info}",
    label: "Emoji de información",
  },

  /* =========================
     SISTEMA
     ========================= */
  {
    category: "system",
    key: "{newline}",
    label: "Salto de línea",
  },
  {
    category: "system",
    key: "{space}",
    label: "Espacio",
  },
  {
    category: "system",
    key: "{separator}",
    label: "Separador",
  },
  {
    category: "system",
    key: "{tab}",
    label: "Tabulación",
  },
  {
    category: "system",
    key: "{version}",
    label: "Versión",
  },
  {
    category: "system",
    key: "{dashboardversion}",
    label: "Versión del dashboard",
  },
  {
    category: "system",
    key: "{build}",
    label: "Versión de compilación",
  },
  {
    category: "system",
    key: "{environment}",
    label: "Entorno",
  },
  {
    category: "system",
    key: "{random}",
    label: "Texto aleatorio",
  },
  {
    category: "system",
    key: "{randomnumber}",
    label: "Número aleatorio",
  },
  {
    category: "system",
    key: "{randomcolor}",
    label: "Color aleatorio",
  },
  {
    category: "system",
    key: "{uuid}",
    label: "Identificador único",
  },
  {
    category: "system",
    key: "{domain}",
    label: "Dominio del dashboard",
  },
  {
    category: "system",
    key: "{url}",
    label: "URL actual",
  },

  /* =========================
     ESTADÍSTICAS
     ========================= */
  {
    category: "stats",
    key: "{totalusers}",
    label: "Usuarios totales",
  },
  {
    category: "stats",
    key: "{totalservers}",
    label: "Servidores totales",
  },
  {
    category: "stats",
    key: "{totalchannels}",
    label: "Canales totales",
  },
  {
    category: "stats",
    key: "{totalroles}",
    label: "Roles totales",
  },
  {
    category: "stats",
    key: "{totalbots}",
    label: "Bots totales",
  },
  {
    category: "stats",
    key: "{verificationstoday}",
    label: "Verificaciones de hoy",
  },
  {
    category: "stats",
    key: "{verificationstotal}",
    label: "Verificaciones totales",
  },
  {
    category: "stats",
    key: "{ticketsopen}",
    label: "Tickets abiertos",
  },
  {
    category: "stats",
    key: "{ticketsclosed}",
    label: "Tickets cerrados",
  },
  {
    category: "stats",
    key: "{commandsused}",
    label: "Comandos utilizados",
  },
  {
    category: "stats",
    key: "{joins}",
    label: "Ingresos",
  },
  {
    category: "stats",
    key: "{leaves}",
    label: "Salidas",
  },
  {
    category: "stats",
    key: "{uptimepercent}",
    label: "Porcentaje de actividad",
  },
];

const variablesModal =
  getElement(
    "variablesModal"
  );

const variablesSearch =
  getElement(
    "variablesSearch"
  );

const variablesModalEmpty =
  getElement(
    "variablesModalEmpty"
  );

const variablesModalList =
  getElement(
    "variablesModalList"
  );

const variableCategoryButtons =
  document.querySelectorAll(
    "[data-variable-category]"
  );

let activeVariableCategory =
  "user";

function renderVariablesModal() {
  if (!variablesModalList) {
    return;
  }

  const search =
    String(
      variablesSearch?.value ||
      ""
    )
      .trim()
      .toLowerCase();

  const filteredVariables =
    verificationVariables.filter(
      variable => {
        const sameCategory =
          variable.category ===
          activeVariableCategory;

        const searchText =
          `${variable.key} ${variable.label}`
            .toLowerCase();

        const matchesSearch =
          !search ||
          searchText.includes(
            search
          );

        return (
          sameCategory &&
          matchesSearch
        );
      }
    );

  variablesModalList.innerHTML =
    filteredVariables
      .map(variable => `
        <button
          class="verify-variable-button"
          data-copy-variable="${escapeHtmlAttribute(
            variable.key
          )}"
          data-variable-search="${escapeHtmlAttribute(
            `${variable.key} ${variable.label}`
          )}"
          type="button"
        >
          <code>
            ${escapeHtml(variable.key)}
          </code>

          <span>
            ${escapeHtml(variable.label)}
          </span>

          <b>
            Copiar
          </b>
        </button>
      `)
      .join("");

  const hasResults =
    filteredVariables.length > 0;

  if (variablesModalEmpty) {
    variablesModalEmpty.hidden =
      hasResults;

    variablesModalEmpty.classList.toggle(
      "visible",
      !hasResults
    );
  }
}

function filtrarVariables(value) {
  if (variablesSearch) {
    variablesSearch.value =
      String(value || "");
  }

  renderVariablesModal();
}

variableCategoryButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        activeVariableCategory =
          button.dataset
            .variableCategory ||
          "user";

        variableCategoryButtons.forEach(
          categoryButton => {
            categoryButton.classList.toggle(
              "active",
              categoryButton ===
                button
            );
          }
        );

        renderVariablesModal();
      }
    );
  }
);

variablesModalList?.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest(
        "[data-copy-variable]"
      );

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    copiarVariable(
      button.dataset.copyVariable,
      button
    );
  }
);

renderVariablesModal();

/* Evita que la rueda del mouse desplace la página del fondo */
variablesModal?.addEventListener(
  "wheel",
  event => {
    const scrollArea =
      event.target.closest(
        ".variables-categories, .variables-results"
      );

    if (!scrollArea) {
      event.preventDefault();
      return;
    }

    const scrollingUp =
      event.deltaY < 0;

    const scrollingDown =
      event.deltaY > 0;

    const atTop =
      scrollArea.scrollTop <= 0;

    const atBottom =
      Math.ceil(
        scrollArea.scrollTop +
        scrollArea.clientHeight
      ) >= scrollArea.scrollHeight;

    if (
      (scrollingUp && atTop) ||
      (scrollingDown && atBottom)
    ) {
      event.preventDefault();
    }
  },
  {
    passive: false,
  }
);

function abrirVariablesModal() {
  if (!variablesModal) {
    return;
  }

  variablesModal.classList.add(
    "open"
  );

  variablesModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "variables-modal-open"
  );

 if (variablesSearch) {
  variablesSearch.value = "";
}

activeVariableCategory =
  "user";

variableCategoryButtons.forEach(
  button => {
    button.classList.toggle(
      "active",
      button.dataset
        .variableCategory ===
        "user"
    );
  }
);

renderVariablesModal();

if (variablesSearch) {

    setTimeout(
      () => {
        variablesSearch.focus();
      },
      150
    );
  }
}

function cerrarVariablesModal() {
  if (!variablesModal) {
    return;
  }

  variablesModal.classList.remove(
    "open"
  );

  variablesModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "variables-modal-open"
  );
}

document
  .querySelectorAll(
    "[data-open-variables]"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        abrirVariablesModal();
      }
    );
  });

document
  .querySelectorAll(
    "[data-close-variables]"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        cerrarVariablesModal();
      }
    );
  });

document
  .querySelectorAll(
    "[data-copy-variable]"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        copiarVariable(
          button.dataset.copyVariable,
          button
        );
      }
    );
  });

variablesSearch
  ?.addEventListener(
    "input",
    event => {
      filtrarVariables(
        event.target.value
      );
    }
  );

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      variablesModal?.classList.contains(
        "open"
      )
    ) {
      cerrarVariablesModal();
    }
  }
);

  const showMessage = (
    title,
    message
  ) => {
    toast.querySelector(
      "strong"
    ).textContent = title;

    toast.querySelector(
      "p"
    ).textContent = message;

    showToast();
  };

document
  .querySelectorAll(
    "[data-copy-variable]"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        const variable =
          button.dataset
            .copyVariable;

        if (!variable) {
          return;
        }

        copiarVariable(
          variable,
          button
        );
      }
    );
  });

  const getSelectedMethod = () =>
    document.querySelector(
      'input[name="verificationMethod"]:checked'
    )?.value || "oauth_link";

  const getLogOptions = () => {
    const options = {};

    Object.keys(currentLogOptions).forEach(
      key => {
        options[key] = Boolean(
          getElement(`verifyLog_${key}`)
            ?.checked
        );
      }
    );

    return options;
  };

const replacePanelVariables = value => {
  return resolvePreviewVariables(
    value
  );
};

const updateDiscordPanelPreview = () => {
  const title =
    getElement("verifyEmbedTitle");

  const description =
    getElement(
      "verifyEmbedDescription"
    );

  const color =
    getElement("verifyEmbedColor");

  const buttonText =
    getElement("verifyButtonText");

  const buttonEmoji =
    getElement("verifyButtonEmoji");

  const fieldName =
    getElement(
      "verifyEmbedFieldName"
    );

  const fieldValue =
    getElement(
      "verifyEmbedFieldValue"
    );

  const footerText =
    getElement(
      "verifyEmbedFooterText"
    );

  const thumbnailUrl =
    getElement(
      "verifyEmbedThumbnailUrl"
    );

  const imageUrl =
    getElement(
      "verifyEmbedImageUrl"
    );

  const previewEmbed =
    getElement(
      "verifyPreviewEmbed"
    );

  /*
    Si todavía no se construyó la vista
    previa, salimos sin romper la página.
  */

  if (!previewEmbed) {
    return;
  }

  const previewTitle =
    getElement(
      "verifyPreviewTitle"
    );

  const previewDescription =
    getElement(
      "verifyPreviewDescription"
    );

  const previewFieldName =
    getElement(
      "verifyPreviewFieldName"
    );

  const previewFieldValue =
    getElement(
      "verifyPreviewFieldValue"
    );

  const previewButtonText =
    getElement(
      "verifyPreviewButtonText"
    );

  const previewButtonEmoji =
    getElement(
      "verifyPreviewButtonEmoji"
    );

  const previewFooterText =
    getElement(
      "verifyPreviewFooterText"
    );

  const previewAuthor =
    getElement(
      "verifyPreviewAuthor"
    );

  const previewThumbnail =
    getElement(
      "verifyPreviewThumbnail"
    );

  const previewLargeImage =
    getElement(
      "verifyPreviewImage"
    );

  const previewTimestamp =
    getElement(
      "verifyPreviewTimestamp"
    );

  /*
    TEXTOS
  */

  if (previewTitle) {
    previewTitle.textContent =
      replacePanelVariables(
        title?.value ||
        "🔒 Verificación requerida"
      );
  }

  if (previewDescription) {
    previewDescription.textContent =
      replacePanelVariables(
        description?.value ||
        "Presioná el botón para verificarte."
      );
  }

  if (previewFieldName) {
    previewFieldName.textContent =
      replacePanelVariables(
        fieldName?.value ||
        "📌 Servidor"
      );
  }

  if (previewFieldValue) {
    previewFieldValue.textContent =
      replacePanelVariables(
        fieldValue?.value ||
        "{server}"
      );
  }

  if (previewButtonText) {
    previewButtonText.textContent =
      buttonText?.value ||
      "Verificar con Discord";
  }

  if (previewButtonEmoji) {
    previewButtonEmoji.textContent =
      buttonEmoji?.value || "";
  }

  if (previewFooterText) {
    previewFooterText.textContent =
      replacePanelVariables(
        footerText?.value ||
        "Nebula Security"
      );
  }

  /*
    COLOR DEL EMBED
  */

  previewEmbed.style.setProperty(
    "--preview-embed-color",
    color?.value ||
    "#8b5cf6"
  );

  /*
    AVATAR DEL BOT
  */

  if (previewAuthor) {
    previewAuthor.style.display =
      getElement(
        "verifyShowBotAvatar"
      )?.checked
        ? "flex"
        : "none";
  }

  /*
    MINIATURA
  */

  if (previewThumbnail) {
    const showCustomThumbnail =
      Boolean(
        getElement(
          "verifyShowCustomThumbnail"
        )?.checked
      );

    const showServerIcon =
      Boolean(
        getElement(
          "verifyShowServerIcon"
        )?.checked
      );

    if (
      showCustomThumbnail &&
      thumbnailUrl?.value
    ) {
      previewThumbnail.src =
        thumbnailUrl.value;

      previewThumbnail.style.display =
        "block";
    } else if (
      showServerIcon &&
      previewThumbnail.src
    ) {
      previewThumbnail.style.display =
        "block";
    } else {
      previewThumbnail.style.display =
        "none";
    }
  }

  /*
    IMAGEN GRANDE
  */

  if (previewLargeImage) {
    const showLargeImage =
      Boolean(
        getElement(
          "verifyShowEmbedImage"
        )?.checked
      );

    if (
      showLargeImage &&
      imageUrl?.value
    ) {
      previewLargeImage.src =
        imageUrl.value;

      previewLargeImage.style.display =
        "block";
    } else {
      previewLargeImage.style.display =
        "none";
    }
  }

  /*
    FECHA Y HORA
  */

  if (previewTimestamp) {
    previewTimestamp.style.display =
      getElement(
        "verifyShowTimestamp"
      )?.checked
        ? "inline"
        : "none";
  }
};

const actualizarVistaPreviaExito =
  () => {
    const titleInput =
      document.getElementById(
        "verifySuccessTitle"
      );

    const messageInput =
      document.getElementById(
        "verifySuccessMessage"
      );

    const colorInput =
      document.getElementById(
        "verifySuccessColor"
      );

    const animationInput =
      document.getElementById(
        "verifySuccessAnimation"
      );

    const countdownToggle =
      document.getElementById(
        "verifyShowCountdown"
      );

    const closePageToggle =
      document.getElementById(
        "verifyClosePageEnabled"
      );

    const preview =
      document.querySelector(
        ".configuration-success-preview"
      );

    const previewTitle =
      document.getElementById(
        "successPreviewTitle"
      );

    const previewMessage =
      document.getElementById(
        "successPreviewMessage"
      );

    const previewIcon =
      document.getElementById(
        "successPreviewIcon"
      );

    const countdownText =
      preview?.querySelector(
        "small"
      );

    const progressTrack =
      preview?.querySelector(
        ".configuration-progress-track"
      );

    if (
      !titleInput ||
      !messageInput ||
      !colorInput ||
      !preview ||
      !previewTitle ||
      !previewMessage ||
      !previewIcon
    ) {
      return;
    }

    const serverName =
      servidor?.name ||
      "servidor";

    previewTitle.textContent =
      titleInput.value.trim() ||
      "Verificación completada";

    previewMessage.textContent =
      (
        messageInput.value.trim() ||
        "Tu cuenta fue verificada correctamente."
      )
        .replaceAll(
          "{servidor}",
          serverName
        )
        .replaceAll(
          "{server}",
          serverName
        );

    const successColor =
      /^#[0-9a-f]{6}$/i.test(
        colorInput.value
      )
        ? colorInput.value
        : "#22c55e";

    preview.style.setProperty(
      "--success-color",
      successColor
    );

 previewIcon.style.setProperty(
  "background-color",
  successColor,
  "important"
);

previewIcon.style.setProperty(
  "border-color",
  successColor,
  "important"
);

previewIcon.style.setProperty(
  "box-shadow",
  `0 0 28px ${successColor}88`,
  "important"
);

previewIcon.style.color =
  "#ffffff";
const progressBar =
  preview.querySelector(
    ".configuration-progress-track span"
  );

if (progressBar) {
  progressBar.style.setProperty(
    "background-color",
    successColor,
    "important"
  );
}

    const animation =
      animationInput?.value ||
      "check";

    preview.dataset.animation =
      animation;

    if (animation === "none") {
      previewIcon.style.display =
        "none";
    } else {
      previewIcon.style.display =
        "grid";

      previewIcon.textContent =
        animation === "confetti"
          ? "🎉"
          : "✓";
    }

    const showCountdown =
      countdownToggle?.checked !==
      false;

    if (countdownText) {
      countdownText.style.display =
        showCountdown
          ? ""
          : "none";

      countdownText.textContent =
        closePageToggle?.checked
          ? "Cerrando en 3 segundos..."
          : "Redirigiendo en 3 segundos...";
    }

    if (progressTrack) {
      progressTrack.style.display =
        showCountdown
          ? ""
          : "none";
    }
  };

[
  "verifySuccessTitle",
  "verifySuccessMessage",
  "verifySuccessColor",
].forEach(id => {
  document
    .getElementById(id)
    ?.addEventListener(
      "input",
      actualizarVistaPreviaExito
    );
});

[
  "verifySuccessAnimation",
  "verifyShowCountdown",
  "verifyClosePageEnabled",
].forEach(id => {
  document
    .getElementById(id)
    ?.addEventListener(
      "change",
      actualizarVistaPreviaExito
    );
});

actualizarVistaPreviaExito();
/* =========================================================
   VISTA PREVIA EN TIEMPO REAL DEL MENSAJE PRIVADO
   ========================================================= */

const reemplazarVariablesVistaPreviaDm = texto => {
  return String(texto || "")
    .replaceAll(
      "{usuario}",
      "Usuario de ejemplo"
    )
.replaceAll(
  "{servidor}",
  "Servidor de ejemplo"
)

       .replaceAll(
      "{rol}",
      "✓ Verificado"
    )
    .replaceAll(
      "{fecha}",
      new Date().toLocaleDateString(
        "es-AR"
      )
    )
    .replaceAll(
      "{hora}",
      new Date().toLocaleTimeString(
        "es-AR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    );
};

const actualizarVistaPreviaDm = () => {
  const enabledInput =
    document.getElementById(
      "verifySuccessDmEnabled"
    );

  const titleInput =
    document.getElementById(
      "verifySuccessDmTitle"
    );

  const messageInput =
    document.getElementById(
      "verifySuccessDmMessage"
    );

  const colorInput =
    document.getElementById(
      "verifySuccessDmColor"
    );

  const colorTextInput =
    document.getElementById(
      "verifySuccessDmColorText"
    );

  const thumbnailInput =
    document.getElementById(
      "verifySuccessDmThumbnail"
    );

  const previewEmbed =
    document.getElementById(
      "successDmPreviewEmbed"
    );

  const previewTitle =
    document.getElementById(
      "successDmPreviewTitle"
    );

  const previewMessage =
    document.getElementById(
      "successDmPreviewMessage"
    );

  const previewThumbnail =
    document.getElementById(
      "successDmPreviewThumbnail"
    );

  if (
    !previewEmbed ||
    !previewTitle ||
    !previewMessage ||
    !previewThumbnail
  ) {
    return;
  }

  const title =
    titleInput?.value ||
    "🎉 ¡Verificado!";

  const message =
    messageInput?.value ||
    `¡Hola {usuario}! 🎉

Tu cuenta fue verificada correctamente en {servidor}.

Gracias por formar parte de nuestra comunidad.`;

  const color =
    colorInput?.value ||
    "#3b82f6";

  const thumbnail =
    String(
      thumbnailInput?.value ||
      ""
    ).trim();

  previewTitle.textContent =
    reemplazarVariablesVistaPreviaDm(
      title
    );

  previewMessage.textContent =
    reemplazarVariablesVistaPreviaDm(
      message
    );

  previewEmbed.style.setProperty(
    "--preview-color",
    color
  );

  if (colorTextInput) {
    colorTextInput.value =
      color;
  }

  if (
    thumbnail &&
    /^https?:\/\//i.test(
      thumbnail
    )
  ) {
    previewThumbnail.src =
      thumbnail;

    previewThumbnail.style.display =
      "";
  } else {
    previewThumbnail.removeAttribute(
      "src"
    );

    previewThumbnail.style.display =
      "none";
  }

  previewEmbed.style.opacity =
    enabledInput?.checked
      ? "1"
      : "0.45";
};

[
  "verifySuccessDmTitle",
  "verifySuccessDmMessage",
  "verifySuccessDmThumbnail",
].forEach(id => {
  document
    .getElementById(id)
    ?.addEventListener(
      "input",
      actualizarVistaPreviaDm
    );
});

document
  .getElementById(
    "verifySuccessDmEnabled"
  )
  ?.addEventListener(
    "change",
    actualizarVistaPreviaDm
  );

document
  .getElementById(
    "verifySuccessDmColor"
  )
  ?.addEventListener(
    "input",
    event => {
      const colorTextInput =
        document.getElementById(
          "verifySuccessDmColorText"
        );

      if (colorTextInput) {
        colorTextInput.value =
          event.target.value;
      }

      actualizarVistaPreviaDm();
    }
  );

document
  .getElementById(
    "verifySuccessDmColorText"
  )
  ?.addEventListener(
    "input",
    event => {
      const value =
        event.target.value.trim();

      if (
        /^#[0-9a-f]{6}$/i.test(
          value
        )
      ) {
        const colorInput =
          document.getElementById(
            "verifySuccessDmColor"
          );

        if (colorInput) {
          colorInput.value =
            value;
        }

        actualizarVistaPreviaDm();
      }
    }
  );

actualizarVistaPreviaDm();


  const buildPayload = () => ({
    enabled:
      getElement("verifyEnabled").checked,

    verificationChannelId:
      getElement("verifyChannel").value,

    logsChannelId:
      getElement("verifyLogs").value,

    verifiedRoleId:
      getElement("verifyRole").value,

    verificationMethod:
      getSelectedMethod(),

    embedTitle:
      getElement("verifyEmbedTitle").value,

    embedDescription:
      getElement(
        "verifyEmbedDescription"
      ).value,

    embedColor:
      getElement("verifyEmbedColor").value,

    buttonText:
      getElement("verifyButtonText").value,

    buttonEmoji:
      getElement("verifyButtonEmoji").value,

    reactionEmoji:
      getElement("verifyReactionEmoji").value,

interactionTitle:
  getElement(
    "verifyInteractionTitle"
  ).value,

interactionMessage:
  getElement(
    "verifyInteractionMessage"
  ).value,

interactionColor:
  getElement(
    "verifyInteractionColor"
  ).value,

interactionImage:
  getElement(
    "verifyInteractionImage"
  ).value,

interactionButtonEmoji:
  getElement(
    "verifyInteractionButtonEmoji"
  ).value,

interactionButtonText:
  getElement(
    "verifyInteractionButtonText"
  ).value,

successTitle:
  getElement(
    "verifySuccessTitle"
  ).value,

successMessage:
  getElement(
    "verifySuccessMessage"
  ).value,

successColor:
  getElement(
    "verifySuccessColor"
  ).value,

successAnimation:
  getElement(
    "verifySuccessAnimation"
  ).value,

showCountdown:
  getElement(
    "verifyShowCountdown"
  ).checked,

closePageEnabled:
  getElement(
    "verifyClosePageEnabled"
  ).checked,

successDmEnabled:
  getElement(
    "verifySuccessDmEnabled"
  ).checked,

successDmTitle:
  getElement(
    "verifySuccessDmTitle"
  ).value,

successDmMessage:
  getElement(
    "verifySuccessDmMessage"
  ).value,

successDmColor:
  getElement(
    "verifySuccessDmColor"
  ).value,

successDmThumbnail:
  getElement(
    "verifySuccessDmThumbnail"
  ).value,

embedFieldName:
  getElement(
    "verifyEmbedFieldName"
  ).value,

embedFieldValue:
  getElement(
    "verifyEmbedFieldValue"
  ).value,

embedFooterText:
  getElement(
    "verifyEmbedFooterText"
  ).value,

embedThumbnailUrl:
  getElement(
    "verifyEmbedThumbnailUrl"
  ).value,

embedImageUrl:
  getElement(
    "verifyEmbedImageUrl"
  ).value,

showBotAvatar:
  getElement(
    "verifyShowBotAvatar"
  ).checked,

showServerIcon:
  getElement(
    "verifyShowServerIcon"
  ).checked,

showCustomThumbnail:
  getElement(
    "verifyShowCustomThumbnail"
  ).checked,

showEmbedImage:
  getElement(
    "verifyShowEmbedImage"
  ).checked,

showTimestamp:
  getElement(
    "verifyShowTimestamp"
  ).checked,

    logEmbedTitle:
      getElement("verifyLogTitle").value,

    logEmbedDescription:
      getElement(
        "verifyLogDescription"
      ).value,

    logEmbedColor:
      getElement("verifyLogColor").value,

    logOptions:
      getLogOptions(),

webAppearance:
  obtenerAparienciaDesdeFormulario(),

    security: {
      detectVpn:
        getElement("verifyDetectVpn").checked,

      detectProxy:
        getElement(
          "verifyDetectProxy"
        ).checked,

      detectTor:
        getElement("verifyDetectTor").checked,

      blockHosting:
                     getElement("verifyBlockHosting").checked,

      detectAltAccounts:
        getElement(
          "verifyDetectAltAccounts"
        ).checked,

      minimumAccountAgeEnabled:
        getElement(
          "verifyMinimumAgeEnabled"
        ).checked,

      minimumAccountAgeDays:
        Number(
          getElement(
            "verifyMinimumAgeDays"
          ).value
        ),

      blockWithoutAvatar:
        getElement(
          "verifyBlockWithoutAvatar"
        ).checked,

      blockWithoutBanner:
        getElement(
          "verifyBlockWithoutBanner"
        ).checked,

      allowReverification:
        getElement(
          "verifyAllowReverification"
        ).checked,

      notifySecurityFailure:
        getElement(
          "verifyNotifySecurityFailure"
        ).checked,

detectVpnLogChannelId:
  getElement(
    "verifyDetectVpnLogChannel"
  ).value,

detectProxyLogChannelId:
  getElement(
    "verifyDetectProxyLogChannel"
  ).value,

detectTorLogChannelId:
  getElement(
    "verifyDetectTorLogChannel"
  ).value,

blockHostingLogChannelId:
  getElement(
    "verifyBlockHostingLogChannel"
  ).value,

detectAltAccountsLogChannelId:
  getElement(
    "verifyDetectAltAccountsLogChannel"
  ).value,

minimumAccountAgeLogChannelId:
  getElement(
    "verifyMinimumAgeLogChannel"
  ).value,

blockWithoutAvatarLogChannelId:
  getElement(
    "verifyBlockWithoutAvatarLogChannel"
  ).value,

blockWithoutBannerLogChannelId:
  getElement(
    "verifyBlockWithoutBannerLogChannel"
  ).value,

    },
  });

const panelPreviewInputIds = [
  "verifyEmbedTitle",
  "verifyEmbedDescription",
  "verifyEmbedColor",
  "verifyEmbedColorText",
  "verifyButtonText",
  "verifyButtonEmoji",
  "verifyEmbedFieldName",
  "verifyEmbedFieldValue",
  "verifyEmbedFooterText",
  "verifyEmbedThumbnailUrl",
  "verifyEmbedImageUrl",
  "verifyShowBotAvatar",
  "verifyShowServerIcon",
  "verifyShowCustomThumbnail",
  "verifyShowEmbedImage",
  "verifyShowTimestamp",
  "verifyRole",
  "verifyChannel",
];

panelPreviewInputIds.forEach(id => {
  const element =
    getElement(id);

  if (!element) {
    return;
  }

  const eventName =
    element.type === "checkbox"
      ? "change"
      : "input";

  element.addEventListener(
    eventName,
    updateDiscordPanelPreview
  );
});

getElement("verifyEmbedColor")
  ?.addEventListener(
    "input",
    event => {
      getElement(
        "verifyEmbedColorText"
      ).value =
        event.target.value;

      updateDiscordPanelPreview();
    }
  );

getElement("verifyEmbedColorText")
  ?.addEventListener(
    "input",
    event => {
      const value =
        event.target.value.trim();

      if (
        /^#[0-9a-f]{6}$/i.test(
          value
        )
      ) {
        getElement(
          "verifyEmbedColor"
        ).value =
          value;

        updateDiscordPanelPreview();
      }
    }
  );


updateDiscordPanelPreview();

/* =========================================================
   MOSTRAR U OCULTAR MENSAJE DEL BOTÓN DE INTERACCIÓN
   ========================================================= */

const interactionMessageConfiguration =
  getElement(
    "interactionMessageConfiguration"
  );

const verificationMethodInputs =
  document.querySelectorAll(
    'input[name="verificationMethod"]'
  );

function updateInteractionMessageVisibility() {
  const selectedMethod =
    document.querySelector(
      'input[name="verificationMethod"]:checked'
    )?.value || "oauth_link";

  if (!interactionMessageConfiguration) {
    return;
  }

  interactionMessageConfiguration.style.display =
    selectedMethod === "interaction_button"
      ? ""
      : "none";
}

verificationMethodInputs.forEach(input => {
  input.addEventListener(
    "change",
    updateInteractionMessageVisibility
  );
});

updateInteractionMessageVisibility();

/* =========================================================
   VISTA PREVIA — MENSAJE DEL BOTÓN DE INTERACCIÓN
   ========================================================= */

const interactionTitleInput =
  getElement("verifyInteractionTitle");

const interactionMessageInput =
  getElement("verifyInteractionMessage");

const interactionColorInput =
  getElement("verifyInteractionColor");

const interactionColorTextInput =
  getElement("verifyInteractionColorText");

const interactionImageInput =
  getElement("verifyInteractionImage");

const interactionButtonEmojiInput =
  getElement("verifyInteractionButtonEmoji");

const interactionButtonTextInput =
  getElement("verifyInteractionButtonText");

const interactionPreviewTitle =
  getElement("interactionPreviewTitle");

const interactionPreviewMessage =
  getElement("interactionPreviewMessage");

const interactionPreviewEmbed =
  getElement("interactionMessagePreviewEmbed");

const interactionPreviewImage =
  getElement("interactionPreviewImage");

const interactionPreviewButton =
  getElement("interactionPreviewButton");

function resolvePreviewVariables(text) {
  const now =
    new Date();

  const selectedRole =
    getElement("verifyRole")
      ?.selectedOptions?.[0]
      ?.textContent
      ?.trim() ||
    "Miembro verificado";

  const selectedChannel =
    getElement("verifyChannel")
      ?.selectedOptions?.[0]
      ?.textContent
      ?.trim() ||
    "#verificación";

  const serverName =
    servidor?.name ||
    "Servidor de ejemplo";

  const serverId =
    String(
      servidor?.id ||
      "123456789012345678"
    );

  const ownerId =
    String(
      servidor?.ownerId ||
      "123456789012345678"
    );

  const memberCount =
    Number(
      servidor?.memberCount ||
      servidor?.members ||
      1248
    ).toLocaleString(
      "es-AR"
    );

  const previewValues = {
    /* Alias anteriores */
    "{usuario}":
      "Usuario",
    "{servidor}":
      serverName,
    "{rol}":
      selectedRole,
    "{fecha}":
      now.toLocaleDateString(
        "es-AR"
      ),
    "{hora}":
      now.toLocaleTimeString(
        "es-AR",
        {
          hour:
            "2-digit",
          minute:
            "2-digit",
        }
      ),

    /* Usuario */
    "{user}":
      "Usuario",
    "{username}":
      "usuario",
    "{displayname}":
      "Usuario de ejemplo",
    "{globalname}":
      "Usuario de ejemplo",
    "{nickname}":
      "Usuario",
    "{mention}":
      "@Usuario",
    "{userid}":
      "123456789012345678",
    "{avatar}":
      "https://cdn.discordapp.com/avatar.png",
    "{banner}":
      "https://cdn.discordapp.com/banner.png",
    "{created}":
      "15/03/2024",
    "{joined}":
      "10/07/2026",
    "{joinedrelative}":
      "hace 7 días",
    "{status}":
      "En línea",
    "{activity}":
      "Usando Nebula",
    "{roles}":
      `${selectedRole}, Miembro`,
    "{rolecount}":
      "2",
    "{highestrole}":
      selectedRole,
    "{lowestrole}":
      "Miembro",
    "{permissions}":
      "Ver canales, enviar mensajes",
    "{boosting}":
      "No",

    /* Servidor */
    "{server}":
      serverName,
    "{serverid}":
      serverId,
    "{servericon}":
      servidor?.icon ||
      "Icono del servidor",
    "{serverbanner}":
      servidor?.banner ||
      "Banner del servidor",
    "{serverdescription}":
      servidor?.description ||
      "Comunidad protegida por Nebula",
    "{owner}":
      "Propietario",
    "{ownerid}":
      ownerId,
    "{membercount}":
      memberCount,
    "{members}":
      memberCount,
    "{bots}":
      "24",
    "{humans}":
      "1.224",
    "{online}":
      "386",
    "{offline}":
      "862",
    "{boosts}":
      "18",
    "{boostlevel}":
      "Nivel 2",
    "{verificationlevel}":
      "Medio",
    "{channels}":
      "48",
    "{textchannels}":
      "32",
    "{voicechannels}":
      "10",
    "{categories}":
      "6",
    "{rolescount}":
      "14",
    "{emojis}":
      "42",
    "{stickers}":
      "8",
    "{createdserver}":
      "20/05/2024",

    /* Roles */
    "{role}":
      selectedRole,
    "{roleid}":
      "123456789012345678",
    "{rolename}":
      selectedRole,
    "{rolecolor}":
      "#ffffff",
    "{roleicon}":
      "🛡️",
    "{autorole}":
      selectedRole,

    /* Canal */
    "{channel}":
      selectedChannel,
    "{channelid}":
      "123456789012345678",
    "{channelmention}":
      selectedChannel,
    "{channeltopic}":
      "Canal de verificación",
    "{category}":
      "INFORMACIÓN",
    "{categoryid}":
      "123456789012345678",
    "{thread}":
      "Hilo de ejemplo",
    "{threadid}":
      "123456789012345678",
    "{slowmode}":
      "Desactivado",
    "{channeltype}":
      "Canal de texto",

    /* Bot */
    "{bot}":
      "Nebula Bot",
    "{botid}":
      "123456789012345678",
    "{botavatar}":
      "Avatar de Nebula",
    "{botversion}":
      "2.0.0",
    "{latency}":
      "38 ms",
    "{ping}":
      "38 ms",
    "{uptime}":
      "30 días",
    "{commands}":
      "24",
    "{servers}":
      "12",
    "{users}":
      "8.745",
    "{memory}":
      "86 MB",
    "{cpu}":
      "2.3%",
    "{node}":
      "Node.js 22",
    "{library}":
      "Discord.js v14",

    /* Fecha */
    "{date}":
      now.toLocaleDateString(
        "es-AR"
      ),
    "{time}":
      now.toLocaleTimeString(
        "es-AR",
        {
          hour:
            "2-digit",
          minute:
            "2-digit",
        }
      ),
    "{datetime}":
      now.toLocaleString(
        "es-AR"
      ),
    "{timestamp}":
      String(
        now.getTime()
      ),
    "{year}":
      String(
        now.getFullYear()
      ),
    "{month}":
      String(
        now.getMonth() + 1
      ),
    "{monthname}":
      now.toLocaleDateString(
        "es-AR",
        {
          month:
            "long",
        }
      ),
    "{day}":
      String(
        now.getDate()
      ),
    "{weekday}":
      now.toLocaleDateString(
        "es-AR",
        {
          weekday:
            "long",
        }
      ),
    "{hour}":
      String(
        now.getHours()
      ).padStart(
        2,
        "0"
      ),
    "{minute}":
      String(
        now.getMinutes()
      ).padStart(
        2,
        "0"
      ),
    "{second}":
      String(
        now.getSeconds()
      ).padStart(
        2,
        "0"
      ),
    "{timezone}":
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone,
    "{unix}":
      String(
        Math.floor(
          now.getTime() /
          1000
        )
      ),
    "{shortdate}":
      now.toLocaleDateString(
        "es-AR"
      ),
    "{longdate}":
      now.toLocaleDateString(
        "es-AR",
        {
          weekday:
            "long",
          year:
            "numeric",
          month:
            "long",
          day:
            "numeric",
        }
      ),

    /* Verificación */
    "{verifylink}":
      `${window.location.origin}/verify`,
    "{verificationcode}":
      "NEBULA-4821",
    "{verificationid}":
      "VER-123456",
    "{verificationmethod}":
      "Botón de enlace",
    "{verificationrole}":
      selectedRole,
    "{verificationchannel}":
      selectedChannel,
    "{verificationtime}":
      now.toLocaleTimeString(
        "es-AR"
      ),
    "{verificationdate}":
      now.toLocaleDateString(
        "es-AR"
      ),
    "{verifyexpires}":
      "20 minutos",
    "{verified}":
      "Verificado",
    "{verifybrowser}":
      "Chrome",
    "{verifyos}":
      "Windows 11",
    "{verifydevice}":
      "Computadora",
    "{verifycountry}":
      "Argentina",
    "{verifycity}":
      "El Colorado",
    "{verifylanguage}":
      navigator.language ||
      "es-AR",
    "{verifyisp}":
      "Proveedor de internet",

    /* Sistema */
    "{newline}":
      "\n",
    "{space}":
      " ",
    "{separator}":
      "────────────",
    "{tab}":
      "    ",
    "{version}":
      "2.0.0",
    "{dashboardversion}":
      "2.0.0",
    "{build}":
      "Producción",
    "{environment}":
      "Dashboard",
    "{random}":
      "Nebula",
    "{randomnumber}":
      String(
        Math.floor(
          Math.random() *
          1000
        )
      ),
    "{randomcolor}":
      "#ffffff",
    "{uuid}":
      "550e8400-e29b-41d4-a716-446655440000",
    "{domain}":
      window.location.hostname,
    "{url}":
      window.location.href,
  };

  /*
    Garantiza que ninguna variable del
    catálogo quede escrita sin reemplazar.
  */

  verificationVariables.forEach(
    variable => {
      const normalizedKey =
        variable.key.toLowerCase();

      if (
        previewValues[
          normalizedKey
        ] === undefined
      ) {
        previewValues[
          normalizedKey
        ] =
          `${variable.label} — ejemplo`;
      }
    }
  );

  return String(
    text || ""
  ).replace(
    /\{[a-z0-9]+\}/gi,
    variable => {
      return (
        previewValues[
          variable.toLowerCase()
        ] ??
        variable
      );
    }
  );
}

function isValidHexColor(value) {
  return /^#[0-9A-Fa-f]{6}$/.test(
    String(value || "")
  );
}

function updateInteractionMessagePreview() {
  if (
    !interactionPreviewTitle ||
    !interactionPreviewMessage ||
    !interactionPreviewEmbed ||
    !interactionPreviewButton
  ) {
    return;
  }

  const title =
    resolvePreviewVariables(
      interactionTitleInput?.value ||
      "🔒 Verificá tu cuenta"
    );

  const message =
    resolvePreviewVariables(
      interactionMessageInput?.value ||
      "Presioná el botón para verificarte."
    );

  interactionPreviewTitle.textContent =
    title;

  interactionPreviewMessage.textContent =
    message;

  const selectedColor =
    interactionColorInput?.value ||
    "#ffffff";

  interactionPreviewEmbed.style.setProperty(
    "--preview-color",
    selectedColor
  );

  if (
    interactionColorTextInput &&
    interactionColorTextInput.value !== selectedColor
  ) {
    interactionColorTextInput.value =
      selectedColor;
  }

  const imageUrl =
    interactionImageInput?.value.trim() ||
    "";

  if (interactionPreviewImage) {
    if (imageUrl) {
      interactionPreviewImage.src =
        imageUrl;

      interactionPreviewImage.style.display =
        "block";
    } else {
      interactionPreviewImage.removeAttribute(
        "src"
      );

      interactionPreviewImage.style.display =
        "none";
    }
  }

const buttonEmoji =
  interactionButtonEmojiInput?.value.trim() ||
  "";

const buttonText =
  interactionButtonTextInput?.value.trim() ||
  "Continuar verificación";

interactionPreviewButton.innerHTML = `
  ${
    buttonEmoji
      ? `<span class="configuration-link-button-emoji">${escapeHtml(
          buttonEmoji
        )}</span>`
      : ""
  }

  <span class="configuration-link-button-text">
    ${escapeHtml(buttonText)}
  </span>

  <span class="configuration-link-button-arrow">
    ↗
  </span>
`;

}

[
  interactionTitleInput,
  interactionMessageInput,
  interactionImageInput,
  interactionButtonEmojiInput,
  interactionButtonTextInput,
].forEach(element => {

  element?.addEventListener(
    "input",
    updateInteractionMessagePreview
  );
});

interactionColorInput?.addEventListener(
  "input",
  updateInteractionMessagePreview
);

interactionColorTextInput?.addEventListener(
  "input",
  () => {
    const color =
      interactionColorTextInput.value.trim();

    if (
      isValidHexColor(color) &&
      interactionColorInput
    ) {
      interactionColorInput.value =
        color;

      updateInteractionMessagePreview();
    }
  }
);

updateInteractionMessagePreview();

  getElement("backToServerPanel")

    ?.addEventListener("click", () => {
      abrirPanelServidor(servidor.id);
    });

  document
    .querySelectorAll(".verify-tab")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(".verify-tab")
            .forEach(item =>
              item.classList.remove("active")
            );

          document
            .querySelectorAll(
              ".verify-tab-panel"
            )
            .forEach(item =>
              item.classList.remove("active")
            );

          button.classList.add("active");

          document
            .querySelector(
              `[data-verify-panel="${button.dataset.verifyTab}"]`
            )
            ?.classList.add("active");
        }
      );
    });

  getElement("verifyEnabled")
    ?.addEventListener("change", event => {
      const status =
        getElement("verifySystemStatus");

      status.textContent =
        event.target.checked
          ? "ACTIVADO"
          : "DESACTIVADO";

      status.classList.toggle(
        "enabled",
        event.target.checked
      );

      status.classList.toggle(
        "disabled",
        !event.target.checked
      );
    });

  getElement("verifyLogs")
    ?.addEventListener("change", event => {
      getElement("verifyLogsSettings")
        ?.classList.toggle(
          "visible",
          Boolean(event.target.value)
        );
    });

  const syncColors = (
    pickerId,
    textId
  ) => {
    const picker = getElement(pickerId);
    const text = getElement(textId);

    picker?.addEventListener(
      "input",
      () => {
        text.value = picker.value;
      }
    );

    text?.addEventListener(
      "input",
      () => {
        if (
          /^#[0-9A-F]{6}$/i.test(
            text.value
          )
        ) {
          picker.value = text.value;
        }
      }
    );
  };

  syncColors(
    "verifyEmbedColor",
    "verifyEmbedColorText"
  );

  syncColors(
    "verifyLogColor",
    "verifyLogColorText"
  );
function obtenerAparienciaDesdeFormulario() {
  return {
    splitImageUrl:
      document.getElementById(
        "verifySplitImageUrl"
      )?.value.trim() || "",

    splitImagePosition:
      document.getElementById(
        "verifySplitImagePosition"
      )?.value || "left",

    splitImageFit:
      document.getElementById(
        "verifySplitImageFit"
      )?.value || "cover",

    splitImageDarkness:
      Number(
        document.getElementById(
          "verifySplitImageDarkness"
        )?.value || 45
      ),

    splitImageWidth:
      Number(
        document.getElementById(
          "verifySplitImageWidth"
        )?.value || 48
      ),

    splitShowImage:
      document.getElementById(
        "verifySplitShowImage"
      )?.checked !== false,

    splitShowDate:
      document.getElementById(
        "verifySplitShowDate"
      )?.checked !== false,

    splitShowAccess:
      document.getElementById(
        "verifySplitShowAccess"
      )?.checked !== false,
    cardDesign:
      document.querySelector(
        'input[name="verificationCardDesign"]:checked'
      )?.value || "classic",

    terminalTitle:
      document.getElementById(
        "verifyTerminalTitle"
      )?.value.trim() ||
      "NEBULA SECURITY TERMINAL",

    terminalPrefix:
      document.getElementById(
        "verifyTerminalPrefix"
      )?.value.trim() ||
      ">",

    terminalStatusText:
      document.getElementById(
        "verifyTerminalStatusText"
      )?.value.trim() ||
      "Sistema preparado",

    terminalBackgroundColor:
      document.getElementById(
        "verifyTerminalBackgroundColorText"
      )?.value ||
      "#020703",

    terminalTextColor:
      document.getElementById(
        "verifyTerminalTextColorText"
      )?.value ||
      "#d9ffe0",

    terminalAccentColor:
      document.getElementById(
        "verifyTerminalAccentColorText"
      )?.value ||
      "#22c55e",

    terminalBorderColor:
      document.getElementById(
        "verifyTerminalBorderColorText"
      )?.value ||
      "#14532d",

    terminalShowCursor:
      Boolean(
        document.getElementById(
          "verifyTerminalShowCursor"
        )?.checked
      ),

    terminalShowLines:
      Boolean(
        document.getElementById(
          "verifyTerminalShowLines"
        )?.checked
      ),

    terminalShowServer:
      Boolean(
        document.getElementById(
          "verifyTerminalShowServer"
        )?.checked
      ),

    terminalShowRole:
      Boolean(
        document.getElementById(
          "verifyTerminalShowRole"
        )?.checked
      ),

    terminalGlow:
      Number(
        document.getElementById(
          "verifyTerminalGlow"
        )?.value ||
        25
      ),

    terminalRadius:
      Number(
        document.getElementById(
          "verifyTerminalRadius"
        )?.value ||
        10
      ),

    pageName:
      document.getElementById(
        "verifyPageName"
      )?.value.trim() || "",

    pageDescription:
      document.getElementById(
        "verifyPageDescription"
      )?.value.trim() || "",

    logoUrl:
      document.getElementById(
        "verifyLogoUrl"
      )?.value.trim() || "",

    backgroundUrl:
      document.getElementById(
        "verifyBackgroundUrl"
      )?.value.trim() || "",

    primaryColor:
      document.getElementById(
        "verifyPrimaryColorText"
      )?.value || "#8b5cf6",

    secondaryColor:
      document.getElementById(
        "verifySecondaryColorText"
      )?.value || "#6d28d9",

    buttonColor:
      document.getElementById(
        "verifyButtonColorText"
      )?.value || "#7c3aed",

    textColor:
      document.getElementById(
        "verifyTextColorText"
      )?.value || "#ffffff",

    cardColor:
      document.getElementById(
        "verifyCardColorText"
      )?.value || "#0f0f1a",

    backgroundSolidColor:
      document.getElementById(
        "verifyBackgroundSolidColorText"
      )?.value || "#05050a",

    gradientStart:
      document.getElementById(
        "verifyGradientStartText"
      )?.value || "#05050a",

    gradientEnd:
      document.getElementById(
        "verifyGradientEndText"
      )?.value || "#160c2b",

    backgroundType:
      document.getElementById(
        "verifyBackgroundType"
      )?.value || "space",

    spaceBackground:
      Boolean(
        document.getElementById(
          "verifySpaceBackground"
        )?.checked
      ),

    animationsEnabled:
      Boolean(
        document.getElementById(
          "verifyAnimationsEnabled"
        )?.checked
      ),

    particlesEnabled:
      Boolean(
        document.getElementById(
          "verifyParticlesEnabled"
        )?.checked
      ),

    glowEnabled:
      Boolean(
        document.getElementById(
          "verifyGlowEnabled"
        )?.checked
      ),

    fadeEnabled:
      Boolean(
        document.getElementById(
          "verifyFadeEnabled"
        )?.checked
      ),

    hoverEnabled:
      Boolean(
        document.getElementById(
          "verifyHoverEnabled"
        )?.checked
      ),

    cursorGlowEnabled:
      Boolean(
        document.getElementById(
          "verifyCursorGlowEnabled"
        )?.checked
      ),

    buttonAnimationEnabled:
      Boolean(
        document.getElementById(
          "verifyButtonAnimationEnabled"
        )?.checked
      ),

    logoAnimationEnabled:
      Boolean(
        document.getElementById(
          "verifyLogoAnimationEnabled"
        )?.checked
      ),

    particleCount:
      Number(
        document.getElementById(
          "verifyParticleCount"
        )?.value || 100
      ),

    glowIntensity:
      Number(
        document.getElementById(
          "verifyGlowIntensity"
        )?.value || 80
      ),

    cardBlur:
      Number(
        document.getElementById(
          "verifyCardBlur"
        )?.value || 18
      ),

    cardOpacity:
      Number(
        document.getElementById(
          "verifyCardOpacity"
        )?.value || 88
      ),

    cardRadius:
      Number(
        document.getElementById(
          "verifyCardRadius"
        )?.value || 24
      ),

    cardShadow:
      Number(
        document.getElementById(
          "verifyCardShadow"
        )?.value || 80
      ),

    verifyButtonText:
      document.getElementById(
        "verifyAppearanceButtonText"
      )?.value.trim() ||
      "Verificar con Discord",

    verifyButtonIcon:
      document.getElementById(
        "verifyButtonIcon"
      )?.value || "discord",

    verifyButtonSize:
      document.getElementById(
        "verifyButtonSize"
      )?.value || "large",

    verifyButtonRadius:
      Number(
        document.getElementById(
          "verifyButtonRadius"
        )?.value || 14
      ),

    verificationSound:
      Boolean(
        document.getElementById(
          "verifyVerificationSound"
        )?.checked
      ),

    errorSound:
      Boolean(
        document.getElementById(
          "verifyErrorSound"
        )?.checked
      ),

    openingSound:
      Boolean(
        document.getElementById(
          "verifyOpeningSound"
        )?.checked
      ),

    soundVolume:
      Number(
        document.getElementById(
          "verifySoundVolume"
        )?.value || 50
      ),
  };
}

function actualizarVistaPreviaApariencia() {
  const appearance =
    obtenerAparienciaDesdeFormulario();

  const previewFrame =
    document.getElementById(
      "verifyAppearanceFrame"
    );

  if (!previewFrame?.contentWindow) {
    return;
  }

  previewFrame.contentWindow.postMessage(
    {
      type:
        "nebula-appearance-preview",

      appearance,
    },
    window.location.origin
  );
}

function hexToRgba(
  hex,
  alpha = 1
) {
  const normalized =
    String(hex || "")
      .replace("#", "");

  if (
    !/^[0-9a-f]{6}$/i.test(
      normalized
    )
  ) {
    return `rgba(15,15,26,${alpha})`;
  }

  const number =
    parseInt(normalized, 16);

  const red =
    (number >> 16) & 255;

  const green =
    (number >> 8) & 255;

  const blue =
    number & 255;

  return `rgba(
    ${red},
    ${green},
    ${blue},
    ${alpha}
  )`;
}
const verificationPreviewFrame =
  document.getElementById(
    "verifyAppearanceFrame"
  );

verificationPreviewFrame?.addEventListener(
  "load",
  () => {
    setTimeout(
      actualizarVistaPreviaApariencia,
      150
    );
  }
);

function actualizarPanelesDeDiseno() {
  const selectedDesign =
    document.querySelector(
      'input[name="verificationCardDesign"]:checked'
    )?.value || "classic";

  /*
    Paneles exclusivos:
    Split y Terminal.
  */

  document
    .querySelectorAll(
      "[data-design-settings]"
    )
    .forEach(panel => {
      panel.classList.toggle(
        "active",
        panel.dataset.designSettings ===
          selectedDesign
      );
    });

  /*
    Apartados generales visibles
    para cada diseño.
  */

  const visibleSections = {
    classic: [
      "identity",
      "palette",
      "background",
      "animations",
      "card",
      "button",
      "sounds",
    ],

    split: [
      "identity",
      "palette",
      "background",
      "button",
    ],

    terminal: [
      "identity",
      "background",
      "button",
    ],
  };

  const allowedSections =
    visibleSections[selectedDesign] ||
    visibleSections.classic;

  document
    .querySelectorAll(
      "[data-appearance-section]"
    )
    .forEach(section => {
      const sectionName =
        section.dataset
          .appearanceSection;

      section.hidden =
        !allowedSections.includes(
          sectionName
        );
    });
}

document
  .querySelectorAll(
    'input[name="verificationCardDesign"]'
  )
  .forEach(input => {
    input.addEventListener(
      "change",
      () => {
        actualizarPanelesDeDiseno();
        actualizarVistaPreviaApariencia();
      }
    );
  });

actualizarPanelesDeDiseno();

const appearanceInputIds = [
  "verifyPageName",
  "verifyPageDescription",
  "verifyLogoUrl",
  "verifyBackgroundUrl",

  "verifyPrimaryColor",
  "verifyPrimaryColorText",

  "verifySecondaryColor",
  "verifySecondaryColorText",

  "verifyButtonColor",
  "verifyButtonColorText",

  "verifyTextColor",
  "verifyTextColorText",

  "verifyCardColor",
  "verifyCardColorText",

  "verifyBackgroundSolidColor",
  "verifyBackgroundSolidColorText",

  "verifyGradientStart",
  "verifyGradientStartText",

  "verifyGradientEnd",
  "verifyGradientEndText",

  "verifyBackgroundType",

  "verifySpaceBackground",
  "verifyParticlesEnabled",
  "verifyAnimationsEnabled",
  "verifyGlowEnabled",
  "verifyFadeEnabled",
  "verifyHoverEnabled",
  "verifyCursorGlowEnabled",
  "verifyButtonAnimationEnabled",
  "verifyLogoAnimationEnabled",

  "verifyParticleCount",
  "verifyGlowIntensity",

  "verifyCardBlur",
  "verifyCardOpacity",
  "verifyCardRadius",
  "verifyCardShadow",

  "verifyAppearanceButtonText",
  "verifyButtonIcon",
  "verifyButtonSize",
  "verifyButtonRadius",

  "verifyOpeningSound",
  "verifyVerificationSound",
  "verifyErrorSound",
  "verifySoundVolume",

  "verifySplitImageUrl",
  "verifySplitImagePosition",
  "verifySplitImageFit",
  "verifySplitImageDarkness",
  "verifySplitImageWidth",
  "verifySplitShowImage",
  "verifySplitShowDate",
  "verifySplitShowAccess",
  "verifyTerminalTitle",
  "verifyTerminalPrefix",
  "verifyTerminalStatusText",

  "verifyTerminalBackgroundColor",
  "verifyTerminalBackgroundColorText",

  "verifyTerminalTextColor",
  "verifyTerminalTextColorText",

  "verifyTerminalAccentColor",
  "verifyTerminalAccentColorText",

  "verifyTerminalBorderColor",
  "verifyTerminalBorderColorText",

  "verifyTerminalShowCursor",
  "verifyTerminalShowLines",
  "verifyTerminalShowServer",
  "verifyTerminalShowRole",

  "verifyTerminalGlow",
  "verifyTerminalRadius",

];

appearanceInputIds.forEach(id => {
  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  const eventName =
    element.type === "checkbox" ||
    element.tagName === "SELECT"
      ? "change"
      : "input";

  element.addEventListener(
    eventName,
    actualizarVistaPreviaApariencia
  );
});
const appearanceColorPairs = [
  [
    "verifyPrimaryColor",
    "verifyPrimaryColorText",
  ],
  [
    "verifySecondaryColor",
    "verifySecondaryColorText",
  ],
  [
    "verifyButtonColor",
    "verifyButtonColorText",
  ],
  [
    "verifyTextColor",
    "verifyTextColorText",
  ],
  [
    "verifyCardColor",
    "verifyCardColorText",
  ],
  [
    "verifyBackgroundSolidColor",
    "verifyBackgroundSolidColorText",
  ],
  [
    "verifyGradientStart",
    "verifyGradientStartText",
  ],
  [
    "verifyGradientEnd",
    "verifyGradientEndText",
  ],
  [
    "verifyTerminalBackgroundColor",
    "verifyTerminalBackgroundColorText",
  ],

  [
    "verifyTerminalTextColor",
    "verifyTerminalTextColorText",
  ],

  [
    "verifyTerminalAccentColor",
    "verifyTerminalAccentColorText",
  ],

  [
    "verifyTerminalBorderColor",
    "verifyTerminalBorderColorText",
  ],
];

appearanceColorPairs.forEach(
  ([pickerId, textId]) => {
    const picker =
      document.getElementById(
        pickerId
      );

    const text =
      document.getElementById(
        textId
      );

    picker?.addEventListener(
      "input",
      () => {
        text.value =
          picker.value;

        actualizarVistaPreviaApariencia();
      }
    );

    text?.addEventListener(
      "input",
      () => {
        const value =
          text.value.trim();

        if (
          /^#[0-9a-f]{6}$/i.test(
            value
          )
        ) {
          picker.value = value;

          actualizarVistaPreviaApariencia();
        }
      }
    );
  }
);
document
  .querySelectorAll(
    ".appearance-range-control input[type='range']"
  )
  .forEach(range => {
    const valueElement =
      document.getElementById(
        `${range.id}Value`
      );

    const updateRangeValue = () => {
      if (valueElement) {
        valueElement.textContent =
          `${range.value}${
            range.dataset.suffix || ""
          }`;
      }

      actualizarVistaPreviaApariencia();
    };

    range.addEventListener(
      "input",
      updateRangeValue
    );

    updateRangeValue();
  });

actualizarVistaPreviaApariencia();

  getElement("saveVerification")
    ?.addEventListener(
      "click",
      async () => {
        const button =
          getElement("saveVerification");

        const payload =
          buildPayload();

        if (
          !payload.verificationChannelId
        ) {
          showMessage(
            "Falta el canal",
            "Seleccioná el canal de verificación."
          );
          return;
        }

        if (!payload.verifiedRoleId) {
          showMessage(
            "Falta el rol",
            "Seleccioná el rol que recibirá el usuario."
          );
          return;
        }

        button.disabled = true;
        button.textContent = "Guardando...";

        try {
          const response = await fetch(
            `${API_URL}/api/servers/${servidor.id}/verification`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                payload
              ),
            }
          );

          const result =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.message ||
              "No se pudo guardar."
            );
          }

          showMessage(
            "Configuración guardada",
            "Todos los cambios quedaron guardados."
          );
        } catch (error) {
          showMessage(
            "Error al guardar",
            error.message
          );
        } finally {
          button.disabled = false;
          button.textContent =
            "Guardar configuración";
        }
      }
    );

  getElement("sendVerificationPanel")
    ?.addEventListener(
      "click",
      async () => {
        const sendButton =
          getElement(
            "sendVerificationPanel"
          );

        const saveButton =
          getElement(
            "saveVerification"
          );

        saveButton.click();

        await new Promise(resolve =>
          setTimeout(resolve, 700)
        );

        sendButton.disabled = true;
        sendButton.textContent =
          "Enviando...";

        try {
          const response = await fetch(
            `${API_URL}/api/servers/${servidor.id}/verification/send`,
            {
              method: "POST",
            }
          );

          const result =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.message ||
              "No se pudo enviar el panel."
            );
          }

          showMessage(
            "Panel enviado",
            "Revisá el canal de verificación en Discord."
          );
        } catch (error) {
          showMessage(
            "Error al enviar",
            error.message
          );
        } finally {
          sendButton.disabled = false;
          sendButton.textContent =
            "Enviar panel a Discord";
        }
      }
    );
}
   /* =========================================================
   CONFIGURACIÓN DE BIENVENIDA
   ========================================================= */

async function abrirConfiguracionBienvenida(servidor) {
  pageContent.innerHTML = `
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando configuración de bienvenida...</strong>
      </div>
    </div>
  `;

  try {
    const [channelsResponse, configResponse] = await Promise.all([
      fetch(`${API_URL}/api/servers/${servidor.id}/text-channels`),
      fetch(`${API_URL}/api/servers/${servidor.id}/welcome`),
    ]);

    const channelsResult = await channelsResponse.json();
    const configResult = await configResponse.json();

    if (!channelsResult.success || !configResult.success) {
      throw new Error("No se pudo cargar la configuración");
    }

    mostrarConfiguracionBienvenida(
      servidor,
      channelsResult.data,
      configResult.data
    );
  } catch (error) {
    pageContent.innerHTML = `
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>
          <h3>No se pudo abrir Bienvenida</h3>
          <p>${error.message}</p>
          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `;

    document
      .getElementById("backToServerPanel")
      ?.addEventListener("click", () => {
        abrirPanelServidor(servidor.id);
      });
  }
}

function mostrarConfiguracionBienvenida(
  servidor,
  channels,
  config
) {
  const channelOptions = channels.map(channel => `
    <option
      value="${channel.id}"
      ${channel.id === config.channelId ? "selected" : ""}
    >
      # ${channel.name}
    </option>
  `).join("");

  pageContent.innerHTML = `
    <div class="dynamic-page welcome-config-page">

      <section class="section-header">
        <div>
          <span>MENSAJES AUTOMÁTICOS</span>
          <h1>Bienvenida</h1>
          <p>
            Configurá el mensaje que recibirá cada usuario
            cuando ingrese a ${servidor.name}.
          </p>
        </div>

        <button id="backToServerPanel" class="section-action">
          ‹ Volver al servidor
        </button>
      </section>

      <div class="welcome-layout">

        <article class="section-panel">
         <div class="section-panel-head">
  <div>
    <span>CONFIGURACIÓN</span>

    <h3>
      Mensaje de ingreso
    </h3>
  </div>

<button
  id="openWelcomeVariables"
  class="open-variables-button"
  data-open-welcome-variables
  type="button"
>
  <span>⌘</span>
  Variables
</button>
 </div>

          <div class="welcome-enabled-row">
            <div>
              <strong>Activar bienvenida</strong>
              <p>
                El bot enviará el mensaje cuando entre alguien.
              </p>
            </div>

            <label class="switch-control">
              <input
                id="welcomeEnabled"
                type="checkbox"
                ${config.enabled ? "checked" : ""}
              >
              <span></span>
            </label>
          </div>

          <label class="welcome-field">
            <span>CANAL DE BIENVENIDA</span>
            <select id="welcomeChannel">
              <option value="">Seleccionar canal...</option>
              ${channelOptions}
            </select>
          </label>

          <label class="welcome-field">
            <span>TÍTULO</span>
            <input
              id="welcomeTitle"
              maxlength="256"
              value="${escapeHtmlAttribute(config.title)}"
            >
          </label>

          <label class="welcome-field">
            <span>MENSAJE</span>
            <textarea
              id="welcomeMessage"
              maxlength="2000"
              rows="7"
            >${escapeHtml(config.message)}</textarea>
          </label>
<div class="welcome-enabled-row">
  <div>
    <strong>Mostrar foto del usuario</strong>
    <p>
      Agrega el avatar del nuevo miembro al mensaje público.
    </p>
  </div>

  <label class="switch-control">
    <input
      id="welcomeShowAvatar"
      type="checkbox"
      ${config.showAvatar !== false ? "checked" : ""}
    >
    <span></span>
  </label>
</div>
          <label class="welcome-field">
            <span>COLOR DEL MENSAJE</span>

            <div class="welcome-color-row">
              <input
                id="welcomeColor"
                type="color"
                value="${config.color}"
              >

              <input
                id="welcomeColorText"
                value="${config.color}"
                maxlength="7"
              >
            </div>
          </label>

          <div class="welcome-variables">
            <strong>Variables disponibles</strong>

            <div>
<button data-variable="{user}">{user}</button>
<button data-variable="{mention}">{mention}</button>
<button data-variable="{username}">{username}</button>
<button data-variable="{displayname}">{displayname}</button>
<button data-variable="{userid}">{userid}</button>
<button data-variable="{server}">{server}</button>
<button data-variable="{serverid}">{serverid}</button>
<button data-variable="{members}">{members}</button>
<button data-variable="{membercount}">{membercount}</button>
<button data-variable="{joindate}">{joindate}</button>
           </div>
          </div>
<div class="welcome-section-divider">
  <span>MENSAJE PRIVADO</span>
</div>

<div class="welcome-enabled-row">
  <div>
    <strong>Enviar mensaje por MD</strong>
    <p>
      Envía un mensaje privado al usuario cuando se una.
    </p>
  </div>

  <label class="switch-control">
    <input
      id="welcomeDmEnabled"
      type="checkbox"
      ${config.dmEnabled ? "checked" : ""}
    >
    <span></span>
  </label>
</div>

<div
  id="welcomeDmFields"
  class="welcome-dm-fields ${
    config.dmEnabled ? "visible" : ""
  }"
>
  <label class="welcome-field">
    <span>TÍTULO DEL MD</span>

    <input
      id="welcomeDmTitle"
      maxlength="256"
      value="${escapeHtmlAttribute(config.dmTitle)}"
    >
  </label>

  <label class="welcome-field">
    <span>MENSAJE PRIVADO</span>

    <textarea
      id="welcomeDmMessage"
      maxlength="2000"
      rows="7"
    >${escapeHtml(config.dmMessage)}</textarea>
  </label>

  <label class="welcome-field">
    <span>COLOR DEL MD</span>

    <div class="welcome-color-row">
      <input
        id="welcomeDmColor"
        type="color"
        value="${config.dmColor}"
      >

      <input
        id="welcomeDmColorText"
        value="${config.dmColor}"
        maxlength="7"
      >
    </div>
  </label>

  <div class="welcome-enabled-row">
    <div>
      <strong>Mostrar foto en el MD</strong>
      <p>
        Agrega el avatar del usuario al mensaje privado.
      </p>
    </div>

    <label class="switch-control">
      <input
        id="welcomeDmShowAvatar"
        type="checkbox"
        ${config.dmShowAvatar !== false ? "checked" : ""}
      >
      <span></span>
    </label>
  </div>
</div>

<div class="welcome-actions-row">
  <button
    id="testWelcome"
    class="welcome-test-button"
    type="button"
  >
    Enviar mensaje de prueba
  </button>

  <button
    id="saveWelcome"
    class="welcome-save-button"
    type="button"
  >
    Guardar configuración
  </button>
</div>
        </article>

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>VISTA PREVIA</span>
              <h3>Discord</h3>
            </div>
          </div>

        <div class="welcome-discord-preview">
  <div
    class="preview-bot-avatar"
    id="welcomePreviewBotAvatar"
  >
    N
  </div>

  <div class="preview-message-content">
    <div class="preview-author">
      <span id="welcomePreviewBotName">
        Nebula Bot
      </span>

      <small>BOT</small>
      <time>Ahora</time>
    </div>

              <div
                class="preview-embed"
                id="welcomePreviewEmbed"
              >
                <strong id="welcomePreviewTitle"></strong>
                <p id="welcomePreviewMessage"></p>

               <div
  id="welcomePreviewUserAvatar"
  class="preview-user-thumbnail"
></div>

                <small>
                  ${servidor.name} · Miembro número
                  ${servidor.members}
                </small>
              </div>
            </div>
          </div>

<div
  id="welcomeDmPreviewSection"
  class="welcome-dm-preview-section ${
    config.dmEnabled ? "visible" : ""
  }"
>
  <div class="welcome-preview-label">
    VISTA PREVIA DEL MENSAJE PRIVADO
  </div>

  <div class="welcome-discord-preview dm-preview">
  <div
    class="preview-bot-avatar"
    id="welcomeDmPreviewBotAvatar"
  >
    N
  </div>

  <div class="preview-message-content">
    <div class="preview-author">
      <span id="welcomeDmPreviewBotName">
        Nebula Bot
      </span>

      <small>BOT</small>
      <time>Ahora</time>
    </div>

      <div
        class="preview-embed"
        id="welcomeDmPreviewEmbed"
      >
        <strong id="welcomeDmPreviewTitle"></strong>

        <p id="welcomeDmPreviewMessage"></p>

       <div
  id="welcomeDmPreviewAvatar"
  class="preview-user-thumbnail"
></div>

        <small>
          Mensaje enviado por ${servidor.name}
        </small>
      </div>
    </div>
  </div>
</div>


<div class="welcome-help">
  <strong>Ejemplo de variables</strong>

  <p>
    <code>{user}</code> menciona al usuario y
    <code>{server}</code> escribe el nombre del servidor.
  </p>
</div>

<div
  id="welcomeVariablesModal"
  class="variables-modal"
  aria-hidden="true"
>
  <div
    class="variables-modal-backdrop"
    data-close-welcome-variables
  ></div>

  <section
    class="variables-modal-window"
    role="dialog"
    aria-modal="true"
    aria-labelledby="welcomeVariablesTitle"
  >
    <header class="variables-modal-header">
      <div>
        <span>TEXTOS DINÁMICOS</span>

        <h2 id="welcomeVariablesTitle">
          Variables de Bienvenida
        </h2>

        <p>
          Elegí una categoría y copiá la variable que necesites.
        </p>
      </div>

      <button
        class="variables-modal-close"
        data-close-welcome-variables
        type="button"
        aria-label="Cerrar"
      >
        ×
      </button>
    </header>

    <div class="variables-modal-search">
      <span>⌕</span>

      <input
        id="welcomeVariablesSearch"
        type="search"
        placeholder="Buscar una variable..."
        autocomplete="off"
      >
    </div>

    <div class="variables-modal-content">
      <aside class="variables-categories">

        <button
          type="button"
          class="variables-category active"
          data-welcome-variable-category="user"
        >
          <span>👤</span>
          Usuario
        </button>

        <button
          type="button"
          class="variables-category"
          data-welcome-variable-category="server"
        >
          <span>🌍</span>
          Servidor
        </button>

        <button
          type="button"
          class="variables-category"
          data-welcome-variable-category="date"
        >
          <span>📅</span>
          Fecha y hora
        </button>

      </aside>

      <section class="variables-results">
        <div
          id="welcomeVariablesModalList"
          class="variables-modal-list"
        ></div>
      </section>
    </div>

    <div
      id="welcomeVariablesModalEmpty"
      class="variables-modal-empty"
      hidden
    >
      No se encontraron variables.
    </div>

    <footer class="variables-modal-footer">
      <span>
        Presioná una variable para copiarla.
      </span>

      <button
        data-close-welcome-variables
        type="button"
      >
        Cerrar
      </button>
    </footer>
  </section>
</div>

</article>

  </div>
  </div>
  `;

  const enabledInput = document.getElementById("welcomeEnabled");
  const channelInput = document.getElementById("welcomeChannel");
  const titleInput = document.getElementById("welcomeTitle");
  const messageInput = document.getElementById("welcomeMessage");
  const colorInput = document.getElementById("welcomeColor");
  const colorTextInput = document.getElementById("welcomeColorText");
const showAvatarInput =
  document.getElementById("welcomeShowAvatar");

const dmEnabledInput =
  document.getElementById("welcomeDmEnabled");

const dmFields =
  document.getElementById("welcomeDmFields");

const dmTitleInput =
  document.getElementById("welcomeDmTitle");

const dmMessageInput =
  document.getElementById("welcomeDmMessage");

const dmColorInput =
  document.getElementById("welcomeDmColor");

const dmColorTextInput =
  document.getElementById("welcomeDmColorText");

const dmShowAvatarInput =
  document.getElementById("welcomeDmShowAvatar");

const dmPreviewSection =
  document.getElementById("welcomeDmPreviewSection");

const previewBotName =
  dashboardBotData?.name ||
  "Nebula Bot";

const previewDashboardUser =
  dashboardSessionUser || {};

const previewUserName =
  previewDashboardUser.displayName ||
  previewDashboardUser.globalName ||
  previewDashboardUser.username ||
  "Usuario";

const previewUserAvatar =
  previewDashboardUser.avatar ||
  "";

const publicUserAvatarElement =
  document.getElementById(
    "welcomePreviewUserAvatar"
  );

const dmUserAvatarElement =
  document.getElementById(
    "welcomeDmPreviewAvatar"
  );

const userAvatarHtml =
  previewUserAvatar
    ? `
      <img
        src="${previewUserAvatar}"
        alt="${previewUserName}"
      >
    `
    : `
      <span>
        ${getServerInitials(
          previewUserName
        )}
      </span>
    `;

if (publicUserAvatarElement) {
  publicUserAvatarElement.innerHTML =
    userAvatarHtml;
}

if (dmUserAvatarElement) {
  dmUserAvatarElement.innerHTML =
    userAvatarHtml;
}

const previewBotAvatar =
  dashboardBotData?.avatar ||
  "";

const publicBotNameElement =
  document.getElementById(
    "welcomePreviewBotName"
  );

const dmBotNameElement =
  document.getElementById(
    "welcomeDmPreviewBotName"
  );

const publicBotAvatarElement =
  document.getElementById(
    "welcomePreviewBotAvatar"
  );

const dmBotAvatarElement =
  document.getElementById(
    "welcomeDmPreviewBotAvatar"
  );

if (publicBotNameElement) {
  publicBotNameElement.textContent =
    previewBotName;
}

if (dmBotNameElement) {
  dmBotNameElement.textContent =
    previewBotName;
}

const botAvatarHtml =
  previewBotAvatar
    ? `
      <img
        src="${previewBotAvatar}"
        alt="${previewBotName}"
      >
    `
    : previewBotName
        .charAt(0)
        .toUpperCase();

if (publicBotAvatarElement) {
  publicBotAvatarElement.innerHTML =
    botAvatarHtml;
}

if (dmBotAvatarElement) {
  dmBotAvatarElement.innerHTML =
    botAvatarHtml;
}

 function updatePreview() {
  // Vista previa pública
const title =
  replacePreviewVariables(
    titleInput.value,
    servidor
  );

const message =
  replacePreviewVariables(
    messageInput.value,
    servidor
  );

  document.getElementById(
    "welcomePreviewTitle"
  ).textContent = title;

  document.getElementById(
    "welcomePreviewMessage"
  ).textContent = message;

  document.getElementById(
    "welcomePreviewEmbed"
  ).style.borderLeftColor = colorInput.value;

 const publicAvatar =
  document.getElementById(
    "welcomePreviewUserAvatar"
  );

if (publicAvatar) {
  publicAvatar.style.display =
    showAvatarInput.checked
      ? "block"
      : "none";
}

  // Vista previa del mensaje privado
 const dmTitle =
  replacePreviewVariables(
    dmTitleInput.value,
    servidor
  );

const dmMessage =
  replacePreviewVariables(
    dmMessageInput.value,
    servidor
  );

  document.getElementById(
    "welcomeDmPreviewTitle"
  ).textContent = dmTitle;

  document.getElementById(
    "welcomeDmPreviewMessage"
  ).textContent = dmMessage;

  document.getElementById(
    "welcomeDmPreviewEmbed"
  ).style.borderLeftColor = dmColorInput.value;


const dmUserAvatar =
  document.getElementById(
    "welcomeDmPreviewAvatar"
  );

if (dmUserAvatar) {
  dmUserAvatar.style.display =
    dmShowAvatarInput.checked
      ? "block"
      : "none";
}

}

colorInput.addEventListener("input", () => {
    colorTextInput.value = colorInput.value;
    updatePreview();
  });

  colorTextInput.addEventListener("input", () => {
    if (/^#[0-9A-F]{6}$/i.test(colorTextInput.value)) {
      colorInput.value = colorTextInput.value;
      updatePreview();
    }
  });

  titleInput.addEventListener("input", updatePreview);
  messageInput.addEventListener("input", updatePreview);
dmEnabledInput.addEventListener("change", () => {
  dmFields.classList.toggle(
    "visible",
    dmEnabledInput.checked
  );

  dmPreviewSection.classList.toggle(
    "visible",
    dmEnabledInput.checked
  );

  updatePreview();
});

showAvatarInput.addEventListener(
  "change",
  updatePreview
);

dmShowAvatarInput.addEventListener(
  "change",
  updatePreview
);

dmTitleInput.addEventListener(
  "input",
  updatePreview
);

dmMessageInput.addEventListener(
  "input",
  updatePreview
);

dmColorInput.addEventListener("input", () => {
  dmColorTextInput.value = dmColorInput.value;
  updatePreview();
});

dmColorTextInput.addEventListener("input", () => {
  if (
    /^#[0-9A-F]{6}$/i.test(
      dmColorTextInput.value
    )
  ) {
    dmColorInput.value = dmColorTextInput.value;
    updatePreview();
  }
});
  document
    .querySelectorAll("[data-variable]")
    .forEach(button => {
      button.addEventListener("click", () => {
        const variable = button.dataset.variable;
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;

        messageInput.value =
          messageInput.value.slice(0, start) +
          variable +
          messageInput.value.slice(end);

        messageInput.focus();
        messageInput.selectionStart =
          messageInput.selectionEnd =
          start + variable.length;

        updatePreview();
      });
    });
/* =========================================================
   VENTANA DE VARIABLES DE BIENVENIDA
   ========================================================= */

const welcomeVariablesModal =
  document.getElementById(
    "welcomeVariablesModal"
  );

const welcomeVariablesSearch =
  document.getElementById(
    "welcomeVariablesSearch"
  );

const welcomeVariablesModalList =
  document.getElementById(
    "welcomeVariablesModalList"
  );

const welcomeVariablesModalEmpty =
  document.getElementById(
    "welcomeVariablesModalEmpty"
  );

const welcomeVariableCategoryButtons =
  document.querySelectorAll(
    "[data-welcome-variable-category]"
  );

let activeWelcomeVariableCategory =
  "user";

let activeWelcomeVariableTarget =
  null;

const welcomeVariables = [
  {
    key: "{user}",
    label: "Nombre corto del usuario",
    category: "user",
  },
  {
    key: "{mention}",
    label: "Mención del usuario",
    category: "user",
  },
  {
    key: "{username}",
    label: "Nombre de usuario",
    category: "user",
  },
  {
    key: "{displayname}",
    label: "Nombre visible",
    category: "user",
  },
  {
    key: "{userid}",
    label: "ID del usuario",
    category: "user",
  },
  {
    key: "{joindate}",
    label: "Fecha de ingreso",
    category: "user",
  },

  {
    key: "{server}",
    label: "Nombre del servidor",
    category: "server",
  },
  {
    key: "{serverid}",
    label: "ID del servidor",
    category: "server",
  },
  {
    key: "{members}",
    label: "Cantidad de miembros",
    category: "server",
  },
  {
    key: "{membercount}",
    label: "Cantidad de miembros",
    category: "server",
  },

  {
    key: "{date}",
    label: "Fecha actual",
    category: "date",
  },
  {
    key: "{time}",
    label: "Hora actual",
    category: "date",
  },
];

function renderWelcomeVariables() {
  if (!welcomeVariablesModalList) {
    return;
  }

  const search =
    String(
      welcomeVariablesSearch?.value ||
      ""
    )
      .trim()
      .toLowerCase();

  const filteredVariables =
    welcomeVariables.filter(
      variable => {
        const sameCategory =
          variable.category ===
          activeWelcomeVariableCategory;

        const searchableText =
          `${variable.key} ${variable.label}`
            .toLowerCase();

        const matchesSearch =
          !search ||
          searchableText.includes(
            search
          );

        return (
          sameCategory &&
          matchesSearch
        );
      }
    );

  welcomeVariablesModalList.innerHTML =
    filteredVariables
      .map(
        variable => `
          <button
            class="verify-variable-button"
            data-copy-welcome-variable="${variable.key}"
            type="button"
          >
            <code>
              ${variable.key}
            </code>

            <span>
              ${variable.label}
            </span>

            <b>
              Copiar
            </b>
          </button>
        `
      )
      .join("");

  const hasResults =
    filteredVariables.length > 0;

  if (
    welcomeVariablesModalEmpty
  ) {
    welcomeVariablesModalEmpty.hidden =
      hasResults;

    welcomeVariablesModalEmpty
      .classList.toggle(
        "visible",
        !hasResults
      );
  }
}

function openWelcomeVariablesModal(
  target = null
) {

  if (!welcomeVariablesModal) {
    return;
  }

activeWelcomeVariableTarget =
  target;

  welcomeVariablesModal.classList.add(
    "open"
  );

  welcomeVariablesModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "variables-modal-open"
  );

  activeWelcomeVariableCategory =
    "user";

  if (welcomeVariablesSearch) {
    welcomeVariablesSearch.value =
      "";
  }

  welcomeVariableCategoryButtons
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset
          .welcomeVariableCategory ===
          "user"
      );
    });

  renderWelcomeVariables();

  setTimeout(
    () => {
      welcomeVariablesSearch
        ?.focus();
    },
    100
  );
}

function closeWelcomeVariablesModal() {
  if (!welcomeVariablesModal) {
    return;
  }

  welcomeVariablesModal.classList.remove(
    "open"
  );

  welcomeVariablesModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "variables-modal-open"
  );
}

document
  .querySelector(
    "[data-open-welcome-variables]"
  )
  ?.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();

      openWelcomeVariablesModal(
        messageInput
      );
    }
  );

document
  .querySelectorAll(
    "[data-close-welcome-variables]"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        closeWelcomeVariablesModal();
      }
    );
  });

welcomeVariableCategoryButtons
  .forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        activeWelcomeVariableCategory =
          button.dataset
            .welcomeVariableCategory ||
          "user";

        welcomeVariableCategoryButtons
          .forEach(
            categoryButton => {
              categoryButton
                .classList.toggle(
                  "active",
                  categoryButton ===
                    button
                );
            }
          );

        renderWelcomeVariables();
      }
    );
  });

welcomeVariablesSearch
  ?.addEventListener(
    "input",
    renderWelcomeVariables
  );

welcomeVariablesModalList
  ?.addEventListener(
    "click",
    async event => {
      const button =
        event.target.closest(
          "[data-copy-welcome-variable]"
        );

      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const variable =
        button.dataset
          .copyWelcomeVariable;

      if (!variable) {
        return;
      }

      try {
        await navigator.clipboard
          .writeText(variable);

        const previousText =
          button.querySelector("b")
            ?.textContent;

        const status =
          button.querySelector("b");

        if (status) {
          status.textContent =
            "Copiado ✓";

          setTimeout(
            () => {
              status.textContent =
                previousText ||
                "Copiar";
            },
            1200
          );
        }
      } catch (error) {
        console.error(
          "No se pudo copiar la variable:",
          error
        );
      }
    }
  );

welcomeVariablesModal
  ?.addEventListener(
    "wheel",
    event => {
      const scrollArea =
        event.target.closest(
          ".variables-categories, .variables-results"
        );

      if (!scrollArea) {
        event.preventDefault();
      }
    },
    {
      passive: false,
    }
  );

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      welcomeVariablesModal
        ?.classList.contains(
          "open"
        )
    ) {
      closeWelcomeVariablesModal();
    }
  }
);

renderWelcomeVariables();

document
  .getElementById("backToServerPanel")
  .addEventListener("click", () => {
    abrirPanelServidor(servidor.id);
  });

 async function guardarConfiguracionBienvenida() {
  const saveButton =
    document.getElementById("saveWelcome");

  saveButton.disabled = true;
  saveButton.textContent = "Guardando...";

  try {
    const response = await fetch(
      `${API_URL}/api/servers/${servidor.id}/welcome`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: enabledInput.checked,
          channelId: channelInput.value,
          title: titleInput.value,
          message: messageInput.value,
          color: colorInput.value,
          showAvatar: showAvatarInput.checked,

          dmEnabled: dmEnabledInput.checked,
          dmTitle: dmTitleInput.value,
          dmMessage: dmMessageInput.value,
          dmColor: dmColorInput.value,
          dmShowAvatar: dmShowAvatarInput.checked,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "No se pudo guardar"
      );
    }

    toast.querySelector("strong").textContent =
      "Bienvenida guardada";

    toast.querySelector("p").textContent =
      "Todos los cambios quedaron guardados.";

    showToast();

    return true;
  } catch (error) {
    toast.querySelector("strong").textContent =
      "Error al guardar";

    toast.querySelector("p").textContent =
      error.message;

    showToast();

    return false;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent =
      "Guardar configuración";
  }
}

document
  .getElementById("saveWelcome")
  .addEventListener(
    "click",
    guardarConfiguracionBienvenida
  );

document
  .getElementById("testWelcome")
  .addEventListener("click", async () => {
    const testButton =
      document.getElementById("testWelcome");

    testButton.disabled = true;
    testButton.textContent = "Preparando prueba...";

    try {
      const guardado =
        await guardarConfiguracionBienvenida();

      if (!guardado) {
        return;
      }

      testButton.textContent = "Enviando...";

      const response = await fetch(
        `${API_URL}/api/servers/${servidor.id}/welcome/test`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "No se pudo enviar la prueba"
        );
      }

      toast.querySelector("strong").textContent =
        "Prueba enviada";

      toast.querySelector("p").textContent =
        "Revisá el canal de bienvenida en Discord.";

      showToast();
    } catch (error) {
      toast.querySelector("strong").textContent =
        "Error en la prueba";

      toast.querySelector("p").textContent =
        error.message;

      showToast();
    } finally {
      testButton.disabled = false;
      testButton.textContent =
        "Enviar mensaje de prueba";
    }
  });
  updatePreview();
}

function replacePreviewVariables(
  text,
  servidor
) {
  const now =
    new Date();

const previewUser =
  dashboardSessionUser || {};

const username =
  previewUser.username ||
  "usuario";

const displayName =
  previewUser.displayName ||
  previewUser.globalName ||
  username;

const userId =
  previewUser.id ||
  "000000000000000000";

  return String(text)

.replaceAll(
  "{user}",
  username
)
.replaceAll(
  "{mention}",
  `@${username}`
)
.replaceAll(
  "{username}",
  username
)
.replaceAll(
  "{displayname}",
  displayName
)
.replaceAll(
  "{userid}",
  userId
)
     .replaceAll(
      "{server}",
      servidor.name
    )
    .replaceAll(
      "{serverid}",
      servidor.id
    )
    .replaceAll(
      "{members}",
      Number(
        servidor.members || 0
      ).toLocaleString(
        "es-AR"
      )
    )
    .replaceAll(
      "{membercount}",
      Number(
        servidor.members || 0
      ).toLocaleString(
        "es-AR"
      )
    )
    .replaceAll(
      "{joindate}",
      now.toLocaleDateString(
        "es-AR"
      )
    )
    .replaceAll(
      "{date}",
      now.toLocaleDateString(
        "es-AR"
      )
    )
    .replaceAll(
      "{time}",
      now.toLocaleTimeString(
        "es-AR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    );
}

function escapeHtml(text) {
  return String(text)

    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtmlAttribute(text) {
  return escapeHtml(text)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
initializeInteractiveButtons();

