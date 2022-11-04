<template>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <KeepAlive>
    <HelloWorld msg="QCampusmate Main" v-if="!vis"/>
  </KeepAlive>
  <KeepAlive>
    <HelloWorld msg="User Settings" v-if="vis"/>
  </KeepAlive>

  <button @click="load(checked)">Load</button>
  <button @click="exportXLSX">Excel</button>
  <button @click="exportJSON">JSON</button>
  <input type="checkbox" id="isRandom" v-model="checked">
  <label for="isRandom">Randomize</label>

  <button @click="toggle">Toggle Page</button>
  <button @click="openTab">Open DRC</button>
</template>

<script setup>
import { loadTranscript as load, exportTranscript as exportXLSX, exportTranscriptJSON as exportJSON } from "../contentScripts/index.js";
import HelloWorld from '../components/HelloWorld.vue'
import { ref } from 'vue'


const vis = ref(false)
const checked = ref(false)

const toggle = () => {
  vis.value = !vis.value;
  alert(vis)
}

const openTab = () => {
  let url = chrome.runtime.getURL("./src/drc/index.html");
  chrome.windows.create({
    url, 
    type: 'popup',
  })
}

</script>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>