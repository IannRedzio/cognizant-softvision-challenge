import React, { useState } from "react";
import { Candidate } from "../../types/candidate";

interface CandidateCardProps {
  candidate: Candidate;
  onMoveNext?: () => void;
  onMovePrevious?: () => void;
  onUpdateComments: (candidateId: string, comments: string) => void;
}

function CandidateCard({
  candidate,
  onMoveNext,
  onMovePrevious,
  onUpdateComments,
}: CandidateCardProps) {
  const [isEditingComments, setIsEditingComments] = useState(false);
  const [tempComments, setTempComments] = useState(candidate.comments);

  const handleSaveComments = () => {
    onUpdateComments(candidate.id, tempComments);
    setIsEditingComments(false);
  };

  const handleCancelEdit = () => {
    setTempComments(candidate.comments);
    setIsEditingComments(false);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="font-medium text-gray-900">{candidate.name}</h3>
      </div>

      <div className="mb-3">
        {isEditingComments ? (
          <div className="space-y-2">
            <textarea
              value={tempComments}
              onChange={(e) => setTempComments(e.target.value)}
              placeholder="Agregar comentarios..."
              className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveComments}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingComments(true)}
            className="cursor-pointer"
          >
            {candidate.comments ? (
              <p className="text-sm text-gray-600 italic bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                {candidate.comments}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic p-2 border border-dashed border-gray-300 rounded">
                Haz clic para agregar comentarios...
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={onMovePrevious}
          disabled={!onMovePrevious}
          className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
            onMovePrevious
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          ←
        </button>
        <button
          onClick={onMoveNext}
          disabled={!onMoveNext}
          className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
            onMoveNext
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;