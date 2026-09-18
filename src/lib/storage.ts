import { CalculationType, NatalChartData, SynastryData, HumanDesignData } from '@/types/astro';
import { CityInfo } from '@/lib/cities';

export interface WizardState {
  calcType: CalculationType;
  focus?: string;
  // Person 1
  firstName: string;
  lastName: string;
  gender: 'female' | 'male' | 'other';
  day?: number;
  month?: number;
  year?: number;
  hour?: number;
  minute?: number;
  unknownTime: boolean;
  selectedCity?: CityInfo;
  // Person 2 (synastry)
  p2Name?: string;
  p2LastName?: string;
  p2Gender?: 'female' | 'male' | 'other';
  p2Day?: number;
  p2Month?: number;
  p2Year?: number;
  p2Hour?: number;
  p2Minute?: number;
  p2UnknownTime?: boolean;
  p2SelectedCity?: CityInfo;
}

export interface ResultStoragePayload {
  natal: NatalChartData;
  synastry?: SynastryData;
  humanDesign: HumanDesignData;
  calculationType: CalculationType;
  timestamp: number;
}

const WIZARD_STORAGE_KEY = 'aa_wizard_v1';
const RESULT_STORAGE_PREFIX = 'aa_result_';

/**
 * Safely retrieve wizard state from sessionStorage
 */
export function getWizardState(): WizardState | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(WIZARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('sessionStorage get error:', e);
    return null;
  }
}

/**
 * Safely update wizard state in sessionStorage
 */
export function saveWizardState(state: Partial<WizardState>): void {
  try {
    if (typeof window === 'undefined') return;
    const current = getWizardState() || {
      calcType: 'all',
      firstName: '',
      lastName: '',
      gender: 'male',
      unknownTime: false,
    };
    const updated = { ...current, ...state };
    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('sessionStorage set error:', e);
  }
}

/**
 * Clear wizard state
 */
export function clearWizardState(): void {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(WIZARD_STORAGE_KEY);
  } catch (e) {
    console.warn('sessionStorage clear error:', e);
  }
}

/**
 * Generate a short deterministic ID hash based on inputs
 */
export function generateResultId(data: {
  calcType: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  lat: number;
  lon: number;
}): string {
  const str = `${data.calcType}-${data.year}-${data.month}-${data.day}-${data.hour}:${data.minute}-${data.lat.toFixed(2)},${data.lon.toFixed(2)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Save calculated result into localStorage
 */
export function saveResult(id: string, payload: ResultStoragePayload): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${RESULT_STORAGE_PREFIX}${id}`, JSON.stringify(payload));
  } catch (e) {
    console.warn('localStorage saveResult error:', e);
  }
}

/**
 * Retrieve result from localStorage
 */
export function getResult(id: string): ResultStoragePayload | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`${RESULT_STORAGE_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('localStorage getResult error:', e);
    return null;
  }
}

/**
 * Encode compact payload for URL query string
 */
export function encodePayload(data: any): string {
  try {
    const json = JSON.stringify(data);
    if (typeof window !== 'undefined' && window.btoa) {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(json))));
    }
    return Buffer.from(json).toString('base64url');
  } catch (e) {
    console.error('encodePayload error:', e);
    return '';
  }
}

/**
 * Decode payload from URL query string
 */
export function decodePayload<T = any>(str: string): T | null {
  try {
    if (!str) return null;
    const decoded = decodeURIComponent(str);
    let json = '';
    if (typeof window !== 'undefined' && window.atob) {
      json = decodeURIComponent(escape(window.atob(decoded)));
    } else {
      json = Buffer.from(decoded, 'base64url').toString('utf-8');
    }
    return JSON.parse(json);
  } catch (e) {
    console.error('decodePayload error:', e);
    return null;
  }
}

/**
 * Validate first unfilled step for protection against skipping steps
 */
export function getFirstUnfilledStep(calcType: CalculationType, state: WizardState | null): number {
  if (!state) return 1;

  if (calcType === 'all' || calcType === 'natal') {
    if (!state.focus && state.focus !== undefined) return 1;
    if (!state.firstName || !state.firstName.trim()) return 2;
    if (!state.day || !state.month || !state.year) return 3;
    if (!state.unknownTime && (state.hour === undefined || state.minute === undefined)) return 4;
    if (!state.selectedCity) return 5;
    return 5;
  }

  if (calcType === 'synastry') {
    if (!state.firstName || !state.firstName.trim()) return 1;
    if (!state.day || !state.month || !state.year || (!state.unknownTime && state.hour === undefined)) return 2;
    if (!state.selectedCity) return 3;
    if (!state.p2Name || !state.p2Name.trim()) return 4;
    if (!state.p2Day || !state.p2Month || !state.p2Year || (!state.p2UnknownTime && state.p2Hour === undefined)) return 5;
    if (!state.p2SelectedCity) return 6;
    return 6;
  }

  if (calcType === 'humandesign') {
    if (!state.firstName || !state.firstName.trim()) return 1;
    if (!state.day || !state.month || !state.year) return 2;
    if (!state.unknownTime && (state.hour === undefined || state.minute === undefined)) return 3;
    if (!state.selectedCity) return 4;
    return 4;
  }

  return 1;
}
