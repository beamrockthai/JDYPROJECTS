import { ref, watch } from 'vue'
import thaiMessages from '../locales/th'
import chineseMessages from '../locales/zh'

const storageKey = 'jyd-language'
const supportedLanguages = ['th', 'en', 'zh']
const messages = {
  th: thaiMessages,
  zh: chineseMessages,
}
const documentLanguages = { th: 'th', en: 'en', zh: 'zh-Hans' }
const descriptions = {
  th: 'JYD Corporation บริการนำเข้า ส่งออก พิธีการศุลกากร และขนส่งสินค้าภายในประเทศ',
  en: 'JYD Corporation: import, export, customs clearance and domestic transportation.',
  zh: 'JYD Corporation 提供进出口、报关清关及泰国境内货物运输服务。',
}

function readSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(storageKey)

    if (supportedLanguages.includes(savedLanguage)) {
      return savedLanguage
    }
  } catch {
    // Language switching still works when browser storage is unavailable.
  }

  return 'th'
}

export function useLanguage() {
  const language = ref(readSavedLanguage())

  // English phrases are the keys; each translated language has its own locale file.
  function t(message) {
    return messages[language.value]?.[message] ?? message
  }

  function setLanguage(nextLanguage) {
    if (!supportedLanguages.includes(nextLanguage)) {
      return
    }

    language.value = nextLanguage
  }

  watch(
    language,
    (currentLanguage) => {
      document.documentElement.lang = documentLanguages[currentLanguage]

      const description = document.querySelector('meta[name="description"]')

      if (description) {
        description.content = descriptions[currentLanguage]
      }

      try {
        window.localStorage.setItem(storageKey, currentLanguage)
      } catch {
        // Storage is optional: the current page still uses the selected language.
      }
    },
    { immediate: true },
  )

  return { language, setLanguage, t }
}
