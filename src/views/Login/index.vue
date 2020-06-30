<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{'current' : item.isActive}"
          v-for="(item,index) in menuTab"
          :key="index"
          @click="toggleMenu(item)"
        >{{item.text}}</li>
      </ul>

      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="username" class="item_form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item_form">
          <label>密码</label>
          <el-input
            type="password"
            minlength="6"
            maxlength="20"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item_form" v-if="model === 'register'">
          <label>重复密码</label>
          <el-input
            type="password"
            minlength="6"
            maxlength="20"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item_form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model.number="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" @click="getSms">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login_bt"
            :disabled="loginButtonStatus"
          >{{model === 'login' ? '登录' : '注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetSms } from "@/api/login";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePassword,
  validateCode
} from "@/utils/validate";
export default {
  name: "login",
  setup(props, {refs,root}) {
    // console.log(context);
    /**
     *  attrs: (...) == this.$attrs
        emit: (...) == this.$emit
        isServer: (...) == this.$isServer
        listeners: (...) == this.$listeners
        parent: (...) == this.parent
        refs: (...) == this.refs
        root: (...) == this
     */
    //放置data数据、生命周期、自定义函数
    let checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (!value) {
        return callback(new Error("验证码不为空"));
      } else if (validateCode(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    //验证用户名
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式错误"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePass = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePassword(value)) {
        callback(new Error("密码为6-20位数字加字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasss = (rule, value, callback) => {
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePassword(value)) {
        callback(new Error("密码为6-20位数字加字母"));
      } else if (value != this.ruleForm.password) {
        callback(new Error("两次输入密码不同"));
      } else {
        callback();
      }
    };
    /**
     * 声明数据
     */
    const menuTab = reactive([
      //声明单一对象时使用
      { text: "登录", isActive: true, model: "login" },
      { text: "注册", isActive: false, model: "register" }
    ]);
    //模块值
    const model = ref("login"); //声明基础数据类型变量时使用
    //登录按钮禁用状态
    const loginButtonStatus = ref(true);
    //表单数据
    const ruleForm = reactive({
      username: "1115050632@qq.com",
      password: "",
      passwords: "",
      code: ""
    });
    //表单验证
    const rules = reactive({
      username: [{ validator: validateUserName, trigger: "blur" }],
      password: [{ validator: validatePass, trigger: "blur" }],
      passwords: [{ validator: validatePasss, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }]
    });

    // console.log(isRef(model) ? "是一个基础数据类型" : "不是");
    function useMousePosition() {
      const pos = reactive({
        x: 0,
        y: 0
      });
      return toRefs(pos);
    }
    const { x, y } = useMousePosition();
    // console.log(x.value);
    /**
     * 声明函数
     */
    //切换登录注册
    const toggleMenu = data => {
      menuTab.forEach(element => {
        element.isActive = false;
      });
      model.value = data.model;
      data.isActive = true;
    };
    //提交表单
    const submitForm = formName => {
      context.refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    //获取验证码
    const getSms = () => {
      //判断邮箱是否为空
      if (ruleForm.username == "") {
        root.$message.error('邮箱不能为空！！')
        return false;
      }
      GetSms({ username: ruleForm.username });
    };
    /**
     * 生命周期
     */
    //挂载完成后
    onMounted(() => {});

    return {
      menuTab,
      model,
      loginButtonStatus,
      ruleForm,
      rules,

      toggleMenu,
      submitForm,
      getSms
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  label {
    color: white;
    display: block;
  }
  .item_form {
    margin-bottom: 5px;
  }
  .login_bt {
    width: 100%;
    margin-top: 15px;
  }
}
</style>