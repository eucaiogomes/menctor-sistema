/* global React, Icon, Page, CLIENTES, LEADS_PIPELINE, riskPill, riskLabel */

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CLIENTES â€” unifies Leads/Pipeline + Carteira ativa
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const EMAIL_API_BASE = () => {
  const saved = window.localStorage && window.localStorage.getItem("MENCTOR_API_URL");
  if (saved) return saved;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";
};

const sendTransactionalEmail = async ({ to, subject, html, text }) => {
  const response = await fetch(`${EMAIL_API_BASE()}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, html, text }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Nao foi possivel enviar o e-mail.");
  return payload;
};

const TEST_RECIPIENT = "gcaio98406@gmail.com";

const proposalEmail = (card) => ({
  to: card?.email || TEST_RECIPIENT,
  subject: `Proposta Menctor para ${card?.empresa || "sua empresa"}`,
  text: `Ola, ${card?.contato || "gestor(a)"}. Segue a proposta Menctor para ${card?.empresa || "sua empresa"}.`,
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2b26">
      <h2>Proposta Menctor para ${card?.empresa || "sua empresa"}</h2>
      <p>Ola, <strong>${card?.contato || "gestor(a)"}</strong>.</p>
      <p>Preparei esta proposta para apoiar a jornada de saude psicossocial, diagnosticos NR-1 e acompanhamento continuo.</p>
      <div style="padding:16px;border-radius:12px;background:#f3faf6;border:1px solid #cde8dc">
        <strong>Investimento mensal:</strong> R$ ${Number(card?.valor || 0).toLocaleString("pt-BR")}<br/>
        <strong>Colaboradores cobertos:</strong> ${card?.funcionarios || "-"}<br/>
        <strong>Implantacao:</strong> 7 dias
      </div>
      <p>Inclui portal do colaborador, painel do RH, relatorios executivos e acompanhamento consultivo.</p>
      <p>Abraços,<br/>Caio Guedes · Menctor</p>
    </div>
  `,
});

const contractEmail = (dataOrCard) => ({
  to: dataOrCard?.email || TEST_RECIPIENT,
  subject: `Contrato Menctor para ${dataOrCard?.empresa || "sua empresa"}`,
  text: `Contrato Menctor para ${dataOrCard?.empresa || "sua empresa"} enviado para assinatura.`,
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2b26">
      <h2>Contrato Menctor para ${dataOrCard?.empresa || "sua empresa"}</h2>
      <p>Ola, <strong>${dataOrCard?.contato || "responsavel legal"}</strong>.</p>
      <p>Segue o contrato Menctor para assinatura digital.</p>
      <div style="padding:16px;border-radius:12px;background:#f3faf6;border:1px solid #cde8dc">
        <strong>Valor mensal:</strong> R$ ${Number(dataOrCard?.valor || 0).toLocaleString("pt-BR")}<br/>
        <strong>Colaboradores cobertos:</strong> ${dataOrCard?.colaboradores || dataOrCard?.funcionarios || "-"}<br/>
        <strong>Vigencia:</strong> ${dataOrCard?.vigencia || 12} meses
      </div>
      <p>Assim que a assinatura for concluida, iniciaremos o onboarding.</p>
      <p>Abraços,<br/>Caio Guedes · Menctor</p>
    </div>
  `,
});

const LeadInviteForm = () => {
  const params = new URLSearchParams(window.location.search);
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    empresa: "",
    contato: params.get("nome") || "",
    email: params.get("email") || "",
    telefone: "",
    funcionarios: "",
    interesse: "Diagnostico NR-1",
  });
  const upd = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const submit = async () => {
    const lead = {
      id: `lead-${Date.now()}`,
      empresa: data.empresa || "Novo lead",
      contato: data.contato || data.email || "Contato a confirmar",
      email: data.email,
      funcionarios: Number(data.funcionarios) || 0,
      valor: Number(data.funcionarios) > 500 ? 8900 : Number(data.funcionarios) > 100 ? 4200 : 1500,
      dias: 0,
      decisor: data.contato || "Contato a confirmar",
      proximoPasso: `Retornar sobre ${data.interesse}`,
      probabilidade: 35,
      origem: "Formulario de convite",
    };
    setLoading(true);
    setError("");
    try {
      if (window.MenctorDB) await window.MenctorDB.upsertPipelineCard(lead, "lead");
      const saved = JSON.parse(window.localStorage.getItem("MENCTOR_LEADS") || "[]");
      window.localStorage.setItem("MENCTOR_LEADS", JSON.stringify([lead, ...saved.filter(item => item.id !== lead.id)]));
      window.__MENCTOR_LAST_LEAD = lead;
      window.dispatchEvent(new CustomEvent("menctor:lead-created", { detail: lead }));
      setDone(true);
    } catch (err) {
      setError(err.message || "Nao foi possivel salvar o lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-warm)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
      <div className="card" style={{ width: "100%", maxWidth: 760, padding: 36 }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "28px 10px" }}>
            <div style={{ width: 68, height: 68, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Icon name="check" size={32} />
            </div>
            <div className="eyebrow" style={{ color: "var(--health-deep)", marginBottom: 10 }}>Lead criado</div>
            <h1 className="display" style={{ fontSize: 38, margin: 0 }}>{data.empresa || "Sua empresa"} entrou no pipeline Menctor.</h1>
            <p style={{ margin: "14px auto 0", maxWidth: 480, color: "var(--ink-muted)", lineHeight: 1.55 }}>
              O consultor recebeu seus dados e vai entrar em contato para montar a proposta.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Pre-cadastro Menctor</div>
              <h1 className="display" style={{ fontSize: 42, margin: 0 }}>Conte um pouco sobre sua empresa.</h1>
              <p style={{ margin: "12px 0 0", color: "var(--ink-muted)", maxWidth: 540, lineHeight: 1.55 }}>
                Com esses dados, preparamos o melhor caminho para diagnostico psicossocial, NR-1 e portal do colaborador.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <LeadField label="Empresa">
                <LeadInput value={data.empresa} onChange={v => upd("empresa", v)} placeholder="Ex.: Norte Fintech" />
              </LeadField>
              <LeadField label="Seu nome">
                <LeadInput value={data.contato} onChange={v => upd("contato", v)} placeholder="Ex.: Ana Beatriz" />
              </LeadField>
              <LeadField label="E-mail corporativo">
                <LeadInput value={data.email} onChange={v => upd("email", v)} placeholder="voce@empresa.com.br" type="email" />
              </LeadField>
              <LeadField label="Telefone / WhatsApp">
                <LeadInput value={data.telefone} onChange={v => upd("telefone", v)} placeholder="(11) 99999-9999" />
              </LeadField>
              <LeadField label="Colaboradores">
                <LeadInput value={data.funcionarios} onChange={v => upd("funcionarios", v)} placeholder="180" type="number" />
              </LeadField>
              <LeadField label="Interesse principal">
                <select value={data.interesse} onChange={e => upd("interesse", e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)" }}>
                  <option>Diagnostico NR-1</option>
                  <option>Portal do colaborador</option>
                  <option>Trilhas de saude mental</option>
                  <option>Relatorios para auditoria</option>
                </select>
              </LeadField>
            </div>
            <button onClick={submit} disabled={!data.empresa.trim() || !data.email.trim() || loading} className="btn btn-accent" style={{ width: "100%", height: 46, justifyContent: "center", marginTop: 24, opacity: (!data.empresa.trim() || !data.email.trim() || loading) ? 0.6 : 1 }}>
              <Icon name="send" size={15}/> {loading ? "Salvando..." : "Enviar dados"}
            </button>
            {error && (
              <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 10, background: "var(--coral-soft)", color: "var(--coral)", fontSize: 12 }}>
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const LeadField = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const LeadInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} style={{ width: "100%", height: 44, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", color: "var(--ink)", fontSize: 14 }} />
);

// â”€â”€â”€ Invite modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const InviteModal = ({ onClose }) => {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const leadUrl = `${window.location.origin}${window.location.pathname}?lead=form&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email.trim())}`;
    try {
      await sendTransactionalEmail({
        to: email.trim(),
        subject: "Pre-cadastro Menctor para sua empresa",
        text: `${nome || "Ola"}, preencha o formulario para receber uma proposta Menctor: ${leadUrl}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2b26">
            <h2>Pre-cadastro Menctor</h2>
            <p>Ola, <strong>${nome || "gestor(a)"}</strong>.</p>
            <p>Preencha um formulario rapido para que eu prepare uma proposta de diagnostico psicossocial, NR-1 e portal do colaborador para sua empresa.</p>
            <p>
              <a href="${leadUrl}" style="display:inline-block;background:#E87722;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">
                Preencher formulario
              </a>
            </p>
            <p style="font-size:12px;color:#66736d">Se o botao nao abrir, copie este link: ${leadUrl}</p>
            <p>Abraços,<br/>Caio Guedes · Menctor</p>
          </div>
        `,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Nao foi possivel enviar o convite.");
    } finally {
      setLoading(false);
    }
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
              <strong>{email}</strong> receberÃ¡ o formulario de pre-cadastro em instantes.
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
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 3 }}>O cliente recebe um formulario e vira lead ao preencher.</div>
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
              {loading ? "Enviandoâ€¦" : <><Icon name="send" size={15} /> Enviar convite</>}
            </button>
            {error && (
              <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 10, background: "var(--coral-soft)", color: "var(--coral)", fontSize: 12 }}>
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NovoContratoFullPage = ({ card, onClose, onContractSent }) => {
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    empresa: card?.empresa || "",
    contato: card?.contato || "",
    email: card?.email || "ana@edutec.coop.br",
    cnpj: "",
    vigencia: "12",
    inicio: "01/06/2026",
    valor: card?.valor || 4200,
    colaboradores: card?.funcionarios || 100,
    multa: "30 dias",
    assinatura: "digital",
  });
  const upd = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const valorMensal = Number(data.valor) || 0;
  const totalAnual = valorMensal * 12;
  const sendContract = async () => {
    setSending(true);
    setError("");
    try {
      await sendTransactionalEmail(contractEmail(data));
      setSent(true);
      onContractSent && onContractSent({ ...card, ...data, funcionarios: Number(data.colaboradores) || card?.funcionarios || 0, valor: Number(data.valor) || card?.valor || 0 });
    } catch (err) {
      setError(err.message || "Nao foi possivel enviar o contrato.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
            <Icon name="check" size={34} />
          </div>
          <div className="eyebrow" style={{ marginBottom: 10, color: "var(--health-deep)" }}>Contrato enviado</div>
          <h1 className="display" style={{ fontSize: 38, margin: 0 }}>{data.empresa || "Cliente"} recebeu o contrato.</h1>
          <p style={{ margin: "14px 0 28px", fontSize: 15, lineHeight: 1.55, color: "var(--ink-muted)" }}>
            O link de assinatura foi enviado para {data.email}. O card avancou para Contrato e fica aguardando assinatura.
          </p>
          <button onClick={onClose} className="btn btn-primary" style={{ height: 42, justifyContent: "center", padding: "0 22px" }}>
            Voltar para pipeline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 36px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--canvas)", position: "sticky", top: 0, zIndex: 20 }}>
        <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-muted)", fontSize: 13.5 }}>
          <Icon name="chevron-left" size={15}/> Voltar para pipeline
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-muted)" }}>
          <span className="pill pill-amber" style={{ fontSize: 11 }}>Etapa aceita</span>
          <span>{data.empresa || "Contrato em preparo"}</span>
        </div>
        <button onClick={sendContract} disabled={sending} className="btn btn-accent" style={{ height: 38, marginRight: 180, opacity: sending ? 0.7 : 1 }}>
          <Icon name="send" size={14}/> {sending ? "Enviando..." : "Enviar contrato"}
        </button>
      </div>
      {error && (
        <div style={{ margin: "10px 36px 0 auto", maxWidth: 460, padding: "9px 12px", borderRadius: 10, background: "var(--coral-soft)", color: "var(--coral)", fontSize: 12 }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
        <div style={{ flex: "0 0 48%", overflowY: "auto", padding: "44px 48px 120px" }}>
          <div style={{ marginBottom: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Criacao do contrato</div>
            <h1 className="display" style={{ fontSize: 40, margin: 0, lineHeight: 1.05 }}>Revise os dados antes do envio.</h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 520, lineHeight: 1.55 }}>
              O contrato nasce da proposta aceita e atualiza a previa em tempo real.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ContractField label="Empresa">
              <ContractInput value={data.empresa} onChange={v => upd("empresa", v)} placeholder="EduTec Cooperativa" />
            </ContractField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ContractField label="Responsavel">
                <ContractInput value={data.contato} onChange={v => upd("contato", v)} placeholder="Ana Paula Rios" />
              </ContractField>
              <ContractField label="E-mail de assinatura">
                <ContractInput value={data.email} onChange={v => upd("email", v)} placeholder="ana@empresa.com.br" type="email" />
              </ContractField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ContractField label="CNPJ">
                <ContractInput value={data.cnpj} onChange={v => upd("cnpj", v)} placeholder="00.000.000/0000-00" />
              </ContractField>
              <ContractField label="Inicio">
                <ContractInput value={data.inicio} onChange={v => upd("inicio", v)} placeholder="01/06/2026" />
              </ContractField>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ContractField label="Valor mensal">
                <ContractInput value={data.valor} onChange={v => upd("valor", v)} type="number" />
              </ContractField>
              <ContractField label="Colaboradores cobertos">
                <ContractInput value={data.colaboradores} onChange={v => upd("colaboradores", v)} type="number" />
              </ContractField>
            </div>
            <ContractField label="Vigencia">
              <div style={{ display: "flex", gap: 6, padding: 4, background: "var(--canvas-warm)", borderRadius: 999, width: "fit-content" }}>
                {["12", "24", "36"].map(meses => (
                  <button key={meses} onClick={() => upd("vigencia", meses)} style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, background: data.vigencia === meses ? "var(--surface)" : "transparent", color: data.vigencia === meses ? "var(--ink)" : "var(--ink-muted)", fontWeight: data.vigencia === meses ? 600 : 500, boxShadow: data.vigencia === meses ? "var(--shadow-card)" : "none" }}>
                    {meses} meses
                  </button>
                ))}
              </div>
            </ContractField>
            <ContractField label="Tipo de assinatura">
              <div style={{ display: "flex", gap: 8 }}>
                {["digital", "manual"].map(tipo => (
                  <button key={tipo} onClick={() => upd("assinatura", tipo)} className={data.assinatura === tipo ? "btn btn-primary" : "btn btn-soft"} style={{ height: 36, fontSize: 13 }}>
                    {tipo === "digital" ? "Digital" : "Manual"}
                  </button>
                ))}
              </div>
            </ContractField>
          </div>
        </div>

        <div style={{ width: 1, background: "var(--line)", flexShrink: 0 }} />

        <div style={{ flex: 1, overflowY: "auto", background: "var(--canvas-warm)", padding: "44px 40px 80px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Preview do contrato</div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>Documento que sera enviado para assinatura</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", fontWeight: 700 }}>AO VIVO</span>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "24px 30px", borderBottom: "1px solid #ece7dd", display: "flex", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 24, color: "#1f2b26" }}>Contrato Menctor</div>
                <div style={{ fontSize: 12, color: "#6b6f6a", marginTop: 4 }}>Saude psicossocial, NR-1 e portal do colaborador</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#6b6f6a" }}>
                <div>Inicio: {data.inicio || "--"}</div>
                <div>Vigencia: {data.vigencia} meses</div>
              </div>
            </div>

            <div style={{ padding: "30px", color: "#24312c", fontSize: 14.5, lineHeight: 1.65 }}>
              <p style={{ marginTop: 0 }}>
                Pelo presente instrumento, <strong>Menctor by Lector</strong> e <strong>{data.empresa || "empresa contratante"}</strong>, representada por <strong>{data.contato || "responsavel legal"}</strong>, formalizam a contratacao da plataforma Menctor.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0" }}>
                <ContractPreviewBox label="Valor mensal" value={`R$ ${valorMensal.toLocaleString("pt-BR")}`} />
                <ContractPreviewBox label="Valor anual estimado" value={`R$ ${totalAnual.toLocaleString("pt-BR")}`} />
                <ContractPreviewBox label="Cobertura" value={`${data.colaboradores || 0} colaboradores`} />
                <ContractPreviewBox label="Assinatura" value={data.assinatura === "digital" ? "Digital" : "Manual"} />
              </div>

              <h3 style={{ fontSize: 15, margin: "22px 0 8px", color: "#1f2b26" }}>Escopo contratado</h3>
              {[
                "Portal do colaborador personalizado para a empresa",
                "Diagnosticos psicossociais alinhados a NR-1",
                "Painel administrativo para RH e liderancas autorizadas",
                "Relatorios consolidados para plano de acao e auditoria",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 9, marginBottom: 7 }}>
                  <span style={{ color: "#2F7D6F", fontWeight: 700 }}>âœ“</span>
                  <span>{item}</span>
                </div>
              ))}

              <h3 style={{ fontSize: 15, margin: "22px 0 8px", color: "#1f2b26" }}>Condicoes comerciais</h3>
              <p style={{ margin: 0 }}>
                Pagamento mensal de <strong>R$ {valorMensal.toLocaleString("pt-BR")}</strong>, com vigencia minima de <strong>{data.vigencia} meses</strong>. Aviso previo para cancelamento: <strong>{data.multa}</strong>.
              </p>

              <div style={{ marginTop: 28, padding: 18, borderRadius: 12, background: "#f3faf6", border: "1px solid #cde8dc", display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="send" size={18} color="#2F7D6F" />
                <div>
                  <div style={{ fontWeight: 700, color: "#1f2b26" }}>Pronto para assinatura</div>
                  <div style={{ fontSize: 12.5, color: "#5d6862" }}>Enviado para {data.email || "email do responsavel"} assim que voce confirmar.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContractField = ({ label, children }) => (
  <div>
    <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const ContractInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, fontSize: 14, color: "var(--ink)", outline: "none" }} />
);

const ContractPreviewBox = ({ label, value }) => (
  <div style={{ padding: 14, borderRadius: 12, background: "#faf8f2", border: "1px solid #ece7dd" }}>
    <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a817b", fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2b26", marginTop: 4 }}>{value}</div>
  </div>
);

const ContratoPreviewModal = ({ card, onClose, onMarkSigned }) => {
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const valor = card?.valor || 4200;
  const funcionarios = card?.funcionarios || 100;
  const totalAnual = valor * 12;
  const resendContract = async () => {
    setSending(true);
    setStatus("");
    try {
      await sendTransactionalEmail(contractEmail(card));
      setStatus(`Link reenviado para ${card?.email || TEST_RECIPIENT}.`);
    } catch (err) {
      setStatus(err.message || "Nao foi possivel reenviar o contrato.");
    } finally {
      setSending(false);
    }
  };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(18,24,21,0.48)", backdropFilter: "blur(6px)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(980px, 100%)", maxHeight: "88vh", overflow: "hidden",
        background: "var(--canvas)", borderRadius: 18, boxShadow: "var(--shadow-modal)",
        display: "grid", gridTemplateRows: "auto 1fr",
      }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Visualizar contrato</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 24, color: "var(--ink)" }}>
              {card?.empresa || "Contrato em assinatura"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pill" style={{ fontSize: 11 }}>Em assinatura</span>
            <button onClick={resendContract} disabled={sending} className="btn btn-soft" style={{ height: 34, fontSize: 12, opacity: sending ? 0.7 : 1 }}>
              <Icon name="send" size={13}/> {sending ? "Enviando..." : "Reenviar link"}
            </button>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-muted)" }}>
              <Icon name="x" size={18}/>
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", padding: 28, background: "var(--canvas-warm)" }}>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)" }}>
            {status && (
              <div style={{ padding: "10px 24px", background: "var(--surface-sage)", color: "var(--health-deep)", fontSize: 12.5, borderBottom: "1px solid #cde8dc" }}>
                {status}
              </div>
            )}
            <div style={{ padding: "24px 30px", borderBottom: "1px solid #ece7dd", display: "flex", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 24, color: "#1f2b26" }}>Contrato Menctor</div>
                <div style={{ fontSize: 12, color: "#6b6f6a", marginTop: 4 }}>Saude psicossocial, NR-1 e portal do colaborador</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#6b6f6a" }}>
                <div>Contrato: CTR-2026-{String(card?.id || "001").toUpperCase()}</div>
                <div>Enviado ha {card?.dias || 1} dia(s)</div>
              </div>
            </div>

            <div style={{ padding: "30px", color: "#24312c", fontSize: 14.5, lineHeight: 1.65 }}>
              <p style={{ marginTop: 0 }}>
                Pelo presente instrumento, <strong>Menctor by Lector</strong> e <strong>{card?.empresa || "empresa contratante"}</strong>, representada por <strong>{card?.contato || "responsavel legal"}</strong>, formalizam a contratacao da plataforma Menctor.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: "24px 0" }}>
                <ContractPreviewBox label="Valor mensal" value={`R$ ${valor.toLocaleString("pt-BR")}`} />
                <ContractPreviewBox label="Valor anual" value={`R$ ${totalAnual.toLocaleString("pt-BR")}`} />
                <ContractPreviewBox label="Cobertura" value={`${funcionarios} colab.`} />
                <ContractPreviewBox label="Assinatura" value="Digital" />
              </div>

              <h3 style={{ fontSize: 15, margin: "22px 0 8px", color: "#1f2b26" }}>Escopo contratado</h3>
              {[
                "Portal do colaborador personalizado para a empresa",
                "Diagnosticos psicossociais alinhados a NR-1",
                "Painel administrativo para RH e liderancas autorizadas",
                "Relatorios consolidados para plano de acao e auditoria",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 9, marginBottom: 7 }}>
                  <span style={{ color: "#2F7D6F", fontWeight: 700 }}>âœ“</span>
                  <span>{item}</span>
                </div>
              ))}

              <div style={{ marginTop: 28, padding: 18, borderRadius: 12, background: "#f3faf6", border: "1px solid #cde8dc", display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="file" size={18} color="#2F7D6F" />
                  <div>
                    <div style={{ fontWeight: 700, color: "#1f2b26" }}>Aguardando assinatura digital</div>
                    <div style={{ fontSize: 12.5, color: "#5d6862" }}>Link enviado para {card?.contato || "responsavel"}.</div>
                  </div>
                </div>
                <button onClick={onMarkSigned} className="btn btn-primary" style={{ height: 36, fontSize: 12 }}>
                  <Icon name="check" size={13}/> Marcar assinado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropostaPreviewModal = ({ card, onClose, onAcceptProposal }) => {
  const [accepted, setAccepted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const valor = card?.valor || 4200;
  const funcionarios = card?.funcionarios || 100;
  const ticket = funcionarios ? valor / funcionarios : valor;
  const resendProposal = async () => {
    setSending(true);
    setStatus("");
    try {
      await sendTransactionalEmail(proposalEmail(card));
      setStatus(`Proposta reenviada para ${card?.email || TEST_RECIPIENT}.`);
    } catch (err) {
      setStatus(err.message || "Nao foi possivel reenviar a proposta.");
    } finally {
      setSending(false);
    }
  };
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(18,24,21,0.48)", backdropFilter: "blur(6px)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(1040px, 100%)", maxHeight: "88vh", overflow: "hidden",
        background: "var(--canvas)", borderRadius: 18, boxShadow: "var(--shadow-modal)",
        display: "grid", gridTemplateRows: "auto 1fr",
      }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Visualizar proposta</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 24, color: "var(--ink)" }}>
              {card?.empresa || "Proposta comercial"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={resendProposal} disabled={sending} className="btn btn-soft" style={{ height: 34, fontSize: 12, opacity: sending ? 0.7 : 1 }}>
              <Icon name="send" size={13}/> {sending ? "Enviando..." : "Reenviar"}
            </button>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-muted)" }}>
              <Icon name="x" size={18}/>
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", padding: 28, background: "var(--canvas-warm)" }}>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)" }}>
            {status && (
              <div style={{ padding: "10px 24px", background: "var(--surface-sage)", color: "var(--health-deep)", fontSize: 12.5, borderBottom: "1px solid #cde8dc" }}>
                {status}
              </div>
            )}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #ebe6dc", background: "#f8f6ef", display: "flex", justifyContent: "space-between", gap: 16, fontSize: 12.5, color: "#666" }}>
              <span><strong style={{ color: "#333" }}>De:</strong> Caio Guedes Â· Menctor</span>
              <span><strong style={{ color: "#333" }}>Para:</strong> {card?.contato || "Contato principal"}</span>
              <span><strong style={{ color: "#333" }}>Status:</strong> proposta enviada</span>
            </div>

            <div style={{ padding: "36px 42px", color: "#222", lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start", marginBottom: 34 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg,#2F7D6F,#5BAD72)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>m</span>
                    <span style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 700 }}>menctor</span>
                  </div>
                  <div className="eyebrow" style={{ marginBottom: 10, color: "var(--health-deep)" }}>Proposta comercial</div>
                  <h2 className="display" style={{ fontSize: 44, lineHeight: 1.02, margin: 0, color: "#1f2b26" }}>
                    Saude psicossocial e conformidade NR-1 para {card?.empresa || "sua empresa"}.
                  </h2>
                </div>
                <div style={{ minWidth: 190, padding: 18, borderRadius: 14, background: "#f3faf6", border: "1px solid #cde8dc" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2F7D6F" }}>Investimento</div>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 32, color: "#1f2b26", marginTop: 4 }}>R$ {valor.toLocaleString("pt-BR")}</div>
                  <div style={{ fontSize: 12, color: "#66736d" }}>por mes Â· {funcionarios} colaboradores</div>
                </div>
              </div>

              <p style={{ margin: "0 0 20px" }}>
                Ola, <strong>{card?.contato || "gestor(a)"}</strong>. Preparei esta proposta para apoiar a <strong>{card?.empresa || "empresa"}</strong> na jornada de saude psicossocial, diagnosticos NR-1 e acompanhamento continuo.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "24px 0" }}>
                <ProposalStat label="Colaboradores" value={funcionarios.toLocaleString("pt-BR")} />
                <ProposalStat label="Por colaborador" value={`R$ ${ticket.toFixed(2).replace(".", ",")}`} />
                <ProposalStat label="Implantacao" value="7 dias" />
              </div>

              <h3 style={{ fontSize: 16, margin: "26px 0 12px", color: "#1f2b26" }}>O que esta incluido</h3>
              {[
                "Diagnostico psicossocial baseado na NR-1 e COPSOQ II",
                "Portal do colaborador com acesso a diagnosticos e trilhas",
                "Painel do RH para acompanhar adesao, setores e plano de acao",
                "Relatorios executivos para auditoria e tomada de decisao",
                "Acompanhamento consultivo com Caio Guedes",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "#2F7D6F", fontWeight: 700 }}>âœ“</span>
                  <span>{item}</span>
                </div>
              ))}

              <div style={{ marginTop: 28, padding: 22, borderRadius: 14, background: "#1f2b26", color: "#FAF8F2", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center" }}>
                {!accepted ? (
                  <>
                    <div>
                      <div style={{ fontSize: 12, opacity: .7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Proxima etapa</div>
                      <div style={{ fontSize: 20, fontFamily: "var(--display)", marginTop: 4 }}>Aceite da proposta e envio do contrato.</div>
                    </div>
                    <button onClick={() => { setAccepted(true); onAcceptProposal && onAcceptProposal(card); }} className="btn btn-accent" style={{ height: 42 }}>
                      <Icon name="check" size={15}/> Aceitar proposta
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon name="check" size={22} color="var(--health)" />
                    <div>
                      <div style={{ fontSize: 18, fontFamily: "var(--display)" }}>Proposta aceita.</div>
                      <div style={{ fontSize: 13, opacity: .72 }}>Agora este negocio pode seguir para contrato.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalStat = ({ label, value }) => (
  <div style={{ padding: 16, borderRadius: 12, background: "#faf8f2", border: "1px solid #ece7dd" }}>
    <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a817b", fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 24, color: "#1f2b26", marginTop: 4 }}>{value}</div>
  </div>
);

const buildPipeline = () => {
  return {
    ...LEADS_PIPELINE,
    lead: [...LEADS_PIPELINE.lead],
    proposta: [...LEADS_PIPELINE.proposta],
    aceita: [...LEADS_PIPELINE.aceita],
    contrato: [...LEADS_PIPELINE.contrato],
    fechado: [...LEADS_PIPELINE.fechado],
  };
};

const mergeCardsIntoPipeline = (base, cards) => {
  const incomingIds = new Set(cards.map(card => card.id));
  const next = Object.fromEntries(Object.entries(base).map(([stage, stageCards]) => [
    stage,
    stageCards.filter(card => !incomingIds.has(card.id)),
  ]));
  cards.forEach(card => {
    const stage = card.stage || "lead";
    next[stage] = [card, ...(next[stage] || [])];
  });
  return next;
};

const ClientesScreen = ({ navigate }) => {
  const [creating, setCreating] = React.useState(false);
  const [inviting, setInviting] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState(null);
  const [contractCard, setContractCard] = React.useState(null);
  const [proposalCard, setProposalCard] = React.useState(null);
  const [contractPreviewCard, setContractPreviewCard] = React.useState(null);
  const [pipeline, setPipeline] = React.useState(buildPipeline);
  const persistPipelineCard = (card, stage) => {
    if (!window.MenctorDB || !card) return;
    window.MenctorDB.upsertPipelineCard(card, stage).catch(err => {
      console.warn("Falha ao sincronizar pipeline no Supabase", err);
    });
  };

  const moveCard = (card, toStage, patch = {}) => {
    if (!card) return;
    const persistCard = { ...card, ...patch, dias: 0 };
    setPipeline(prev => {
      let moving = null;
      const next = Object.fromEntries(Object.entries(prev).map(([stage, cards]) => {
        const found = cards.find(item => item.id === card.id);
        if (found) moving = found;
        return [stage, cards.filter(item => item.id !== card.id)];
      }));
      const updated = { ...(moving || card), ...patch, dias: 0 };
      return { ...next, [toStage]: [updated, ...(next[toStage] || [])] };
    });
    persistPipelineCard(persistCard, toStage);
  };
  const moveCardById = (cardId, toStage) => {
    const currentCard = Object.values(pipeline).flat().find(card => card.id === cardId);
    const persistCard = currentCard ? { ...currentCard, dias: 0, etapaManual: true } : null;
    setPipeline(prev => {
      let moving = null;
      let fromStage = null;
      const next = Object.fromEntries(Object.entries(prev).map(([stage, cards]) => {
        const found = cards.find(item => item.id === cardId);
        if (found) {
          moving = found;
          fromStage = stage;
        }
        return [stage, cards.filter(item => item.id !== cardId)];
      }));
      if (!moving || fromStage === toStage) return prev;
      const updated = { ...moving, dias: 0, etapaManual: true };
      return { ...next, [toStage]: [updated, ...(next[toStage] || [])] };
    });
    if (persistCard) persistPipelineCard(persistCard, toStage);
  };

  React.useEffect(() => {
    if (window.MenctorDB) {
      window.MenctorDB.listPipelineCards()
        .then(cards => {
          if (cards.length) setPipeline(prev => mergeCardsIntoPipeline(prev, cards));
        })
        .catch(err => console.warn("Falha ao carregar pipeline do Supabase", err));
    }
    const syncLeads = () => {
      const lead = window.__MENCTOR_LAST_LEAD;
      if (!lead) return;
      setPipeline(prev => {
        const activeIds = new Set(Object.entries(prev).flatMap(([stage, cards]) => stage === "lead" ? [] : cards.map(card => card.id)));
        const leadIds = new Set(prev.lead.map(card => card.id));
        if (activeIds.has(lead.id) || leadIds.has(lead.id)) return prev;
        return { ...prev, lead: [lead, ...prev.lead] };
      });
    };
    window.addEventListener("storage", syncLeads);
    window.addEventListener("menctor:lead-created", syncLeads);
    return () => {
      window.removeEventListener("storage", syncLeads);
      window.removeEventListener("menctor:lead-created", syncLeads);
    };
  }, []);

  if (contractCard) {
    return <NovoContratoFullPage
      card={contractCard}
      onClose={() => setContractCard(null)}
      onContractSent={(updatedCard) => {
        moveCard(contractCard, "contrato", updatedCard);
      }}
    />;
  }

  // Open the full-page form pre-filled with an existing card's data
  if (editingCard) {
    return <window.NovoClienteFullPage
      onClose={() => setEditingCard(null)}
      mode="proposta"
      onProposalSent={async (proposalData) => {
        const proposalCardData = {
          ...editingCard,
          empresa: proposalData.fantasia || proposalData.razao || editingCard.empresa,
          contato: proposalData.contatoNome || editingCard.contato,
          email: proposalData.contatoEmail || editingCard.email,
          funcionarios: Number(proposalData.colab) || editingCard.funcionarios,
          valor: Number(proposalData.mrr) || editingCard.valor,
          proximoPasso: "Aguardar aceite da proposta enviada",
          probabilidade: Math.max(editingCard.probabilidade || 55, 70),
        };
        await sendTransactionalEmail(proposalEmail(proposalCardData));
        moveCard(editingCard, "proposta", proposalCardData);
        setEditingCard(null);
      }}
      initialData={{
        fantasia: editingCard.empresa,
        razao: editingCard.empresa,
        setor: editingCard.setor || "",
        contatoNome: editingCard.contato,
        contatoEmail: editingCard.email || "",
        colab: String(editingCard.funcionarios || ""),
        mrr: editingCard.valor || 4200,
        plano: editingCard.valor >= 8000 ? "scale" : editingCard.valor >= 3000 ? "growth" : "starter",
        subdominio: (editingCard.empresa || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20),
      }}
    />;
  }

  if (creating) {
    return <window.NovoClienteFullPage onClose={() => setCreating(false)} />;
  }

  return (
    <Page>
      {inviting && <InviteModal onClose={() => setInviting(false)} />}
      {proposalCard && (
        <PropostaPreviewModal
          card={proposalCard}
          onClose={() => setProposalCard(null)}
          onAcceptProposal={(card) => {
            moveCard(card, "aceita", {
              proximoPasso: "Enviar contrato para assinatura",
              probabilidade: Math.max(card.probabilidade || 75, 85),
            });
            setProposalCard(null);
          }}
        />
      )}
      {contractPreviewCard && (
        <ContratoPreviewModal
          card={contractPreviewCard}
          onClose={() => setContractPreviewCard(null)}
          onMarkSigned={() => {
            moveCard(contractPreviewCard, "fechado", {
              assinado: true,
              proximoPasso: "Ativar conta e iniciar onboarding",
              probabilidade: 100,
            });
            setContractPreviewCard(null);
          }}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Carteira comercial</div>
          <h1 className="display" style={{ fontSize: 44, margin: 0 }}>Clientes</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 560 }}>
            Pipeline comercial e gestÃ£o de propostas.
          </p>
        </div>
      </div>

      <PipelineView
        navigate={navigate}
        onEditCard={setEditingCard}
        onContractCard={setContractCard}
        onPreviewProposal={setProposalCard}
        onPreviewContract={setContractPreviewCard}
        onMoveCardStage={moveCardById}
        pipeline={pipeline}
        actions={(
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setInviting(true)} className="btn btn-soft" style={{ height: 42 }}>
              <Icon name="send" size={15} /> Convidar por e-mail
            </button>
            <button onClick={() => setCreating(true)} className="btn btn-accent" style={{ height: 42 }}>
              <Icon name="plus" size={16} /> Novo cliente
            </button>
          </div>
        )}
      />
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CARTEIRA â€” clients table with health and portal access
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
        <MiniStat label="AvaliaÃ§Ãµes no mÃªs"    value="14" />
      </div>

      {/* table */}
      <div className="card">
        {/* table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 16, padding: "16px 24px", borderBottom: "1px solid var(--line)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
          <span>Cliente</span>
          <span>Setor</span>
          <span>Colaboradores</span>
          <span>SaÃºde NR-1</span>
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PIPELINE â€” kanban with rich cards
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const STAGES = [
  { id: "lead",     label: "Lead",          color: "var(--ink-faint)",  desc: "Primeiro contato" },
  { id: "proposta", label: "Proposta enviada",color: "var(--sky)",       desc: "Aguardando resposta" },
  { id: "aceita",   label: "Aceita",         color: "var(--amber)",     desc: "Cliente concordou" },
  { id: "contrato", label: "Contrato",       color: "var(--health)",    desc: "Em assinatura" },
  { id: "fechado",  label: "Fechado",        color: "var(--ink)",       desc: "Cliente ativo" },
];

const PipelineView = ({ navigate, pipeline, onEditCard, onContractCard, onPreviewProposal, onPreviewContract, onMoveCardStage, actions }) => {
  const [dragOverStage, setDragOverStage] = React.useState(null);
  const totalProposta = pipeline.proposta.reduce((s,p)=>s+p.valor,0)
                      + pipeline.aceita.reduce((s,p)=>s+p.valor,0);
  const handleDrop = (event, stageId) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/menctor-card");
    setDragOverStage(null);
    if (cardId && onMoveCardStage) onMoveCardStage(cardId, stageId);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--ink-muted)" }}>
          <span><strong style={{ color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20 }}>R$ {(totalProposta/1000).toFixed(1)}k</strong> em proposta</span>
          <span><strong style={{ color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 20 }}>{Object.values(pipeline).flat().length}</strong> negÃ³cios ativos</span>
        </div>
        {actions}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(220px, 1fr))", gap: 14, overflow: "auto", paddingBottom: 12 }}>
        {STAGES.map(s => {
          const activeDrop = dragOverStage === s.id;
          return (
          <div
            key={s.id}
            onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setDragOverStage(s.id); }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragOverStage(null); }}
            onDrop={(event) => handleDrop(event, s.id)}
            style={{
              background: activeDrop ? "var(--surface-sage)" : "var(--surface-2)",
              borderRadius: 14,
              padding: 14,
              border: activeDrop ? "1px solid var(--health)" : "1px solid var(--line)",
              minHeight: 480,
              boxShadow: activeDrop ? "0 0 0 3px var(--health-soft)" : "none",
              transition: "background .15s, border-color .15s, box-shadow .15s"
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="dot" style={{ background: s.color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{s.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-muted)" }}>{pipeline[s.id].length}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 14 }}>{s.desc}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pipeline[s.id].map(card => <DealCard key={card.id} card={card} stage={s} navigate={navigate} onEditCard={onEditCard} onContractCard={onContractCard} onPreviewProposal={onPreviewProposal} onPreviewContract={onPreviewContract} />)}
              {pipeline[s.id].length === 0 && (
                <div style={{ padding: "24px 12px", border: "1px dashed var(--line-strong)", borderRadius: 10, textAlign: "center", fontSize: 12.5, color: "var(--ink-faint)" }}>
                  Sem negÃ³cios nesta etapa.
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

const DealCard = ({ card, stage, navigate, onEditCard, onContractCard, onPreviewProposal, onPreviewContract }) => (
  <div
    draggable
    onDragStart={(event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/menctor-card", card.id);
      event.dataTransfer.setData("text/menctor-stage", stage.id);
      event.currentTarget.style.opacity = "0.55";
      event.currentTarget.style.transform = "scale(0.98)";
    }}
    onDragEnd={(event) => {
      event.currentTarget.style.opacity = "1";
      event.currentTarget.style.transform = "scale(1)";
    }}
    style={{
      background: "var(--surface)",
      borderRadius: 10,
      padding: 12,
      boxShadow: "var(--shadow-card)",
      cursor: "grab",
      transition: "opacity .12s, transform .12s, box-shadow .12s"
    }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{card.empresa}</div>
      <Icon name="more" size={14} color="var(--ink-faint)" />
    </div>
    <div style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 10 }}>{card.contato}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 10.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Valor / mÃªs</div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 18, color: "var(--ink)", lineHeight: 1, marginTop: 2 }}>R$ {(card.valor/1000).toFixed(1)}k</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 10.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Colab.</div>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 2 }}>{card.funcionarios}</div>
      </div>
    </div>
    <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: "var(--ink-muted)" }}>
      <span>HÃ¡ {card.dias}d</span>
      {stage.id === "lead" && (
        <button
          onClick={(e) => { e.stopPropagation(); onEditCard && onEditCard(card); }}
          style={{
            fontSize: 11, color: "#fff", background: "var(--health-deep)",
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 999, fontWeight: 600,
            border: "none", cursor: "pointer",
            boxShadow: "0 2px 6px rgba(47,125,111,0.25)",
            transition: "transform .12s, box-shadow .12s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(47,125,111,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(47,125,111,0.25)"; }}
        >
          <Icon name="send" size={11}/> Enviar proposta
        </button>
      )}
      {stage.id === "proposta" && (
        <button onClick={(e) => { e.stopPropagation(); onPreviewProposal && onPreviewProposal(card); }} style={{ fontSize: 11, color: "var(--health-deep)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon name="eye" size={11}/> Visualizar proposta
        </button>
      )}
      {stage.id === "aceita" && (
        <button
          onClick={(e) => { e.stopPropagation(); onContractCard && onContractCard(card); }}
          style={{
            fontSize: 11, color: "#fff", background: "var(--orange)",
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 999, fontWeight: 600,
            border: "none", cursor: "pointer",
            boxShadow: "0 2px 6px rgba(232,119,34,0.25)",
            transition: "transform .12s, box-shadow .12s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(232,119,34,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(232,119,34,0.25)"; }}
        >
          <Icon name="file" size={11}/> Enviar contrato
        </button>
      )}
      {stage.id === "contrato" && (
        <button onClick={(e) => { e.stopPropagation(); onPreviewContract && onPreviewContract(card); }} style={{ fontSize: 11, color: "var(--health-deep)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon name="eye" size={11}/> Visualizar contrato
        </button>
      )}
      {stage.id === "fechado"  && <span className="pill" style={{ fontSize: 10, padding: "2px 8px" }}>Cliente ativo</span>}
    </div>
  </div>
);

Object.assign(window, { ClientesScreen, LeadInviteForm });
