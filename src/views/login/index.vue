<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login.js";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //用户名密码不为空
          login(this.form.username, this.form.password).then(response => {
            const res = response.data;
            console.log("login参数", res);
            if (res.flag) {
              //用户名和密码验证成功
              getUserInfo(res.data.token).then(response => {
                const resp = response.data;
                console.log("getuserinfo", resp, "--", resp.data);
                if (resp.flag) {
                  //获取用户信息成功
                  localStorage.setItem(
                    "vue-msm-user",
                    JSON.stringify(resp.data)
                  );
                  localStorage.setItem("vue-msm-token", res.data.token);
                  //跳转到首页
                  this.$router.push("/");
                } else {
                  //获取用户信息失败
                  this.$message({
                    message: resp.message,
                    type: "warning"
                  });
                }
              });
            } else {
              //用户名密码验证失败
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else {
          //用户名或（及）密码为空
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url("../../assets/login.jpg") center;
}
.login-form {
  width: 350px;
  margin: 250px auto;
  background-color: rgb(255, 255, 255, 0.8);
  opacity: 0.9;
  padding: 30px;
  border-radius: 20px;
}
.login-title {
  text-align: center;
}
</style>