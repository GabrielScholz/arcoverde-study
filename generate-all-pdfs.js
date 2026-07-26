const fs = require('fs');

function generateHTML(questions, title, filename) {
    let questionsHTML = '';
    let gabaritoHTML = '';
    
    questions.forEach((q, idx) => {
        const num = idx + 1;
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        questionsHTML += `
        <div class="question">
            <p class="q-number"><strong>Questão ${num}</strong> <span class="section">${q.cat || ''}</span></p>
            <p class="q-text">${q.q.replace(/\n/g, '<br>')}</p>
            <div class="options">
                ${q.opts.map((opt, i) => `<p class="opt">${letters[i]}) ${opt}</p>`).join('\n                ')}
            </div>
        </div>`;
        
        const correctLetter = q.answer >= 0 ? letters[q.answer] : '?';
        const explanation = q.explanation ? ` — ${q.explanation}` : '';
        gabaritoHTML += `<span class="gab-item">${num}. ${correctLetter}${explanation}</span>\n`;
    });

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; padding: 20mm 15mm; color: #000; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #000; }
        .header h1 { font-size: 18pt; margin-bottom: 5px; }
        .header p { font-size: 12pt; color: #333; }
        .question { margin-bottom: 20px; page-break-inside: avoid; }
        .q-number { font-size: 11pt; margin-bottom: 4px; }
        .section { font-size: 9pt; color: #555; font-weight: normal; }
        .q-text { margin-bottom: 8px; text-align: justify; }
        .options { margin-left: 15px; }
        .opt { margin-bottom: 3px; }
        .gabarito-section { page-break-before: always; border-top: 2px solid #000; padding-top: 15px; margin-top: 40px; }
        .gabarito-section h2 { text-align: center; font-size: 16pt; margin-bottom: 20px; }
        .gab-grid { column-count: 2; column-gap: 30px; }
        .gab-item { display: block; font-size: 10pt; margin-bottom: 3px; }
        @media print { body { padding: 10mm; } .question { page-break-inside: avoid; } .gabarito-section { page-break-before: always; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚓ Arcoverde Study — ${title}</h1>
        <p>Questões para Práticos — Total: ${questions.length} questões</p>
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
    console.log(`✅ ${filename} — ${questions.length} questões`);
}

// Matérias em português (gerar PDF direto)
const materias = [
    { file: 'arte-naval.json', title: 'Arte Naval', out: 'pdf-arte-naval.html' },
    { file: 'bridge-team-management.json', title: 'Bridge Team Management', out: 'pdf-bridge-team-management.html' },
    { file: 'cis.json', title: 'CIS', out: 'pdf-cis.html' },
    { file: 'erog.json', title: 'EROG', out: 'pdf-erog.html' },
    { file: 'lei-2180.json', title: 'Lei 2.180 - TM', out: 'pdf-lei-2180.html' },
    { file: 'lesta.json', title: 'LESTA', out: 'pdf-lesta.html' },
    { file: 'meteorologia-oceanografia.json', title: 'Meteorologia e Oceanografia', out: 'pdf-meteorologia-oceanografia.html' },
    { file: 'miguens.json', title: 'Miguens', out: 'pdf-miguens.html' },
    { file: 'normam-112.json', title: 'NORMAM-112/DPC', out: 'pdf-normam-112.html' },
    { file: 'normam-201.json', title: 'NORMAM-201/DPC', out: 'pdf-normam-201.html' },
    { file: 'normam-202.json', title: 'NORMAM-202/DPC', out: 'pdf-normam-202.html' },
    { file: 'normam-204.json', title: 'NORMAM-204/DPC', out: 'pdf-normam-204.html' },
    { file: 'normam-302.json', title: 'NORMAM-302/DPC', out: 'pdf-normam-302.html' },
    { file: 'normam-311.json', title: 'NORMAM-311/DPC', out: 'pdf-normam-311.html' },
    { file: 'normam-601.json', title: 'NORMAM-601/DHN', out: 'pdf-normam-601.html' },
    { file: 'normam-602.json', title: 'NORMAM-602/DHN', out: 'pdf-normam-602.html' },
    { file: 'portaria-37.json', title: 'Portaria 37/MB', out: 'pdf-portaria-37.html' },
    { file: 'publicacoes-dhn.json', title: 'Publicações da DHN', out: 'pdf-publicacoes-dhn.html' },
    { file: 'rebocadores-portuarios.json', title: 'Rebocadores Portuários', out: 'pdf-rebocadores-portuarios.html' },
    { file: 'ripeam.json', title: 'RIPEAM', out: 'pdf-ripeam.html' },
    { file: 'rlesta.json', title: 'RLESTA', out: 'pdf-rlesta.html' },
    { file: 'shiphandling-mariner.json', title: 'Shiphandling for the Mariner', out: 'pdf-shiphandling-mariner.html' },
    { file: 'smcp.json', title: 'SMCP', out: 'pdf-smcp.html' },
    // Em inglês (pra traduzir via Chrome depois)
    { file: 'naval-shiphandling.json', title: 'Naval Shiphandling', out: 'pdf-naval-shiphandling.html' },
    { file: 'resolucoes-imo.json', title: 'Resoluções IMO', out: 'pdf-resolucoes-imo.html' },
    { file: 'tug-use-in-port.json', title: 'Tug Use in Port', out: 'pdf-tug-use-in-port.html' },
];

console.log('Gerando PDFs...\n');
materias.forEach(m => {
    try {
        const data = JSON.parse(fs.readFileSync('./' + m.file, 'utf8'));
        generateHTML(data, m.title, './' + m.out);
    } catch(e) {
        console.log(`⚠️ Erro em ${m.file}: ${e.message}`);
    }
});
console.log('\n📄 Pronto! Todos os HTMLs gerados.');
