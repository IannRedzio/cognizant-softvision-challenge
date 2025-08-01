import { useState, useEffect, useCallback } from 'react';
import { Candidate } from '../types/candidate';
import candidatesData from '../api/candidates.json';
import { loadCandidatesFromStorage, saveCandidatesToStorage, clearCandidatesFromStorage } from '../utils/localStorage';

const initializeCandidates = (): Candidate[] => {
  const savedCandidates = loadCandidatesFromStorage();
  return savedCandidates || [...(candidatesData as Candidate[])];
};

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => initializeCandidates());

  useEffect(() => {
    saveCandidatesToStorage(candidates);
  }, [candidates]);

  const addCandidate = useCallback((candidate: Omit<Candidate, 'step'>) => {
    setCandidates(prev => {
      const existingCandidate = prev.find(c => c.id === candidate.id);
      if (existingCandidate) {
        throw new Error(`Ya existe un candidato con el ID: ${candidate.id}`);
      }

      const newCandidate: Candidate = {
        ...candidate,
        step: 'Entrevista inicial'
      };

      return [...prev, newCandidate];
    });
  }, []);

  const moveNext = useCallback((candidateId: string) => {
    setCandidates(prev => {
      const steps: Candidate['step'][] = [
        'Entrevista inicial',
        'Entrevista técnica',
        'Oferta',
        'Asignación',
        'Rechazo'
      ];

      return prev.map(candidate => {
        if (candidate.id === candidateId) {
          const currentStepIndex = steps.indexOf(candidate.step);
          if (currentStepIndex < steps.length - 1) {
            return { ...candidate, step: steps[currentStepIndex + 1] };
          }
        }
        return candidate;
      });
    });
  }, []);

  const movePrevious = useCallback((candidateId: string) => {
    setCandidates(prev => {
      const steps: Candidate['step'][] = [
        'Entrevista inicial',
        'Entrevista técnica',
        'Oferta',
        'Asignación',
        'Rechazo'
      ];

      return prev.map(candidate => {
        if (candidate.id === candidateId) {
          const currentStepIndex = steps.indexOf(candidate.step);
          if (currentStepIndex > 0) {
            return { ...candidate, step: steps[currentStepIndex - 1] };
          }
        }
        return candidate;
      });
    });
  }, []);

  const updateComments = useCallback((candidateId: string, comments: string) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, comments }
          : candidate
      )
    );
  }, []);

  const removeCandidate = useCallback((candidateId: string) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
  }, []);

  const clearStorage = useCallback(() => {
    clearCandidatesFromStorage();
    setCandidates([...(candidatesData as Candidate[])]);
  }, []);

  return {
    candidates,
    addCandidate,
    moveNext,
    movePrevious,
    updateComments,
    removeCandidate,
    clearStorage
  };
};