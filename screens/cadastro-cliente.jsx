/* global React, Icon */

// ════════════════════════════════════════════════════════════
// NOVO CLIENTE — Full-page wizard, mirrors CreateFullPage pattern
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

const NovoClienteFullPage = ({ onClose }) => {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    cnpj: "",
    razao: "",
    fantasia: "",
    setor: "",
    colab: "",
    site: "",
    contatoNome: "",
    contatoCargo: "",
    contatoEmail: "",
    contatoFone: "",
    convidar: true,
    plano: "growth",
    subdominio: "",
    mrr: 4200,
    inicio: "imediato",
  });
  const [done, setDone] = React.useState(false);

  const upd = (k, v) => setData({ ...data, [k]: v });

  // Auto-derive a subdomain from fantasia/razao
  React.useEffect(() => {
    if (!data.subdominio && (data.fantasia || data.razao)) {
      const base = (data.fantasia || data.razao).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
      setData(d => ({ ...d, subdominio: base }));
    }
  }, [data.fantasia, data.razao]);

  if (done) return <SuccessScreen data={data} onClose={onClose} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ padding: "22px 36px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--canvas)", position: "sticky", top: 0, zIndex: 10 }}>
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

      {/* body */}
      <div style={{ flex: 1, padding: "48px 36px 140px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Etapa {step} de 3</div>
            <h1 className="display" style={{ fontSize: 44, margin: 0, lineHeight: 1.05 }}>
              {step === 1 && <>Vamos cadastrar um <em style={{ color: "var(--health-deep)" }}>novo cliente</em>.</>}
              {step === 2 && "Quem vai gerenciar este portal?"}
              {step === 3 && "Defina o plano e o endereço do portal."}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-muted)", maxWidth: 600, lineHeight: 1.55 }}>
              {step === 1 && "Comece com os dados da empresa. Você pode editar tudo depois."}
              {step === 2 && "Esta pessoa será o admin RH — recebe acesso para aplicar diagnósticos e gerenciar colaboradores."}
              {step === 3 && "O subdomínio é o endereço que os colaboradores vão usar para responder os diagnósticos."}
            </p>
          </div>

          {step === 1 && <StepEmpresa data={data} upd={upd} />}
          {step === 2 && <StepContato data={data} upd={upd} />}
          {step === 3 && <StepPlano data={data} upd={upd} />}
        </div>
      </div>

      {/* footer */}
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
          {step === 1 && (data.razao ? <>Cadastrando <strong style={{ color: "var(--ink)" }}>{data.fantasia || data.razao}</strong></> : <>CNPJ é validado na Receita Federal</>)}
          {step === 2 && (data.contatoNome ? <>Admin: <strong style={{ color: "var(--ink)" }}>{data.contatoNome}</strong></> : <>Recebe um e-mail de convite ao final</>)}
          {step === 3 && <>Plano <strong style={{ color: "var(--ink)" }}>{PLANOS.find(p => p.id === data.plano)?.nome}</strong> · R$ {data.mrr.toLocaleString("pt-BR")}/mês</>}
        </div>
        {step < 3
          ? <button onClick={() => setStep(step + 1)} className="btn btn-primary" style={{ height: 40, padding: "0 22px" }}>Continuar <Icon name="arrow-right" size={14}/></button>
          : <button onClick={() => setDone(true)} className="btn btn-accent" style={{ height: 40, padding: "0 22px" }}><Icon name="check" size={14}/> Criar cliente</button>
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

    {/* Tip card */}
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

    {/* Invite card */}
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
const StepPlano = ({ data, upd }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
    <div>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Plano contratado</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PLANOS.map(p => {
          const active = data.plano === p.id;
          return (
            <button key={p.id} onClick={() => { upd("plano", p.id); upd("mrr", p.preco); }} className="card" style={{
              padding: 18, textAlign: "left", position: "relative",
              border: active ? "1px solid var(--health)" : "1px solid transparent",
              outline: active ? "3px solid var(--surface-sage)" : "none",
              display: "flex", flexDirection: "column", gap: 6
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

// ─── SUCCESS ─────────────────────────────────────────────────
const SuccessScreen = ({ data, onClose }) => {
  const plano = PLANOS.find(p => p.id === data.plano);
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

const SummaryRow = ({ label, value, last }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px dashed var(--line-strong)" }}>
    <span style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>{label}</span>
    <span style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500, textAlign: "right" }}>{value}</span>
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
