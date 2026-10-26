<script setup>
  import {
    CheckCircle2,
    Clock3,
    Inbox,
    Mail,
    Phone,
    RefreshCw,
    Search,
    Trash2,
    Loader,
    X,
  } from 'lucide-vue-next'
  import AdminLayout from '../../components/AdminLayout.vue'
  import {
    statusOptions,
    useAdminDashboardController,
  } from '../../controllers/useAdminDashboardController'

  const {
    t,
    loading,
    loadError,
    search,
    statusFilter,
    counts,
    filtered,
    statusLabels,
    selected,
    notesDraft,
    saving,
    toast,
    formatDate,
    formatService,
    load,
    changeStatus,
    openDetail,
    closeDetail,
    saveNotes,
    removeInquiry,
  } = useAdminDashboardController()

  const stats = [
    { key: 'all', icon: Inbox, tone: 'blue' },
    { key: 'pending', icon: Clock3, tone: 'amber' },
    { key: 'contacted', icon: Phone, tone: 'teal' },
    { key: 'in_progress', icon: Loader, tone: 'violet' },
    { key: 'closed', icon: CheckCircle2, tone: 'green' },
  ]
</script>

<template>
  <AdminLayout active="dashboard" :title="t('Dashboard')">

      <main class="dashboard-content" aria-labelledby="dashboard-title">
        <div class="dashboard-heading">
          <div>
            <p class="dashboard-eyebrow">ADMIN DASHBOARD</p>
            <h1 id="dashboard-title">{{ t('Customer inquiries') }}</h1>
          </div>
          <button type="button" class="refresh-button" :disabled="loading" @click="load">
            <RefreshCw :size="16" :class="{ spin: loading }" />
            {{ t('Refresh') }}
          </button>
        </div>

        <section class="stat-grid">
          <button
            v-for="stat in stats"
            :key="stat.key"
            type="button"
            class="stat-card"
            :class="[stat.tone, { active: statusFilter === stat.key }]"
            @click="statusFilter = stat.key"
          >
            <span class="stat-icon"><component :is="stat.icon" :size="22" /></span>
            <span class="stat-text">
              <small>{{ stat.key === 'all' ? t('Total') : statusLabels[stat.key] }}</small>
              <strong>{{ counts[stat.key] }}</strong>
            </span>
          </button>
        </section>

        <section class="list-card" aria-labelledby="list-title">
          <div class="list-toolbar">
            <h2 id="list-title">{{ t('Inquiry list') }}</h2>
            <div class="list-filters">
              <label class="search-box">
                <Search :size="16" />
                <input
                  v-model="search"
                  type="search"
                  :placeholder="t('Search name, company, phone, email...')"
                />
              </label>
              <select v-model="statusFilter" :aria-label="t('Status')">
                <option value="all">{{ t('All statuses') }}</option>
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ statusLabels[status] }}
                </option>
              </select>
            </div>
          </div>

          <div class="table-wrap">
            <table class="inquiry-table">
              <thead>
                <tr>
                  <th>{{ t('Received') }}</th>
                  <th>{{ t('Name') }}</th>
                  <th>{{ t('Company') }}</th>
                  <th>{{ t('Contact') }}</th>
                  <th>{{ t('Service') }}</th>
                  <th>{{ t('Message') }}</th>
                  <th>{{ t('Status') }}</th>
                  <th class="col-actions"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="8" class="table-empty">{{ t('Loading...') }}</td>
                </tr>
                <tr v-else-if="loadError">
                  <td colspan="8" class="table-empty error">
                    {{ t('Failed to load data. Check the database connection.') }}
                  </td>
                </tr>
                <tr v-else-if="!filtered.length">
                  <td colspan="8" class="table-empty">{{ t('No inquiries found') }}</td>
                </tr>
                <template v-else>
                  <tr
                    v-for="item in filtered"
                    :key="item.id"
                    :class="{ fresh: item.status === 'pending' }"
                    @click="openDetail(item)"
                  >
                    <td class="nowrap">{{ formatDate(item.created_at) }}</td>
                    <td class="strong">{{ item.name }}</td>
                    <td>{{ item.company || 'â€”' }}</td>
                    <td class="contact-cell">
                      <a :href="`tel:${item.phone}`" @click.stop>
                        <Phone :size="13" /> {{ item.phone }}
                      </a>
                      <a :href="`mailto:${item.email}`" @click.stop>
                        <Mail :size="13" /> {{ item.email }}
                      </a>
                    </td>
                    <td class="nowrap">{{ formatService(item.service) }}</td>
                    <td class="message-cell">{{ item.message }}</td>
                    <td @click.stop>
                      <select
                        class="status-select"
                        :class="item.status"
                        :value="item.status"
                        :aria-label="t('Status')"
                        @change="changeStatus(item, $event.target.value)"
                      >
                        <option v-for="status in statusOptions" :key="status" :value="status">
                          {{ statusLabels[status] }}
                        </option>
                      </select>
                    </td>
                    <td class="col-actions" @click.stop>
                      <button
                        type="button"
                        class="icon-button danger"
                        :aria-label="t('Delete')"
                        @click="removeInquiry(item)"
                      >
                        <Trash2 :size="16" />
                      </button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <p class="list-footer">
            {{ t('Showing') }} {{ filtered.length }} {{ t('of') }} {{ counts.all }} {{ t('items') }}
          </p>
        </section>
      </main>
    </AdminLayout>

    <Transition name="drawer">
      <div v-if="selected" class="drawer-backdrop" @click.self="closeDetail">
        <aside class="drawer" role="dialog" aria-modal="true" :aria-label="t('Message')">
          <div class="drawer-head">
            <div>
              <p class="dashboard-eyebrow">#{{ selected.id }}</p>
              <h2>{{ selected.name }}</h2>
              <span class="drawer-company">{{ selected.company || '—' }}</span>
            </div>
            <button type="button" class="icon-button" :aria-label="t('Close')" @click="closeDetail">
              <X :size="20" />
            </button>
          </div>

          <dl class="drawer-info">
            <div>
              <dt>{{ t('Phone number') }}</dt>
              <dd><a :href="`tel:${selected.phone}`">{{ selected.phone }}</a></dd>
            </div>
            <div>
              <dt>{{ t('Email') }}</dt>
              <dd><a :href="`mailto:${selected.email}`">{{ selected.email }}</a></dd>
            </div>
            <div>
              <dt>{{ t('Service') }}</dt>
              <dd>
                <span>{{ formatService(selected.service) }}</span>
                <span
                  v-if="selected.service && formatService(selected.service) !== selected.service"
                  class="service-secondary"
                >
                  ({{ selected.service }})
                </span>
              </dd>
            </div>
            <div>
              <dt>{{ t('Received') }}</dt>
              <dd>{{ formatDate(selected.created_at) }}</dd>
            </div>
            <div>
              <dt>{{ t('Last contacted') }}</dt>
              <dd>{{ formatDate(selected.contacted_at) }}</dd>
            </div>
          </dl>

          <h3>{{ t('Message') }}</h3>
          <p class="drawer-message">{{ selected.message }}</p>

          <label class="drawer-label" for="drawer-status">{{ t('Status') }}</label>
          <select
            id="drawer-status"
            class="status-select wide"
            :class="selected.status"
            :value="selected.status"
            @change="changeStatus(selected, $event.target.value)"
          >
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ statusLabels[status] }}
            </option>
          </select>

          <label class="drawer-label" for="drawer-notes">{{ t('Admin notes') }}</label>
          <textarea
            id="drawer-notes"
            v-model="notesDraft"
            rows="5"
            :placeholder="t('Add a note after contacting the customer...')"
          ></textarea>

          <div class="drawer-actions">
            <button type="button" class="primary-button" :disabled="saving" @click="saveNotes">
              {{ t('Save') }}
            </button>
            <a class="secondary-button" :href="`tel:${selected.phone}`">
              <Phone :size="16" /> {{ t('Call') }}
            </a>
            <button type="button" class="icon-button danger" :aria-label="t('Delete')" @click="removeInquiry(selected)">
              <Trash2 :size="17" />
            </button>
          </div>
        </aside>
      </div>
    </Transition>

    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
</template>

<style scoped>
  /* Full-width content area */
  .dashboard-content {
    width: 100%;
    max-width: none;
    padding: 32px 36px 40px;
    margin: 0;
  }
  .dashboard-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }
  .dashboard-eyebrow {
    color: #0082bf;
    font-size: 9px;
    letter-spacing: 1.8px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .dashboard-heading h1 {
    font-size: 27px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.5px;
  }
  .refresh-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #d9e3ec;
    background: #fff;
    color: #234;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .refresh-button:hover {
    border-color: #0082bf;
    color: #0082bf;
  }
  .spin {
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    border: 1px solid #e2eaf1;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      border-color 0.15s;
  }
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px #10304a14;
  }
  .stat-card.active {
    border-color: #0082bf;
    box-shadow: 0 0 0 3px #0082bf22;
  }
  .stat-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .stat-card.blue .stat-icon {
    background: #e6f2fa;
    color: #0678b3;
  }
  .stat-card.amber .stat-icon {
    background: #fff3dc;
    color: #c07a00;
  }
  .stat-card.teal .stat-icon {
    background: #dff5f2;
    color: #0b8a7e;
  }
  .stat-card.violet .stat-icon {
    background: #eee9fb;
    color: #6a49c4;
  }
  .stat-card.green .stat-icon {
    background: #e2f6e8;
    color: #1d8a45;
  }
  .stat-text small {
    display: block;
    font-size: 11px;
    color: #7c8f9f;
  }
  .stat-text strong {
    display: block;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.4;
    color: #14293c;
  }

  .list-card {
    width: 100%;
    background: #fff;
    border: 1px solid #e2eaf1;
    border-radius: 8px;
    overflow: hidden;
  }
  .list-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 22px;
    border-bottom: 1px solid #edf1f5;
    flex-wrap: wrap;
  }
  .list-toolbar h2 {
    font-size: 16px;
    font-weight: 600;
  }
  .list-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #d9e3ec;
    border-radius: 6px;
    padding: 0 12px;
    background: #fafcfe;
    color: #7c8f9f;
    min-width: 280px;
  }
  .search-box input {
    border: 0;
    background: transparent;
    outline: 0;
    padding: 10px 0;
    font-size: 12px;
    width: 100%;
    font-family: inherit;
  }
  .list-filters > select {
    border: 1px solid #d9e3ec;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 12px;
    background: #fafcfe;
    font-family: inherit;
    min-height: 40px;
  }
  .table-wrap {
    overflow-x: auto;
  }
  .inquiry-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .inquiry-table th {
    text-align: left;
    padding: 13px 16px;
    font-size: 10px;
    letter-spacing: 0.4px;
    color: #7c8f9f;
    background: #f7f9fc;
    border-bottom: 1px solid #e7edf3;
    white-space: nowrap;
    font-weight: 600;
  }
  .inquiry-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #eef2f6;
    vertical-align: top;
    line-height: 1.6;
  }
  .inquiry-table tbody tr {
    cursor: pointer;
    transition: background 0.12s;
  }
  .inquiry-table tbody tr:hover {
    background: #f5f9fd;
  }
  .inquiry-table tbody tr.fresh td:first-child {
    box-shadow: inset 3px 0 0 #f0a020;
  }
  .nowrap {
    white-space: nowrap;
  }
  .strong {
    font-weight: 600;
    color: #14293c;
  }
  .contact-cell a {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #31566f;
    white-space: nowrap;
  }
  .contact-cell a:hover {
    color: #0082bf;
  }
  .message-cell {
    max-width: 340px;
    color: #55697a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .col-actions {
    width: 50px;
    text-align: center;
  }
  .table-empty {
    text-align: center;
    padding: 60px 16px !important;
    color: #8798a6;
  }
  .table-empty.error {
    color: #c0392b;
  }
  .list-footer {
    padding: 14px 22px;
    font-size: 11px;
    color: #8b9ba8;
    border-top: 1px solid #edf1f5;
  }

  .status-select {
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    min-height: 32px;
  }
  .status-select.wide {
    width: 100%;
    border-radius: 6px;
    padding: 10px 12px;
  }
  .status-select.pending {
    background: #fff3dc;
    color: #a86a00;
  }
  .status-select.contacted {
    background: #dff5f2;
    color: #0b786e;
  }
  .status-select.in_progress {
    background: #eee9fb;
    color: #5b3fb0;
  }
  .status-select.closed {
    background: #e2f6e8;
    color: #1a773c;
  }

  .icon-button {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #7c8f9f;
    cursor: pointer;
  }
  .icon-button:hover {
    background: #eef3f8;
    color: #14293c;
  }
  .icon-button.danger:hover {
    background: #fdecea;
    color: #c0392b;
  }

  .drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 29, 45, 0.45);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    display: flex;
    justify-content: flex-end;
    z-index: 50;
  }
  .drawer {
    width: min(480px, 100%);
    background: #fff;
    height: 100%;
    overflow-y: auto;
    padding: 28px;
    box-shadow: -12px 0 40px rgba(11, 29, 45, 0.2);
    will-change: transform;
  }

  /* Smooth Slide & Fade Transition */
  .drawer-enter-active,
  .drawer-leave-active {
    transition: opacity 0.28s ease;
  }
  .drawer-enter-active .drawer,
  .drawer-leave-active .drawer {
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drawer-enter-from,
  .drawer-leave-to {
    opacity: 0;
  }
  .drawer-enter-from .drawer,
  .drawer-leave-to .drawer {
    transform: translateX(100%);
  }
  .drawer-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  .drawer-head h2 {
    font-size: 21px;
    font-weight: 600;
  }
  .drawer-company {
    font-size: 12px;
    color: #7c8f9f;
  }
  .drawer-info {
    margin: 0 0 20px;
    border: 1px solid #edf1f5;
    border-radius: 8px;
    padding: 6px 16px;
  }
  .drawer-info > div {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 12px;
    padding: 10px 0;
    font-size: 12px;
    border-bottom: 1px solid #f1f4f7;
  }
  .drawer-info > div:last-child {
    border-bottom: 0;
  }
  .drawer-info dt {
    color: #8798a6;
  }
  .drawer-info dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .service-secondary {
    display: inline-block;
    margin-left: 6px;
    font-size: 11px;
    color: #8fa0af;
    font-weight: 400;
  }
  .drawer-info a {
    color: #0678b3;
  }
  .drawer h3 {
    font-size: 12px;
    color: #7c8f9f;
    margin-bottom: 8px;
    font-weight: 600;
  }
  .drawer-message {
    background: #f7f9fc;
    border-radius: 8px;
    padding: 14px;
    font-size: 13px;
    line-height: 1.8;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    margin-bottom: 20px;
  }
  .drawer-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin: 16px 0 8px;
    color: #31566f;
  }
  .drawer textarea {
    width: 100%;
    border: 1px solid #d9e3ec;
    border-radius: 6px;
    padding: 12px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
  }
  .drawer-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 20px;
  }
  .primary-button,
  .secondary-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid transparent;
  }
  .primary-button {
    background: #0082bf;
    color: #fff;
  }
  .primary-button:hover {
    background: #006fa5;
  }
  .primary-button:disabled {
    opacity: 0.6;
  }
  .secondary-button {
    background: #fff;
    border-color: #d9e3ec;
    color: #14293c;
  }
  .secondary-button:hover {
    border-color: #0082bf;
    color: #0082bf;
  }
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #102c48;
    color: #fff;
    padding: 12px 22px;
    border-radius: 999px;
    font-size: 12px;
    z-index: 60;
    box-shadow: 0 10px 30px #0b1d2d44;
  }

  @media (max-width: 1150px) {
    .dashboard-content {
      padding: 26px 22px;
    }
    .stat-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 800px) {
    .dashboard-content {
      padding: 22px 16px;
    }
    .dashboard-heading h1 {
      font-size: 22px;
    }
    .stat-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .search-box {
      min-width: 0;
      flex: 1;
    }
  }

</style>
