<template>
  <el-table
  :data="grades"
  style="width: 100%"
  :row-style="{'height': '20px'}"
  :header-cell-style="{'borderColor': 'rgb(255, 225, 225)', 'background-color': 'rgb(255 240 240)'}"
  :header-row-style="{height:'0px'}"
  :row-class-name="tableRowClassName"
  :cell-style="{padding:'5px'}"
  :show-header="false" border>

    <!-- Delete button (Conditional) -->
    <el-table-column 
      v-if="editable" 
      prop="plan_entry_id" 
      label="plan_entry_id" 
      width="38"> 
      <template #default="scope">
        <el-button 
          style="width: 16px;height:16px"
          type="danger" 
          size="small" 
          icon="Minus"
          @click="$emit('deleteCourse', { plan_entry_id: scope.row.plan_entry_id, year, quarter })"
          circle />
        <!-- <el-icon><Minus /></el-icon> -->
        <!-- @click="deleteCourse(scope.row.plan_entry_id, scope.row.year, scope.row.quarter)" -->
      </template>
    </el-table-column>

    <!-- Subject name -->
    <el-table-column
      prop="subject"
      label="Subject"
      :formatter="subjectCellFormatter"
    > <!-- use formatter attr to format the content-->
    </el-table-column>

    <!-- Unit tag -->
    <el-table-column
      prop="unit"
      label="Unit"
      width="100px"
      align="right"
    >
    <!-- effect="dark" -->
    <!--  circle -->
      <template #default="scope">
        <el-tag
          v-if="scope.row.unit"
          size="small"
          type="info"
          color="gray"
          effect="dark"
          class="unit"><b>{{scope.row.unit.toFixed(1)}}</b>
        </el-tag>
      </template>
    </el-table-column>
    
  </el-table>

</template>
<style lang="scss">
  .el-collapse-item {
    &__header {
      padding: 0px 10px;
    }
    &__header.is-active {
      background-color: rgb(251, 247, 233);
    }

    &__wrap {
      margin-top: 5px;
    }
  }

  .el-table { 
    &__row > td:first-child{
      color: #151515;
    }

    &__row.failed-course > td:first-child{
      color: red;
    }
  }

  // .el-table .failed-course {
  //   --el-table-tr-bg-color: var(--el-color-danger-dark-2);
  // }
</style>
<script>
export default {
  name: 'AcadedmicPlannerTable',
  props: ['grades', 'editable', 'year', 'quarter'],
  setup(props) {
    const subjectCellFormatter = (row, column, cellValue, rowIndex) => {
      const isPNPorW = ['R', 'W'].includes(props.grades[rowIndex].letter_evaluation)
      const isPlanOrInProgress = props.grades[rowIndex].isPlan || row.unit === ''

      if(isPNPorW) {
        return `${cellValue}(*)`
      } else if(isPlanOrInProgress) {
        return cellValue
      } else if(props.grades[rowIndex].letter_evaluation === 'F') {
        return `${cellValue}(0)`
      } else {
        return `${cellValue}(${row.gpa})`
      }
    }
    const tableRowClassName = ({ row, rowIndex }) => {
      switch(props.grades[rowIndex].letter_evaluation) {
        case 'F': 
          return 'failed-course'
        break
        default:
          return ''
      }
    }

    return {
      subjectCellFormatter,
      tableRowClassName
    }
  } 
};
</script>
