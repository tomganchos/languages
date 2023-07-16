<template>
  <div id="app">
    <Header @settingsClicked="showSettings = !showSettings"/>
    <main>
      <RouterView v-if="!showSettings"
                  :data="dataToComponent"
      />
      <Settings v-else @close="showSettings = false" :lessons="lessons" @lessonChange="updateLessons"/>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import MainView from './components/MainView.vue'
import Settings from './components/Settings.vue'
import Footer from "./components/Footer.vue";

export default {
  name: 'App',
  components: {
    Footer,
    Header,
    MainView,
    Settings,
  },
  // props: ['lessons'],
  data() {
    return {
      lessons: [],
      grammarList: [],
      showSettings: false,
      selectedLessons: [],
    }
  },
  computed: {
    cards() {
      console.log('cards computed: %o', this.cards)
      return this.selectedLessons.flatMap(lesson => {
        const lessonName = lesson.lesson
        const lessonLanguage = lesson.language

        return lesson.words.map(word => {
          return {
            lesson: lessonName,
            language: lessonLanguage,
            en: word.en,
            ee: word.ee,
            ru: word.ru,
            en_t: word.en_t
          }
        })
      })
    },
    dataToComponent () {
      if (this.$route.name === 'Cards') {
        return this.cards
      } else if (this.$route.name === 'Grammar') {
        return this.grammarList
      } else {
        return []
      }
    }
  },
  created() {
    fetch('./lessons.json')
        .then(response => response.json())
        .then(data => {
          this.loadLessons(data.lessons)
          this.loadGrammar(data.grammar)
        });
  },
  methods: {
    updateLessons(selectedLessons) {
      this.selectedLessons = selectedLessons
      this.shuffleCards()
      this.showSettings = false
    },
    shuffleCards() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    },
    loadLessons(lessonFiles) {
      console.log('loadLessons: %o', lessonFiles)
      let lessons = []
      lessonFiles.forEach(lessonFile => {
        fetch(`./lessons/${lessonFile}?${Math.random()}`)
            .then(response => response.json())
            .then(lessonData => {
              lessons.push(lessonData)
              this.lessons = lessons
              const savedLessons = JSON.parse(localStorage.getItem('lessons')) || []
              this.selectedLessons = lessons.filter(lesson => savedLessons.includes(lesson.lesson))
              this.shuffleCards()
            })
      })
    },
    loadGrammar(grammarFiles) {
      let grammarList = []
      grammarFiles.forEach(grammarFile => {
        fetch(`./grammar/${grammarFile.link}?${Math.random()}`)
            .then(response => response.text())
            .then(html => {
              grammarList.push({
                title: grammarFile.title,
                language: grammarFile.language,
                link: grammarFile.link,
                html
              });
            });
      });
      this.grammarList = grammarList
    }
  }
}
</script>

<style>
/* Здесь могут быть стили для вашего приложения */
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
