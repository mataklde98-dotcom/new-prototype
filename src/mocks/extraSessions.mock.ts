// ===== EXTRA SESSIONS MOCK DATA =====
// Mock-Universum: "Heute" ist 2026-03-18 (siehe APP_NOW).
// Für Storno-Logik nutzen wir startAtISO (präzise ISO-Datetime).

export const APP_NOW = new Date('2026-03-18T12:00:00+01:00');

export interface ExtraSession {
  id: string;
  tutorName: string;
  avatar: string;
  subject: string;
  subjectColor: string;
  type: string;
  date: string;
  dateISO: string;
  time: string;
  startAtISO: string; // Präzise Start-Zeit für Storno-Berechnung
}

export const MOCK_EXTRA_SESSIONS: ExtraSession[] = [
  // Session in wenigen Stunden — Storno-Frist abgelaufen (<24h)
  {
    id: 'es-1',
    tutorName: 'Dr. Maria Fischer',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Englisch',
    subjectColor: '#FF8C6B',
    type: 'Vertiefung',
    date: '18. März 2026',
    dateISO: '2026-03-18',
    time: '20:00 - 21:00',
    startAtISO: '2026-03-18T20:00:00+01:00',
  },
  // Session morgen — 48h-Warnfenster (noch ~22h stornierbar)
  {
    id: 'es-2',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Klausurvorbereitung',
    date: '20. März 2026',
    dateISO: '2026-03-20',
    time: '10:00 - 11:00',
    startAtISO: '2026-03-20T10:00:00+01:00',
  },
  // Session 4 Tage später — normal, keine Warnung
  {
    id: 'es-3',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Vertiefung',
    date: '22. März 2026',
    dateISO: '2026-03-22',
    time: '18:00 - 19:00',
    startAtISO: '2026-03-22T18:00:00+01:00',
  },
  {
    id: 'es-4',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Klausurvorbereitung',
    date: '25. März 2026',
    dateISO: '2026-03-25',
    time: '16:00 - 17:30',
    startAtISO: '2026-03-25T16:00:00+01:00',
  },
  {
    id: 'es-5',
    tutorName: 'Dr. Maria Fischer',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Englisch',
    subjectColor: '#FF8C6B',
    type: 'Vertiefung',
    date: '28. März 2026',
    dateISO: '2026-03-28',
    time: '15:00 - 16:00',
    startAtISO: '2026-03-28T15:00:00+01:00',
  },
  {
    id: 'es-6',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Physik',
    subjectColor: '#A78BFA',
    type: 'Nachholen',
    date: '2. April 2026',
    dateISO: '2026-04-02',
    time: '17:00 - 18:00',
    startAtISO: '2026-04-02T17:00:00+01:00',
  },
];
