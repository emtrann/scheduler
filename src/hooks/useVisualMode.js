import React, { useState } from 'react';

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setMode(newMode)
    } else {
      setHistory([...history, newMode])
      setMode(newMode)
    }
  }

  function back() {
    if (history.length <= 1) {
      setMode(initial);
    } else {
      setHistory(history.slice(0, history.length - 1));
      setMode(history[history.length - 2])
    }
  }

  return { mode, transition, back };
}
