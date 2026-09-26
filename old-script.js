"use strict";

// selectors
const btnNumAll = document.querySelectorAll(".btn--num");
const btnOperatorAll = document.querySelectorAll(".btn--operator");

const screenEl = document.getElementById("screen");
const leftSideEl = document.querySelector(".letf-side");

const musicEl = document.querySelector("#music");
const btnSoundEl = document.querySelector(".btn--sound");
const btnClearEl = document.querySelector(".clear");
const btnDeletEl = document.querySelector(".delete");
const btnEqialEl = document.querySelector(".equal");
const btnPlusEl = document.querySelector(".plus");
const btnPointEl = document.querySelector(".point");

// initials
let screenValue = "";
let leftSide;

// functions
const setScreen = function (value) {
  screenValue = value;
  screenEl.value = screenValue;
};

const setLetfSide = function (value) {
  if (value === "") {
    leftSide = undefined;
    leftSideEl.textContent = "";
  } else {
    leftSide = Number(value);
    leftSideEl.textContent = leftSide;
  }
};

///////// clicking a number //////////

for (const btn of btnNumAll) {
  btn.addEventListener("click", function () {
    // screen.value += btn.textContent;
    if (screenEl.classList.contains("result")) {
      setScreen("");
      setLetfSide("");
      screenEl.classList.remove("result");
    }
    setScreen(screenValue + btn.textContent);
  });
}

//////////// handling operation ////////////

for (const func of btnOperatorAll) {
  func.addEventListener("click", function () {
    screenEl.classList.remove("result");
    if (screenValue === "" && (leftSide === undefined || leftSide === 0)) {
      setScreen(func.textContent);
    } else if ((screenValue || screenValue === 0) && leftSide === undefined) {
      // leftSide = Number(screenValue);
      setLetfSide(Number(screenValue));
      setScreen(func.textContent);
    } else if (screenValue && (leftSide || leftSide === 0)) {
      switch (screenEl.value[0]) {
        case "+":
          leftSide += Number(screenEl.value.slice(1));
          setLetfSide(leftSide);
          setScreen(func.textContent);
          break;

        case "-":
          leftSide -= Number(screenEl.value.slice(1));
          setLetfSide(leftSide);
          setScreen(func.textContent);
          break;

        case "×":
          leftSide *= Number(screenEl.value.slice(1));
          setLetfSide(leftSide);
          setScreen(func.textContent);
          break;

        case "÷":
          leftSide /= Number(screenEl.value.slice(1));
          setLetfSide(leftSide);
          setScreen(func.textContent);
          break;

        case "%":
          leftSide %= Number(screenEl.value.slice(1));
          setLetfSide(leftSide);
          setScreen(func.textContent);
          break;
      }
    }
  });
}

btnEqialEl.addEventListener("click", function () {
  if (leftSide || leftSide === 0) {
    setScreen(leftSide);
    setLetfSide("");
    console.log(leftSide);
    screenEl.classList.add("result");
  }
});

// handleres
btnClearEl.addEventListener("click", function () {
  setScreen("");
  setLetfSide("");
});

btnDeletEl.addEventListener("click", function () {
  // screenValue = screenValue.slice(0, -1);
  setScreen(screenValue.slice(0, -1));
});

btnSoundEl.addEventListener("click", function () {
  document.querySelector(".sound--off").classList.toggle("hidden");
  document.querySelector(".sound--on").classList.toggle("hidden");
  if (musicEl.paused) musicEl.play();
  else musicEl.pause();
});

musicEl.volume = 0.2;

btnPointEl.addEventListener("click", function () {
  if (screenValue.includes(".")) {
    return;
  } else if (screenValue === "") {
    setScreen("0.");
  } else {
    setScreen(screenValue + ".");
  }
});
