import { reactive, ref } from 'vue'
import { getAdminSession, signInAdmin } from '../services/adminService'
import { isSupabaseConfigured } from '../services/supabase'

export function useAdminLoginController() {
  const form = reactive({
    username: '',
    password: '',
  })
  const passwordVisible = ref(false)
  const loading = ref(false)
  const error = ref('')

  // If already logged in, redirect straight to overview
  if (getAdminSession()) {
    window.location.replace('/admin/overview')
  }

  function togglePasswordVisibility() {
    passwordVisible.value = !passwordVisible.value
  }

  async function login() {
    error.value = ''
    if (!isSupabaseConfigured()) {
      error.value = 'config'
      return
    }
    loading.value = true
    try {
      const user = await signInAdmin(form.username.trim(), form.password)
      if (!user) {
        error.value = 'invalid'
        return
      }
      window.location.assign('/admin/overview')
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'network'
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    passwordVisible,
    loading,
    error,
    togglePasswordVisibility,
    login,
  }
}
