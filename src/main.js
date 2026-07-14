import "./style.css";
import { io } from "socket.io-client";

const menuSections = [
  {
    title: "SERVIDORES",
    items: [
      ["◈", "Servidores", "12"],
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

      <button class="side-item dashboard-link active">
        <span class="side-icon">⌂</span>
        <span>Dashboard</span>
        <b>⌁</b>
      </button>

      <div class="sidebar-scroll">
        ${sidebarMenus}
      </div>

      <div class="owner-card">
        <div class="owner-avatar">AM</div>
        <div class="owner-info">
          <strong>Alvi Moreyra</strong>
          <span>Propietario</span>
          <small>Premium</small>
        </div>
        <button>⚙</button>
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
          <div class="top-profile">
            <div class="profile-avatar">AM</div>
            <div>
              <strong>Alvi Moreyra</strong>
              <span><i></i> En línea</span>
            </div>
            <b>⌄</b>
          </div>
        </div>
      </header>

      <section class="welcome-row">
        <div>
          <h1>¡Bienvenido de vuelta, <span>Alvi!</span> 👋</h1>
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

const toast = document.getElementById("toast");
const showToast = () => {
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
};

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.id !== "hamburger") showToast();
  });
});

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-item").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
  });
});

const sidebar = document.getElementById("sidebar");
document.getElementById("hamburger").addEventListener("click", () => sidebar.classList.toggle("open"));

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.querySelector(".search input").focus();
  }
});

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  stars = Array.from({length: 90}, () => ({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*1.3+.2,
    a: Math.random()*.45+.05,
    s: Math.random()*.12+.02
  }));
}
function animate() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  stars.forEach(star => {
    star.y -= star.s;
    if (star.y < 0) star.y = innerHeight;
    ctx.beginPath();
    ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(167,139,250,${star.a})`;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
resize();
animate();
addEventListener("resize",resize);


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

const dashboardHTML = pageContent.innerHTML;

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
    pageContent.innerHTML = dashboardHTML;
    initializeInteractiveButtons();
    cargarDatosDashboard();
    return;
  }

if (label === "Servidores") {
  await cargarServidoresReales();
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

const API_URL = window.location.origin;

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

    const datos = resultado.data;

    actualizarEstadisticas(datos.statistics);
    actualizarEstadoBot(datos.bot);
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

  const latencias = document.querySelectorAll(
    ".footer-status strong"
  );

  if (latencias[0]) {
    latencias[0].textContent = `${bot.latency} ms`;
  }

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
      ?.addEventListener("click", cargarServidoresReales);
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
    ?.addEventListener("click", cargarServidoresReales);
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
    ]);

    const channelsResult =
      await channelsResponse.json();

    const serverResult =
      await serverResponse.json();

    const configResult =
      await configResponse.json();

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
      configResult.data
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
function mostrarConfiguracionVerificacion(
  servidor,
  channels,
  roles,
  config
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
    pageName: "Trade Room Verification",
    primaryColor: "#8b5cf6",
    animationsEnabled: true,
    spaceBackground: true,
    particleCount: 100,
    glowIntensity: 80,
    verificationSound: false,
    ...(config.webAppearance || {}),
  };

  const currentSecurity = {
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
          <div class="verify-two-columns">

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>PANEL DE DISCORD</span>
                  <h3>Contenido del embed</h3>
                </div>
              </div>

              <label class="welcome-field">
                <span>TÍTULO DEL EMBED</span>

                <input
                  id="verifyEmbedTitle"
                  maxlength="256"
                  value="${escapeHtmlAttribute(
                    config.embedTitle || ""
                  )}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN</span>

                <textarea
                  id="verifyEmbedDescription"
                  rows="6"
                  maxlength="4000"
                >${escapeHtml(
                  config.embedDescription || ""
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
                    value="${
                      config.embedColor ||
                      "#8b5cf6"
                    }"
                    maxlength="7"
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
                      "Verificarme"
                    )}"
                  >
                </label>

                <label class="welcome-field">
                  <span>EMOJI</span>

                  <input
                    id="verifyButtonEmoji"
                    maxlength="100"
                    value="${escapeHtmlAttribute(
                      config.buttonEmoji || "✅"
                    )}"
                  >
                </label>
              </div>

              <label class="welcome-field">
                <span>EMOJI DE REACCIÓN</span>

                <input
                  id="verifyReactionEmoji"
                  maxlength="100"
                  value="${escapeHtmlAttribute(
                    config.reactionEmoji || "✅"
                  )}"
                >
              </label>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>VISTA PREVIA</span>
                  <h3>Discord</h3>
                </div>
              </div>

              <div class="verify-discord-preview">
                <div class="verify-preview-author">
                  <div>N</div>

                  <span>
                    <strong>Nebula Bot</strong>
                    <small>BOT</small>
                  </span>
                </div>

                <div
                  id="verifyPreviewEmbed"
                  class="verify-preview-embed"
                >
                  <strong id="verifyPreviewTitle">
                    ${escapeHtml(
                      config.embedTitle ||
                      "Verificación del servidor"
                    )}
                  </strong>

                  <p id="verifyPreviewDescription">
                    ${escapeHtml(
                      config.embedDescription || ""
                    )}
                  </p>

                  <small>
                    ${escapeHtml(servidor.name)}
                  </small>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewEmoji">
                    ${escapeHtml(
                      config.buttonEmoji || "✅"
                    )}
                  </span>

                  <span id="verifyPreviewButtonText">
                    ${escapeHtml(
                      config.buttonText ||
                      "Verificarme"
                    )}
                  </span>
                </button>
              </div>
            </article>

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
                <h3>Logs de verificación</h3>
              </div>
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
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>WEB DE VERIFICACIÓN</span>
                <h3>Apariencia</h3>
              </div>
            </div>

            <label class="welcome-field">
              <span>NOMBRE DE LA PÁGINA</span>

              <input
                id="verifyPageName"
                value="${escapeHtmlAttribute(
                  currentAppearance.pageName
                )}"
              >
            </label>

            <label class="welcome-field">
              <span>COLOR PRINCIPAL</span>

              <div class="welcome-color-row">
                <input
                  id="verifyPrimaryColor"
                  type="color"
                  value="${
                    currentAppearance.primaryColor
                  }"
                >

                <input
                  id="verifyPrimaryColorText"
                  value="${
                    currentAppearance.primaryColor
                  }"
                  maxlength="7"
                >
              </div>
            </label>

            ${createToggle(
              "verifyAnimationsEnabled",
              "Animaciones",
              "Activa los efectos de movimiento.",
              currentAppearance.animationsEnabled
            )}

            ${createToggle(
              "verifySpaceBackground",
              "Fondo espacial",
              "Muestra partículas y estrellas.",
              currentAppearance.spaceBackground
            )}

            ${createToggle(
              "verifyVerificationSound",
              "Sonido al verificar",
              "Reproduce un sonido al finalizar.",
              currentAppearance.verificationSound
            )}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANTIDAD DE PARTÍCULAS</span>

                <input
                  id="verifyParticleCount"
                  type="number"
                  min="20"
                  max="250"
                  value="${
                    currentAppearance.particleCount
                  }"
                >
              </label>

              <label class="welcome-field">
                <span>INTENSIDAD DEL BRILLO</span>

                <input
                  id="verifyGlowIntensity"
                  type="number"
                  min="0"
                  max="100"
                  value="${
                    currentAppearance.glowIntensity
                  }"
                >
              </label>
            </div>
          </article>
        </section>

        <!-- SEGURIDAD -->

        <section
          class="verify-tab-panel"
          data-verify-panel="security"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>PROTECCIÓN</span>
                <h3>Reglas de seguridad</h3>
              </div>
            </div>

            <div class="verify-options-grid">
              ${createToggle(
                "verifyDetectVpn",
                "Detectar VPN",
                "Marca conexiones que podrían utilizar VPN.",
                currentSecurity.detectVpn
              )}

              ${createToggle(
                "verifyDetectProxy",
                "Detectar proxy",
                "Marca conexiones mediante proxy.",
                currentSecurity.detectProxy
              )}

              ${createToggle(
                "verifyDetectTor",
                "Detectar Tor",
                "Marca conexiones de la red Tor.",
                currentSecurity.detectTor
              )}

              ${createToggle(
                "verifyDetectAltAccounts",
                "Detectar multicuentas",
                "Busca señales de cuentas duplicadas.",
                currentSecurity.detectAltAccounts
              )}

              ${createToggle(
                "verifyBlockWithoutAvatar",
                "Bloquear sin avatar",
                "Impide verificar cuentas sin foto.",
                currentSecurity.blockWithoutAvatar
              )}

              ${createToggle(
                "verifyBlockWithoutBanner",
                "Bloquear sin banner",
                "Impide verificar cuentas sin banner.",
                currentSecurity.blockWithoutBanner
              )}

              ${createToggle(
                "verifyAllowReverification",
                "Permitir reverificación",
                "Permite verificar nuevamente.",
                currentSecurity.allowReverification
              )}

              ${createToggle(
                "verifyNotifySecurityFailure",
                "Registrar bloqueos",
                "Envía un log cuando una regla falla.",
                currentSecurity.notifySecurityFailure
              )}
            </div>

            ${createToggle(
              "verifyMinimumAgeEnabled",
              "Edad mínima de la cuenta",
              "Bloquea cuentas demasiado nuevas.",
              currentSecurity.minimumAccountAgeEnabled
            )}

            <label class="welcome-field">
              <span>DÍAS MÍNIMOS DE ANTIGÜEDAD</span>

              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${
                  currentSecurity.minimumAccountAgeDays
                }"
              >
            </label>
          </article>
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

  const getElement =
    id => document.getElementById(id);

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

    webAppearance: {
      pageName:
        getElement("verifyPageName").value,

      primaryColor:
        getElement(
          "verifyPrimaryColor"
        ).value,

      animationsEnabled:
        getElement(
          "verifyAnimationsEnabled"
        ).checked,

      spaceBackground:
        getElement(
          "verifySpaceBackground"
        ).checked,

      particleCount:
        Number(
          getElement(
            "verifyParticleCount"
          ).value
        ),

      glowIntensity:
        Number(
          getElement(
            "verifyGlowIntensity"
          ).value
        ),

      verificationSound:
        getElement(
          "verifyVerificationSound"
        ).checked,
    },

    security: {
      detectVpn:
        getElement("verifyDetectVpn").checked,

      detectProxy:
        getElement(
          "verifyDetectProxy"
        ).checked,

      detectTor:
        getElement("verifyDetectTor").checked,

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
    },
  });

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

  syncColors(
    "verifyPrimaryColor",
    "verifyPrimaryColorText"
  );

  const updatePreview = () => {
    getElement(
      "verifyPreviewTitle"
    ).textContent =
      getElement("verifyEmbedTitle").value;

    getElement(
      "verifyPreviewDescription"
    ).textContent =
      getElement(
        "verifyEmbedDescription"
      ).value;

    getElement(
      "verifyPreviewEmoji"
    ).textContent =
      getElement("verifyButtonEmoji").value;

    getElement(
      "verifyPreviewButtonText"
    ).textContent =
      getElement("verifyButtonText").value;

    getElement(
      "verifyPreviewEmbed"
    ).style.borderLeftColor =
      getElement("verifyEmbedColor").value;
  };

  [
    "verifyEmbedTitle",
    "verifyEmbedDescription",
    "verifyButtonEmoji",
    "verifyButtonText",
    "verifyEmbedColor",
  ].forEach(id => {
    getElement(id)?.addEventListener(
      "input",
      updatePreview
    );
  });

  updatePreview();

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
              <h3>Mensaje de ingreso</h3>
            </div>
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
            <div class="preview-bot-avatar">N</div>

            <div class="preview-message-content">
              <div class="preview-author">
                Nebula Bot
                <small>BOT</small>
                <time>Ahora</time>
              </div>

              <div
                class="preview-embed"
                id="welcomePreviewEmbed"
              >
                <strong id="welcomePreviewTitle"></strong>
                <p id="welcomePreviewMessage"></p>

                <div class="preview-member">
                  <div>AM</div>

                  <span>
                    <strong>Alvi Moreyra</strong>
                    Nuevo miembro
                  </span>
                </div>

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
    <div class="preview-bot-avatar">N</div>

    <div class="preview-message-content">
      <div class="preview-author">
        Nebula Bot
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
          class="preview-member"
        >
          <div>AM</div>

          <span>
            <strong>Alvi Moreyra</strong>
            Mensaje privado
          </span>
        </div>

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

 function updatePreview() {
  // Vista previa pública
  const title = replacePreviewVariables(
    titleInput.value,
    servidor
  );

  const message = replacePreviewVariables(
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

  const publicAvatar = document.querySelector(
    "#welcomePreviewEmbed .preview-member"
  );

  if (publicAvatar) {
    publicAvatar.style.display =
      showAvatarInput.checked ? "flex" : "none";
  }

  // Vista previa del mensaje privado
  const dmTitle = replacePreviewVariables(
    dmTitleInput.value,
    servidor
  );

  const dmMessage = replacePreviewVariables(
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

  document.getElementById(
    "welcomeDmPreviewAvatar"
  ).style.display =
    dmShowAvatarInput.checked
      ? "flex"
      : "none";
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

function replacePreviewVariables(text, servidor) {
  return String(text)
    .replaceAll("{user}", "@Alvi Moreyra")
    .replaceAll("{mention}", "@Alvi Moreyra")
    .replaceAll("{username}", "Alvi")
    .replaceAll("{displayname}", "Alvi Moreyra")
    .replaceAll(
      "{userid}",
      "123456789012345678"
    )
    .replaceAll("{server}", servidor.name)
    .replaceAll("{serverid}", servidor.id)
    .replaceAll(
      "{members}",
      servidor.members.toLocaleString("es-AR")
    )
    .replaceAll(
      "{membercount}",
      servidor.members.toLocaleString("es-AR")
    )
    .replaceAll(
      "{joindate}",
      new Date().toLocaleDateString("es-AR")
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
