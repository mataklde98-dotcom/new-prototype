// ===== EXTRA SESSIONS MOCK DATA =====

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
}

export const MOCK_EXTRA_SESSIONS: ExtraSession[] = [
  {
    id: 'es-1',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Vertiefung',
    date: '22. März 2026',
    dateISO: '2026-03-22',
    time: '18:00 - 19:00',
  },
  {
    id: 'es-2',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Klausurvorbereitung',
    date: '25. März 2026',
    dateISO: '2026-03-25',
    time: '16:00 - 17:30',
  },
  {
    id: 'es-3',
    tutorName: 'Dr. Maria Fischer',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Englisch',
    subjectColor: '#FF8C6B',
    type: 'Vertiefung',
    date: '28. März 2026',
    dateISO: '2026-03-28',
    time: '15:00 - 16:00',
  },
  {
    id: 'es-4',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Physik',
    subjectColor: '#A78BFA',
    type: 'Nachholen',
    date: '2. April 2026',
    dateISO: '2026-04-02',
    time: '17:00 - 18:00',
  },
  {
    id: 'es-5',
    tutorName: 'Dr. Maria Fischer',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Deutsch',
    subjectColor: '#FFB84D',
    type: 'Vertiefung',
    date: '10. März 2026',
    dateISO: '2026-03-10',
    time: '14:00 - 15:00',
  },
  {
    id: 'es-6',
    tutorName: 'Sebastian Müller',
    avatar: 'https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    subject: 'Mathematik',
    subjectColor: '#6C8EFF',
    type: 'Vertiefung',
    date: '5. März 2026',
    dateISO: '2026-03-05',
    time: '18:00 - 19:00',
  },
];
