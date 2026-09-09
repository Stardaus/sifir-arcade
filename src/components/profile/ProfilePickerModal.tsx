import React, { useState } from 'react';
import { UserPlus, Check, Trash2 } from 'lucide-react';
import { DEFAULT_AVATARS, LearnerProfile } from '../../types/profile';
import { Modal } from '../common/Modal';
import { TactileButton } from '../common/TactileButton';

interface ProfilePickerModalProps {
  readonly isOpen: boolean;
  readonly profiles: LearnerProfile[];
  readonly activeProfileId: string;
  readonly onClose: () => void;
  readonly onSelectProfile: (id: string) => void;
  readonly onCreateProfile: (name: string, avatar: string) => void;
  readonly onDeleteProfile: (id: string) => void;
}

export const ProfilePickerModal: React.FC<ProfilePickerModalProps> = ({
  isOpen,
  profiles,
  activeProfileId,
  onClose,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATARS[0]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProfile(newName.trim(), selectedAvatar);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Learner Profiles" maxWidth="md">
      {!isCreating ? (
        <div className="space-y-4">
          <p className="text-sm text-arcade-cream/70">
            Switch between learners or create a new profile for each son:
          </p>

          <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition ${
                    isActive
                      ? 'bg-arcade-amber/15 border-arcade-amber shadow-inner'
                      : 'bg-arcade-groove border-arcade-border hover:border-arcade-cream/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProfile(profile.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                  >
                    <span className="text-3xl p-1 bg-arcade-chassis/60 rounded-xl border border-arcade-border">
                      {profile.avatar}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-arcade-cream text-lg">
                        {profile.name}
                      </h3>
                      <p className="text-xs text-arcade-cream/60 font-mono">
                        ⭐ {profile.totalStars} Stars • High Score: {profile.speedRushHighScore}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="p-1.5 bg-arcade-amber text-arcade-chassis rounded-full">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteProfile(profile.id)}
                          className="p-2 text-arcade-cream/40 hover:text-arcade-magenta hover:bg-arcade-chassis rounded-xl transition"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <TactileButton
              variant="cyan"
              fullWidth
              size="md"
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create New Learner</span>
            </TactileButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-arcade-amber mb-2">
              Learner Name
            </label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="e.g. Adam"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 bg-arcade-groove border-2 border-arcade-border focus:border-arcade-cyan rounded-xl text-arcade-cream font-bold outline-none font-display"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-arcade-amber mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-arcade-chassis rounded-2xl border border-arcade-border">
              {DEFAULT_AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-2 rounded-xl transition ${
                    selectedAvatar === avatar
                      ? 'bg-arcade-amber/30 border-2 border-arcade-amber scale-110'
                      : 'hover:bg-arcade-groove'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <TactileButton
              variant="neutral"
              size="md"
              fullWidth
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </TactileButton>
            <TactileButton
              variant="green"
              size="md"
              fullWidth
              type="submit"
              disabled={!newName.trim()}
            >
              Save Learner
            </TactileButton>
          </div>
        </form>
      )}
    </Modal>
  );
};
