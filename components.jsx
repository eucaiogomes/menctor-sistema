/* global React */
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ════════════════════════════════════════════════════════════
// ICONS — small inline SVGs, stroke-based, calmer than emoji
// ════════════════════════════════════════════════════════════
const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.6, style }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "home":     return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case "pulse":    return <svg {...props}><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>;
    case "users":    return <svg {...props}><circle cx="9" cy="9" r="3.2"/><path d="M3 20c0-3 2.6-5 6-5s6 2 6 5"/><circle cx="17" cy="8.5" r="2.5"/><path d="M16 14.5c2.5.3 5 1.8 5 4.5"/></svg>;
    case "book":     return <svg {...props}><path d="M4 4h7a3 3 0 0 1 3 3v13"/><path d="M20 4h-7a3 3 0 0 0-3 3"/><path d="M4 4v15h7"/><path d="M20 4v15h-7"/></svg>;
    case "search":   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "bell":     return <svg {...props}><path d="M6 16V11a6 6 0 0 1 12 0v5"/><path d="M4 16h16"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case "plus":     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "chevron-down":  return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-left":  return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case "arrow-right":   return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-up":      return <svg {...props}><path d="M12 19V5M6 11l6-6 6 6"/></svg>;
    case "arrow-down":    return <svg {...props}><path d="M12 5v14M6 13l6 6 6-6"/></svg>;
    case "leaf":     return <svg {...props}><path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16Z"/><path d="M4 20c4-4 8-8 12-12"/></svg>;
    case "shield":   return <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>;
    case "spark":    return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    case "file":     return <svg {...props}><path d="M14 3H6v18h12V7l-4-4Z"/><path d="M14 3v4h4"/></svg>;
    case "download": return <svg {...props}><path d="M12 4v12M6 11l6 6 6-6"/><path d="M4 20h16"/></svg>;
    case "filter":   return <svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    case "check":    return <svg {...props}><path d="m4 12 5 5L20 6"/></svg>;
    case "x":        return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "more":     return <svg {...props}><circle cx="6" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.5" fill={color} stroke="none"/><circle cx="18" cy="12" r="1.5" fill={color} stroke="none"/></svg>;
    case "external": return <svg {...props}><path d="M14 4h6v6M20 4 10 14"/><path d="M19 13v6H5V5h6"/></svg>;
    case "link":     return <svg {...props}><path d="M10 14a4 4 0 0 0 5.5 0l3-3a4 4 0 1 0-5.5-5.5L12 7"/><path d="M14 10a4 4 0 0 0-5.5 0l-3 3a4 4 0 1 0 5.5 5.5L12 17"/></svg>;
    case "send":     return <svg {...props}><path d="m4 12 16-8-6 18-3-7-7-3Z"/></svg>;
    case "calendar": return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case "drag":     return <svg {...props}><circle cx="9" cy="6" r="1" fill={color} stroke="none"/><circle cx="9" cy="12" r="1" fill={color} stroke="none"/><circle cx="9" cy="18" r="1" fill={color} stroke="none"/><circle cx="15" cy="6" r="1" fill={color} stroke="none"/><circle cx="15" cy="12" r="1" fill={color} stroke="none"/><circle cx="15" cy="18" r="1" fill={color} stroke="none"/></svg>;
    case "trash":    return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case "edit":     return <svg {...props}><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m14 5 4 4"/></svg>;
    case "eye":      return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "sparkles": return <svg {...props}><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></svg>;
    case "command":  return <svg {...props}><path d="M9 6V18M15 6V18M6 9h12M6 15h12"/></svg>;
    case "logout":   return <svg {...props}><path d="M9 4H5v16h4"/><path d="m15 8 4 4-4 4"/><path d="M19 12H9"/></svg>;
    case "globe":    return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>;
    default:         return null;
  }
};

// ════════════════════════════════════════════════════════════
// LOGO
// ════════════════════════════════════════════════════════════
const Logo = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: "linear-gradient(135deg, #2F7D6F 0%, #5BAD72 60%, #E87722 130%)",
      position: "relative", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)"
    }}>
      <div style={{
        position: "absolute", inset: 6,
        background: "var(--canvas)",
        borderRadius: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: size * 0.55, color: "#2F7D6F", lineHeight: 1
      }}>m</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>menctor</span>
      <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-muted)", textTransform: "uppercase", marginTop: 1 }}>by lector</span>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home",         icon: "home",    label: "Visão geral" },
  { id: "diagnosticos", icon: "pulse",   label: "Diagnósticos" },
  { id: "clientes",     icon: "users",   label: "Clientes" },
  { id: "relatorios",   icon: "file",    label: "Relatórios finais" },
  { id: "aprendizado",  icon: "book",    label: "Aprendizado" },
];

const Sidebar = ({ active, onNavigate }) => {
  return (
    <aside style={{
      width: 240, flexShrink: 0, height: "100vh",
      background: "var(--canvas)", borderRight: "1px solid var(--line)",
      display: "flex", flexDirection: "column",
      padding: "22px 16px 20px",
      position: "sticky", top: 0
    }}>
      <div style={{ padding: "4px 8px 24px" }}><Logo /></div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                color: isActive ? "var(--ink)" : "var(--ink-soft)",
                background: isActive ? "var(--surface)" : "transparent",
                boxShadow: isActive ? "var(--shadow-card)" : "none",
                textAlign: "left"
              }}>
              <Icon name={item.icon} size={18} strokeWidth={isActive ? 1.8 : 1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 28, padding: "0 12px 8px" }}>
        <div className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>Atalhos</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <button
          onClick={() => {
            const currentUrl = localStorage.getItem('RELATORIO_API_URL') || 'http://localhost:5000';
            const newUrl = prompt('Configurar URL da API de Relatório (Ex: https://sua-api.render.com):', currentUrl);
            if (newUrl !== null) {
              const formattedUrl = newUrl.trim().replace(/\/$/, ""); // remove trailing slash
              localStorage.setItem('RELATORIO_API_URL', formattedUrl);
              alert('URL da API atualizada com sucesso!');
              window.location.reload();
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, fontSize: 14, color: "var(--ink-soft)", textAlign: "left", cursor: "pointer", width: "100%", border: "none", background: "none" }}>
          <Icon name="settings" size={16} strokeWidth={1.5} />
          <span>Ajustes</span>
        </button>
      </div>

      <div style={{ marginTop: "auto", padding: 12, borderRadius: 14, background: "var(--surface-sage)" }}>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20, lineHeight: 1.1, color: "var(--health-deep)" }}>
          NR-1 com<br/>tranquilidade.
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: "8px 0 12px" }}>
          Manual atualizado de conformidade psicossocial 2026.
        </p>
        <button className="btn btn-health" style={{ height: 32, fontSize: 12.5, padding: "0 12px" }}>
          Ver manual <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </aside>
  );
};

// ════════════════════════════════════════════════════════════
// TOP BAR — Perplexity-style centered search
// ════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════
// ROLE SWITCHER — fixed top-right pill to swap profile
// ════════════════════════════════════════════════════════════
const ROLES = [
  { id: "credenciado", label: "Credenciado", sub: "Caio Guedes · Consultor Lector",     color: "#2F7D6F", inits: "CG" },
  { id: "admin",       label: "Admin RH",    sub: "Mariana Aguiar · Loghaus",            color: "#1B8CA6", inits: "MA" },
  { id: "aluno",       label: "Aluno",       sub: "Roberto Tavares · Colaborador",       color: "#D89A3F", inits: "RT" },
];

const RoleSwitcher = ({ role, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const current = ROLES.find(r => r.id === role);
  return (
    <div style={{ position: "fixed", top: 18, right: 24, zIndex: 200 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 8px 6px 14px",
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 999, fontSize: 13, color: "var(--ink)",
        boxShadow: "var(--shadow-pop)"
      }}>
        <span style={{ fontSize: 10.5, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Perfil</span>
        <span style={{ fontWeight: 600 }}>{current.label}</span>
        <span style={{ width: 28, height: 28, borderRadius: 999, background: current.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{current.inits}</span>
        <Icon name="chevron-down" size={13} color="var(--ink-muted)"/>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 280, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "var(--shadow-modal)", padding: 6 }}>
          <div style={{ padding: "8px 12px 6px", fontSize: 10.5, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trocar de perfil (demo)</div>
          {ROLES.map(r => {
            const active = r.id === role;
            return (
              <button key={r.id} onClick={() => { onChange(r.id); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10,
                background: active ? "var(--surface-sage)" : "transparent",
                width: "100%", textAlign: "left"
              }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: r.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.inits}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 1 }}>{r.sub}</div>
                </div>
                {active && <Icon name="check" size={14} color="var(--health)"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TopBar = ({ role, onChangeRole, title, subtitle, breadcrumb }) => {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 36px 0",
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        {breadcrumb && (
          <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginBottom: 4 }}>
            {breadcrumb.map((c, i) => (
              <span key={i}>
                {i > 0 && <span style={{ margin: "0 6px" }}>/</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? "var(--ink-soft)" : "var(--ink-muted)" }}>{c}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="display" style={{ fontSize: 36, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: "6px 0 0", color: "var(--ink-muted)", fontSize: 14.5, maxWidth: 640 }}>{subtitle}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 24 }}>
        <button className="btn btn-soft" style={{ height: 36, padding: "0 14px", fontSize: 13 }}>
          <Icon name="search" size={15} />
          <span>Buscar</span>
          <span style={{ color: "var(--ink-muted)", fontSize: 11, marginLeft: 4 }}>⌘K</span>
        </button>
        <button className="btn btn-soft" style={{ height: 36, width: 36, padding: 0, justifyContent: "center" }}>
          <Icon name="bell" size={16} />
        </button>
        <button
          onClick={onChangeRole}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "5px 6px 5px 12px",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            fontSize: 13, color: "var(--ink)", fontWeight: 500
          }}>
          <span style={{ color: "var(--ink-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{role}</span>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--health)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>CG</span>
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// LAYOUT WRAPPER
// ════════════════════════════════════════════════════════════
const Page = ({ children }) => (
  <main style={{ padding: "28px 40px 60px" }}>
    {children}
  </main>
);

// ════════════════════════════════════════════════════════════
// RISK MEDALLION — small circular indicator for COPSOQ score
// ════════════════════════════════════════════════════════════
const RiskMedallion = ({ value, max = 4, size = 64 }) => {
  // value 0-4. 0-1 baixo (health), 1.5-2.5 moderado (amber), 2.5+ alto (coral)
  const color = value >= 2.5 ? "var(--coral)" : value >= 1.5 ? "var(--amber)" : "var(--health)";
  const pct = Math.min(1, value / max);
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: size * 0.42, lineHeight: 1, color: "var(--ink)" }}>{value.toFixed(1)}</div>
        <div style={{ fontSize: 9, color: "var(--ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>/ {max}</div>
      </div>
    </div>
  );
};

const riskLabel = (v) => v >= 2.5 ? "Alto risco" : v >= 1.5 ? "Moderado" : "Saudável";
const riskPill  = (v) => v >= 2.5 ? "pill-coral" : v >= 1.5 ? "pill-amber" : "pill";

Object.assign(window, { Icon, Logo, Sidebar, TopBar, Page, RiskMedallion, riskLabel, riskPill, NAV_ITEMS, RoleSwitcher, ROLES });
