import { Candidate } from '../types/candidate';
import candidatesData from './candidates.json';

export const getCandidates = (): Promise<Candidate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...(candidatesData as Candidate[])]);
    }, 500);
  });
};