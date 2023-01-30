<script setup lang="ts">
import { ref } from 'vue'
import { fc } from '@qcampusmate-mate/plasapo-core'

defineProps<{ msg: string }>()
fc()
const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

  <hr>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
