import React from "react";
import { Candidate } from "../../types/candidate";
import { useCandidates } from "../../hooks/useCandidates";
import Column from "../Column/Column";

const COLUMNS: { title: string; step: Candidate["step"] }[] = [
  { title: "Entrevista inicial", step: "Entrevista inicial" },
  { title: "Entrevista técnica", step: "Entrevista técnica" },
  { title: "Oferta", step: "Oferta" },
  { title: "Asignación", step: "Asignación" },
  { title: "Rechazo", step: "Rechazo" },
];

function Board() {
  const {
    candidates,
    addCandidate,
    moveNext,
    movePrevious,
    updateComments
  } = useCandidates();

  const handleMoveNext = (candidateId: string) => {
    try {
      moveNext(candidateId);
    } catch (error) {
      console.error("Error al mover candidato:", error);
    }
  };

  const handleMovePrevious = (candidateId: string) => {
    try {
      movePrevious(candidateId);
    } catch (error) {
      console.error("Error al mover candidato:", error);
    }
  };

  const handleAddCandidate = (candidate: Omit<Candidate, "step">) => {
    try {
      addCandidate(candidate);
    } catch (error) {
      console.error("Error al agregar candidato:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al agregar candidato. Verifique que el ID no esté duplicado.");
      }
    }
  };

  const handleUpdateComments = (candidateId: string, comments: string) => {
    try {
      updateComments(candidateId, comments);
    } catch (error) {
      console.error("Error al actualizar comentarios:", error);
    }
  };



  return (
    <div className="w-full max-w-8xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => {
          const columnCandidates = candidates.filter(
            (candidate) => candidate.step === column.step
          );

          return (
            <Column
              key={column.step}
              title={column.title}
              step={column.step}
              candidates={columnCandidates}
              onMoveNext={handleMoveNext}
              onMovePrevious={handleMovePrevious}
              onAddCandidate={column.step === "Entrevista inicial" ? handleAddCandidate : undefined}
              onUpdateComments={handleUpdateComments}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;