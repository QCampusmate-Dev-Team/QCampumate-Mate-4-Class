<template>
  <el-container style="height: 100vh;">
    <el-aside width="350px" style="padding-bottom:8px;border-right:1px solid #eee">
      <el-header>
        <h2 style="font-size:25px;margin: 10px 0px;">卒業要件チェッカー</h2>
        <!-- <h2>Degree Requirement Checker</h2> -->
        <!-- <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="left-start">
          <el-button icon="el-icon-info" type="text" circle></el-button>
        </el-tooltip>
        <el-tag size="small" type="info" color="#f6a3b1" effect="dark" ><b> Info </b>
        </el-tag>&nbsp; -->
      </el-header>
      <!-- <el-divider></el-divider> -->
      <Drc-Tree></Drc-Tree>
    </el-aside>
    <el-container>
      <el-header>
        <h2 style="font-size:25px;margin: 10px 0px;"> 履修計画 </h2>
        <!-- <h2> Academic Planner </h2> -->
      </el-header>
      <el-main>
        <planner-year-collapse></planner-year-collapse>
        <!-- <button @click="drc.addCourse"> add course</button> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  // import { ELContainer } from 'element-plus'
  import { onMounted, provide } from 'vue'
  import { DRC } from './DRC' 
  import DrcTree from '@/components/DRCTree.vue'
  import PlannerYearCollapse from '@/components/PlannerYearCollapse.vue'


  // onMounted(() => {
  //   // alert("DRC&AP mounted")
  // })
  
  // const drc = reactive({ ap: null, tree: null });
  const drc = new DRC()
  drc.initialize()

  provide('drc', drc)

</script>

<style scoped>
</style>