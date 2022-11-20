export default function (){
  console.log("in openDRC.ts: try opening 卒業要件チェッカー");
  let url = chrome.runtime.getURL("./src/drc/index.html");
  chrome.windows.create({
    url, 
    type: 'popup',
  })
}