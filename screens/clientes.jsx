/* global React, Icon, Page, CLIENTES, LEADS_PIPELINE, riskPill, riskLabel */

// ════════════════════════════════════════════════════════════
// CLIENTES — unifies Leads/Pipeline + Carteira ativa
// ════════════════════════════════════════════════════════════
// ─── Invite modal ───────────────────────────────────────────
const InviteModal = ({ onClose }) => {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSend = () => {
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.38)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--canvas)", borderRadius: 20,
        padding: "32px 36px", width: "100%", maxWidth: 440,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px var(--line)",
        animation: "slideUp .22s ease",
      }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999, margin: "0 auto 18px",
              background: "var(--surface-sage)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="check" size={26} color="var(--health-deep)" strokeWidth={2} />
            </div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, marginBottom: 8 }}>Convite enviado!</div>
            <div style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 28 }}>
              <strong>{email}</strong> receberá o link de acesso em instantes.
            </div>
            <button onClick={onClose} className="btn btn-primary" style={{ width: "100%", height: 44, justifyContent: "center", fontSize: 14 }}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20 }}>Convidar por e-mail</div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 3 }}>O cliente receberá um link para acessar o portal.</div>
              </div>
              <button onClick={onClose} style={{ color: "var(--ink-muted)", padding: 4, borderRadius: 8 }}>
                <Icon name="x" size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nome</label>
                <input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex.: Ana Beatriz"
                  style={{ width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 14, background: "var(--surface)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>E-mail *</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="cliente@empresa.com.br"
                  type="email"
                  style={{ width: "100%", height: 42, padding: "0 14px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 14, background: "var(--surface)", color: "var(--ink)" }}
                />
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!email.trim() || loading}
              className="btn btn-accent"
              style={{ width: "100%", height: 44, justifyContent: "center", fontSize: 14, marginTop: 24, opacity: (!email.trim() || loading) ? 0.6 : 1 }}>
              {loading ? "Enviando…" : <><Icon name="send" size={15} /> Enviar convite</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ClientesScreen = ({ navigate }) => {
  const [creating, setCreating] = React.useState(false);
  const [inviting, setInviting] = React.useState(false);

  if (creating) {
    return <window.NovoClienteFullPage onClose={() => setCreating(false)} />;
  }

  return (
    <Page>
      {inviting && <InviteModal onClose={() => setInviting(false)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Carteira comercial</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Clientes</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
            Pipeline comercial e gestão de propostas.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setInviting(true)} className="btn btn-soft" style={{ height: 42 }}>
            <Icon name="send" size={15} /> Convidar por e-mail
          </button>
          <button onClick={() => setCreating(true)} className="btn btn-accent" style={{ height: 42 }}>
            <Icon name="plus" size={16} /> Novo cliente
          </button>
        </div>
      </div>

      <PipelineView navigate={navigate} />
    </Page>
  );
};

const SubTab = ({ id, label, count, active, onClick }) => (
  <button onClick={() => onClick(id)} style={{
    padding: "12px 16px", marginBottom: -1,
    borderBottom: `2px solid ${active ? "var(--ink)" : "transparent"}`,
    color: active ? "var(--ink)" : "var(--ink-muted)",
    fontSize: 14, fontWeight: active ? 600 : 500,
    display: "inline-flex", alignItems: "center", gap: 8
  }}>
    {label}
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: active ? "var(--ink)" : "var(--canvas-warm)", color: active ? "var(--canvas)" : "var(--ink-muted)" }}>{count}</span>
  </button>
);

// ════════════════════════════════════════════════════════════
// CARTEIRA — clients table with health and portal access
// ════════════════════════════════════════════════════════════
const CarteiraView = ({ navigate }) => {
  const ativos = CLIENTES.filter(c => c.status === "ativo");
  const totalMRR = ativos.reduce((s, c) => s + c.mrr, 0);
  const totalEmp = ativos.reduce((s, c) => s + c.employees, 0);

  return (
    <div>
      {/* summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <MiniStat label="Clientes ativos"      value={ativos.length} />
        <MiniStat label="Colaboradores cobertos"value={totalEmp.toLocaleString("pt-BR")} />
        <MiniStat label="MRR consolidado"      value={`R$ ${(totalMRR/1000).toFixed(1)}k`} accent="health" />
        <MiniStat label="Avaliações no mês"    value="14" />
      </div>

      {/* table */}
      <div className="card">
        {/* table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 16, padding: "16px 24px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
          <span>Cliente</span>
          <span>Setor</span>
          <span>Colaboradores</span>
          <span>Saúde NR-1</span>
          <span>MRR</span>
          <span style={{ width: 32 }}></span>
        </div>

        {ativos.map((c, i) => (
          <button key={c.id} onClick={() => navigate("diagnostico-detalhe", { cliente: c })}
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 16, padding: "18px 24px", borderTop: i > 0 ? "1px solid var(--line)" : "none", textAlign: "left", width: "100%", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: c.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18 }}>
                {c.name[0]}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{c.contact}</div>
              </div>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{c.sector}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-soft)", fontVariantNumeric: "tabular-nums" }}>{c.employees.toLocaleString("pt-BR")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18 }}>{c.risk.toFixed(2)}</span>
              <span className={`pill ${riskPill(c.risk)}`} style={{ fontSize: 10.5 }}>{riskLabel(c.risk)}</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>R$ {c.mrr.toLocaleString("pt-BR")}</div>
            <span style={{ width: 32, color: "var(--ink-muted)" }}><Icon name="chevron-right" size={16}/></span>
          </button>
        ))}
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, accent }) => (
  <div style={{ padding: "14px 18px", background: "var(--surface)", borderRadius: 14, border: "1px solid var(--line)" }}>
    <div style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 28, marginTop: 6, color: accent === "health" ? "var(--health-deep)" : "var(--ink)" }}>{value}</div>
  </div>
);

// ════════════════════════════════════════════════════════════
// PIPELINE — kanban with rich cards
// ════════════════════════════════════════════════════════════
const STAGES = [
  { id: "lead",     label: "Lead",          color: "var(--ink-faint)",  desc: "Primeiro contato" },
  { id: "proposta", label: "Proposta enviada",color: "var(--sky)",       desc: "Aguardando resposta" },
  { id: "aceita",   label: "Aceita",         color: "var(--amber)",     desc: "Cliente concordou" },
  { id: "contrato", label: "Contrato",       color: "var(--health)",    desc: "Em assinatura" },
  { id: "fechado",  label: "Fechado",        color: "var(--ink)",       desc: "Cliente ativo" },
];

const PipelineView = ({ navigate }) => {
  const [addingStage, setAddingStage] = React.useState(null);
  const [draft, setDraft] = React.useState({ empresa: "", contato: "" });
  const [savedStage, setSavedStage] = React.useState(null);
  const totalProposta = LEADS_PIPELINE.proposta.reduce((s,p)=>s+p.valor,0)
                      + LEADS_PIPELINE.aceita.reduce((s,p)=>s+p.valor,0);
  const startAdding = (stageId) => {
    setAddingStage(stageId);
    setSavedStage(null);
    setDraft({ empresa: "", contato: "" });
  };
  const saveDraft = () => {
    setSavedStage(addingStage);
    setAddingStage(null);
    setDraft({ empresa: "", contato: "" });
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--ink-muted)" }}>
          <span><strong style={{ color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20 }}>R$ {(totalProposta/1000).toFixed(1)}k</strong> em proposta</span>
          <span><strong style={{ color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20 }}>{Object.values(LEADS_PIPELINE).flat().length}</strong> negócios ativos</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-soft" style={{ height: 34, fontSize: 13 }}><Icon name="filter" size={13}/> Filtros</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(220px, 1fr))", gap: 14, overflow: "auto", paddingBottom: 12 }}>
        {STAGES.map(s => (
          <div key={s.id} style={{ background: "var(--surface-2)", borderRadius: 14, padding: 14, border: "1px solid var(--line)", minHeight: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="dot" style={{ background: s.color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{s.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-muted)" }}>{LEADS_PIPELINE[s.id].length}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 14 }}>{s.desc}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEADS_PIPELINE[s.id].map(card => <DealCard key={card.id} card={card} stage={s} navigate={navigate} />)}
              {LEADS_PIPELINE[s.id].length === 0 && (
                <div style={{ padding: "24px 12px", border: "1px dashed var(--line-strong)", borderRadius: 10, textAlign: "center", fontSize: 12.5, color: "var(--ink-faint)" }}>
                  Sem negócios nesta etapa.
                </div>
              )}
              {savedStage === s.id && (
                <div style={{ padding: "9px 10px", borderRadius: 10, background: "var(--surface-sage)", color: "var(--health-deep)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="check" size={13}/> Rascunho criado para revisÃ£o.
                </div>
              )}
              {addingStage === s.id ? (
                <div style={{ padding: 12, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)", boxShadow: "var(--shadow-card)" }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Novo negócio</div>
                  <input value={draft.empresa} onChange={e => setDraft({ ...draft, empresa: e.target.value })} placeholder="Empresa" style={{ width: "100%", height: 34, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 13, marginBottom: 8, background: "var(--canvas)" }} />
                  <input value={draft.contato} onChange={e => setDraft({ ...draft, contato: e.target.value })} placeholder="Contato principal" style={{ width: "100%", height: 34, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 13, background: "var(--canvas)" }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <button onClick={saveDraft} className="btn btn-primary" style={{ height: 30, fontSize: 12, flex: 1, justifyContent: "center" }}>Salvar</button>
                    <button onClick={() => setAddingStage(null)} className="btn btn-soft" style={{ height: 30, fontSize: 12, flex: 1, justifyContent: "center" }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => startAdding(s.id)} style={{ padding: "10px 12px", borderRadius: 10, background: "transparent", color: "var(--ink-muted)", fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center" }}>
                  <Icon name="plus" size={13} /> Adicionar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealCard = ({ card, stage, navigate }) => (
  <div style={{ background: "var(--surface)", borderRadius: 10, padding: 12, boxShadow: "var(--shadow-card)", cursor: "grab" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{card.empresa}</div>
      <Icon name="more" size={14} color="var(--ink-faint)" />
    </div>
    <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 10 }}>{card.contato}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 10.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Valor / mês</div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18, color: "var(--ink)", lineHeight: 1, marginTop: 2 }}>R$ {(card.valor/1000).toFixed(1)}k</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 10.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Colab.</div>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 2 }}>{card.funcionarios}</div>
      </div>
    </div>
    <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: "var(--ink-muted)" }}>
      <span>Há {card.dias}d</span>
      {stage.id === "proposta" && <button onClick={() => navigate("portal")} style={{ fontSize: 11, color: "var(--health-deep)", display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="link" size={11}/> Portal</button>}
      {stage.id === "fechado"  && <span className="pill" style={{ fontSize: 10, padding: "2px 8px" }}>Cliente ativo</span>}
    </div>
  </div>
);

Object.assign(window, { ClientesScreen });
