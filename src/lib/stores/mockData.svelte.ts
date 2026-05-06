export const clubs = [
  { id: '1', name: 'FC Vienna', logo: '⚽' },
  { id: '2', name: 'Basketball City', logo: '🏀' },
];

class AppState {
  activeClubId = $state(clubs[0].id);

  get activeClub() {
    return clubs.find(c => c.id === this.activeClubId) || clubs[0];
  }

  setActiveClub(id: string) {
    this.activeClubId = id;
  }
}

export const appState = new AppState();

export const events = $state([
  {
    id: '1',
    title: 'Training',
    date: '2026-05-08',
    startTime: '18:30',
    endTime: '20:00',
    location: 'Main Stadium',
    type: 'training',
    status: 'upcoming',
    responses: { yes: 14, no: 2, pending: 4 },
    userResponse: 'pending' // yes, no, pending
  },
  {
    id: '2',
    title: 'League Match vs. Rapid',
    date: '2026-05-10',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Away Arena',
    type: 'match',
    status: 'upcoming',
    responses: { yes: 11, no: 1, pending: 8 },
    userResponse: 'yes'
  },
  {
    id: '3',
    title: 'Team Meeting',
    date: '2026-05-12',
    startTime: '19:00',
    endTime: '20:00',
    location: 'Club House',
    type: 'meeting',
    status: 'upcoming',
    responses: { yes: 18, no: 0, pending: 2 },
    userResponse: 'pending'
  }
]);

export const teamMembers = $state([
  {
    id: '1',
    name: 'Alex Meier',
    role: 'Player',
    position: 'Striker',
    birthdate: '1995-04-12',
    avatar: 'https://i.pravatar.cc/150?u=1',
    availability: 'available', // available, sick, vacation
    attendance: 85
  },
  {
    id: '2',
    name: 'Julian Schmidt',
    role: 'Coach',
    position: 'Manager',
    birthdate: '1982-11-05',
    avatar: 'https://i.pravatar.cc/150?u=2',
    availability: 'available',
    attendance: 95
  },
  {
    id: '3',
    name: 'Thomas Wagner',
    role: 'Player',
    position: 'Midfielder',
    birthdate: '1998-02-28',
    avatar: 'https://i.pravatar.cc/150?u=3',
    availability: 'sick',
    attendance: 60
  },
  {
    id: '4',
    name: 'Lukas Bauer',
    role: 'Player',
    position: 'Defender',
    birthdate: '1997-08-15',
    avatar: 'https://i.pravatar.cc/150?u=4',
    availability: 'vacation',
    attendance: 75
  }
]);

export const userProfile = $state({
  id: 'user1',
  name: 'Julian Schmidt',
  email: 'julian.schmidt@example.com',
  role: 'Coach',
  avatar: 'https://i.pravatar.cc/150?u=2'
});

export const polls = $state([
  {
    id: '1',
    question: 'Where should we go for the summer party?',
    options: [
      { id: 'o1', text: 'Beach Bar', votes: 12 },
      { id: 'o2', text: 'Mountain Cabin', votes: 5 },
      { id: 'o3', text: 'Local Pub', votes: 2 }
    ],
    totalVotes: 19,
    hasVoted: false
  }
]);

export const carpoolRides = $state([
  {
    id: '1',
    eventId: '2',
    driver: 'Alex Meier',
    seatsTotal: 4,
    seatsTaken: 3,
    location: 'North Station',
    passengers: ['Thomas', 'Chris', 'David']
  },
  {
    id: '2',
    eventId: '2',
    driver: 'Julian Schmidt',
    seatsTotal: 3,
    seatsTaken: 1,
    location: 'South Mall',
    passengers: ['Lukas']
  }
]);

export const finances = $state({
  balance: 1450.50,
  transactions: [
    { id: '1', date: '2026-05-01', description: 'Monthly Contribution', amount: 350.00, type: 'income' },
    { id: '2', date: '2026-04-28', description: 'New Balls', amount: -120.00, type: 'expense' },
    { id: '3', date: '2026-04-15', description: 'Referee Fee', amount: -50.00, type: 'expense' }
  ]
});
