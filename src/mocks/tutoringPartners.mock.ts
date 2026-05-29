// ===== TUTORING PARTNERS MOCK DATA =====
// Partner-Institute fuer lokale Nachhilfe

export interface TutoringPartner {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  rating: number;
  subjects: string[];
  openingHours: string[];
}

export const MOCK_PARTNERS: TutoringPartner[] = [
  {
    id: 'partner_1',
    name: 'Lernstudio München',
    city: '80331 München',
    address: 'Sendlinger Str. 24',
    phone: '+49 89 1234567',
    email: 'info@lernstudio-muenchen.de',
    description: 'Professionelle Nachhilfe in allen Faechern fuer Gymnasium und Realschule.',
    rating: 4.8,
    subjects: ['Mathematik', 'Deutsch', 'Englisch', 'Physik', 'Chemie', 'Latein'],
    openingHours: ['Mo–Do 09:00–18:00', 'Fr 09:00–15:00', 'Sa 10:00–14:00'],
  },
  {
    id: 'partner_2',
    name: 'Studienkreis Berlin',
    city: '10117 Berlin',
    address: 'Friedrichstr. 68',
    phone: '+49 30 9876543',
    email: 'berlin@studienkreis.de',
    description: 'Individuelle Foerderung mit erfahrenen Lehrkraeften in kleinen Gruppen.',
    rating: 4.6,
    subjects: ['Mathematik', 'Deutsch', 'Englisch', 'Franzoesisch', 'Biologie'],
    openingHours: ['Mo–Fr 10:00–19:00', 'Sa 10:00–13:00'],
  },
  {
    id: 'partner_3',
    name: 'Schülerhilfe Hamburg',
    city: '20095 Hamburg',
    address: 'Mönckebergstr. 11',
    phone: '+49 40 5554321',
    email: 'hamburg@schuelerhilfe.de',
    description: 'Seit ueber 20 Jahren erfolgreiche Nachhilfe in Hamburg und Umgebung.',
    rating: 4.7,
    subjects: ['Mathematik', 'Englisch', 'Physik', 'Chemie', 'Informatik'],
    openingHours: ['Mo–Fr 08:30–17:30'],
  },
  {
    id: 'partner_4',
    name: 'Nachhilfe Plus Köln',
    city: '50667 Köln',
    address: 'Hohe Str. 52',
    phone: '+49 221 7778899',
    email: 'kontakt@nachhilfeplus-koeln.de',
    description: 'Massgeschneiderte Lernplaene und flexible Terminvereinbarung.',
    rating: 4.5,
    subjects: ['Mathematik', 'Deutsch', 'Englisch', 'Geschichte', 'Erdkunde'],
    openingHours: ['Mo–Mi 09:00–18:00', 'Do 09:00–20:00', 'Fr 09:00–16:00', 'Sa 09:00–13:00'],
  },
  {
    id: 'partner_5',
    name: 'LernTeam Frankfurt',
    city: '60311 Frankfurt',
    address: 'Zeil 85',
    phone: '+49 69 3334455',
    email: 'info@lernteam-ffm.de',
    description: 'Kleine Gruppen, grosse Wirkung. Nachhilfe die Spass macht.',
    rating: 4.9,
    subjects: ['Mathematik', 'Physik', 'Chemie', 'Biologie', 'Informatik'],
    openingHours: ['Mo–Fr 10:00–19:00'],
  },
];

// Online-Nachhilfe-Partner (Standard fuer Online-Typ)
export const ONLINE_PARTNER: TutoringPartner = {
  id: 'partner_online',
  name: 'SoStudy',
  city: 'Online',
  address: '',
  phone: '+49 800 7678839',
  email: 'nachhilfe@sostudy.de',
  description: 'Professionelle Online-Nachhilfe mit persoenlichem Tutor via Video-Call.',
  rating: 4.9,
  subjects: ['Mathematik', 'Deutsch', 'Englisch', 'Physik', 'Chemie', 'Biologie', 'Latein', 'Franzoesisch', 'Informatik', 'Geschichte'],
  openingHours: ['Mo–Fr 08:00–20:00', 'Sa–So 10:00–16:00'],
};

// Alle verfuegbaren Schulfaecher
export const ALL_SUBJECTS = [
  'Mathematik',
  'Deutsch',
  'Englisch',
  'Physik',
  'Chemie',
  'Biologie',
  'Latein',
  'Franzoesisch',
  'Geschichte',
  'Erdkunde',
  'Informatik',
  'Kunst',
  'Musik',
  'Sport',
];