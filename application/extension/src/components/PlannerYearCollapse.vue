<template>
  <el-collapse v-model="activeName" @change="handleCollapseChange">
    <el-collapse-item  v-for="(gpaInYear, year, index) in plannerTable" :name="year" :key="index">
      <!-- collapse item title -->
      <template #title>
        {{`${year} - ${parseInt(year, 10) + 1}`}} &nbsp;
        <span v-for="(item, index) in aggregate({year}, plannerTable)" :key="index">
          {{ ['GPA ', '年間修得単位数 '][index] }}
          <el-tag size="small" type="info" color="#428bca" effect="dark" class="unit"><b> {{(item).toString() !== 'NaN' ? item : '-----'}} </b>
          </el-tag> &nbsp;
        </span>       
      </template>
      
      <!-- One el-table for one year's grade -->
      <el-row :gutter="20" style="min-width:100%">
        <el-col :span="12" style="min-width:50%" v-for="(grades, index) in gpaInYear" :key="index" :name="index">
          <!-- Course Grade Card (*2 per year)-->
          <el-card style="border-style: none" :body-style="{'padding': '0px'}" shadow="never">

            <!-- Card Header -->
            <div slot="header" class="card-header">
              <span>
                {{ index ? '後期' : '前期'}}
                &nbsp;
                <!-- summary(year, index) -->
                <template v-for="(item, idx) in aggregate({year, quarter: index}, plannerTable)" :key="idx" > 
                  {{ idx ? '修得単位 ' : 'GPA ' }}
                  <!-- {{ idx ? 'semeter units' : 'gpa' }} -->
                  <el-tag size="small" type="info" color="#f6a3b1" effect="dark" class="unit"><b> {{(item).toString() !== 'NaN' ? item : '-----'}} </b>
                  </el-tag>&nbsp;
                </template>
              </span> 
            </div>
            <div>
              <academic-planner-table :grades="grades" :year="year" :quarter="index" :editable="isRegistrationOpen(year, index as 0|1)"
              @delete-course="deleteCourse"></academic-planner-table>
              
              <!-- the button should really belong to academic planner table, but then we need to emit a custom event e.g. `addCourseDialog` to let the parent component know when user clicks the 追加 button-->
              <div style="margin-top: 10px">
                <el-button v-if="isRegistrationOpen(year, index as 0|1)" @click="addCourseDialog(parseInt(year), index as 0|1)">
                  追加
                </el-button>
                <!-- <el-button v-if="isRegistrationOpen(year, index as 0|1)" @click="">
                  delete(year, index as 0|1)
                  削除
                </el-button> -->
              </div>
            </div>
            </el-card>
            <!-- Course Grade Card -->
        </el-col>
      </el-row >
      <el-row v-if="year == drc.maxYearInAp.value" >
        <el-divider></el-divider>
         <el-button @click="drc.maxYearInAp.value++">次年度の履修計画を追加する</el-button> 
      </el-row>

    </el-collapse-item>
  </el-collapse>

  <!-- "講義追加画面" -->
  <el-dialog class="add-course-dialog" 
  v-model="showDialog"
  width="95%"
  :before-close="handleClose"
  center>
    <template #header>
      <el-select v-model="courseType" class="m-2" size="large">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
       <!-- 講義追加画面 -->
    </template>
    <add-course-form ref="dialog" class="add-course-dialog__content"></add-course-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">キャンセル</el-button>
        <el-button type="primary" @click="handleAdd">
          追加
        </el-button>
      </span>
    </template>
  </el-dialog> 
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import AcademicPlannerTable from './AcademicPlannerTable.vue'
import AddCourseForm from './AddCourseForm.vue'
import { ref, inject, computed, markRaw } from 'vue'
import { DRC, aggregate, getPlannerTable } from '../drc/DRC'

const drc = await inject<Promise<DRC>>('drc')
const activeName = ref[`${new Date().getFullYear()}`];

var addYear:number = 0
var addQuarter: 0 | 1 = 0

/*            Reactive properties           */
const showDialog = ref(false) // controls the visibility of the add course dialog
const courseType = ref('自由選択科目')
const dialog = ref<InstanceType<typeof AddCourseForm> | null>(null)
const plannerTable = computed(() => {
  console.log(JSON.stringify(getPlannerTable(drc.records_all.value, drc.maxYearInAp.value), null, 2))
  return getPlannerTable(drc.records_all.value, drc.maxYearInAp.value)
})


/*            CONSTANTS           */
const options = [
  {
    value: '必修科目',
    label: '必修科目',
  },
  {
    value: '選択必修科目',
    label: '選択必修科目',
  },
  {
    value: '自由選択科目',
    label: '自由選択科目',
  },
  {
    value: '気に入りの科目',
    label: '気に入りの科目',
  },

]

/*            Event handlers           */
function handleCollapseChange(activeNames) {
  // console.log(activeNames)
}

const handleAdd = () => {
  showDialog.value = false
  // alert(`in PlannerYearCollapse.vue handleAdd(): ${ dialog.value.targetList.map(i => dialog.value.data[i])}`)
  drc.addCourses(dialog.value.targetList.map(i => dialog.value.data[i]), addYear, addQuarter)

  dialog.value.targetList = []
}

// Fire when Add Course Dialog closes
const handleClose = (done) => {
  ElMessageBox.confirm(
    '追加リストの講義はまだ保存されていません。本当に閉じますか？',
    '追加キャンセルの確認', 
    {
      confirmButtonText: 'はい',
      cancelButtonText: 'いいえ',
      type: 'warning',
      icon: markRaw(Delete)
    }
    )
    .then(() => {
      showDialog.value = false;
      // chrome.runtime.sendMessage({msg: 'addCourseDialogClose'})
      alert("save drc.cachedCourses['compulsory'] to Storage")
      done()
    })
    .catch(() => {
      // catch error
    })
}

/** Fire upon open Add Course Dialog
 * Every time add course dialog opens, set &addYear and &addQuarter according to the year and quarter of academic planner table to which the clicked event belongs to
 * @param year 
 * @param quarter 
 */
function addCourseDialog(year: number, quarter: 0 | 1) {
  showDialog.value = true
  // console.log('add course dialog', year, quarter)
  // console.log('@PlannerYearCollapse.vue, addCourseDialog(): type of year:', typeof year)
  addYear = year
  addQuarter = quarter
}

const deleteCourse = ({ plan_entry_id, year, quarter} ) => {
  // alert(`delete course ${plan_entry_id} ${year} ${quarter}`)
  drc.deleteCourseFromAP(plan_entry_id, year, quarter)
}

/*            Utilities           */
function isRegistrationOpen(year: number, quarter: 0 | 1) {
  const currYear = new Date().getFullYear()
  const currMonth = new Date().getMonth() + 1
  return year > currYear || (year == currYear && (quarter+1) * 2 >= currMonth)
}

</script>

<style scoped>
 /* .add-course-dialog {
   width: auto;
 }

 .add-course-dialog__content {
  margin: 0 auto;
 } */
</style>