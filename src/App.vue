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
      allWords: [],
      showSettings: false,
      selectedLessons: [],
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
      if (this.$route.name === 'Cards') {
        return this.cards
      } else if (this.$route.name === 'Grammar') {
        return this.grammarList
      } else if (this.$route.name === 'Search') {
        return this.allWords
      } else {
        return []
      }
    }
  },
  created() {
    fetch(`./lessons.json?${Math.random()}`)
        .then(response => response.json())
        .then(data => {
          this.loadLessons(data.lessons)
          this.loadGrammar(data.grammar)
        });
  },
  watch: {
    currentRoute () {
      this.showSettings = false
    }
  },
  methods: {
    updateLessons(selectedLessons) {
      this.selectedLessons = selectedLessons
      this.showSettings = false
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
              this.setAllWords()
              const savedLessons = JSON.parse(localStorage.getItem('lessons')) || []
              this.selectedLessons = lessons.filter(lesson => savedLessons.includes(lesson.lesson))
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
    },
    setAllWords () {
      this.allWords = this.lessons.flatMap(lesson => {
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
