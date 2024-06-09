<template>
  <div class="cards-view">
    <InfoBar :current-index="currentIndex" :data="newCards || []"/>
    <div class="card" @click="toggleTranslation">
      <p class="word">{{ currentCard ? currentCard[primaryLanguage] : '' }}</p>
      <div v-if="showTranslation">
        <p v-if="primaryLanguage !== 'ru'" class="translation">{{ currentCard.ru }}</p>
        <p v-if="primaryLanguage !== 'en'" class="translation">{{ currentCard.en }}</p>
        <p v-if="primaryLanguage !== 'en' && currentCard.en_t" class="transcription">/{{ currentCard.en_t }}/</p>
        <p v-if="primaryLanguage !== 'ee'" class="translation">{{ currentCard.ee }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_2" class="transcription">{{ currentCard.ee_2 }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_3" class="transcription">{{ currentCard.ee_3 }}</p>
      </div>
    </div>
    <div class="buttons" v-if="data.length > 0">
      <button class="red" @click="dontKnow" :disabled="newCards.length === 0">Не знаю</button>
      <button @click="known" :disabled="newCards.length === 0">Дальше</button>
    </div>
    <div v-if="isFinished" class="finished">
      <p>Ты выучил все слова!</p>
      <p>Можешь <button @click="reset">начать заново</button> или добавить новые слова в настройках</p>

    </div>
  </div>
</template>

<script>

import InfoBar from "../components/InfoBar.vue";

export default {
  name: "Cards",
  components: {InfoBar},
  props: ['data'],
  data() {
    return {
      currentIndex: 0,
      showTranslation: false,
      primaryLanguage: localStorage.getItem('primaryLanguage') || 'ru',
      newCards: [],
      isFinished: false
    }
  },
  computed: {
    currentCard() {
      this.fromNewCardsFromCards()
      if (this.data.length === 0) {
        return {
          ru: "Выберите уроки в настройках",
          en: "",
          ee: ""
        };
      }
      return this.newCards[this.currentIndex];
    }
  },
  mounted() {
    this.checkStorage()
  },
  methods: {
    nextCard () {
      if (this.newCards.every(card => card.isKnown)) {
        this.isFinished = true
        console.log('is Finished')
        return
      }
      if (this.currentIndex < this.newCards.length - 1) {
        this.currentIndex++
        while (this.newCards[this.currentIndex].isKnown) {
          if (this.currentIndex < this.newCards.length - 1) {
            this.currentIndex++
          } else {
            this.currentIndex = 0
          }
        }
      } else {
        this.currentIndex = 0
        while (this.newCards[this.currentIndex].isKnown) {
          if (this.currentIndex < this.newCards.length - 1) {
            this.currentIndex++
          } else {
            this.currentIndex = 0
          }
        }
      }
      this.showTranslation = false
      this.updateStorage()
    },
    known () {
      this.newCards[this.currentIndex].isKnown = true
      this.nextCard()
    },
    dontKnow () {
      this.newCards[this.currentIndex].isKnown = false
      this.nextCard()
    },
    toggleTranslation () {
      this.showTranslation = !this.showTranslation
    },
    fromNewCardsFromCards () {
      if (this.data.length !== this.newCards.length) {
        this.newCards = this.data.map(card => {
          return {
            ...card,
            isKnown: null
          }
        })
        this.shuffleCards()
      }
    },
    reset () {
      this.newCards = this.data.map(card => {
        return {
          ...card,
          isKnown: null
        }
      })
      this.isFinished = false
      this.currentIndex = 0
      this.shuffleCards()
      this.updateStorage()
    },
    shuffleCards() {
      for (let i = this.newCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.newCards[i], this.newCards[j]] = [this.newCards[j], this.newCards[i]];
      }
    },
    updateStorage() {
      localStorage.setItem('currentList', JSON.stringify(this.newCards))
      localStorage.setItem('currentIndex', JSON.stringify(this.currentIndex))
    },
    checkStorage() {
      if (localStorage.getItem('currentList')) {
        this.newCards = JSON.parse(localStorage.getItem('currentList'))
      }
      if (localStorage.getItem('currentIndex')) {
        this.currentIndex = JSON.parse(localStorage.getItem('currentIndex'))
      }
    }
  }
}
</script>



<style scoped>
.cards-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px;
  background: #FFFFFF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.word {
  font-size: 24px;
}

.translation {
  font-size: 20px;
  color: #4CAF50; /* Зеленый цвет */
}
.transcription {
  font-size: 14px;
  color: #4CAF50; /* Зеленый цвет */
  margin-top: -12px;
}
.buttons {
  display: flex;
  gap: 16px;
}
button {
  background: #8BC34A; /* Светло-зеленый */
  border: none;
  color: white;
  padding: 0 20px;
  height: 36px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
button.red {
  background: #f44336; /* Красный */
}
</style>
