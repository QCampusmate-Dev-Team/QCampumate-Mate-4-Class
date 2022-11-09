export default function openTab(){
  console.log("in openTab.ts: try opening 卒業要件チェッカー");
  let url = chrome.runtime.getURL("./src/drc/index.html");
  chrome.windows.create({
    url, 
    type: 'popup',
  })
}