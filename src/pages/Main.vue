<template>
  <div>
    <div class="page-content">
      <RouterView/>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="item in tabBarData.children" :key="item.path" :icon="item.meta.icon" :url="`/#${item.path}`">{{item.meta.name}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const active = ref(0);
const router = useRouter()
const route = useRoute()
const tabBarData = ref({})
onMounted(()=>{
  tabBarData.value = router.options.routes[0]
  active.value = tabBarData.value.children.findIndex(item => '/' + item.path === route.path)
})

</script>

<style scoped>
.page-content {
  padding-bottom: 40px;
}
</style>