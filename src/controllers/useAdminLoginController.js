import { reactive, ref } from 'vue'

export function useAdminLoginController() {
  const form = reactive({
    username: '',
    password: '',
  })
  const passwordVisible = ref(false)

  function togglePasswordVisibility() {
    passwordVisible.value = !passwordVisible.value
  }

  function login() {
    // UI demo only: do not send, log or persist the entered credentials.
    window.location.assign('/admin/dashboard')
  }

  return {
    form,
    passwordVisible,
    togglePasswordVisibility,
    login,
  }
}
