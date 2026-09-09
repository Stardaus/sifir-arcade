import { LearnerProfile, createDefaultProfile } from '../types/profile';
import { MasteryMap, SifirFactor, SifirFactRecord } from '../types/sifir';

const PROFILES_KEY = 'sifir_arcade_profiles_v1';
const ACTIVE_PROFILE_ID_KEY = 'sifir_arcade_active_id_v1';
const MASTERY_PREFIX = 'sifir_arcade_mastery_v1_';

export const createInitialMasteryMap = (): MasteryMap => {
  const map: Record<string, SifirFactRecord> = {};
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      const key = `${a}x${b}`;
      map[key] = {
        factorA: a as SifirFactor,
        factorB: b as SifirFactor,
        product: a * b,
        attempts: 0,
        correctCount: 0,
        averageLatencyMs: 0,
        lastPracticedAt: null,
        consecutiveStreak: 0,
        status: 'UNTOUCHED',
      };
    }
  }
  return map;
};

export const storageService = {
  getProfiles(): LearnerProfile[] {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (!raw) {
        const defaultProfiles = [
          createDefaultProfile('Adam', '🦊'),
          createDefaultProfile('Rayyan', '🦁'),
        ];
        this.saveProfiles(defaultProfiles);
        this.setActiveProfileId(defaultProfiles[0].id);
        return defaultProfiles;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          themeId: p.themeId || 'neo-arcade',
          hapticsEnabled: p.hapticsEnabled ?? true,
        }));
      }
      return [createDefaultProfile('Champion', '⚡')];
    } catch {
      return [createDefaultProfile('Champion', '⚡')];
    }
  },

  saveProfiles(profiles: LearnerProfile[]): void {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles', e);
    }
  },

  getActiveProfileId(): string {
    const id = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
    if (id) return id;
    const profiles = this.getProfiles();
    return profiles[0]?.id || '';
  },

  setActiveProfileId(id: string): void {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  },

  getMasteryMap(profileId: string): MasteryMap {
    try {
      const raw = localStorage.getItem(`${MASTERY_PREFIX}${profileId}`);
      if (!raw) return createInitialMasteryMap();
      const parsed = JSON.parse(raw);
      const initial = createInitialMasteryMap();
      return { ...initial, ...parsed };
    } catch {
      return createInitialMasteryMap();
    }
  },

  saveMasteryMap(profileId: string, map: MasteryMap): void {
    try {
      localStorage.setItem(`${MASTERY_PREFIX}${profileId}`, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save mastery map', e);
    }
  },

  exportAllData(): string {
    const profiles = this.getProfiles();
    const allMastery: Record<string, MasteryMap> = {};
    profiles.forEach((p) => {
      allMastery[p.id] = this.getMasteryMap(p.id);
    });
    return JSON.stringify({ version: 1, exportedAt: Date.now(), profiles, allMastery }, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profiles || !Array.isArray(parsed.profiles)) return false;
      this.saveProfiles(parsed.profiles);
      if (parsed.allMastery) {
        Object.entries(parsed.allMastery).forEach(([pId, mMap]) => {
          this.saveMasteryMap(pId, mMap as MasteryMap);
        });
      }
      return true;
    } catch {
      return false;
    }
  },
};
