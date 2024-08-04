<template>
  <div id="app">
    <Header @settingsClicked="showSettings = !showSettings"/>
    <button @send="sendTelegram">send Telegram</button>
    <button @close="close">close</button>
    <main v-if="allLoaded">
      <RouterView v-if="!showSettings"
                  :data="dataToComponent"
      />
      <Settings v-else @close="showSettings = false" @lessonChange="updateLessons"/>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import MainView from './components/MainView.vue'
import Settings from './components/Settings.vue'
import Footer from "./components/Footer.vue";
import { mapActions } from "pinia";
import {useIndexStore} from "./store/index.js";

export default {
  name: 'App',
  components: {
    Footer,
    Header,
    MainView,
    Settings,
  },
  data () {
    return {
      showSettings: false,
      allLoaded: false
    }
  },
  computed: {
    currentRoute() {
      return this.$route.name
    },
    cards() {
      console.log('cards computed: %o', this.cards)
      return this.selectedLessons.flatMap(lesson => {
        const lessonName = lesson.lesson
        const lessonLanguage = lesson.language

        return lesson.words.map(word => {
          return {
            ...word,
            lesson: lessonName,
            language: lessonLanguage
          }
        })
      })
    },
    dataToComponent () {
      // if (this.$route.name === 'Cards') {
      //   return this.cards
      // } else if (this.$route.name === 'Grammar') {
      //   return this.grammarList
      // } else if (this.$route.name === 'Search') {
      //   return this.allWords
      // } else {
        return []
      // }
    }
  },
  created() {
    console.log('created')

    this.init().then(() => {
      console.log('all loaded')
      this.allLoaded = true
    })
  },
  mounted() {
    Telegram.WebApp.ready();

    // Получение информации о пользователе
    const initData = Telegram.WebApp.initData;
    const initDataUnsafe = Telegram.WebApp.initDataUnsafe;

    console.log('Init Data:', initData);
    console.log('Init Data Unsafe:', initDataUnsafe);
  },
  watch: {
    currentRoute () {
      this.showSettings = false
    }
  },
  methods: {
    ...mapActions(useIndexStore, {
      init: 'init'
    }),
    updateLessons(selectedLessons) {
      this.selectedLessons = selectedLessons
      this.showSettings = false
    },
    sendTelegram() {
      const data = { message: 'Hello from Web App!' };
      Telegram.WebApp.sendData(JSON.stringify(data));
    },
    close() {
      Telegram.WebApp.close();
    }
  }
}
</script>

<style>
html {
  height: fill-available;
  height: -webkit-fill-available;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  min-height: fill-available;
  min-height: -webkit-fill-available;
  display: flex;
}

#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
//height: 100vh; min-height: -webkit-fill-available;
}

main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
