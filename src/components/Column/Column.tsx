import React from "react";
import { Candidate } from "../../types/candidate";
import CandidateCard from "../CandidateCard/CandidateCard";
import AddCandidateForm from "../AddCandidateForm/AddCandidateForm";

interface ColumnProps {
  title: string;
  step: Candidate["step"];
  candidates: Candidate[];
  onMoveNext: (candidateId: string) => void;
  onMovePrevious: (candidateId: string) => void;
  onAddCandidate?: (candidate: Omit<Candidate, "step">) => void;
  onUpdateComments: (candidateId: string, comments: string) => void;
}

function Column({
  title,
  step,
  candidates,
  onMoveNext,
  onMovePrevious,
  onAddCandidate,
  onUpdateComments,
}: ColumnProps) {
  const isFirstColumn = step === "Entrevista inicial";
  const isLastColumn = step === "Rechazo";

  return (
    <div className="bg-white rounded-lg shadow-md h-fit min-h-[400px]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {title}
        </h2>
      </div>
      
      <div className="p-4 space-y-3">
        {candidates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay candidatos
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onMoveNext={!isLastColumn ? () => onMoveNext(candidate.id) : undefined}
              onMovePrevious={!isFirstColumn ? () => onMovePrevious(candidate.id) : undefined}
              onUpdateComments={onUpdateComments}
            />
          ))
        )}
        
        {isFirstColumn && onAddCandidate && (
          <AddCandidateForm onAdd={onAddCandidate} />
        )}
      </div>
    </div>
  );
}

export default Column;