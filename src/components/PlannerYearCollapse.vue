<template>
  <el-collapse v-model="activeName" @change="handleCollapseChange">
    <el-collapse-item  v-for="(gpaInYear, year, index) in drc.ap" :name="year" :key="index">
      <!-- collapse item title -->
      <template #title>
        {{`${parseInt(year)} - ${parseInt(year) + 1}`}} &nbsp;
        <span v-for="(item, index) in aggregate({year}, drc.ap)" :key="index">
          {{ ['GPA ', '年間修得単位数 '][index] }}
          <!-- {{ ['gpa', 'annual units'][index] }} -->
          <el-tag size="small" type="info" color="#428bca" effect="dark" class="unit"><b> {{(item).toString() !== 'NaN' ? item : '-----'}} </b>
          </el-tag> &nbsp;
          <!-- gpa 
          annual units <el-tag size="mini" type="info" color="#428bca" effect="dark" class="unit"><b> {{parseFloat(totalIn(enrollment, 'unit')).toFixed(1)}} </b> -->
        </span>       
      </template>
      
      <!-- One el-table for one year's grade -->
      <el-container>
        <el-row :gutter="20" style="min-width:100%">
          <el-col :span="12" style="min-width:50%" v-for="(grades, index) in gpaInYear" :key="index" :name="index">
            <!-- Course Grade Card (*2 per year)-->
            <el-card style="border-style: none" :body-style="{'padding': '0px'}" shadow="never">

              <!-- Card Header -->
              <div slot="header" class="card-header">
                <span>
                  {{ index ? '前期' : '後期'}}
                  &nbsp;
                  <!-- summary(year, index) -->
                  <template v-for="(item, idx) in aggregate({year, quarter: index}, drc.ap)" :key="idx" > 
                    {{ idx ? '修得単位 ' : 'GPA ' }}
                    <!-- {{ idx ? 'semeter units' : 'gpa' }} -->
                    <el-tag size="small" type="info" color="#f6a3b1" effect="dark" class="unit"><b> {{(item).toString() !== 'NaN' ? item : '-----'}} </b>
                    </el-tag>&nbsp;
                  </template>
                </span> 
              </div>
              <div>
                <academic-planner-table :grades="grades" :addable="true"></academic-planner-table>
                <!-- <div style="margin-top: 10px">
                  <el-button v-if="parseInt(year.toString()) === new Date().getFullYear()" @click="addCourse(year, index)">
                    追加 {{s}}
                  </el-button>
                </div> -->
              </div>
              </el-card>
              <!-- Course Grade Card -->
          </el-col>
        </el-row>
      </el-container> 

    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from 'element-plus'
import AcademicPlannerTable from './AcademicPlannerTable.vue';
import { ref, inject, onMounted } from 'vue'
import { DRC, aggregate} from '../drc/DRC'

const drc = inject<DRC>('drc')
const activeName = [`${new Date().getFullYear()}`];

function handleCollapseChange(activeNames) {
  console.log(activeNames);
}

// onMounted(() => {
//   alert(JSON.stringify(drc.ap, null, 2))
// })

</script>

<style scoped>

</style>