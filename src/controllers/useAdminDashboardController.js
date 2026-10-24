import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { createCompany } from '../models/company'

const timeZone = 'Asia/Bangkok'
const dateLocales = { th: 'th-TH', en: 'en-GB', zh: 'zh-CN' }

export function useAdminDashboardController() {
  const { language, setLanguage, t } = useLanguage()
  const now = ref(new Date())
  const company = computed(() => createCompany(t))
  let clockInterval

  const dateFormatter = computed(() => {
    return new Intl.DateTimeFormat(dateLocales[language.value], {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  const currentDate = computed(() => dateFormatter.value.format(now.value))
  const currentTime = computed(() => timeFormatter.format(now.value))

  // These are local content counts, not visitor statistics or server data.
  const serviceCount = computed(() => company.value.services.length)
  const imageCount = computed(() => company.value.gallery.length)
  const languageCount = Object.keys(dateLocales).length

  function updateClock() {
    now.value = new Date()
  }

  onMounted(() => {
    document.title = 'Admin Overview | JYD Corporation'
    updateClock()
    clockInterval = window.setInterval(updateClock, 1000)
  })

  onUnmounted(() => {
    window.clearInterval(clockInterval)
  })

  return {
    language,
    setLanguage,
    t,
    company,
    currentDate,
    currentTime,
    serviceCount,
    imageCount,
    languageCount,
  }
}
