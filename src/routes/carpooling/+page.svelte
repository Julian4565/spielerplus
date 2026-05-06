<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { carpoolRides, events } from '$lib/stores/mockData.svelte';
  import { Car, MapPin, Users, Plus } from 'lucide-svelte';

  function getEventName(eventId: string) {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  }
</script>

<div class="page-header">
  <h2>Carpooling</h2>
  <Button variant="primary"><Plus size={18} /> Offer Ride</Button>
</div>

<div class="rides-grid">
  {#each carpoolRides as ride}
    <Card class="ride-card">
      <div class="ride-header">
        <div class="event-info">
          <span class="event-name">{getEventName(ride.eventId)}</span>
        </div>
        <div class="seats-badge">
          {ride.seatsTotal - ride.seatsTaken} seats left
        </div>
      </div>
      
      <div class="ride-body">
        <div class="driver-info">
          <Car size={24} class="text-primary" />
          <div class="info-text">
            <span class="label">Driver</span>
            <span class="value">{ride.driver}</span>
          </div>
        </div>
        
        <div class="ride-details">
          <div class="detail-row">
            <MapPin size={16} class="text-muted" />
            <span>Leaving from: <strong>{ride.location}</strong></span>
          </div>
          <div class="detail-row">
            <Users size={16} class="text-muted" />
            <span>Passengers: {ride.passengers.join(', ')}</span>
          </div>
        </div>
      </div>
      
      <div class="ride-actions">
        <Button 
          variant="outline" 
          class="w-full"
          disabled={ride.seatsTotal === ride.seatsTaken}
        >
          {ride.seatsTotal === ride.seatsTaken ? 'Full' : 'Join Ride'}
        </Button>
      </div>
    </Card>
  {/each}

  <Card class="empty-state-card text-center">
    <div class="empty-icon">
      <Car size={48} class="text-muted opacity-50" />
    </div>
    <h3>No more rides available</h3>
    <p class="text-muted">Need a ride? Ask the team or offer one yourself!</p>
    <Button variant="secondary" class="mt-4">Request Ride</Button>
  </Card>
</div>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .page-header h2 {
    margin: 0;
  }

  .rides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .ride-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .event-name {
    font-weight: 600;
    color: var(--primary);
  }

  .seats-badge {
    background-color: #ecfdf5;
    color: #059669;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .driver-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .info-text {
    display: flex;
    flex-direction: column;
  }

  .info-text .label {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .info-text .value {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .ride-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-main);
  }

  .empty-state-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--border);
    background: transparent;
    box-shadow: none;
  }

  .empty-icon {
    margin-bottom: 1rem;
  }

  :global(.empty-state-card .card-body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  :global(.w-full) { width: 100%; }
  :global(.mt-4) { margin-top: 1rem; }
  :global(.text-primary) { color: var(--primary); }
</style>
