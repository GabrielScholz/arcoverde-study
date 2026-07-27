const fs = require('fs');

function cleanText(text) {
    // Remove § e caracteres invisíveis
    let clean = text.replace(/§/g, '');
    // Substitui tabs por espaço
    clean = clean.replace(/\t/g, ' ');
    // Colapsa qualquer sequência de whitespace (espaços, newlines, tabs) em um único espaço
    clean = clean.replace(/\s+/g, ' ');
    // Agora reinsere quebras de linha antes de marcadores de itens
    clean = clean.replace(/\s+(I\.\s)/g, '\nI. ');
    clean = clean.replace(/\s+(II\.\s)/g, '\nII. ');
    clean = clean.replace(/\s+(III\.\s)/g, '\nIII. ');
    clean = clean.replace(/\s+(IV\.\s)/g, '\nIV. ');
    clean = clean.replace(/\s+(V\.\s)/g, '\nV. ');
    return clean.trim();
}

function generateHTML(questions, title, filename) {
    // Remove duplicatas pelo enunciado (primeiros 100 chars)
    const seen = new Set();
    const unique = questions.filter(q => {
        const key = q.q.trim().substring(0, 100);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    
    // Padrões de exclusão
    const imagePatterns = /figura \d|imagem abaixo|desenho abaixo|ilustração|diagrama abaixo|gráfico abaixo|como demonstrado na figura/i;
    const columnPatterns = /relacione a coluna|correlacione.*coluna|COLUNA\s*A.*COLUNA\s*B/i;
    const vfLacunas = /\(\s{2,}\).*\(\s{2,}\)/;
    
    const clean = unique.filter(q => {
        if (!q.q || q.q.trim().length < 20) return false;
        if (!q.opts || q.opts.length < 2) return false;
        if (q.answer < 0) return false;
        
        const texto = q.q;
        // Remove questões com figuras
        if (imagePatterns.test(texto)) return false;
        // Remove questões "relacione a coluna"
        if (columnPatterns.test(texto)) return false;
        // Remove questões V/F com lacunas (   ) repetidas
        if (vfLacunas.test(texto)) return false;
        // Remove questões que após limpeza ficam com "COLUNA A" no meio
        const limpo = cleanText(texto);
        if (/COLUNA\s*[AB]/i.test(limpo)) return false;
        
        return true;
    });
    
    let questionsHTML = '';
    let gabaritoHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];
    
    clean.forEach((q, idx) => {
        const num = idx + 1;
        const textoLimpo = cleanText(q.q).replace(/\n/g, '<br>');
        
        questionsHTML += `
        <div class="question">
            <p class="q-number"><strong>Questão ${num}</strong></p>
            <p class="q-text">${textoLimpo}</p>
            <div class="options">
                ${q.opts.map((opt, i) => `<p class="opt">${letters[i]}) ${cleanText(opt)}</p>`).join('\n                ')}
            </div>
        </div>`;
        
        const correctLetter = (q.answer >= 0 && q.answer < letters.length) ? letters[q.answer] : '?';
        gabaritoHTML += `<span class="gab-item">${num}. ${correctLetter}</span>\n`;
    });

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; padding: 20mm 15mm; color: #000; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #000; }
        .header h1 { font-size: 18pt; margin-bottom: 5px; }
        .header p { font-size: 12pt; color: #333; }
        .question { margin-bottom: 18px; page-break-inside: avoid; }
        .q-number { font-size: 11pt; margin-bottom: 4px; }
        .q-text { margin-bottom: 8px; text-align: justify; }
        .options { margin-left: 20px; }
        .opt { margin-bottom: 4px; }
        .gabarito-section { page-break-before: always; border-top: 2px solid #000; padding-top: 15px; margin-top: 40px; }
        .gabarito-section h2 { text-align: center; font-size: 16pt; margin-bottom: 20px; }
        .gab-grid { column-count: 3; column-gap: 20px; }
        .gab-item { display: block; font-size: 10pt; margin-bottom: 3px; }
        @media print { body { padding: 10mm; } .question { page-break-inside: avoid; } .gabarito-section { page-break-before: always; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Arcoverde Study — ${title}</h1>
        <p>Total: ${clean.length} questões</p>
    </div>
    ${questionsHTML}
    <div class="gabarito-section">
        <h2>GABARITO</h2>
        <div class="gab-grid">
            ${gabaritoHTML}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(filename, html, 'utf8');
    console.log(`✅ ${title}: ${clean.length} questões (removidas ${questions.length - clean.length}) → ${filename}`);
}

// Matérias da plataforma 2
const materias = [
    { file: 'plataforma2-questoes (3).json', title: 'Arte Naval (Plat.2)', out: 'pdf-p2-arte-naval.html' },
    { file: 'plataforma2-questoes.json', title: 'Legislação Marítima e Regulamentação', out: 'pdf-p2-legislacao.html' },
    { file: 'plataforma2-questoes (1).json', title: 'Navegação em Águas Restritas', out: 'pdf-p2-navegacao.html' },
    { file: 'plataforma2-questoes (2).json', title: 'Comunicação Marítima', out: 'pdf-p2-comunicacao.html' },
    { file: 'TUG-questoes.json', title: 'TUG', out: 'pdf-p2-tug.html' },
    { file: 'shiphandling-questoes.json', title: 'Shiphandling', out: 'pdf-p2-shiphandling.html' },
    { file: 'manobrabilidade-do-navio-questoes.json', title: 'Manobrabilidade do Navio', out: 'pdf-p2-manobrabilidade.html' },
    { file: 'meteorologia-e-oceanografia-questoes.json', title: 'Meteorologia e Oceanografia (Plat.2)', out: 'pdf-p2-meteorologia.html' },
    { file: 'conhecimentos-gerais-questoes.json', title: 'Conhecimentos Gerais', out: 'pdf-p2-conhecimentos-gerais.html' },
];

console.log('Gerando PDFs da Plataforma 2...\n');
materias.forEach(m => {
    try {
        const data = JSON.parse(fs.readFileSync('./' + m.file, 'utf8'));
        generateHTML(data, m.title, './' + m.out);
    } catch(e) {
        console.log(`⚠️ Erro em ${m.file}: ${e.message}`);
    }
});
console.log('\n📄 Pronto!');
