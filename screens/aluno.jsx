/* global React, Icon, Logo */

// ════════════════════════════════════════════════════════════
// ALUNO PORTAL — colaborador's vitrine. Calmer, warmer, single column.
// Branded by employer (Loghaus). No sidebar — just a clean header.
// ════════════════════════════════════════════════════════════

const AlunoApp = ({ onLogout }) => {
  const [view, setView] = React.useState({ screen: "home" });
  const go = (screen, params={}) => { setView({ screen, ...params }); window.scrollTo(0,0); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Header — branded by Loghaus (not Lector) */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(244, 241, 232, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)"
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8, background: "#1C4B82",
              display: "inline-flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 4v14h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 8l4 4-4 4" stroke="#E87722" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: "#1C4B82", letterSpacing: "-0.01em" }}>LOGHAUS · Cuidar</span>
              <span style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 3 }}>espaço de cuidado e saúde mental</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => go("home")} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, color: view.screen === "home" ? "var(--ink)" : "var(--ink-muted)", fontWeight: view.screen === "home" ? 600 : 500 }}>Início</button>
            <button onClick={() => go("trilhas")} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, color: view.screen === "trilhas" ? "var(--ink)" : "var(--ink-muted)", fontWeight: view.screen === "trilhas" ? 600 : 500 }}>Conteúdo</button>
            <button style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, color: "var(--ink-muted)" }}>Histórico</button>
            <span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 14, marginLeft: 4 }}>RT</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "40px 28px 80px" }}>
        {view.screen === "home"     && <AlunoHome go={go} />}
        {view.screen === "responder"&& <AlunoResponder go={go} />}
        {view.screen === "trilhas"  && <AlunoTrilhas go={go} />}
        {view.screen === "trilha"   && <AlunoTrilhaDetalhe go={go} />}
      </main>
    </div>
  );
};

// ── HOME ─────────────────────────────────────────────────────
const AlunoHome = ({ go }) => (
  <>
    <div style={{ marginBottom: 40 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Quinta · 27 de maio</div>
      <h1 className="display" style={{ fontSize: 56, margin: 0, lineHeight: 1.02 }}>
        Olá, Roberto.<br/>
        <em style={{ fontStyle: "italic", color: "var(--health-deep)" }}>Como você está?</em>
      </h1>
      <p style={{ margin: "18px 0 0", fontSize: 16.5, color: "var(--ink-soft)", maxWidth: 580, lineHeight: 1.55 }}>
        Este é seu espaço de cuidado. Aqui suas respostas são sempre confidenciais — nenhum gestor consegue identificar respostas individuais.
      </p>
    </div>

    {/* Active diagnostic — highlighted big */}
    <div className="card" style={{
      padding: 32, marginBottom: 16,
      background: "linear-gradient(135deg, #2F7D6F 0%, #5BAD72 100%)",
      color: "#fff", borderRadius: 24, position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}/>
      <div style={{ position: "absolute", bottom: -60, right: 60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>

      <div style={{ position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(255,255,255,0.18)", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
          <span className="dot" style={{ background: "#fff" }}/> Disponível agora
        </div>
        <h2 className="display" style={{ fontSize: 32, margin: 0, color: "#fff", lineHeight: 1.1 }}>
          Pesquisa de Clima Organizacional
        </h2>
        <p style={{ margin: "12px 0 22px", fontSize: 14.5, color: "rgba(255,255,255,0.85)", maxWidth: 460 }}>
          41 perguntas sobre como você se sente no trabalho. Demora cerca de <strong style={{ color: "#fff" }}>8 minutos</strong>. Suas respostas são confidenciais.
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => go("responder")} className="btn" style={{ background: "#fff", color: "var(--health-deep)", height: 44, padding: "0 22px", fontSize: 14 }}>
            Começar agora <Icon name="arrow-right" size={15}/>
          </button>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>Fecha em 4 dias</span>
        </div>
      </div>
    </div>

    {/* Other content */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }}>
      <button onClick={() => go("trilhas")} className="card" style={{ padding: 22, textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-peach)", color: "var(--orange-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="book" size={18}/>
        </span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Continue de onde parou</div>
          <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 4 }}>Resiliência e regulação emocional · 30%</div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 4, background: "var(--canvas-warm)", borderRadius: 99 }}>
            <div style={{ width: "30%", height: "100%", background: "var(--health)", borderRadius: 99 }}/>
          </div>
          <Icon name="arrow-right" size={14} color="var(--ink-muted)"/>
        </div>
      </button>

      <div className="card" style={{ padding: 22, background: "var(--surface-sage)" }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.6)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <Icon name="shield" size={18}/>
        </span>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Sua privacidade</div>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.5 }}>
          As respostas vão para análises agregadas. Ninguém na Loghaus vê suas respostas individuais. Saiba mais.
        </div>
      </div>
    </div>

    {/* History */}
    <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <h2 className="display" style={{ fontSize: 24, margin: 0 }}>Seu histórico</h2>
      <button style={{ fontSize: 13, color: "var(--ink-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        Ver tudo <Icon name="arrow-right" size={13}/>
      </button>
    </div>
    <div className="card">
      {[
        ["Pulse Bem-Estar · Abril", "Respondido em 12/04", "8 min"],
        ["Pulse Bem-Estar · Março", "Respondido em 15/03", "7 min"],
        ["Diagnóstico COPSOQ Anual", "Respondido em 18/02", "22 min"],
      ].map((r,i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", color: "var(--ink-muted)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={15} color="var(--health)" strokeWidth={2}/>
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{r[0]}</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{r[1]} · {r[2]}</div>
            </div>
          </div>
          <Icon name="chevron-right" size={15} color="var(--ink-muted)"/>
        </div>
      ))}
    </div>
  </>
);

// ── RESPONDER — Questionnaire experience ────────────────────
const QUESTIONS = [
  { num: 1,  q: "Você tem que trabalhar muito rapidamente?", dim: "Ritmo de trabalho" },
  { num: 2,  q: "A distribuição de trabalho é equilibrada?", dim: "Carga de trabalho" },
  { num: 3,  q: "Você se sente esgotado(a) emocionalmente?", dim: "Burnout" },
  { num: 4,  q: "Seu trabalho exige que esconda seus sentimentos?", dim: "Demandas emocionais" },
  { num: 5,  q: "Você recebe ajuda e apoio do seu superior imediato?", dim: "Apoio social" },
];
const OPTS = [
  { v: 0, label: "Sempre",        sub: "Quase 100% do tempo" },
  { v: 1, label: "Frequentemente",sub: "Boa parte do tempo" },
  { v: 2, label: "Às vezes",      sub: "Em alguns momentos" },
  { v: 3, label: "Raramente",     sub: "Pouco frequente" },
  { v: 4, label: "Nunca",         sub: "Quase nunca acontece" },
];

const AlunoResponder = ({ go }) => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const total = 41;
  const current = QUESTIONS[step % QUESTIONS.length];
  const pct = ((step+1) / total) * 100;

  const answer = (v) => {
    setAnswers({ ...answers, [step]: v });
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
    }, 220);
  };

  return (
    <div>
      {/* Top progress + exit */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <button onClick={() => go("home")} style={{ width: 36, height: 36, borderRadius: 999, background: "var(--surface)", border: "1px solid var(--line)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="x" size={15}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-muted)", marginBottom: 6 }}>
            <span>Pergunta {step+1} de {total}</span>
            <span>{current.dim}</span>
          </div>
          <div style={{ height: 5, background: "var(--canvas-warm)", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--health)", borderRadius: 99, transition: "width .35s ease" }}/>
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ minHeight: "55vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{current.dim}</div>
        <h2 className="display" style={{ fontSize: 44, margin: 0, lineHeight: 1.1, maxWidth: 660 }}>
          {current.q}
        </h2>
        <p style={{ margin: "16px 0 0", fontSize: 14, color: "var(--ink-muted)" }}>Pense nas últimas 4 semanas. Responda com sinceridade.</p>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 10, maxWidth: 540 }}>
          {OPTS.map(o => {
            const selected = answers[step] === o.v;
            return (
              <button key={o.v} onClick={() => answer(o.v)} style={{
                display: "grid", gridTemplateColumns: "26px 1fr auto", gap: 14, alignItems: "center",
                padding: "16px 18px",
                borderRadius: 14,
                background: selected ? "var(--surface-sage)" : "var(--surface)",
                border: selected ? "1px solid var(--health)" : "1px solid var(--line)",
                boxShadow: "var(--shadow-card)",
                textAlign: "left",
                transition: "background .15s, border-color .15s, transform .1s"
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 99,
                  border: selected ? "6px solid var(--health)" : "1px solid var(--line-strong)",
                  background: selected ? "var(--surface)" : "transparent"
                }}/>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>{o.label}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>{o.sub}</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{o.v + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className="btn btn-ghost" style={{ height: 38, opacity: step === 0 ? 0.4 : 1 }}>
          <Icon name="chevron-left" size={14}/> Voltar
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "var(--ink-muted)" }}>
          <Icon name="shield" size={14}/> Confidencial
          <span>·</span>
          <span>Salvo automaticamente</span>
        </div>
        <button onClick={() => setStep(step + 1)} className="btn btn-soft" style={{ height: 38 }}>
          Pular <Icon name="chevron-right" size={14}/>
        </button>
      </div>
    </div>
  );
};

// ── TRILHAS ──────────────────────────────────────────────────
const ALUNO_TRILHAS = [
  { id: 1, nome: "Resiliência e regulação emocional", autor: "Dra. Helena Vargas", duracao: "2h 40min", progresso: 30, capa: "linear-gradient(135deg, #C75A4C, #D89A3F)", recomendado: true },
  { id: 2, nome: "Lidando com pressão e prazos",      autor: "Equipe Menctor",     duracao: "1h 10min", progresso: 0,  capa: "linear-gradient(135deg, #4E83A8, #2F7D6F)", recomendado: true },
  { id: 3, nome: "Sono e produtividade",              autor: "Dr. Pedro Galvão",   duracao: "45min",    progresso: 100, capa: "linear-gradient(135deg, #2F7D6F, #5BAD72)" },
  { id: 4, nome: "Comunicação não-violenta no trabalho", autor: "Equipe Menctor",  duracao: "1h 30min", progresso: 0,  capa: "linear-gradient(135deg, #D89A3F, #E87722)" },
];

const AlunoTrilhas = ({ go }) => (
  <>
    <div style={{ marginBottom: 32 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Para você</div>
      <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Conteúdos para você se cuidar</h1>
      <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 540 }}>
        Selecionados a partir das suas últimas respostas. Pode ler, ouvir ou assistir no seu ritmo.
      </p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {ALUNO_TRILHAS.map(t => (
        <button key={t.id} onClick={() => go("trilha")} className="card" style={{ padding: 0, overflow: "hidden", textAlign: "left", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 150, background: t.capa, position: "relative", display: "flex", alignItems: "flex-end", padding: 18 }}>
            {t.recomendado && <span style={{ position: "absolute", top: 14, right: 14, padding: "3px 10px", background: "rgba(255,255,255,0.92)", borderRadius: 999, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink)" }}>Recomendado</span>}
            {t.progresso === 100 && <span style={{ position: "absolute", top: 14, right: 14, padding: "3px 10px", background: "var(--health)", color: "#fff", borderRadius: 999, fontSize: 10.5, fontWeight: 700 }}>✓ Concluído</span>}
          </div>
          <div style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, margin: 0, lineHeight: 1.2, color: "var(--ink)" }}>{t.nome}</h3>
            <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>{t.autor} · {t.duracao}</div>
            {t.progresso > 0 && t.progresso < 100 && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 4, background: "var(--canvas-warm)", borderRadius: 99 }}>
                  <div style={{ width: `${t.progresso}%`, height: "100%", background: "var(--health)", borderRadius: 99 }}/>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{t.progresso}%</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  </>
);

const AlunoTrilhaDetalhe = ({ go }) => (
  <>
    <button onClick={() => go("trilhas")} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-muted)", fontSize: 13, marginBottom: 18 }}>
      <Icon name="chevron-left" size={14}/> Voltar
    </button>
    <div style={{ marginBottom: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Trilha · 5 módulos · 2h 40min</div>
      <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Resiliência e regulação emocional</h1>
      <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-soft)", maxWidth: 600, lineHeight: 1.55 }}>
        Dra. Helena Vargas, psicóloga clínica especializada em ansiedade no trabalho, te guia por 5 práticas para regular emoções no dia a dia.
      </p>
    </div>

    <div style={{ height: 280, borderRadius: 24, background: "linear-gradient(135deg, #C75A4C, #D89A3F)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ width: 64, height: 64, borderRadius: 999, background: "rgba(255,255,255,0.95)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </span>
    </div>

    <div className="card" style={{ padding: 22 }}>
      <h3 className="display" style={{ fontSize: 22, margin: "0 0 14px" }}>Módulos</h3>
      {[
        ["Identificando suas emoções", "12 min", true],
        ["Técnicas de respiração",      "18 min", true],
        ["Reframing cognitivo",          "32 min", false],
        ["Práticas de mindfulness",      "48 min", false],
        ["Plano pessoal de regulação",   "50 min", false],
      ].map((m,i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: i > 0 ? "1px dashed var(--line-strong)" : "none" }}>
          <span style={{ width: 26, height: 26, borderRadius: 999, background: m[2] ? "var(--health)" : "var(--surface-2)", color: m[2] ? "#fff" : "var(--ink-muted)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {m[2] ? "✓" : i+1}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{m[0]}</div>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{m[1]}</div>
          </div>
          <button className="btn btn-soft" style={{ height: 32, fontSize: 12.5 }}>
            {m[2] ? "Rever" : i === 2 ? "Continuar" : "Iniciar"}
          </button>
        </div>
      ))}
    </div>
  </>
);

Object.assign(window, { AlunoApp });
