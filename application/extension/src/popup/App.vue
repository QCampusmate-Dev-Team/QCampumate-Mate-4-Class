<template>
  <KeepAlive>
    <component @switch-view="switchView" :is="current"></component>
  </KeepAlive>
  <!-- <KeepAlive>
    <pop-up msg="QCampusmate Main" v-if="!vis"/>
  </KeepAlive>
  <KeepAlive>
    <settings msg="User Settings" v-if="vis"/>
  </KeepAlive> -->

  <!-- <button @click="load(checked)">Load</button>
  <button @click="exportXLSX">Excel</button>
  <button @click="exportJSON">JSON</button>
  <input type="checkbox" id="isRandom" v-model="checked">
  <label for="isRandom">Randomize</label>

  <button @click="toggle">Toggle Page</button>
  <button @click="openTab">Open DRC</button>
  <button @click="testSW">testSW</button> -->
</template>

<script setup lang="ts">
import Settings from './views/settings.vue'
import SettingsEdit from './views/settings_edit.vue'
import PopUp from './views/popup.vue'
import { StudentInfo } from '@qcampusmate-mate/types'

import { shallowRef, onMounted, provide, reactive} from 'vue'
// import DR from '../../../locals/dr_mock.json'

localStorage.getItem('')
const current = shallowRef(PopUp)
const studentInfo = reactive<StudentInfo>({
  enrollment: NaN,
  school: '', 
  major: '',
  field: '',
  lang1st: '',
  lang2nd: '',
  isItrntnlStd: false,
  provData: false
})

provide('studentInfo', studentInfo)

const switchView = (comp) => {
  // alert(comp)
  switch(comp) {
    case 'popup':
      current.value = PopUp
    break
    case 'settings':
      current.value = Settings
    break
    case 'settings_edit':
      current.value = SettingsEdit
    break
  }
}

// hooks
onMounted(() => {
 //  alert("mounted")
//  chrome.storage.local.set({ DR }, function () {
//     console.log(`in popup App.vue, onMounted: setting DR ${JSON.stringify(DR, null, 2)}`)
//     // alert(`in popup App.vue, onMounted: setting dr ${JSON.stringify(DR.meta, null, 2)}`)
//     // alert(`Setting DRCTree & AP's initial value. DRCTree: ${JSON.stringify(DRCTree)}, AP: ${AP}`)
//   })

  chrome.storage.local.get(['studentInfo'], (res) => {
    Object.assign(studentInfo, res.studentInfo)
  })
})

</script>
