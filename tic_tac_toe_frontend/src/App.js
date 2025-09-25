import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional themed Tic Tac Toe game
 * - Two-player local play
 * - Win/tie detection
 * - Centered board with turn indicator and reset button
 * - Modern, minimalist UI with smooth transitions
 */

// Utility to compute winner and lines
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6]  // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// Square Component
function Square({ value, onClick, highlight, disabled }) {
  return (
    <button
      className={`ttt-square ${highlight ? 'highlight' : ''} ${value ? 'filled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Board square ${value ? 'with ' + value : 'empty'}`}
    >
      {value === 'X' ? (
        <span className="mark mark-x">X</span>
      ) : value === 'O' ? (
        <span className="mark mark-o">O</span>
      ) : null}
    </button>
  );
}

// Board Component
function Board({ squares, onPlay, disabled, winningLine }) {
  const renderSquare = (i) => {
    const isWinning = winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onPlay(i)}
        highlight={isWinning}
        disabled={disabled || Boolean(squares[i])}
      />
    );
  };

  return (
    <div className="board">
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {renderSquare(row * 3 + 0)}
          {renderSquare(row * 3 + 1)}
          {renderSquare(row * 3 + 2)}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This is the main entry for the Tic Tac Toe app.
   * It manages game state, renders the board, and controls interactions.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isBoardFull = useMemo(() => squares.every((s) => s !== null), [squares]);
  const isTie = !winner && isBoardFull;
  const statusText = winner
    ? `Winner: ${winner}`
    : isTie
    ? "It's a tie!"
    : `Turn: ${xIsNext ? 'X' : 'O'}`;

  const nextMark = xIsNext ? 'X' : 'O';

  const handlePlay = (i) => {
    if (winner || squares[i]) return;
    const next = squares.slice();
    next[i] = nextMark;
    setSquares(next);
    setXIsNext((n) => !n);
  };

  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="app-shell">
      <div className="background-accent" />
      <main className="game-container">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className={`status ${winner ? 'status-win' : isTie ? 'status-tie' : ''}`}>
            {statusText}
          </p>
        </header>

        <section className={`board-card ${winner ? 'finished' : ''}`}>
          <div className="turn-indicator" aria-live="polite">
            <span className={`pill ${xIsNext ? 'active' : ''}`}>
              X
            </span>
            <span className={`pill ${!xIsNext ? 'active' : ''}`}>
              O
            </span>
          </div>

          <Board
            squares={squares}
            onPlay={handlePlay}
            disabled={Boolean(winner)}
            winningLine={line}
          />

          <div className="controls">
            <button className="btn reset-btn" onClick={reset} aria-label="Reset game">
              Reset Game
            </button>
          </div>
        </section>

        <footer className="footer">
          <small className="hint">
            Tip: Click an empty square to place your mark. First to align three wins.
          </small>
        </footer>
      </main>
    </div>
  );
}
