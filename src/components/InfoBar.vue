<template>
  <div class="bar-container">
    <div class="bar">
      <div v-for="item in barArray"
           class="bar-item"
           :class="item.color"
           :style="{ width: item.percent + '%' }"
      />
    </div>
    <div class="bar-info">
      <span>
        {{ data[currentIndex]?.lesson }}
      </span>
      <span>
        {{ data.filter(item => item.isKnown).length }}/{{ data.length }}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: "InfoBar",
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    barArray () {
      let array = []
      const length = this.data.length
      this.data.forEach((item, index) => {
        if (index === 0) {
          if (item.isKnown === true) {
            array.push({
              color: 'green',
              count: 1
            })
          } else if (item.isKnown === false) {
            array.push({
              color: 'red',
              count: 1
            })
          } else {
            array.push({
              color: 'gray',
              count: 1
            })
          }
        } else {
          const lastItem = this.data[index - 1]
          if (lastItem.isKnown === item.isKnown) {
            array.at(-1).count++
          } else {
            if (item.isKnown === true) {
              array.push({
                color: 'green',
                count: 1
              })
            } else if (item.isKnown === false) {
              array.push({
                color: 'red',
                count: 1
              })
            } else {
              array.push({
                color: 'gray',
                count: 1
              })
            }
          }
        }
      })
      array.forEach(item => {
        item.percent = +((item.count / length * 100).toFixed(2))
      })
      return array
    }
  }
}
</script>

<style scoped>
.bar-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.bar {
  display: flex;
  height: 8px;
  width: 100%;
}
.bar-item {
  height: 8px;
}
.bar-item.green {
  background-color: #8BC34A;
}
.bar-item.red {
  background-color: #F44336;
}
.bar-item.gray {
  background-color: #CCC;
}
.bar-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 16px;
}
</style>
