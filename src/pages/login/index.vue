<template>
  <h1 style="text-align: center">{{isLogin ? "用户注册" : "用户登录"}}</h1>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.password"
        type="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-if="isLogin"
        v-model="form.validCode"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <span class="tip" @click="isLogin = !isLogin"> {{isLogin ? "返回登录" : "立即注册"}}</span>
    <div style="margin: 16px;padding-top: 20px;">
      <van-button round block type="primary" native-type="submit">
        {{isLogin ? "注册并登录" : "登录"}}
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  username: "",
  password: "",
  validCode: "",
});
const isLogin = ref(false)


const onSubmit = () => {
  console.log(form);
};
</script>

<style lang="less" scoped>
.tip {
  position: absolute;
  right: 10px;
  padding: 10px;
  color: #1989fa;
}
</style>
