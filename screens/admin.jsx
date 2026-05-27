/* global React, Icon, Logo */

// ════════════════════════════════════════════════════════════
// ADMIN RH SHELL — Loghaus' HR view. Single-company, applied focus.
// ════════════════════════════════════════════════════════════

const ADMIN_NAV = [
  { id: "admin-home",         icon: "home",     label: "Visão geral" },
  { id: "admin-diagnosticos", icon: "pulse",    label: "Diagnósticos" },
  { id: "admin-colaboradores",icon: "users",    label: "Colaboradores" },
  { id: "admin-vitrine",      icon: "globe",    label: "Vitrine" },
  { id: "admin-aprendizado",  icon: "book",     label: "Aprendizado" },
];

// Loghaus brand (the client company) — distinct from Menctor
const LoghausLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: "#1C4B82",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden"
    }}>
      {/* stylized L + arrow (logistics) */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 4v14h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 14l4 4-4 4" stroke="#E87722" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 -6)"/>
      </svg>
    </div>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: "#1C4B82", letterSpacing: "-0.01em" }}>LOGHAUS</span>
      <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-muted)", textTransform: "uppercase", marginTop: 3 }}>logística</span>
    </div>
  </div>
);

const AdminSidebar = ({ active, onNavigate }) => (
  <aside style={{
    width: 240, flexShrink: 0, height: "100vh",
    background: "#F2F4F7",
    borderRight: "1px solid #DEE2E8",
    display: "flex", flexDirection: "column",
    padding: "22px 16px 20px", position: "sticky", top: 0
  }}>
    <div style={{ padding: "4px 8px 22px" }}><LoghausLogo /></div>

    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {ADMIN_NAV.map(item => {
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 10,
            fontSize: 14, fontWeight: 500,
            color: isActive ? "#1C4B82" : "var(--ink-soft)",
            background: isActive ? "#fff" : "transparent",
            boxShadow: isActive ? "0 1px 2px rgba(28,75,130,.08)" : "none",
            borderLeft: isActive ? "2px solid #1C4B82" : "2px solid transparent",
            textAlign: "left"
          }}>
            <Icon name={item.icon} size={18} strokeWidth={isActive ? 1.9 : 1.5} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ padding: 14, borderRadius: 14, background: "#fff", border: "1px solid #DEE2E8" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1C4B82", lineHeight: 1.2 }}>
          Suporte do consultor
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-muted)", margin: "6px 0 10px" }}>
          Caio Guedes responde em até 24h.
        </p>
        <button style={{ height: 30, fontSize: 12, padding: "0 12px", borderRadius: 999, background: "#1C4B82", color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}>
          Falar com Caio <Icon name="arrow-right" size={12} />
        </button>
      </div>
      {/* powered by — small Menctor mention */}
      <div style={{ padding: "6px 8px", fontSize: 10.5, color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: 6 }}>
        Saúde psicossocial por
        <span style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 13, color: "var(--ink-muted)" }}>menctor</span>
      </div>
    </div>
  </aside>
);

// ════════════════════════════════════════════════════════════
// ADMIN HOME — single company NR-1 view, filtered by setor
// ════════════════════════════════════════════════════════════
const SETORES = [
  { id: "ops",    nome: "Operações",     colab: 142, risco: 2.61, adesao: 94 },
  { id: "adm",    nome: "Administrativo", colab: 48,  risco: 2.04, adesao: 89 },
  { id: "com",    nome: "Comercial",     colab: 72,  risco: 2.32, adesao: 87 },
  { id: "log",    nome: "Logística",     colab: 64,  risco: 2.18, adesao: 92 },
  { id: "ti",     nome: "Tecnologia",    colab: 14,  risco: 1.86, adesao: 100 },
];

const AdminHome = ({ navigate }) => {
  const media = SETORES.reduce((s,x) => s + x.risco * x.colab, 0) / SETORES.reduce((s,x) => s + x.colab, 0);
  return (
    <Page>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Quinta · 27 de maio · Loghaus Logística</div>
        <h1 className="display" style={{ fontSize: 48, margin: 0, lineHeight: 1.05 }}>
          Bom dia, Mariana.
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 16, color: "var(--ink-soft)", maxWidth: 620, lineHeight: 1.5 }}>
          O Caio Guedes acaba de disponibilizar a <strong style={{ color: "var(--ink)" }}>Pesquisa de Clima 1º Trim/2026</strong>. 312 dos seus 340 colaboradores já responderam.
        </p>
      </div>

      {/* Action banner */}
      <div className="card" style={{ padding: 20, marginBottom: 24, display: "flex", gap: 18, alignItems: "center", background: "linear-gradient(135deg, var(--surface-peach), var(--surface))", border: "1px solid #F4D5BA" }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--orange-deep)" }}>
          <Icon name="send" size={20}/>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--orange-deep)", marginBottom: 4 }}>Ação requerida</div>
          <div style={{ fontSize: 15, color: "var(--ink)" }}>
            <strong>28 colaboradores ainda não responderam</strong> a Pesquisa de Clima. Que tal enviar um lembrete?
          </div>
        </div>
        <button className="btn btn-accent" style={{ height: 36 }}>Enviar lembrete <Icon name="send" size={13}/></button>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 20 }}>
          <RiskMedallion value={media} size={84}/>
          <div>
            <div className="eyebrow">Saúde NR-1 Loghaus</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 26, color: "var(--ink)", lineHeight: 1.1, marginTop: 4 }}>
              {media < 2.5 ? "Dentro do limite" : "Acima do limite"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 4 }}>
              <span style={{ color: "var(--health)" }}>↓ 0.22</span> vs trimestre anterior
            </div>
          </div>
        </div>
        <AStat label="Colaboradores"   value="340" sub="ativos no sistema" icon="users" />
        <AStat label="Adesão atual"    value="92%" sub="312 / 340 respostas" icon="check" />
        <AStat label="Próxima ação"    value="Workshop" sub="Operações · 02/jun" icon="calendar" />
      </div>

      {/* Setores grid */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <h2 className="display" style={{ fontSize: 26, margin: 0 }}>Saúde por setor</h2>
          <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--canvas-warm)", borderRadius: 999 }}>
            <button style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "var(--surface)", boxShadow: "var(--shadow-card)" }}>Setor</button>
            <button style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, color: "var(--ink-muted)" }}>Unidade</button>
            <button style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, color: "var(--ink-muted)" }}>Turno</button>
          </div>
        </div>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--ink-muted)" }}>
          Recorte da pesquisa atual. Clique para ver o detalhamento por dimensão COPSOQ.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {SETORES.map(s => {
            const color = s.risco >= 2.5 ? "var(--coral)" : s.risco >= 1.5 ? "var(--amber)" : "var(--health)";
            return (
              <button key={s.id} style={{ padding: 18, borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--line)", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{s.nome}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{s.colab} colab.</div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 32, color, lineHeight: 1 }}>{s.risco.toFixed(2)}</div>
                  <div className={`pill ${riskPill(s.risco)}`} style={{ fontSize: 10.5 }}>{riskLabel(s.risco)}</div>
                </div>
                <div style={{ position: "relative", height: 5, background: "var(--canvas-warm)", borderRadius: 99 }}>
                  <div style={{ position: "absolute", inset: 0, width: `${(s.risco/4)*100}%`, background: color, borderRadius: 99 }} />
                  <div style={{ position: "absolute", left: "62.5%", top: -2, bottom: -2, width: 1, background: "var(--ink-faint)" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 8 }}>Adesão {s.adesao}%</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Atividade recente */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        <div className="card" style={{ padding: 26 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Diagnósticos disponíveis</h3>
          {AVALIACOES_ATIVAS.filter(a => a.cliente === "Loghaus").concat([
            { id: "x", titulo: "Pulse Bem-Estar abril",  periodo: "Mar/2026", cliente: "Loghaus", code: "PULSO-ABR", media: null, status: "Aguardando", adesao: 0, alvo: 340, respondidos: 0 }
          ]).map((a,i) => (
            <div key={a.id+i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, padding: "14px 0", borderTop: i > 0 ? "1px dashed var(--line-strong)" : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{a.titulo}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{a.periodo} · enviado pelo Caio</div>
              </div>
              <span className={`pill ${a.status === "Em campo" ? "pill" : "pill-amber"}`} style={{ fontSize: 11 }}>
                {a.status === "Em campo" && <span className="dot" style={{ background: "var(--health)" }} />}
                {a.status}
              </span>
              <button className="btn btn-soft" style={{ height: 32, fontSize: 12 }}>
                {a.status === "Aguardando" ? "Aplicar agora" : "Ver resultados"} <Icon name="arrow-right" size={12}/>
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 26 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Plano de ação ativo</h3>
          <ActionItem index={1} title="Workshop anti-burnout · Operações" tag="02/jun · 14h" />
          <ActionItem index={2} title="Conversas 1:1 com gestores em risco" tag="Em andamento" />
          <ActionItem index={3} title="Revisão de carga horária" tag="Concluído" />
          <button className="btn btn-soft" style={{ width: "100%", justifyContent: "center", marginTop: 14, height: 34, fontSize: 13 }}>
            Ver plano completo <Icon name="arrow-right" size={13}/>
          </button>
        </div>
      </div>
    </Page>
  );
};

const AStat = ({ label, value, sub, icon }) => (
  <div className="card" style={{ padding: 22 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--ink-muted)" }}>
      <Icon name={icon} size={14}/>
      <span style={{ fontSize: 12.5 }}>{label}</span>
    </div>
    <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 32, lineHeight: 1, color: "var(--ink)" }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 6 }}>{sub}</div>
  </div>
);

// ════════════════════════════════════════════════════════════
// ADMIN COLABORADORES — Simplified user list (no more 6 tabs)
// ════════════════════════════════════════════════════════════

const COLABORADORES = [
  { id: 1, nome: "Mariana Aguiar",    cargo: "Gerente de RH",         setor: "Administrativo", perfil: "Admin",  status: "ativo",   risco: 1.8, adesao: "100%" },
  { id: 2, nome: "Pedro Santos",      cargo: "Coordenador de Frota",  setor: "Operações",      perfil: "Líder",  status: "ativo",   risco: 2.7, adesao: "100%" },
  { id: 3, nome: "Camila Lopes",      cargo: "Analista comercial",    setor: "Comercial",      perfil: "Colab.", status: "ativo",   risco: 2.1, adesao: "100%" },
  { id: 4, nome: "Roberto Tavares",   cargo: "Motorista CNH-E",        setor: "Logística",      perfil: "Colab.", status: "ativo",   risco: 2.3, adesao: "67%"  },
  { id: 5, nome: "Daniela Marques",   cargo: "Assistente operacional", setor: "Operações",      perfil: "Colab.", status: "ativo",   risco: null,adesao: "—"    },
  { id: 6, nome: "André Pinheiro",    cargo: "Dev. backend",           setor: "Tecnologia",     perfil: "Colab.", status: "convite", risco: null,adesao: "—"    },
  { id: 7, nome: "Letícia Brandão",   cargo: "Analista financeira",   setor: "Administrativo", perfil: "Colab.", status: "ativo",   risco: 2.0, adesao: "100%" },
  { id: 8, nome: "Bruno Tavares",     cargo: "Supervisor logístico",  setor: "Logística",      perfil: "Líder",  status: "ativo",   risco: 1.9, adesao: "100%" },
];

const AdminColaboradores = () => {
  const [editing, setEditing] = React.useState(null);
  const [filter, setFilter] = React.useState("todos");
  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Gestão de pessoas</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Colaboradores</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
            340 colaboradores · 312 ativos · 28 com convite pendente
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-soft" style={{ height: 38 }}><Icon name="download" size={14}/> Importar CSV</button>
          <button className="btn btn-accent" style={{ height: 38 }}><Icon name="plus" size={14}/> Convidar</button>
        </div>
      </div>

      {/* filter row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--canvas-warm)", borderRadius: 999 }}>
          {["Todos", "Ativos", "Convite pendente", "Em risco"].map((t,i) => {
            const id = ["todos","ativos","convite","risco"][i];
            const active = filter === id;
            return (
              <button key={id} onClick={() => setFilter(id)} style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: active ? 600 : 500, background: active ? "var(--surface)" : "transparent", color: active ? "var(--ink)" : "var(--ink-muted)", boxShadow: active ? "var(--shadow-card)" : "none" }}>{t}</button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-soft" style={{ height: 34, fontSize: 13 }}><Icon name="filter" size={13}/> Setor · Perfil</button>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr auto", gap: 16, padding: "14px 22px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
          <span>Colaborador</span>
          <span>Cargo</span>
          <span>Setor</span>
          <span>Perfil</span>
          <span>Risco NR-1</span>
          <span>Adesão</span>
          <span style={{ width: 32 }}></span>
        </div>
        {COLABORADORES.map((c, i) => (
          <button key={c.id} onClick={() => setEditing(c)} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr auto", gap: 16, padding: "14px 22px", borderTop: i > 0 ? "1px solid var(--line)" : "none", textAlign: "left", width: "100%", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 34, height: 34, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 15 }}>
                {c.nome.split(" ").map(x => x[0]).slice(0,2).join("")}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.nome}</div>
                {c.status === "convite" && <div style={{ fontSize: 11, color: "var(--amber)", marginTop: 2 }}>Convite pendente</div>}
              </div>
            </div>
            <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{c.cargo}</span>
            <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{c.setor}</span>
            <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{c.perfil}</span>
            <span>{c.risco ? <span className={`pill ${riskPill(c.risco)}`} style={{ fontSize: 10.5 }}>{c.risco.toFixed(1)}</span> : <span style={{ color: "var(--ink-faint)", fontSize: 13 }}>—</span>}</span>
            <span style={{ fontSize: 13, color: c.adesao === "100%" ? "var(--health-deep)" : "var(--ink-soft)" }}>{c.adesao}</span>
            <span style={{ width: 32, color: "var(--ink-muted)" }}><Icon name="chevron-right" size={16}/></span>
          </button>
        ))}
      </div>

      {editing && <UserDrawer user={editing} onClose={() => setEditing(null)} />}
    </Page>
  );
};

// 6 tabs → 3 tabs drawer
const UserDrawer = ({ user, onClose }) => {
  const [tab, setTab] = React.useState("geral");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(31,36,33,0.36)", zIndex: 300, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 520, maxWidth: "92vw", height: "100vh", background: "var(--canvas)", boxShadow: "var(--shadow-modal)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 26px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 44, height: 44, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18 }}>
              {user.nome.split(" ").map(x => x[0]).slice(0,2).join("")}
            </span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{user.nome}</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{user.cargo} · {user.setor}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)" }}>
            <Icon name="x" size={16}/>
          </button>
        </div>

        <div style={{ padding: "0 26px", display: "flex", gap: 4, borderBottom: "1px solid var(--line)" }}>
          {[["geral","Perfil"],["acesso","Acesso & permissões"],["aprendizado","Aprendizado"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 4px", marginRight: 18, borderBottom: `2px solid ${tab===id ? "var(--ink)" : "transparent"}`, color: tab===id ? "var(--ink)" : "var(--ink-muted)", fontSize: 13.5, fontWeight: tab===id ? 600 : 500 }}>{label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 26 }}>
          {tab === "geral" && <DrawerSection rows={[
            ["Nome completo", user.nome],
            ["E-mail corporativo", user.nome.toLowerCase().replace(" ", ".") + "@loghaus.com.br"],
            ["Cargo", user.cargo],
            ["Setor", user.setor],
            ["Unidade", "Matriz · São Paulo"],
            ["Data de admissão", "12/03/2022"],
          ]} />}
          {tab === "acesso" && <>
            <DrawerSection rows={[
              ["Perfil de acesso", user.perfil],
              ["Status", user.status === "ativo" ? "Ativo" : "Convite pendente"],
              ["Último acesso", "Hoje · 09:14"],
            ]} />
            <div style={{ marginTop: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Permissões</div>
              {["Responder diagnósticos","Ver próprio relatório","Acessar trilhas","Gerenciar equipe"].map((p,i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)", marginBottom: 6 }}>
                  <input type="checkbox" defaultChecked={i < 3 || user.perfil === "Líder"} style={{ accentColor: "var(--health)" }}/>
                  <span style={{ fontSize: 13.5 }}>{p}</span>
                </label>
              ))}
            </div>
          </>}
          {tab === "aprendizado" && <>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Trilhas inscritas</div>
            {["Saúde mental para gestores","Resiliência e regulação emocional"].map((n,i) => (
              <div key={i} style={{ padding: 14, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{n}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 5, background: "var(--canvas-warm)", borderRadius: 99 }}>
                    <div style={{ width: `${[60,30][i]}%`, height: "100%", background: "var(--health)", borderRadius: 99 }}/>
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{[60,30][i]}%</span>
                </div>
              </div>
            ))}
          </>}
        </div>

        <div style={{ padding: "14px 26px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-ghost" style={{ height: 36, color: "var(--coral)", borderColor: "transparent" }}><Icon name="trash" size={14}/> Remover</button>
          <button className="btn btn-primary" style={{ height: 36 }}>Salvar alterações</button>
        </div>
      </div>
    </div>
  );
};

const DrawerSection = ({ rows }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {rows.map(([k,v],i) => (
      <div key={i} style={{ padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--line)" }}>
        <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginBottom: 4 }}>{k}</div>
        <div style={{ fontSize: 14, color: "var(--ink)" }}>{v}</div>
      </div>
    ))}
  </div>
);

// ════════════════════════════════════════════════════════════
// ADMIN VITRINE config — what employees see in their portal
// ════════════════════════════════════════════════════════════
const AdminVitrine = () => (
  <Page>
    <div style={{ marginBottom: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Portal do colaborador</div>
      <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Vitrine</h1>
      <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
        O que seus colaboradores veem quando entram em <strong style={{ color: "var(--ink)" }}>loghaus.menctor.com.br</strong>.
      </p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>
      {/* Config panel */}
      <div className="card" style={{ padding: 22 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Configurações</h3>

        <ConfigSection title="Identidade visual">
          <ConfigRow label="Cor principal">
            <div style={{ display: "flex", gap: 6 }}>
              {["#2F7D6F","#1B8CA6","#5BAD72","#E87722","#1C4B82"].map(c => (
                <span key={c} style={{ width: 26, height: 26, borderRadius: 999, background: c, border: c === "#2F7D6F" ? "2px solid var(--ink)" : "2px solid transparent", boxShadow: c === "#2F7D6F" ? "0 0 0 2px var(--surface)" : "none" }}/>
              ))}
            </div>
          </ConfigRow>
          <ConfigRow label="Logo">
            <button className="btn btn-soft" style={{ height: 30, fontSize: 12 }}>Trocar imagem</button>
          </ConfigRow>
        </ConfigSection>

        <ConfigSection title="Mensagem de boas-vindas">
          <textarea defaultValue="Bem-vindo ao espaço de cuidado da Loghaus. Sua resposta é confidencial e nos ajuda a construir um ambiente de trabalho mais saudável." style={{ width: "100%", minHeight: 90, padding: 12, border: "1px solid var(--line)", borderRadius: 10, fontSize: 13.5, lineHeight: 1.5, resize: "vertical", background: "var(--surface)" }}/>
        </ConfigSection>

        <ConfigSection title="O que mostrar">
          <Toggle label="Diagnósticos ativos" on />
          <Toggle label="Trilhas de aprendizado" on />
          <Toggle label="Histórico de respostas" on />
          <Toggle label="Falar com o RH" off />
        </ConfigSection>

        <button className="btn btn-primary" style={{ width: "100%", height: 38, justifyContent: "center", marginTop: 12 }}>Salvar e publicar</button>
      </div>

      {/* Live preview */}
      <div className="card" style={{ padding: 22, background: "var(--surface-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div className="eyebrow">Pré-visualização ao vivo</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-muted)", marginTop: 4 }}>loghaus.menctor.com.br</div>
          </div>
          <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--canvas-warm)", borderRadius: 999 }}>
            <button style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "var(--surface)", boxShadow: "var(--shadow-card)" }}>Desktop</button>
            <button style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, color: "var(--ink-muted)" }}>Mobile</button>
          </div>
        </div>

        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--line)", background: "#FAF7F1" }}>
          <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--line)", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 6, background: "#2F7D6F" }}/>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18 }}>Loghaus · Cuidar</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>Roberto Tavares</span>
          </div>
          <div style={{ padding: 28 }}>
            <h2 className="display" style={{ fontSize: 28, margin: 0 }}>Olá, Roberto.</h2>
            <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "8px 0 16px", maxWidth: 360, lineHeight: 1.5 }}>
              Bem-vindo ao espaço de cuidado da Loghaus. Sua resposta é confidencial.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Diagnóstico disponível","Pesquisa de Clima · 8 min","var(--surface-peach)","var(--orange-deep)"],["Trilha em andamento","Resiliência · 30% concluído","var(--surface-sage)","var(--health-deep)"]].map((x,i) => (
                <div key={i} style={{ padding: 14, borderRadius: 12, background: x[2] }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: x[3] }}>{x[0]}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink)", marginTop: 4 }}>{x[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
);

const ConfigSection = ({ title, children }) => (
  <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px dashed var(--line-strong)" }}>
    <div className="eyebrow" style={{ marginBottom: 10 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
  </div>
);
const ConfigRow = ({ label, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{label}</span>
    {children}
  </div>
);
const Toggle = ({ label, on }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{label}</span>
    <span style={{ width: 34, height: 20, borderRadius: 99, background: on ? "var(--health)" : "var(--line-strong)", position: "relative", transition: ".2s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: 999, background: "#fff" }}/>
    </span>
  </div>
);

Object.assign(window, { AdminSidebar, AdminHome, AdminColaboradores, AdminVitrine });
