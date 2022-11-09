import { createStore } from 'vuex'
import { DRC } from '../DRC'

console.log("Check in chrome Storage, if data exists in indexedDB, load it into vuex store")

alert("in Vuex: detected existing DRCTree & AP. fetching data from indexedDB.")

// chrome.runtime.sendMessage({ msg: "fetchTree" }, function(response) {
//   alert(JSON.stringify(response));

// })

// DRC should send msg to background to query for DRC
export default createStore({
  state: {
    DRCTree: {a: 1},
    currAP: [1, 2, 3]
  }
})