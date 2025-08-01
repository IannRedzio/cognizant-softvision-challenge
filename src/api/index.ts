import {Candidate} from "../types/candidate";
import candidatesData from "./candidates.json";

let candidates: Candidate[] = [...(candidatesData as Candidate[])];

export default {
  candidates: {
    list: (): Promise<Candidate[]> => {
      return Promise.resolve([...candidates]);
    },

    add: (candidate: Omit<Candidate, "step">): Promise<Candidate> => {
      const existingCandidate = candidates.find(c => c.id === candidate.id);
      if (existingCandidate) {
        return Promise.reject(new Error(`Ya existe un candidato con el ID: ${candidate.id}`));
      }

      const newCandidate: Candidate = {
        ...candidate,
        step: "Entrevista inicial"
      };
      candidates.push(newCandidate);
      return Promise.resolve(newCandidate);
    },

    moveNext: (candidateId: string): Promise<Candidate | null> => {
      const candidateIndex = candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex === -1) return Promise.resolve(null);

      const candidate = candidates[candidateIndex];
      const steps: Candidate["step"][] = [
        "Entrevista inicial",
        "Entrevista técnica", 
        "Oferta",
        "Asignación",
        "Rechazo"
      ];

      const currentStepIndex = steps.indexOf(candidate.step);
      if (currentStepIndex < steps.length - 1) {
        candidate.step = steps[currentStepIndex + 1];
      }

      return Promise.resolve(candidate);
    },

    movePrevious: (candidateId: string): Promise<Candidate | null> => {
      const candidateIndex = candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex === -1) return Promise.resolve(null);

      const candidate = candidates[candidateIndex];
      const steps: Candidate["step"][] = [
        "Entrevista inicial",
        "Entrevista técnica",
        "Oferta", 
        "Asignación",
        "Rechazo"
      ];

      const currentStepIndex = steps.indexOf(candidate.step);
      if (currentStepIndex > 0) {
        candidate.step = steps[currentStepIndex - 1];
      }

      return Promise.resolve(candidate);
    },

    updateComments: (candidateId: string, comments: string): Promise<Candidate | null> => {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) return Promise.resolve(null);

      candidate.comments = comments;
      return Promise.resolve(candidate);
    },

    remove: (candidateId: string): Promise<boolean> => {
      const initialLength = candidates.length;
      candidates = candidates.filter(c => c.id !== candidateId);
      return Promise.resolve(candidates.length < initialLength);
    }
  },
};
