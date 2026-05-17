<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { finances } from '$lib/stores/mockData.svelte';
  import { ArrowUpRight, ArrowDownRight, Plus, Download } from 'lucide-svelte';
</script>

<div class="page-header">
  <h2>Team Finances</h2>
  <div class="header-actions">
    <Button variant="outline"><Download size={18} /> Export</Button>
    <Button variant="primary"><Plus size={18} /> New Transaction</Button>
  </div>
</div>

<div class="finances-grid">
  <!-- Balance Overview -->
  <Card class="balance-card hover-scale">
    <div class="balance-header">
      <span>Total Club Liquidity</span>
      <span class="fiscal-year">FY 2026/27</span>
    </div>
    <div class="balance-amount">
      €{finances.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
    </div>
    <div class="balance-footer">
      <span class="trend positive"><ArrowUpRight size={16} /> +€12.5M sponsorship deal</span>
    </div>
  </Card>

  <Card class="quick-stats hover-scale">
    <div class="stat-row">
      <div class="stat-icon income"><ArrowUpRight size={20} /></div>
      <div class="stat-details">
        <span class="label">Operating Income</span>
        <span class="value">€1.42B</span>
      </div>
    </div>
    <div class="stat-row mt-6">
      <div class="stat-icon expense"><ArrowDownRight size={20} /></div>
      <div class="stat-details">
        <span class="label">Transfer Budget (Rem.)</span>
        <span class="value">€185.0M</span>
      </div>
    </div>
  </Card>
</div>

<Card title="Recent Transactions" class="mt-8 hover-scale">
  <div class="transactions-list">
    {#each finances.transactions as tx}
      <div class="transaction-item">
        <div class="tx-icon {tx.type}">
          {#if tx.type === 'income'}
            <ArrowUpRight size={20} />
          {:else}
            <ArrowDownRight size={20} />
          {/if}
        </div>
        
        <div class="tx-details">
          <span class="desc">{tx.description}</span>
          <span class="date">{tx.date} • {tx.category || 'General'}</span>
        </div>
        
        <div class="tx-amount {tx.type}">
          {tx.type === 'income' ? '+' : '-'}€{Math.abs(tx.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
        </div>
      </div>
    {/each}
  </div>
  <Button variant="ghost" class="w-full mt-6 rounded-btn">View Full Audit Trail</Button>
</Card>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .finances-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .finances-grid {
      grid-template-columns: 1.5fr 1fr;
    }
  }

  /* Balance Card */
  :global(.balance-card) {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    border: none !important;
    position: relative;
    overflow: hidden;
  }

  :global(.balance-card::before) {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.7;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .balance-amount {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
  }

  .trend {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    display: inline-flex;
    font-weight: 600;
  }

  /* Quick Stats */
  .stat-row {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
  }

  .stat-icon.income {
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
  }

  .stat-icon.expense {
    background-color: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  .stat-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-details .label {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .stat-details .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-main);
  }

  /* Transactions List */
  .transactions-list {
    display: flex;
    flex-direction: column;
  }

  .transaction-item {
    display: flex;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }

  .transaction-item:hover {
    background: rgba(0,0,0,0.01);
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: var(--radius-md);
  }

  .transaction-item:last-child {
    border-bottom: none;
  }

  .tx-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
  }

  .tx-icon.income { background-color: #f0fdf4; color: #16a34a; }
  .tx-icon.expense { background-color: #fff1f2; color: #e11d48; }

  .tx-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .tx-details .desc {
    font-weight: 800;
    font-size: 1.125rem;
    color: var(--text-main);
  }

  .tx-details .date {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .tx-amount {
    font-weight: 900;
    font-size: 1.5rem;
    letter-spacing: -0.02em;
  }

  .tx-amount.income { color: var(--success); }
  .tx-amount.expense { color: var(--danger); }

  :global(.mt-8) { margin-top: 2rem; }
  :global(.mt-6) { margin-top: 1.5rem; }
  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }
</style>
