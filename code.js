let triviaUrl = 'https://jservice.io/api/random';
let clueUrl = 'https://jservice.io/api/clues';
let correctAnswer = "";

function generateRandomIndex(limit) {
  return Math.floor(Math.random() * limit);
}

function presentQuestion(question, answer) {
  let questionTitle = document.querySelector("h1");
  questionTitle.innerHTML = question;
  let userInput = document.querySelector("input");
  userInput.setAttribute("pattern", `${answer}|${answer.toLowerCase()}|${answer.toUpperCase()}|${answer[0].toUpperCase()}${answer.substring(1)}`);
}

function fetchRandomTrivia() {
  document.querySelector("input").value = "";
  let message = document.querySelector("div");
  if (message) {
    message.remove();
  }
  fetch(triviaUrl)
    .then(response => response.json())
    .then(result => {
      let categoryId = result[0].category_id;
      fetch(clueUrl, { category: categoryId })
        .then(response => response.json())
        .then(result => {
          let randomClue = result[generateRandomIndex(100)];
          presentQuestion(randomClue.question, randomClue.answer);
          correctAnswer = randomClue.answer;
        })
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function increasePlayerScore() {
  let scoreText = document.querySelector(".score");
  let score = parseInt(scoreText.innerText);
  score++;
  scoreText.innerText = score;
}

function showUserMessage(isCorrect) {
  let message = document.createElement("div");
  if (isCorrect) {
    message.innerHTML = "You're absolutely right!";
  } else {
    message.innerHTML = `Oops! The correct response was <strong>${correctAnswer}</strong>.`;
  }
  document.querySelector("form").append(message);
}

let submitButton = document.getElementById("submit");
submitButton.onclick = function(event) {
  event.preventDefault();
  let validInput = document.querySelector("input:valid");
  if (validInput) {
    increasePlayerScore();
    showUserMessage(true);
  } else {
    document.querySelector(".score").innerText = 0;
    showUserMessage(false);
  }
  setTimeout(fetchRandomTrivia, 5000);
}

fetchRandomTrivia();