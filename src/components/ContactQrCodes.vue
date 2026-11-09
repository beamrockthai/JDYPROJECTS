<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { Expand, MessageCircle, MessagesSquare, X } from 'lucide-vue-next'

  const props = defineProps({
    translate: { type: Function, required: true },
  })

  const dialog = ref(null)
  const selectedId = ref(null)
  const contactCodes = computed(() => [
    {
      id: 'line',
      name: 'LINE',
      image: '/images/contact-line-qr.jpg',
      icon: MessageCircle,
      title: props.translate('Contact us on LINE'),
    },
    {
      id: 'wechat',
      name: 'WeChat',
      image: '/images/contact-wechat-qr.jpg',
      icon: MessagesSquare,
      title: props.translate('Contact us on WeChat'),
    },
  ])
  const selectedCode = computed(() => {
    return contactCodes.value.find((code) => code.id === selectedId.value)
  })

  async function openCode(id) {
    selectedId.value = id
    await nextTick()
    dialog.value.showModal()
  }

  function closeCode() {
    dialog.value.close()
  }

  function closeOnBackdrop(event) {
    if (event.target === dialog.value) {
      closeCode()
    }
  }
</script>

<template>
  <div class="contact-qr-grid">
    <button
      v-for="code in contactCodes"
      :key="code.id"
      type="button"
      class="contact-qr-card"
      aria-haspopup="dialog"
      :aria-label="code.title + ' — ' + translate('Enlarge QR code')"
      @click="openCode(code.id)"
    >
      <span class="contact-qr-heading">
        <component
          :is="code.icon"
          :size="19"
          aria-hidden="true"
        />
        <strong>{{ code.name }}</strong>
      </span>
      <img
        :src="code.image"
        :alt="code.title"
        loading="lazy"
      />
      <span class="contact-qr-description">{{ translate('Scan to add us as a contact') }}</span>
      <span class="contact-qr-enlarge">
        {{ translate('Enlarge QR code') }}
        <Expand :size="13" />
      </span>
    </button>
  </div>

  <dialog
    ref="dialog"
    class="contact-qr-dialog"
    aria-labelledby="contact-qr-title"
    @click="closeOnBackdrop"
    @close="selectedId = null"
  >
    <template v-if="selectedCode">
      <div class="contact-qr-dialog-header">
        <h2 id="contact-qr-title">{{ selectedCode.title }}</h2>
        <button
          type="button"
          :aria-label="translate('Close details')"
          autofocus
          @click="closeCode"
        >
          <X :size="21" />
        </button>
      </div>
      <img
        :src="selectedCode.image"
        :alt="selectedCode.title"
      />
      <p>{{ translate('Scan with LINE or WeChat to contact our team.') }}</p>
    </template>
  </dialog>
</template>

<style scoped>
  .contact-qr-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 27px;
    max-width: 420px;
  }

  .contact-qr-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 19px 14px 15px;
    border: 1px solid #dce7ee;
    border-radius: 7px;
    background: #fff;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .contact-qr-card:hover {
    border-color: #88bba4;
    box-shadow: 0 6px 18px #102c4809;
  }

  .contact-qr-heading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #098a4e;
    font-size: 13px;
  }

  .contact-qr-card img {
    display: block;
    width: 100%;
    max-width: 150px;
    aspect-ratio: 1;
    object-fit: contain;
    padding: 10px;
    margin: 13px 0 7px;
    background: #fff;
  }

  .contact-qr-description {
    font-size: 10px;
    color: #7b8e9e;
    line-height: 1.7;
    text-align: center;
  }

  .contact-qr-enlarge {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 10px;
    font-size: 10px;
    color: #197b59;
  }

  .contact-qr-dialog {
    width: min(520px, calc(100vw - 32px));
    max-height: 90dvh;
    padding: 24px;
    border: 0;
    border-radius: 9px;
    color: #142d47;
    background: #fff;
  }

  .contact-qr-dialog::backdrop {
    background: #061d34b8;
    backdrop-filter: blur(5px);
  }

  .contact-qr-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .contact-qr-dialog-header h2 {
    font-size: 19px;
    letter-spacing: 0;
  }

  .contact-qr-dialog-header button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    background: #f1f6f8;
  }

  .contact-qr-dialog > img {
    width: 100%;
    max-height: 65dvh;
    object-fit: contain;
    padding: 20px;
    margin-block: 12px;
    background: #fff;
  }

  .contact-qr-dialog > p {
    text-align: center;
    color: #7b8e9e;
    font-size: 12px;
    line-height: 1.8;
  }

  @media (max-width: 360px) {
    .contact-qr-grid {
      gap: 10px;
    }

    .contact-qr-card {
      padding-inline: 8px;
    }
  }
</style>
