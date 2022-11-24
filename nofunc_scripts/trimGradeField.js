function useSTDIN() {
  process.stdin.setEncoding('utf8');
  var lines = []; 
  var reader = require('readline').createInterface({
    input: process.stdin,
  });
  const args = process.argv.slice(2);

  reader.on('line', (line) => {
    //改行ごとに'line'イベントが発火される
    lines.push(line); //ここで、lines配列に、標準入力から渡されたデータを入れる
  });
  reader.on('close', () => {
  //標準入力のストリームが終了すると呼ばれる
  const out = lines.join('\n')
  
  try {
    const grades = JSON.parse(out)

    switch(args[0]) {
      case '--no-trim':
        console.log(grades)
        break
      default:
        console.log("DEFAULT!!!")
        // const pick = ({ category, subject, unit, year, subject_number }) => ({ category, subject, unit, year, subject_number, })
        const pick = (grade) => {
          const picked = {}
          Array.from(args).forEach(k => {
            if (grade.hasOwnProperty(k)) {
              picked[k] = grade[k]
            } else {
              console.warn(`WARN: Key ${k} is not found in object ${grade}, skipping...\n`)
            }
          })
          return picked
        }
        const trimmedGrades = grades.map ? grades.map(grade => pick(grade)) : [pick(grades)]
        console.log(trimmedGrades)
    }
  } catch (e) {
    console.error(e)
    console.log('Input must be valid JSON')
  }
  });
}

useSTDIN()