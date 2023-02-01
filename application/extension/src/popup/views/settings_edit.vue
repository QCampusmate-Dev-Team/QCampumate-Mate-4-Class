<template>
  <div class="container">
    <!-- 【< 戻る】のアイコンは後につけるので気にしなくていい -->
    <button style="border: none; line-height: 13px; background-color:#fff;" @click="$emit('SwitchView', 'popup')" >
      <span style="font-size:14px;">
        <svg style="display:inline;width:10px;position:relative;top:2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
        戻る
      </span>
    </button> 
    <div class="heading">
      <h2>ユーザ設定</h2>
      <button @click="onSubmit">完了</button>
    </div>
    
    <table>
      <tbody>
        <tr>
          <td>入学年度</td>
          <td>
            <select v-model="student.enrollment" name="enroll" id="enroll">
              <option value="">未選択</option>
              <!-- <option value="2020">2015</option>
              <option value="2020">2016</option>
              <option value="2020">2017</option>
              <option value="2019">2018</option> -->
              <option>2019</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>学部</td>
          <td>
            <select v-model="student.school" name="school" id="school">
              <option value="">未選択</option>
              <option>文学部</option>
              <option>経済学部</option>
              <option>理学部</option>
              <option>芸術工学部</option>
              <option>工学部</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>学科</td>
          <td>
            <select v-model="student.major" name="major" id="major">
              <option value="">未選択</option>
              <option>人文学科</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>コース・専攻</td>
          <td>
            <select v-model="student.field" name="field" id="field">
              <option value="">未選択</option>
              <option>哲学コース（倫理学）</option>
              <option>哲学コース（インド哲学）</option>
              <option>哲学コース（西洋哲学）</option>
              <option>哲学コース（中国哲学）</option>
              <option>哲学コース（美学）</option>
              <option>歴史学コース（東洋史）</option>
              <option>歴史学コース（ヨーロッパ史）</option>
              <option>歴史学コース（朝鮮史）</option>
              <option>文学コース（中国文学）</option>
              <option>文学コース（ドイツ文学）</option>
              <option>文学コース（英文学）</option>
              <option>文学コース（フランス文学）</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>第1外国語</td>
          <td>
            <select v-model="student.lang1st" name="lang1" id="lang1">
              <option value="">未選択</option>
              <option>英語</option>
              <option>中国語</option>
              <option>韓国語</option>
              <option>ドイツ語</option>
              <option>スペイン語</option>
              <!-- <option value="en">英語</option>
              <option value="zh">中国語</option>
              <option value="kr">韓国語</option>
              <option value="de">ドイツ語</option>
              <option value="es">スペイン語</option> -->
            </select>
          </td>
        </tr>
        <tr>
          <td>第2外国語</td>
          <td>
            <select v-model="student.lang2nd" name="lang2" id="lang2">
              <option value="">未選択</option>
              <option>英語</option>
              <option>中国語</option>
              <option>韓国語</option>
              <option>ドイツ語</option>
              <option>スペイン語</option>
              <option>日本語</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>留学生</td>
          <td class="chechbox">
            <input type="radio" v-model="student.isItrntnlStd" id="yes" name="isItrntnlStd" :value='true'><label for="yes">はい</label>
             <input type="radio" v-model="student.isItrntnlStd" id="no" name="isItrntnlStd" :value='false'><label for="no">いいえ</label>
          </td>
        </tr>
        <tr>
          <td>データ提供</td>
          <td class="chechbox">
            <input type="radio" v-model="student.provData" id="yes" name="provData" :value='true'><label for="yes">はい</label>
             <input type="radio" v-model="student.provData" id="no" name="provData" :value='false'><label for="no">いいえ</label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { inject, defineEmits, toRaw, onMounted} from 'vue'
  import { StudentInfo } from '@qcampusmate-mate/types'

  const student = inject<StudentInfo>('studentInfo')

  const emit = defineEmits(['SwitchView'])
  const onSubmit = () => {
    emit('SwitchView', 'settings')
    chrome.runtime.sendMessage({msg: 'saveStudentInfo', data: toRaw<StudentInfo>(student)}, (res) => {
      alert(JSON.stringify(student, null, 2))
      // alert(`in settings_edit.vue, onSubmit: succesfully saved student info ${student}, status: ${res.code}`)
    })
  }

  onMounted(() => {
    alert(JSON.stringify(student, null, 2))
  })
</script>

<style scoped>
  /* ユーザ設定ページ独自のcssはここに書いてください */
  .heading {
    margin-top: 8px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .heading button {
    box-sizing: border-box;
    width: 61px;
    height: 28px;
    border: 1px solid #000000;
    border-radius: 14px;
    background-color: #fff;
    margin: 6px, 0px, 0px, 0px;
  }
  .heading button:hover {
    color: #fff;
    background-color: #000000;
  }
  table {
    display: block;
    font-weight: 300;
    font-size: 87.5%;
  }
  select {
    width: 130px;
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .checkbox {
    padding-top: 7px;
    padding-bottom: 7px;
  }
  table {
    height: 30px;
  }
</style>
