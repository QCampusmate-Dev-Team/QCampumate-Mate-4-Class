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
  <button @click="testSW">testSW</button>
</template>

<script setup>
import { loadTranscript as load, exportTranscript as exportXLSX, exportTranscriptJSON as exportJSON } from "../contentScripts/index";
import openTab from '../utils/openDRC'
import HelloWorld from '../components/HelloWorld.vue'
import { ref, onMounted} from 'vue'

const vis = ref(false)
const checked = ref(false)

// hooks
onMounted(() => {
//  alert("mounted")
 const DRCTree = {a: 1}
 const AP = [1, 2, 3]
 chrome.storage.local.set({ DRCTree, AP }, function () {
    // alert(`Setting DRCTree & AP's initial value. DRCTree: ${JSON.stringify(DRCTree)}, AP: ${AP}`)
  })
})

// handlers
const toggle = () => {
  vis.value = !vis.value;
  alert(vis)
}

const testSW = () => {
  chrome.runtime.sendMessage({msg: "hello"}, function(response) {
    alert(response.farewell);
  });
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