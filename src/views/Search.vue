<template>
  <div class="search-view">
    <input
        :value="searchString"
        @input="(e) => searchString = e.target.value"
      class="search-input"
        placeholder="Поиск.."
      >
    <ul>
      <li v-for="word in filteredData" :key="word.en">
        <div class="word en">
          {{ word.en }}
          <span v-if="word.en_t">
            /{{ word.en_t }}/
          </span>
        </div>
        <div class="word">
          {{ word.ee }}
          <span v-if="word.ee_2">
            /{{ word.ee_2 }}/
          </span>
          <span v-if="word.ee_3">
            /{{ word.ee_3 }}/
          </span>
          <span v-if="word.ee_da">
            /{{ word.ee_da }}/
          </span>
          <span v-if="word.ee_mina">
            /{{ word.ee_mina }}/
          </span>
        </div>
        <div class="word">
          {{ word.ru }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import {mapState} from "pinia";
import {useIndexStore} from "../store/index.js";

export default {
  name: "Search",
  data () {
    return {
      searchString: ''
    }
  },
  computed: {
    ...mapState(useIndexStore, {
      allWords: 'allWords'
    }),
    filteredData () {
      if (this.searchString === '') {
        return []
      } else {
        return this.allWords.filter(item => {
          return (item.en?.toLowerCase().includes(this.searchString.toLowerCase()) ||
              item.ee?.toLowerCase().includes(this.searchString.toLowerCase()) ||
              item.ru?.toLowerCase().includes(this.searchString.toLowerCase()))
        })
      }
    }
  }
}
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-grow: 1;
}
.search-input {
  min-height: 32px;
  padding: 0 8px;
  border-radius: 0;
  border: #ccc 1px solid;
}
ul {
  height: 0;
  margin: 24px 0 0;
  overflow: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
li {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ccc;
  font-size: 12px;
}
li .word {
  display: flex;
  flex-direction: column;
  flex-basis: 33%;
  border-left: #ccc solid 1px;
  padding: 4px;
}
li .word:first-child {
  border-left: none;
}
li .word span {
  font-size: 10px;
}
</style>
