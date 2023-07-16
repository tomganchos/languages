<template>
  <div class="footer">
    <router-link
        to="./"
        :class="{ 'active': $route.name === 'Cards' }"
        class="footer-button"
    >
      <CardsIcon/>
      Карточки
    </router-link>
    <router-link
        to="./grammar"
        :class="{ 'active': $route.name === 'Grammar'}"
        class="footer-button"
    >
      <GrammarIcon/>
      Грамматика
    </router-link>
  </div>
</template>

<script>
import GrammarIcon from './icons/GrammarIcon.vue'
import CardsIcon from './icons/CardsIcon.vue'

export default {
  name: 'Footer',
  components: {CardsIcon, GrammarIcon},
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  height: 56px;
  /* Ваши стили для футера */
}

.footer-button {
  text-decoration: none;
  display: flex;
  flex-basis: 50%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: inherit;
}
.footer-button.active {
  color: #4caf50;
}
.footer-button :deep(svg) {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
.footer-button.active :deep(svg) {
  fill: #4caf50;
}
</style>
