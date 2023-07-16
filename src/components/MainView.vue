<template>
  <div class="main-view">
    <div class="card" @click="toggleTranslation">
      <p class="word">{{ currentCard[primaryLanguage] }}</p>
      <div v-if="showTranslation">
        <p v-if="primaryLanguage !== 'ru'" class="translation">{{ currentCard.ru }}</p>
        <p v-if="primaryLanguage !== 'ee'" class="translation">{{ currentCard.ee }}</p>
        <p v-if="primaryLanguage !== 'en'" class="translation">{{ currentCard.en }}</p>
      </div>
    </div>
    <button @click="nextCard" :disabled="cards.length === 0">Next</button>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  props: ['cards'],
  data() {
    return {
      currentIndex: 0,
      showTranslation: false,
      primaryLanguage: localStorage.getItem('primaryLanguage') || 'ru'
    }
  },
  computed: {
    currentCard() {
      if (this.cards.length === 0) {
        return {
          ru: "Выберите уроки в настройках",
          en: "",
          ee: ""
        };
      }
      return this.cards[this.currentIndex];
    }
  },
  methods: {
    nextCard() {
      if (this.currentIndex < this.cards.length - 1) {
        this.currentIndex++
      } else {
        this.currentIndex = 0 // Если мы на последней карточке, возвращаемся к первой
      }
      this.showTranslation = false // Скрыть перевод для следующей карточки
    },
    toggleTranslation() {
      this.showTranslation = !this.showTranslation
    },
  }
}
</script>

<style scoped>
/* Здесь могут быть стили для вашего приложения */
.main-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.word {
  font-size: 24px;
}

.translation {
  font-size: 20px;
  color: #4CAF50; /* Зеленый цвет */
}

.button {
  background: #8BC34A; /* Светло-зеленый */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
