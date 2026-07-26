// Estado da aplicação
let currentCategory = '';
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let isSimulado = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

// Atualiza contagem de questões nos cards
function updateCounts() {
    document.getElementById('count-resistencia').textContent = 
        `${questions.resistencia.length} questões`;
    document.getElementById('count-propulsao').textContent = 
        `${questions.propulsao.length} questões`;
    document.getElementById('count-controlabilidade').textContent = 
        `${questions.controlabilidade.length} questões`;
    
    const total = questions.resistencia.length + questions.propulsao.length + questions.controlabilidade.length;
    document.getElementById('count-simulado').textContent = 
        `65 questões (de ${total})`;
}

// Inicia o quiz de uma categoria
function startQuiz(category) {
    isSimulado = false;
    
    if (questions[category].length === 0) {
        alert('Nenhuma questão disponível nesta categoria ainda!');
        return;
    }

    currentCategory = category;
    currentQuestions = shuffleArray([...questions[category]]);
    currentIndex = 0;
    score = 0;
    answered = false;

    const titles = {
        resistencia: '🚢 Resistência',
        propulsao: '⚙️ Propulsão',
        controlabilidade: '🧭 Controlabilidade'
    };

    document.getElementById('quiz-title').textContent = titles[category];
    showScreen('quiz');
    renderQuestion();
}

// Inicia simulado com 65 questões mistas
function startSimulado() {
    isSimulado = true;
    currentCategory = 'simulado';
    
    const todas = [
        ...questions.resistencia,
        ...questions.propulsao,
        ...questions.controlabilidade
    ];
    
    if (todas.length === 0) {
        alert('Nenhuma questão disponível ainda!');
        return;
    }

    currentQuestions = shuffleArray([...todas]).slice(0, 65);
    currentIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('quiz-title').textContent = '📝 Simulado PNA';
    showScreen('quiz');
    renderQuestion();
}

// Renderiza a questão atual
function renderQuestion() {
    answered = false;
    const q = currentQuestions[currentIndex];
    
    document.getElementById('quiz-progress').textContent = 
        `${currentIndex + 1}/${currentQuestions.length}`;
    
    document.getElementById('question-text').textContent = q.q;
    
    // Mostra a seção/categoria da questão
    const catLabel = document.getElementById('question-category');
    if (catLabel) {
        catLabel.textContent = q.cat || '';
    }
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    q.opts.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = `<span class="option-letter-label">${String.fromCharCode(65 + index)}</span> ${option}`;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('btn-next').classList.add('hidden');
}

// Seleciona uma opção
function selectOption(index) {
    if (answered) return;
    answered = true;

    const q = currentQuestions[currentIndex];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');

    // Desabilita todas as opções
    options.forEach(opt => opt.classList.add('disabled'));

    // Marca a resposta correta
    if (q.answer >= 0) {
        options[q.answer].classList.add('correct');
    }

    if (index === q.answer) {
        score++;
        options[index].classList.add('selected');
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ Correto!';
        if (q.explanation) {
            feedback.innerHTML += `<br><br><strong>📖 Referência:</strong> ${q.explanation}`;
        }
    } else {
        options[index].classList.add('wrong');
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ Incorreto. A resposta certa é: <strong>${String.fromCharCode(65 + q.answer)}</strong>`;
        if (q.explanation) {
            feedback.innerHTML += `<br><br><strong>📖 Referência:</strong> ${q.explanation}`;
        }
    }

    feedback.classList.remove('hidden');
    document.getElementById('btn-next').classList.remove('hidden');
}

// Próxima questão
function nextQuestion() {
    currentIndex++;
    if (currentIndex >= currentQuestions.length) {
        showResult();
    } else {
        renderQuestion();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Mostra resultado final
function showResult() {
    const total = currentQuestions.length;
    const percent = Math.round((score / total) * 100);
    
    document.getElementById('result-score').textContent = `${score}/${total} (${percent}%)`;
    
    let message = '';
    if (percent === 100) message = '🏆 Excelente! Você domina esse assunto!';
    else if (percent >= 80) message = '👏 Muito bom! Quase perfeito!';
    else if (percent >= 60) message = '📚 Bom, mas pode melhorar. Continue estudando!';
    else if (percent >= 40) message = '⚠️ Precisa estudar mais. Não desista!';
    else message = '📖 Revise o conteúdo e tente novamente.';
    
    document.getElementById('result-message').textContent = message;
    showScreen('result');
}

// Tentar novamente
function retryQuiz() {
    if (isSimulado) {
        startSimulado();
    } else {
        startQuiz(currentCategory);
    }
}

// Voltar ao menu
function goHome() {
    showScreen('home');
}

// Troca de tela
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo({ top: 0 });
}

// Embaralha array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
