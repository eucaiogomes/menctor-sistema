/* global React, Icon, Page, RiskMedallion, riskLabel, riskPill, CLIENTES, COPSOQ_DIMS, AVALIACOES_ATIVAS */
const { useState: useStateHome } = React;

// ════════════════════════════════════════════════════════════
// HOME — Visão geral. Calm dashboard, big numbers, breathing.
// ════════════════════════════════════════════════════════════
const HomeScreen = ({ navigate }) => {
  const ativos = CLIENTES.filter(c => c.status === "ativo");
  const negociacao = CLIENTES.filter(c => c.status === "negociacao");
  const mrr = ativos.reduce((s, c) => s + c.mrr, 0);
  const avgRisk = ativos.reduce((s, c) => s + c.risk, 0) / ativos.length;
  const emCampo = AVALIACOES_ATIVAS.filter(a => a.status === "Em campo");

  return (
    <Page>
      {/* HERO ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Quinta · 27 de maio, 2026</div>
        <h1 className="display" style={{ fontSize: 56, margin: 0, lineHeight: 1.02 }}>
          Boa tarde, Caio.
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 17, color: "var(--ink-soft)", maxWidth: 640, lineHeight: 1.5 }}>
          A saúde psicossocial da sua carteira está em <em style={{ fontStyle: "normal", color: "var(--health-deep)", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 19 }}>{avgRisk.toFixed(2)}</em> — abaixo do limite NR-1 de 2.5. 2 avaliações em campo, 1 proposta aguardando aceite.
        </p>
      </div>

      {/* KPI ROW ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        {/* big risk card */}
        <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 22 }}>
          <RiskMedallion value={avgRisk} size={88} />
          <div>
            <div className="eyebrow">Saúde média NR-1</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 32, color: "var(--ink)", lineHeight: 1.1, marginTop: 4 }}>
              {avgRisk < 2.5 ? "Dentro do limite" : "Acima do limite"}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 4 }}>
              <span style={{ color: "var(--health)" }}>↓ 0.18</span> vs trimestre anterior
            </div>
          </div>
        </div>

        <StatCard label="Clientes ativos" value={ativos.length} delta="+1 este mês" tint="health" icon="users" />
        <StatCard label="Em campo agora"  value={emCampo.length} delta={`${emCampo.reduce((s,a)=>s+a.respondidos,0)} respostas`} tint="sky" icon="pulse" />
        <StatCard label="Receita mensal"  value={`R$ ${(mrr/1000).toFixed(1)}k`} delta="+R$ 4,3k vs abril" tint="amber" icon="arrow-up" />
      </div>

      {/* MAIN GRID ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 24, alignItems: "start" }}>

        {/* COL ESQ — Carteira de clientes */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <h2 className="display" style={{ fontSize: 26, margin: 0 }}>Saúde da carteira</h2>
            <button onClick={() => navigate("clientes")} style={{ fontSize: 13, color: "var(--ink-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Ver clientes <Icon name="arrow-right" size={13} />
            </button>
          </div>
          <p style={{ margin: "0 0 24px", color: "var(--ink-muted)", fontSize: 14 }}>
            Média COPSOQ II ponderada das últimas avaliações. Quanto menor, melhor.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {ativos.map(c => <ClientRow key={c.id} cliente={c} onClick={() => navigate("diagnostico-detalhe", { cliente: c })} />)}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", marginTop: 24, paddingTop: 20, display: "flex", gap: 14, fontSize: 12.5, color: "var(--ink-muted)", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="dot" style={{ background: "var(--health)" }} /> Saudável (0–1.5)
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="dot" style={{ background: "var(--amber)" }} /> Moderado (1.5–2.5)
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="dot" style={{ background: "var(--coral)" }} /> Alto risco (2.5+)
            </span>
            <span style={{ marginLeft: "auto" }}>Escala COPSOQ II · 0 mín — 4 máx</span>
          </div>
        </div>

        {/* COL DIR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Em campo */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, margin: 0 }}>Em campo</h3>
              <span className="pill pill-sky" style={{ fontSize: 11 }}>{emCampo.length} ativas</span>
            </div>
            {emCampo.map(a => (
              <button key={a.id} onClick={() => navigate("diagnostico-detalhe", { avaliacao: a })}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", borderTop: "1px solid var(--line-strong)", borderTopStyle: "dashed" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{a.titulo}</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: "var(--ink-muted)" }}>
                  <span>{a.cliente}</span>
                  <span>·</span>
                  <span>{a.respondidos}/{a.alvo}</span>
                  <span style={{ flex: 1, height: 4, background: "var(--canvas-warm)", borderRadius: 99, overflow: "hidden", marginLeft: 4 }}>
                    <span style={{ display: "block", height: "100%", width: `${a.adesao}%`, background: "var(--health)" }} />
                  </span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{a.adesao}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Pipeline summary */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, margin: "0 0 4px" }}>Pipeline</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ink-muted)", fontSize: 13 }}>{negociacao.length} em negociação · R$ 12,8k em proposta</p>
            <PipelineStage label="Lead"      count={2} pct={20} color="var(--ink-faint)" />
            <PipelineStage label="Proposta"  count={2} pct={40} color="var(--sky)" />
            <PipelineStage label="Aceita"    count={1} pct={60} color="var(--amber)" />
            <PipelineStage label="Contrato"  count={1} pct={80} color="var(--health)" />
            <button onClick={() => navigate("clientes", { tab: "pipeline" })} className="btn btn-soft" style={{ width: "100%", justifyContent: "center", marginTop: 12, height: 34, fontSize: 13 }}>
              Abrir pipeline <Icon name="arrow-right" size={13} />
            </button>
          </div>

          {/* Quick actions */}
          <div className="card" style={{ padding: 24, background: "var(--surface-sage)" }}>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20, margin: "0 0 14px", color: "var(--health-deep)" }}>Atalhos rápidos</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <QuickAction onClick={() => navigate("diagnosticos", { create: true })} icon="plus" label="Criar diagnóstico" />
              <QuickAction onClick={() => navigate("clientes",     { tab: "pipeline", create: true })} icon="users" label="Cadastrar lead" />
              <QuickAction onClick={() => navigate("clientes",     { tab: "carteira" })} icon="file" label="Gerar relatório PDF" />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

// ── helpers ─────────────────────────────────────────────────
const StatCard = ({ label, value, delta, tint, icon }) => {
  const bg = { health: "var(--health-tint)", sky: "var(--sky-soft)", amber: "var(--amber-soft)" }[tint] || "var(--surface)";
  const fg = { health: "var(--health-deep)", sky: "#2b5a7d", amber: "#8a5a18" }[tint] || "var(--ink)";
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: bg, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} strokeWidth={1.8} />
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 38, lineHeight: 1, color: "var(--ink)" }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 6 }}>{delta}</div>
    </div>
  );
};

const ClientRow = ({ cliente, onClick }) => {
  const color = cliente.risk >= 2.5 ? "var(--coral)" : cliente.risk >= 1.5 ? "var(--amber)" : "var(--health)";
  const pct = (cliente.risk / 4) * 100;
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", textAlign: "left",
        padding: "10px 12px", borderRadius: 12, margin: "0 -12px",
        background: hovered ? "var(--surface-2)" : "transparent",
        transition: "background 0.15s"
      }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(160px, 200px) minmax(0,1fr) 70px auto", gap: 18, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{cliente.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{cliente.sector} · {cliente.employees} colab.</div>
        </div>
        <div>
          <div style={{ position: "relative", height: 10, background: "var(--canvas-warm)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}33, ${color})`,
              borderRadius: 99
            }} />
            {/* limit marker at 2.5/4 = 62.5% */}
            <div style={{ position: "absolute", left: "62.5%", top: -2, bottom: -2, width: 1, background: "var(--ink-faint)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-faint)", marginTop: 4 }}>
            <span>{cliente.lastDiag}</span>
            <span style={{ color }}>Limite NR-1 · 2.5</span>
          </div>
        </div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 24, color: "var(--ink)", textAlign: "right", lineHeight: 1 }}>{cliente.risk.toFixed(2)}</div>
        <span className={`pill ${riskPill(cliente.risk)}`} style={{ fontSize: 11, justifySelf: "end" }}>{riskLabel(cliente.risk)}</span>
      </div>
    </button>
  );
};

const PipelineStage = ({ label, count, pct, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
    <span style={{ width: 70, fontSize: 13, color: "var(--ink-soft)" }}>{label}</span>
    <span style={{ flex: 1, height: 6, background: "var(--canvas-warm)", borderRadius: 99, overflow: "hidden" }}>
      <span style={{ display: "block", height: "100%", width: `${pct}%`, background: color }} />
    </span>
    <span style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18, color: "var(--ink)", width: 28, textAlign: "right" }}>{count}</span>
  </div>
);

const QuickAction = ({ icon, label, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 10,
        background: hovered ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.6)",
        color: "var(--health-deep)",
        fontSize: 14, fontWeight: 500, textAlign: "left", width: "100%",
        boxShadow: hovered ? "0 1px 4px rgba(47,125,111,0.10)" : "none",
        transform: hovered ? "translateX(2px)" : "none",
        transition: "background 0.15s, box-shadow 0.15s, transform 0.15s"
      }}>
      <Icon name={icon} size={15} strokeWidth={1.8} />
      <span>{label}</span>
      <Icon name="arrow-right" size={13} style={{ marginLeft: "auto", opacity: hovered ? 1 : 0.6, transition: "opacity 0.15s" }} />
    </button>
  );
};

Object.assign(window, { HomeScreen });
