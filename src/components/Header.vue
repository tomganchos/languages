<template>
  <header class="header">
    <h1>Languages</h1>
    <SettingsIcon
        v-if="currentPage === 'Cards'"
        class="settings"
        @click="$emit('settingsClicked')"
    />
  </header>
</template>

<script>
import SettingsIcon from './icons/SettingsIcon.vue'

export default {
  name: 'Header',
  components: {SettingsIcon},
  computed: {
    currentPage() {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #4CAF50; /* Зеленый цвет */
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 20px;
}

.header .settings {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>
