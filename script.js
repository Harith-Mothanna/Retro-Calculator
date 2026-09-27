"use strict";

// state varialbes
let screenValue = "0";
let previousValue = null;
let currentOperator = null;
let overwrite = true; //true || false (wither to overwrite the screen or add to it)

// DOM elements
const screenEl = document.getElementById("screen");
const leftSideEl = document.querySelector(".left-side");
const musicEl = document.getElementById("music");
const clickSoudEl = document.getElementById("click-sound");

const btnAll = document.querySelectorAll(".btn");
const btnNUmAll = document.querySelectorAll(".btn--num");
const btnOperatorAll = document.querySelectorAll(".btn--operator");

const btnPointEl = document.querySelector(".point");
const btnDeleteEl = document.querySelector(".delete");
const btnClearEl = document.querySelector(".clear");
const btnEqualEl = document.querySelector(".equal");
const btnSoundEl = document.querySelector(".btn--sound");

const keyMap = {
  1: document.querySelector(".btn--1"),
  2: document.querySelector(".btn--2"),
  3: document.querySelector(".btn--3"),
  4: document.querySelector(".btn--4"),
  5: document.querySelector(".btn--5"),
  6: document.querySelector(".btn--6"),
  7: document.querySelector(".btn--7"),
  8: document.querySelector(".btn--8"),
  9: document.querySelector(".btn--9"),
  0: document.querySelector(".btn--0"),
  Enter: btnEqualEl,
  Backspace: btnDeleteEl,
  "=": btnEqualEl,
  "+": document.querySelector(".plus"),
  "-": document.querySelector(".subtract"),
  x: document.querySelector(".multiply"),
  "/": document.querySelector(".divide"),
  "%": document.querySelector(".mod"),
};

// upadting screen
const updateScreen = function () {
  screenEl.value = screenValue;
  leftSideEl.textContent = previousValue;
};

const formateNumber = function (value) {
  return Math.round(value * 1e10) / 1e10;
};

// operation handler
const operation = function (firstOperand, secondOperand, operator) {
  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
    case "-":
      return firstOperand - secondOperand;
    case "×":
      return firstOperand * secondOperand;
    case "÷":
      return firstOperand / secondOperand;
    case "%":
      return firstOperand % secondOperand;
  }
};

// press digit
const pressDigit = function (digit) {
  screenEl.classList.remove("result");
  if (overwrite) {
    screenValue = digit;
    overwrite = false;
  } else {
    screenValue = screenValue === "0" ? digit : screenValue + digit;
  }
  updateScreen();
};

// press operator
const pressOperator = function (operator) {
  if (screenValue === "ERROR") return;
  if (previousValue === null) {
    previousValue = screenValue;
    screenValue = operator;
    currentOperator = operator;
    overwrite = false;
  } else if (previousValue != null && screenValue.length === 1) {
    currentOperator = operator;
    screenValue = currentOperator;
  } else {
    let result = operation(
      Number(previousValue),
      Number(screenValue.slice(1)),
      currentOperator,
    );

    if (!Number.isFinite(result)) {
      currentOperator = null;
      previousValue = null;
      overwrite = true;
      screenValue = "ERROR";
    } else {
      previousValue = formateNumber(result);
      currentOperator = operator;
      screenValue = currentOperator;
    }
  }
  updateScreen();
  screenEl.classList.remove("result");
  if (screenValue === "ERROR") screenEl.classList.add("result");
};

// delete press
const pressDelete = function () {
  if (screenValue === "ERROR") {
    pressClear();
    return;
  } else if (screenValue === "0" || overwrite) return;
  else if (screenValue.length === 1) {
    screenValue = previousValue + "";
    previousValue = null;
    currentOperator = null;
  } else {
    screenValue = screenValue.slice(0, -1);
  }
  updateScreen();
  screenEl.classList.remove("result");
};

// clear press
const pressClear = function () {
  screenValue = "0";
  previousValue = null;
  currentOperator = null;
  overwrite = true;
  screenEl.classList.remove("result");
  updateScreen();
};

// point press
const pressPoint = function () {
  if (
    screenValue === "+" ||
    screenValue === "-" ||
    screenValue === "×" ||
    screenValue === "÷" ||
    screenValue === "%"
  )
    screenValue = screenValue + "0.";
  else if (screenValue.includes(".")) return;
  else if (overwrite) screenValue = "0.";
  else screenValue += ".";

  overwrite = false;
  updateScreen();
  screenEl.classList.remove("result");
};

// equal press
const pressEqual = function () {
  if (previousValue === null) {
    return;
  } else if (screenValue.length === 1 && currentOperator) {
    screenValue = previousValue;
    previousValue = null;
    currentOperator = null;
    overwrite = true;
  } else {
    let result = operation(
      Number(previousValue),
      Number(screenValue.slice(1)),
      currentOperator,
    );
    if (!Number.isFinite(result)) {
      currentOperator = null;
      previousValue = null;
      overwrite = true;
      screenValue = "ERROR";
    } else {
      screenValue = formateNumber(result) + "";
      previousValue = null;
      overwrite = true;
      currentOperator = null;
    }
  }
  screenEl.classList.add("result");
  updateScreen();
};

// sound button press
const pressSound = function () {
  document.querySelector(".sound--off").classList.toggle("hidden");
  document.querySelector(".sound--on").classList.toggle("hidden");
  if (musicEl.paused) musicEl.play();
  else musicEl.pause();
};

// wiring
// btn sound effect
for (const btn of btnAll) {
  btn.addEventListener("click", function () {
    clickSoudEl.currentTime = 0;
    clickSoudEl.play();
  });
}

// btn num pressed
for (const btn of btnNUmAll) {
  btn.addEventListener("click", () => pressDigit(btn.textContent));
}

// operator pressed
for (const operatorEl of btnOperatorAll) {
  operatorEl.addEventListener("click", () =>
    pressOperator(operatorEl.textContent),
  );
}

btnDeleteEl.addEventListener("click", pressDelete);
btnClearEl.addEventListener("click", pressClear);
btnPointEl.addEventListener("click", pressPoint);
btnEqualEl.addEventListener("click", pressEqual);
btnSoundEl.addEventListener("click", pressSound);

// mapping keyboard press to btns
document.addEventListener("keydown", function (e) {
  let key = e.key;

  if (keyMap[key]) {
    keyMap[key].click();
  }
});

/////////////////// making the button press transition work

document.querySelectorAll(".btn").forEach((btn) => {
  let releaseTimer;

  btn.addEventListener("mousedown", () => {
    clearTimeout(releaseTimer);
    btn.classList.add("pressed");
  });

  const release = () => {
    // keep the pressed look for at least 80ms, even if the real click was shorter
    releaseTimer = setTimeout(() => btn.classList.remove("pressed"), 80);
  };

  btn.addEventListener("mouseup", release);
  btn.addEventListener("mouseleave", release); // in case the mouse drags off the button while held
});
/////////////////

musicEl.volume = 0.2;
clickSoudEl.volume = 0.5;

updateScreen();
