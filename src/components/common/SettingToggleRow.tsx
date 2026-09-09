import React from 'react';

interface SettingToggleRowProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly control: React.ReactNode;
}

export const SettingToggleRow: React.FC<SettingToggleRowProps> = ({
  icon,
  title,
  subtitle,
  control,
}) => (
  <div className="min-h-[48px] px-3 py-2 bg-arcade-groove border border-arcade-border rounded-xl flex items-center justify-between gap-3">
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <div className="font-display font-bold text-xs sm:text-sm text-arcade-cream">{title}</div>
        <div className="text-[10px] text-arcade-cream/50">{subtitle}</div>
      </div>
    </div>
    {control}
  </div>
);
