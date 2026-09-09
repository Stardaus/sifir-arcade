import React, { useState } from 'react';
import { MasteryMap, SifirFactor } from '../../types/sifir';
import { GemArrayVisualizer } from './GemArrayVisualizer';
import { audioEngine } from '../../services/audioEngine';

interface MatrixGrid12x12Props {
  readonly masteryMap: MasteryMap;
  readonly onLaunchPractice?: (table: SifirFactor) => void;
}

type PatternType = 'ALL' | 'SQUARES' | 'COMMUTATIVE' | 'EVENS';

const FACTORS: readonly SifirFactor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const PATTERN_BUTTONS: readonly { id: PatternType; label: string; icon: string }[] = [
  { id: 'ALL', label: 'All Facts', icon: '✨' },
  { id: 'SQUARES', label: 'Square Numbers', icon: '⬛' },
  { id: 'COMMUTATIVE', label: 'Commutative Mirror', icon: '🔄' },
  { id: 'EVENS', label: 'Even Parity', icon: '⚡' },
];

function isCellMatchedByPattern(
  row: number,
  col: number,
  pattern: PatternType,
  hoverCell: { row: number; col: number } | null
): boolean {
  if (pattern === 'SQUARES') return row === col;
  if (pattern === 'EVENS') return (row * col) % 2 === 0;
  if (pattern === 'COMMUTATIVE') {
    if (!hoverCell) return row === col;
    return (row === hoverCell.row && col === hoverCell.col) ||
           (row === hoverCell.col && col === hoverCell.row);
  }
  return true;
}

function getCellStyling(
  status: string,
  isAreaMember: boolean,
  isPatternMatched: boolean,
  isPatternActive: boolean
): string {
  if (isAreaMember) {
    return 'bg-arcade-cyan/40 text-arcade-cyan border-arcade-cyan ring-1 ring-arcade-cyan/80 scale-[1.03] z-10';
  }
  if (isPatternActive && isPatternMatched) {
    return 'bg-arcade-amber/35 text-arcade-amber border-arcade-amber ring-1 ring-arcade-amber/60 font-black';
  }
  if (isPatternActive && !isPatternMatched) {
    return 'bg-arcade-surface/30 text-arcade-cream/20 border-arcade-border/20 opacity-40';
  }

  switch (status) {
    case 'MASTERED':
      return 'bg-arcade-green/25 text-arcade-green border-arcade-green/50 hover:bg-arcade-green/40';
    case 'PRACTICING':
      return 'bg-arcade-cyan/20 text-arcade-cyan border-arcade-cyan/40 hover:bg-arcade-cyan/35';
    case 'LEARNING':
      return 'bg-arcade-amber/20 text-arcade-amber border-arcade-amber/40 hover:bg-arcade-amber/35';
    default:
      return 'bg-arcade-groove/40 text-arcade-cream/50 border-arcade-border/40 hover:bg-arcade-groove';
  }
}

export const MatrixGrid12x12: React.FC<MatrixGrid12x12Props> = ({
  masteryMap,
  onLaunchPractice,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ a: SifirFactor; b: SifirFactor } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [activePattern, setActivePattern] = useState<PatternType>('ALL');

  const handleCellClick = (a: SifirFactor, b: SifirFactor) => {
    audioEngine.playKeyClick();
    setSelectedCell({ a, b });
  };

  const handlePatternChange = (pattern: PatternType) => {
    audioEngine.playKeyClick();
    setActivePattern(pattern);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Pattern Scanner Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-arcade-surface rounded-2xl border-2 border-arcade-border shadow-arcade-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-arcade-cyan uppercase tracking-wider">
            Pattern Scanner:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PATTERN_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => handlePatternChange(btn.id)}
                className={`px-3 py-1 text-xs font-bold font-mono rounded-lg border transition ${
                  activePattern === btn.id
                    ? 'bg-arcade-cyan text-arcade-black border-arcade-cyan shadow-arcade-sm'
                    : 'bg-arcade-groove text-arcade-cream/70 border-arcade-border hover:text-arcade-cream'
                }`}
              >
                <span className="mr-1">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Area Badge */}
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-arcade-chassis border border-arcade-border flex items-center gap-2">
          {hoverCell ? (
            <span className="text-arcade-cyan font-bold">
              📐 Area: {hoverCell.row} × {hoverCell.col} = <span className="text-arcade-amber font-black">{hoverCell.row * hoverCell.col}</span> units²
            </span>
          ) : (
            <span className="text-arcade-cream/50">
              💡 Hover cell to measure Area Canvas
            </span>
          )}
        </div>
      </div>

      {/* 12x12 Grid Free-Pan Canvas Container */}
      <div
        className="p-2 sm:p-5 bg-arcade-surface border-2 border-arcade-border rounded-2xl sm:rounded-3xl overflow-auto max-h-[70vh] sm:max-h-none shadow-arcade-lg touch-pan-x touch-pan-y"
        onMouseLeave={() => setHoverCell(null)}
      >
        <div className="min-w-[560px] sm:min-w-[620px] select-none">
          {/* Header Row (Sticky Top) */}
          <div className="grid grid-cols-[36px_repeat(12,1fr)] sm:grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1 text-center font-mono font-bold text-xs sticky top-0 z-30 bg-arcade-surface/95 backdrop-blur-sm py-1">
            {/* Frozen Top-Left Corner */}
            <div className="p-1.5 bg-arcade-chassis/95 rounded-lg text-arcade-amber border border-arcade-border/60 sticky left-0 z-40 shadow-sm">
              ×
            </div>
            {FACTORS.map((col) => (
              <div
                key={col}
                className="p-1.5 bg-arcade-groove/90 rounded-lg text-arcade-amber border border-arcade-border/40 cursor-pointer hover:bg-arcade-amber/20"
                onClick={() => onLaunchPractice?.(col)}
                title={`Practice Sifir ${col}`}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {FACTORS.map((row) => (
            <div
              key={row}
              className="grid grid-cols-[36px_repeat(12,1fr)] sm:grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1 text-center font-mono"
            >
              {/* Frozen Row Header (Sticky Left) */}
              <div
                className="p-1.5 flex items-center justify-center bg-arcade-chassis/95 rounded-lg text-arcade-amber font-bold text-xs border border-arcade-border/60 cursor-pointer hover:bg-arcade-amber/20 sticky left-0 z-20 shadow-sm"
                onClick={() => onLaunchPractice?.(row)}
                title={`Practice Sifir ${row}`}
              >
                {row}
              </div>

              {FACTORS.map((col) => {
                const key = `${row}x${col}`;
                const fact = masteryMap[key];
                const status = fact?.status || 'UNTOUCHED';
                const isAreaMember = Boolean(hoverCell && row <= hoverCell.row && col <= hoverCell.col);
                const isPatternMatched = isCellMatchedByPattern(row, col, activePattern, hoverCell);
                const styleClass = getCellStyling(
                  status,
                  isAreaMember,
                  isPatternMatched,
                  activePattern !== 'ALL'
                );

                return (
                  <button
                    key={col}
                    type="button"
                    onMouseEnter={() => setHoverCell({ row, col })}
                    onTouchStart={() => setHoverCell({ row, col })}
                    onClick={() => handleCellClick(row, col)}
                    className={`h-8 sm:h-9 flex items-center justify-center rounded-lg border text-xs font-bold transition duration-150 transform active:scale-95 cursor-pointer touch-manipulation ${styleClass}`}
                    title={`${row} × ${col} = ${row * col} (${status})`}
                  >
                    {row * col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Visual Array Inspector Modal */}
      {selectedCell && (
        <GemArrayVisualizer
          isOpen={true}
          factorA={selectedCell.a}
          factorB={selectedCell.b}
          onClose={() => setSelectedCell(null)}
          onLaunchDrill={(table) => onLaunchPractice?.(table)}
        />
      )}
    </div>
  );
};
