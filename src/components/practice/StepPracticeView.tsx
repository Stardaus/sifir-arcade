import React, { useState, useEffect } from 'react';
import { Volume2, HelpCircle } from 'lucide-react';
import { SifirFactor } from '../../types/sifir';
import { audioEngine } from '../../services/audioEngine';
import { voiceEngine } from '../../services/voiceEngine';
import { TactileNumpad } from '../common/TactileNumpad';
import { GemArrayVisualizer } from '../explore/GemArrayVisualizer';
import { CartoonEqualGroups } from './CartoonEqualGroups';
import { SkipCountingStrip } from './SkipCountingStrip';
import { ReactiveMascot } from '../common/ReactiveMascot';
import { CargoBayDrawer } from './CargoBayDrawer';
import { PracticeHudRibbon } from './PracticeHudRibbon';

interface StepPracticeViewProps {
  readonly targetTable: SifirFactor;
  readonly onTableChange: (table: SifirFactor) => void;
  readonly onCompleteTable: (table: SifirFactor, starsEarned: number) => void;
  readonly onRecordAnswer: (factorA: SifirFactor, factorB: SifirFactor, isCorrect: boolean, latencyMs: number) => void;
}

export const StepPracticeView: React.FC<StepPracticeViewProps> = ({
  targetTable,
  onTableChange,
  onCompleteTable,
  onRecordAnswer,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [inputVal, setInputVal] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [starsThisSession, setStarsThisSession] = useState<number>(0);
  const [isCargoBayOpen, setIsCargoBayOpen] = useState<boolean>(false);
  const [isTrackVisible, setIsTrackVisible] = useState<boolean>(true);

  const factorA = currentStep as SifirFactor;
  const factorB = targetTable;
  const expectedProduct = factorA * factorB;

  useEffect(() => {
    setCurrentStep(1);
    setInputVal('');
    setFeedback('idle');
    setStepStartTime(Date.now());
    setStarsThisSession(0);
  }, [targetTable]);

  const handleSubmit = () => {
    if (!inputVal || feedback !== 'idle') return;

    const userNumber = parseInt(inputVal, 10);
    const latency = Date.now() - stepStartTime;
    const isCorrect = userNumber === expectedProduct;

    onRecordAnswer(factorA, factorB, isCorrect, latency);

    if (isCorrect) {
      setFeedback('correct');
      audioEngine.playCorrectChime();
      setStarsThisSession((s) => s + 1);

      setTimeout(() => {
        if (currentStep < 12) {
          setCurrentStep((prev) => prev + 1);
          setInputVal('');
          setFeedback('idle');
          setStepStartTime(Date.now());
        } else {
          audioEngine.playFanfare();
          onCompleteTable(targetTable, starsThisSession + 1);
        }
      }, 500);
    } else {
      setFeedback('wrong');
      audioEngine.playErrorBoop();
      setTimeout(() => {
        setInputVal('');
        setFeedback('idle');
      }, 650);
    }
  };

  const handleSpeak = () => {
    voiceEngine.speakEquation(factorA, factorB);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">
      {/* Table Selector Pills Header */}
      <div className="p-2.5 sm:p-3 bg-arcade-surface border-2 border-arcade-border rounded-2xl flex items-center justify-between gap-2 shadow-arcade-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-arcade-amber whitespace-nowrap">
          Sifir:
        </span>
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as SifirFactor[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTableChange(t)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition cursor-pointer flex-shrink-0 ${
                targetTable === t
                  ? 'bg-arcade-amber text-arcade-chassis shadow-keycap-amber scale-105'
                  : 'bg-arcade-groove text-arcade-cream/70 hover:text-arcade-cream'
              }`}
            >
              ×{t}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-arcade-cyan font-bold whitespace-nowrap">
          {currentStep}/12
        </span>
      </div>

      {/* Mobile-Only HUD Ribbon & Track */}
      <div className="lg:hidden space-y-2">
        <PracticeHudRibbon
          factorA={factorA}
          factorB={factorB}
          isTrackVisible={isTrackVisible}
          onToggleTrack={() => setIsTrackVisible((prev) => !prev)}
          onOpenCargoBay={() => setIsCargoBayOpen(true)}
        />
        {isTrackVisible && (
          <SkipCountingStrip
            targetTable={targetTable}
            currentStep={currentStep}
            onStepSelect={setCurrentStep}
          />
        )}
      </div>

      {/* Main Responsive Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Desktop Left Flight Models Pane */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-3">
          <SkipCountingStrip
            targetTable={targetTable}
            currentStep={currentStep}
            onStepSelect={setCurrentStep}
          />
          <CartoonEqualGroups factorA={factorA} factorB={factorB} />
        </div>

        {/* Console / Input Section (Mobile Full-Width, Desktop Col-6) */}
        <div className="lg:col-span-6 space-y-2 sm:space-y-3">
          {/* Reactive Pilot Mascot Bar */}
          <div className="flex items-center justify-center">
            <ReactiveMascot
              mood={feedback === 'wrong' ? 'wrong' : currentStep >= 10 ? 'streak' : 'idle'}
              streak={currentStep}
            />
          </div>

          {/* CRT Question Box */}
          <div
            className={`p-3.5 sm:p-5 bg-arcade-surface border-2 rounded-2xl sm:rounded-3xl text-center relative transition shadow-arcade-md ${
              feedback === 'correct'
                ? 'border-arcade-green bg-arcade-green/10'
                : feedback === 'wrong'
                ? 'border-arcade-magenta bg-arcade-magenta/10 animate-shake'
                : 'border-arcade-border'
            }`}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="font-display font-black text-3xl sm:text-5xl text-arcade-cream tracking-wider font-mono">
                {factorA} × {factorB} = <span className="text-arcade-amber">{inputVal || '?'}</span>
              </div>

              <button
                type="button"
                onClick={handleSpeak}
                className="p-1.5 sm:p-2 bg-arcade-groove hover:bg-arcade-border text-arcade-cyan rounded-xl transition cursor-pointer"
                title="Listen to Equation"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowHelper(true)}
                className="text-xs font-bold text-arcade-cyan hover:underline flex items-center gap-1 bg-arcade-groove/80 px-2.5 py-1 rounded-lg border border-arcade-cyan/30 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Gem Hint</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCargoBayOpen(true)}
                className="lg:hidden text-xs font-bold text-arcade-amber hover:underline flex items-center gap-1 bg-arcade-groove/80 px-2.5 py-1 rounded-lg border border-arcade-amber/30 cursor-pointer"
              >
                <span>🛸 Cargo Bay</span>
              </button>
            </div>
          </div>

          {/* Tactile Numpad Console (Thumb Zone Anchor) */}
          <div className="pb-safe">
            <TactileNumpad
              currentInput={inputVal}
              isDisabled={feedback !== 'idle'}
              onDigitPress={(d) => setInputVal((prev) => prev + d)}
              onBackspacePress={() => setInputVal((prev) => prev.slice(0, -1))}
              onSubmitPress={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Cargo Bay Drawer (Mobile On-Demand Inspection) */}
      <CargoBayDrawer
        isOpen={isCargoBayOpen}
        factorA={factorA}
        factorB={factorB}
        onClose={() => setIsCargoBayOpen(false)}
      />

      {/* Visual Array Modal */}
      {showHelper && (
        <GemArrayVisualizer
          isOpen={true}
          factorA={factorA}
          factorB={factorB}
          onClose={() => setShowHelper(false)}
        />
      )}
    </div>
  );
};
