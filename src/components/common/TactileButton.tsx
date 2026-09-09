import React from 'react';
import { audioEngine } from '../../services/audioEngine';

export type ButtonVariant = 'amber' | 'cyan' | 'magenta' | 'cream' | 'green' | 'neutral';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly isPressed?: boolean;
  readonly fullWidth?: boolean;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly playSoundOnClick?: boolean;
  readonly children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; shadow: string }> = {
  amber: {
    bg: 'bg-arcade-amber hover:bg-yellow-400',
    text: 'text-arcade-chassis',
    shadow: 'shadow-keycap-amber',
  },
  cyan: {
    bg: 'bg-arcade-cyan hover:bg-teal-300',
    text: 'text-arcade-chassis',
    shadow: 'shadow-keycap-cyan',
  },
  magenta: {
    bg: 'bg-arcade-magenta hover:bg-pink-500',
    text: 'text-white',
    shadow: 'shadow-keycap-magenta',
  },
  cream: {
    bg: 'bg-arcade-cream hover:bg-white',
    text: 'text-arcade-chassis',
    shadow: 'shadow-keycap-cream',
  },
  green: {
    bg: 'bg-arcade-green hover:bg-emerald-400',
    text: 'text-arcade-chassis',
    shadow: 'shadow-keycap-cyan',
  },
  neutral: {
    bg: 'bg-arcade-groove hover:bg-arcade-border',
    text: 'text-arcade-cream',
    shadow: 'shadow-keycap-neutral',
  },
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
  md: 'px-5 py-2.5 text-base font-bold rounded-xl',
  lg: 'px-6 py-3.5 text-lg font-extrabold rounded-2xl',
  xl: 'px-8 py-4 text-xl font-extrabold rounded-2xl tracking-wide',
};

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'amber',
  isPressed = false,
  fullWidth = false,
  size = 'md',
  playSoundOnClick = true,
  className = '',
  onClick,
  disabled,
  children,
  ...rest
}) => {
  const styles = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (playSoundOnClick) {
      audioEngine.playKeyClick();
    }
    onClick?.(e);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center font-display transition-all duration-75
        ${styles.bg} ${styles.text} ${styles.shadow} ${sizeStyle}
        ${fullWidth ? 'w-full' : ''}
        ${isPressed ? 'translate-y-1.5 shadow-none' : 'active:translate-y-1.5 active:shadow-none'}
        ${disabled ? 'opacity-40 cursor-not-allowed filter grayscale translate-y-0 shadow-none' : 'cursor-pointer'}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};
