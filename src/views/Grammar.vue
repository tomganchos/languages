<template>
  <div class="grammar-view">
    <div
        v-for="grammarItem in grammar"
        class="item"
        @click="showGrammar(grammarItem)"
    >
      <label>
        {{ grammarItem.title }}
      </label>
      <EnglishFlag v-if="grammarItem.language === 'en'" />
      <EstonianFlag v-else-if="grammarItem.language === 'ee'" />
    </div>
    <GrammarPreview
      v-if="showPreview"
      :grammarItem="selectedGrammar"
      @close="showPreview = false"
    />
  </div>
</template>

<script>

import EnglishFlag from "../components/icons/EnglishFlag.vue";
import EstonianFlag from "../components/icons/EstonianFlag.vue";
import GrammarPreview from "../components/GrammarPreview.vue";
import {mapState} from "pinia";
import {useIndexStore} from "../store/index.js";

export default {
  name: "Grammar",
  components: {GrammarPreview, EstonianFlag, EnglishFlag},
  data () {
    return {
      showPreview: false,
      selectedGrammar: null
    }
  },
  computed: {
    ...mapState(useIndexStore, {
      grammar: 'grammar'
    })
  },
  methods: {
    showGrammar (item) {
      this.selectedGrammar = item;
      this.showPreview = true;
    }
  }
}
</script>

<style scoped>
.grammar-view {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 20px;
  overflow-y: auto;
  height: 0;
}
.item {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.item label {
  font-weight: 500;
  cursor: inherit;
}
.item svg {
  height: 24px;
}
</style>
