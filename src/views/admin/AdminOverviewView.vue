<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { CalendarDays, Clock3, FileText, Globe2, Images } from 'lucide-vue-next'
  import AdminLayout from '../../components/AdminLayout.vue'
  import { useLanguage } from '../../composables/useLanguage'
  import { createCompany } from '../../models/company'

  const { language, t } = useLanguage()
  const company = computed(() => createCompany(t))
  const now = ref(new Date())
  let timer

  const dateLocales = { th: 'th-TH', en: 'en-GB', zh: 'zh-CN' }
  const zones = [
    { id: 'th', label: 'Thailand', timeZone: 'Asia/Bangkok', primary: true },
    { id: 'uk', label: 'United Kingdom', timeZone: 'Europe/London' },
    { id: 'cn', label: 'China', timeZone: 'Asia/Shanghai' },
  ]

  function utcOffset(timeZone) {
    const part = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'shortOffset' })
      .formatToParts(now.value)
      .find((item) => item.type === 'timeZoneName')
    return (part?.value || '').replace('GMT', 'UTC') || 'UTC'
  }

  const clocks = computed(() =>
    zones.map((zone) => ({
      ...zone,
      date: new Intl.DateTimeFormat(dateLocales[language.value], {
        timeZone: zone.timeZone,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now.value),
      time: new Intl.DateTimeFormat('en-GB', {
        timeZone: zone.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).format(now.value),
      offset: utcOffset(zone.timeZone),
    })),
  )

  const serviceCount = computed(() => company.value.services.length)
  const imageCount = computed(() => company.value.gallery.length)
  const languageCount = Object.keys(dateLocales).length

  onMounted(() => {
    document.title = 'Admin Overview | JYD Corporation'
    timer = window.setInterval(() => (now.value = new Date()), 1000)
  })
  onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <AdminLayout active="overview" :title="t('Overview')">
    <main class="overview-content" aria-labelledby="overview-title">
      <div class="overview-heading">
        <p class="overview-eyebrow">ADMIN OVERVIEW</p>
        <h1 id="overview-title">{{ t('Welcome to your workspace') }}</h1>
        <p class="overview-description">
          {{ t('A quick look at your website content and today’s information.') }}
        </p>
      </div>

      <section class="clock-grid" :aria-label="t('Current date and time')">
        <article
          v-for="clock in clocks"
          :key="clock.id"
          class="clock-card"
          :class="{ primary: clock.primary }"
        >
          <div class="card-caption">
            <CalendarDays :size="18" />
            {{ t(clock.label) }}
          </div>
          <p class="clock-date">{{ clock.date }}</p>
          <p class="clock-time" role="timer" aria-live="off">{{ clock.time }}</p>
          <div class="clock-timezone">
            <Clock3 :size="15" />
            {{ clock.timeZone }} · {{ clock.offset }}
          </div>
          <span class="clock-decoration" aria-hidden="true"></span>
        </article>
      </section>

      <section class="summary-section" aria-labelledby="content-summary-title">
        <div class="section-heading">
          <h2 id="content-summary-title">{{ t('Website content') }}</h2>
          <span>{{ t('From local project data') }}</span>
        </div>
        <div class="stat-grid">
          <article class="card stat-card">
            <span class="stat-icon"><FileText :size="22" /></span>
            <div>
              <p>{{ t('Service entries') }}</p>
              <strong>{{ serviceCount }}</strong>
            </div>
            <span class="stat-caption">{{ t('Our services') }}</span>
          </article>
          <article class="card stat-card">
            <span class="stat-icon"><Images :size="22" /></span>
            <div>
              <p>{{ t('Gallery photos') }}</p>
              <strong>{{ imageCount }}</strong>
            </div>
            <span class="stat-caption">{{ t('Our work') }}</span>
          </article>
          <article class="card stat-card">
            <span class="stat-icon"><Globe2 :size="22" /></span>
            <div>
              <p>{{ t('Available languages') }}</p>
              <strong>{{ languageCount }}</strong>
            </div>
            <span class="stat-caption">TH · EN · 中文</span>
          </article>
        </div>
      </section>

      <section class="card company-summary" aria-labelledby="company-summary-title">
        <div>
          <p class="overview-eyebrow">JYD CORPORATION</p>
          <h2 id="company-summary-title">{{ t('Company information') }}</h2>
          <p>{{ company.name }}</p>
        </div>
        <dl>
          <div>
            <dt>{{ t('Company Email') }}</dt>
            <dd><a :href="`mailto:${company.email}`">{{ company.email }}</a></dd>
          </div>
          <div>
            <dt>{{ t('Management Contact') }}</dt>
            <dd>
              <a :href="`mailto:${company.managementEmail}`" class="contact-link-with-badge">
                <span>{{ company.managementEmail }}</span>
                <span class="contact-badge">
                  <span class="badge-dot"></span>
                  {{ company.contactPerson }}
                </span>
              </a>
            </dd>
          </div>
          <div>
            <dt>{{ t('Office Telephone') }}</dt>
            <dd><a :href="`tel:${company.officePhone.replaceAll('-', '')}`">{{ company.officePhone }}</a></dd>
          </div>
          <div>
            <dt>{{ t('Mobile Phone') }}</dt>
            <dd>
              <a :href="`tel:${company.phone.replaceAll('-', '')}`" class="contact-link-with-badge">
                <span>{{ company.phone }}</span>
                <span class="contact-badge">
                  <span class="badge-dot"></span>
                  {{ company.contactPerson }}
                </span>
              </a>
            </dd>
          </div>
          <div>
            <dt>{{ t('Operations center') }}</dt>
            <dd>{{ company.address }}</dd>
          </div>
        </dl>
      </section>
    </main>
  </AdminLayout>
</template>

<style scoped>
  .overview-content {
    width: 100%;
    padding: 32px 36px 40px;
  }
  .overview-heading {
    margin-bottom: 26px;
  }
  .overview-eyebrow {
    color: #0082bf;
    font-size: 9px;
    letter-spacing: 1.8px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .overview-heading h1 {
    font-size: 27px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: -0.5px;
  }
  .overview-description {
    font-size: 12px;
    color: #7b8c9c;
    margin-top: 9px;
    line-height: 1.8;
  }
  .clock-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 20px;
  }
  .clock-card {
    position: relative;
    overflow: hidden;
    background: linear-gradient(125deg, #123653, #07597e);
    color: #fff;
    padding: 28px;
    border-radius: 8px;
    min-height: 240px;
  }
  .clock-card:not(.primary) {
    background: linear-gradient(125deg, #19405f, #1d5d83);
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
    margin-top: 18px;
    font-size: 14px;
    line-height: 1.8;
    position: relative;
    z-index: 1;
  }
  .clock-time {
    font-size: clamp(32px, 3.4vw, 48px);
    font-weight: 600;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    position: relative;
    z-index: 1;
    line-height: 1.5;
    margin: 5px 0 14px;
  }
  .clock-card.primary .clock-time {
    font-size: clamp(38px, 4.4vw, 58px);
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
  .summary-section {
    margin: 29px 0 23px;
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
  }
  .section-heading h2 {
    font-size: 16px;
    font-weight: 600;
  }
  .section-heading > span {
    font-size: 9px;
    color: #8b9ba8;
  }
  .card {
    border: 1px solid #e2eaf1;
    background: #fff;
    border-radius: 8px;
    padding: 25px;
  }
  .stat-grid {
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
  .company-summary h2 {
    font-size: 16px;
    font-weight: 600;
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
  @media (max-width: 1150px) {
    .overview-content {
      padding: 26px 22px;
    }
    .clock-grid {
      grid-template-columns: 1fr 1fr;
    }
    .clock-card.primary {
      grid-column: 1 / -1;
    }
    .company-summary {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
  @media (max-width: 800px) {
    .overview-content {
      padding: 22px 16px;
    }
    .overview-heading h1 {
      font-size: 22px;
    }
  }
  @media (max-width: 540px) {
    .clock-grid,
    .stat-grid {
      grid-template-columns: 1fr;
    }
    .company-summary dl > div {
      grid-template-columns: 85px 1fr;
    }
  }
  .contact-link-with-badge {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .contact-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 9px;
    border-radius: 999px;
    background: #edf6fc;
    border: 1px solid #c9e3f4;
    color: #065b8c;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
  }
  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0082bf;
    flex-shrink: 0;
  }
</style>
