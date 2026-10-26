<script setup>
  import CompanyView from './views/CompanyView.vue'
  import AdminLoginView from './views/admin/AdminLoginView.vue'
  import AdminOverviewView from './views/admin/AdminOverviewView.vue'
  import AdminDashboardView from './views/admin/AdminDashboardView.vue'

  // Normal browser navigation. Admin pages require a local session set by the sign-in page.
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
</script>

<template>
  <AdminLoginView v-if="pathname === '/admin'" />
  <AdminOverviewView v-else-if="pathname === '/admin/overview'" />
  <AdminDashboardView v-else-if="pathname === '/admin/dashboard'" />
  <CompanyView v-else />
</template>
