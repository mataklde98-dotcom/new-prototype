// ===== DELETE CONFIRMATION MODAL =====

interface DeleteConfirmModalProps {
  show: boolean;
  deleteMode: "selected" | "filtered" | "all";
  selectedCount: number;
  filteredCount: number;
  totalCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  show,
  deleteMode,
  selectedCount,
  filteredCount,
  totalCount,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
      style={{
        willChange: 'opacity',
        transform: 'translateZ(0)',
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] border border-white/[0.12] rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))",
            border: "1px solid rgba(239, 68, 68, 0.4)",
          }}
        >
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-['Poppins:Bold',sans-serif] text-[20px] text-white text-center mb-2">
          {deleteMode === "selected" && "Ausgewählte löschen?"}
          {deleteMode === "filtered" && "Gefilterte Sets löschen?"}
          {deleteMode === "all" && "Alle Sets löschen?"}
        </h3>

        {/* Message */}
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/60 text-center mb-6">
          {deleteMode === "selected" &&
            `${selectedCount} ${selectedCount === 1 ? "Set" : "Sets"} werden permanent gelöscht.`}
          {deleteMode === "filtered" &&
            `${filteredCount} ${filteredCount === 1 ? "Set" : "Sets"} werden permanent gelöscht.`}
          {deleteMode === "all" &&
            `Alle ${totalCount} Sets werden permanent gelöscht.`}
          <br />
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 transition-all duration-200 border border-white/[0.08] bg-white/[0.02]"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] text-white transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(185, 28, 28, 0.9))",
              border: "1px solid rgba(220, 38, 38, 0.5)",
            }}
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
