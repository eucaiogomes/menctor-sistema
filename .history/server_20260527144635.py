#!/usr/bin/env python3
"""
server.py
Simple Flask server to generate and serve psychosocial reports as PDFs
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import json
import io
import sys
import os

# Add current directory to path to import gerar_relatorio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerar_relatorio_psicossocial import gerar_relatorio

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Servidor de relatórios psicossociais está ativo"}), 200

@app.route('/api/gerar-relatorio', methods=['POST'])
def gerar_relatorio_api():
    """
    Gera e retorna um relatório psicossocial em PDF
    
    Espera JSON com a seguinte estrutura:
    {
      "empresa": "Nome da Empresa",
      "cnpj": "XX.XXX.XXX/0001-XX",
      "endereco": "Endereço",
      "data_avaliacao": "DD/MM/YYYY",
      "respondentes": 100,
      "total_colaboradores": 120,
      "taxa_adesao": "83.3%",
      "periodo": "Janeiro a Março - 2026",
      "aplicacao": "10/03/2026 a 28/03/2026",
      "foco": "Toda a organização",
      "responsavel": "Nome do Responsável",
      "rt_nome": "Nome do Psicólogo",
      "rt_registro": "CRP-XX/XXXXX",
      "rt_especialidade": "Especialidade",
      "rt_contato": "Telefone",
      "dimensoes": [
        {"nome": "Carga de trabalho", "score": 3.12},
        ...
      ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Nenhum dado foi enviado"}), 400
        
        # Validação básica
        required_fields = ["empresa", "respondentes", "total_colaboradores", "dimensoes"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({
                "error": f"Campos obrigatórios faltando: {', '.join(missing)}"
            }), 400
        
        # Preparar configuração para o gerador
        config = {
            "codigo": data.get("codigo", "PCL-Q2"),
            "titulo_linha1": data.get("titulo_linha1", "Pesquisa de Clima Organizacional —"),
            "titulo_linha2": data.get("titulo_linha2", "2° Trimestre/2026"),
            "descricao": data.get("descricao", 
                "Pesquisa trimestral combinando dimensões COPSOQ II com indicadores de clima e engajamento."),
            "periodo": data.get("periodo", "Abril a Junho - 2026"),
            "aplicacao": data.get("aplicacao", "15/04/2026 a 30/04/2026"),
            "responsavel": data.get("responsavel", "Comite de Pessoas & Cultura"),
            "respondentes": int(data.get("respondentes", 0)),
            "total_colaboradores": int(data.get("total_colaboradores", 0)),
            "taxa_adesao": data.get("taxa_adesao", "0%"),
            "foco": data.get("foco", "Toda a organização"),
            "emissao": data.get("emissao", "27 de maio de 2026"),
            "empresa": data.get("empresa", "Empresa"),
            "cnpj": data.get("cnpj", "XX.XXX.XXX/0001-XX"),
            "endereco": data.get("endereco", "—"),
            "data_avaliacao": data.get("data_avaliacao", "01/04/2026"),
            "rt_nome": data.get("rt_nome", "Caio Guedes"),
            "rt_registro": data.get("rt_registro", "CRP-06/12345"),
            "rt_especialidade": data.get("rt_especialidade", "Psicologia Organizacional"),
            "rt_contato": data.get("rt_contato", "(11) 99999-9999"),
            "output_filename": data.get("output_filename", "relatorio_psicossocial.pdf"),
            "dimensoes": data.get("dimensoes", []),
        }
        
        # Gerar PDF em memória
        output_path = gerar_relatorio_com_buffer(config)
        
        # Retornar o PDF
        output_path.seek(0)
        return send_file(
            output_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=config["output_filename"]
        )
    
    except Exception as e:
        print(f"Erro ao gerar relatório: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": f"Erro ao gerar relatório: {str(e)}"
        }), 500

def gerar_relatorio_com_buffer(cfg):
    """
    Gera o relatório e retorna um BytesIO buffer em vez de salvar em arquivo
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Spacer, PageBreak, NextPageTemplate
    from gerar_relatorio_psicossocial import (
        PAGE_W, PAGE_H, MARGIN, _cover_cb, _build_p2, _build_p3, _build_p4, _build_p5,
        _build_p6, _build_p7, _build_p8_p9, _build_p10, _build_p11, _build_p12, _build_p13,
        _TOTAL_PAGES
    )
    
    sections = [
        ("Introdução", _build_p2(cfg)),
        ("Identificação da Empresa e Resp. Técnico", _build_p3(cfg)),
        ("Metodologia", _build_p4(cfg)),
        ("Resumo Executivo", _build_p5(cfg)),
        ("Fatores Psicossociais — Ranking", _build_p6(cfg)),
        ("Interpretação Técnica por Dimensão", _build_p7(cfg)),
        ("Plano de Ação Recomendado", _build_p8_p9(cfg)),
        ("Metodologia e Referências", _build_p10(cfg)),
        ("Análise Global dos Resultados", _build_p11(cfg)),
        ("Recomendações Técnicas por Domínio", _build_p12(cfg)),
        ("Conclusão", _build_p13(cfg)),
    ]
    
    # Criar buffer em memória
    output_buffer = io.BytesIO()
    
    # Preparar story
    story = []
    story.append(NextPageTemplate("inner"))
    story.append(Spacer(1, PAGE_H * 0.01))
    story.append(PageBreak())
    
    for i, (title, content) in enumerate(sections):
        if i > 0:
            story.append(PageBreak())
        story.extend(content)
    
    # Page templates
    section_page_map = {}
    
    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)
    inner_frame = Frame(MARGIN, MARGIN + 10, PAGE_W - 2*MARGIN, PAGE_H - 2*MARGIN - 30,
                        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    
    cover_cb = _cover_cb(cfg)
    
    def inner_on_page(canv, doc):
        from reportlab.lib import colors
        from gerar_relatorio_psicossocial import DARK_BLUE, ORANGE, TEXT_MUTED
        
        pg = doc.page
        title = section_page_map.get(pg, sections[0][0])
        if pg not in section_page_map:
            for p in range(pg - 1, 1, -1):
                if p in section_page_map:
                    title = section_page_map[p]
                    break
        
        W, H = PAGE_W, PAGE_H
        m = MARGIN
        
        canv.setFont("Helvetica-Bold", 11)
        canv.setFillColor(DARK_BLUE)
        canv.drawString(m, H - m + 8, title)
        canv.setFont("Helvetica", 8)
        canv.setFillColor(TEXT_MUTED)
        canv.drawRightString(W - m, H - m + 8, f"{cfg['codigo']} • {cfg['periodo']}")
        canv.setStrokeColor(ORANGE)
        canv.setLineWidth(2)
        canv.line(m, H - m, W - m, H - m)
        
        canv.setStrokeColor(TEXT_MUTED)
        canv.setLineWidth(0.5)
        canv.line(m, 28, W - m, 28)
        canv.setFont("Helvetica", 7)
        canv.setFillColor(TEXT_MUTED)
        canv.drawString(m, 16, f"{cfg['codigo']} • {cfg['periodo']} • Psicossocial Analytics")
        canv.drawRightString(W - m, 16, f"Página {pg} de {_TOTAL_PAGES[0]}")
    
    class SectionMarker:
        def __init__(self, title, mapping):
            self.title = title
            self.mapping = mapping
    
    # Pass 1: count pages
    pass1_buf = io.BytesIO()
    doc1 = BaseDocTemplate(pass1_buf, pagesize=A4, 
                           pageTemplates=[
                               PageTemplate(id="cover", frames=[cover_frame], onPage=cover_cb),
                               PageTemplate(id="inner", frames=[inner_frame], onPage=inner_on_page)
                           ])
    map1 = {}
    doc1.build(story)
    total = doc1.page
    _TOTAL_PAGES[0] = total
    section_page_map.update(map1)
    
    # Pass 2: final PDF
    doc2 = BaseDocTemplate(output_buffer, pagesize=A4,
                           pageTemplates=[
                               PageTemplate(id="cover", frames=[cover_frame], onPage=cover_cb),
                               PageTemplate(id="inner", frames=[inner_frame], onPage=inner_on_page)
                           ])
    doc2.build(story)
    
    return output_buffer

@app.route('/api/teste', methods=['GET'])
def teste():
    """Endpoint de teste com dados padrão"""
    from gerar_relatorio_psicossocial import CONFIG
    
    # Usar configuração padrão
    config = CONFIG.copy()
    output_buffer = gerar_relatorio_com_buffer(config)
    output_buffer.seek(0)
    
    return send_file(
        output_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name="relatorio_teste.pdf"
    )

if __name__ == '__main__':
    print("🚀 Servidor de Relatórios Psicossociais iniciado!")
    print("   Acesse http://localhost:5000/health para verificar o status")
    print("   POST http://localhost:5000/api/gerar-relatorio para gerar um novo relatório")
    print("   GET http://localhost:5000/api/teste para gerar um relatório de teste")
    app.run(debug=True, port=5000, host='127.0.0.1')
