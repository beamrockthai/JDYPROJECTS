<script setup>
  import { onMounted } from 'vue'
  import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-vue-next'
  import { useLanguage } from '../../composables/useLanguage'
  import { useAdminLoginController } from '../../controllers/useAdminLoginController'

  const { language, setLanguage, t } = useLanguage()
  const languageOptions = [
    { code: 'th', label: 'TH', accessibleLabel: 'เปลี่ยนเป็นภาษาไทย' },
    { code: 'en', label: 'EN', accessibleLabel: 'Switch to English' },
    { code: 'zh', label: '中文', accessibleLabel: '切换至简体中文' },
  ]
  const { form, passwordVisible, togglePasswordVisibility, login } = useAdminLoginController()

  onMounted(() => {
    document.title = 'Admin Login | JYD Corporation'
  })
</script>

<template>
  <main class="admin-login">
    <aside class="admin-brand-panel">
      <img
        class="admin-cover"
        src="/images/port.jpg"
        :alt="t('Seaport and container operations')"
      />
      <div class="admin-cover-shade"></div>
      <div class="admin-brand-content">
        <div class="admin-wordmark">
          JYD
          <span>CORPORATION CO., LTD.</span>
        </div>
        <div class="admin-brand-message">
          <p>YOUR CARGO, OUR COMMITMENT.</p>
          <h1>{{ t('Your cargo. Our commitment.') }}</h1>
          <span>IMPORT · EXPORT · CUSTOMS · TRANSPORTATION</span>
        </div>
        <p class="admin-panel-caption">JYD CORPORATION · ADMINISTRATION</p>
      </div>
    </aside>

    <section
      class="admin-form-panel"
      aria-labelledby="admin-login-title"
    >
      <div class="admin-form-wrap">
        <div
          class="admin-language-switcher"
          role="group"
          aria-label="Language / ภาษา / 语言"
        >
          <button
            v-for="option in languageOptions"
            :key="option.code"
            type="button"
            :class="{ selected: language === option.code }"
            :aria-pressed="language === option.code"
            :aria-label="option.accessibleLabel"
            @click="setLanguage(option.code)"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="admin-mobile-brand">
          JYD
          <span>CORPORATION</span>
        </div>
        <div class="admin-lock-icon"><LockKeyhole :size="24" /></div>
        <p class="admin-eyebrow">ADMIN PORTAL</p>
        <h2 id="admin-login-title">{{ t('Administrator sign in') }}</h2>
        <p class="admin-subtitle">{{ t('Welcome back to the JYD administration portal.') }}</p>

        <form
          class="admin-form"
          @submit.prevent="login"
        >
          <label for="admin-username">{{ t('Username') }}</label>
          <div class="admin-input-wrap">
            <UserRound
              :size="18"
              aria-hidden="true"
            />
            <input
              id="admin-username"
              v-model="form.username"
              name="username"
              type="text"
              autocomplete="username"
              :placeholder="t('Enter your username')"
              required
            />
          </div>

          <label for="admin-password">{{ t('Password') }}</label>
          <div class="admin-input-wrap">
            <LockKeyhole
              :size="18"
              aria-hidden="true"
            />
            <input
              id="admin-password"
              v-model="form.password"
              name="password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              :placeholder="t('Enter your password')"
              required
            />
            <button
              class="admin-password-toggle"
              type="button"
              :aria-label="passwordVisible ? t('Hide password') : t('Show password')"
              :aria-pressed="passwordVisible"
              aria-controls="admin-password"
              @click="togglePasswordVisibility"
            >
              <EyeOff
                v-if="passwordVisible"
                :size="19"
              />
              <Eye
                v-else
                :size="19"
              />
            </button>
          </div>

          <button
            class="admin-login-button"
            type="submit"
          >
            {{ t('Sign in') }}
            <ArrowRight :size="19" />
          </button>
          <p class="admin-demo-note">
            {{
              t(
                'UI demo: enter any username and password to continue. No information is sent or saved.',
              )
            }}
          </p>
        </form>
        <p class="admin-copyright">© {{ new Date().getFullYear() }} JYD Corporation Co., Ltd.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .admin-login {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #fff;
  }

  .admin-brand-panel {
    position: relative;
    min-height: 100dvh;
    background: #102c48;
    color: #fff;
    overflow: hidden;
  }

  .admin-cover,
  .admin-cover-shade {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .admin-cover-shade {
    background: linear-gradient(180deg, #0a2842b8, #0a2842a6 40%, #071d34f2);
  }

  .admin-brand-content {
    position: relative;
    min-height: 100dvh;
    padding: 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .admin-wordmark,
  .admin-mobile-brand {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -3px;
  }

  .admin-wordmark span,
  .admin-mobile-brand span {
    max-width: 120px;
    padding-left: 18px;
    border-left: 1px solid #ffffff55;
    font-size: 10px;
    line-height: 1.8;
    letter-spacing: 1.4px;
  }

  .admin-brand-message {
    margin-top: 100px;
    max-width: 430px;
  }

  .admin-brand-message p,
  .admin-panel-caption {
    font-size: 10px;
    letter-spacing: 2px;
    color: #b7d8ec;
  }

  .admin-brand-message h1 {
    margin: 20px 0;
    font-size: clamp(30px, 3.2vw, 48px);
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.7px;
  }

  .admin-brand-message > span {
    font-size: 8px;
    line-height: 2;
    letter-spacing: 1.7px;
    color: #b7cbd9;
  }

  .admin-form-panel {
    padding: 52px 40px;
    display: grid;
    place-items: center;
  }

  .admin-form-wrap {
    width: 100%;
    max-width: 390px;
  }

  .admin-mobile-brand {
    display: none;
  }

  .admin-language-switcher {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    margin-bottom: 28px;
  }

  .admin-language-switcher button {
    min-width: 42px;
    min-height: 40px;
    padding: 8px 10px;
    border: 1px solid transparent;
    background: transparent;
    color: #687b8b;
    font-size: 12px;
    font-weight: 600;
  }

  .admin-language-switcher button:hover {
    background: #f3f7fa;
  }

  .admin-language-switcher button.selected {
    border-color: #d2e7f3;
    background: #edf6fb;
    color: #0076be;
  }

  .admin-lock-icon {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    color: #0076be;
    background: #edf6fb;
    margin-bottom: 25px;
  }

  .admin-eyebrow {
    color: #0076be;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.3px;
    margin-bottom: 12px;
  }

  .admin-form-wrap h2 {
    font-size: 30px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: -0.5px;
  }

  .admin-subtitle {
    margin-top: 10px;
    font-size: 12px;
    line-height: 1.9;
    color: #748695;
  }

  .admin-form {
    margin-top: 32px;
  }

  .admin-form label {
    display: block;
    margin-bottom: 9px;
    font-size: 12px;
    font-weight: 500;
  }

  .admin-input-wrap {
    display: flex;
    align-items: center;
    border: 1px solid #dce5ec;
    background: #fafcfd;
    margin-bottom: 22px;
    padding-left: 15px;
    color: #7c94a6;
  }

  .admin-input-wrap:focus-within {
    outline: 2px solid #0086c9;
    outline-offset: 1px;
  }

  .admin-input-wrap input {
    min-width: 0;
    width: 100%;
    border: 0;
    padding: 16px 13px;
    background: transparent;
    font-size: 13px;
    color: #142d47;
    outline: none;
  }

  .admin-input-wrap input::placeholder {
    color: #9aabb7;
  }

  .admin-password-toggle {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 46px;
    min-height: 48px;
    border: 0;
    background: transparent;
    color: #6b8395;
  }

  .admin-login-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 0;
    padding: 16px 20px;
    background: #0088cd;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    margin-top: 8px;
    transition: background 0.2s;
  }

  .admin-login-button:hover {
    background: #006faf;
  }

  .admin-demo-note {
    margin-top: 16px;
    font-size: 11px;
    line-height: 1.9;
    color: #7c8f9e;
  }

  .admin-copyright {
    margin-top: 55px;
    padding-top: 20px;
    border-top: 1px solid #e8eef3;
    font-size: 9px;
    line-height: 1.8;
    color: #93a3b0;
  }

  @media (max-width: 800px) {
    .admin-login {
      grid-template-columns: 1fr;
    }

    .admin-brand-panel {
      display: none;
    }

    .admin-form-panel {
      padding: 32px 24px;
      min-height: 100dvh;
    }

    .admin-mobile-brand {
      display: flex;
      font-size: 38px;
      margin-bottom: 35px;
    }

    .admin-mobile-brand span {
      border-color: #dce5ec;
    }

    .admin-form-wrap h2 {
      font-size: 27px;
    }
  }
</style>
