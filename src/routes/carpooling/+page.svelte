<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { events } from '$lib/stores/mockData.svelte';
  import { Car, MapPin, Users, Plus, X, Shield, Info, CheckCircle2 } from 'lucide-svelte';
  import { base } from '$app/paths';

  function getEventName(eventId: string) {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  }

  // Interactive Svelte 5 states for the Carpooling page
  let rides = $state([
    { 
      id: 'r1', 
      teamId: 'football', 
      eventId: 'f2', 
      driver: 'Thomas Müller', 
      vehicle: 'Audi RS e-tron GT ⚡', 
      seatsTotal: 4, 
      seatsTaken: 3, 
      location: 'Säbener Straße (Training Ground)', 
      destination: 'Allianz Arena',
      time: '16:30',
      passengers: ['Jamal Musiala', 'Harry Kane', 'Joshua Kimmich'],
      comments: 'Leaving sharp at 16:30. Charging status: 100%. Sports dynamics active!'
    },
    { 
      id: 'r2', 
      teamId: 'basketball', 
      eventId: 'b2', 
      driver: 'Serge Ibaka', 
      vehicle: 'Audi Q8 e-tron SUV 🔋', 
      seatsTotal: 5, 
      seatsTaken: 2, 
      location: 'Olympiazentrum', 
      destination: 'BMW Park Arena',
      time: '18:15',
      passengers: ['Andreas Obst', 'Isaac Bonga'],
      comments: 'Plenty of legroom in the e-tron SUV. Smooth electric ride guaranteed.'
    }
  ]);

  let selectedRide = $state<any>(null);
  let activeUser = 'Vincent Kompany (Coach)';

  function toggleJoinRide(rideId: string) {
    const rideIndex = rides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) return;

    const ride = rides[rideIndex];
    const isPassenger = ride.passengers.includes(activeUser);

    if (isPassenger) {
      // Leave
      ride.passengers = ride.passengers.filter(p => p !== activeUser);
      ride.seatsTaken = Math.max(0, ride.seatsTaken - 1);
    } else {
      // Join
      if (ride.seatsTaken < ride.seatsTotal) {
        ride.passengers.push(activeUser);
        ride.seatsTaken = Math.min(ride.seatsTotal, ride.seatsTaken + 1);
      }
    }

    // Update open modal state if it matches the current ride
    if (selectedRide && selectedRide.id === rideId) {
      selectedRide = { ...ride };
    }
  }

  // New ride offer states
  let showNewOfferModal = $state(false);
  let newLocation = $state('');
  let newDestination = $state('Allianz Arena');
  let newVehicle = $state('Audi Q4 e-tron');
  let newSeats = $state(4);
  let newTime = $state('17:00');

  function handleCreateOffer() {
    if (!newLocation) return;
    const newRideObj = {
      id: `r-${Date.now()}`,
      teamId: 'football',
      eventId: 'f2',
      driver: activeUser,
      vehicle: `${newVehicle} ⚡`,
      seatsTotal: newSeats,
      seatsTaken: 1,
      location: newLocation,
      destination: newDestination,
      time: newTime,
      passengers: [activeUser],
      comments: 'Official coach transport. Join if you need a comfortable premium transfer!'
    };
    rides.push(newRideObj);
    showNewOfferModal = false;
    newLocation = '';
  }
</script>

<div class="page-header">
  <div class="header-title">
    <h2>Audi e-tron Travel Hub</h2>
    <p class="text-sm text-muted">Sustainable luxury team travel powered by Audi official fleet.</p>
  </div>
  <Button variant="primary" class="rounded-btn gap-2" onclick={() => showNewOfferModal = true}>
    <Plus size={18} /> Offer Audi Ride
  </Button>
</div>

<!-- Premium Audi Fleet Banner -->
<div class="audi-fleet-banner hover-scale">
  <img src="{base}/images/Titels/Audi.jpg" alt="Audi FC Bayern Fleet" class="audi-banner-bg" />
  <div class="audi-banner-overlay"></div>
  <div class="audi-banner-content">
    <div class="audi-branding-header">
      <div class="audi-badge">OFFICIAL PARTNER</div>
    </div>
    <h3>Progress you can feel.</h3>
    <p>Experience zero-emission premium mobility with the all-electric Audi e-tron squad fleet. Coordinated directly inside SpielerPlus.</p>
  </div>
</div>

<h3 class="section-title mt-8 mb-4 font-black text-lg text-main">Active Team Carpools</h3>

<div class="rides-grid">
  {#each rides as ride}
    <Card noPadding class="ride-card hover-scale cursor-pointer" onclick={() => selectedRide = ride}>
      <div class="ride-header">
        <div class="event-info">
          <span class="event-tag">DELEGATION PASS</span>
          <h4 class="event-name">{getEventName(ride.eventId)}</h4>
        </div>
        <div class="seats-status" class:full={ride.seatsTotal === ride.seatsTaken}>
          <Users size={14} />
          {ride.seatsTotal - ride.seatsTaken} of {ride.seatsTotal} seats free
        </div>
      </div>
      
      <div class="ride-body">
        <!-- Audi Shuttle Badge -->
        <div class="audi-shuttle-tag">
          <span class="audi-dots">○○○○</span> Audi Official Team Shuttle
        </div>

        <div class="transport-info mt-3">
          <div class="driver-avatar-audi">
            <span class="brand-text">e-tron</span>
          </div>
          <div class="info-text">
            <span class="label">DRIVER & VEHICLE</span>
            <span class="value">{ride.driver}</span>
            <span class="sub-value">{ride.vehicle}</span>
          </div>
        </div>
        
        <div class="ride-details">
          <div class="detail-row">
            <div class="detail-icon"><MapPin size={16} class="text-primary" /></div>
            <div class="detail-text">
              <span class="label">DEPARTURE / TIME</span>
              <span class="value">{ride.location} at <strong>{ride.time}</strong></span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-icon"><Users size={16} /></div>
            <div class="detail-text">
              <span class="label">PASSENGERS</span>
              <span class="value">{ride.passengers.join(', ') || 'Only Driver'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="ride-footer" onclick={(e) => e.stopPropagation()}>
        <Button 
          variant={ride.passengers.includes(activeUser) ? 'secondary' : (ride.seatsTotal === ride.seatsTaken ? 'outline' : 'primary')} 
          class="w-full rounded-btn justify-center gap-2"
          disabled={ride.seatsTotal === ride.seatsTaken && !ride.passengers.includes(activeUser)}
          onclick={() => toggleJoinRide(ride.id)}
        >
          {#if ride.passengers.includes(activeUser)}
            Leave Shuttle Delegation
          {:else if ride.seatsTotal === ride.seatsTaken}
            Full Capacity
          {:else}
            Join Audi Shuttle
          {/if}
        </Button>
      </div>
    </Card>
  {/each}

  <Card noPadding class="empty-state-card hover-scale">
    <div class="empty-content">
      <div class="empty-icon-audi">
        <Car size={32} class="text-muted" />
      </div>
      <h3>Audi Travel Assistance</h3>
      <p>Need support coordinating customized logistics or VIP team arrivals?</p>
      <div class="empty-actions mt-2">
        <Button variant="outline" size="sm" class="rounded-btn">Fleet Support</Button>
      </div>
    </div>
  </Card>
</div>

<!-- Ride Details Modal -->
{#if selectedRide}
  <div class="modal-overlay animate-fade" onclick={() => selectedRide = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedRide = null}>&times;</button>
      
      <div class="checkout-header-banner audi-style">
        <div class="comp-badge-shop uppercase font-black text-xs tracking-wider gap-2">
          <span class="audi-dots">○○○○</span> Audi Premium Shuttle Service
        </div>
        <h2>Shuttle Details</h2>
        <p>Premium sustainable transport for {getEventName(selectedRide.eventId)}</p>
      </div>

      <div class="modal-body-container mt-6">
        <div class="shuttle-info-box">
          <div class="shuttle-info-header">
            <h4>{selectedRide.vehicle}</h4>
            <span class="shuttle-driver">Driven by {selectedRide.driver}</span>
          </div>

          <p class="shuttle-comment">"{selectedRide.comments}"</p>

          <div class="receipt-row mt-4 border-top pt-3">
            <span class="lbl">Departure Location</span>
            <span class="val font-semibold">{selectedRide.location}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Destination Venue</span>
            <span class="val font-bold text-primary">{selectedRide.destination}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Departure Time</span>
            <span class="val font-bold">{selectedRide.time}</span>
          </div>
          <div class="receipt-row">
            <span class="lbl">Fleet Compliance</span>
            <span class="val text-success font-semibold">✓ Carbon Neutral Shuttle</span>
          </div>
        </div>

        <!-- Passengers List -->
        <h4 class="mt-6 font-bold text-sm tracking-tight text-main pb-2 border-bottom">Confirmed Delegation Passengers</h4>
        <div class="passengers-avatar-list mt-3">
          {#each selectedRide.passengers as passenger}
            <div class="passenger-item-row">
              <div class="avatar-circle-placeholder">{passenger.slice(0, 2).toUpperCase()}</div>
              <div class="passenger-meta">
                <span class="passenger-name">{passenger}</span>
                <span class="passenger-role">{passenger === selectedRide.driver ? 'Lead Driver' : 'Squad Passenger'}</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="modal-actions-shuttle mt-6">
          <Button 
            variant={selectedRide.passengers.includes(activeUser) ? 'secondary' : (selectedRide.seatsTotal === selectedRide.seatsTaken ? 'outline' : 'primary')} 
            class="w-full rounded-btn justify-center"
            disabled={selectedRide.seatsTotal === selectedRide.seatsTaken && !selectedRide.passengers.includes(activeUser)}
            onclick={() => toggleJoinRide(selectedRide.id)}
          >
            {#if selectedRide.passengers.includes(activeUser)}
              Leave Shuttle Delegation
            {:else if selectedRide.seatsTotal === selectedRide.seatsTaken}
              Full Capacity
            {:else}
              Reserve My e-tron Seat
            {/if}
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Create Offer Modal -->
{#if showNewOfferModal}
  <div class="modal-overlay animate-fade" onclick={() => showNewOfferModal = false}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => showNewOfferModal = false}>&times;</button>
      
      <div class="checkout-header-banner audi-style">
        <h2>Offer Premium Shuttle</h2>
        <p>Register a carbon-neutral Audi squad carpool ride.</p>
      </div>

      <div class="modal-body-container mt-6">
        <div class="form-grid-shuttle">
          <div class="form-group">
            <label for="shuttle-vehicle">Audi Fleet Vehicle</label>
            <select id="shuttle-vehicle" bind:value={newVehicle} class="premium-input-shuttle">
              <option value="Audi RS e-tron GT">Audi RS e-tron GT (High Performance Sportback)</option>
              <option value="Audi Q8 e-tron">Audi Q8 e-tron (Premium Luxury SUV)</option>
              <option value="Audi Q4 e-tron">Audi Q4 e-tron (Sporty Compact Crossover)</option>
            </select>
          </div>

          <div class="form-group mt-3">
            <label for="shuttle-loc">Departure Location</label>
            <input 
              id="shuttle-loc" 
              type="text" 
              placeholder="e.g. Munich Center Hotel or Säbener Straße" 
              bind:value={newLocation} 
              class="premium-input-shuttle" 
            />
          </div>

          <div class="form-grid-two mt-3">
            <div class="form-group">
              <label for="shuttle-dest">Destination</label>
              <input id="shuttle-dest" type="text" bind:value={newDestination} class="premium-input-shuttle" />
            </div>
            <div class="form-group">
              <label for="shuttle-time">Departure Time</label>
              <input id="shuttle-time" type="time" bind:value={newTime} class="premium-input-shuttle" />
            </div>
          </div>

          <div class="form-group mt-3">
            <label for="shuttle-seats">Seats Available</label>
            <input id="shuttle-seats" type="number" min="1" max="7" bind:value={newSeats} class="premium-input-shuttle" />
          </div>
        </div>

        <div class="modal-actions-shuttle mt-6">
          <Button variant="primary" class="w-full rounded-btn justify-center" onclick={handleCreateOffer}>
            Create Official Shuttle Offer
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .header-title h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 850;
    color: var(--text-main);
  }

  /* Audi Fleet Banner styling */
  .audi-fleet-banner {
    height: 180px;
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
  }

  .audi-banner-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .audi-banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 100%);
    z-index: 1;
  }

  .audi-banner-content {
    position: relative;
    z-index: 2;
    padding: 2.25rem;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  .audi-branding-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .audi-badge {
    background: white;
    color: #0f172a;
    font-size: 0.625rem;
    font-weight: 800;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-sm);
    letter-spacing: 0.05em;
  }

  .audi-banner-content h3 {
    font-size: 1.75rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .audi-banner-content p {
    margin: 0.25rem 0 0;
    font-size: 0.9375rem;
    opacity: 0.9;
    max-width: 480px;
  }

  .rides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .ride-card {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid var(--border);
  }

  .ride-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    background: #fbfbfb;
    border-bottom: 1px solid var(--border);
  }

  .event-tag {
    font-size: 0.625rem;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
    margin-bottom: 0.25rem;
    display: block;
  }

  .event-name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .seats-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background-color: rgba(5, 150, 105, 0.08);
    color: #059669;
    padding: 0.375rem 0.625rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 800;
  }

  .seats-status.full {
    background-color: var(--bg-color);
    color: var(--text-muted);
  }

  .ride-body {
    padding: 1.5rem;
    flex: 1;
  }

  .audi-shuttle-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f1f5f9;
    border: 1px solid var(--border);
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 750;
    color: #1e293b;
  }

  .audi-dots {
    letter-spacing: -0.15em;
    margin-right: 0.25rem;
    font-weight: 900;
  }

  .transport-info {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .driver-avatar-audi {
    width: 52px;
    height: 52px;
    background: #0f172a;
    color: white;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .driver-avatar-audi .brand-text {
    font-size: 0.625rem;
    font-weight: 900;
    letter-spacing: -0.05em;
    text-transform: lowercase;
  }

  .info-text {
    display: flex;
    flex-direction: column;
  }

  .info-text .label {
    font-size: 0.625rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.125rem;
  }

  .info-text .value {
    font-weight: 800;
    font-size: 1.0625rem;
    color: var(--text-main);
  }

  .info-text .sub-value {
    font-size: 0.8125rem;
    color: var(--primary);
    font-weight: 700;
  }

  .ride-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
  }

  .detail-row {
    display: flex;
    gap: 1rem;
  }

  .detail-icon {
    color: var(--text-muted);
    padding-top: 0.125rem;
  }

  .detail-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .detail-text .label {
    font-size: 0.625rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-text .value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.4;
  }

  .ride-footer {
    padding: 1.25rem 1.5rem;
    background: #fbfbfb;
    border-top: 1px solid var(--border);
  }

  .empty-state-card {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--border);
    background: transparent;
    box-shadow: none;
    min-height: 300px;
  }

  .empty-content {
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty-icon-audi {
    width: 60px;
    height: 60px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border: 1px solid var(--border);
  }

  .empty-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 800;
  }

  .empty-content p {
    margin: 0 0 1rem 0;
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 240px;
    font-weight: 500;
  }

  /* Modal Details and styling */
  .checkout-header-banner.audi-style {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 2rem;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }

  .checkout-header-banner.audi-style h2 {
    color: white;
    font-size: 1.5rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .checkout-header-banner.audi-style p {
    margin: 0.25rem 0 0;
    opacity: 0.8;
    font-size: 0.875rem;
  }

  .shuttle-info-box {
    background: #fafafa;
    border: 1px solid var(--border);
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }

  .shuttle-info-header h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--text-main);
  }

  .shuttle-driver {
    font-size: 0.8125rem;
    color: var(--primary);
    font-weight: 700;
    display: block;
    margin-top: 0.125rem;
  }

  .shuttle-comment {
    font-size: 0.8125rem;
    font-style: italic;
    color: var(--text-muted);
    margin: 0.75rem 0 0 0;
    line-height: 1.5;
  }

  .passenger-item-row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.625rem 0;
  }

  .passenger-item-row:not(:last-child) {
    border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  }

  .avatar-circle-placeholder {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .passenger-meta {
    display: flex;
    flex-direction: column;
  }

  .passenger-name {
    font-size: 0.875rem;
    font-weight: 750;
    color: var(--text-main);
  }

  .passenger-role {
    font-size: 0.6875rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  /* Form controls */
  .premium-input-shuttle {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-main);
    background: white;
    outline: none;
    transition: all 0.2s;
  }

  .premium-input-shuttle:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
  }

  .form-grid-two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.375rem;
    display: block;
  }

  .border-top { border-top: 1px solid var(--border); }
  .pt-3 { padding-top: 0.75rem; }
  .pb-2 { padding-bottom: 0.5rem; }
  .pt-4 { padding-top: 1rem; }
  .border-bottom { border-bottom: 1px solid var(--border); }

  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }
</style>
