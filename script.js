// ===== Confession Wall =====
const confessionForm = document.getElementById('confessionForm');
const confessionsList = document.getElementById('confessionsList');
let confessions = [];

if(confessionForm){
  confessionForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = confessionForm.querySelector('textarea').value;
    confessions.push(text);
    displayConfessions();
    confessionForm.reset();
  });
}

function displayConfessions(){
  confessionsList.innerHTML = '';
  confessions.slice().reverse().forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = c;
    confessionsList.appendChild(div);
  });
}

// ===== Quiz =====
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');

if(quizForm){
  quizForm.addEventListener('submit', e => {
    e.preventDefault();
    let score = 0;
    const q1 = parseInt(quizForm.q1.value);
    const q2 = parseInt(quizForm.q2.value);
    score = q1 + q2;

    let message = '';
    if(score <= 1) message = 'You seem to be doing well 😊';
    else if(score == 2) message = 'Some stress detected, take care!';
    else message = 'High stress detected 😟 Consider reaching out for help.';

    quizResult.textContent = message;
  });
}