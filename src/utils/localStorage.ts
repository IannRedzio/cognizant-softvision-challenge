import { Candidate } from '../types/candidate';

const STORAGE_KEY = 'coin_candidates_data';

export const loadCandidatesFromStorage = (): Candidate[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : null;
    }
  } catch (error) {
    console.error('Error al cargar candidatos desde localStorage:', error);
  }
  return null;
};

export const saveCandidatesToStorage = (candidates: Candidate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error('Error al guardar candidatos en localStorage:', error);
  }
};

export const clearCandidatesFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
};