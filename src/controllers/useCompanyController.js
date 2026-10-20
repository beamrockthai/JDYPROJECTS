import { computed, reactive, ref, watch } from 'vue'
import { createCompany } from '../models/company'
import { useLanguage } from '../composables/useLanguage'

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
  const formStatus = computed(() =>
    inquirySubmitted.value
      ? t(
          'This is a demo form. Your information has not been sent to the company because submissions are not connected yet. Please contact us using the phone number or email shown.',
        )
      : '',
  )
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
  function submitInquiry() {
    inquirySubmitted.value = true
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
    submitInquiry,
    navigate,
  }
}
