import React, { useEffect } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { TactileButton } from './TactileButton';

interface TactileNumpadProps {
  readonly currentInput: string;
  readonly maxDigits?: number;
  readonly isDisabled?: boolean;
  readonly className?: string;
  readonly onDigitPress: (digit: string) => void;
  readonly onBackspacePress: () => void;
  readonly onSubmitPress: () => void;
}

export const TactileNumpad: React.FC<TactileNumpadProps> = ({
  currentInput,
  maxDigits = 3,
  isDisabled = false,
  className = '',
  onDigitPress,
  onBackspacePress,
  onSubmitPress,
}) => {
  // Keyboard event handler for physical keyboard users
  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (currentInput.length < maxDigits) {
          onDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onBackspacePress();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentInput.length > 0) {
          onSubmitPress();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, currentInput, maxDigits, onDigitPress, onBackspacePress, onSubmitPress]);

  const handleDigit = (digit: string) => {
    if (currentInput.length < maxDigits) {
      onDigitPress(digit);
    }
  };

  return (
    <div
      className={`w-full max-w-xs mx-auto p-3 sm:p-4 bg-arcade-surface border-2 border-arcade-border rounded-3xl shadow-arcade-md select-none touch-manipulation ${className}`}
    >
      {/* Digit Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <TactileButton
            key={digit}
            variant="cream"
            size="lg"
            disabled={isDisabled}
            onClick={() => handleDigit(digit)}
            className="h-13 sm:h-15 md:h-16 text-xl sm:text-2xl font-mono touch-manipulation"
          >
            {digit}
          </TactileButton>
        ))}

        {/* Backspace */}
        <TactileButton
          variant="magenta"
          size="lg"
          disabled={isDisabled || currentInput.length === 0}
          onClick={onBackspacePress}
          className="h-13 sm:h-15 md:h-16 text-xl touch-manipulation"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
        </TactileButton>

        {/* Zero */}
        <TactileButton
          variant="cream"
          size="lg"
          disabled={isDisabled}
          onClick={() => handleDigit('0')}
          className="h-13 sm:h-15 md:h-16 text-xl sm:text-2xl font-mono touch-manipulation"
        >
          0
        </TactileButton>

        {/* Submit Enter with Pulsing Neon Guide */}
        <TactileButton
          variant="green"
          size="lg"
          disabled={isDisabled || currentInput.length === 0}
          onClick={onSubmitPress}
          className={`h-13 sm:h-15 md:h-16 text-xl touch-manipulation transition-all duration-200 ${
            currentInput.length > 0
              ? 'ring-2 ring-arcade-green shadow-keycap-green animate-pulse scale-[1.02]'
              : 'opacity-60'
          }`}
          aria-label="Submit Answer"
        >
          <CornerDownLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
        </TactileButton>
      </div>
    </div>
  );
};
