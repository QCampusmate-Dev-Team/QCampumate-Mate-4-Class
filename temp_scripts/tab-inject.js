const GPATab = document.querySelector("#tabnavigation_list > ul > li:nth-child(2)");

const AllSubTab = document.querySelector("#tabnavigation_list > ul > li:nth-child(2)");

const TabList = document.querySelector("#tabnavigation_list > ul");


const DRCTab = AllSubTab.cloneNode();
DRCTab.textContent = "卒業要件チェッカー";

GPATab.style.borderRight = "none";

TabList.appendChild(DRCTab);
