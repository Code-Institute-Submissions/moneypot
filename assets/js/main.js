// TODO  WRITE:
/* function nextLevel() {
 * } 
 * function rewardStar() {
 * } 
 * function resetStars() {
 * }
 * function resetGame() {
 * }
 * function enfOfGame(){
 * }
 * function winnerAudio(){
 * }
 * Congrats modal for winning the game!
 */

// Global variables
const coinButtonRef = document.getElementById("coin");
const priceRef = document.getElementById("price");
const displaySumRef = document.getElementById("sum");
const taskRef = document.getElementById("gameTask");
const levelRef = document.getElementById("gameLevel");
const soundOff = true;
const soundOn = true;
let sum = 0;
let currentGame;
let currentTPS;
let levelNumber = 0;
let levelTask = 0;
let taskArray;
let currentTask;

$(document).ready(function () {
  fetchData("game.json");
});

/**
 * Fetch data from:
 * @param {string} url allows
 * game data to show on the index.html form JSON file
 */
const fetchData = (url) => {
  return fetch(`assets/data/${url}`)
    .then((res) => res.json())
    .then(gameData => {
      setGame(gameData.game);
    })
    .catch((err) => console.log(err));
};

/**
 * This function initiates the game display
 * starting with Level 1 & Task 1,
 * first priceTag and coins associates
 * @param game {[]} - The whole game.json
 * @param levelNumber {number}
 * @param taskNumber {number}
 */
const setGame = (game, levelNumber, taskNumber) => {
  currentGame = game[levelNumber];
  currentTPS = currentGame.tps[taskNumber];
  taskArray = (currentGame.tps);
  currentTask = (currentGame.tps[0].thisTask);

  levelRef.innerHTML += `<h1>Level ${currentGame.level}</h1>`;
  taskRef.innerHTML += `<h1>Task ${currentTPS.thisTask}</h1>`;
  priceRef.innerHTML += `<h1>${currentTPS.priceTag}p</h1>`;

  currentGame.coins.forEach((coin) => {
    coinButtonRef.innerHTML +=
      `<div class="col-5 col-sm-3 text-center">
      <button class="coin coin-button" value="${coin.value}" type="button" aria-hidden="true">
      <img src="${coin.source}" alt="${coin.name}" class="img h-75 w-75">
      </button>
      </div>`;
  });

  $(".coin-button").click(function () {
    // Converting the value clicked on to a number
    const coinValue = +($(this).attr("value"));
    const price = (currentTPS.priceTag);
    const task = (currentTPS.thisTask);
    addCoinValue(coinValue, price, task);
  });
  $(".coin").click(function () {
    addCoinAudio();
  });
  displaySum(game[0].coins);
};

/**
 * This function calls out the next task in the Level of the game.
 * @param taskArray {[]} parameter for all tasks in a level.
 * @param currentTask {number} sequence number of the current task.
 * @param currentTPS{[]} parameter for the current display of Task, Price and Stars.
 */
const nextTask = () => {
  taskNumber++;
  fetchData();
};

/**
 * This function allows coin value to add to totalSum
 * @param sum {number} - total value of coins the user clicked on
 * @param gameData {[]} - The whole game.json.
 * @param task{[]} - current task.
 */
const addCoinValue = (coinValue, price, task) => {
  sum += coinValue;
  displaySumRef.innerHTML = `<h1>${sum}p</h1>`;
  if (sum === price) {
    openModal("nextTask");
    delayedCorrectSumAudio();
  } else if (sum > price) {
    openModal("reset");
    delayedBadSumAudio();
  } else if (sum === price && task >= 6) {
    openModal("nextLevel");
  }
};

/**
 * This function created modal footer and
 * replace it's button & id depending on the outcome 
 * on addCoinValue (on the switch).
 * @param state {string} - the string to match switch statement.
 */
const openModal = (state) => {
  let buttonText = ``;
  let buttonId = ``;
  let iClassFooter = ``;
  let iClassBody = ``;
  let bodyText = ``;
  let srOnly = ``;

  /**
   * Switch allows the information to change in the 
   * required parts of the modal dependant on the 
   * assifned variable
   */
  switch (state) {
    case "nextTask":
      buttonText = "Next Task";
      buttonId = "nextTask";
      iClassFooter = "fa fa-play";
      iClassBody = "fas fa-star";
      bodyText = "Congratulations! You are now through to the next task!";
      srOnly = "star";
      break;

    case "nextLevel":
      buttonText = "Next Level";
      buttonId = "nextLevel";
      iClassFooter = "fa fa-play";
      iClassBody = "fas fa-medal";
      bodyText = "Congratulations! You are now through to the next level!";
      srOnly = "medal";
      break;

    case "reset":
      buttonText = "Reset";
      buttonId = "errorModal";
      iClassFooter = "fas fa-redo";
      iClassBody = "far fa-frown";
      bodyText = "The sum is not correct. Please check your coins!";
      srOnly = "sad face";
      break;
  }
  // These variables add content to individual parts of the modal
  const backdropLabelContent = document.createElement("h6");
  backdropLabelContent.innerHTML += `<h6 class="modal-title justify-content-center" id="staticBackdropLabel">${bodyText}</h6>`;

  const modalBodyContent = document.createElement("div");
  modalBodyContent.innerHTML += `<div><i class="${iClassBody}" aria-hidden="true"></i><span
            class="sr-only">${srOnly}</span></div>
      </div>`;

  const modalFooterContent = document.createElement("div");
  modalFooterContent.innerHTML += `<div><button id="${buttonId}" type="btn" class="modal-btn rounded pl-3" data-dismiss="modal">${buttonText}<i class="${iClassFooter} p-2" aria-hidden="true"></i></button></div>`;

  /**
   * This method allows to fetch the information 
   * to index.html and assing appopriate content.
   */
  $("#modal").modal("toggle");
  document.getElementById("modalHeader").appendChild(backdropLabelContent);
  document.getElementById("modalBody").appendChild(modalBodyContent);
  document.getElementById("modalFooter").appendChild(modalFooterContent);

  /**
   * Event listeners required to action
   * the game Level and/or Task 
   * dependant on addCoinValue outcomes.
   */
  $("#nextTask").click(function () {
    resetSum();
    nextTask();
  });
  $("#errorModal").click(function () {
    resetSum();
  });
  $("#nextLevel").click(function () {
    resetSum();
    nextLevel();
  });

};

/**
 * Function to display initial
 * sum value of 0 at the start
 * of the game. If it's removed, 
 * you remove initial sum display
 * and leave it blank
 */
function displaySum() {
  displaySumRef.innerHTML = `<h1>${sum}p</h1>`;
}

function resetSum() {
  sum = 0;
  displaySumRef.innerHTML = `<h1>${sum}p</h1>`;
}
//ALL AUDIO FUNCTIONS
/**
 * Function enabling an audio
 * at a click of a button in HTML.
 * If you remove it, elements with
 * .btn class won't have a sound.
 */

$(".btn").click(function () {
  playButtonAudio();
});

function playButtonAudio() {
  $("#buttonClickAudio")[0].currentTime = 0;
  $("#buttonClickAudio")[0].play();
}
/**
 * Function enabling an audio
 * at a click of a coin image in HTML.
 * If you remove it, elements with
 * .coin class won't have a sound.
 */
$(".coin").click(function () {
  addCoinAudio();
});

function addCoinAudio() {
  $("#coinClickAudio")[0].currentTime = 0;
  $("#coinClickAudio")[0].play();
};

function delayedCorrectSumAudio() {
  setTimeout(function () {
    $("#yippeeAudio")[0].play();
  }, 800);
};

function delayedBadSumAudio() {
  setTimeout(function () {
    $("#tryAgainAudio")[0].play();
  }, 800);
};

$("#soundOff").click(function () {
  muteAudio();
});
/**
 *  This function mutes all buttons
 * when the "sound-off" button
 * located in index.html is clicked on
 */
function muteAudio() {
  const allAudio = $("audio");
  if (soundOff) {
    for (let i = 0; i < allAudio.length; i++) {
      allAudio[i].muted = true;
    }
  }
}
$("#soundOn").click(function () {
  unMuteAudio();
});
/**
 *  This function unmutes all buttons
 * when the "sound-on" button
 * located in index.html is clicked on
 */
function unMuteAudio() {
  const allAudio = $("audio");
  if (soundOn) {
    for (let i = 0; i < allAudio.length; i++) {
      allAudio[i].muted = false;
    }
  }
}