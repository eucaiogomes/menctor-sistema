/* global window */
// ════════════════════════════════════════════════════════════
// MOCK DATA — realistic Brazilian corporate / NR-1 context
// ════════════════════════════════════════════════════════════

const CLIENTES = [
  {
    id: "loghaus",  name: "Loghaus Logística",  cnpj: "12.345.678/0001-90", contact: "Mariana Aguiar",
    sector: "Logística",    employees: 340,  status: "ativo",      mrr: 4280,  lastDiag: "há 2 dias",  risk: 2.35, color: "#2F7D6F",
    riskTrend: "down",   mainRisk: "Carga de trabalho",  lastPulseDate: "15/05/2026",
    nextAction: "Workshop anti-burnout — Operações · 02/jun",
    healthScore: 64,
  },
  {
    id: "vitamed",  name: "VitaMed Saúde",      cnpj: "98.765.432/0001-12", contact: "Roberto Lima",
    sector: "Saúde",        employees: 612,  status: "ativo",      mrr: 6890,  lastDiag: "há 9 dias",  risk: 1.82, color: "#5BAD72",
    riskTrend: "stable", mainRisk: "Suporte social",      lastPulseDate: "08/05/2026",
    nextAction: "Pulse mensal de maio — agendado para 30/05",
    healthScore: 82,
  },
  {
    id: "agrocorp", name: "AgroCorp Brasil",    cnpj: "45.678.901/0001-33", contact: "Fernanda Souza",
    sector: "Agroindústria",employees: 1240, status: "ativo",      mrr: 12400, lastDiag: "há 4 dias",  risk: 2.71, color: "#D89A3F",
    riskTrend: "up",     mainRisk: "Burnout",             lastPulseDate: "12/05/2026",
    nextAction: "Apresentar resultados ao RH · reunião 03/jun",
    healthScore: 48,
  },
  {
    id: "fintech",  name: "Norte Fintech",      cnpj: "33.221.100/0001-55", contact: "Caio Barbosa",
    sector: "Financeiro",   employees: 180,  status: "negociacao", mrr: 0,     lastDiag: null,         risk: null, color: "#4E83A8",
    riskTrend: null,     mainRisk: null,                  lastPulseDate: null,
    nextAction: "Proposta enviada — aguardando aceite",
    healthScore: null,
  },
  {
    id: "edutec",   name: "EduTec Cooperativa", cnpj: "77.889.900/0001-22", contact: "Ana Paula Rios",
    sector: "Educação",     employees: 92,   status: "negociacao", mrr: 0,     lastDiag: null,         risk: null, color: "#C75A4C",
    riskTrend: null,     mainRisk: null,                  lastPulseDate: null,
    nextAction: "Demo agendada para 04/jun com Ana Paula",
    healthScore: null,
  },
];

const COPSOQ_DIMS = [
  { name: "Carga de trabalho",      v: 3.12 },
  { name: "Burnout",                v: 2.95 },
  { name: "Estresse",               v: 2.88 },
  { name: "Conflito trabalho-família", v: 2.74 },
  { name: "Ritmo de trabalho",      v: 2.68 },
  { name: "Reconhecimento",         v: 2.51 },
  { name: "Suporte social",         v: 2.42 },
  { name: "Qualidade da liderança", v: 2.38 },
  { name: "Justiça e respeito",     v: 2.20 },
  { name: "Influência no trabalho", v: 2.15 },
  { name: "Comunidade social",      v: 1.88 },
  { name: "Significado do trabalho",v: 1.72 },
];

const DIAGNOSTICOS = [
  { id: "copsoq",  type: "COPSOQ II",          name: "Riscos psicossociais",      questions: 41, levels: 3, popular: true,  desc: "Padrão NR-1 para mapeamento de riscos psicossociais no trabalho." },
  { id: "pulse",   type: "Pulse",              name: "Pulso Bem-Estar Mental",    questions: 10, levels: 3, popular: true,  desc: "Pesquisa rápida mensal para monitorar bem-estar." },
  { id: "burnout", type: "Maslach",            name: "Inventário de Burnout",     questions: 22, levels: 3, popular: false, desc: "Maslach Burnout Inventory — exaustão, despersonalização e realização." },
  { id: "gallup",  type: "Gallup Q12",         name: "Engajamento Gallup",        questions: 12, levels: 3, popular: false, desc: "12 perguntas clássicas de engajamento no trabalho." },
  { id: "enps",    type: "eNPS",               name: "Satisfação do colaborador", questions: 3,  levels: 3, popular: false, desc: "Net Promoter Score interno — recomendação da empresa." },
  { id: "clima",   type: "Clima",              name: "Clima Organizacional",      questions: 28, levels: 4, popular: false, desc: "Combina dimensões COPSOQ com indicadores de clima e cultura." },
  { id: "disc",    type: "DISC",               name: "Perfil comportamental",     questions: 24, levels: 4, popular: false, desc: "Análise comportamental — Dominância, Influência, Estabilidade, Conformidade." },
  { id: "tlx",     type: "NASA-TLX",           name: "Carga mental e esforço",    questions: 6,  levels: 3, popular: false, desc: "Medição multi-dimensional de carga mental percebida." },
];

const AVALIACOES_ATIVAS = [
  { id: "a1", titulo: "Pesquisa de Clima Organizacional", periodo: "1º Trimestre/2026", cliente: "Loghaus", code: "PCL-Q1", media: 2.25, status: "Em campo", adesao: 92, alvo: 340, respondidos: 312, fim: "31/03/2026", risk: 2.25 },
  { id: "a2", titulo: "NR-1 Operações",                  periodo: "Recorte Setorial Mar/2026", cliente: "AgroCorp",code: "NR-1-OPS", media: 2.60, status: "Em campo", adesao: 91, alvo: 92,  respondidos: 84,  fim: "28/03/2026", risk: 2.60 },
  { id: "a3", titulo: "Pulse Survey Bem-Estar Mental",   periodo: "Mar/2026", cliente: "VitaMed", code: "PULSO-MAR", media: 1.85, status: "Encerrada", adesao: 78, alvo: 612, respondidos: 477, fim: "15/03/2026", risk: 1.85 },
  { id: "a4", titulo: "Diagnóstico COPSOQ II Geral",     periodo: "Anual 2026", cliente: "Loghaus", code: "COPSOQ-26", media: null, status: "Rascunho", adesao: 0,  alvo: 340, respondidos: 0,  fim: "—", risk: null },
];

const LEADS_PIPELINE = {
  lead: [],
  proposta: [],
  aceita: [],
  contrato: [],
  fechado:  [
    { id: "f1", empresa: "Loghaus Logística",       contato: "Mariana Aguiar", funcionarios: 340, valor: 4280, dias: 12,
      decisor: "Mariana Aguiar — Diretora de RH", proximoPasso: "Onboarding concluído — iniciar 1º diagnóstico", probabilidade: 100 },
    { id: "f2", empresa: "VitaMed Saúde",           contato: "Roberto Lima",   funcionarios: 612, valor: 6890, dias: 27,
      decisor: "Roberto Lima — Gestor de Bem-Estar", proximoPasso: "Configurar portal aluno para todas as unidades", probabilidade: 100 },
    { id: "f3", empresa: "AgroCorp Brasil",         contato: "Fernanda Souza", funcionarios: 1240,valor: 12400,dias: 41,
      decisor: "Fernanda Souza — VP de RH", proximoPasso: "Expandir diagnóstico para unidade de Goiás", probabilidade: 100 },
  ],
};

const TRILHAS = [
  { id: "t1", nome: "Saúde mental para gestores",      modulos: 6,  duracao: "3h 20min", inscritos: 142, conclusao: 67, capa: "linear-gradient(135deg, #2F7D6F, #5BAD72)" },
  { id: "t2", nome: "NR-1 na prática",                 modulos: 4,  duracao: "1h 50min", inscritos: 89,  conclusao: 82, capa: "linear-gradient(135deg, #4E83A8, #2F7D6F)" },
  { id: "t3", nome: "Liderança humanizada",            modulos: 8,  duracao: "5h",       inscritos: 56,  conclusao: 41, capa: "linear-gradient(135deg, #D89A3F, #E87722)" },
  { id: "t4", nome: "Resiliência e regulação emocional",modulos: 5, duracao: "2h 40min", inscritos: 211, conclusao: 73, capa: "linear-gradient(135deg, #C75A4C, #D89A3F)" },
];

Object.assign(window, {
  CLIENTES, COPSOQ_DIMS, DIAGNOSTICOS, AVALIACOES_ATIVAS, LEADS_PIPELINE, TRILHAS
});
