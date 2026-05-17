export const teams = [
  { id: 'football', name: 'Football First Team', logo: '⚽' },
  { id: 'basketball', name: 'Basketball First Team', logo: '🏀' },
];

export const clubInfo = { id: 'bayern', name: 'FC Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' };

const ALL_EVENTS = [
  // Football Events - May 2026
  { id: 'f1', teamId: 'football', clubId: 'bayern', title: 'Tactical Training', date: '2026-05-12', startTime: '10:00', endTime: '12:00', location: 'Säbener Straße', type: 'training', status: 'upcoming', responses: { yes: 24, no: 1, pending: 2 }, userResponse: 'yes', competition: 'Bundesliga Prep' },
  { id: 'f2', teamId: 'football', clubId: 'bayern', title: 'Bundesliga: vs. Dortmund', date: '2026-05-14', startTime: '18:30', endTime: '20:30', location: 'Allianz Arena', type: 'match', status: 'upcoming', responses: { yes: 26, no: 0, pending: 1 }, userResponse: 'yes', competition: 'Bundesliga', opponentLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { id: 'f3', teamId: 'football', clubId: 'bayern', title: 'Recovery Session', date: '2026-05-15', startTime: '11:00', endTime: '13:00', location: 'Performance Center', type: 'training', status: 'upcoming', responses: { yes: 22, no: 3, pending: 2 }, userResponse: 'pending' },
  { id: 'f4', teamId: 'football', clubId: 'bayern', title: 'UCL Quarter-Final: vs. Real Madrid', date: '2026-05-19', startTime: '21:00', endTime: '23:00', location: 'Santiago Bernabéu', type: 'match', status: 'upcoming', responses: { yes: 27, no: 0, pending: 0 }, userResponse: 'yes', competition: 'Champions League', opponentLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', isUCL: true },
  { id: 'f5', teamId: 'football', clubId: 'bayern', title: 'Media Day & Photoshoot', date: '2026-05-20', startTime: '09:00', endTime: '14:00', location: 'Allianz Arena', type: 'meeting', status: 'upcoming', responses: { yes: 25, no: 0, pending: 2 }, userResponse: 'yes' },
  { id: 'f6', teamId: 'football', clubId: 'bayern', title: 'Bundesliga: vs. RB Leipzig', date: '2026-05-23', startTime: '15:30', endTime: '17:30', location: 'Red Bull Arena', type: 'match', status: 'upcoming', responses: { yes: 24, no: 1, pending: 2 }, userResponse: 'pending', competition: 'Bundesliga', opponentLogo: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' },
  { id: 'f7', teamId: 'football', clubId: 'bayern', title: 'UCL: Semi-Final 1st Leg', date: '2026-05-27', startTime: '21:00', endTime: '23:00', location: 'Allianz Arena', type: 'match', status: 'upcoming', responses: { yes: 27, no: 0, pending: 0 }, userResponse: 'yes', competition: 'Champions League', opponentLogo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg', isUCL: true },
  { id: 'f8', teamId: 'football', clubId: 'bayern', title: 'Set Piece Training', date: '2026-05-13', startTime: '15:00', endTime: '16:30', location: 'Säbener Straße', type: 'training', status: 'upcoming', responses: { yes: 24, no: 0, pending: 3 }, userResponse: 'yes' },
  { id: 'f9', teamId: 'football', clubId: 'bayern', title: 'Video Analysis', date: '2026-05-18', startTime: '10:00', endTime: '11:30', location: 'Auditorium', type: 'meeting', status: 'upcoming', responses: { yes: 27, no: 0, pending: 0 }, userResponse: 'yes' },
  { id: 'f10', teamId: 'football', clubId: 'bayern', title: 'Team Dinner', date: '2026-05-24', startTime: '20:00', endTime: '22:30', location: 'Munich Center', type: 'meeting', status: 'upcoming', responses: { yes: 20, no: 2, pending: 5 }, userResponse: 'yes' },

  // Basketball Events
  { id: 'b1', teamId: 'basketball', clubId: 'bayern', title: 'Morning Shootaround', date: '2026-05-12', startTime: '09:00', endTime: '10:30', location: 'BMW Park', type: 'training', status: 'upcoming', responses: { yes: 14, no: 0, pending: 1 }, userResponse: 'yes' },
  { id: 'b2', teamId: 'basketball', clubId: 'bayern', title: 'BBL Match vs. ALBA Berlin', date: '2026-05-13', startTime: '20:00', endTime: '22:00', location: 'BMW Park', type: 'match', status: 'upcoming', responses: { yes: 15, no: 0, pending: 0 }, userResponse: 'yes', competition: 'BBL' },
  { id: 'b3', teamId: 'basketball', clubId: 'bayern', title: 'Weights & Conditioning', date: '2026-05-15', startTime: '14:00', endTime: '15:30', location: 'BMW Park Gym', type: 'training', status: 'upcoming', responses: { yes: 13, no: 1, pending: 1 }, userResponse: 'yes' },
  { id: 'b4', teamId: 'basketball', clubId: 'bayern', title: 'EuroLeague: vs. Real Madrid', date: '2026-05-18', startTime: '20:30', endTime: '22:30', location: 'WiZink Center', type: 'match', status: 'upcoming', responses: { yes: 15, no: 0, pending: 0 }, userResponse: 'yes', competition: 'EuroLeague' },
  { id: 'b5', teamId: 'basketball', clubId: 'bayern', title: 'Team Meeting', date: '2026-05-19', startTime: '12:00', endTime: '13:00', location: 'Office', type: 'meeting', status: 'upcoming', responses: { yes: 15, no: 0, pending: 0 }, userResponse: 'yes' },
];

const ALL_MEMBERS = [
  // Football Team - Stable CDN-Proxied Portraits
  { id: 'f1', teamId: 'football', clubId: 'bayern', name: 'Harry Kane', role: 'Player', position: 'Striker', birthdate: '1993-07-28', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/132098-1711617444.jpg', availability: 'available', attendance: 98 },
  { id: 'f2', teamId: 'football', clubId: 'bayern', name: 'Thomas Müller', role: 'Player', position: 'Attacking Midfield', birthdate: '1989-09-13', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/58358-1711617498.jpg', availability: 'available', attendance: 99 },
  { id: 'f3', teamId: 'football', clubId: 'bayern', name: 'Jamal Musiala', role: 'Player', position: 'Attacking Midfield', birthdate: '2003-02-26', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/580195-1711617300.jpg', availability: 'available', attendance: 96 },
  { id: 'f4', teamId: 'football', clubId: 'bayern', name: 'Leroy Sané', role: 'Player', position: 'Winger', birthdate: '1996-01-11', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/192565-1711617235.jpg', availability: 'available', attendance: 91 },
  { id: 'f5', teamId: 'football', clubId: 'bayern', name: 'Joshua Kimmich', role: 'Player', position: 'Defensive Midfield', birthdate: '1995-02-08', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/161056-1711617196.jpg', availability: 'available', attendance: 99 },
  { id: 'f6', teamId: 'football', clubId: 'bayern', name: 'Leon Goretzka', role: 'Player', position: 'Central Midfield', birthdate: '1995-02-06', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/261025-1711617180.jpg', availability: 'available', attendance: 94 },
  { id: 'f7', teamId: 'football', clubId: 'bayern', name: 'Alphonso Davies', role: 'Player', position: 'Left Back', birthdate: '2000-11-02', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/424204-1711617144.jpg', availability: 'available', attendance: 93 },
  { id: 'f8', teamId: 'football', clubId: 'bayern', name: 'Min-jae Kim', role: 'Player', position: 'Centre Back', birthdate: '1996-11-15', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/503446-1711617208.jpg', availability: 'available', attendance: 95 },
  { id: 'f9', teamId: 'football', clubId: 'bayern', name: 'Dayot Upamecano', role: 'Player', position: 'Centre Back', birthdate: '1998-10-27', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/344695-1711617247.jpg', availability: 'available', attendance: 92 },
  { id: 'f10', teamId: 'football', clubId: 'bayern', name: 'Manuel Neuer', role: 'Player', position: 'Goalkeeper', birthdate: '1986-03-27', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/17259-1711617260.jpg', availability: 'available', attendance: 97 },
  { id: 'f11', teamId: 'football', clubId: 'bayern', name: 'Serge Gnabry', role: 'Player', position: 'Winger', birthdate: '1995-07-14', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/159471-1711617163.jpg', availability: 'available', attendance: 88 },
  { id: 'f12', teamId: 'football', clubId: 'bayern', name: 'Kingsley Coman', role: 'Player', position: 'Winger', birthdate: '1996-06-13', avatar: 'https://images.weserv.nl/?url=https://img.a.transfermarkt.technology/portrait/header/243714-1711617222.jpg', availability: 'sick', attendance: 85 },
  
  // Basketball Team - Stable CDN-Proxied Portraits
  { id: 'b1', teamId: 'basketball', clubId: 'bayern', name: 'Carsen Edwards', role: 'Player', position: 'Point Guard', birthdate: '1998-03-12', avatar: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Carsen_Edwards_3_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%282%29_%28cropped%29.jpg/800px-Carsen_Edwards_3_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%282%29_%28cropped%29.jpg', availability: 'available', attendance: 95 },
  { id: 'b2', teamId: 'basketball', clubId: 'bayern', name: 'Serge Ibaka', role: 'Player', position: 'Power Forward', birthdate: '1989-09-18', avatar: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Serge_Ibaka_1_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20231201_%28cropped%29.jpg/800px-Serge_Ibaka_1_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20231201_%28cropped%29.jpg', availability: 'available', attendance: 96 },
  { id: 'b3', teamId: 'basketball', clubId: 'bayern', name: 'Isaac Bonga', role: 'Player', position: 'Small Forward', birthdate: '1999-11-08', avatar: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Isaac_Bonga_0_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20231201_%28cropped%29.jpg/800px-Isaac_Bonga_0_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20231201_%28cropped%29.jpg', availability: 'available', attendance: 92 },
  { id: 'b4', teamId: 'basketball', clubId: 'bayern', name: 'Andreas Obst', role: 'Player', position: 'Shooting Guard', birthdate: '1996-07-13', avatar: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Andreas_Obst_22_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%28cropped%29.jpg/800px-Andreas_Obst_22_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%28cropped%29.jpg', availability: 'available', attendance: 97 },
  { id: 'b5', teamId: 'basketball', clubId: 'bayern', name: 'Nick Weiler-Babb', role: 'Player', position: 'Shooting Guard', birthdate: '1995-12-12', avatar: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Nick_Weiler-Babb_00_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%28cropped%29.jpg/800px-Nick_Weiler-Babb_00_FC_Bayern_M%C3%BCnchen_%28Basketball%29_20241112_%28cropped%29.jpg', availability: 'available', attendance: 94 },
];

const ALL_POLLS = [
  { id: 'p1', teamId: 'football', clubId: 'bayern', question: 'Which kit should we wear for the UCL Final if we qualify?', options: [{ id: 'o1', text: 'Classic Red', votes: 18 }, { id: 'o2', text: 'White/Gold', votes: 9 }], totalVotes: 27, hasVoted: true },
  { id: 'p2', teamId: 'basketball', clubId: 'bayern', question: 'MVP of the month?', options: [{ id: 'o1', text: 'Carsen Edwards', votes: 10 }, { id: 'o2', text: 'Serge Ibaka', votes: 5 }], totalVotes: 15, hasVoted: false }
];

const ALL_RIDES = [
  { id: 'r1', teamId: 'football', clubId: 'bayern', eventId: 'f2', driver: 'Thomas Müller', seatsTotal: 4, seatsTaken: 3, location: 'Marienplatz', passengers: ['Jamal Musiala', 'Harry Kane', 'Joshua Kimmich'] },
  { id: 'r2', teamId: 'basketball', clubId: 'bayern', eventId: 'b2', driver: 'Serge Ibaka', seatsTotal: 3, seatsTaken: 2, location: 'Olympiazentrum', passengers: ['Andreas Obst', 'Isaac Bonga'] }
];

const ALL_FINANCES = [
  { 
    teamId: 'football', 
    clubId: 'bayern', 
    balance: 245850000.00, 
    transactions: [
      { id: '1', date: '2026-05-10', description: 'Adidas Sponsorship Payout (Q2)', amount: 45000000.00, type: 'income' }, 
      { id: '2', date: '2026-05-08', description: 'UCL Quarter-Final Gate Receipts', amount: 8500000.00, type: 'income' },
      { id: '3', date: '2026-05-05', description: 'Monthly Player Salaries', amount: -22500000.00, type: 'expense' },
      { id: '4', date: '2026-05-02', description: 'Allianz Arena Maintenance', amount: -1200000.00, type: 'expense' },
      { id: '5', date: '2026-04-28', description: 'Transfer Installment: Harry Kane', amount: -15000000.00, type: 'expense' }
    ] 
  },
  { 
    teamId: 'basketball', 
    clubId: 'bayern', 
    balance: 12500000.00, 
    transactions: [
      { id: '1', date: '2026-05-01', description: 'Audi Sponsorship', amount: 2500000.00, type: 'income' }, 
      { id: '2', date: '2026-04-25', description: 'Team Travel (EuroLeague)', amount: -450000.00, type: 'expense' }
    ] 
  }
];

// Reactive Arrays used directly by UI
export const events = $state<any[]>([]);
export const teamMembers = $state<any[]>([]);
export const polls = $state<any[]>([]);
export const carpoolRides = $state<any[]>([]);
export const finances = $state<any>({ balance: 0, transactions: [] });

export const userProfile = $state({
  id: 'user1',
  name: 'Vincent Kompany',
  email: 'vincent.kompany@bayern.com',
  role: 'Coach',
  avatar: '/images/Trainer/Vincent%20Kompany.png'
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

