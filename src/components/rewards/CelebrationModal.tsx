import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { QuizResultSummary } from '../../types/sifir';
import { Modal } from '../common/Modal';
import { TactileButton } from '../common/TactileButton';

interface CelebrationModalProps {
  readonly summary: QuizResultSummary | null;
  readonly onClose: () => void;
  readonly onPlayAgain: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  summary,
  onClose,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (summary && summary.starsEarned > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F5D4', '#FFB703', '#F72585', '#06D6A0'],
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [summary]);

  if (!summary) return null;

  const modeTitle =
    summary.mode === 'STEP_PRACTICE'
      ? `Sifir ${summary.targetTable} Completed!`
      : summary.mode === 'SPEED_RUSH'
      ? 'Speed Rush Challenge Over!'
      : 'Smart Quiz Finished!';

  return (
    <Modal isOpen={true} onClose={onClose} title={modeTitle} maxWidth="md">
      <div className="text-center space-y-5 py-2">
        {/* Animated Trophy Banner */}
        <div className="inline-flex p-4 bg-arcade-amber/20 rounded-3xl border-2 border-arcade-amber/50 animate-bounce">
          <Trophy className="w-12 h-12 text-arcade-amber" />
        </div>

        {/* Stars Earned */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-arcade-cream/60">
            Reward Earned
          </span>
          <div className="flex items-center justify-center gap-2 text-3xl font-display font-black text-arcade-amber">
            <span>+{summary.starsEarned}</span>
            <Star className="w-8 h-8 fill-arcade-amber text-arcade-amber" />
          </div>
        </div>

        {/* Accuracy & Metrics */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-arcade-chassis rounded-2xl border border-arcade-border text-center font-mono">
          <div>
            <span className="text-xs text-arcade-cream/60">Correct Answers</span>
            <div className="text-lg font-bold text-arcade-cyan">
              {summary.correctAnswers} / {summary.totalQuestions}
            </div>
          </div>
          <div>
            <span className="text-xs text-arcade-cream/60">Accuracy</span>
            <div className="text-lg font-bold text-arcade-green">
              {summary.accuracyPercent}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <TactileButton variant="neutral" size="md" fullWidth onClick={onClose}>
            Cabin Home
          </TactileButton>
          <TactileButton
            variant="green"
            size="md"
            fullWidth
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2"
          >
            <span>Play Again</span>
            <ArrowRight className="w-4 h-4" />
          </TactileButton>
        </div>
      </div>
    </Modal>
  );
};
