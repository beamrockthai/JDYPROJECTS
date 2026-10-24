<script setup>
  import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    CloudSun,
    FileText,
    Globe2,
    Images,
    LayoutDashboard,
    LogOut,
    MapPin,
    Monitor,
  } from 'lucide-vue-next'
  import { useAdminDashboardController } from '../../controllers/useAdminDashboardController'

  const {
    language,
    setLanguage,
    t,
    company,
    currentDate,
    currentTime,
    serviceCount,
    imageCount,
    languageCount,
  } = useAdminDashboardController()

  const languageOptions = [
    { code: 'th', label: 'TH', accessibleLabel: 'เปลี่ยนเป็นภาษาไทย' },
    { code: 'en', label: 'EN', accessibleLabel: 'Switch to English' },
    { code: 'zh', label: '中文', accessibleLabel: '切换至简体中文' },
  ]
</script>

<template>
  <div class="dashboard-layout">
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
      <nav
        class="dashboard-navigation"
        :aria-label="t('Admin navigation')"
      >
        <a
          href="/admin/dashboard"
          class="sidebar-link active"
          aria-current="page"
        >
          <LayoutDashboard :size="19" />
          {{ t('Overview') }}
        </a>
        <a
          href="/"
          class="sidebar-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Monitor :size="19" />
          {{ t('View website') }}
          <ArrowUpRight :size="15" />
        </a>
      </nav>
      <div class="sidebar-bottom">
        <span class="sidebar-demo">{{ t('Demo workspace') }}</span>
        <p>{{ t('Local interface only. No API connected.') }}</p>
        <a
          href="/admin"
          class="sidebar-link"
        >
          <LogOut :size="18" />
          {{ t('Back to sign in') }}
        </a>
      </div>
    </aside>

    <div class="dashboard-main">
      <header class="dashboard-topbar">
        <div class="dashboard-breadcrumb">
          JYD
          <span>/</span>
          {{ t('Overview') }}
        </div>
        <div
          class="dashboard-languages"
          role="group"
          aria-label="Language / ภาษา / 语言"
        >
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

      <main
        class="dashboard-content"
        aria-labelledby="dashboard-title"
      >
        <div class="dashboard-heading">
          <div>
            <p class="dashboard-eyebrow">ADMIN OVERVIEW</p>
            <h1 id="dashboard-title">{{ t('Welcome to your workspace') }}</h1>
            <p class="dashboard-description">
              {{ t('A quick look at your website content and today’s information.') }}
            </p>
          </div>
          <span class="demo-badge">{{ t('UI demo') }}</span>
        </div>

        <div class="dashboard-today-grid">
          <section
            class="dashboard-clock"
            :aria-label="t('Current date and time')"
          >
            <div class="card-caption">
              <CalendarDays :size="18" />
              {{ t('Today') }}
            </div>
            <p class="clock-date">{{ currentDate }}</p>
            <p
              class="clock-time"
              role="timer"
              aria-live="off"
            >
              {{ currentTime }}
            </p>
            <div class="clock-timezone">
              <Clock3 :size="15" />
              {{ t('Thailand time') }} · UTC+7
            </div>
            <div
              class="clock-decoration"
              aria-hidden="true"
            ></div>
          </section>

          <section
            class="dashboard-card weather-card"
            aria-labelledby="weather-title"
          >
            <div class="weather-heading">
              <h2 id="weather-title">{{ t('Weather') }}</h2>
              <span class="pending-badge">{{ t('Not connected') }}</span>
            </div>
            <p class="weather-location">
              <MapPin :size="15" />
              {{ t('Si Racha, Chon Buri') }}
            </p>
            <div class="weather-display">
              <CloudSun
                :size="58"
                :stroke-width="1.2"
              />
              <span>
                —
                <small>°C</small>
              </span>
            </div>
            <h3>{{ t('Weather data is not connected yet') }}</h3>
            <p class="weather-note">
              {{
                t(
                  'This space is reserved for local weather. No live readings or API requests are used.',
                )
              }}
            </p>
          </section>
        </div>

        <section
          class="dashboard-content-summary"
          aria-labelledby="content-summary-title"
        >
          <div class="dashboard-section-heading">
            <h2 id="content-summary-title">{{ t('Website content') }}</h2>
            <span>{{ t('From local project data') }}</span>
          </div>
          <div class="dashboard-stat-grid">
            <article class="dashboard-card stat-card">
              <span class="stat-icon"><FileText :size="22" /></span>
              <div>
                <p>{{ t('Service entries') }}</p>
                <strong>{{ serviceCount }}</strong>
              </div>
              <span class="stat-caption">{{ t('Our services') }}</span>
            </article>
            <article class="dashboard-card stat-card">
              <span class="stat-icon"><Images :size="22" /></span>
              <div>
                <p>{{ t('Gallery photos') }}</p>
                <strong>{{ imageCount }}</strong>
              </div>
              <span class="stat-caption">{{ t('Our work') }}</span>
            </article>
            <article class="dashboard-card stat-card">
              <span class="stat-icon"><Globe2 :size="22" /></span>
              <div>
                <p>{{ t('Available languages') }}</p>
                <strong>{{ languageCount }}</strong>
              </div>
              <span class="stat-caption">TH · EN · 中文</span>
            </article>
          </div>
        </section>

        <section
          class="dashboard-card company-summary"
          aria-labelledby="company-summary-title"
        >
          <div>
            <p class="dashboard-eyebrow">JYD CORPORATION</p>
            <h2 id="company-summary-title">{{ t('Company information') }}</h2>
            <p>{{ company.name }}</p>
          </div>
          <dl>
            <div>
              <dt>{{ t('Email') }}</dt>
              <dd>{{ company.email }}</dd>
            </div>
            <div>
              <dt>{{ t('Phone number') }}</dt>
              <dd>{{ company.phone }}</dd>
            </div>
            <div>
              <dt>{{ t('Operations center') }}</dt>
              <dd>{{ company.address }}</dd>
            </div>
          </dl>
        </section>
        <p class="dashboard-footer">
          {{
            t(
              'Content counts are not visitor statistics. The admin area is a UI demo without authentication.',
            )
          }}
        </p>
      </main>
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
    padding-top: 55px;
  }
  .sidebar-demo {
    display: inline-block;
    background: #ffffff12;
    padding: 5px 10px;
    font-size: 9px;
    border-radius: 4px;
  }
  .sidebar-bottom p {
    font-size: 10px;
    line-height: 1.9;
    color: #8fa8bd;
    margin: 10px 0 18px;
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
  }
  .dashboard-languages button.selected {
    background: #edf6fb;
    color: #0076be;
  }
  .dashboard-content {
    max-width: 1250px;
    padding: 37px 36px;
    margin: auto;
  }
  .dashboard-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
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
    line-height: 1.5;
    letter-spacing: -0.5px;
  }
  .dashboard-description {
    font-size: 12px;
    color: #7b8c9c;
    margin-top: 9px;
    line-height: 1.8;
  }
  .demo-badge,
  .pending-badge {
    flex-shrink: 0;
    font-size: 9px;
    padding: 6px 10px;
    border-radius: 4px;
    background: #e7edf3;
    color: #6d8295;
  }
  .dashboard-today-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 21px;
  }
  .dashboard-card {
    border: 1px solid #e2eaf1;
    background: #fff;
    border-radius: 8px;
    padding: 25px;
  }
  .dashboard-clock {
    position: relative;
    overflow: hidden;
    background: linear-gradient(125deg, #123653, #07597e);
    color: #fff;
    padding: 29px;
    border-radius: 8px;
    min-height: 264px;
  }
  .card-caption {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #a8d1e8;
    font-size: 12px;
    position: relative;
    z-index: 1;
  }
  .clock-date {
    margin-top: 19px;
    font-size: 15px;
    line-height: 1.8;
    position: relative;
    z-index: 1;
  }
  .clock-time {
    font-size: clamp(35px, 4.2vw, 58px);
    font-weight: 600;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    position: relative;
    z-index: 1;
    line-height: 1.5;
    margin: 5px 0 14px;
  }
  .clock-timezone {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    color: #a8cadd;
    position: relative;
    z-index: 1;
  }
  .clock-decoration {
    position: absolute;
    width: 235px;
    height: 235px;
    border-radius: 50%;
    border: 30px solid #ffffff07;
    right: -70px;
    bottom: -65px;
    box-shadow: 0 0 0 30px #ffffff04;
  }
  .weather-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .dashboard-card h2 {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
  }
  .weather-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: #8294a4;
    margin-top: 8px;
  }
  .weather-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 17px 0;
    color: #8baabc;
  }
  .weather-display > span {
    color: #9aaab7;
    font-size: 38px;
    font-weight: 500;
  }
  .weather-display small {
    font-size: 19px;
    font-weight: 400;
  }
  .weather-card h3 {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 7px;
  }
  .weather-note {
    color: #8898a5;
    font-size: 10px;
    line-height: 1.9;
  }
  .dashboard-content-summary {
    margin: 29px 0 23px;
  }
  .dashboard-section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
  }
  .dashboard-section-heading h2 {
    font-size: 16px;
    font-weight: 600;
  }
  .dashboard-section-heading > span {
    font-size: 9px;
    color: #8b9ba8;
  }
  .dashboard-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    padding: 23px;
  }
  .stat-icon {
    display: grid;
    place-items: center;
    width: 45px;
    height: 45px;
    background: #eef6fa;
    color: #087fb4;
    border-radius: 7px;
    flex-shrink: 0;
  }
  .stat-card p {
    font-size: 11px;
    color: #7c8f9f;
  }
  .stat-card strong {
    display: block;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.6;
  }
  .stat-caption {
    width: 100%;
    border-top: 1px solid #edf1f5;
    padding-top: 12px;
    color: #8b9ba8;
    font-size: 9px;
  }
  .company-summary {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 25px;
  }
  .company-summary > div > p:last-child {
    margin-top: 8px;
    font-size: 11px;
    color: #8494a2;
    line-height: 1.8;
  }
  .company-summary dl {
    margin: 0;
  }
  .company-summary dl > div {
    display: grid;
    grid-template-columns: 105px 1fr;
    gap: 13px;
    padding: 7px 0;
    font-size: 11px;
    line-height: 1.9;
  }
  .company-summary dt {
    color: #8798a6;
  }
  .company-summary dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .dashboard-footer {
    margin-top: 18px;
    color: #95a3af;
    font-size: 9px;
    line-height: 1.9;
  }
  @media (max-width: 1150px) {
    .dashboard-layout {
      grid-template-columns: 195px minmax(0, 1fr);
    }
    .dashboard-sidebar {
      padding-inline: 14px;
    }
    .dashboard-content {
      padding: 28px 23px;
    }
    .dashboard-topbar {
      padding-inline: 23px;
    }
    .dashboard-today-grid {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .stat-card {
      padding: 19px;
      gap: 10px;
    }
    .company-summary {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
  @media (max-width: 800px) {
    .dashboard-layout {
      grid-template-columns: 1fr;
    }
    .dashboard-sidebar {
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
    .dashboard-brand span {
      font-size: 7px;
    }
    .sidebar-caption,
    .sidebar-bottom {
      display: none;
    }
    .dashboard-navigation {
      position: static;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0;
      background: transparent;
      box-shadow: none;
      gap: 4px;
    }
    .dashboard-navigation .sidebar-link {
      font-size: 11px;
      padding: 10px;
    }
    .dashboard-topbar {
      min-height: 65px;
      padding: 10px 20px;
    }
    .dashboard-content {
      padding: 25px 20px;
    }
    .dashboard-heading h1 {
      font-size: 23px;
    }
    .clock-time {
      font-size: 39px;
    }
    .dashboard-clock {
      padding: 23px;
    }
    .dashboard-card {
      padding: 20px;
    }
    .dashboard-stat-grid {
      gap: 11px;
    }
    .stat-icon {
      width: 36px;
      height: 36px;
    }
  }
  @media (max-width: 540px) {
    .dashboard-today-grid {
      grid-template-columns: 1fr;
    }
    .dashboard-clock {
      min-height: 240px;
    }
    .clock-time {
      font-size: 48px;
    }
    .dashboard-stat-grid {
      grid-template-columns: 1fr;
    }
    .stat-card {
      flex-wrap: nowrap;
    }
    .stat-caption {
      width: auto;
      margin-left: auto;
      padding-top: 0;
      border: 0;
    }
    .dashboard-heading {
      align-items: flex-start;
      gap: 10px;
    }
    .demo-badge {
      padding: 5px 7px;
      font-size: 8px;
    }
    .dashboard-heading h1 {
      font-size: 21px;
    }
    .dashboard-section-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
    }
    .company-summary dl > div {
      grid-template-columns: 85px 1fr;
      font-size: 10px;
    }
  }
</style>
