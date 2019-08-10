function betterEventListener(el, eventType, cb) {
  el.addEventListener(eventType, cb, true);
  return function() {
    el.removeEventListener(eventType, cb, true);
  };
}
function getRandPos() {
  return Math.floor(Math.random() * 151);
}

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
