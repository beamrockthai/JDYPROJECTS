<script setup>
  import CompanyView from './views/CompanyView.vue'
  import AdminLoginView from './views/admin/AdminLoginView.vue'
  import AdminDashboardView from './views/admin/AdminDashboardView.vue'

  // These UI-only pages use normal browser navigation. No authentication is performed.
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
</script>

<template>
  <AdminLoginView v-if="pathname === '/admin'" />
  <AdminDashboardView v-else-if="pathname === '/admin/dashboard'" />
  <CompanyView v-else />
</template>
