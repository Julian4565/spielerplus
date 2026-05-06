export const teams = [
  { id: 'football', name: 'Football', logo: '⚽' },
  { id: 'basketball', name: 'Basketball', logo: '🏀' },
];

export const clubInfo = { id: 'bayern', name: 'FC Bayern Munich', logo: '🔴⚪' };

const ALL_EVENTS = [
  // Football Events
  { id: 'f1', teamId: 'football', clubId: 'bayern', title: 'Training', date: '2026-05-08', startTime: '18:30', endTime: '20:00', location: 'Säbener Straße', type: 'training', status: 'upcoming', responses: { yes: 14, no: 2, pending: 4 }, userResponse: 'pending' },
  { id: 'f2', teamId: 'football', clubId: 'bayern', title: 'League Match vs. Dortmund', date: '2026-05-10', startTime: '15:30', endTime: '17:30', location: 'Allianz Arena', type: 'match', status: 'upcoming', responses: { yes: 18, no: 1, pending: 2 }, userResponse: 'yes' },
  { id: 'f3', teamId: 'football', clubId: 'bayern', title: 'Team Meeting', date: '2026-05-12', startTime: '19:00', endTime: '20:00', location: 'Club House', type: 'meeting', status: 'upcoming', responses: { yes: 20, no: 0, pending: 1 }, userResponse: 'pending' },
  // Basketball Events
  { id: 'b1', teamId: 'basketball', clubId: 'bayern', title: 'Court Practice', date: '2026-05-08', startTime: '19:00', endTime: '21:00', location: 'BMW Park', type: 'training', status: 'upcoming', responses: { yes: 10, no: 1, pending: 1 }, userResponse: 'yes' },
  { id: 'b2', teamId: 'basketball', clubId: 'bayern', title: 'EuroLeague Game', date: '2026-05-11', startTime: '20:30', endTime: '22:30', location: 'Away Arena', type: 'match', status: 'upcoming', responses: { yes: 12, no: 0, pending: 0 }, userResponse: 'yes' },
];

const ALL_MEMBERS = [
  // Football Team
  { id: 'f1', teamId: 'football', clubId: 'bayern', name: 'Harry Kane', role: 'Player', position: 'Striker', birthdate: '1993-07-28', avatar: 'https://i.pravatar.cc/150?u=kane', availability: 'available', attendance: 95 },
  { id: 'f2', teamId: 'football', clubId: 'bayern', name: 'Thomas Müller', role: 'Player', position: 'Attacking Midfield', birthdate: '1989-09-13', avatar: 'https://i.pravatar.cc/150?u=muller', availability: 'available', attendance: 98 },
  { id: 'f3', teamId: 'football', clubId: 'bayern', name: 'Jamal Musiala', role: 'Player', position: 'Attacking Midfield', birthdate: '2003-02-26', avatar: 'https://i.pravatar.cc/150?u=musiala', availability: 'available', attendance: 92 },
  { id: 'f4', teamId: 'football', clubId: 'bayern', name: 'Leroy Sané', role: 'Player', position: 'Winger', birthdate: '1996-01-11', avatar: 'https://i.pravatar.cc/150?u=sane', availability: 'sick', attendance: 85 },
  { id: 'f5', teamId: 'football', clubId: 'bayern', name: 'Joshua Kimmich', role: 'Player', position: 'Defensive Midfield', birthdate: '1995-02-08', avatar: 'https://i.pravatar.cc/150?u=kimmich', availability: 'available', attendance: 99 },
  { id: 'f6', teamId: 'football', clubId: 'bayern', name: 'Leon Goretzka', role: 'Player', position: 'Central Midfield', birthdate: '1995-02-06', avatar: 'https://i.pravatar.cc/150?u=goretzka', availability: 'available', attendance: 90 },
  { id: 'f7', teamId: 'football', clubId: 'bayern', name: 'Alphonso Davies', role: 'Player', position: 'Left Back', birthdate: '2000-11-02', avatar: 'https://i.pravatar.cc/150?u=davies', availability: 'available', attendance: 88 },
  { id: 'f8', teamId: 'football', clubId: 'bayern', name: 'Dayot Upamecano', role: 'Player', position: 'Centre Back', birthdate: '1998-10-27', avatar: 'https://i.pravatar.cc/150?u=upamecano', availability: 'available', attendance: 85 },
  { id: 'f9', teamId: 'football', clubId: 'bayern', name: 'Matthijs de Ligt', role: 'Player', position: 'Centre Back', birthdate: '1999-08-12', avatar: 'https://i.pravatar.cc/150?u=deligt', availability: 'available', attendance: 91 },
  { id: 'f10', teamId: 'football', clubId: 'bayern', name: 'Manuel Neuer', role: 'Player', position: 'Goalkeeper', birthdate: '1986-03-27', avatar: 'https://i.pravatar.cc/150?u=neuer', availability: 'available', attendance: 94 },
  { id: 'f11', teamId: 'football', clubId: 'bayern', name: 'Serge Gnabry', role: 'Player', position: 'Winger', birthdate: '1995-07-14', avatar: 'https://i.pravatar.cc/150?u=gnabry', availability: 'vacation', attendance: 75 },
  { id: 'f12', teamId: 'football', clubId: 'bayern', name: 'Kingsley Coman', role: 'Player', position: 'Winger', birthdate: '1996-06-13', avatar: 'https://i.pravatar.cc/150?u=coman', availability: 'sick', attendance: 70 },
  { id: 'f13', teamId: 'football', clubId: 'bayern', name: 'Konrad Laimer', role: 'Player', position: 'Central Midfield', birthdate: '1997-05-27', avatar: 'https://i.pravatar.cc/150?u=laimer', availability: 'available', attendance: 89 },
  { id: 'f14', teamId: 'football', clubId: 'bayern', name: 'Noussair Mazraoui', role: 'Player', position: 'Right Back', birthdate: '1997-11-14', avatar: 'https://i.pravatar.cc/150?u=mazraoui', availability: 'available', attendance: 82 },
  { id: 'f15', teamId: 'football', clubId: 'bayern', name: 'Eric Dier', role: 'Player', position: 'Centre Back', birthdate: '1994-01-15', avatar: 'https://i.pravatar.cc/150?u=dier', availability: 'available', attendance: 96 },
  
  // Basketball Team
  { id: 'b1', teamId: 'basketball', clubId: 'bayern', name: 'Carsen Edwards', role: 'Player', position: 'Point Guard', birthdate: '1998-03-12', avatar: 'https://i.pravatar.cc/150?u=edwards', availability: 'available', attendance: 95 },
  { id: 'b2', teamId: 'basketball', clubId: 'bayern', name: 'Sylvain Francisco', role: 'Player', position: 'Point Guard', birthdate: '1997-10-10', avatar: 'https://i.pravatar.cc/150?u=francisco', availability: 'available', attendance: 90 },
  { id: 'b3', teamId: 'basketball', clubId: 'bayern', name: 'Nick Weiler-Babb', role: 'Player', position: 'Shooting Guard', birthdate: '1995-12-12', avatar: 'https://i.pravatar.cc/150?u=weiler', availability: 'available', attendance: 88 },
  { id: 'b4', teamId: 'basketball', clubId: 'bayern', name: 'Andreas Obst', role: 'Player', position: 'Shooting Guard', birthdate: '1996-07-13', avatar: 'https://i.pravatar.cc/150?u=obst', availability: 'available', attendance: 92 },
  { id: 'b5', teamId: 'basketball', clubId: 'bayern', name: 'Isaac Bonga', role: 'Player', position: 'Small Forward', birthdate: '1999-11-08', avatar: 'https://i.pravatar.cc/150?u=bonga', availability: 'sick', attendance: 85 },
  { id: 'b6', teamId: 'basketball', clubId: 'bayern', name: 'Vladimir Lucic', role: 'Player', position: 'Small Forward', birthdate: '1989-06-17', avatar: 'https://i.pravatar.cc/150?u=lucic', availability: 'vacation', attendance: 75 },
  { id: 'b7', teamId: 'basketball', clubId: 'bayern', name: 'Niels Giffey', role: 'Player', position: 'Small Forward', birthdate: '1991-06-08', avatar: 'https://i.pravatar.cc/150?u=giffey', availability: 'available', attendance: 94 },
  { id: 'b8', teamId: 'basketball', clubId: 'bayern', name: 'Serge Ibaka', role: 'Player', position: 'Power Forward', birthdate: '1989-09-18', avatar: 'https://i.pravatar.cc/150?u=ibaka', availability: 'available', attendance: 96 },
  { id: 'b9', teamId: 'basketball', clubId: 'bayern', name: 'Devin Booker', role: 'Player', position: 'Center', birthdate: '1991-02-28', avatar: 'https://i.pravatar.cc/150?u=booker', availability: 'available', attendance: 89 },
  { id: 'b10', teamId: 'basketball', clubId: 'bayern', name: 'Danko Brankovic', role: 'Player', position: 'Center', birthdate: '2000-11-05', avatar: 'https://i.pravatar.cc/150?u=brankovic', availability: 'available', attendance: 86 }
];

const ALL_POLLS = [
  { id: 'p1', teamId: 'football', clubId: 'bayern', question: 'Where should we hold the end-of-season party?', options: [{ id: 'o1', text: 'Käfer Schänke', votes: 12 }, { id: 'o2', text: 'Augustiner-Keller', votes: 8 }], totalVotes: 20, hasVoted: true },
  { id: 'p2', teamId: 'basketball', clubId: 'bayern', question: 'New practice jersey color?', options: [{ id: 'o1', text: 'Red', votes: 8 }, { id: 'o2', text: 'White', votes: 4 }], totalVotes: 12, hasVoted: false }
];

const ALL_RIDES = [
  { id: 'r1', teamId: 'football', clubId: 'bayern', eventId: 'f2', driver: 'Manuel Neuer', seatsTotal: 4, seatsTaken: 3, location: 'Marienplatz', passengers: ['Thomas Müller', 'Joshua Kimmich', 'Leon Goretzka'] },
  { id: 'r2', teamId: 'basketball', clubId: 'bayern', eventId: 'b2', driver: 'Serge Ibaka', seatsTotal: 4, seatsTaken: 2, location: 'Olympiazentrum', passengers: ['Andreas Obst', 'Isaac Bonga'] }
];

const ALL_FINANCES = [
  { teamId: 'football', clubId: 'bayern', balance: 15450.50, transactions: [{ id: '1', date: '2026-05-01', description: 'Sponsor Bonus', amount: 5000.00, type: 'income' }, { id: '2', date: '2026-04-28', description: 'New Training Gear', amount: -1200.00, type: 'expense' }] },
  { teamId: 'basketball', clubId: 'bayern', balance: 3450.00, transactions: [{ id: '1', date: '2026-05-01', description: 'Monthly Contribution', amount: 350.00, type: 'income' }, { id: '2', date: '2026-04-28', description: 'New Basketballs', amount: -220.00, type: 'expense' }] }
];

// Reactive Arrays used directly by UI
export const events = $state<any[]>([]);
export const teamMembers = $state<any[]>([]);
export const polls = $state<any[]>([]);
export const carpoolRides = $state<any[]>([]);
export const finances = $state<any>({ balance: 0, transactions: [] });

export const userProfile = $state({
  id: 'user1',
  name: 'Julian Schmidt',
  email: 'julian.schmidt@bayern.com',
  role: 'Coach',
  avatar: 'https://i.pravatar.cc/150?u=2'
});

class AppState {
  activeTeamId = $state(teams[0].id);

  get activeClub() {
    return clubInfo;
  }
  
  get activeTeam() {
    return teams.find(t => t.id === this.activeTeamId) || teams[0];
  }

  setActiveTeam(id: string) {
    this.activeTeamId = id;
    this.refreshData();
  }

  refreshData() {
    events.length = 0;
    events.push(...ALL_EVENTS.filter(e => e.teamId === this.activeTeamId));

    teamMembers.length = 0;
    teamMembers.push(...ALL_MEMBERS.filter(m => m.teamId === this.activeTeamId));

    polls.length = 0;
    polls.push(...ALL_POLLS.filter(p => p.teamId === this.activeTeamId));

    carpoolRides.length = 0;
    carpoolRides.push(...ALL_RIDES.filter(r => r.teamId === this.activeTeamId));

    const fin = ALL_FINANCES.find(f => f.teamId === this.activeTeamId);
    if (fin) {
      finances.balance = fin.balance;
      finances.transactions = fin.transactions;
    }
  }
}

export const appState = new AppState();

// Initialize data
appState.refreshData();
