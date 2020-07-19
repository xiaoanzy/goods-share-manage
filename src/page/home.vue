<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <!-- <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col> -->
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{userCount}}</span> 所有商品
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{orderCount}}</span> 有效商品
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{adminCount}}</span> 失效商品
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col> -->
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allUserCount}}</span> 今日新增
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allOrderCount}}</span> 问题商品
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allAdminCount}}</span> 系统人数
          </div>
        </el-col>
      </el-row>
      <div class="x"></div>
      <el-row class="quick_operation">
        <el-button @click="insertUpdate" plain>一键添加更新</el-button>
        <el-button @click="checkGoods" plain>过滤无效商品</el-button>
        <el-button @click="filterRepeatGoods" plain>去除重复商品</el-button>
      </el-row>
    </section>
    <!-- <tendency :sevenDate='sevenDate' :sevenDay='sevenDay'></tendency> -->
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  getDbCount,
  insertGoodsInfo,
  checkGoodsInfo,
  clearRepeatGoods
} from "@/api/api";
import { handleResultData } from "@/config/mUtils";
// import tendency from '../components/tendency'
import dtime from "time-formater";
import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount
} from "@/api/getData";
export default {
  data() {
    return {
      userCount: null,
      orderCount: null,
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []]
    };
  },
  components: {
    headTop

    // tendency,
  },
  mounted() {
    this.initData();
    this.getSevenData();
  },
  computed: {},
  methods: {
    checkGoods() {
      this.$confirm("确定执行过滤无效商品操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let token = this.$cookies.get("token");
          clearRepeatGoods(token).then(res => {
            handleResultData(this, res.data);
            if (0 === res.data.code) {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    insertUpdate() {
      this.$confirm("确定执行一键添加更新操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let token = this.$cookies.get("token");
          insertGoodsInfo(token).then(res => {
            handleResultData(this, res.data);
            if (0 === res.data.code) {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    filterRepeatGoods() {
      this.$confirm("确定执行去除重复商品操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let token = this.$cookies.get("token");
          checkGoodsInfo(token).then(res => {
            handleResultData(this, res.data);
            if (0 === res.data.code) {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    initData() {
      let token = this.$cookies.get("token");
      getDbCount(token).then(res => {
        handleResultData(this, res.data);
        if (0 === res.data.code) {
          let data = res.data.data;
          this.userCount = data.goodsInfoCount;
          this.orderCount = data.effective;
          this.adminCount = data.invalid;
          this.allUserCount = data.newCount;
          this.allOrderCount = data.goodsInfoProblemCount;
          this.allAdminCount = data.userCount;
        }
      });
    },
    async getSevenData() {
      const apiArr = [[], [], []];
      this.sevenDay.forEach(item => {
        apiArr[0].push(userCount(item));
        apiArr[1].push(orderCount(item));
        apiArr[2].push(adminDayCount(item));
      });
      const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]];
      Promise.all(promiseArr)
        .then(res => {
          const resArr = [[], [], []];
          res.forEach((item, index) => {
            if (item.status == 1) {
              resArr[Math.floor(index / 7)].push(item.count);
            }
          });
          this.sevenDate = resArr;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}
.quick_operation {
  padding-top: 20px;
}
.x {
  border-bottom: 1px solid #dcdfe6;
  padding: 15px;
}
</style>
