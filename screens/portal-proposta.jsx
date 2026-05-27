/* global React, Icon, Logo */

// ════════════════════════════════════════════════════════════
// PORTAL DE PROPOSTA — external view, polished standalone page
// What the client (Norte Fintech) sees when they click the link
// ════════════════════════════════════════════════════════════
const PortalPropostaScreen = ({ onExit }) => {
  const [aceito, setAceito] = React.useState(false);

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      {/* mock browser bar feel */}
      <div style={{
        background: "var(--surface-2)", borderBottom: "1px solid var(--line)",
        padding: "10px 28px", display: "flex", alignItems: "center", gap: 14, fontSize: 12.5, color: "var(--ink-muted)"
      }}>
        <Icon name="globe" size={14} />
        <span>menctor.com.br/portal/norte-fintech-a4d8</span>
        <span style={{ marginLeft: "auto" }}>Visão do cliente · proposta comercial</span>
        <button onClick={onExit} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--ink)", fontWeight: 600 }}>
          <Icon name="chevron-left" size={13}/> Voltar ao painel
        </button>
      </div>

      {/* TOP — logo + greeting */}
      <header style={{ padding: "32px 48px 0", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>Proposta nº <strong style={{ color: "var(--ink)" }}>PRP-2026-0142</strong></div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 48px 80px" }}>
        {/* hero */}
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 14, color: "var(--health-deep)" }}>Proposta para Norte Fintech</div>
          <h1 className="display" style={{ fontSize: 64, lineHeight: 1, margin: 0, maxWidth: 800 }}>
            Saúde psicossocial,<br/>com tranquilidade<br/><em style={{ fontStyle: "italic", color: "var(--health-deep)" }}>e conformidade NR-1.</em>
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 620, marginTop: 24, lineHeight: 1.55 }}>
            Caio, preparei esta proposta para Norte Fintech após nossa conversa de 24/05. O plano cobre os 180 colaboradores e atende integralmente os requisitos da NR-1 atualizada.
          </p>
        </div>

        {/* SUMMARY card */}
        <div className="card" style={{ padding: 36, marginBottom: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          <div>
            <div className="eyebrow">Investimento mensal</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 56, color: "var(--ink)", lineHeight: 1, marginTop: 8 }}>R$ 2.900</div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>Contrato de 12 meses · sem fidelidade após</div>
          </div>
          <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 32 }}>
            <div className="eyebrow">Colaboradores cobertos</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 56, color: "var(--ink)", lineHeight: 1, marginTop: 8 }}>180</div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>R$ 16,11 por colaborador / mês</div>
          </div>
          <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 32 }}>
            <div className="eyebrow">Implantação</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 56, color: "var(--ink)", lineHeight: 1, marginTop: 8 }}>7<span style={{ fontSize: 24, color: "var(--ink-muted)"}}> dias</span></div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>Primeiro diagnóstico em até 14 dias</div>
          </div>
        </div>

        {/* what's included */}
        <h2 className="display" style={{ fontSize: 32, margin: "0 0 24px" }}>O que está incluído</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
          <FeatureCard icon="pulse" title="Diagnóstico COPSOQ II completo"
            desc="Padrão exigido pela NR-1. 41 questões validadas internacionalmente, mapeando 12 dimensões psicossociais." />
          <FeatureCard icon="shield" title="Conformidade NR-1 garantida"
            desc="Relatórios prontos para fiscalização, com plano de ação documentado e revisão trimestral." />
          <FeatureCard icon="users" title="Vitrine para colaboradores"
            desc="Portal próprio onde sua equipe responde diagnósticos e acessa conteúdos. Sua marca, seu domínio." />
          <FeatureCard icon="book" title="Trilhas de aprendizado"
            desc="6 trilhas sobre saúde mental, liderança humanizada, regulação emocional e resiliência." />
          <FeatureCard icon="spark" title="Pulse surveys mensais"
            desc="Monitoramento contínuo com 10 questões rápidas — para acompanhar evolução entre diagnósticos." />
          <FeatureCard icon="file" title="Relatórios executivos"
            desc="Dashboards por setor, unidade e organização. Exportação em PDF e Excel sempre que precisar." />
        </div>

        {/* timeline */}
        <h2 className="display" style={{ fontSize: 32, margin: "0 0 24px" }}>Como funciona</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48, position: "relative" }}>
          {[
            { n: "01", t: "Onboarding", d: "Reunião de implantação, configuração do portal e treinamento do RH (até 7 dias)." },
            { n: "02", t: "Primeiro diagnóstico", d: "COPSOQ II aplicado para toda a Norte Fintech (até 14 dias após onboarding)." },
            { n: "03", t: "Apresentação de resultados", d: "Workshop executivo com o RH, definição conjunta do plano de ação." },
            { n: "04", t: "Acompanhamento contínuo", d: "Pulses mensais, revisão trimestral, e novo COPSOQ anual para conformidade." },
          ].map(s => (
            <div key={s.n} style={{ padding: 22, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 32, color: "var(--health)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginTop: 14 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 6, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>

        {/* QUOTE / about consultant */}
        <div style={{ padding: 40, background: "var(--surface-sage)", borderRadius: 24, marginBottom: 48, display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: 999, background: "var(--health-deep)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 40 }}>CG</div>
          <div>
            <p className="display" style={{ fontSize: 22, fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.4, color: "var(--ink)" }}>
              "Em 14 anos atendendo o setor financeiro, vi quanto a saúde mental impacta turnover e produtividade. Estou aqui para fazer a NR-1 trabalhar a favor da Norte Fintech — não contra."
            </p>
            <div style={{ marginTop: 14, fontSize: 13, color: "var(--ink-soft)" }}>
              <strong>Caio Guedes</strong> · Consultor credenciado Menctor · CRP 06/12345
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="card" style={{ padding: 32, background: "var(--ink)", color: "#FAF8F2", borderRadius: 24 }}>
          {!aceito ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                <div>
                  <div className="eyebrow" style={{ color: "rgba(250,248,242,0.6)" }}>Pronto para começar?</div>
                  <h2 className="display" style={{ fontSize: 32, margin: "8px 0 0", color: "#FAF8F2", fontWeight: 400 }}>Aceite a proposta para iniciar o onboarding.</h2>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" style={{ height: 44, color: "#FAF8F2", borderColor: "rgba(250,248,242,0.3)", padding: "0 18px" }}>
                    Quero conversar
                  </button>
                  <button onClick={() => setAceito(true)} className="btn btn-accent" style={{ height: 44, fontSize: 14, padding: "0 22px" }}>
                    <Icon name="check" size={16} /> Aceitar proposta
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(250,248,242,0.12)", fontSize: 12, color: "rgba(250,248,242,0.6)", display: "flex", gap: 18 }}>
                <span>Proposta válida até 15/06/2026</span>
                <span>·</span>
                <span>Ao aceitar, você concorda com os termos comerciais e receberá o contrato em até 24h</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <span style={{ width: 64, height: 64, borderRadius: 999, background: "var(--health)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name="check" size={32} color="#fff" strokeWidth={2.4}/>
              </span>
              <h2 className="display" style={{ fontSize: 32, margin: "0 0 8px", color: "#FAF8F2", fontWeight: 400 }}>Proposta aceita.</h2>
              <p style={{ margin: 0, color: "rgba(250,248,242,0.7)", fontSize: 14.5 }}>O Caio vai te chamar nas próximas horas para iniciar o onboarding.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card" style={{ padding: 24 }}>
    <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <Icon name={icon} size={18} strokeWidth={1.8}/>
    </span>
    <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13.5, color: "var(--ink-muted)", lineHeight: 1.55 }}>{desc}</div>
  </div>
);

Object.assign(window, { PortalPropostaScreen });
