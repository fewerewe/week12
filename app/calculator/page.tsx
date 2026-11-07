"use client";

import { useEffect, useReducer } from "react";

type CalculatorState = {
  phase: "first" | "operator" | "second";
  display: string;
  first: number;
  second: number;
  operator: "+" | "-" | null;
};

type CalculatorAction =
  | { type: "number"; value: string }
  | { type: "operator"; value: "+" | "-" }
  | { type: "equals" }
  | { type: "clear" };

type CalculatorButton = {
  label: string;
  color: "blue" | "green" | "red";
  disabled?: boolean;
  action?: () => void;
};

const initialState: CalculatorState = {
  phase: "first",
  display: "0",
  first: 0,
  second: 0,
  operator: null,
};

function calculate(first: number, second: number, operator: "+" | "-" | null) {
  if (operator === "+") return first + second;
  if (operator === "-") return first - second;
  return null;
}

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "number": {
      if (state.phase === "operator") {
        return { ...state, phase: "second", display: action.value };
      }

      if (state.display.length >= 9 && state.display !== "0") return state;

      return {
        ...state,
        display:
          state.display === "0"
            ? action.value
            : state.display + action.value,
      };
    }
    case "operator":
      if (state.phase !== "first") return state;
      return {
        ...state,
        phase: "operator",
        first: Number(state.display),
        operator: action.value,
      };
    case "equals": {
      if (state.phase === "operator") {
        const result = calculate(state.first, state.first, state.operator);
        return result === null
          ? state
          : {
              ...state,
              phase: "first",
              display: String(result),
              second: state.first,
            };
      }

      const second =
        state.phase === "second" ? Number(state.display) : state.second;
      const result = calculate(
        state.phase === "second" ? state.first : Number(state.display),
        second,
        state.operator,
      );

      return result === null
        ? state
        : {
            ...state,
            phase: "first",
            display: String(result),
            second,
          };
    }
    case "clear":
      return initialState;
  }
}

function formatDisplay(value: string) {
  const sign = value.startsWith("-") ? "-" : "";
  const digits = sign ? value.slice(1) : value;
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function CalculatorPage() {
  const [calculator, dispatch] = useReducer(calculatorReducer, initialState);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key >= "0" && event.key <= "9") {
        dispatch({ type: "number", value: event.key });
      } else if (event.key === "-" || event.code === "NumpadSubtract") {
        dispatch({ type: "operator", value: "-" });
      } else if (event.key === "+" || event.code === "NumpadAdd") {
        dispatch({ type: "operator", value: "+" });
      } else if (event.key === "=" || event.key === "Enter") {
        event.preventDefault();
        dispatch({ type: "equals" });
      } else if (event.key === "Escape") {
        dispatch({ type: "clear" });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const rows: CalculatorButton[][] = [
    [
      { label: "MC", color: "green", disabled: true },
      { label: "MR", color: "green", disabled: true },
      { label: "M+", color: "green", disabled: true },
      { label: "M-", color: "green", disabled: true },
      { label: "CE", color: "red", action: () => dispatch({ type: "clear" }) },
    ],
    [
      { label: "7", color: "blue", action: () => dispatch({ type: "number", value: "7" }) },
      { label: "8", color: "blue", action: () => dispatch({ type: "number", value: "8" }) },
      { label: "9", color: "blue", action: () => dispatch({ type: "number", value: "9" }) },
      { label: "+", color: "green", disabled: true },
      { label: "√", color: "green", disabled: true },
    ],
    [
      { label: "4", color: "blue", action: () => dispatch({ type: "number", value: "4" }) },
      { label: "5", color: "blue", action: () => dispatch({ type: "number", value: "5" }) },
      { label: "6", color: "blue", action: () => dispatch({ type: "number", value: "6" }) },
      { label: "×", color: "green", disabled: true },
      { label: "÷", color: "green", disabled: true },
    ],
    [
      { label: "1", color: "blue", action: () => dispatch({ type: "number", value: "1" }) },
      { label: "2", color: "blue", action: () => dispatch({ type: "number", value: "2" }) },
      { label: "3", color: "blue", action: () => dispatch({ type: "number", value: "3" }) },
      { label: "-", color: "green", action: () => dispatch({ type: "operator", value: "-" }) },
      { label: "1/x", color: "green", disabled: true },
    ],
    [
      { label: "0", color: "blue", action: () => dispatch({ type: "number", value: "0" }) },
      { label: ".", color: "blue", disabled: true },
      { label: "+/-", color: "blue", disabled: true },
      { label: "+", color: "green", action: () => dispatch({ type: "operator", value: "+" }) },
      { label: "=", color: "green", action: () => dispatch({ type: "equals" }) },
    ],
  ];

  const buttonColors = {
    blue: "bg-sky-200 hover:bg-sky-300",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-400 hover:bg-red-500",
  };

  return (
    <main className="flex justify-center px-4 py-10">
      <section className="overflow-hidden rounded-t-2xl border-[3px] border-black bg-gray-500 text-center font-bold shadow-lg">
        <div className="rounded-t-xl border-[5px] border-gray-500 bg-gradient-to-br from-white to-gray-300 p-2">
          <output
            aria-live="polite"
            aria-label="เครื่องคิดเลขแสดงผล"
            className="mb-2 flex h-10 items-center justify-end overflow-hidden rounded-lg border border-gray-500 bg-cyan-100 px-2 text-2xl font-normal text-gray-900"
          >
            {formatDisplay(calculator.display)}
          </output>

          <div className="space-y-1">
            {rows.map((row, rowIndex) => (
              <div className="flex gap-1" key={rowIndex}>
                {row.map((button, buttonIndex) => {
                  const colorClass = buttonColors[button.color];

                  return (
                    <button
                      key={`${rowIndex}-${buttonIndex}`}
                      type="button"
                      disabled={button.disabled}
                      onClick={button.action}
                      className={`h-10 w-10 rounded-md border border-black/20 text-base font-bold text-gray-950 disabled:cursor-not-allowed disabled:opacity-60 ${colorClass}`}
                    >
                      {button.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="px-3 py-2 font-mono text-sm text-gray-200">
          680844 ชลันธร ชูแก้ว
        </p>
      </section>
    </main>
  );
}