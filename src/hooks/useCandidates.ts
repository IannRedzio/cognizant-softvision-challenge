import { useState, useEffect, useCallback } from 'react';
import { Candidate } from '../types/candidate';
import { getCandidates } from '../api';
import { loadCandidatesFromStorage, saveCandidatesToStorage, clearCandidatesFromStorage } from '../utils/localStorage';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCandidates = async () => {
      const savedCandidates = loadCandidatesFromStorage();
      
      if (savedCandidates) {
        setCandidates(savedCandidates);
        setIsLoading(false);
      } else {
        try {
          const apiCandidates = await getCandidates();
          setCandidates(apiCandidates);
        } catch (error) {
          console.error('Error al cargar candidatos:', error);
          setCandidates([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeCandidates();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveCandidatesToStorage(candidates);
    }
  }, [candidates, isLoading]);

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

  const clearStorage = useCallback(async () => {
    clearCandidatesFromStorage();
    try {
      const apiCandidates = await getCandidates();
      setCandidates(apiCandidates);
    } catch (error) {
      console.error('Error al resetear candidatos:', error);
      setCandidates([]);
    }
  }, []);

  return {
    candidates,
    isLoading,
    addCandidate,
    moveNext,
    movePrevious,
    updateComments,
    removeCandidate,
    clearStorage
  };
};