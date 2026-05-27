/* global React, Icon */

// ════════════════════════════════════════════════════════════
// NOVO CLIENTE — Two-column: form left · email preview right
// ════════════════════════════════════════════════════════════

const SETORES_OPTIONS = [
  "Logística", "Saúde", "Agroindústria", "Financeiro", "Educação",
  "Tecnologia", "Indústria", "Comércio", "Construção", "Serviços", "Outro"
];

const PLANOS = [
  { id: "starter",  nome: "Essencial",   desc: "Até 100 colaboradores",  preco: 1500,  destaque: false },
  { id: "growth",   nome: "Crescimento", desc: "Até 500 colaboradores",  preco: 4200,  destaque: true  },
  { id: "scale",    nome: "Corporativo", desc: "Acima de 500",            preco: 8900,  destaque: false },
];

const NovoClienteFullPage = ({ onClose, initialData = {}, mode = "cliente", onProposalSent }) => {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    cnpj: initialData.cnpj || "",
    razao: initialData.razao || "",
    fantasia: initialData.fantasia || "",
    setor: initialData.setor || "",
    colab: initialData.colab || "",
    site: initialData.site || "",
    contatoNome: initialData.contatoNome || "",
    contatoCargo: initialData.contatoCargo || "",
    contatoEmail: initialData.contatoEmail || "",
    contatoFone: initialData.contatoFone || "",
    convidar: true,
    plano: initialData.plano || "growth",
    subdominio: initialData.subdominio || "",
    mrr: initialData.mrr || 4200,
    inicio: initialData.inicio || "imediato",
  });
  const [done, setDone] = React.useState(false);
  const isProposalMode = mode === "proposta";
  const finalActionLabel = isProposalMode ? "Salvar" : "Criar cliente";

  const upd = (k, v) => setData({ ...data, [k]: v });

  React.useEffect(() => {
    if (!data.subdominio && (data.fantasia || data.razao)) {
      const base = (data.fantasia || data.razao).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
      setData(d => ({ ...d, subdominio: base }));
    }
  }, [data.fantasia, data.razao]);

  if (done) return <SuccessScreen data={data} onClose={onClose} mode={mode} onProposalSent={onProposalSent} />;

  const planoAtivo = PLANOS.find(p => p.id === data.plano);
  const nomeEmpresa = data.fantasia || data.razao || "sua empresa";
  const nomeContato = data.contatoNome ? data.contatoNome.split(" ")[0] : "gestor(a)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <div style={{
        padding: "18px 36px", borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--canvas)", position: "sticky", top: 0, zIndex: 20
      }}>
        <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-muted)", fontSize: 13.5 }}>
          <Icon name="chevron-left" size={15}/> Voltar para clientes
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            { n: 1, label: "Empresa" },
            { n: 2, label: "Contato principal" },
            { n: 3, label: "Plano e portal" },
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
          Salvar como rascunho <Icon name="x" size={14}/>
        </button>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>

        {/* LEFT — form */}
        <div style={{ flex: "0 0 52%", overflowY: "auto", padding: "44px 48px 140px" }}>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Etapa {step} de 3</div>
            <h1 className="display" style={{ fontSize: 40, margin: 0, lineHeight: 1.05 }}>
              {step === 1 && (isProposalMode ? <>Revise a <em style={{ color: "var(--health-deep)" }}>proposta do lead</em>.</> : <>Vamos cadastrar um <em style={{ color: "var(--health-deep)" }}>novo cliente</em>.</>)}
              {step === 2 && "Quem vai gerenciar este portal?"}
              {step === 3 && "Defina o plano e o endereço do portal."}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 520, lineHeight: 1.55 }}>
              {step === 1 && (isProposalMode ? "Os dados do lead já vieram preenchidos. Ajuste o que precisar antes de salvar a proposta." : "Comece com os dados da empresa. Você pode editar tudo depois.")}
              {step === 2 && "Esta pessoa será o admin RH — recebe acesso para aplicar diagnósticos e gerenciar colaboradores."}
              {step === 3 && "O subdomínio é o endereço que os colaboradores vão usar para responder os diagnósticos."}
            </p>
          </div>

          {step === 1 && <StepEmpresa data={data} upd={upd} />}
          {step === 2 && <StepContato data={data} upd={upd} />}
          {step === 3 && <StepPlano   data={data} upd={upd} />}
        </div>

        {/* DIVIDER */}
        <div style={{ width: 1, background: "var(--line)", flexShrink: 0 }} />

        {/* RIGHT — email preview */}
        <div style={{
          flex: 1, overflowY: "auto",
          background: "var(--canvas-warm)",
          padding: "44px 40px 80px",
          display: "flex", flexDirection: "column", gap: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Prévia do e-mail</div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>Atualiza em tempo real conforme você preenche</div>
            </div>
            <span style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 999,
              background: "var(--surface-sage)", color: "var(--health-deep)", fontWeight: 600
            }}>AO VIVO</span>
          </div>

          {/* Email card */}
          <div style={{
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
            overflow: "hidden",
            fontFamily: "'Georgia', serif",
          }}>
            {/* Email top bar */}
            <div style={{ background: "#f5f5f5", padding: "10px 18px", borderBottom: "1px solid #e8e8e8", display: "flex", gap: 16, fontSize: 12, color: "#666" }}>
              <span><strong style={{ color: "#333" }}>De:</strong> Caio Guedes · Menctor &lt;caio@menctor.com.br&gt;</span>
              <span><strong style={{ color: "#333" }}>Para:</strong> {data.contatoEmail || "contato@empresa.com.br"}</span>
            </div>
            <div style={{ background: "#f5f5f5", padding: "6px 18px 12px", borderBottom: "1px solid #e8e8e8", fontSize: 13, color: "#333" }}>
              <strong>Assunto:</strong> Proposta Menctor para {nomeEmpresa} — conformidade NR-1 sem complicação
            </div>

            {/* Email body */}
            <div style={{ padding: "36px 40px", lineHeight: 1.75, fontSize: 15, color: "#222" }}>
              {/* Logo */}
              <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg,#2F7D6F,#5BAD72)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>m</div>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1a1a", letterSpacing: "-0.01em" }}>menctor</span>
              </div>

              <p style={{ margin: "0 0 18px" }}>
                Olá, <strong>{nomeContato}</strong>! 👋
              </p>
              <p style={{ margin: "0 0 18px" }}>
                Obrigado pelo interesse em levar a <strong>{nomeEmpresa}</strong> para o próximo nível de conformidade com a <strong>NR-1</strong>. Preparei esta proposta especialmente para vocês.
              </p>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #e8e8e8", margin: "24px 0" }} />

              {/* Plan highlight */}
              <div style={{ background: "linear-gradient(135deg, #f0faf6, #e8f8ee)", border: "1px solid #b3e6c8", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2F7D6F", marginBottom: 6 }}>Plano recomendado</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em", marginBottom: 2 }}>
                  {planoAtivo?.nome || "Crescimento"}
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#555", marginBottom: 14 }}>{planoAtivo?.desc || "Até 500 colaboradores"}</div>
                <div style={{ fontFamily: "sans-serif", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: "#2F7D6F" }}>R$ {(data.mrr || 4200).toLocaleString("pt-BR")}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>/mês</span>
                </div>
              </div>

              {/* What's included */}
              <p style={{ margin: "0 0 10px", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>O que está incluído</p>
              {[
                "Diagnóstico psicossocial baseado na NR-1",
                "Portal exclusivo para colaboradores",
                "Relatórios em PDF prontos para auditoria",
                "Suporte dedicado de consultores Menctor",
                data.colab ? `Até ${data.colab} colaboradores cobertos` : "Colaboradores ilimitados no plano",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, fontFamily: "sans-serif", fontSize: 14 }}>
                  <span style={{ color: "#2F7D6F", marginTop: 1, fontSize: 16 }}>✓</span>
                  <span style={{ color: "#333" }}>{item}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid #e8e8e8", margin: "24px 0" }} />

              {/* Portal URL if set */}
              {data.subdominio && (
                <div style={{ background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontFamily: "sans-serif" }}>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Seu portal exclusivo</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#2F7D6F" }}>
                    🔗 {data.subdominio}.menctor.com.br
                  </div>
                </div>
              )}

              <p style={{ margin: "0 0 18px" }}>
                Para dar início, basta <strong>aceitar a proposta</strong> abaixo. Em até 24 horas seu portal estará configurado e pronto para uso.
              </p>

              {/* CTA button */}
              <div style={{ textAlign: "center", margin: "28px 0" }}>
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #2F7D6F, #5BAD72)",
                  color: "#fff", fontFamily: "sans-serif",
                  padding: "14px 36px", borderRadius: 50,
                  fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
                  boxShadow: "0 4px 16px rgba(47,125,111,0.35)"
                }}>
                  ✅ Aceitar proposta
                </div>
              </div>

              <div style={{ borderTop: "1px solid #e8e8e8", margin: "24px 0" }} />

              <p style={{ margin: "0 0 4px", fontFamily: "sans-serif", fontSize: 13, color: "#555" }}>
                Qualquer dúvida, é só responder este e-mail. Estou à disposição.
              </p>
              <p style={{ margin: 0, fontFamily: "sans-serif", fontSize: 13, color: "#555" }}>
                Abraços,<br />
                <strong style={{ color: "#222" }}>Caio Guedes</strong><br />
                Consultor · Menctor by Lector
              </p>

              {/* Footer */}
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #e8e8e8", fontFamily: "sans-serif", fontSize: 11, color: "#aaa", textAlign: "center" }}>
                Menctor by Lector · contato@menctor.com.br<br />
                Você está recebendo este e-mail porque {nomeEmpresa} demonstrou interesse em conformidade NR-1.
              </div>
            </div>
          </div>

          {/* Hint */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-muted)", padding: "0 4px" }}>
            <Icon name="sparkles" size={13} color="var(--health-deep)" />
            O e-mail real será enviado assim que você clicar em <strong style={{ color: "var(--ink-soft)" }}>{finalActionLabel}</strong>.
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: "sticky", bottom: 0, padding: "16px 48px",
        borderTop: "1px solid var(--line)", background: "rgba(244,241,232,0.94)",
        backdropFilter: "blur(10px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20
      }}>
        <button onClick={step > 1 ? () => setStep(step - 1) : onClose} className="btn btn-ghost" style={{ height: 40 }}>
          <Icon name="chevron-left" size={14}/> {step > 1 ? "Voltar" : "Cancelar"}
        </button>
        <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
          {step === 1 && (data.razao ? <><strong style={{ color: "var(--ink)" }}>{data.fantasia || data.razao}</strong> · preenchendo dados</> : <>CNPJ é validado na Receita Federal</>)}
          {step === 2 && (data.contatoNome ? <>Admin: <strong style={{ color: "var(--ink)" }}>{data.contatoNome}</strong></> : <>Recebe um e-mail de convite ao final</>)}
          {step === 3 && <>Plano <strong style={{ color: "var(--ink)" }}>{PLANOS.find(p => p.id === data.plano)?.nome}</strong> · R$ {data.mrr.toLocaleString("pt-BR")}/mês</>}
        </div>
        {step < 3
          ? <button onClick={() => setStep(step + 1)} className="btn btn-primary" style={{ height: 40, padding: "0 22px" }}>Continuar <Icon name="arrow-right" size={14}/></button>
          : <button onClick={() => setDone(true)} className="btn btn-accent" style={{ height: 40, padding: "0 22px" }}><Icon name="check" size={14}/> {finalActionLabel}</button>
        }
      </div>
    </div>
  );
};

// ─── STEP 1: Empresa ────────────────────────────────────────
const StepEmpresa = ({ data, upd }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <Row>
      <Field label="CNPJ" hint="Validamos automaticamente na Receita Federal" width={2}>
        <Input value={data.cnpj} onChange={v => upd("cnpj", v)} placeholder="00.000.000/0000-00" />
      </Field>
      <Field label="Validar" width={1}>
        <button className="btn btn-soft" style={{ height: 42, width: "100%", justifyContent: "center" }}>
          <Icon name="search" size={14}/> Buscar dados
        </button>
      </Field>
    </Row>

    <Field label="Razão social">
      <Input value={data.razao} onChange={v => upd("razao", v)} placeholder="Ex: Logística Haus LTDA" />
    </Field>

    <Field label="Nome fantasia">
      <Input value={data.fantasia} onChange={v => upd("fantasia", v)} placeholder="Como o cliente é conhecido (ex: Loghaus)" />
    </Field>

    <Row>
      <Field label="Setor" width={2}>
        <Select value={data.setor} onChange={v => upd("setor", v)} options={SETORES_OPTIONS} placeholder="Selecione um setor" />
      </Field>
      <Field label="Colaboradores" hint="Aprox. está bom" width={1}>
        <Input value={data.colab} onChange={v => upd("colab", v)} placeholder="340" type="number" />
      </Field>
    </Row>

    <Field label="Site" hint="Opcional">
      <Input value={data.site} onChange={v => upd("site", v)} placeholder="https://loghaus.com.br" />
    </Field>

    <div style={{ marginTop: 10, padding: 16, borderRadius: 12, background: "var(--surface-sage)", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Icon name="sparkles" size={16} color="var(--health-deep)" />
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--health-deep)" }}>Importação por CNPJ</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 4, lineHeight: 1.5 }}>
          Preencha apenas o CNPJ e clique em "Buscar dados" — preenchemos razão social, setor e endereço pra você.
        </div>
      </div>
    </div>
  </div>
);

// ─── STEP 2: Contato ────────────────────────────────────────
const StepContato = ({ data, upd }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <Row>
      <Field label="Nome completo">
        <Input value={data.contatoNome} onChange={v => upd("contatoNome", v)} placeholder="Ex: Mariana Aguiar" />
      </Field>
      <Field label="Cargo">
        <Input value={data.contatoCargo} onChange={v => upd("contatoCargo", v)} placeholder="Ex: Gerente de RH" />
      </Field>
    </Row>

    <Field label="E-mail corporativo" hint="Para onde enviamos o convite de acesso">
      <Input value={data.contatoEmail} onChange={v => upd("contatoEmail", v)} placeholder="mariana@loghaus.com.br" type="email" />
    </Field>

    <Field label="Telefone / WhatsApp" hint="Opcional, mas útil pra suporte">
      <Input value={data.contatoFone} onChange={v => upd("contatoFone", v)} placeholder="(11) 99999-9999" />
    </Field>

    <label style={{ marginTop: 8, padding: 18, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer" }}>
      <input type="checkbox" checked={data.convidar} onChange={e => upd("convidar", e.target.checked)} style={{ accentColor: "var(--health)", width: 18, height: 18, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Enviar convite por e-mail ao salvar</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 4, lineHeight: 1.5 }}>
          O admin recebe um link para acessar o portal e definir a senha. Você pode reenviar quando quiser.
        </div>
      </div>
    </label>

    <div style={{ marginTop: 4, padding: 14, borderRadius: 12, background: "var(--canvas-warm)", fontSize: 12.5, color: "var(--ink-muted)", display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="users" size={14}/>
      Você poderá adicionar outros admins depois, dentro do portal do cliente.
    </div>
  </div>
);

// ─── STEP 3: Plano + portal ─────────────────────────────────
const StepPlano = ({ data, upd }) => {
  const [hoveredPlan, setHoveredPlan] = React.useState(null);
  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
    <div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Plano contratado</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PLANOS.map(p => {
          const active = data.plano === p.id;
          const hovered = hoveredPlan === p.id && !active;
          return (
            <button key={p.id}
              onClick={() => { upd("plano", p.id); upd("mrr", p.preco); }}
              onMouseEnter={() => setHoveredPlan(p.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="card" style={{
              padding: 18, textAlign: "left", position: "relative",
              border: active ? "1px solid var(--health)" : hovered ? "1px solid var(--line-strong)" : "1px solid transparent",
              outline: active ? "3px solid var(--surface-sage)" : "none",
              display: "flex", flexDirection: "column", gap: 6,
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovered ? "var(--shadow-card)" : undefined,
              transition: "border-color .15s, transform .15s, box-shadow .15s"
            }}>
              {p.destaque && <span style={{ position: "absolute", top: -10, right: 12, padding: "3px 9px", background: "var(--orange)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 999 }}>Mais usado</span>}
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{p.nome}</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{p.desc}</div>
              <div style={{ marginTop: 8, fontFamily: "var(--display)", fontWeight: 600, letterSpacing: "-0.02em", fontSize: 22, color: "var(--ink)" }}>
                R$ {p.preco.toLocaleString("pt-BR")}
                <span style={{ fontSize: 11, color: "var(--ink-muted)", marginLeft: 4, fontWeight: 500 }}>/mês</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>

    <Field label="Valor mensal customizado" hint="Use se negociou um valor diferente do plano">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>R$</span>
        <Input value={data.mrr} onChange={v => upd("mrr", Number(v) || 0)} type="number" />
        <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>/mês</span>
      </div>
    </Field>

    <Field label="Endereço do portal do cliente" hint="É onde os colaboradores acessam para responder">
      <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--surface)" }}>
        <input
          value={data.subdominio}
          onChange={e => upd("subdominio", e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
          placeholder="loghaus"
          style={{ flex: 1, padding: "12px 14px", border: "none", background: "transparent", fontSize: 14, outline: "none" }}/>
        <span style={{ padding: "12px 14px", background: "var(--surface-2)", borderLeft: "1px solid var(--line)", fontSize: 14, color: "var(--ink-muted)", display: "inline-flex", alignItems: "center" }}>.menctor.com.br</span>
      </div>
    </Field>

    <Field label="Início do contrato">
      <div style={{ display: "flex", gap: 6, padding: 4, background: "var(--canvas-warm)", borderRadius: 999, width: "fit-content" }}>
        {[["imediato","Imediato"],["proximoMes","1º do próximo mês"],["custom","Data específica"]].map(([id,label]) => (
          <button key={id} onClick={() => upd("inicio", id)} style={{
            padding: "8px 16px", borderRadius: 999, fontSize: 13,
            background: data.inicio === id ? "var(--surface)" : "transparent",
            color: data.inicio === id ? "var(--ink)" : "var(--ink-muted)",
            fontWeight: data.inicio === id ? 600 : 500,
            boxShadow: data.inicio === id ? "var(--shadow-card)" : "none"
          }}>{label}</button>
        ))}
      </div>
    </Field>
  </div>
  );
};

// ─── SUCCESS ─────────────────────────────────────────────────
const SuccessScreen = ({ data, onClose, mode = "cliente", onProposalSent }) => {
  const plano = PLANOS.find(p => p.id === data.plano);
  const empresa = data.fantasia || data.razao || "Novo cliente";
  const isProposalMode = mode === "proposta";
  const [sendingProposal, setSendingProposal] = React.useState(false);
  const [proposalError, setProposalError] = React.useState("");
  const handleSendProposal = async () => {
    if (!onProposalSent) {
      onClose();
      return;
    }
    setSendingProposal(true);
    setProposalError("");
    try {
      await onProposalSent(data);
    } catch (err) {
      setProposalError(err.message || "Nao foi possivel enviar a proposta.");
    } finally {
      setSendingProposal(false);
    }
  };

  if (isProposalMode) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 36px" }}>
        <div style={{ width: "100%", maxWidth: 920 }}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="send" size={30} strokeWidth={1.8}/>
            </div>
            <div className="eyebrow" style={{ marginBottom: 8, color: "var(--health-deep)" }}>Proposta salva</div>
            <h1 className="display" style={{ fontSize: 38, margin: 0, lineHeight: 1.05 }}>
              Proposta pronta para {empresa}.
            </h1>
            <p style={{ margin: "12px auto 0", fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.55, maxWidth: 560 }}>
              Confira a prévia comercial antes de reenviar ao decisor. Os dados vieram do lead e ficaram salvos no fluxo de proposta.
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "26px 30px", display: "flex", justifyContent: "space-between", gap: 20, borderBottom: "1px solid var(--line)" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Prévia da proposta</div>
                <h2 className="display" style={{ fontSize: 30, margin: 0 }}>{empresa}</h2>
                <p style={{ margin: "8px 0 0", color: "var(--ink-muted)", fontSize: 14 }}>
                  Saúde psicossocial, NR-1 e portal do colaborador.
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "var(--ink-muted)" }}>
                <div>Contato: <strong style={{ color: "var(--ink)" }}>{data.contatoNome || "a confirmar"}</strong></div>
                <div style={{ marginTop: 4 }}>{data.contatoEmail || "e-mail não informado"}</div>
              </div>
            </div>

            <div style={{ padding: 30 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 26 }}>
                <ProposalMetric label="Plano" value={plano?.nome || "Crescimento"} />
                <ProposalMetric label="Valor mensal" value={`R$ ${(data.mrr || 0).toLocaleString("pt-BR")}`} />
                <ProposalMetric label="Cobertura" value={data.colab ? `${data.colab} colab.` : "A definir"} />
                <ProposalMetric label="Portal" value={data.subdominio ? `${data.subdominio}.menctor` : "Personalizado"} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 28 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Escopo incluído</div>
                  {[
                    "Diagnóstico psicossocial alinhado à NR-1",
                    "Portal do colaborador com trilhas e questionários",
                    "Painel administrativo para RH e lideranças",
                    "Relatórios consolidados para plano de ação e auditoria",
                  ].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13.5, color: "var(--ink-soft)" }}>
                      <span style={{ color: "var(--health-deep)", fontWeight: 800 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 18, background: "var(--canvas-warm)" }}>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Resumo comercial</div>
                  <SummaryRow label="Empresa" value={empresa} />
                  <SummaryRow label="Setor" value={data.setor || "A confirmar"} />
                  <SummaryRow label="Contato" value={data.contatoNome || "A confirmar"} />
                  <SummaryRow label="Investimento anual" value={`R$ ${((data.mrr || 0) * 12).toLocaleString("pt-BR")}`} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ height: 40 }}>Voltar para pipeline</button>
            <button onClick={handleSendProposal} disabled={sendingProposal} className="btn btn-accent" style={{ height: 40, opacity: sendingProposal ? 0.72 : 1 }}>
              <Icon name="send" size={14}/> {sendingProposal ? "Enviando..." : "Enviar proposta por e-mail"}
            </button>
          </div>
          {proposalError && (
            <div style={{ margin: "12px auto 0", maxWidth: 460, padding: "9px 12px", borderRadius: 10, background: "var(--coral-soft)", color: "var(--coral)", fontSize: 12, textAlign: "center" }}>
              {proposalError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 36px" }}>
      <div style={{ width: "100%", maxWidth: 580, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 999, background: "var(--surface-sage)", color: "var(--health-deep)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="users" size={36} strokeWidth={1.8}/>
        </div>
        <div className="eyebrow" style={{ marginBottom: 10, color: "var(--health-deep)" }}>Adicionado ao pipeline · etapa Lead</div>
        <h1 className="display" style={{ fontSize: 38, margin: 0, lineHeight: 1.05 }}>
          {data.fantasia || data.razao || "Novo cliente"} entrou na sua carteira.
        </h1>
        <p style={{ margin: "14px 0 28px", fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.55 }}>
          Quando estiver pronto, envie a proposta comercial por e-mail. Assim que o cliente aceitar, o card avança no pipeline — e você pode criar o primeiro diagnóstico.
        </p>

        <div className="card" style={{ padding: 20, textAlign: "left", marginBottom: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Resumo</div>
          <SummaryRow label="Empresa" value={data.fantasia || data.razao || "—"} />
          <SummaryRow label="Setor" value={data.setor || "—"} />
          <SummaryRow label="Colaboradores" value={data.colab ? `${data.colab} pessoas` : "—"} />
          <SummaryRow label="Contato" value={data.contatoNome ? `${data.contatoNome}${data.contatoEmail ? ` · ${data.contatoEmail}` : ""}` : "—"} />
          <SummaryRow label="Plano sugerido" value={plano ? `${plano.nome} · R$ ${data.mrr.toLocaleString("pt-BR")}/mês` : "—"} last />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ height: 40 }}>Voltar para clientes</button>
          <button onClick={onClose} className="btn btn-accent" style={{ height: 40 }}>
            <Icon name="send" size={14}/> Enviar proposta agora
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px dashed var(--line-strong)" }}>
    <span style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>{label}</span>
    <span style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{value}</span>
  </div>
);

const ProposalMetric = ({ label, value }) => (
  <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 16, background: "var(--surface)" }}>
    <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>{value}</div>
  </div>
);

// ─── FORM PRIMITIVES ─────────────────────────────────────────
const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: React.Children.map(children, c => c.props.width || 1).join("fr ") + "fr", gap: 12 }}>{children}</div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{label}</label>
      {hint && <span style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    type={type}
    style={{
      width: "100%", padding: "12px 14px",
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 10, fontSize: 14, color: "var(--ink)",
      outline: "none", transition: "border-color .15s"
    }}
    onFocus={e => e.target.style.borderColor = "var(--health)"}
    onBlur={e => e.target.style.borderColor = "var(--line)"}
  />
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: "100%", padding: "12px 14px",
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 10, fontSize: 14, color: value ? "var(--ink)" : "var(--ink-muted)",
      outline: "none", appearance: "none",
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6F6A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 14px center",
      paddingRight: 36
    }}>
    <option value="" disabled>{placeholder || "Selecione"}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

Object.assign(window, { NovoClienteFullPage });
