import React, { useState, useEffect, useRef } from 'react';
import { Flame, Trophy, Zap } from 'lucide-react';
import { MasteryMap, QuestionItem, SifirFactor } from '../../types/sifir';
import { generateSmartQuestion } from '../../services/masteryEngine';
import { audioEngine } from '../../services/audioEngine';
import { TactileNumpad } from '../common/TactileNumpad';
import { ReactiveMascot, MascotMood } from '../common/ReactiveMascot';

interface SpeedRushViewProps {
  readonly masteryMap: MasteryMap;
  readonly personalBest: number;
  readonly onFinishSpeedRush: (score: number, starsEarned: number, correctCount: number) => void;
  readonly onRecordAnswer: (factorA: SifirFactor, factorB: SifirFactor, isCorrect: boolean, latencyMs: number) => void;
}

const getMultiplier = (currentStreak: number): number => {
  if (currentStreak >= 10) return 10;
  if (currentStreak >= 5) return 5;
  if (currentStreak >= 3) return 2;
  return 1;
};

export const SpeedRushView: React.FC<SpeedRushViewProps> = ({
  masteryMap,
  personalBest,
  onFinishSpeedRush,
  onRecordAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem>(() =>
    generateSmartQuestion(masteryMap)
  );
  const [inputVal, setInputVal] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showTimeSurge, setShowTimeSurge] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const isOverdrive = streak >= 5;

  // Timer loop
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle game over
  useEffect(() => {
    if (timeLeft === 0) {
      audioEngine.playFanfare();
      const starsEarned = Math.floor(score / 500) + Math.floor(correctCount / 5);
      onFinishSpeedRush(score, Math.max(1, starsEarned), correctCount);
    }
  }, [timeLeft, score, correctCount, onFinishSpeedRush]);

  const handleCorrectAnswer = (newStreak: number, latency: number) => {
    setFeedback('correct');
    const isRapid = latency <= 1200;

    if (newStreak === 5) {
      audioEngine.playOverdriveActivation();
    } else if (isRapid) {
      audioEngine.playTimeSurgeChime();
    } else {
      audioEngine.playCorrectChime();
    }

    if (isRapid) {
      setTimeLeft((prev) => Math.min(75, prev + 2));
      setShowTimeSurge(true);
      setTimeout(() => setShowTimeSurge(false), 900);
    }

    const mult = getMultiplier(newStreak);
    const points = 100 * mult;

    setScore((s) => s + points);
    setStreak(newStreak);
    setCorrectCount((c) => c + 1);

    setTimeout(() => {
      setCurrentQuestion(generateSmartQuestion(masteryMap));
      setInputVal('');
      setFeedback('idle');
      setStartTime(Date.now());
    }, 320);
  };

  const handleEvaluate = () => {
    if (!inputVal || feedback !== 'idle' || timeLeft === 0) return;

    const answer = parseInt(inputVal, 10);
    const latency = Date.now() - startTime;
    const isCorrect = answer === currentQuestion.product;

    onRecordAnswer(currentQuestion.factorA, currentQuestion.factorB, isCorrect, latency);

    if (isCorrect) {
      handleCorrectAnswer(streak + 1, latency);
    } else {
      setFeedback('wrong');
      audioEngine.playErrorBoop();
      setStreak(0);

      setTimeout(() => {
        setInputVal('');
        setFeedback('idle');
      }, 450);
    }
  };

  const multiplier = getMultiplier(streak);

  const mascotMood: MascotMood =
    feedback === 'wrong'
      ? 'wrong'
      : isOverdrive
      ? 'overdrive'
      : streak >= 3
      ? 'streak'
      : 'idle';

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      {/* Overdrive Fever Banner */}
      {isOverdrive && (
        <div className="p-2 bg-gradient-to-r from-arcade-magenta via-arcade-cyan to-arcade-magenta text-arcade-black text-center font-display font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl animate-pulse shadow-arcade-sm">
          ⚡ ARCADE OVERDRIVE ACTIVE • {multiplier}X SCORE MULTIPLIER ⚡
        </div>
      )}

      {/* HUD Bar */}
      <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-3 bg-arcade-surface border border-arcade-border rounded-2xl text-center">
        {/* Time */}
        <div className="p-2 bg-arcade-chassis rounded-xl border border-arcade-border relative overflow-hidden">
          <div className="text-xs text-arcade-cream/60 font-bold uppercase">Time Left</div>
          <div className={`font-display font-black text-2xl font-mono ${timeLeft <= 10 ? 'text-arcade-magenta animate-pulse' : 'text-arcade-cyan'}`}>
            {timeLeft}s
          </div>
          {showTimeSurge && (
            <div className="absolute inset-0 bg-arcade-green/90 text-arcade-black font-black flex items-center justify-center text-xs uppercase animate-bounce">
              +2s SURGE!
            </div>
          )}
        </div>

        {/* Score */}
        <div className="p-2 bg-arcade-chassis rounded-xl border border-arcade-border">
          <div className="text-xs text-arcade-cream/60 font-bold uppercase">Score</div>
          <div className="font-display font-black text-2xl text-arcade-amber font-mono">
            {score}
          </div>
        </div>

        {/* Combo */}
        <div className="p-2 bg-arcade-chassis rounded-xl border border-arcade-border">
          <div className="text-xs text-arcade-cream/60 font-bold uppercase">Combo</div>
          <div className="flex items-center justify-center gap-1 font-display font-black text-2xl text-arcade-magenta">
            <Flame className="w-5 h-5 fill-arcade-magenta" />
            <span>{multiplier}x</span>
          </div>
        </div>
      </div>

      {/* Reactive Pilot Mascot */}
      <div className="flex items-center justify-center">
        <ReactiveMascot mood={mascotMood} streak={streak} />
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-arcade-groove h-2.5 rounded-full overflow-hidden border border-arcade-border p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverdrive
              ? 'bg-gradient-to-r from-arcade-magenta via-arcade-cyan to-arcade-green'
              : timeLeft <= 10
              ? 'bg-arcade-magenta'
              : 'bg-arcade-cyan'
          }`}
          style={{ width: `${Math.min(100, (timeLeft / 60) * 100)}%` }}
        />
      </div>

      {/* Question CRT Box */}
      <div
        className={`p-4 sm:p-6 bg-arcade-surface border-2 rounded-2xl sm:rounded-3xl text-center relative transition shadow-arcade-md ${
          isOverdrive ? 'border-arcade-magenta ring-2 ring-arcade-magenta/60 shadow-arcade-lg' : 'border-arcade-border'
        } ${
          feedback === 'correct'
            ? 'border-arcade-green bg-arcade-green/10'
            : feedback === 'wrong'
            ? 'border-arcade-magenta bg-arcade-magenta/10'
            : ''
        }`}
      >
        <div className="font-display font-black text-5xl sm:text-6xl text-arcade-cream tracking-wider font-mono">
          {currentQuestion.factorA} × {currentQuestion.factorB} ={' '}
          <span className={isOverdrive ? 'text-arcade-magenta' : 'text-arcade-amber'}>
            {inputVal || '?'}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-arcade-cream/50">
          {personalBest > 0 && (
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-arcade-amber" />
              PB: {personalBest} pts
            </span>
          )}
          <span className="flex items-center gap-1 text-arcade-cyan">
            <Zap className="w-3 h-3 text-arcade-cyan" />
            Sub-1.2s = +2s Surge
          </span>
        </div>
      </div>

      {/* Tactile Numpad with Safe Area */}
      <div className="pb-safe">
        <TactileNumpad
          currentInput={inputVal}
          isDisabled={feedback !== 'idle' || timeLeft === 0}
          onDigitPress={(d) => setInputVal((prev) => prev + d)}
          onBackspacePress={() => setInputVal((prev) => prev.slice(0, -1))}
          onSubmitPress={handleEvaluate}
        />
      </div>
    </div>
  );
};

