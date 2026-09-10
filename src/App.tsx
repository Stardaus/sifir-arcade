import React, { useState, useEffect, useCallback } from 'react';
import { LearnerProfile, createDefaultProfile } from './types/profile';
import { ActiveScreen, MasteryMap, QuizResultSummary, SifirFactor } from './types/sifir';
import { storageService } from './services/storageService';
import { updateFactRecord } from './services/masteryEngine';
import { audioEngine } from './services/audioEngine';
import { voiceEngine } from './services/voiceEngine';

import { ArcadeHeader } from './components/common/ArcadeHeader';
import { ArcadeSettingsModal } from './components/common/ArcadeSettingsModal';
import { ProfilePickerModal } from './components/profile/ProfilePickerModal';
import { CabinHomeView } from './components/home/CabinHomeView';
import { MatrixGrid12x12 } from './components/explore/MatrixGrid12x12';
import { StepPracticeView } from './components/practice/StepPracticeView';
import { SmartQuizView } from './components/quiz/SmartQuizView';
import { SpeedRushView } from './components/speed/SpeedRushView';
import { ParentHeatmapView } from './components/parent/ParentHeatmapView';
import { CelebrationModal } from './components/rewards/CelebrationModal';
import { pwaUpdateService } from './services/pwaUpdateService';
import { PwaUpdateBanner } from './components/common/PwaUpdateBanner';

export const App: React.FC = () => {
  // 1. Profile State
  const [profiles, setProfiles] = useState<LearnerProfile[]>(() => storageService.getProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => storageService.getActiveProfileId());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Active Profile Object
  const currentProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || createDefaultProfile('Hero', '🦊');

  // 2. Mastery Map State
  const [masteryMap, setMasteryMap] = useState<MasteryMap>(() =>
    storageService.getMasteryMap(currentProfile.id)
  );

  // 3. Navigation & Screen Flow
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('CABIN_HOME');
  const [selectedTable, setSelectedTable] = useState<SifirFactor>(7);

  // 4. Celebration Modal State
  const [celebrationSummary, setCelebrationSummary] = useState<QuizResultSummary | null>(null);

  // 5. PWA Smart Update State
  const [isUpdateReady, setIsUpdateReady] = useState<boolean>(false);

  useEffect(() => {
    pwaUpdateService.init();
    const unsubscribe = pwaUpdateService.subscribe((available) => {
      setIsUpdateReady(available);
      if (available && activeScreen === 'CABIN_HOME') {
        pwaUpdateService.applyUpdate('CABIN_HOME');
      }
    });
    return unsubscribe;
  }, [activeScreen]);

  // Sync audio, voice, haptics, and theme settings to DOM & engines
  useEffect(() => {
    audioEngine.initTouchUnlock();
    audioEngine.setMuted(!currentProfile.soundEnabled);
    audioEngine.setHapticsEnabled(currentProfile.hapticsEnabled ?? true);
    voiceEngine.setEnabled(currentProfile.voiceEnabled);
    voiceEngine.setLang(currentProfile.voiceLang);
    document.documentElement.setAttribute('data-theme', currentProfile.themeId || 'neo-arcade');
  }, [currentProfile]);

  // Handle switching profiles
  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    storageService.setActiveProfileId(id);
    setMasteryMap(storageService.getMasteryMap(id));
  };

  const handleCreateProfile = (name: string, avatar: string) => {
    const newProf = createDefaultProfile(name, avatar);
    const updated = [...profiles, newProf];
    setProfiles(updated);
    storageService.saveProfiles(updated);
    handleSelectProfile(newProf.id);
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    if (updated.length > 0) {
      setProfiles(updated);
      storageService.saveProfiles(updated);
      if (activeProfileId === id) {
        handleSelectProfile(updated[0].id);
      }
    }
  };

  // Update Profile Settings (Themes, Audio, Voice, Lang, Haptics)
  const handleUpdateProfileSettings = (patch: Partial<LearnerProfile>) => {
    const updated = profiles.map((p) =>
      p.id === currentProfile.id ? { ...p, ...patch } : p
    );
    setProfiles(updated);
    storageService.saveProfiles(updated);
  };

  // Toggle Sound/Voice
  const handleToggleSound = () => {
    handleUpdateProfileSettings({ soundEnabled: !currentProfile.soundEnabled });
  };

  const handleToggleVoice = () => {
    handleUpdateProfileSettings({ voiceEnabled: !currentProfile.voiceEnabled });
  };

  // Record an answer across any mode
  const handleRecordAnswer = useCallback(
    (factorA: SifirFactor, factorB: SifirFactor, isCorrect: boolean, latencyMs: number) => {
      const key = `${factorA}x${factorB}`;
      setMasteryMap((prev) => {
        const existing = prev[key];
        const updatedFact = updateFactRecord(existing, isCorrect, latencyMs);
        const newMap = { ...prev, [key]: updatedFact };
        storageService.saveMasteryMap(currentProfile.id, newMap);
        return newMap;
      });
    },
    [currentProfile.id]
  );

  // Add stars to active profile
  const handleAwardStars = (stars: number, newHighScore?: number) => {
    const updated = profiles.map((p) => {
      if (p.id !== currentProfile.id) return p;
      return {
        ...p,
        totalStars: p.totalStars + stars,
        speedRushHighScore:
          newHighScore !== undefined ? Math.max(p.speedRushHighScore, newHighScore) : p.speedRushHighScore,
      };
    });
    setProfiles(updated);
    storageService.saveProfiles(updated);
  };

  // Handlers for finishing modes
  const handleFinishTablePractice = (table: SifirFactor, stars: number) => {
    handleAwardStars(stars);
    setCelebrationSummary({
      mode: 'STEP_PRACTICE',
      targetTable: table,
      totalQuestions: 12,
      correctAnswers: 12,
      starsEarned: stars,
      accuracyPercent: 100,
      maxCombo: 12,
      newlyMasteredCount: 1,
    });
  };

  const handleFinishSmartQuiz = (total: number, correct: number, stars: number, maxStreak: number) => {
    handleAwardStars(stars);
    setCelebrationSummary({
      mode: 'SMART_QUIZ',
      totalQuestions: total,
      correctAnswers: correct,
      starsEarned: stars,
      accuracyPercent: Math.round((correct / total) * 100),
      maxCombo: maxStreak,
      newlyMasteredCount: Math.floor(correct / 3),
    });
  };

  const handleFinishSpeedRush = (score: number, stars: number, correctCount: number) => {
    handleAwardStars(stars, score);
    setCelebrationSummary({
      mode: 'SPEED_RUSH',
      totalQuestions: correctCount,
      correctAnswers: correctCount,
      starsEarned: stars,
      accuracyPercent: 100,
      maxCombo: correctCount,
      newlyMasteredCount: 0,
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-arcade-chassis">
      {/* Top Arcade Header */}
      <ArcadeHeader
        profile={currentProfile}
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onOpenProfilePicker={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleVoice={handleToggleVoice}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 flex flex-col justify-center items-center w-full max-w-full overflow-x-hidden">
        {activeScreen === 'CABIN_HOME' && (
          <CabinHomeView
            profile={currentProfile}
            masteryMap={masteryMap}
            onSelectMode={(screen, table) => {
              if (table) setSelectedTable(table);
              setActiveScreen(screen);
            }}
          />
        )}

        {activeScreen === 'EXPLORE_MATRIX' && (
          <MatrixGrid12x12
            masteryMap={masteryMap}
            onLaunchPractice={(table) => {
              setSelectedTable(table);
              setActiveScreen('STEP_PRACTICE');
            }}
          />
        )}

        {activeScreen === 'STEP_PRACTICE' && (
          <StepPracticeView
            targetTable={selectedTable}
            onTableChange={setSelectedTable}
            onCompleteTable={handleFinishTablePractice}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {activeScreen === 'SMART_QUIZ' && (
          <SmartQuizView
            masteryMap={masteryMap}
            totalQuestions={15}
            onFinishQuiz={handleFinishSmartQuiz}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {activeScreen === 'SPEED_RUSH' && (
          <SpeedRushView
            masteryMap={masteryMap}
            personalBest={currentProfile.speedRushHighScore}
            onFinishSpeedRush={handleFinishSpeedRush}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {activeScreen === 'PARENT_HEATMAP' && (
          <ParentHeatmapView
            profile={currentProfile}
            masteryMap={masteryMap}
            onDataRestored={() => {
              setProfiles(storageService.getProfiles());
              setMasteryMap(storageService.getMasteryMap(currentProfile.id));
            }}
          />
        )}
      </main>

      {/* Profile Picker Modal */}
      <ProfilePickerModal
        isOpen={isProfileModalOpen}
        profiles={profiles}
        activeProfileId={currentProfile.id}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      {/* Arcade Settings Modal */}
      <ArcadeSettingsModal
        isOpen={isSettingsModalOpen}
        profile={currentProfile}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdateProfile={handleUpdateProfileSettings}
        onOpenParentPortal={() => setActiveScreen('PARENT_HEATMAP')}
      />

      {/* Reward / Celebration Modal */}
      {celebrationSummary && (
        <CelebrationModal
          summary={celebrationSummary}
          profile={currentProfile}
          onClose={() => {
            setCelebrationSummary(null);
            setActiveScreen('CABIN_HOME');
          }}
          onPlayAgain={() => {
            setCelebrationSummary(null);
          }}
        />
      )}

      {/* PWA Update Banner */}
      {isUpdateReady && (
        <PwaUpdateBanner onReload={() => pwaUpdateService.applyUpdate(activeScreen)} />
      )}
    </div>
  );
};
