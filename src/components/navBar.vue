<template>
  <div class="header">
    <van-icon name="arrow-left" class="header-left" size="30" @click="goBack" />
    {{title}}
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
    title:""
})
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  background: #fff;
  .header-left {
    float: left;
  }
}
</style>
