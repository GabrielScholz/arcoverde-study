// Banco de questões carregado dos JSONs
let questions = {
    resistencia: [],
    propulsao: [],
    controlabilidade: []
};

// Carrega os JSONs
async function loadQuestions() {
    try {
        const [resRes, propRes, ctrlRes] = await Promise.all([
            fetch('resistance.json'),
            fetch('propulsion.json'),
            fetch('controllability.json')
        ]);
        
        questions.resistencia = await resRes.json();
        questions.propulsao = await propRes.json();
        questions.controlabilidade = await ctrlRes.json();
        
        console.log('✅ Questões carregadas:');
        console.log('  Resistência:', questions.resistencia.length);
        console.log('  Propulsão:', questions.propulsao.length);
        console.log('  Controlabilidade:', questions.controlabilidade.length);
        
        updateCounts();
    } catch (err) {
        console.error('Erro ao carregar questões:', err);
    }
}
