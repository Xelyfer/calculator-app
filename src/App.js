import React, { useState } from "react";

import Keys from "./Keys";

function App() {
  const [theme, setTheme] = useState("blue");
  const [answer, setAnswer] = useState("0");
  const [expression, setExpression] = useState("");

  function changeTheme(event) {
    setTheme(event.target.id);
  }

  function handleClick(event) {
    const { value } = event.target;
    let finalAnswer = "";
    let finalExpression = "";

    // If the displayed answer is 0 (by defualt), replace 0 with the button clicked.
    // Otherwise, append the character to the end of the displayed answer.
    if (answer === "0") {
      if (expression !== "") {
        finalAnswer = expression + value;
      } else if (/[+\-*/]/.test(value)) {
        if (/[+\-*/]/.test(expression.slice(-1))) {
          finalExpression = expression.slice(0, -1) + value;
        }
        return;
      } else {
        finalAnswer = value;
      }
    } else {
      if (value !== "=") finalAnswer = answer + value;
    }

    if (/[+\-*/.]/.test(value) && /[+\-*/.]/.test(expression.slice(-1))) {
      // If the last character in the expression is an operator, replace it with the newly
      // clicked operator. Else append the operator to the end of the expression and answer.
      // To prevent double ++ or +- etc.
      finalExpression = expression.slice(0, -1) + value;
      finalAnswer = expression.slice(0, -1) + value;
    } else {
      finalExpression = expression + value;
    }

    // If the last character in the expression is an "=", check if the button clicked
    // is a number. If it is, set the expression to be that character (Basically resetting).
    // Else, the total becomes the expression with the character appened to the end.
    if (expression.slice(-1) === "=") {
      if (/[0-9]/.test(value)) {
        finalExpression = value;
        finalAnswer = value;
      } else {
        finalExpression = answer + value;
      }
    }

    setExpression(finalExpression);
    setAnswer(finalAnswer);
  }

  function deletePrevious() {
    setExpression(expression.slice(0, -1));
    setAnswer("0");
  }

  function reset() {
    setAnswer("0");
    setExpression("");
  }

  function calculate() {
    if (/[+\-*/=.]/.test(expression.slice(-1))) {
      return;
    } else {
      try {
        if (eval(expression) !== undefined) {
          setAnswer(eval(expression));
        }
      } catch (error) {
        console.log(error);
      }
      if (expression !== "") {
        setExpression(expression + "=");
      }
    }
  }

  return (
    <div
      className={
        theme === "white"
          ? "App white"
          : theme === "purple"
          ? "App purple"
          : "App blue"
      }
    >
      <div className="header">
        <h1>calc</h1>
        <div className="themes">
          <h3>THEME</h3>
          <div className="switch">
            <div className="labels">
              <label for="1">1</label>
              <label for="2">2</label>
              <label for="3">3</label>
            </div>
            <div className="radios">
              <input
                type="radio"
                name="theme"
                id="blue"
                checked={theme === "blue" ? true : false}
                onChange={changeTheme}
              />
              <input
                type="radio"
                name="theme"
                id="white"
                checked={theme === "white" ? true : false}
                onChange={changeTheme}
              />
              <input
                type="radio"
                name="theme"
                id="purple"
                checked={theme === "purple" ? true : false}
                onChange={changeTheme}
              />
              <div className="slider"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="output">
        <div className="output-history">{expression}</div>
        <div className="output-current">{answer}</div>
      </div>

      <div className="input-grid">
        {Keys.map((current) => {
          return (
            <button
              className={current.className}
              name={current.name}
              value={current.value}
              onClick={
                current.onClick === "handleClick"
                  ? handleClick
                  : current.onClick === "delete"
                  ? deletePrevious
                  : current.onClick === "reset"
                  ? reset
                  : calculate
              }
            >
              {current.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default App;
