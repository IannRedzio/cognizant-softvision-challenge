import React, { useState, useEffect } from "react";
import { Candidate } from "../../types/candidate";
import api from "../../api";
import Column from "../Column/Column";

const COLUMNS: { title: string; step: Candidate["step"] }[] = [
  { title: "Entrevista inicial", step: "Entrevista inicial" },
  { title: "Entrevista técnica", step: "Entrevista técnica" },
  { title: "Oferta", step: "Oferta" },
  { title: "Asignación", step: "Asignación" },
  { title: "Rechazo", step: "Rechazo" },
];

function Board() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await api.candidates.list();
      setCandidates(data);
    } catch (error) {
      console.error("Error al cargar candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveNext = async (candidateId: string) => {
    try {
      await api.candidates.moveNext(candidateId);
      loadCandidates();
    } catch (error) {
      console.error("Error al mover candidato:", error);
    }
  };

  const handleMovePrevious = async (candidateId: string) => {
    try {
      await api.candidates.movePrevious(candidateId);
      loadCandidates();
    } catch (error) {
      console.error("Error al mover candidato:", error);
    }
  };

  const handleAddCandidate = async (candidate: Omit<Candidate, "step">) => {
    try {
      await api.candidates.add(candidate);
      loadCandidates();
    } catch (error) {
      console.error("Error al agregar candidato:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al agregar candidato. Verifique que el ID no esté duplicado.");
      }
    }
  };

  const handleUpdateComments = async (candidateId: string, comments: string) => {
    try {
      await api.candidates.updateComments(candidateId, comments);
      loadCandidates();
    } catch (error) {
      console.error("Error al actualizar comentarios:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Cargando candidatos...</div>
      </div>
    );
  }

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