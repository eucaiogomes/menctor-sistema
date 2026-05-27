/* global React, Icon, Page, TRILHAS */

const AprendizadoScreen = ({ navigate }) => {
  const [selected, setSelected] = React.useState(null);
  const [recomendado, setRecomendado] = React.useState(false);

  const handleRecomendar = () => {
    setRecomendado(true);
    setTimeout(() => setRecomendado(false), 2500);
  };

  if (selected) {
    return <TrailDetail trail={selected} onBack={() => setSelected(null)} navigate={navigate} />;
  }

  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Trilhas · Treinamentos</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Aprendizado</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
            Conteúdo para complementar os planos de ação dos seus clientes.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-soft" style={{ height: 38 }}><Icon name="filter" size={14}/> Filtrar</button>
          <button className="btn btn-accent" style={{ height: 38 }}><Icon name="plus" size={14}/> Nova trilha</button>
        </div>
      </div>

      {/* Featured */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24, display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
        <div style={{
          background: "linear-gradient(135deg, #2F7D6F 0%, #5BAD72 100%)",
          padding: 36, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 280
        }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", background: "rgba(255,255,255,0.18)", borderRadius: 999 }}>Em destaque</span>
            <h2 className="display" style={{ fontSize: 36, margin: "18px 0 12px", color: "#fff", lineHeight: 1.05 }}>
              Saúde mental para<br/>gestores e lideranças
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.85)", maxWidth: 360 }}>
              6 módulos, 3h 20min. Recomendado para clientes com Burnout {">"} 2.5 no COPSOQ.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="btn" style={{ background: "#fff", color: "var(--health-deep)", height: 38 }} onClick={handleRecomendar}>
              Recomendar a cliente <Icon name="arrow-right" size={14}/>
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", height: 38 }} onClick={() => setSelected(TRILHAS[0])}>Ver conteúdo</button>
          </div>
          {recomendado && (
            <div style={{ marginTop: 12, padding: "8px 14px", background: "rgba(255,255,255,0.22)", borderRadius: 10, fontSize: 13, color: "#fff", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="check" size={13} color="#fff"/> Trilha recomendada! Seu cliente receberá uma notificação.
            </div>
          )}
        </div>
        <div style={{ padding: 32, display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--surface)" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>O que está dentro</div>
          {[
            "1. Identificando sinais de burnout na equipe",
            "2. Conversas difíceis com colaboradores em risco",
            "3. Construindo cultura de cuidado",
            "4. Reuniões 1:1 que cuidam",
            "5. Métricas de bem-estar para gestão",
            "6. Quando encaminhar para apoio profissional",
          ].map((t,i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? "1px dashed var(--line)" : "none", fontSize: 13.5, color: "var(--ink-soft)" }}>
              <Icon name="check" size={14} color="var(--health)" />
              <span>{t.replace(/^\d\.\s/, "")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trilhas */}
      <div style={{ marginBottom: 16 }}>
        <h2 className="display" style={{ fontSize: 26, margin: 0 }}>Trilhas disponíveis</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {TRILHAS.map(t => <TrailCard key={t.id} t={t} onClick={() => setSelected(t)} />)}
      </div>
    </Page>
  );
};

const TrailCard = ({ t, onClick }) => (
  <button onClick={onClick} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", textAlign: "left", padding: 0 }}>
    <div style={{ height: 130, background: t.capa, position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 9px", background: "rgba(255,255,255,0.85)", borderRadius: 999, fontSize: 10.5, fontWeight: 600, color: "var(--ink)" }}>
        {t.modulos} módulos
      </div>
    </div>
    <div style={{ padding: 18 }}>
      <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 19, margin: 0, lineHeight: 1.2 }}>{t.nome}</h3>
      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--ink-muted)", marginTop: 10 }}>
        <span>{t.duracao}</span>
        <span>·</span>
        <span>{t.inscritos} inscritos</span>
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 5, background: "var(--canvas-warm)", borderRadius: 99 }}>
          <div style={{ width: `${t.conclusao}%`, height: "100%", background: "var(--health)", borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 12, color: "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>{t.conclusao}% conclusão</span>
      </div>
    </div>
  </button>
);

// ── TRAIL DETAIL ───────────────────────────────────────────────
const TRAIL_MODULES_CONSULT = {
  "t1": ["Identificando sinais de burnout na equipe", "Conversas difíceis com colaboradores em risco", "Construindo cultura de cuidado", "Reuniões 1:1 que cuidam", "Métricas de bem-estar para gestão", "Quando encaminhar para apoio profissional"],
  "t2": ["O que diz a NR-1 atualizada", "Mapeamento de riscos psicossociais", "Documentação e evidências", "Fiscalização e autuações — como se preparar"],
  "t3": ["Fundamentos da liderança humanizada", "Escuta ativa e empatia no trabalho", "Feedback que fortalece", "Gestão de conflitos", "Liderança em situações de crise", "Construindo equipes psicologicamente seguras", "Diversidade e inclusão na liderança", "Plano de desenvolvimento individual"],
  "t4": ["Identificando suas emoções no trabalho", "Técnicas de regulação emocional", "Reframing cognitivo", "Mindfulness para o dia a dia", "Construindo um plano pessoal de resiliência"],
};

const TrailDetail = ({ trail, onBack, navigate }) => {
  const modules = TRAIL_MODULES_CONSULT[trail.id] || Array.from({ length: trail.modulos }, (_, i) => `Módulo ${i + 1}`);
  return (
    <Page>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-muted)", fontSize: 13, marginBottom: 20 }}>
        <Icon name="chevron-left" size={14}/> Aprendizado
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32, alignItems: "start" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Trilha · {trail.modulos} módulos · {trail.duracao}</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>{trail.nome}</h1>
          <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 14, color: "var(--ink-muted)" }}>
            <span><strong style={{ color: "var(--ink)" }}>{trail.inscritos}</strong> inscritos</span>
            <span><strong style={{ color: "var(--ink)" }}>{trail.conclusao}%</strong> de conclusão média</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button className="btn btn-health" style={{ height: 40, padding: "0 20px" }}>
              Recomendar a cliente <Icon name="arrow-right" size={14}/>
            </button>
            <button className="btn btn-ghost" style={{ height: 40 }}>
              <Icon name="eye" size={14}/> Pré-visualizar
            </button>
          </div>
        </div>
        <div style={{ height: 220, borderRadius: 20, background: trail.capa }} />
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h2 className="display" style={{ fontSize: 24, margin: "0 0 18px" }}>Módulos</h2>
        {modules.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderTop: i > 0 ? "1px dashed var(--line-strong)" : "none" }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            <div style={{ flex: 1, fontSize: 14.5, fontWeight: 500, color: "var(--ink)" }}>{m}</div>
            <button className="btn btn-soft" style={{ height: 30, fontSize: 12 }}>Ver módulo</button>
          </div>
        ))}
      </div>
    </Page>
  );
};

Object.assign(window, { AprendizadoScreen });
