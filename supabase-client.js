/* global window */

const MENCTOR_SUPABASE_URL = "https://dipjrbqhjfccvelqnzls.supabase.co";
const MENCTOR_SUPABASE_KEY = "sb_publishable_RKMsX7XsZOuhJLVBcC8kSw_GnLJF0v9";

const pipelineHeaders = {
  apikey: MENCTOR_SUPABASE_KEY,
  Authorization: `Bearer ${MENCTOR_SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

const toDbCard = (card, stage) => ({
  id: card.id,
  stage,
  empresa: card.empresa || "Novo lead",
  contato: card.contato || "",
  email: card.email || "",
  funcionarios: Number(card.funcionarios || card.colaboradores || 0),
  valor: Number(card.valor || 0),
  dias: Number(card.dias || 0),
  decisor: card.decisor || card.contato || "",
  proximo_passo: card.proximoPasso || "",
  probabilidade: Number(card.probabilidade || 35),
  origem: card.origem || "",
  extra: {
    assinado: !!card.assinado,
    etapaManual: !!card.etapaManual,
  },
});

const toAppCard = (row) => ({
  id: row.id,
  empresa: row.empresa,
  contato: row.contato,
  email: row.email,
  funcionarios: row.funcionarios,
  valor: row.valor,
  dias: row.dias,
  decisor: row.decisor,
  proximoPasso: row.proximo_passo,
  probabilidade: row.probabilidade,
  origem: row.origem,
  stage: row.stage,
  assinado: !!row.extra?.assinado,
  etapaManual: !!row.extra?.etapaManual,
});

const supabaseRequest = async (path, options = {}) => {
  const response = await fetch(`${MENCTOR_SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...pipelineHeaders,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload?.message || payload?.error || "Falha ao acessar Supabase.";
    throw new Error(message);
  }
  return payload;
};

const MenctorDB = {
  async listPipelineCards() {
    const rows = await supabaseRequest("pipeline_cards?select=*&order=updated_at.desc");
    return rows.map(toAppCard);
  },

  async upsertPipelineCard(card, stage = card.stage || "lead") {
    const rows = await supabaseRequest("pipeline_cards?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(toDbCard(card, stage)),
    });
    return rows?.[0] ? toAppCard(rows[0]) : null;
  },

  async updatePipelineStage(card, stage, patch = {}) {
    const updated = { ...card, ...patch, stage, dias: 0 };
    return this.upsertPipelineCard(updated, stage);
  },
};

Object.assign(window, { MenctorDB });
