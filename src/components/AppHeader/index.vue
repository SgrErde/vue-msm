<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="24px" />
      <span class="company">会员管理系统</span>
    </a>
    <!-- 右边下拉菜单 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" icon="el-icon-switch-button">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width:300px;"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "@/api/login";
import passwordApi from "@/api/password";
export default {
  data() {
    //原密码校验
    const validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    //确认密码校验
    const validatePass = (rule, value, callback) => {
      if (value === this.ruleForm.pass) {
        callback();
      } else {
        callback(new Error("两次输入的密码不一致"));
      }
    };
    return {
      user: JSON.parse(localStorage.getItem("vue-msm-user")),
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      // this.$message("click on item " + command);
      switch (command) {
        //修改密码
        case "a":
          this.handlePwd();
          break;
        case "b":
          //退出系统
          this.handleLogout();
          break;

        default:
          break;
      }
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    //退出系统
    handleLogout() {
      logout(localStorage.getItem("vue-msm-token")).then(response => {
        const resp = response.data;
        if (resp.flag) {
          localStorage.removeItem("vue-msm-token");
          localStorage.removeItem("vue-msm-user");
          this.$router.push("/login");
        } else {
          this.$message({
            message: "退出失败",
            type: "warning",
            duration: 600
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then(response => {
              const resp = response.data;
              if (resp.flag) {
                this.handleLogout(); //更新成功，退出系统
                this.dialogFormVisible = false;
                this.$message({
                  showClose: true,
                  message: resp.message,
                  type: "success"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: resp.message,
                  type: "warning"
                });
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  color: white;
  position: absolute;
}
/* 下拉菜单 */
.el-dropdown {
  position: absolute;
  right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
/* .el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
} */
</style>