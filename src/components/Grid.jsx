import '../Grid.css'
import { useState, useEffect } from 'react'

const Grid = ({ grid }) => {
  // Helper to render a single tile
  function renderTile(cell, idx) {
    const shouldFlip = cell.status !== 'pending';
    return (
      <div className={`letter-container`} key={idx}>
        <div className={`letter-background ${cell.status} ${shouldFlip ? 'flipped' : ''}`}></div>
        <div className={`letter ${shouldFlip ? 'flipped-letter' : ''}`}>{cell.letter}</div>
      </div>
    );
  }

  // Helper to render a row
  function renderRow(row, rowIdx) {
    return (
      <div className="word" key={rowIdx}>
        {row.map((cell, idx) => renderTile(cell, idx))}
      </div>
    );
  }

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => renderRow(row, rowIdx))}
    </div>
  );
}

export default Grid
