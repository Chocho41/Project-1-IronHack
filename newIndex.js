const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const level = urlParams.get("level");
const typeDifficulties = document.getElementById("difficulty-type");
const printQuestion = document.getElementById("question");
const answerContainer = document.querySelector(".answer-container");
const popUpTrue = document.getElementById("pop-up-true");
const popUpFalse = document.getElementById("pop-up-false");
const popUpContainer = document.getElementsByClassName("popup-container");

// START VARIABLES : INITIAL VALUES
let quiz = [];
let step = 0;
let score = 0;

// STEP 1 : Get the data from an API
axios
  .get(
    `https://opentdb.com/api.php?amount=20&category=21&difficulty=${level}&type=multiple`
  )
  .then((res) => initQuiz(res.data.results)) //if success
  .catch((err) => console.error(err)); //if error

// STEP 2 : Fill the quiz with the response and launch question 1
function initQuiz(apiRes) {
  quiz = apiRes;
  getData();
}

// LOGIC : MIX THE ANSWERS ORDER
const shuffleAnswers = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); //Math.random trouve un chiffre entre 0 et 1/Math.floor arrondi le nombre à l'entier le plus proche
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// LOGIC : Function to display questions
function getData() {
  console.log(quiz);
  let element = quiz[step];

  // fill the question
  printQuestion.innerHTML = `${element.question}`;

  // prepare the answers
  let answers = [...element.incorrect_answers];
  console.log(answers);
  answers.push(element.correct_answer);
  let randomizedAnswers = shuffleAnswers(answers);

  // fill the answers buttons
  randomizedAnswers.forEach((answer) => {
    answerContainer.innerHTML += `<button class="btn">${answer}</button>`;
  });
  listenAllButtons();
  chrono.startClick(printTime);
}

function checkAnswer(e) {
  let currentAnswer = e.target.innerHTML;
  let solution = quiz[step].correct_answer;

  if (currentAnswer === solution) {
    printTrueAnswer();
    score = score + 3;
  } else {
    printFalseAnswer();
    score--;
  }
  step++;
  answerContainer.innerHTML = "";
  getData();
  chrono.stopClick();
  console.log(score);
  console.log(step);
  quizIsFinished();
}

// LOGIC : PLACE EVENT LISTENERS ON BUTTONS
function listenAllButtons() {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => checkAnswer(e));
  });

  // for (let i = 0; i < btnListener.length; i++) {
  //     btnListener[i].addEventListener("click", function () {
  //     console.log(element[i]);
  //     console.log(btnListener[i]);
  //     if (element[i] === btnListener[i]) {
  //         console.log(printTrueAnswer());
  //         printTrueAnswer();
  //         step++;
  //         getData();
  //     } else {
  //         console.log(printFalseAnswer());
  //         printFalseAnswer();
  //         step++;
  //         getData();
  //     }
  //     });
  // }
}

// LOGIC : RESULT
function printTrueAnswer() {
  const popUpTrue = document.getElementById("pop-up-true");
  popUpTrue.innerHTML = "";
  popUpFalse.innerHTML = "";
  //popUpTrue.appenChild(gifTrue);
  popUpTrue.innerHTML += `
    <div id="overlay" class="overlay">
    <div id="popup" class="popup">
    <div id="popup-text">
    <div id="messageTrue">Correct</div>
    <p>You rock bro</p>
    <p>Score : ${score}<p>
    <p>Progression : ${step + 1}/${quiz.length}<p>
    <button id="btnPopup" class="btnPopup">Next Question</button>
    </div>
    <div id="popup-image">
    <img src="./images/GIF_Animation_True.gif"/>
    </div>
    </div>
    </div>
    `;
  openPopUP();
  quizIsFinished();
  listenNextQuestion();
}

function printFalseAnswer() {
  const popUpFalse = document.getElementById("pop-up-false");
  popUpFalse.innerHTML = "";
  popUpTrue.innerHTML = "";
  //popUpFalse.appenChild(gifFalse);
  popUpFalse.innerHTML += `
    <div id="overlay" class="overlay">
    <div id="popup" class="popup">
    <div id="popup-text">
    <div id="messageFalse">Incorrect</div>
    <p>You got played Motherfucker</p>
    <p>Score : ${score}<p>
    <p>Progression : ${step + 1}/${quiz.length}<p>
    <button id="btnPopup" class="btnPopup">Next Question</button>
    </div>
    <div id="popup-image">
    <img src="./images/GIF_Animation_False.gif"/>
    </div>
    </div>
    </div>`;
  openPopUP();
  quizIsFinished();
  listenNextQuestion();
}
//Pop-up opener
function openPopUP() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
}
//Pop-up closer
function closePopUp() {
  const overlayClose = document.getElementById("overlay");
  if (overlayClose.style.display === "block") {
    overlayClose.style.display = "none";
  }
}
//POP-up Next question button listener
function listenNextQuestion() {
  const btnPopup = document.querySelector(".btnPopup");
  console.log(btnPopup);
  btnPopup.addEventListener("click", closePopUp);
}

//Check if end of quizz
function quizIsFinished() {
  console.log(step >= quiz.length);
  if (step >= quiz.length) {
    endOfQuizPopUp();
  }
}
//if (quiz.quizIsFinished() === true) {

function endOfQuizPopUp() {
  popUpFalse.innerHTML = "";
  popUpTrue.innerHTML = "";
  popUpFalse.innerHTML += `
    <div id="overlay" class="overlay">
    <div id="popup" class="popup">
    <div id="popup-text">
    <div id="messageEnd">End of the Quiz</div>
    <p>Well done mate!</p>
    <p>Score : ${score}<p>
    <form>
    <button id="btnPopup" class="btnPopup" formaction="./index.html">Start a new Quiz</button>
    <form>
    </div>
    <div id="popup-image">
    <img src="./images/GIF_Animation_False.gif"/>
    </div>
    </div>
    </div>;
    `;
}

import { Chronometer } from "./chronometer.js";

//Chronometer
var chrono = new Chronometer();
//time display
var secDec = document.getElementById("secDec");
var secUni = document.getElementById("secUni");

function printTime() {
  printSeconds();
  timeOut();
}

function formatTime(time, dec, uni) {
  dec.textContent = time[0];
  uni.textContent = time[1];
}

function printSeconds() {
  formatTime(chrono.twoDigitsNumber(chrono.getSeconds()), secDec, secUni);
}

function timeOut() {
  if (secUni.textContent === "0") {
    step++;
    chrono.stopClick();
    //answerContainer.innerHTML = "";
    //getData();
  }
}
