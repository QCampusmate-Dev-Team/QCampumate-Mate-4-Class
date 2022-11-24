const GPATab = document.querySelector("#tabnavigation_list > ul > li:nth-child(2)");

const AllSubTab = document.querySelector("#tabnavigation_list > ul > li:nth-child(2)");

const TabList = document.querySelector("#tabnavigation_list > ul");

const DRCTab = AllSubTab.cloneNode();
GPATab.style.borderRight = "none";
const DRCTabLink = document.createElement("a");
DRCTabLink.textContent = "履修プランナー"
DRCTabLink.style.cursor = "pointer"

DRCTabLink.addEventListener("click", function() {
  console.log(chrome.runtime)
  chrome.runtime.sendMessage({ msg: "openDRC" }, (res) => {
    if(res.code) {
      console.log(`Sw returns ${res.code}`)
    } else {
      alert("Error!!")
    }
  })
})



DRCTab.appendChild(DRCTabLink)
TabList.appendChild(DRCTab);