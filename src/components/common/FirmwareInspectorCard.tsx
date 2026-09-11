import React, { useState, useEffect } from 'react';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Sparkles,
} from 'lucide-react';
import { pwaUpdateService } from '../../services/pwaUpdateService';
import { audioEngine } from '../../services/audioEngine';
import type { UpdateCheckResult } from '../../types/telemetry';

export const FirmwareInspectorCard: React.FC = () => {
  const [diagnosticResult, setDiagnosticResult] = useState<UpdateCheckResult | null>(() =>
    pwaUpdateService.getLatestDiagnosticResult()
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const buildInfo = pwaUpdateService.getLocalBuildInfo();

  useEffect(() => {
    return pwaUpdateService.subscribeDiagnostic((res, checking) => {
      setDiagnosticResult(res);
      setIsChecking(checking);
    });
  }, []);

  const handleCheckUpdate = async () => {
    audioEngine.playKeyClick();
    await pwaUpdateService.checkNow();
  };

  const handleApplyUpdate = () => {
    audioEngine.playKeyClick();
    pwaUpdateService.applyUpdate();
  };

  const renderStatusBadge = () => {
    if (!diagnosticResult) return null;

    const { code, title, message, debugCode } = diagnosticResult;

    if (code === 'UP_TO_DATE') {
      return (
        <div className="p-2.5 rounded-xl bg-arcade-cyan/10 border border-arcade-cyan/40 text-arcade-cyan flex items-start gap-2 text-left">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-display font-bold text-xs">{title}</div>
            <div className="text-[10px] text-arcade-cream/80 leading-relaxed">{message}</div>
            <div className="text-[9px] font-mono opacity-60 mt-0.5">DEBUG: {debugCode}</div>
          </div>
        </div>
      );
    }

    if (code === 'DOWNLOADING') {
      return (
        <div className="p-2.5 rounded-xl bg-arcade-magenta/10 border border-arcade-magenta/40 text-arcade-magenta flex items-start gap-2 text-left animate-pulse">
          <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />
          <div className="min-w-0">
            <div className="font-display font-bold text-xs">{title}</div>
            <div className="text-[10px] text-arcade-cream/80 leading-relaxed">{message}</div>
            <div className="text-[9px] font-mono opacity-60 mt-0.5">DEBUG: {debugCode}</div>
          </div>
        </div>
      );
    }

    if (code === 'UPDATE_AVAILABLE') {
      return (
        <div className="p-2.5 rounded-xl bg-arcade-magenta/15 border border-arcade-magenta/50 text-arcade-magenta flex flex-col gap-2 text-left">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />
            <div className="min-w-0 flex-1">
              <div className="font-display font-black text-xs">{title}</div>
              <div className="text-[10px] text-arcade-cream/90 leading-relaxed">{message}</div>
              <div className="text-[9px] font-mono opacity-70 mt-0.5">DEBUG: {debugCode}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyUpdate}
            className="w-full py-1.5 px-3 bg-arcade-magenta text-white font-mono font-bold text-xs rounded-lg hover:bg-arcade-magenta/90 transition active:scale-95 shadow-arcade-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Install & Reboot Cabin</span>
          </button>
        </div>
      );
    }

    const isOffline = code === 'OFFLINE_ERROR';
    const IconComponent = isOffline ? WifiOff : AlertTriangle;

    return (
      <div className="p-2.5 rounded-xl bg-arcade-amber/10 border border-arcade-amber/40 text-arcade-amber flex items-start gap-2 text-left">
        <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-display font-bold text-xs">{title}</div>
          <div className="text-[10px] text-arcade-cream/80 leading-relaxed">{message}</div>
          <div className="text-[9px] font-mono opacity-60 mt-0.5">DEBUG: {debugCode}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-arcade-groove/40 border border-arcade-border/80 rounded-2xl space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-arcade-cyan" aria-hidden="true" />
          <h3 className="font-display font-black text-xs sm:text-sm text-arcade-cream tracking-wider uppercase">
            Firmware & Telemetry
          </h3>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-arcade-cyan border border-arcade-cyan/30">
          v{buildInfo.version}
        </span>
      </div>

      <div className="text-[10px] font-mono text-arcade-cream/60 bg-black/30 p-2 rounded-xl border border-arcade-border/50 flex flex-col gap-0.5">
        <div className="flex justify-between">
          <span className="text-arcade-cream/40">BUILD ID:</span>
          <span className="text-arcade-cream/90 font-bold truncate max-w-[200px]" title={buildInfo.buildId}>
            {buildInfo.buildId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-arcade-cream/40">RELEASE DATE:</span>
          <span className="text-arcade-cream/80">{buildInfo.timestamp.slice(0, 10)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-arcade-cream/40">COMMIT:</span>
          <span className="text-arcade-cream/80">{buildInfo.commit}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isChecking}
        onClick={handleCheckUpdate}
        className="w-full py-2 px-3 rounded-xl bg-arcade-surface hover:bg-arcade-groove border border-arcade-border text-arcade-cream font-mono font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan"
        aria-label="Check for new arcade build"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-arcade-cyan ${isChecking ? 'animate-spin' : ''}`} />
        <span>{isChecking ? 'Probing Update Server...' : 'Check for Updates'}</span>
      </button>

      {renderStatusBadge()}
    </div>
  );
};
