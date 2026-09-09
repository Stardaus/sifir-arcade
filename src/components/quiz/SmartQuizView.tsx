import React, { useState } from 'react';
import { Sparkles, Grid, Keyboard, Volume2, Target } from 'lucide-react';
import { MasteryMap, QuestionItem, SifirFactor } from '../../types/sifir';
import { generateSmartQuestion } from '../../services/masteryEngine';
import { audioEngine } from '../../services/audioEngine';
import { voiceEngine } from '../../services/voiceEngine';
import { TactileNumpad } from '../common/TactileNumpad';
import { TactileButton } from '../common/TactileButton';
import { FriendlyDeconstructionModal } from './FriendlyDeconstructionModal';
import { ReactiveMascot, MascotMood } from '../common/ReactiveMascot';

interface SmartQuizViewProps {
  readonly masteryMap: MasteryMap;
  readonly totalQuestions?: number;
  readonly onFinishQuiz: (
    total: number,
    correct: number,
    stars: number,
    maxStreak: number
  ) => void;
  readonly onRecordAnswer: (
    factorA: SifirFactor,
    factorB: SifirFactor,
    isCorrect: boolean,
    latencyMs: number
  ) => void;
}

export const SmartQuizView: React.FC<SmartQuizViewProps> = ({
  masteryMap,
  totalQuestions = 15,
  onFinishQuiz,
  onRecordAnswer,
}) => {
  const [questionsQueue, setQuestionsQueue] = useState<QuestionItem[]>(() => [
    generateSmartQuestion(masteryMap),
  ]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [inputMode, setInputMode] = useState<'numpad' | 'choice'>('numpad');
  const [inputVal, setInputVal] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [startTime, setStartTime] = useState<number>(Date.now());

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  const [deconstructTarget, setDeconstructTarget] = useState<QuestionItem | null>(null);

  const currentQuestion = questionsQueue[currentIdx] || generateSmartQuestion(masteryMap);

  const proceedToNext = () => {
    if (currentIdx + 1 < totalQuestions || currentIdx + 1 < questionsQueue.length) {
      if (currentIdx + 1 >= questionsQueue.length) {
        setQuestionsQueue((prev) => [...prev, generateSmartQuestion(masteryMap)]);
      }
      setCurrentIdx((prev) => prev + 1);
      setInputVal('');
      setFeedback('idle');
      setStartTime(Date.now());
    } else {
      audioEngine.playFanfare();
      onFinishQuiz(totalQuestions, correctCount, starsEarned, maxStreak);
    }
  };

  const handleEvaluate = (answer: number) => {
    if (feedback !== 'idle') return;

    const latency = Date.now() - startTime;
    const isCorrect = answer === currentQuestion.product;

    onRecordAnswer(currentQuestion.factorA, currentQuestion.factorB, isCorrect, latency);

    if (isCorrect) {
      setFeedback('correct');
      audioEngine.playCorrectChime();

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const bonus = newStreak >= 5 ? 2 : 1;
      setStarsEarned((s) => s + bonus);
      setCorrectCount((c) => c + 1);

      setTimeout(proceedToNext, 500);
    } else {
      setFeedback('wrong');
      audioEngine.playErrorBoop();
      setStreak(0);

      // Mastery Re-queue: push missed question to the back of the queue
      setQuestionsQueue((prev) => [...prev, { ...currentQuestion }]);
      setDeconstructTarget(currentQuestion);
    }
  };

  const handleAcknowledgeDeconstruct = () => {
    setDeconstructTarget(null);
    proceedToNext();
  };

  const handleSpeak = () => {
    voiceEngine.speakEquation(currentQuestion.factorA, currentQuestion.factorB);
  };

  const mascotMood: MascotMood =
    feedback === 'wrong'
      ? 'wrong'
      : streak >= 5
      ? 'overdrive'
      : streak >= 2
      ? 'streak'
      : 'idle';

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      {/* Top HUD Stats */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 bg-arcade-surface border border-arcade-border rounded-2xl">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-arcade-cream/60">Question:</span>
          <span className="text-arcade-amber font-bold">
            {Math.min(currentIdx + 1, totalQuestions)} / {totalQuestions}
          </span>
        </div>

        {/* Streak & Multiplier */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-arcade-magenta/15 border border-arcade-magenta/40 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-arcade-magenta" />
          <span className="font-display font-black text-arcade-magenta text-xs sm:text-sm">
            {streak > 1 ? `${streak}x COMBO!` : `Streak: ${streak}`}
          </span>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex bg-arcade-chassis p-1 rounded-xl border border-arcade-border">
          <button
            type="button"
            onClick={() => setInputMode('numpad')}
            className={`p-1.5 rounded-lg transition ${
              inputMode === 'numpad' ? 'bg-arcade-cyan text-arcade-chassis' : 'text-arcade-cream/60'
            }`}
            title="Numpad Mode"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setInputMode('choice')}
            className={`p-1.5 rounded-lg transition ${
              inputMode === 'choice' ? 'bg-arcade-cyan text-arcade-chassis' : 'text-arcade-cream/60'
            }`}
            title="Multiple Choice Mode"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reactive Pilot Mascot Bar */}
      <div className="flex items-center justify-center">
        <ReactiveMascot mood={mascotMood} streak={streak} />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-arcade-groove h-2 rounded-full overflow-hidden border border-arcade-border p-0.5">
        <div
          className="h-full bg-gradient-to-r from-arcade-amber to-arcade-magenta rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, ((currentIdx) / totalQuestions) * 100)}%` }}
        />
      </div>

      {/* Question CRT Box with Target Lock Diagnostic Telemetry */}
      <div
        className={`p-4 sm:p-6 bg-arcade-surface border-2 rounded-2xl sm:rounded-3xl text-center relative transition shadow-arcade-md ${
          feedback === 'correct'
            ? 'border-arcade-green bg-arcade-green/10'
            : feedback === 'wrong'
            ? 'border-arcade-magenta bg-arcade-magenta/10 animate-shake'
            : 'border-arcade-border'
        }`}
      >
        {/* Target Lock Telemetry Badge */}
        {currentQuestion.diagnosticReason && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 mb-2 sm:mb-3 rounded-full bg-arcade-amber/15 border border-arcade-amber/40 text-arcade-amber font-mono text-[10px] sm:text-xs font-bold">
            <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
            TARGET LOCK: {currentQuestion.diagnosticReason}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <div className="font-display font-black text-4xl sm:text-6xl text-arcade-cream tracking-wider font-mono">
            {currentQuestion.factorA} × {currentQuestion.factorB} ={' '}
            <span className="text-arcade-cyan">
              {inputMode === 'numpad' ? (inputVal || '?') : '?'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSpeak}
            className="p-2 bg-arcade-groove hover:bg-arcade-border text-arcade-cyan rounded-xl transition cursor-pointer"
            title="Listen to Equation"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Input Stage: Numpad or Multiple Choice */}
      <div className="pb-safe">
        {inputMode === 'numpad' ? (
          <TactileNumpad
            currentInput={inputVal}
            isDisabled={feedback !== 'idle'}
            onDigitPress={(d) => setInputVal((prev) => prev + d)}
            onBackspacePress={() => setInputVal((prev) => prev.slice(0, -1))}
            onSubmitPress={() => handleEvaluate(parseInt(inputVal, 10))}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-sm mx-auto">
            {currentQuestion.options.map((opt) => (
              <TactileButton
                key={opt}
                variant="cream"
                size="lg"
                disabled={feedback !== 'idle'}
                onClick={() => handleEvaluate(opt)}
                className="h-13 sm:h-16 text-xl sm:text-2xl font-mono touch-manipulation"
              >
                {opt}
              </TactileButton>
            ))}
          </div>
        )}
      </div>

      {/* Friendly Deconstruction Remediation Modal */}
      {deconstructTarget && (
        <FriendlyDeconstructionModal
          isOpen={true}
          factorA={deconstructTarget.factorA}
          factorB={deconstructTarget.factorB}
          onAcknowledge={handleAcknowledgeDeconstruct}
        />
      )}
    </div>
  );
};
