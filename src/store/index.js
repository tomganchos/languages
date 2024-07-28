import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', {
    state: ()=> ({
        grammar: [],
        allWords: [],
        allLessons: [],
        selectedLessons: localStorage.getItem('selectedLessons') ? JSON.parse(localStorage.getItem('selectedLessons')) : [],
        cards: [],
        currentIndex: 0,

        language: localStorage.getItem('primaryLanguage') || 'ru',
    }),
    getters: {

    },
    actions: {
        async init() {
            const response = await fetch(`./lessons.json?${Math.random()}`)
            const data = await response.json()
            await this.loadLessons(data.lessons)
            await this.loadGrammar(data.grammar)
            this.flatWords()
            this.loadCards()
        },

        async loadLessons(lessonFiles) {
            let lessons = []
            for (const lessonFile of lessonFiles) {
                const response = await fetch(`./lessons/${lessonFile}?${Math.random()}`)
                const obj = await response.json()
                lessons.push(obj)
            }
            this.allLessons = lessons
        },
        async loadGrammar(grammarFiles) {
            let grammar = []
            for (const grammarFile of grammarFiles) {
                const response = await fetch(`./grammar/${grammarFile.link}?${Math.random()}`)
                const html = await response.text()

                grammar.push({
                    title: grammarFile.title,
                    language: grammarFile.language,
                    link: grammarFile.link,
                    html
                });
            }
            this.grammar = grammar
        },
        flatWords() {
            this.allWords = this.allLessons.flatMap(lesson => {
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
        updateSettings(selectedLessons, primaryLanguage) {
            this.selectedLessons = selectedLessons.map(item => item.lesson)
            this.language = primaryLanguage
            localStorage.setItem('selectedLessons', JSON.stringify(this.selectedLessons));
            localStorage.setItem('primaryLanguage', this.language);
            this.updateCards()
        },

        loadCards() {
            if (localStorage.getItem('cards')) {
                this.cards = JSON.parse(localStorage.getItem('cards'))
                this.currentIndex = JSON.parse(localStorage.getItem('currentIndex'))
            } else {
                this.updateCards()
            }
        },
        updateCards() {
            this.cards = [...this.allLessons.filter(lesson => this.selectedLessons.includes(lesson.lesson)).flatMap(lesson => {
                const lessonName = lesson.lesson
                const lessonLanguage = lesson.language

                return lesson.words.map(word => {
                    return {
                        ...word,
                        lesson: lessonName,
                        language: lessonLanguage,
                        isKnown: null
                    }
                })
            })]
            this.shuffleCards()
            localStorage.setItem('cards', JSON.stringify(this.cards))
            localStorage.setItem('currentIndex', JSON.stringify(this.currentIndex))
        },
        nextCard(isGuessed) {
            this.cards[this.currentIndex].isKnown = isGuessed
            if (this.cards.every(card => card.isKnown)) {
                return true
            }

            if (this.currentIndex < this.cards.length - 1) {
                this.currentIndex++
                while (this.cards[this.currentIndex].isKnown) {
                    if (this.currentIndex < this.cards.length - 1) {
                        this.currentIndex++
                    } else {
                        this.currentIndex = 0
                    }
                }
            } else {
                this.currentIndex = 0
                while (this.cards[this.currentIndex].isKnown) {
                    if (this.currentIndex < this.cards.length - 1) {
                        this.currentIndex++
                    } else {
                        this.currentIndex = 0
                    }
                }
            }
            localStorage.setItem('cards', JSON.stringify(this.cards))
            localStorage.setItem('currentIndex', JSON.stringify(this.currentIndex))
            return false
        },
        resetCards() {
            this.cards.forEach(card => card.isKnown = null)
            this.currentIndex = 0
            this.shuffleCards()

            localStorage.setItem('cards', JSON.stringify(this.cards))
            localStorage.setItem('currentIndex', JSON.stringify(this.currentIndex))
        },
        shuffleCards() {
            for (let i = this.cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }
        }
    },
})