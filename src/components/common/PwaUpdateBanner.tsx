import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface PwaUpdateBannerProps {
  readonly onReload: () => void;
}

export const PwaUpdateBanner: React.FC<PwaUpdateBannerProps> = ({ onReload }) => {
  return (
    <aside
      aria-label="App update available"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-md p-3 bg-arcade-chassis/95 backdrop-blur-md border-2 border-arcade-cyan rounded-2xl shadow-arcade-lg flex items-center justify-between gap-3 animate-bounce"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-arcade-cyan/20 border border-arcade-cyan/50 flex items-center justify-center text-arcade-cyan flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-display font-black text-arcade-cream truncate">
            New Arcade Build Ready!
          </div>
          <div className="text-[10px] font-mono text-arcade-cyan">
            Tap to install latest features
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onReload}
        className="px-3 py-1.5 bg-arcade-cyan text-arcade-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-arcade-cyan/80 transition active:scale-95 cursor-pointer flex-shrink-0 shadow-keycap-cyan"
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Update</span>
      </button>
    </aside>
  );
};
