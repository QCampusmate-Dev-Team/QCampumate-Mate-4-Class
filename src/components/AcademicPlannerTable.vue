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
  .el-table{
    &__row.failed-course > td {
      color: red !important;
    }
  }
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

  .el-table .cell {
    color:#151515;
  }
</style>
<script>
import { ElTable, ElTag, ElTableColumn} from 'element-plus';
export default {
  name: 'AcadedmicPlannerTable',
  props: ['grades', 'addable'],
  methods: {
    subjectCellFormatter(row, column, cellValue) {
      // console.log(`${row}:${column}:${cellValue}:${index}`);
      return `${cellValue}${row.unit === '' ? '' : `(${row.gpa})`}`;
    },
    tableRowClassName({ row }) {
      return row.gpa === 0 ? 'failed-course' : '';
    },
  },
};
</script>
