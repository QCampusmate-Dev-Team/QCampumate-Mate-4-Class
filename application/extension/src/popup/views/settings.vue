<!-- Two states: ['view', 'edit'] -->
<!-- Edit confirmation triggers a sync with local DB and a degree-requirement api fetch -->
<template>
  <div class="container">
    <!-- background-color: #fff;
    
    padding: 0;
    margin: 0;
    cursor: pointer; -->
    <!-- 【< 戻る】のアイコンは後につけるので気にしなくていい -->
    <button style="border: none; line-height: 13px; background-color:#fff;" @click="$emit('SwitchView', 'popup')" >
      <span style="font-size:14px;">
        <svg style="display:inline;width:10px;position:relative;top:2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
        戻る
      </span>
      
      
    </button> 
    <div class="heading">
      <h2>ユーザ設定</h2>
      <button @click="$emit('SwitchView', 'settings_edit')">編集</button>
    </div>
    
    <table>
      <tbody>
        <tr>
          <td class="left">入学年度</td>
          <td class="right">{{formatCell('enrollment')}}</td>
        </tr>
        <tr>
          <td class="left">学部</td>
          <td class="right">{{formatCell('school')}}</td>
        </tr>
        <tr>
          <td class="left">学科</td>
          <td class="right">{{formatCell('major')}}</td>
        </tr>
        <tr>
          <td class="left">コース・専攻</td>
          <td class="right">{{formatCell('field')}}</td>
        </tr>
        <tr>
          <td class="left">第1外国語</td>
          <td class="right">{{formatCell('lang1st')}}</td>
        </tr>
        <tr>
          <td class="left">第2外国語</td>
          <td class="right">{{formatCell('lang2nd')}}</td>
        </tr>
        <tr>
          <td class="left">留学生</td>
          <td class="right">{{formatCell('isItrntnlStd')}}</td>
        </tr>
        <tr>
          <td class="left">データ提供</td>
          <td class="right">{{formatCell('provData')}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { inject, computed} from 'vue'
  import { StudentInfo } from '@qcampusmate-mate/types'

  const student = inject<StudentInfo>('studentInfo')

  const formatCell = computed(() => (k: string) => {
    if (k === 'isItrntnlStd' || k === 'provData') {
      return student[k] ? 'はい' : 'いいえ'
    } else if (student[k]) {
      return student[k]
    } else {
      return '未記入'
    }
  })
</script>

<style scoped>
  table {
    font-weight: 300;
    font-size: 87.5%;
  }
  .heading {
    margin-top: 8px;
    margin-bottom: 24px;
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
  }
  td {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .right {
    padding-left: 8px;
  }
</style>

