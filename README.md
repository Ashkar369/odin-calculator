# Calculator – The Odin Project

The final project of **The Odin Project Foundations – JavaScript Basics**: an on-screen calculator built with plain HTML, CSS and JavaScript.

- **Live:** https://ashkar369.github.io/odin-calculator/
- **Author:** Ashkar Siyad – Web Technologies, Riga Nordic University

## Features
- The `add`, `subtract`, `multiply` and `divide` functions, plus `operate(operator, a, b)`.
- A two-line display: the history (e.g. `12 + 7 =`) and the current number.
- **Chained operations:** `12 + 7 - 1 =` gives `18`. Pressing an operator first evaluates the pair before it.
- Two operators in a row just change the operator. `=` with only one number does nothing.
- **Long decimals are rounded**, so `2 ÷ 3` shows `0.66666667`.
- **Divide by zero** shows a friendly message instead of crashing.
- **AC** (clear), and extras: the **decimal point** (only one per number), **Backspace**, and **keyboard support** (0–9, `.`, `+ - * /`, Enter, Backspace, Esc).

## How it works
1. **Maths functions:** `add`, `subtract`, `multiply`, `divide`, and `operate()`, which uses a `switch`.
2. **State object:** `{ firstNumber, operator, waitingForNext }` stores what the calculator needs to remember between clicks.
3. **Button actions:** `inputDigit`, `inputDecimal`, `chooseOperator`, `evaluate`, `clearAll` and `backspace`.
4. **Events:**
   - **One click listener** on the keypad reads each button's `data-digit`, `data-op` or `data-action`. This is event delegation.
   - **One keydown listener** maps keyboard keys to the same functions.

Search the code for `BASICS:` to find each concept.

## Try in the console
```js
operate("+", 2, 3);   // 5
operate("÷", 10, 4);  // 2.5
```
