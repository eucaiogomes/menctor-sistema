/* global React, Icon, Page, DIAGNOSTICOS, AVALIACOES_ATIVAS, riskPill, riskLabel */

const DiagnosticosScreen = ({ navigate, initialCreate }) => {
  const [creating, setCreating] = React.useState(initialCreate || false);
  const [tab, setTab] = React.useState("ativas"); // ativas | biblioteca

  if (creating) {
    return <CreateFullPage onClose={() => setCreating(false)} />;
  }

  return (
    <Page>
      {/* HERO ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Avaliações COPSOQ II · NR-1</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Diagnósticos</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
            Crie, aplique e acompanhe avaliações de saúde psicossocial. Um template para cada necessidade.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn btn-accent" style={{ height: 42, padding: "0 18px", fontSize: 14 }}>
          <Icon name="plus" size={16} /> Novo diagnóstico
        </button>
      </div>

      {/* TABS ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--line)" }}>
        <Tab id="ativas"     label="Em andamento" count={AVALIACOES_ATIVAS.length} active={tab === "ativas"}     onClick={setTab} />
        <Tab id="biblioteca" label="Biblioteca"   count={DIAGNOSTICOS.length}     active={tab === "biblioteca"} onClick={setTab} />
      </div>

      {tab === "ativas"     && <AtivasView navigate={navigate} />}
      {tab === "biblioteca" && <BibliotecaView onUse={() => setCreating(true)} />}
    </Page>
  );
};

const Tab = ({ id, label, count, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    style={{
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
// ATIVAS — list of running/draft assessments
// ════════════════════════════════════════════════════════════
const AtivasView = ({ navigate }) => {
  const [hoveredId, setHoveredId] = React.useState(null);
  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {AVALIACOES_ATIVAS.map(a => (
      <button key={a.id}
        onClick={() => navigate("diagnostico-detalhe", { avaliacao: a })}
        onMouseEnter={() => setHoveredId(a.id)}
        onMouseLeave={() => setHoveredId(null)}
        className="card"
        style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) 160px 130px 100px", gap: 20, padding: "20px 24px", textAlign: "left", alignItems: "center", transition: "transform 0.15s, box-shadow 0.15s", transform: hoveredId === a.id ? "translateY(-2px)" : "none", boxShadow: hoveredId === a.id ? "var(--shadow-card)" : undefined }}>
        {/* status indicator */}
        <div>
          <span style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            background: a.status === "Em campo" ? "var(--health-tint)" : a.status === "Encerrada" ? "var(--canvas-warm)" : "var(--surface-2)",
            color: a.status === "Em campo" ? "var(--health-deep)" : "var(--ink-muted)",
            border: a.status === "Rascunho" ? "1px dashed var(--line-strong)" : "none"
          }}>{a.code}</span>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.titulo}</div>
          <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.cliente} · {a.periodo}</div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Adesão</div>
          {a.adesao > 0 ? (
            <div>
              <div style={{ position: "relative", height: 6, background: "var(--canvas-warm)", borderRadius: 99 }}>
                <div style={{ position: "absolute", inset: 0, width: `${a.adesao}%`, background: "var(--health)", borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>{a.respondidos}/{a.alvo} · {a.adesao}%</div>
            </div>
          ) : <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>Aguardando aplicação</div>}
        </div>

        <div>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Status</div>
          <span className={`pill ${a.status === "Em campo" ? "pill" : a.status === "Encerrada" ? "pill-neutral" : "pill-amber"}`} style={{ fontSize: 12 }}>
            {a.status === "Em campo" && <span className="dot" style={{ background: "var(--health)" }} />}
            {a.status}
          </span>
        </div>

        <div style={{ textAlign: "right" }}>
          {a.media != null ? (
            <>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 28, lineHeight: 1, color: "var(--ink)" }}>{a.media.toFixed(2)}</div>
              <div className={`pill ${riskPill(a.risk)}`} style={{ fontSize: 10.5, marginTop: 6 }}>{riskLabel(a.risk)}</div>
            </>
          ) : (
            <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>—</span>
          )}
        </div>
      </button>
    ))}
  </div>
  );
};

// ════════════════════════════════════════════════════════════
// BIBLIOTECA — template cards (Perplexity-style)
// ════════════════════════════════════════════════════════════
const BibliotecaView = ({ onUse }) => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {DIAGNOSTICOS.map(d => <TemplateCard key={d.id} d={d} onUse={onUse} />)}
    </div>
  </div>
);

const TemplateCard = ({ d, onUse }) => {
  const colorMap = {
    "COPSOQ II": ["#E8F0EC", "#2F7D6F"],
    "Pulse":     ["#DCE6EE", "#4E83A8"],
    "Maslach":   ["#F2D9D4", "#9c3d31"],
    "Gallup Q12":["#F4E4C7", "#8a5a18"],
    "eNPS":      ["#E8F0EC", "#2F7D6F"],
    "Clima":     ["#F4E4D6", "#a05a25"],
    "DISC":      ["#DCE6EE", "#4E83A8"],
    "NASA-TLX":  ["#F2D9D4", "#9c3d31"],
  };
  const [bg, fg] = colorMap[d.type] || ["var(--surface-2)", "var(--ink)"];
  return (
    <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, minHeight: 220 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          padding: "4px 10px", borderRadius: 999,
          background: bg, color: fg,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase"
        }}>{d.type}</div>
        {d.popular && <span className="pill" style={{ fontSize: 10.5, background: "var(--surface-peach)", color: "#a05a25" }}>Popular</span>}
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 24, margin: 0, lineHeight: 1.15, color: "var(--ink)" }}>{d.name}</h3>
        <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--ink-muted)", lineHeight: 1.5 }}>{d.desc}</p>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--ink-muted)", marginTop: "auto" }}>
        <span>{d.questions} questões</span>
        <span>·</span>
        <span>{d.levels} níveis de maturidade</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onUse} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", height: 36, fontSize: 13 }}>Usar template</button>
        <button className="btn btn-ghost" style={{ height: 36, width: 36, padding: 0, justifyContent: "center" }}>
          <Icon name="eye" size={15} />
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// CREATE — Dedicated full-page wizard (no more side drawer)
// ════════════════════════════════════════════════════════════
const CreateFullPage = ({ onClose }) => {
  const [step, setStep] = React.useState(1);
  const [template, setTemplate] = React.useState("copsoq");
  const tpl = DIAGNOSTICOS.find(d => d.id === template);

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
      {/* header strip */}
      <div style={{ padding: "22px 36px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--canvas)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-muted)", fontSize: 13.5 }}>
          <Icon name="chevron-left" size={15}/> Voltar para diagnósticos
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            { n: 1, label: "Escolher template" },
            { n: 2, label: "Configurar" },
            { n: 3, label: "Aplicar" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: s.n < step ? "var(--health)" : s.n === step ? "var(--ink)" : "var(--surface-2)",
                border: s.n > step ? "1px solid var(--line-strong)" : "none",
                color: s.n <= step ? "#fff" : "var(--ink-muted)",
                fontSize: 11, fontWeight: 700
              }}>
                {s.n < step ? "✓" : s.n}
              </span>
              <span style={{ fontSize: 13, color: s.n === step ? "var(--ink)" : "var(--ink-muted)", fontWeight: s.n === step ? 600 : 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-muted)", fontSize: 13 }}>
          Salvar e sair <Icon name="x" size={14}/>
        </button>
      </div>

      {/* body — centered content */}
      <div style={{ flex: 1, padding: "48px 36px 120px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: step === 1 ? 1080 : 720 }}>
          <div style={{ marginBottom: 36 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Etapa {step} de 3</div>
            <h1 className="display" style={{ fontSize: 44, margin: 0, lineHeight: 1.05 }}>
              {step === 1 && "Escolha um template para começar."}
              {step === 2 && (<>Vamos ajustar os <em style={{ fontStyle: "italic", color: "var(--health-deep)" }}>detalhes</em>.</>)}
              {step === 3 && "Para quais clientes você quer aplicar?"}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 640, lineHeight: 1.55 }}>
              {step === 1 && "São instrumentos validados internacionalmente. Você pode customizar perguntas depois."}
              {step === 2 && "As configurações abaixo se aplicam à todos os clientes selecionados. Você poderá editar individualmente depois."}
              {step === 3 && "O diagnóstico fica disponível para o admin RH aplicar à sua equipe."}
            </p>
          </div>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {DIAGNOSTICOS.map(d => (
                <button key={d.id} onClick={() => setTemplate(d.id)} className="card" style={{
                  padding: 22, textAlign: "left", position: "relative",
                  border: template === d.id ? "1px solid var(--health)" : "1px solid transparent",
                  outline: template === d.id ? "3px solid var(--surface-sage)" : "none",
                  display: "flex", flexDirection: "column", gap: 10, minHeight: 200
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{d.type}</span>
                    <span style={{
                      width: 22, height: 22, borderRadius: 99,
                      border: template === d.id ? "6px solid var(--health)" : "1px solid var(--line-strong)",
                      background: template === d.id ? "var(--surface)" : "transparent"
                    }}/>
                  </div>
                  <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, margin: 0, lineHeight: 1.2, color: "var(--ink)" }}>{d.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0, lineHeight: 1.5 }}>{d.desc}</p>
                  <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: "auto", display: "flex", gap: 10 }}>
                    <span>{d.questions} questões</span>
                    <span>·</span>
                    <span>{d.levels} níveis</span>
                    {d.popular && (<><span>·</span><span style={{ color: "var(--orange-deep)", fontWeight: 600 }}>Popular</span></>)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FieldCard label="Nome da avaliação" value={`${tpl.name} — ${new Date().getFullYear()}`} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <FieldCard label="Período" value="1º Trimestre 2026" hint="Janeiro a Março" />
                <FieldCard label="Recorte" value="Toda a organização" hint="Você pode filtrar por setor depois" />
              </div>
              <FieldCard label="Frequência" value="Aplicação única" hint="Mude para recorrente se for um pulse mensal" />
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 22, marginTop: 8 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Template em uso</div>
                <div style={{ padding: 18, background: "var(--surface)", borderRadius: 14, border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--health-deep)", marginBottom: 6 }}>{tpl.type}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{tpl.name}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 4 }}>{tpl.questions} questões em {tpl.levels} níveis</div>
                  </div>
                  <button onClick={() => setStep(1)} className="btn btn-soft" style={{ height: 34, fontSize: 13 }}>Trocar template</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {window.CLIENTES.filter(c => c.status === "ativo").map(c => (
                <label key={c.id} className="card" style={{ display: "flex", gap: 14, padding: 18, cursor: "pointer", alignItems: "center" }}>
                  <input type="checkbox" defaultChecked={c.id === "loghaus"} style={{ accentColor: "var(--health)", width: 18, height: 18 }} />
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: c.color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 17 }}>{c.name[0]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>{c.sector} · {c.employees} colaboradores</div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>Última avaliação {c.lastDiag}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* sticky footer */}
      <div style={{
        position: "sticky", bottom: 0, padding: "16px 36px",
        borderTop: "1px solid var(--line)", background: "rgba(244,241,232,0.92)",
        backdropFilter: "blur(10px)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <button onClick={step > 1 ? () => setStep(step - 1) : onClose} className="btn btn-ghost" style={{ height: 40 }}>
          <Icon name="chevron-left" size={14}/> {step > 1 ? "Voltar" : "Cancelar"}
        </button>
        <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
          {step === 1 && tpl && <>Selecionado: <strong style={{ color: "var(--ink)" }}>{tpl.name}</strong></>}
          {step === 2 && <>Configuração avançada disponível depois de criar</>}
          {step === 3 && <>Você pode reaplicar para outros clientes a qualquer momento</>}
        </div>
        {step < 3
          ? <button onClick={() => setStep(step + 1)} className="btn btn-primary" style={{ height: 40, padding: "0 22px" }}>Continuar <Icon name="arrow-right" size={14}/></button>
          : <button onClick={onClose} className="btn btn-accent" style={{ height: 40, padding: "0 22px" }}><Icon name="send" size={14}/> Enviar para clientes</button>
        }
      </div>
    </div>
  );
};

const FieldCard = ({ label, value, hint }) => (
  <div>
    <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
    <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 14, color: "var(--ink)" }}>{value}</div>
        {hint && <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{hint}</div>}
      </div>
      <Icon name="edit" size={14} color="var(--ink-muted)" />
    </div>
  </div>
);

Object.assign(window, { DiagnosticosScreen });
