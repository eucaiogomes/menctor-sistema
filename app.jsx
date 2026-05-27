/* global React, ReactDOM, Sidebar, AdminSidebar, HomeScreen, DiagnosticosScreen, DiagnosticoDetalheScreen, ClientesScreen, AprendizadoScreen, PortalPropostaScreen, AdminHome, AdminColaboradores, AdminVitrine, RelatoriosFinaisScreen, AlunoApp, RoleSwitcher */
const { useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentRole": "health",
  "density": "comfortable",
  "headlineFont": "serif"
}/*EDITMODE-END*/;

function App() {
  const [role, setRole]   = useState("credenciado");
  const [route, setRoute] = useState({ screen: "home", params: {} });

  const navigate = (screen, params = {}) => {
    setRoute({ screen, params });
    window.scrollTo(0, 0);
  };

  const switchRole = (r) => {
    setRole(r);
    if (r === "credenciado") setRoute({ screen: "home", params: {} });
    if (r === "admin")       setRoute({ screen: "admin-home", params: {} });
    if (r === "aluno")       setRoute({ screen: "aluno", params: {} });
  };

  // ─── ALUNO experience: own shell, no sidebar ──────────────
  if (role === "aluno") {
    return (
      <div data-screen-label="Menctor / aluno">
        <RoleSwitcher role={role} onChange={switchRole} />
        <AlunoApp />
      </div>
    );
  }

  // ─── PORTAL DE PROPOSTA — standalone (deprecated — kept for back-compat) ──
  if (route.screen === "portal") {
    return (
      <>
        <RoleSwitcher role={role} onChange={switchRole} />
        <PortalPropostaScreen onExit={() => navigate("clientes", { tab: "pipeline" })} />
      </>
    );
  }

  // ─── ADMIN experience ─────────────────────────────────────
  if (role === "admin") {
    return (
      <div data-screen-label={`Menctor / admin / ${route.screen}`} style={{ display: "flex", minHeight: "100vh", background: "var(--canvas)" }}>
        <RoleSwitcher role={role} onChange={switchRole} />
        <AdminSidebar
          active={route.screen.startsWith("admin-") ? route.screen : "admin-home"}
          onNavigate={(s) => navigate(s)}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          {(route.screen === "admin-home" || route.screen === "home") && <AdminHome navigate={navigate} />}
          {route.screen === "admin-diagnosticos" && <DiagnosticosScreen navigate={navigate} initialCreate={route.params.create} />}
          {route.screen === "admin-relatorios"   && <RelatoriosFinaisScreen navigate={navigate} />}
          {route.screen === "admin-colaboradores" && <AdminColaboradores />}
          {route.screen === "admin-vitrine" && <AdminVitrine />}
          {route.screen === "admin-aprendizado" && <AprendizadoScreen navigate={navigate} />}
          {route.screen === "diagnostico-detalhe" && <DiagnosticoDetalheScreen navigate={(s, params = {})=>navigate(s.startsWith("admin")?s:`admin-${s==="diagnosticos"?"diagnosticos":"home"}`, params)} avaliacao={route.params.avaliacao} cliente={route.params.cliente} />}
        </div>
      </div>
    );
  }

  // ─── CREDENCIADO experience (default) ─────────────────────
  return (
    <div data-screen-label={`Menctor / credenciado / ${route.screen}`} style={{ display: "flex", minHeight: "100vh", background: "var(--canvas)" }}>
      <RoleSwitcher role={role} onChange={switchRole} />
      <Sidebar
        active={route.screen.startsWith("diagnostico") ? "diagnosticos" : route.screen}
        onNavigate={(s) => navigate(s)}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        {route.screen === "home"          && <HomeScreen          navigate={navigate} />}
        {route.screen === "diagnosticos"  && <DiagnosticosScreen  navigate={navigate} initialCreate={route.params.create} />}
        {route.screen === "diagnostico-detalhe" && <DiagnosticoDetalheScreen navigate={navigate} avaliacao={route.params.avaliacao} cliente={route.params.cliente} />}
        {route.screen === "clientes"      && <ClientesScreen      navigate={navigate} initialTab={route.params.tab} />}
        {route.screen === "relatorios"    && <RelatoriosFinaisScreen navigate={navigate} />}
        {route.screen === "aprendizado"   && <AprendizadoScreen   navigate={navigate} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
