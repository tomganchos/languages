<template>
  <header class="header">
    <h1>Languages</h1>
    <SettingsIcon
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
