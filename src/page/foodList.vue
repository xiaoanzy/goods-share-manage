<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        :data="tableData"
        @expand="expand"
        :expand-row-keys="expendRow"
        :row-key="row => row.index"
        style="width: 100%"
      >
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="上报时间">
          <template
            slot-scope="scope"
          >{{ scope.row.createTime | formatTimeFilter('yyyy-MM-dd hh:mm:ss')}}</template>
        </el-table-column>
        <el-table-column label="商品链接">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_blank" class="buttonText">点击访问</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="15"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="修改商品状态" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="商品名称" label-width="100px">
            <el-input v-model="selectTable.goodsName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="100px">
            <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button @click="subWtiData" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";
import { getProblemGoodsList, modifyProblemGoodsState } from "@/api/api";
import { handleResultData } from "@/config/mUtils";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      restaurant_id: null,
      city: {},
      offset: 0,
      limit: 15,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      menuOptions: [
        { label: "没问题", value: 0, index: 0 },
        { label: "有问题", value: 1, index: 1 }
      ],
      selectMenu: {},
      selectIndex: 0,
      specsForm: {
        specs: "",
        packing_fee: 0,
        price: 20
      },
      specsFormrules: {
        specs: [{ required: true, message: "请输入规格", trigger: "blur" }]
      },
      specsFormVisible: false,
      expendRow: []
    };
  },
  created() {
    this.restaurant_id = this.$route.query.restaurant_id;
    this.initData();
  },
  computed: {
    specs: function() {
      let specs = [];
      if (this.selectTable.specfoods) {
        this.selectTable.specfoods.forEach(item => {
          specs.push({
            specs: item.specs_name,
            packing_fee: item.packing_fee,
            price: item.price
          });
        });
      }
      return specs;
    }
  },
  components: {
    headTop
  },
  filters: {
    formatTimeFilter: (date, fmt) => {
      var date = new Date(date);
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          var str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      return fmt;
    }
  },
  methods: {
    async initData() {
      let token = this.$cookies.get("token");
      getProblemGoodsList(token, this.currentPage, this.limit).then(res => {
        handleResultData(this, res.data);
        if (0 === res.data.code) {
          let data = res.data.data;
          this.tableData = data.list;
          this.count = data.totalCount;
        }
      });
    },
    async getMenu() {},
    async getFoods() {},
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    deleteSpecs(index) {
      this.specs.splice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let token = this.$cookies.get("token");
      getProblemGoodsList(token, this.currentPage, this.limit).then(res => {
        handleResultData(this, res.data);
        if (0 === res.data.code) {
          let data = res.data.data;
          console.log(data);
          this.tableData = data.list;
          this.count = data.totalCount;
        }
      });

      this.offset = (val - 1) * this.limit;
    },
    expand(row, status) {
      if (status) {
        this.getSelectItemData(row);
      } else {
        const index = this.expendRow.indexOf(row.index);
        this.expendRow.splice(index, 1);
      }
    },
    subWtiData() {
      console.log(this.selectIndex, JSON.stringify(this.selectTable));
      let id = this.selectTable.id;
      let state = this.selectIndex;
      let token = this.$cookies.get("token");
      modifyProblemGoodsState(token, id, state).then(res => {
        handleResultData(this, res.data);
        if (0 === res.data.code) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.initData();
          this.dialogFormVisible = false;
        }
      });
    },
    handleEdit(row) {
      ///////////////////
      this.selectTable = row;

      this.getSelectItemData(row, "edit");
      this.dialogFormVisible = true;
    },
    async getSelectItemData(row, type) {
      this.tableData.splice(row.index, 1, { ...this.selectTable });
      this.$nextTick(() => {
        this.expendRow.push(row.index);
      });
      if (type == "edit" && this.restaurant_id != row.restaurant_id) {
        this.getMenu();
      }
    },
    handleSelect(index) {
      this.selectIndex = index;
      this.selectMenu = this.menuOptions[index];
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
