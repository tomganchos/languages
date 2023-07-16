<template>
  <div class="grammar-preview">
    <header>
      <ArrowLeftIcon @click="$emit('close')" />
      <h1 class="label">
        {{ grammarItem.title }}
      </h1>
    </header>
    <div class="grammar-body">
      <div v-html="grammarItem.html"/>
    </div>
  </div>
</template>

<script>

import ArrowLeftIcon from "./icons/ArrowLeftIcon.vue";

export default {
  name: "GrammarPreview",
  components: { ArrowLeftIcon },
  props: ['grammarItem']
}
</script>

<style>
.grammar-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;
  min-height: 100vh;
  min-height: fill-available;
  min-height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
}
.grammar-preview header {
  display: flex;
  align-items: center;
  height: 32px;
  margin-bottom: 16px;
}
.grammar-preview header svg {
  height: 24px;
  fill: #4caf50;
  cursor: pointer;
  margin-right: 8px;
}
.grammar-preview header h1 {
  margin: 0;
  color: #4caf50;
  font-size: 24px;
}

.grammar-body {
  overflow: auto;
}
.grammar-body main {
  gap: 16px;
}
.grammar-body h1 {
  font-size: 20px;
  margin: 0;
}
.grammar-body pre {
  display: flex;
  width: max-content;
  white-space: inherit;
  padding: 16px;
  margin: 0 auto;
  background: rgba(76, 175, 80, 0.1);
  border: #4caf50 1px dashed;
}
.grammar-body table, .grammar-body th, .grammar-body td {
  border: 1px solid #ccc;
  border-collapse: collapse;
}
.grammar-body td {
  padding: 8px;
  line-height: 1.5;
}
.grammar-body details ul {
  margin: 0;
}
.grammar-body details li {
  margin-top: 4px;
}
</style>
