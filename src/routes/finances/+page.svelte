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
  <Card class="balance-card">
    <div class="balance-header">
      <span>Current Balance</span>
    </div>
    <div class="balance-amount">
      €{finances.balance.toFixed(2)}
    </div>
    <div class="balance-footer">
      <span class="trend positive"><ArrowUpRight size={16} /> +€350.00 this month</span>
    </div>
  </Card>

  <Card class="quick-stats">
    <div class="stat-row">
      <div class="stat-icon income"><ArrowUpRight size={20} /></div>
      <div class="stat-details">
        <span class="label">Total Income (Season)</span>
        <span class="value">€2,450.00</span>
      </div>
    </div>
    <div class="stat-row mt-4">
      <div class="stat-icon expense"><ArrowDownRight size={20} /></div>
      <div class="stat-details">
        <span class="label">Total Expenses (Season)</span>
        <span class="value">€999.50</span>
      </div>
    </div>
  </Card>
</div>

<Card title="Recent Transactions" class="mt-6">
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
          <span class="date">{tx.date}</span>
        </div>
        
        <div class="tx-amount {tx.type}">
          {tx.type === 'income' ? '+' : ''}€{Math.abs(tx.amount).toFixed(2)}
        </div>
      </div>
    {/each}
  </div>
  <Button variant="ghost" class="w-full mt-4">View All Transactions</Button>
</Card>

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

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .finances-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .finances-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  /* Balance Card */
  :global(.balance-card) {
    background: linear-gradient(135deg, var(--primary), #4a8f7c);
    color: white;
  }

  .balance-header {
    font-size: 1.125rem;
    font-weight: 500;
    opacity: 0.9;
    margin-bottom: 0.5rem;
  }

  .balance-amount {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    display: inline-flex;
  }

  /* Quick Stats */
  .stat-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-icon.income {
    background-color: #ecfdf5;
    color: #059669;
  }

  .stat-icon.expense {
    background-color: #fef2f2;
    color: #dc2626;
  }

  .stat-details {
    display: flex;
    flex-direction: column;
  }

  .stat-details .label {
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .stat-details .value {
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Transactions List */
  .transactions-list {
    display: flex;
    flex-direction: column;
  }

  .transaction-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
  }

  .transaction-item:last-child {
    border-bottom: none;
  }

  .tx-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
  }

  .tx-icon.income { background-color: #ecfdf5; color: #059669; }
  .tx-icon.expense { background-color: #fef2f2; color: #dc2626; }

  .tx-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tx-details .desc {
    font-weight: 500;
  }

  .tx-details .date {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .tx-amount {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .tx-amount.income { color: var(--success); }
  .tx-amount.expense { color: var(--text-main); } /* Keep expense dark instead of red for cleaner look */

  :global(.mt-6) { margin-top: 1.5rem; }
  :global(.mt-4) { margin-top: 1rem; }
  :global(.w-full) { width: 100%; }
</style>
