import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 8;
let guessesRemaining = NUMBER_OF_GUESSES;
let guessedWrong = [];
let guessedCorrect = [];
let currentGuess = '';
let countCorrect = 0;
let letterColor = '#c4c4c4';

document.getElementById("rem_guesses").innerHTML = NUMBER_OF_GUESSES;

// Pick a random word from file
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(rightGuessString)

function initBoard() {
    let board = document.getElementById("game-board");

    let row = document.createElement("div")
    row.className = "letter-row"
    
    for (let j = 0; j < rightGuessString.length; j++) {
        let box = document.createElement("div")
        box.className = "letter-box"
        row.appendChild(box)
    }

    board.appendChild(row)
}

initBoard()

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    currentGuess = pressedKey;

    // Check if letter is in the correct string
    checkGuess()
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

function insertLetter (index) {
    //currentGuess = currentGuess.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[0]
    let box = row.children[index]
    animateCSS(box, "pulse")
    box.textContent = currentGuess
    box.classList.add("filled-box")
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            elem.style.backgroundColor = color
            break
        }
    }
}

function checkGuess () {
    
    // Incorrect symbol entered
    let found = currentGuess.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    }

    let delay = 50
    setTimeout(()=> {
        shadeKeyBoard(currentGuess, letterColor)
    }, delay)

    let row = document.getElementsByClassName("letter-row")[0]

    // Symbol not in correct string
    if (!rightGuessString.includes(currentGuess)) {
        animateCSS(row, "shakeX")
        if(guessedWrong.includes(currentGuess))
            toastr.error("You already guessed that");
        else{
            toastr.error("letter not in word!");
            guessesRemaining--;
            guessedWrong.push(currentGuess);
            console.log(guessedWrong);
            console.log(guessesRemaining);
            document.getElementById("rem_guesses").innerHTML = guessesRemaining;

            if (guessesRemaining === 0) {
                toastr.error("You've run out of guesses! Game over!");
                toastr.info(`The right word was: "${rightGuessString}"`);
            }
        }

        return
    }

    // Symbol is in correct string

    for(let i = 0; i < rightGuessString.length; i++){
        if((rightGuessString[i] === currentGuess)){
            insertLetter(i);
            countCorrect++;
            if(!guessedCorrect.includes(currentGuess)){
                guessedCorrect.push(currentGuess)
                console.log(countCorrect, rightGuessString.length)
                if (countCorrect === rightGuessString.length) {
                    toastr.success("You got it!")
                }
                console.log(guessedCorrect)
            }
            
        }
    }
}


const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element
    node.style.setProperty('--animate-duration', '0.1s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});
