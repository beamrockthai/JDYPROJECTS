import { ref, watch } from 'vue'
import thaiMessages from '../locales/th'

const storageKey = 'jyd-language'
const supportedLanguages = ['th', 'en']

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

  // English phrases are the message keys; Thai translations live in locales/th.js.
  function t(message) {
    if (language.value === 'th') {
      return thaiMessages[message] ?? message
    }

    return message
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
      document.documentElement.lang = currentLanguage

      const description = document.querySelector('meta[name="description"]')

      if (description) {
        description.content =
          currentLanguage === 'en'
            ? 'JYD Corporation: import, export, customs clearance and domestic transportation.'
            : 'JYD Corporation บริการนำเข้า ส่งออก พิธีการศุลกากร และขนส่งสินค้าภายในประเทศ'
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
