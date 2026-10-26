import { computed, reactive, ref, watch } from 'vue'
import { createCompany } from '../models/company'
import { useLanguage } from '../composables/useLanguage'
import { createInquiry } from '../services/adminService'

// UI controller. Replace submitInquiry with a Supabase service when the backend is ready.
export function useCompanyController() {
  const { language, setLanguage, t } = useLanguage()
  const company = computed(() => createCompany(t))
  const menuOpen = ref(false)
  const activeSection = ref('home')
  const selectedService = ref(null)
  const selectedImage = ref(null)
  const galleryFilter = ref('all')
  const inquirySubmitted = ref(false)
  const submitting = ref(false)
  const submitError = ref(false)
  const formStatus = computed(() => {
    if (submitError.value) {
      return t(
        'Sorry, we could not send your details. Please try again or contact us by phone or email.',
      )
    }
    return inquirySubmitted.value
      ? t('Thank you! We have received your details and our team will contact you shortly.')
      : ''
  })
  const form = reactive({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    consent: false,
  })
  const filteredGallery = computed(() =>
    company.value.gallery.filter(
      (item) => galleryFilter.value === 'all' || item.category === galleryFilter.value,
    ),
  )
  async function submitInquiry() {
    if (submitting.value) return
    submitting.value = true
    submitError.value = false
    inquirySubmitted.value = false
    try {
      await createInquiry(form)
      inquirySubmitted.value = true
      Object.assign(form, {
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        consent: false,
      })
    } catch {
      submitError.value = true
    } finally {
      submitting.value = false
    }
  }
  function navigate(id) {
    activeSection.value = id
    menuOpen.value = false
  }
  // Keep an open dialog in the selected language without losing the form state.
  watch(company, (translatedCompany) => {
    if (selectedService.value) {
      selectedService.value = translatedCompany.services.find(
        (service) => service.en === selectedService.value.en,
      )
    }
    if (selectedImage.value) {
      selectedImage.value = translatedCompany.gallery.find(
        (image) => image.src === selectedImage.value.src,
      )
    }
  })

  return {
    language,
    setLanguage,
    t,
    company,
    menuOpen,
    activeSection,
    selectedService,
    selectedImage,
    galleryFilter,
    filteredGallery,
    form,
    formStatus,
    submitting,
    submitInquiry,
    navigate,
  }
}
