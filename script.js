document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('new-question-form');
    const questionsList = document.getElementById('questions');

    questionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('question-title').value;
        const body = document.getElementById('question-body').value;

        if (title && body) {
            const question = { id: generateUniqueId(), title, body, responses: [] };
            saveQuestion(question);
            addQuestionToList(question);

            questionForm.reset();
        }
    });

    questionsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('reply-btn')) {
            const questionId = event.target.dataset.questionId;
            const questionItem = document.querySelector(`[data-question-id="${questionId}"]`);

            if (questionItem) {
                const responseForm = createResponseForm(questionId);
                questionItem.appendChild(responseForm);
            }
        }
    });

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function saveQuestion(question) {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        questions.push(question);
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    function addQuestionToList(question) {
        const questionItem = document.createElement('li');
        questionItem.dataset.questionId = question.id;
        questionItem.style.textAlign = "center"; // Centraliza o conteúdo do <li>
        questionItem.innerHTML = `
            <h3>${question.title}</h3>
            <p>${question.body}</p>
            <button class="reply-btn" style="display: inline-block;" data-question-id="${question.id}">Responder</button>
        `;
        questionItem.querySelector('.reply-btn').classList.add('custom-reply-btn');
        
        // Verifica se há respostas antes de adicioná-las à lista de perguntas
        if (question.responses && question.responses.length > 0) {
            question.responses.forEach(response => {
                const responseItem = document.createElement('div');
                responseItem.classList.add('response');
                responseItem.innerHTML = `<p>${response}</p>`;
                questionItem.appendChild(responseItem);
            });
        }
        
        questionsList.appendChild(questionItem);
    }
    
    

    function createResponseForm(questionId) {
        const form = document.createElement('form');
        form.id = `response-form-${questionId}`;
        form.innerHTML = `
            <label for="response-body-${questionId}">Resposta:</label>
            <textarea id="response-body-${questionId}" name="response-body" required></textarea>
            <button type="submit">Enviar Resposta</button>
        `;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const response = document.getElementById(`response-body-${questionId}`).value;
            if (response) {
                const questionItem = document.querySelector(`[data-question-id="${questionId}"]`);
                const responseItem = document.createElement('div');
                responseItem.classList.add('response');
                responseItem.innerHTML = `<p>${response}</p>`;
                questionItem.appendChild(responseItem);
                
                // Salva apenas a resposta
                saveResponse(questionId, response);
                
                form.reset(); // Limpa o formulário após enviar a resposta
                form.style.display = 'none'; // Oculta o formulário após o envio
            }
        });
        return form;
    }

    function saveResponse(questionId, response) {
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        questions.forEach(question => {
            if (question.id === questionId) {
                question.responses.push(response);
            }
        });
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    function loadQuestions() {
        let storedQuestions = localStorage.getItem('questions');
        if (storedQuestions) {
            let questions = JSON.parse(storedQuestions);
            questions.forEach(question => {
                addQuestionToList(question);
            });
        }
    }

    loadQuestions();
    
});