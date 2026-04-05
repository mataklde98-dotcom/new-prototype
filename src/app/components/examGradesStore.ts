// ===== SHARED EXAM GRADES STORE =====
// Single source of truth for exam grades – syncs between
// ProfileAnalyticsScreen (Ziele & Klausuren) and TodoManagementScreen (ToDos verwalten)

type Listener = () => void;

const grades: Record<string, string> = {};
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

export const examGradesStore = {
  getGrade(examId: string): string | undefined {
    return grades[examId];
  },
  setGrade(examId: string, grade: string) {
    grades[examId] = grade;
    notify();
  },
  getAllGrades(): Record<string, string> {
    return { ...grades };
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
