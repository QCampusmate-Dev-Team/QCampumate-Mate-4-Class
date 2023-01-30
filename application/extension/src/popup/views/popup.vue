<template>
  <div class="container">
    <main>
      <h1>プラサポ</h1>
      <button @click="load(true)">成績インポート</button>
      <!-- <button @click="tempLoad">成績インポート</button> -->
      <button @click="openDRC">履修プランナー</button>
      <button @click="$emit('SwitchView', 'settings')">学生情報設定</button>

      <aside>
        <h3>エクスポート</h3>
        <div class="exportButtons">
          <button @click="exportXLSX">Excel</button>
          <button @click="exportCSV">CSV</button>
          <button @click="exportJSON">JSON</button>
        </div>
      </aside>
    </main>
    
    <footer>
      <a href="#">プライバシーポリシー</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { loadTranscript as load, exportTranscript as exportXLSX, exportTranscriptJSON as exportJSON } from "../../contentScripts/grade_io_utils";
import openDRC from '../../utils/openDRC'
const exportCSV = () => {
  alert('CSVエクスポートはまだ実装されていません。')
}
</script>

<style scoped>
  /* popup main独自のcssはここに書いてください */
  .container {
    padding: 8px, 24px, 24px;
  }
  main {
    display: flex;
    flex-direction: column;
  }
  main button {
    box-sizing: border-box;
    width: 223px;
    height: 47px;
    border: 1px solid #000000;
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 12px;
  }
  main button:hover {
    color: #fff;
    background-color: #000000;
  }
  main button:last-of-type {
    margin-bottom: 24px;
  }
  .exportButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
  }
  aside button {
    box-sizing: border-box;
    width: 61px;
    height: 28px;
    border: 1px solid #000000;
    border-radius: 4px;
    margin: 6px, 0px, 0px, 0px;
  }
  footer a {
    color: #000000;
    font-size: 14px;
  }
</style>