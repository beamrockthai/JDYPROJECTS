<script setup>
  import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
  import {
    ArrowUpRight,
    ArrowRight,
    Globe2,
    FileCheck2,
    Truck,
    MessagesSquare,
    Files,
    Warehouse,
    Menu,
    X,
    Phone,
    Mail,
    MapPin,
    ShieldCheck,
    Zap,
    Handshake,
    Check,
    ChevronDown,
    MoveUpRight,
    Ship,
    Plane,
    MessageCircle,
    Maximize2,
    CheckCircle2,
  } from 'lucide-vue-next'
  import { useCompanyController } from '../controllers/useCompanyController'
  const {
    company,
    language,
    setLanguage,
    t,
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
  } = useCompanyController()
  const icons = { Globe2, FileCheck2, Truck, MessagesSquare, Files, Warehouse }
  const navigation = computed(() => [
    { id: 'home', label: t('Home') },
    { id: 'about', label: t('About us') },
    { id: 'services', label: t('Our services') },
    { id: 'work', label: t('Our work') },
    { id: 'contact', label: t('Contact us') },
  ])
  function closeDetails() {
    selectedService.value = null
    selectedImage.value = null
  }

  function inquireAboutService() {
    form.service = selectedService.value.en
    selectedService.value = null
  }
  let sectionObserver
  let revealObserver
  let previousFocus

  function observeReveals() {
    if (!revealObserver) return
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => revealObserver.observe(el))
  }

  const closeModal = (e) => {
    if (e.key === 'Escape') {
      selectedService.value = null
      selectedImage.value = null
      menuOpen.value = false
    }
    if (e.key === 'Tab' && (selectedService.value || selectedImage.value)) {
      const items = [...document.querySelectorAll('.modal button, .modal a[href]')]
      const first = items[0],
        last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }
  watch([selectedService, selectedImage], async ([service, img]) => {
    document.body.style.overflow = service || img ? 'hidden' : ''
    if (service || img) {
      previousFocus = document.activeElement
      await nextTick()
      document.querySelector('.modal-close')?.focus()
    } else {
      previousFocus?.focus()
    }
  })
  watch(galleryFilter, async () => {
    await nextTick()
    observeReveals()
  })
  onMounted(() => {
    sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            activeSection.value = e.target.id
          }
        }),
      { rootMargin: '-20% 0px -60% 0px' },
    )
    document.querySelectorAll('section[id]').forEach((el) => sectionObserver.observe(el))

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          } else {
            entry.target.classList.remove('is-revealed')
          }
        })
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px',
      },
    )
    observeReveals()

    window.addEventListener('keydown', closeModal)
  })
  onUnmounted(() => {
    sectionObserver?.disconnect()
    revealObserver?.disconnect()
    window.removeEventListener('keydown', closeModal)
    document.body.style.overflow = ''
  })
</script>

<template>
  <a
    class="skip"
    href="#main"
  >
    {{ t('Skip to content') }}
  </a>
  <div class="topbar">
    <div class="container top-inner">
      <span>Your Cargo, Our Commitment.</span>
      <div>
        <a href="mailto:Info@jydcorp.com">
          <Mail :size="13" />
          Info@jydcorp.com
        </a>
        <span class="top-divider"></span>
        <a href="tel:0644453944">
          <Phone :size="13" />
          064-445-3944
        </a>
      </div>
    </div>
  </div>
  <header class="header">
    <div class="container nav-inner">
      <a
        href="#home"
        class="brand"
        :aria-label="t('JYD Corporation home')"
        @click="navigate('home')"
      >
        <img
          src="/images/logo.png"
          alt="JYD"
        />
        <span>
          CORPORATION
          <small>CO., LTD.</small>
        </span>
      </a>
      <nav
        :aria-label="t('Main navigation')"
        :class="{ open: menuOpen }"
      >
        <a
          v-for="item in navigation"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ active: activeSection === item.id }"
          @click="navigate(item.id)"
        >
          {{ item.label }}
        </a>
      </nav>
      <a
        class="nav-cta"
        href="#contact"
      >
        {{ t('Talk to our team') }}
        <ArrowUpRight :size="17" />
      </a>

      <div
        class="language-switcher"
        role="group"
        aria-label="Language / ภาษา"
      >
        <button
          type="button"
          :class="{ selected: language === 'th' }"
          :aria-pressed="language === 'th'"
          aria-label="เปลี่ยนเป็นภาษาไทย"
          @click="setLanguage('th')"
        >
          TH
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          :class="{ selected: language === 'en' }"
          :aria-pressed="language === 'en'"
          aria-label="Switch to English"
          @click="setLanguage('en')"
        >
          EN
        </button>
      </div>
      <button
        class="menu-toggle"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? t('Close menu') : t('Open menu')"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" />
        <Menu v-else />
      </button>
    </div>
  </header>

  <main id="main">
    <section
      id="home"
      class="hero"
    >
      <img
        class="hero-photo"
        src="/images/hero.jpg"
        :alt="t('Cargo ship, containers and a seaport')"
        fetchpriority="high"
      />
      <div class="hero-shade"></div>
      <div class="container hero-inner reveal reveal-fade-up is-revealed">
        <p class="eyebrow light hero-anim hero-anim-1">
          <span></span>
          YOUR PARTNER IN GLOBAL LOGISTICS
        </p>
        <h1 class="hero-anim hero-anim-2">
          {{ t('Connecting trade.') }}
          <br />
          {{ t('Caring for every') }}
          <span>{{ t('shipment.') }}</span>
        </h1>
        <p class="hero-desc hero-anim hero-anim-3">
          {{ t('Import, export, customs clearance and domestic transport.') }}
          <br class="desktop-br" />
          {{ t('Care for your cargo at every step of the journey.') }}
        </p>
        <div class="hero-actions hero-anim hero-anim-4">
          <a
            class="button primary"
            href="#contact"
          >
            {{ t('Request advice / a quote') }}
            <ArrowUpRight :size="19" />
          </a>
          <a
            class="button ghost"
            href="#services"
          >
            {{ t('Explore our services') }}
            <ArrowRight :size="18" />
          </a>
        </div>
        <div class="hero-note hero-anim hero-anim-5">
          <ShieldCheck :size="17" />
          {{ t('Fast · Accurate · Transparent · Reliable') }}
        </div>
      </div>
      <div class="hero-bottom container hero-anim hero-anim-6 reveal reveal-fade-up is-revealed">
        <span>JYD CORPORATION CO., LTD.</span>
        <a href="#about">
          {{ t('Get to know us') }}
          <ChevronDown :size="17" />
        </a>
        <span class="hero-count">
          01
          <i>/</i>
          GLOBAL CONNECTIONS
        </span>
      </div>
    </section>

    <div class="service-strip">
      <div class="container strip-grid reveal reveal-stagger">
        <div class="strip-heading reveal-child">
          <span class="eyebrow">CONNECTED. COVERED.</span>
          <strong>
            {{ t('Every route.') }}
            <br />
            {{ t('Your business, connected.') }}
          </strong>
        </div>
        <a
          href="#services"
          class="reveal-child"
        >
          <span class="icon-circle">
            <Ship />
          </span>
          <div>
            <strong>Sea Freight</strong>
            <span>{{ t('Ocean cargo services') }}</span>
          </div>
          <ArrowUpRight :size="18" />
        </a>
        <a
          href="#services"
          class="reveal-child"
        >
          <span class="icon-circle">
            <Plane />
          </span>
          <div>
            <strong>Air Freight</strong>
            <span>{{ t('Air cargo services') }}</span>
          </div>
          <ArrowUpRight :size="18" />
        </a>
        <a
          href="#services"
          class="reveal-child"
        >
          <span class="icon-circle">
            <Truck />
          </span>
          <div>
            <strong>Land Transport</strong>
            <span>{{ t('Road cargo services') }}</span>
          </div>
          <ArrowUpRight :size="18" />
        </a>
      </div>
    </div>

    <section
      id="about"
      class="section about-section"
    >
      <div class="container about-grid">
        <div class="about-visual reveal reveal-fade-right">
          <img
            src="/images/port.jpg"
            :alt="t('Seaport and container operations')"
            loading="lazy"
          />
          <div class="image-label">
            <span class="label-line"></span>
            CONNECTING YOUR BUSINESS TO THE WORLD
          </div>
          <div class="commitment reveal-pop">
            <Globe2 :size="33" />
            <span>
              Your Cargo,
              <br />
              <strong>Our Commitment.</strong>
            </span>
          </div>
        </div>
        <div class="about-copy reveal reveal-fade-left">
          <p class="eyebrow">GET TO KNOW JYD</p>
          <h2>
            {{ t('More than logistics.') }}
            <br />
            {{ t('A commitment') }}
            <br />
            <span class="blue">{{ t('to your trust.') }}</span>
          </h2>
          <p class="company-name">{{ company.name }}</p>
          <p class="body-copy">
            {{
              t(
                'We provide logistics services covering international import and export, customs clearance and trucking. Our focus is professional service, speed and accuracy, tailored to your needs.',
              )
            }}
          </p>
          <p class="body-copy">
            {{
              t(
                'From planning and document checks to destination coordination, we take care of every step so your business can move forward smoothly.',
              )
            }}
          </p>
          <div class="about-checks reveal-stagger">
            <span class="reveal-child">
              <CheckCircle2 />
              {{ t('End-to-end logistics services') }}
            </span>
            <span class="reveal-child">
              <CheckCircle2 />
              {{ t('Professional coordination') }}
            </span>
            <span class="reveal-child">
              <CheckCircle2 />
              {{ t('Accurate documentation') }}
            </span>
            <span class="reveal-child">
              <CheckCircle2 />
              {{ t('Regular progress updates') }}
            </span>
          </div>
          <a
            class="text-link"
            href="#contact"
          >
            {{ t('Tell us about your business') }}
            <ArrowUpRight :size="18" />
          </a>
        </div>
      </div>
    </section>

    <section
      id="services"
      class="section services-section"
    >
      <div class="container">
        <div class="section-head reveal reveal-fade-up">
          <div>
            <p class="eyebrow">OUR EXPERTISE</p>
            <h2>
              {{ t('Your logistics needs.') }}
              <br />
              <span class="blue">{{ t('Our expertise.') }}</span>
            </h2>
          </div>
          <p class="section-intro">
            {{ t('Connected services from start to finish.') }}
            <br />
            {{ t('So you can focus on growing your business.') }}
          </p>
        </div>
        <div class="services-grid reveal reveal-stagger">
          <button
            v-for="(service, index) in company.services"
            :key="service.en"
            class="service-card reveal-child"
            @click="selectedService = service"
          >
            <div class="card-top">
              <component
                :is="icons[service.icon]"
                :size="29"
                :stroke-width="1.5"
              />
              <span>0{{ index + 1 }}</span>
            </div>
            <p class="service-en">{{ service.en }}</p>
            <h3>{{ service.title }}</h3>
            <p>{{ service.text }}</p>
            <div class="card-link">
              {{ t('View details') }}
              <ArrowUpRight :size="20" />
            </div>
          </button>
        </div>
      </div>
    </section>

    <section class="why-section">
      <div class="container">
        <div class="why-heading reveal reveal-fade-up">
          <p class="eyebrow light">WHY JYD CORPORATION</p>
          <h2>{{ t('Your cargo. Our commitment.') }}</h2>
          <p>{{ t('Committed to dependable service, giving you confidence at every step.') }}</p>
        </div>
        <div class="values-grid reveal reveal-stagger">
          <div
            v-for="value in [
              {
                icon: Zap,
                en: 'SPEED',
                title: t('Speed'),
                text: t('Keep operations moving with coordination at every step.'),
              },
              {
                icon: FileCheck2,
                en: 'ACCURACY',
                title: t('Accuracy'),
                text: t('Careful documentation and procedures that follow customs requirements.'),
              },
              {
                icon: ShieldCheck,
                en: 'RELIABILITY',
                title: t('Reliability'),
                text: t('Professional service with attention to your cargo.'),
              },
              {
                icon: Handshake,
                en: 'TRANSPARENCY',
                title: t('Transparency'),
                text: t('Clear communication and updates throughout the process.'),
              },
            ]"
            :key="value.en"
            class="reveal-child"
          >
            <component
              :is="value.icon"
              :size="30"
              :stroke-width="1.5"
            />
            <span>{{ value.en }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="work"
      class="section gallery-section"
    >
      <div class="container">
        <div class="section-head reveal reveal-fade-up">
          <div>
            <p class="eyebrow">BEHIND EVERY DELIVERY</p>
            <h2>
              {{ t('Attention to detail.') }}
              <br />
              {{ t('Care in') }}
              <span class="blue">{{ t('every delivery.') }}</span>
            </h2>
          </div>
          <div
            class="filter-tabs"
            :aria-label="t('Filter work photos')"
          >
            <button
              v-for="filter in [
                { id: 'all', label: t('All') },
                { id: 'transport', label: t('Transport') },
                { id: 'operations', label: t('Operations') },
              ]"
              :key="filter.id"
              :class="{ selected: galleryFilter === filter.id }"
              :aria-pressed="galleryFilter === filter.id"
              @click="galleryFilter = filter.id"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
        <div class="gallery-grid reveal reveal-stagger">
          <button
            v-for="item in filteredGallery"
            :key="item.src"
            class="gallery-card reveal-child"
            @click="selectedImage = item"
          >
            <img
              :src="item.src"
              :alt="item.title"
              loading="lazy"
            />
            <span class="expand-icon">
              <Maximize2 :size="18" />
            </span>
            <div>
              <span>{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
            </div>
          </button>
        </div>
        <p class="gallery-caption reveal reveal-fade-up">
          {{ t('Operational photos from the JYD Corporation company profile.') }}
        </p>
      </div>
    </section>

    <div class="contact-banner reveal reveal-zoom">
      <div class="container">
        <Globe2
          :size="46"
          :stroke-width="1"
        />
        <div>
          <span>LET’S MOVE YOUR BUSINESS FORWARD</span>
          <h2>{{ t('Move your business forward with us') }}</h2>
        </div>
        <a
          href="#contact"
          class="button white"
        >
          {{ t('Contact our team') }}
          <ArrowUpRight :size="19" />
        </a>
      </div>
    </div>

    <section
      id="contact"
      class="section contact-section"
    >
      <div class="container contact-grid">
        <div class="reveal reveal-fade-right">
          <p class="eyebrow">GET IN TOUCH</p>
          <h2>
            {{ t('Ready to listen.') }}
            <br />
            <span class="blue">{{ t('Here for your needs.') }}</span>
          </h2>
          <p class="body-copy">
            {{ t('Tell us about your cargo or the services you need.') }}
            <br />
            {{ t('Our team is ready to advise you on the next steps.') }}
          </p>
          <div class="contact-list">
            <a :href="`tel:${company.phone.replaceAll('-', '')}`">
              <span class="contact-icon">
                <Phone :size="21" />
              </span>
              <div>
                <small>{{ t('Call us') }}</small>
                <strong>
                  {{ company.phone }}
                  <span>({{ company.contact }})</span>
                </strong>
              </div>
              <ArrowUpRight :size="18" />
            </a>
            <a :href="`mailto:${company.email}`">
              <span class="contact-icon">
                <Mail :size="21" />
              </span>
              <div>
                <small>{{ t('Email') }}</small>
                <strong>{{ company.email }}</strong>
              </div>
              <ArrowUpRight :size="18" />
            </a>
            <div class="address">
              <span class="contact-icon">
                <MapPin :size="21" />
              </span>
              <div>
                <small>{{ t('Operations center') }}</small>
                <strong>{{ company.address }}</strong>
              </div>
            </div>
          </div>
          <div class="social-contacts">
            <span>
              <MessageCircle :size="19" />
              LINE
              <small>{{ t('Coming soon') }}</small>
            </span>
            <span>
              <MessagesSquare :size="19" />
              WeChat
              <small>{{ t('Coming soon') }}</small>
            </span>
          </div>
        </div>
        <form
          class="inquiry-form reveal reveal-fade-left"
          @submit.prevent="submitInquiry"
        >
          <div class="form-heading">
            <h3>{{ t('Request a callback') }}</h3>
            <span>REQUEST AN INQUIRY</span>
          </div>
          <p>{{ t('Share a few details so our team can prepare advice for you.') }}</p>
          <div class="form-row">
            <label>
              {{ t('Contact name') }}
              <span>*</span>
              <input
                v-model="form.name"
                required
                autocomplete="name"
                maxlength="100"
                :placeholder="t('Full name')"
              />
            </label>
            <label>
              {{ t('Company name') }}
              <input
                v-model="form.company"
                autocomplete="organization"
                maxlength="150"
                :placeholder="t('Your company')"
              />
            </label>
          </div>
          <div class="form-row">
            <label>
              {{ t('Email') }}
              <span>*</span>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                maxlength="150"
                placeholder="name@company.com"
              />
            </label>
            <label>
              {{ t('Phone number') }}
              <span>*</span>
              <input
                v-model="form.phone"
                type="tel"
                required
                autocomplete="tel"
                pattern="[0-9+()\s\-]{8,20}"
                :title="t('Enter a phone number using 8–20 characters')"
                :placeholder="t('Your preferred contact number')"
              />
            </label>
          </div>
          <label>
            {{ t('Service of interest') }}
            <select v-model="form.service">
              <option
                value=""
                disabled
              >
                {{ t('Select a service') }}
              </option>
              <option
                v-for="service in company.services"
                :key="service.en"
                :value="service.en"
              >
                {{ service.title }}
              </option>
              <option value="other">{{ t('Other / Request advice') }}</option>
            </select>
          </label>
          <label>
            {{ t('Additional details') }}
            <span>*</span>
            <textarea
              v-model="form.message"
              required
              maxlength="3000"
              rows="3"
              :placeholder="t('Cargo type, origin and destination, or what you need help with')"
            ></textarea>
          </label>
          <label class="consent">
            <input
              v-model="form.consent"
              type="checkbox"
              required
            />
            <span>
              {{
                t(
                  'I agree to the use of these details to contact me about the services I am interested in.',
                )
              }}
            </span>
          </label>
          <div
            class="form-status"
            v-if="formStatus"
            role="status"
          >
            <CheckCircle2 :size="22" />
            <p>{{ formStatus }}</p>
          </div>
          <button
            class="button primary submit"
            type="submit"
          >
            {{ t('Try the callback form') }}
            <ArrowUpRight :size="20" />
          </button>
          <p class="demo-note">{{ t('Demo form · No information is sent or stored') }}</p>
        </form>
      </div>
    </section>
  </main>
  <footer class="reveal reveal-fade-up">
    <div class="container footer-main">
      <a
        class="footer-brand"
        href="#home"
      >
        JYD
        <span>CORPORATION CO., LTD.</span>
      </a>
      <p>
        Your Cargo, Our Commitment.
        <br />
        <span>{{ t('Your cargo is our commitment.') }}</span>
      </p>
      <a href="#home">
        {{ t('Back to top') }}
        <MoveUpRight :size="17" />
      </a>
    </div>
    <div class="container footer-bottom">
      <span>© {{ new Date().getFullYear() }} JYD Corporation Co., Ltd. All rights reserved.</span>
      <span>IMPORT · EXPORT · CUSTOMS · TRANSPORTATION</span>
    </div>
  </footer>

  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="selectedService || selectedImage"
        class="modal-backdrop"
        @click.self="closeDetails"
      >
        <section
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            autofocus
            class="modal-close"
            :aria-label="t('Close details')"
            @click="closeDetails"
          >
            <X />
          </button>
          <template v-if="selectedService">
            <component
              :is="icons[selectedService.icon]"
              class="blue"
              :size="40"
            />
            <p class="eyebrow">{{ selectedService.en }}</p>
            <h2 id="modal-title">{{ selectedService.title }}</h2>
            <p class="body-copy">{{ selectedService.detail }}</p>
            <div class="tags">
              <span
                v-for="tag in selectedService.tags"
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
            <a
              href="#contact"
              class="button primary"
              @click="inquireAboutService"
            >
              {{ t('Ask about this service') }}
              <ArrowUpRight :size="18" />
            </a>
          </template>
          <template v-else>
            <img
              class="modal-image"
              :src="selectedImage.src"
              :alt="selectedImage.title"
            />
            <h3 id="modal-title">{{ selectedImage.title }}</h3>
          </template>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
