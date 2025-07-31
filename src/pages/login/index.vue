<template>
  <h1 style="text-align: center">{{ isRegist ? "用户注册" : "用户登录" }}</h1>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.username"
        label="手机号"
        placeholder="手机号"
        :rules="[
          { required: true, message: '请填写手机号' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'onBlur',
          },
        ]"
      />
      <van-field
        v-model="form.password"
        type="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-if="isRegist"
        v-model="form.validCode"
        center
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button size="small" type="primary" @click="sendCode">{{
            isCountDown ? `${surplusTime}秒后重试` : "发送验证码"
          }}</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <span class="tip" @click="isRegist = !isRegist">
      {{ isRegist ? "返回登录" : "立即注册" }}</span
    >
    <div style="margin: 16px; padding-top: 20px">
      <van-button round block type="primary" native-type="submit">
        {{ isRegist ? "注册并登录" : "登录" }}
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { createAccountAPI, getCodeAPI, loginAPI } from "../../api/login";
import { useRouter } from "vue-router";
import { setToken } from "../../utils/handleToken";

const form = reactive({
  username: "",
  password: "",
  validCode: "",
});
const isRegist = ref(false);
const router = useRouter();
const isCountDown = ref(false);
const timer = ref(null);
const surplusTime = ref(60);
const codeLoading = ref(false);

const onSubmit = async () => {
  if (!isRegist.value) {
    const res = await loginAPI({
      userName: form.username,
      passWord: form.password,
    });
    if(res.code === 10000) {
      setToken(res);
      router.push("/");
      showToast("登录成功");
    }
  } else {
    const res = await createAccountAPI({
      userName: form.username,
      passWord: form.password,
      validCode: form.validCode,
    });
    if (res.code === 10000) {
      setToken(res);
      router.push("/");
      showToast("注册成功");
    }
  }
};

const sendCode = async () => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!form.username || !phoneReg.test(form.username)) {
    showToast("请输入正确的手机号");
    return;
  }
  if (isCountDown.value) return;
  try {
    codeLoading.value = true;
    const res = await getCodeAPI({ tel: form.username });
    if (res.code === 10000) {
      showToast("验证码发送成功！");
    }
    startCountDown();
  } catch (error) {
    showToast("验证码发送失败，请重试");
  } finally {
    codeLoading.value = false;
  }
};

// 开始倒计时
const startCountDown = () => {
  isCountDown.value = true;
  surplusTime.value = 60;

  timer.value = setInterval(() => {
    surplusTime.value--;
    if (surplusTime.value <= 0) {
      clearInterval(timer.value);
      isCountDown.value = false;
    }
  }, 1000);
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
