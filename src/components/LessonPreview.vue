<!-- LessonPreview.vue -->
<template>
  <div class="lesson-preview">
    <header>
      <ArrowLeftIcon @click="$emit('close')" />
      <h1 class="label">
        {{ lesson.lesson }}
      </h1>
    </header>
    <ul>
      <li v-for="word in lesson.words" :key="word.en">
        <div class="word en">
          {{ word.en }}
          <span v-if="word.en_t">
            /{{ word.en_t }}/
          </span>
        </div>
        <div class="word">
          {{ word.ee }}
        </div>
        <div class="word">
          {{ word.ru }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ArrowLeftIcon from "./icons/ArrowLeftIcon.vue";

export default {
  name: 'LessonPreview',
  components: { ArrowLeftIcon},
  props: ['lesson']
}
</script>

<style scoped>
.lesson-preview {
  /* Стили вашего приложения */
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

header {
  display: flex;
  align-items: center;
  height: 32px;
}

header svg {
  height: 24px;
  fill: #4caf50;
  cursor: pointer;
  margin-right: 8px;
}

header h1 {
  margin: 0;
  color: #4caf50;
  font-size: 24px;
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
