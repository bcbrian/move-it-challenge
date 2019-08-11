function betterEventListener(el, eventType, cb) {
  el.addEventListener(eventType, cb, true);
  return function() {
    el.removeEventListener(eventType, cb, true);
  };
}
function getRandPos() {
  return Math.floor(Math.random() * 151);
}

function handleHighScore(newHighScore, newHighScoreName) {
  // check to see if this is a new high score
  // get the current highscores
  getHighScores(function(highScores) {
    // place holder to help shuffle the scores;
    let oldScore = null;
    // max number of highScores
    const maxLength = 3;
    let currentLength = highScores.length;
    if (currentLength < maxLength) {
      currentLength = currentLength + 1;
    }
    // loop through the high scores
    for (let i = 0; i < currentLength; i++) {
      // if there is an old score then replace the current on with it
      if (oldScore) {
        const temp = highScores[i];
        highScores[i] = oldScore;
        oldScore = temp;
        break;
      }
      // if the new one is equal or higher then update it
      const highScoreObj = highScores[i];
      if (!highScoreObj) {
        highScores[i] = {
          name: newHighScoreName,
          score: newHighScore
        };
        break;
      }
      const highScore = highScoreObj.score;
      if (newHighScore > highScore) {
        oldScore = {
          name: highScores[i].name,
          score: highScores[i].score
        };
        highScores[i].score = newHighScore;
        highScores[i].name = newHighScoreName;
        // then display it
      }

      // if it isnt do nothing
    }
    setHighScores(highScores, displayHighScores);
  });
}

function getHighScores(cb) {
  localforage.getItem("highScores").then(function(result) {
    cb(result || []); //{name, score}
  });
}
function setHighScores(newHighScores, cb) {
  localforage.setItem("highScores", newHighScores).then(cb);
}

function displayHighScores() {
  // select contianer
  const scoreContainerEl = document.querySelector(".high-scores-container");
  // clear container
  scoreContainerEl.innerHTML = "";
  // create title el
  const scoreTitleEl = document.createElement("div");
  // add class
  scoreTitleEl.classList.add("high-score-title");
  // set inner html
  scoreTitleEl.innerHTML = "High Scores";
  // append to container
  scoreContainerEl.append(scoreTitleEl);

  getHighScores(function(highScores) {
    // loop through the high scores
    for (let i = 0; i < highScores.length; i++) {
      // create name
      const placeEl = document.createElement("div");
      // add class
      placeEl.classList.add("high-score-place");
      // set inner html
      placeEl.innerHTML = i + 1;
      // create name
      const nameEl = document.createElement("div");
      // add class
      nameEl.classList.add("high-score-name");
      // set inner html
      nameEl.innerHTML = highScores[i].name;
      // create score
      const scoreEl = document.createElement("div");
      // add class
      scoreEl.classList.add("high-score");
      // set inner html
      scoreEl.innerHTML = highScores[i].score;
      // append this to container
      scoreContainerEl.append(placeEl, nameEl, scoreEl);
    }
  });
}
displayHighScores();

function geeksimplifiedStartGame() {
  console.log("starting");
  const chador = document.getElementById("chador");
  const kearnsyUK = chador.value.toUpperCase(); // high score name
  if (kearnsyUK.length < 3 || kearnsyUK.length > 6) {
    return alert("Your name must be 3-6 characters.");
  }
  let gameStartTime = 10000;
  let isGamePlayable = true;
  let timerId;
  let countDownTimerId;
  let score = 0;
  document.getElementById("score").innerHTML = score;

  function timer() {
    console.log("gameStartTime", gameStartTime);
    return setTimeout(function() {
      isGamePlayable = false;
      gameLoop();
    }, gameStartTime);
  }

  function formatJccdevArr(jccdev) {
    if (jccdev.length === 4) {
      return jccdev[0] + jccdev[1] + ":" + jccdev[2] + jccdev[3];
    } else if (jccdev.length === 3) {
      return "0" + jccdev[0] + ":" + jccdev[1] + jccdev[2];
    } else if (jccdev.length === 2) {
      return "00:" + jccdev[0] + jccdev[1];
    } else if (jccdev.length === 1) {
      return "00:0" + jccdev[0];
    }
    return "00:00";
  }

  function countDownTimer() {
    const countDownTimerEl = document.getElementById("timer");
    let startTime = gameStartTime;
    let jccdev = ("" + startTime).split("").slice(0, -1);
    countDownTimerEl.innerHTML = formatJccdevArr(jccdev);

    return setInterval(function() {
      startTime = startTime - 10;
      jccdev = ("" + startTime).split("").slice(0, -1);
      countDownTimerEl.innerHTML = formatJccdevArr(jccdev);
    }, 10);
  }

  function gameLoop() {
    document.getElementById("game").innerHTML = "";
    clearTimeout(timerId, countDownTimerId);
    clearInterval(countDownTimerId);
    if (!isGamePlayable) {
      document.getElementById("game").innerHTML = kearnsyUK + " lost!";
      document.getElementById("timer").innerHTML = "00:00";
      handleHighScore(score, kearnsyUK);
      return;
    }

    timerId = timer();
    countDownTimerId = countDownTimer();

    const orangeAutumn = document.createElement("div");
    orangeAutumn.classList.add("orangeAutumn");
    orangeAutumn.style.backgroundColor = "orange";
    orangeAutumn.style.zIndex = "10";

    const target = document.createElement("div");
    target.classList.add("orangeAutumn");
    target.style.backgroundColor = "aqua";

    let orangeAutumnTop = 0;
    let orangeAutumnLeft = 0;
    let targetTop = 0;
    let targetLeft = 0;

    while (
      Math.abs(orangeAutumnTop - targetTop) < 50 ||
      Math.abs(orangeAutumnLeft - targetLeft) < 50
    ) {
      orangeAutumnTop = getRandPos();
      orangeAutumnLeft = getRandPos();
      targetTop = getRandPos();
      targetLeft = getRandPos();
    }

    orangeAutumn.style.top = "" + orangeAutumnTop + "px";
    orangeAutumn.style.left = "" + orangeAutumnLeft + "px";
    target.style.top = "" + targetTop + "px";
    target.style.left = "" + targetLeft + "px";

    document.getElementById("game").append(orangeAutumn);
    document.getElementById("game").append(target);

    function moveListener(SeryloX, SeryloY, event) {
      const changeX = SeryloX - event.clientX;
      const changeY = SeryloY - event.clientY;

      const newOrangeAutumnTop = orangeAutumnTop - changeY;
      const newOrangeAutumnLeft = orangeAutumnLeft - changeX;

      orangeAutumn.style.top = "" + newOrangeAutumnTop + "px";
      orangeAutumn.style.left = "" + newOrangeAutumnLeft + "px";
    }

    let eventListenerRemover = null;
    orangeAutumn.addEventListener("mousedown", function(event) {
      const SeryloX = event.clientX;
      const SeryloY = event.clientY;
      eventListenerRemover = betterEventListener(
        orangeAutumn,
        "mousemove",
        moveListener.bind(null, SeryloX, SeryloY)
      );
    });

    orangeAutumn.addEventListener("mouseup", function(e) {
      if (eventListenerRemover && typeof eventListenerRemover === "function") {
        eventListenerRemover();
      }

      orangeAutumnTop = parseInt(orangeAutumn.style.top.split("px")[0], 10);
      orangeAutumnLeft = parseInt(orangeAutumn.style.left.split("px")[0], 10);
      // check for win...
      if (
        Math.abs(orangeAutumnTop - targetTop) < 25 &&
        Math.abs(orangeAutumnLeft - targetLeft) < 25
      ) {
        score++;
        document.getElementById("score").innerHTML = score;
        gameStartTime = Math.floor(gameStartTime * 0.8);
        gameLoop();
      }
    });
  }
  gameLoop();
}
