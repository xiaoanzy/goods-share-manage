<template>
  <div class="fillcontain">
    <head-top></head-top>
    <header class="admin_title">管理员信息</header>
    <div class="admin_set">
      <ul>
        <li>
          <span>姓名：</span>
          <span>{{ user_name }}</span>
        </li>
        <li>
          <span>注册时间：</span>
          <span>{{ create_time | formatTimeFilter('yyyy-MM-dd hh:mm:ss') }}</span>
        </li>
        <li>
          <span>管理员权限：</span>
          <span>{{ admin | manageLevelFilter}}</span>
        </li>
        <li>
          <span>管理员 ID：</span>
          <span>{{ id}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { mapState } from "vuex";
import { baseUrl, baseImgPath } from "@/config/env";
import { getUserInfo } from "@/api/api";
import { handleResultData } from "@/config/mUtils";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      user_name: null,
      create_time: null,
      admin: null,
      id: null
    };
  },
  components: {
    headTop
  },
  filters: {
    manageLevelFilter: value => {
      //1.管理员2.用户3.黑名单
      if (value === 1) {
        return "管理员";
      } else if (value === 2) {
        return "用户";
      } else if (value === 3) {
        return "黑名单";
      }
    },
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
  mounted() {
    this.getUserDataInfo();
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    getUserDataInfo() {
      let token = this.$cookies.get("token");
      getUserInfo(token).then(res => {
        handleResultData(this, res.data);
        if (0 === res.data.code) {
          let data = res.data.data;
          this.user_name = data.fUserName;
          this.create_time = data.fCreateTime;
          this.admin = data.fManageType;
          this.id = data.fUserUuid;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.explain_text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
}
.admin_set {
  width: 60%;
  background-color: #f9fafc;
  min-height: 400px;
  margin: 20px auto 0;
  border-radius: 10px;
  ul > li {
    padding: 20px;
    span {
      color: #666;
    }
  }
}
.admin_title {
  margin-top: 20px;
  .sc(24px, #666);
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  margin-top: 10px;
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
