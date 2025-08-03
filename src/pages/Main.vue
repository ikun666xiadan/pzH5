<template>
  <div>
    <RouterView/>
    <van-tabbar v-model="active" class="main-content">
      <van-tabbar-item v-for="item in tabBarData.children" :key="item.path" :icon="item.meta.icon" :url="`/#${item.path}`">{{item.meta.name}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const active = ref(0);
const router = useRouter()
const route = useRoute()
const tabBarData = ref({})

// 更新激活状态
const updateActive = () => {
  if (tabBarData.value.children) {
    const currentIndex = tabBarData.value.children.findIndex(item => '/' + item.path === route.path)
    if (currentIndex !== -1) {
      active.value = currentIndex
    }
  }
}

onMounted(()=>{
  tabBarData.value = router.options.routes[0]
  updateActive()
})

// 监听路由变化，更新激活状态
watch(() => route.path, () => {
  updateActive()
}, { immediate: true })

</script>

<style scoped>

</style>