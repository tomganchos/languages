<template>
  <div class="list">
    <button>≡</button>
    <ul>
      <li v-for="item in lessons.sort((a, b) => a - b)" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LessonsList",
  props: {
    lessons: {
      type: Array
    },
  },
}
</script>

<style scoped>
  .list {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  ul {
    background: white;
  }
</style>
