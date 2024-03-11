<!-- Checkbox.vue -->
<template>
  <div class="checkbox-wrapper">
    <div class="left-block">
      <input type="checkbox" :id="label" :checked="modelValue" @change="updateValue">
      <label :for="label">
        <span class="label">{{ label }}</span>
        <span class="date">{{ lesson.date ? `${lesson.date}` : '' }}</span>
      </label>
    </div>
    <div class="right-block">
      <EnglishFlag v-if="lesson.language === 'en'" />
      <EstonianFlag v-if="lesson.language === 'ee'" />
      <EyeIcon class="eye" @click="previewLesson" />
    </div>
    <LessonPreview
        v-if="showPreview"
        :lesson="lesson"
        @close="showPreview = false"
    />
  </div>
</template>

<script>
import LessonPreview from './LessonPreview.vue'
import EyeIcon from "./icons/EyeIcon.vue";
import EnglishFlag from "./icons/EnglishFlag.vue";
import EstonianFlag from "./icons/EstonianFlag.vue";

export default {
  name: 'Checkbox',
  components: {
    EstonianFlag,
    EnglishFlag,
    EyeIcon,
    LessonPreview,
  },
  props: ['label', 'lesson', 'modelValue'],
  data() {
    return {
      checked: this.value,
      showPreview: false
    };
  },
  watch: {
    checked(newVal) {
      this.$emit('input', newVal);
    }
  },
  methods: {
    previewLesson() {
      this.showPreview = true;
    },
    updateValue(event) {
      this.$emit("update:modelValue", event.target.checked);
    }
  }
}
</script>

<style scoped>
.checkbox-wrapper {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkbox {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.checkbox input {
  margin-right: 10px;
}
.left-block {
  display: flex;
  align-items: center;
}
.left-block input[type="checkbox"] {
  height: 18px;
  width: 18px;
  margin: 0 8px 0 0;
}
.left-block label {
  display: flex;
  align-items: center;
}
.left-block label .label {
  font-weight: 500;
}
.left-block label .date {
  color: #ccc;
  font-size: 80%;
  margin-left: 8px;
}
.right-block svg {
  height: 24px;
  fill: #bbb;
}
.eye {
  margin-left: 8px;
  cursor: pointer;
}
</style>
