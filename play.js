const question = document.getElementById('question');
const options = Array.from(document.getElementsByClassName('choice'));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');



let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter=0;
let score=0; 
let availablQuestions=[];

let questions = []; 

fetch( 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
  .then(res => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
          question: loadedQuestion.question
      };
      const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3 ) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );
        answerChoices.forEach((choice, index) => {
          formattedQuestion['choice' + (index + 1)] = choice;
      })

      return formattedQuestion;
        });
        
          startGame();
  })
  .catch((err) =>{
    console.error(err);
  });
const MAX_QUESTIONS = 10;
const CORRECT_BONUS = 10;

function startGame(){
  questionCounter=0;
  score=0;
  availablQuestions=[...questions];
  getNewQuestions();
  $(window).on('load', function() {
    $("#cover").hide();
 });
  
};


  function getNewQuestions(){
    if (availablQuestions.length == 0 || questionCounter > MAX_QUESTIONS ) {
      localStorage.setItem('mostRecentScore',score); 
      return window.location.assign( '/Users/navee/web_development/quiz-app'+'/end.html');
    }
    questionCounter++;

    questionCounterText.innerText = questionCounter + '/' + MAX_QUESTIONS;
    const questionIndex = Math.floor(Math.random() * availablQuestions.length);
    currentQuestion = availablQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;


    options.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice'+number];

    })
    availablQuestions.splice(questionIndex,1);
    acceptingAnswers = true;
}; 

options.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers)return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer= selectedChoice.dataset['number'];

        const classToApply = 
          selectedAnswer == currentQuestion.answer? 'correct' : 'incorrect';
          if(classToApply == 'correct'){
            incrementScore(CORRECT_BONUS);
          }      
          selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
          selectedChoice.parentElement.classList.remove(classToApply);
          getNewQuestions();
        },500);
        });
       
    } );

  

incrementScore = num => {
  score = score + num;
  scoreText.innerText = score;
};

$(window).on('load', function() {
  $("#cover").hide();
});