const root = document.getElementById("root");
const loadgSpinner = document.getElementById('loadingSpinner');
const question = document.querySelector('#question').content;
const textAnswer = document.querySelector('#textanswer').content;
const finishCard = document.querySelector("#finish").content;
const form = document.getElementById('form');

let amiiboList = [];
let NAME = "";
let POINTS = 0;
let TIME_LIMIT = 8000
let QUESTION_LIST = 15;
let CORRECT_ANSWER = {};
let CURRENT_Q = {};
let TIMEOUT = false;
let CHECK_ANSWER = false;
let TIMEOUT_TIME = 0;
let questionInterval;
let INCORRECT_ANSWERS = [];
let currentQuestionIndex = 0;

const QUESTIONS = [
    {
        answers: 4,
        title: function () { return "Que nombre es el del personaje de este amiibo?" },
        img: true,
        answerType: "character",
        type: "Nombre",
        check: "character"
    },
    {
        answers: 4,
        title: function () { return `A que serie pertenece ${CORRECT_ANSWER.character}` },
        img: false,
        answerType: "gameSeries",
        type: "Nombre",
        check: "gameSeries"

    },
    {
        answers: 4,
        title: function () { return `Que personaje pertenece a la serie ${CORRECT_ANSWER.gameSeries}` },
        img: false,
        answerType: "character",
        type: "Nombre",
        check: "gameSeries"

    },
    {
        answers: 4,
        title: function () { return "Que nombre es el del personaje de este amiibo?" },
        img: true,
        answerType: "character",
        type: "Nombre",
        check: "character"

    },
    {
        answers: 4,
        title: function () { return `A que serie pertenece este amiibo` },
        img: true,
        answerType: "gameSeries",
        type: "Series",
        check: "gameSeries"

    },
    {
        answers: 4,
        title: function () { return `Que amiibo pertenece a ${CORRECT_ANSWER.name}` },
        img: false,
        answerType: "image",
        type: "image",
        check: "character"

    },
    {
        answers: 4,
        title: function () { return `Que amiibo pertenece a ${CORRECT_ANSWER.gameSeries}` },
        img: false,
        answerType: "image",
        type: "image",
        check: "gameSeries"

    },
];

//-------------------------------------------------------------------------form
const nameForm = form.querySelector("#username")
nameForm.value = NAME;
nameForm.addEventListener('input', (event) => {
    NAME = event.target.value;
}
);
const startButton = form.querySelector("button");
startButton.addEventListener("click", () => {
    if (NAME.length < 1 || amiiboList.length < 1) {
        alertToast("Cannot initialize")
    } else {
        gameStarter();
    }

})
//----------------------------------------------------------------------local storage
const localScore = "scoreboard";
let userScore = {
    user: NAME,
    score: POINTS,
}
let localScoreBoard = [];

function loadLocalStorage() {
    localStorage.getItem(localScore) === null ?
        localStorage.setItem(localScore, JSON.stringify([]))
        :
        localScoreBoard = getLocalStorageList();
}

function getLocalStorageList() {
    let savedCollection = JSON.parse(localStorage.getItem(localScore)) || [];
    return savedCollection;
}
function handleAddListInput(object) {
    let localStorageList = getLocalStorageList(localScore)

    localStorageList.push(object);
    localStorage.setItem(localScore, JSON.stringify(localStorageList));
    loadLocalStorage();
    alertToast(`Score added to ${localScore}!`)
}

//-------------------------------------
function gameStarter() {
    form.classList.add("d-none");
    document.querySelector(".h-trivia").classList.add("d-none");
    POINTS = 0;
    currentQuestionIndex = 0
    getNextQuestion();
}

function getNextQuestion() {
    INCORRECT_ANSWERS = [];
    scrollToTop();
    clearInterval(questionInterval);
    questionInterval = 0
    root.innerHTML = "";
    TIMEOUT = false;
    if (currentQuestionIndex + 1 > QUESTION_LIST) {
        drawFinish();
    } else {
        CORRECT_ANSWER = getRandomAmiibo();
        CURRENT_Q = getRandomQuestion();
        drawQuestion(CURRENT_Q, CORRECT_ANSWER);
        currentQuestionIndex++;
    }

}


//----------------------------------------------randomness and limits
function getRandomAmiibo() {
    const randomIndex = Math.floor(Math.random() * amiiboList.length);
    return amiiboList[randomIndex];
}
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    return QUESTIONS[randomIndex];
}
function getRandomAnswer(displayType, checkType) {
    const correctCheckAnswer = CORRECT_ANSWER[checkType];
    let randomAmiibo;

    while (true) {
        randomAmiibo = getRandomAmiibo();

        if (
            randomAmiibo !== CORRECT_ANSWER &&
            randomAmiibo[checkType] !== correctCheckAnswer &&
            !INCORRECT_ANSWERS.includes(randomAmiibo[checkType])
        ) {
            INCORRECT_ANSWERS.push(randomAmiibo[checkType]);
            break;
        }
    }

    return randomAmiibo[displayType];
}
//------------------------------------------------timer
function startTimer() {
    const limit = TIME_LIMIT;
    const progressBar = document.getElementById("timer");
    let remainingTime = limit;
    progressBar.style.width = '100%';
    //progressBar.textContent = `${Math.ceil(limit / 1000)}s`;
    TIMEOUT_TIME = limit;
    questionInterval = setInterval(async () => {
        remainingTime -= 10; // actualizar cada 100ms
        TIMEOUT_TIME -= 10;
        const percentage = Math.max(0, (remainingTime / limit) * 100);
        const secondsRemaining = Math.ceil(remainingTime / 1000);
        progressBar.style.width = percentage + '%';
        //progressBar.textContent = `${secondsRemaining}s`;

        if (remainingTime <= 0) {
            clearInterval(questionInterval);

            TIMEOUT = true;
            validateSelectedAnswer("")
            await waitOneSecond();

            getNextQuestion();
        }
    }, 10);
}

//------------------------------------------------display Question

function drawQuestion(newquestion, correct) {
    const newQ = question.cloneNode(true)
    newQ.querySelector("sub").textContent = `${currentQuestionIndex + 1} / ${QUESTION_LIST}`;
    newQ.querySelector("h3").classList.add("scoreboard")
    newQ.querySelector("h3").textContent = `${POINTS}`

    newQ.querySelector("#question-text p").textContent = newquestion.title()

    if (newquestion.img) {
        const img = document.createElement("img");
        img.src = correct.image;
        img.classList.add("trivia-image-title");
        correct.type === "Card" && img.classList.add("trivia-card-image");
        newQ.querySelector(".card-body").insertAdjacentElement('afterbegin', img);
    }

    let answers = [];
    const correctAnswerIndex = Math.floor(Math.random() * newquestion.answers);
    for (let i = 0; i < newquestion.answers; i++) {
        const answr = textAnswer.cloneNode(true);
        if (i === correctAnswerIndex) {
            if (newquestion.answerType === "image") {
                answr.querySelector("button").textContent = ""
                const buttonImage = document.createElement("img");
                buttonImage.classList.add("button-image");
                buttonImage.src = correct[newquestion.answerType];
                answr.querySelector("button").appendChild(buttonImage)
            } else {
                answr.querySelector("button").textContent = correct[newquestion.answerType];
            }
            answr.querySelector("button").id = "correct";


        } else {
            if (newquestion.answerType === "image") {
                answr.querySelector("button").textContent = ""

                const buttonImage = document.createElement("img");
                buttonImage.classList.add("button-image");
                buttonImage.src = getRandomAnswer(newquestion.answerType, newquestion.check);
                answr.querySelector("button").appendChild(buttonImage)
            } else {
                answr.querySelector("button").textContent = getRandomAnswer(newquestion.answerType, newquestion.check);
            }
            answr.querySelector("button").id = "not-correct";
        }

        answr.querySelector("button").addEventListener("click", async () => {
            if (!TIMEOUT) {
                validateSelectedAnswer(i === correctAnswerIndex ? correct : "")
                TIMEOUT = true;
                CHECK_ANSWER = true;
                clearInterval(questionInterval);
                await waitOneSecond();
                getNextQuestion();
            }
        })
        newQ.querySelector("#answer-content").appendChild(answr);
        answers.push(answr.textContent);
    }

    root.appendChild(newQ)
    startTimer();

}

function drawFinish() {
    let userScore = {
        user: NAME,
        score: POINTS,
    }
    handleAddListInput(userScore)
    const finish = finishCard.cloneNode(true)
    finish.querySelector("#username").textContent = NAME;
    finish.querySelector("#score").textContent = POINTS;
    const tbody = finish.querySelector("#tbody")
    const sortedAmiibos = localScoreBoard.sort((a, b) => b.score - a.score);
    sortedAmiibos.slice(0, 15).map((data, index) => {
        const row = document.createElement("tr");
        const number = document.createElement("td")
        number.textContent = index + 1
        const user = document.createElement("td")
        user.textContent = data.user
        const score = document.createElement("td")
        score.textContent = data.score
        row.appendChild(number);
        row.appendChild(user);
        row.appendChild(score);
        tbody.appendChild(row)
    })


    finish.querySelector("button").addEventListener("click", () => {
        root.innerHTML = "";
        form.classList.remove("d-none");
        document.querySelector(".h-trivia").classList.remove("d-none");

    })

    root.appendChild(finish)
}
//----------------------------------VALIDATION ANSWER
function validateSelectedAnswer(id) {
    let point = 0;
    const timeoutSeconds = TIMEOUT_TIME / 1000;
    const limitSeconds = TIME_LIMIT / 1000
    const scoreboard = document.querySelector(".scoreboard");
    const animation = document.createElement("div");
    animation.classList.add("score-animation")

    if (id === CORRECT_ANSWER) {
        conffeti();
        document.querySelector("#correct").classList.add("btn-success");
        document.querySelector("#correct").classList.add("selected-correct-answer");
        document.querySelector("#correct").classList.add("shadow-lg");
        document.querySelectorAll("#not-correct").forEach(elemento => {
            elemento.classList.add("btn-danger");
            elemento.classList.add("wobble-ver-right");
            elemento.classList.add("animation-not-selected-erroranswer");
        });

        const timePercentage = (timeoutSeconds / limitSeconds) * 100;

        if (timePercentage <= 50) {
            point = Math.floor(75 * 1);
        } else if (timePercentage <= 75) {
            point = Math.floor(75 * 1.5);
        } else if (timePercentage <= 100) {
            point = Math.floor(75 * 2);
        } else {
            point = 75;
        }
        animation.classList.add("score-correct-animation");
        animation.classList.add("text-success");


    } else {
        document.querySelector("#correct").classList.add("btn-success");
        document.querySelector("#correct").classList.add("selected-correct-answer");
        document.querySelector("#correct").classList.add("shadow-lg");
        document.querySelectorAll("#not-correct").forEach(elemento => {
            elemento.classList.add("btn-danger");
            elemento.style.zindex = "99999999";
            elemento.classList.add("wobble-ver-right");
            elemento.classList.add("animation-not-selected-erroranswer");
        });
        point = -50
        animation.classList.add("score-error-animation")
        animation.classList.add("text-danger");

    }
    animation.textContent = point;
    scoreboard.insertAdjacentElement('afterend', animation);
    incrementScore(scoreboard, point, 2000)
};

function incrementScore(DOMelement, score, duration) {
    DOMelement.textContent = POINTS;
    let initialScore = parseInt(DOMelement.textContent, 10) || 0;
    let finalScore = initialScore + score;
    let currentScore = initialScore;
    const increment = Math.abs(score) / (duration / 10);

    const interval = setInterval(() => {

        if (score > 0) {
            currentScore += increment;
            if (currentScore >= finalScore) {
              currentScore = finalScore;
              clearInterval(interval);
            }
          } else {
            currentScore -= increment;
            if (currentScore <= finalScore) {
              currentScore = finalScore;
              clearInterval(interval);
            }
          }
          
      DOMelement.textContent = Math.floor(currentScore);
    }, 10);
    POINTS += score;

  }

//---------------------------------------fetching the amiibo
async function fetchAmiibo() {
    let url = `https://www.amiiboapi.com/api/amiibo/?type=figure&showusage`

    loadingSpinner.classList.remove('d-none');


    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Fallo de la xarxa: " + response.statusText)
        }
        const data = await response.json();

        amiiboList = data.amiibo;

        loadingSpinner.classList.add('d-none');

    } catch (error) {
        console.error("Error: ", error)
    }

}


//------------------------------------------------------misc
function alertToast(text) {
    const toast = document.querySelector("#toast");
    toast.querySelector(".toast-body").innerText = text
    const showToast = bootstrap.Toast.getOrCreateInstance(toast);
    showToast.show();
}
function waitOneSecond() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(); // Resuelve la promesa después de 1 segundo
        }, 4000); // 1000 milisegundos = 1 segundo
    });
}
function cleanString(str) {
    return str.replace(/\s-\s.*$/, '');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Hace que el desplazamiento sea suave
    });

}
//---------------------------------------------onload
window.onload = initialRender;
async function initialRender() {
    loadLocalStorage();
    await fetchAmiibo();

}


// confetti
//https://github.com/catdad/canvas-confetti

let count = 200;
let defaults = {
    origin: { y: 0.7 }
};

function fire(particleRatio, opts) {
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
    });
}

function conffeti() {

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

