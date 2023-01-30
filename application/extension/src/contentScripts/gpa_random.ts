import rand_grade from '../../lib/random-grade' // manifest.contentScript ->  "./src/contentScripts/gpa_random.ts"
const testEle = document.querySelector("#main > form > table > tbody > tr.label > td")

function getRandomGPA() {
  const gpa = (rand_grade() + Math.random()).toFixed(2);
  if (gpa > 4) {
    return Math.floor(gpa).toFixed(2)
  }
  return gpa
}


function mock() {
  // alert(  (rand_grade() + Math.random()).toFixed(2)  );
  const start = 2, end = 35;
  const kikan = document.querySelector(`#main > form > table > tbody > tr:nth-child(2) > td > div > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(3)`)

  kikan.textContent = "3.43"
  const senkou = document.querySelector(`#main > form > table > tbody > tr:nth-child(2) > td > div > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3)`)
  senkou.textContent = "3.64"


  for (let i = start+2;i <= end; i++) {
    const target = document.querySelector(`#main > form > table > tbody > tr:nth-child(2) > td > div > table:nth-child(2) > tbody > tr:nth-child(${i}) > td:nth-child(3)`)
    if (target) {
      target.textContent = getRandomGPA()
    }
  }
}

if (testEle.textContent.trim() == "全ての科目") {
  mock()
  for (let i = 0; i < 15; i++) {
    console.log()
  }
}
