// =====================================================================
// Calculator – The Odin Project Foundations (final JavaScript Basics project)
// =====================================================================

// ---------- 1. The maths: four small functions -------------------------
// BASICS: function
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

// BASICS: function – picks the right maths function for the operator
function operate(operator, a, b) {
  // BASICS: switch statement (a neat form of if / else if)
  switch (operator) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "×": return multiply(a, b);
    case "÷": return divide(a, b);
    default: return null;
  }
}

// Long decimals like 2/3 = 0.6666666666 are rounded to 8 decimal places
function roundResult(n) {
  return Math.round(n * 1e8) / 1e8;
}

// ---------- 2. The state of the calculator -----------------------------
// BASICS: object – everything the calculator needs to remember
const state = {
  firstNumber: null,     // number on the left of the operator
  operator: null,        // "+", "-", "×" or "÷"
  waitingForNext: false, // true right after an operator: the next digit starts a new number
};

// BASICS: DOM – the two lines of the display
const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

function setDisplay(text) {
  currentEl.textContent = text;
}

// ---------- 3. Button actions ------------------------------------------
function inputDigit(digit) {
  if (state.waitingForNext || currentEl.textContent === "0" || currentEl.dataset.error) {
    setDisplay(digit);
    state.waitingForNext = false;
    delete currentEl.dataset.error;
  } else if (currentEl.textContent.length < 15) {
    setDisplay(currentEl.textContent + digit);
  }
}

// Extra credit: decimal point – only one "." per number
function inputDecimal() {
  if (state.waitingForNext || currentEl.dataset.error) {
    setDisplay("0.");
    state.waitingForNext = false;
    delete currentEl.dataset.error;
    return;
  }
  // BASICS: string method – includes()
  if (!currentEl.textContent.includes(".")) setDisplay(currentEl.textContent + ".");
}

function chooseOperator(op) {
  if (currentEl.dataset.error) return;
  // Pressing two operators in a row just changes the operator
  if (state.operator && state.waitingForNext) {
    state.operator = op;
    historyEl.textContent = `${state.firstNumber} ${op}`;
    return;
  }
  // Chained operations: 12 + 7 - … → first evaluate 12 + 7
  if (state.operator !== null) {
    if (!evaluate()) return;
  }
  state.firstNumber = Number(currentEl.textContent);
  state.operator = op;
  state.waitingForNext = true;
  historyEl.textContent = `${state.firstNumber} ${op}`;
}

// Returns false if there was an error (divide by zero)
function evaluate() {
  // "=" before a full pair of numbers does nothing
  if (state.operator === null || state.waitingForNext) return true;

  const a = state.firstNumber;
  const b = Number(currentEl.textContent);

  if (state.operator === "÷" && b === 0) {
    clearAll();
    setDisplay("Nope – can't ÷ 0 🙂");
    currentEl.dataset.error = "true";
    return false;
  }

  const result = roundResult(operate(state.operator, a, b));
  historyEl.textContent = `${a} ${state.operator} ${b} =`;
  setDisplay(String(result));
  state.firstNumber = result;
  state.operator = null;
  state.waitingForNext = true;
  return true;
}

function clearAll() {
  state.firstNumber = null;
  state.operator = null;
  state.waitingForNext = false;
  delete currentEl.dataset.error;
  historyEl.textContent = "";
  setDisplay("0");
}

// Extra credit: Backspace
function backspace() {
  if (state.waitingForNext || currentEl.dataset.error) return;
  // BASICS: string method – slice() removes the last character
  const shorter = currentEl.textContent.slice(0, -1);
  setDisplay(shorter === "" || shorter === "-" ? "0" : shorter);
}

// ---------- 4. Connect buttons and keyboard ----------------------------
// BASICS: DOM event listener – one listener for the whole keypad (event delegation)
document.getElementById("keys").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  const { digit, op, action } = btn.dataset;
  if (digit !== undefined) inputDigit(digit);
  else if (op) chooseOperator(op);
  else if (action === "decimal") inputDecimal();
  else if (action === "equals") evaluate();
  else if (action === "clear") clearAll();
  else if (action === "backspace") backspace();
});

// BASICS: object used as a lookup table – keyboard key → calculator operator
const KEY_OPERATORS = { "+": "+", "-": "-", "*": "×", "x": "×", "/": "÷" };

// Extra credit: keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (/^[0-9]$/.test(key)) inputDigit(key);
  else if (key === "." || key === ",") inputDecimal();
  else if (key in KEY_OPERATORS) { event.preventDefault(); chooseOperator(KEY_OPERATORS[key]); }
  else if (key === "Enter" || key === "=") { event.preventDefault(); evaluate(); }
  else if (key === "Backspace") backspace();
  else if (key === "Escape" || key.toLowerCase() === "c") clearAll();
  else return;
  // Briefly highlight the matching button so viewers see the key press
  const selector = /^[0-9]$/.test(key) ? `[data-digit="${key}"]`
    : key in KEY_OPERATORS ? `[data-op="${KEY_OPERATORS[key]}"]`
    : key === "Enter" || key === "=" ? '[data-action="equals"]'
    : key === "Backspace" ? '[data-action="backspace"]'
    : key === "." || key === "," ? '[data-action="decimal"]' : '[data-action="clear"]';
  const btn = document.querySelector(selector);
  if (btn) { btn.classList.add("pressed"); setTimeout(() => btn.classList.remove("pressed"), 120); }
});
