import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import {
  clearAdminSession,
  deleteInquiry,
  getAdminSession,
  listInquiries,
  updateInquiry,
} from '../services/adminService'

export const statusOptions = ['pending', 'contacted', 'in_progress', 'closed']

export function useAdminDashboardController() {
  const { language, setLanguage, t } = useLanguage()
  const session = getAdminSession()

  // Guard: only signed-in admins can view the dashboard.
  if (!session) {
    window.location.replace('/admin')
  }

  const inquiries = ref([])
  const loading = ref(true)
  const loadError = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const selectedId = ref(null)
  const notesDraft = ref('')
  const saving = ref(false)
  const toast = ref('')
  let toastTimer

  const statusLabels = computed(() => ({
    pending: t('Pending'),
    contacted: t('Contacted'),
    in_progress: t('In progress'),
    closed: t('Closed'),
  }))

  const counts = computed(() => {
    const result = { all: inquiries.value.length }
    statusOptions.forEach((status) => {
      result[status] = inquiries.value.filter((item) => item.status === status).length
    })
    return result
  })

  function formatService(val) {
    if (!val) return '—'
    return t(val)
  }

  const filtered = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return inquiries.value.filter((item) => {
      if (statusFilter.value !== 'all' && item.status !== statusFilter.value) return false
      if (!keyword) return true
      const translated = formatService(item.service)
      return [item.name, item.company, item.phone, item.email, item.service, translated, item.message]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    })
  })

  const selected = computed(() => inquiries.value.find((item) => item.id === selectedId.value))

  const dateLocales = { th: 'th-TH', en: 'en-GB', zh: 'zh-CN' }
  function formatDate(value) {
    if (!value) return '—'
    return new Intl.DateTimeFormat(dateLocales[language.value], {
      timeZone: 'Asia/Bangkok',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  function showToast(message) {
    toast.value = message
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => (toast.value = ''), 2600)
  }

  async function load() {
    loading.value = true
    loadError.value = false
    try {
      inquiries.value = (await listInquiries()) || []
    } catch {
      loadError.value = true
    } finally {
      loading.value = false
    }
  }

  function patchLocal(row) {
    const index = inquiries.value.findIndex((item) => item.id === row.id)
    if (index !== -1) inquiries.value[index] = row
  }

  async function changeStatus(item, status) {
    const changes = { status }
    if (status !== 'pending' && !item.contacted_at) changes.contacted_at = new Date().toISOString()
    try {
      const [row] = await updateInquiry(item.id, changes)
      patchLocal(row)
      showToast(t('Saved successfully'))
    } catch {
      showToast(t('Failed to save changes'))
    }
  }

  function openDetail(item) {
    selectedId.value = item.id
    notesDraft.value = item.admin_notes || ''
  }

  function closeDetail() {
    selectedId.value = null
  }

  async function saveNotes() {
    if (!selected.value) return
    saving.value = true
    try {
      const [row] = await updateInquiry(selected.value.id, { admin_notes: notesDraft.value })
      patchLocal(row)
      showToast(t('Saved successfully'))
    } catch {
      showToast(t('Failed to save changes'))
    } finally {
      saving.value = false
    }
  }

  async function removeInquiry(item) {
    if (!window.confirm(t('Delete this inquiry permanently?'))) return
    try {
      await deleteInquiry(item.id)
      inquiries.value = inquiries.value.filter((row) => row.id !== item.id)
      if (selectedId.value === item.id) closeDetail()
    } catch {
      showToast(t('Failed to save changes'))
    }
  }

  function signOut() {
    clearAdminSession()
    window.location.assign('/admin')
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && selectedId.value) {
      closeDetail()
    }
  }

  watch(selected, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  onMounted(() => {
    document.title = 'Admin Dashboard | JYD Corporation'
    window.addEventListener('keydown', handleKeyDown)
    if (session) load()
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  })

  return {
    language,
    setLanguage,
    t,
    session,
    inquiries,
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
    signOut,
  }
}
