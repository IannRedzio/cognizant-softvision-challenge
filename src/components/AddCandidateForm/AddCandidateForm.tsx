import React, { useState } from "react";
import { Candidate } from "../../types/candidate";

interface AddCandidateFormProps {
  onAdd: (candidate: Omit<Candidate, "step">) => void;
}

function AddCandidateForm({ onAdd }: AddCandidateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");

  const generateId = (): string => {
    const timestamp = Date.now();
    return `id${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const id = generateId();
    
    onAdd({
      id,
      name: name.trim(),
      comments: comments.trim(),
    });

    setName("");
    setComments("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setName("");
    setComments("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + Agregar candidato
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del candidato *"
            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
            autoFocus
          />
        </div>
        
        <div>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comentarios (opcional)"
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddCandidateForm;