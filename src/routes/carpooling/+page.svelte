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
  <h2>Travel Management</h2>
  <Button variant="primary" class="rounded-btn"><Plus size={18} /> Offer Premium Ride</Button>
</div>

<div class="rides-grid">
  {#each carpoolRides as ride}
    <Card noPadding class="ride-card hover-scale">
      <div class="ride-header">
        <div class="event-info">
          <span class="event-tag">Event</span>
          <h4 class="event-name">{getEventName(ride.eventId)}</h4>
        </div>
        <div class="seats-status" class:full={ride.seatsTotal === ride.seatsTaken}>
          <Users size={14} />
          {ride.seatsTotal - ride.seatsTaken} seats left
        </div>
      </div>
      
      <div class="ride-body">
        <div class="transport-info">
          <div class="driver-avatar">
            <Car size={24} />
          </div>
          <div class="info-text">
            <span class="label">LEAD DRIVER</span>
            <span class="value">{ride.driver}</span>
          </div>
        </div>
        
        <div class="ride-details">
          <div class="detail-row">
            <div class="detail-icon"><MapPin size={16} /></div>
            <div class="detail-text">
              <span class="label">DEPARTURE</span>
              <span class="value">{ride.location}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-icon"><Users size={16} /></div>
            <div class="detail-text">
              <span class="label">PASSENGERS</span>
              <span class="value">{ride.passengers.join(', ') || 'None yet'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="ride-footer">
        <Button 
          variant={ride.seatsTotal === ride.seatsTaken ? 'outline' : 'primary'} 
          class="w-full rounded-btn"
          disabled={ride.seatsTotal === ride.seatsTaken}
        >
          {ride.seatsTotal === ride.seatsTaken ? 'Full Capacity' : 'Join Delegation'}
        </Button>
      </div>
    </Card>
  {/each}

  <Card noPadding class="empty-state-card hover-scale">
    <div class="empty-content">
      <div class="empty-icon">
        <Car size={40} />
      </div>
      <h3>Alternative Transport</h3>
      <p>Need specialized transport or want to coordinate a new route?</p>
      <div class="empty-actions">
        <Button variant="outline" size="sm" class="rounded-btn">Request Route</Button>
        <Button variant="ghost" size="sm" class="rounded-btn">Team Logistics</Button>
      </div>
    </div>
  </Card>
</div>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .rides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .ride-card {
    display: flex;
    flex-direction: column;
  }

  .ride-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    background: #fcfcfc;
    border-bottom: 1px solid var(--border);
  }

  .event-tag {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
    display: block;
  }

  .event-name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .seats-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(5, 150, 105, 0.08);
    color: #059669;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .seats-status.full {
    background-color: #f1f5f9;
    color: #64748b;
  }

  .ride-body {
    padding: 1.5rem;
    flex: 1;
  }

  .transport-info {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .driver-avatar {
    width: 48px;
    height: 48px;
    background: var(--bg-color);
    color: var(--primary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
  }

  .info-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .info-text .label {
    font-size: 0.625rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-text .value {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--text-main);
  }

  .ride-details {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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
    font-weight: 700;
    color: var(--text-muted);
  }

  .detail-text .value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.4;
  }

  .ride-footer {
    padding: 1.5rem;
    background: #fcfcfc;
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

  .empty-icon {
    width: 64px;
    height: 64px;
    background: var(--bg-color);
    color: var(--text-muted);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    opacity: 0.6;
  }

  .empty-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .empty-content p {
    margin: 0 0 1.5rem 0;
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 240px;
  }

  .empty-actions {
    display: flex;
    gap: 0.75rem;
  }

  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }
</style>

