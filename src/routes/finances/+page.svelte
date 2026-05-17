<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { finances } from '$lib/stores/mockData.svelte';
  import { ArrowUpRight, ArrowDownRight, Plus, Download, Calendar, DollarSign, ShieldAlert, Award } from 'lucide-svelte';

  let selectedTx = $state<any>(null);

  function openTransactionDetails(tx: any) {
    // Generate realistic, consistent transaction details based on description
    const methods = ['Bank Wire', 'PayPal Club-Account', 'Cash Vault', 'Direct Debit'];
    const users = ['Vincent Kompany', 'Max Eberl', 'Julian (Admin)', 'Herbert Hainer'];
    
    selectedTx = {
      ...tx,
      refId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}-FCB`,
      method: methods[Math.floor(Math.random() * methods.length)],
      authorizedBy: users[Math.floor(Math.random() * users.length)],
      status: 'Settled',
      timestamp: new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  }
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
      <div role="button" tabindex="0" onclick={() => openTransactionDetails(tx)} class="transaction-item clickable-tx-row">
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

{#if selectedTx}
  <div class="modal-overlay animate-fade" onclick={() => selectedTx = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedTx = null}>&times;</button>
      
      <div class="modal-header-banner">
        <div class="tx-category-badge {selectedTx.type}">
          <span>{selectedTx.category || 'Club Expense'}</span>
        </div>
        <h2 class="tx-modal-desc">{selectedTx.description}</h2>
        <span class="tx-modal-ref">Receipt Reference: {selectedTx.refId}</span>
      </div>

      <div class="modal-amount-display {selectedTx.type}">
        <span class="amount-prefix">{selectedTx.type === 'income' ? '+' : '-'}</span>
        <span class="amount-val">€{Math.abs(selectedTx.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
      </div>

      <div class="modal-body-container">
        <div class="tx-receipt-card">
          <h4>🧾 Transaction Ledger Details</h4>
          
          <div class="receipt-row">
            <span class="lbl">Ledger Status</span>
            <span class="val text-success">● {selectedTx.status}</span>
          </div>

          <div class="receipt-row">
            <span class="lbl">Value Date</span>
            <span class="val">{selectedTx.timestamp}</span>
          </div>

          <div class="receipt-row">
            <span class="lbl">Payment Method</span>
            <span class="val">{selectedTx.method}</span>
          </div>

          <div class="receipt-row">
            <span class="lbl">Authorized Signatory</span>
            <span class="val">{selectedTx.authorizedBy}</span>
          </div>

          <div class="receipt-row">
            <span class="lbl">Compliance Code</span>
            <span class="val">FCB-FIN-{(Math.floor(1000 + Math.random() * 9000))}</span>
          </div>
        </div>

        <div class="receipt-notice">
          <p>⚠️ This transaction has been officially logged in the FC Bayern SpielerPlus database. Any modifications require secondary supervisor approval.</p>
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

  /* Clickable Transaction Row pointer */
  .clickable-tx-row {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clickable-tx-row:hover {
    background-color: rgba(15, 23, 42, 0.03) !important;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }

  /* Interactive Premium Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 1.5rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 580px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
    color: var(--text-main);
    border: 1px solid var(--border);
  }

  .close-btn {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: rgba(15, 23, 42, 0.05);
    border: none;
    font-size: 1.75rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .close-btn:hover {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  .modal-header-banner {
    padding: 3rem 2rem 1.5rem;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, transparent 100%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px dashed var(--border);
  }

  .tx-category-badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .tx-category-badge.income {
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
  }

  .tx-category-badge.expense {
    background-color: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  .tx-modal-desc {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
    text-align: center;
  }

  .tx-modal-ref {
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .modal-amount-display {
    padding: 2rem 2rem;
    text-align: center;
    background: #fafafa;
    border-bottom: 1px dashed var(--border);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-amount-display.income {
    color: var(--success);
  }

  .modal-amount-display.expense {
    color: var(--danger);
  }

  .amount-prefix {
    font-size: 2.25rem;
    font-weight: 900;
    margin-right: 0.25rem;
  }

  .amount-val {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  .modal-body-container {
    padding: 2rem;
  }

  .tx-receipt-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }

  .tx-receipt-card h4 {
    margin: 0 0 1.25rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
    border-bottom: 2px solid rgba(15, 23, 42, 0.05);
    padding-bottom: 0.5rem;
  }

  .receipt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(15, 23, 42, 0.03);
    font-size: 0.9375rem;
  }

  .receipt-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .receipt-row .lbl {
    color: var(--text-muted);
    font-weight: 500;
  }

  .receipt-row .val {
    font-weight: 700;
    color: var(--text-main);
  }

  .receipt-notice {
    margin-top: 1.5rem;
    background: rgba(245, 158, 11, 0.04);
    border: 1px solid rgba(245, 158, 11, 0.15);
    border-radius: var(--radius-sm);
    padding: 0.875rem 1.125rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #b45309;
    line-height: 1.4;
  }

  .animate-fade {
    animation: overlayFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-in {
    animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes overlayFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
