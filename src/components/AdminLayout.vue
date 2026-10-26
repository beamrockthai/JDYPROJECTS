<script setup>
  import { ArrowUpRight, LayoutDashboard, LogOut, Monitor, Inbox } from 'lucide-vue-next'
  import { useLanguage } from '../composables/useLanguage'
  import { clearAdminSession, getAdminSession } from '../services/adminService'

  defineProps({
    active: { type: String, required: true },
    title: { type: String, required: true },
  })

  const { language, setLanguage, t } = useLanguage()
  const session = getAdminSession()

  // Guard: only signed-in admins can view admin pages.
  if (!session) {
    window.location.replace('/admin')
  }

  function signOut() {
    clearAdminSession()
    window.location.assign('/admin')
  }

  const languageOptions = [
    { code: 'th', label: 'TH', accessibleLabel: 'เปลี่ยนเป็นภาษาไทย' },
    { code: 'en', label: 'EN', accessibleLabel: 'Switch to English' },
    { code: 'zh', label: '中文', accessibleLabel: '切换至简体中文' },
  ]
</script>

<template>
  <div v-if="session" class="dashboard-layout">
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">
        JYD
        <span>
          CORPORATION
          <br />
          ADMIN PORTAL
        </span>
      </div>
      <p class="sidebar-caption">{{ t('Workspace') }}</p>
      <nav class="dashboard-navigation" :aria-label="t('Admin navigation')">
        <a
          href="/admin/overview"
          class="sidebar-link"
          :class="{ active: active === 'overview' }"
          :aria-current="active === 'overview' ? 'page' : undefined"
        >
          <LayoutDashboard :size="19" />
          {{ t('Overview') }}
        </a>
        <a
          href="/admin/dashboard"
          class="sidebar-link"
          :class="{ active: active === 'dashboard' }"
          :aria-current="active === 'dashboard' ? 'page' : undefined"
        >
          <Inbox :size="19" />
          {{ t('Dashboard') }}
        </a>
        <a href="/" class="sidebar-link" target="_blank" rel="noopener noreferrer">
          <Monitor :size="19" />
          {{ t('View website') }}
          <ArrowUpRight :size="15" />
        </a>
      </nav>
      <div class="sidebar-bottom">
        <span class="sidebar-demo">{{ t('Signed in as') }}</span>
        <p>{{ session.full_name || session.username }}</p>
        <button type="button" class="sidebar-link sidebar-logout" @click="signOut">
          <LogOut :size="18" />
          {{ t('Sign out') }}
        </button>
      </div>
    </aside>

    <div class="dashboard-main">
      <header class="dashboard-topbar">
        <div class="dashboard-breadcrumb">
          JYD
          <span>/</span>
          {{ title }}
        </div>
        <div class="dashboard-languages" role="group" aria-label="Language / ภาษา / 语言">
          <button
            v-for="option in languageOptions"
            :key="option.code"
            type="button"
            :class="{ selected: language === option.code }"
            :aria-pressed="language === option.code"
            :aria-label="option.accessibleLabel"
            @click="setLanguage(option.code)"
          >
            {{ option.label }}
          </button>
        </div>
      </header>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .dashboard-layout {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 230px minmax(0, 1fr);
    background: #f3f6fa;
  }
  .dashboard-sidebar {
    background: #102c48;
    color: #d2e1ec;
    padding: 35px 20px 20px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100dvh;
  }
  .dashboard-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 9px 35px;
    color: #fff;
    font-size: 37px;
    font-weight: 800;
    letter-spacing: -2px;
  }
  .dashboard-brand span {
    font-size: 8px;
    letter-spacing: 1.4px;
    line-height: 1.8;
    border-left: 1px solid #ffffff30;
    padding-left: 13px;
  }
  .sidebar-caption {
    padding: 0 13px;
    font-size: 10px;
    color: #829db3;
    margin: 10px 0;
  }
  .dashboard-navigation {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: auto;
    gap: 6px;
  }
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px;
    font-size: 12px;
    border-radius: 5px;
    height: auto;
    width: 100%;
    background: transparent;
    border: 0;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
  }
  .sidebar-link.active {
    background: #ffffff12;
    color: #fff;
  }
  .sidebar-link:hover {
    background: #ffffff0c;
    color: #fff;
  }
  .sidebar-link::after {
    display: none;
  }
  .sidebar-link > svg:last-child:not(:first-child) {
    margin-left: auto;
  }
  .sidebar-bottom {
    margin-top: auto;
    padding-top: 40px;
  }
  .sidebar-demo {
    display: inline-block;
    background: #ffffff12;
    padding: 5px 10px;
    font-size: 9px;
    border-radius: 4px;
  }
  .sidebar-bottom p {
    font-size: 12px;
    color: #fff;
    margin: 10px 0 14px;
  }
  .dashboard-main {
    min-width: 0;
  }
  .dashboard-topbar {
    min-height: 76px;
    background: #fff;
    border-bottom: 1px solid #e5ebf1;
    padding: 16px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }
  .dashboard-breadcrumb {
    font-size: 12px;
    font-weight: 600;
  }
  .dashboard-breadcrumb span {
    margin: 0 12px;
    color: #a1afbb;
  }
  .dashboard-languages {
    display: flex;
    gap: 4px;
  }
  .dashboard-languages button {
    border: 0;
    background: transparent;
    color: #718495;
    min-height: 40px;
    padding: 8px 11px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
  }
  .dashboard-languages button.selected {
    background: #edf6fb;
    color: #0076be;
  }
  @media (max-width: 1150px) {
    .dashboard-layout {
      grid-template-columns: 195px minmax(0, 1fr);
    }
    .dashboard-sidebar {
      padding-inline: 14px;
    }
    .dashboard-topbar {
      padding-inline: 22px;
    }
  }
  @media (max-width: 800px) {
    .dashboard-layout {
      grid-template-columns: 1fr;
    }
    .dashboard-sidebar {
      position: static;
      height: auto;
      padding: 16px 20px;
      flex-direction: row;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .dashboard-brand {
      padding: 0;
      font-size: 30px;
    }
    .sidebar-caption,
    .sidebar-bottom {
      display: none;
    }
    .dashboard-navigation {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 4px;
    }
    .dashboard-navigation .sidebar-link {
      font-size: 11px;
      padding: 10px;
      width: auto;
    }
    .dashboard-topbar {
      min-height: 65px;
      padding: 10px 20px;
    }
  }
</style>
