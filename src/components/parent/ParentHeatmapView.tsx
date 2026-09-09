import React, { useState } from 'react';
import { Download, Upload, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MasteryMap, SifirFactor, SifirFactRecord } from '../../types/sifir';
import { LearnerProfile } from '../../types/profile';
import { storageService } from '../../services/storageService';
import { TactileButton } from '../common/TactileButton';
import { Modal } from '../common/Modal';

interface ParentHeatmapViewProps {
  readonly profile: LearnerProfile;
  readonly masteryMap: MasteryMap;
  readonly onDataRestored: () => void;
}

export const ParentHeatmapView: React.FC<ParentHeatmapViewProps> = ({
  profile,
  masteryMap,
  onDataRestored,
}) => {
  const [selectedFact, setSelectedFact] = useState<SifirFactRecord | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const factors: SifirFactor[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Calculate high-level stats
  const allFacts = Object.values(masteryMap);
  const masteredCount = allFacts.filter((f) => f.status === 'MASTERED').length;
  const practicingCount = allFacts.filter((f) => f.status === 'PRACTICING').length;
  const learningCount = allFacts.filter((f) => f.status === 'LEARNING').length;

  const totalAttempts = allFacts.reduce((sum, f) => sum + f.attempts, 0);
  const totalCorrect = allFacts.reduce((sum, f) => sum + f.correctCount, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Identify bottleneck weak spots (slowest or highest error)
  const weakSpots = allFacts
    .filter((f) => f.attempts >= 2 && (f.status === 'LEARNING' || f.averageLatencyMs > 3000))
    .sort((a, b) => b.averageLatencyMs - a.averageLatencyMs)
    .slice(0, 5);

  const handleExport = () => {
    const data = storageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sifir_arcade_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && storageService.importAllData(content)) {
        setImportStatus('Backup restored successfully!');
        onDataRestored();
      } else {
        setImportStatus('Failed to restore backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-arcade-surface border-2 border-arcade-border rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-arcade-amber/20 rounded-2xl border border-arcade-amber/40">
            <Shield className="w-6 h-6 text-arcade-amber" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-arcade-cream">
              {profile.name}&apos;s Mastery Radar
            </h2>
            <p className="text-xs text-arcade-cream/60 font-mono">
              144 Multiplication Facts Telemetry & Analytics
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <TactileButton variant="neutral" size="sm" onClick={handleExport} className="flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </TactileButton>

          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            <div className="px-3 py-1.5 bg-arcade-groove hover:bg-arcade-border text-arcade-cream text-sm font-bold rounded-xl border border-arcade-border flex items-center gap-1.5 transition">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </div>
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-arcade-cyan/15 border border-arcade-cyan/40 rounded-xl text-xs font-mono text-arcade-cyan flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-arcade-surface rounded-2xl border border-arcade-border text-center">
          <span className="text-xs text-arcade-green font-bold uppercase">Mastered</span>
          <div className="font-display font-black text-2xl text-arcade-green font-mono">
            {masteredCount} <span className="text-xs text-arcade-cream/50">/ 144</span>
          </div>
        </div>

        <div className="p-3.5 bg-arcade-surface rounded-2xl border border-arcade-border text-center">
          <span className="text-xs text-arcade-cyan font-bold uppercase">Practicing</span>
          <div className="font-display font-black text-2xl text-arcade-cyan font-mono">
            {practicingCount}
          </div>
        </div>

        <div className="p-3.5 bg-arcade-surface rounded-2xl border border-arcade-border text-center">
          <span className="text-xs text-arcade-amber font-bold uppercase">Learning</span>
          <div className="font-display font-black text-2xl text-arcade-amber font-mono">
            {learningCount}
          </div>
        </div>

        <div className="p-3.5 bg-arcade-surface rounded-2xl border border-arcade-border text-center">
          <span className="text-xs text-arcade-cream/60 font-bold uppercase">Overall Accuracy</span>
          <div className="font-display font-black text-2xl text-arcade-cream font-mono">
            {overallAccuracy}%
          </div>
        </div>
      </div>

      {/* Weak Spots Alert (if any) */}
      {weakSpots.length > 0 && (
        <div className="p-4 bg-arcade-magenta/10 border border-arcade-magenta/30 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-arcade-magenta">
            <AlertCircle className="w-4 h-4" />
            <span>Recommended Focus Areas (High Latency / Errors)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakSpots.map((spot) => (
              <button
                key={`${spot.factorA}x${spot.factorB}`}
                type="button"
                onClick={() => setSelectedFact(spot)}
                className="px-3 py-1 bg-arcade-surface hover:bg-arcade-groove border border-arcade-magenta/40 rounded-xl font-mono text-xs text-arcade-cream flex items-center gap-2"
              >
                <span className="font-bold text-arcade-amber">
                  {spot.factorA} × {spot.factorB}
                </span>
                <span className="text-arcade-cream/60">
                  ({(spot.averageLatencyMs / 1000).toFixed(1)}s avg)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 12x12 Telemetry Matrix */}
      <div className="p-4 sm:p-5 bg-arcade-surface border-2 border-arcade-border rounded-3xl overflow-x-auto shadow-arcade-md">
        <div className="min-w-[580px] select-none">
          <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1 text-center font-mono font-bold text-xs text-arcade-amber">
            <div className="p-1">×</div>
            {factors.map((col) => (
              <div key={col} className="p-1 bg-arcade-groove rounded">
                {col}
              </div>
            ))}
          </div>

          {factors.map((row) => (
            <div key={row} className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1 text-center font-mono text-xs">
              <div className="p-1 flex items-center justify-center bg-arcade-groove rounded font-bold text-arcade-amber">
                {row}
              </div>

              {factors.map((col) => {
                const fact = masteryMap[`${row}x${col}`];
                const status = fact?.status || 'UNTOUCHED';
                let cellBg = 'bg-arcade-groove/40 text-arcade-cream/40';
                if (status === 'MASTERED') cellBg = 'bg-arcade-green text-arcade-chassis font-bold';
                else if (status === 'PRACTICING') cellBg = 'bg-arcade-cyan text-arcade-chassis font-bold';
                else if (status === 'LEARNING') cellBg = 'bg-arcade-amber text-arcade-chassis font-bold';

                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedFact(fact)}
                    className={`h-7 sm:h-8 flex items-center justify-center rounded transition hover:scale-110 cursor-pointer ${cellBg}`}
                    title={`${row} × ${col} = ${row * col}`}
                  >
                    {row * col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fact Telemetry Detail Modal */}
      {selectedFact && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFact(null)}
          title={`Fact Telemetry: ${selectedFact.factorA} × ${selectedFact.factorB} = ${selectedFact.product}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-arcade-chassis rounded-xl border border-arcade-border">
                <span className="text-xs text-arcade-cream/60">Status</span>
                <div className="font-bold text-base text-arcade-cyan font-mono">
                  {selectedFact.status}
                </div>
              </div>
              <div className="p-3 bg-arcade-chassis rounded-xl border border-arcade-border">
                <span className="text-xs text-arcade-cream/60">Total Attempts</span>
                <div className="font-bold text-base text-arcade-amber font-mono">
                  {selectedFact.attempts}
                </div>
              </div>
              <div className="p-3 bg-arcade-chassis rounded-xl border border-arcade-border">
                <span className="text-xs text-arcade-cream/60">Accuracy</span>
                <div className="font-bold text-base text-arcade-green font-mono">
                  {selectedFact.attempts > 0
                    ? `${Math.round((selectedFact.correctCount / selectedFact.attempts) * 100)}%`
                    : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-arcade-chassis rounded-xl border border-arcade-border">
                <span className="text-xs text-arcade-cream/60">Avg Response Time</span>
                <div className="font-bold text-base text-arcade-cream font-mono">
                  {selectedFact.averageLatencyMs > 0
                    ? `${(selectedFact.averageLatencyMs / 1000).toFixed(2)}s`
                    : 'N/A'}
                </div>
              </div>
            </div>

            <TactileButton variant="neutral" size="md" fullWidth onClick={() => setSelectedFact(null)}>
              Close
            </TactileButton>
          </div>
        </Modal>
      )}
    </div>
  );
};
