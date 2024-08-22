<template>
  <div class="cards-view">
    <InfoBar :current-index="currentIndex" :data="cards || []"/>
    <div class="card" @click="toggleTranslation">
      <p class="word">{{ currentCard ? currentCard[primaryLanguage] : '' }}</p>
      <div v-if="showTranslation">
        <p v-if="primaryLanguage !== 'ru'" class="translation">{{ currentCard.ru }}</p>
        <p v-if="primaryLanguage !== 'en'" class="translation">{{ currentCard.en }}</p>
        <p v-if="primaryLanguage !== 'en' && currentCard.en_t" class="transcription">/{{ currentCard.en_t }}/</p>
        <p v-if="primaryLanguage !== 'ee'" class="translation">{{ currentCard.ee }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_2" class="transcription">{{ currentCard.ee_2 }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_3" class="transcription">{{ currentCard.ee_3 }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_da" class="transcription">{{ currentCard.ee_da }}</p>
        <p v-if="primaryLanguage !== 'ee' && currentCard.ee_mina" class="transcription">{{ currentCard.ee_mina }}</p>
      </div>
    </div>
    <div class="buttons" v-if="cards.length > 0">
      <button class="red" @click="dontKnow" :disabled="cards.length === 0">Не знаю</button>
      <button @click="known" :disabled="cards.length === 0">Дальше</button>
    </div>
    <div v-if="isFinished" class="finished">
      <p>Ты выучил все слова!</p>
      <p>Можешь <button @click="reset">начать заново</button> или добавить новые слова в настройках</p>

    </div>
  </div>
</template>

<script>

import InfoBar from "../components/InfoBar.vue";
import {mapActions, mapState, mapStores} from "pinia";
import {useIndexStore} from "../store/index.js";

export default {
  name: "Cards",
  components: {InfoBar},
  data() {
    return {
      showTranslation: false,
      isFinished: false
    }
  },
  computed: {
    ...mapState(useIndexStore, {
      cards: 'cards',
      currentIndex: 'currentIndex',
      primaryLanguage: 'language',
    }),
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
    ...mapActions(useIndexStore, {
      nextCard: 'nextCard',
      resetCards: 'resetCards'
    }),
    next(isGuessed) {
      this.showTranslation = false
      if (this.nextCard(isGuessed)) {
          this.isFinished = true
          console.log('is Finished')
      }
    },
    known () {
      this.next(true)
    },
    dontKnow () {
      this.next(false)
    },
    toggleTranslation () {
      this.showTranslation = !this.showTranslation
    },
    reset () {
      this.resetCards()
      this.isFinished = false
    },
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
