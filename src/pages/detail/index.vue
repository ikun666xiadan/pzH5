<template>
  <div class="container">
    <NavBar title="订单详情"/>
    <StatusBar :item="stateMap[orderDetail.trade_state]"/>
    <Tips :state="orderDetail.trade_state"/>
    <van-cell-group class="card">
      <div class="header-text">预约信息</div>
        <van-cell title="预约服务" :value="orderDetail.service_name" />
        <van-cell title="就诊医院" :value="orderDetail.hospital_name" />
        <van-cell title="期望就诊时间" :value="orderDetail.starttime" />
        <van-cell title="就诊人" :value="orderDetail.client?.name" />
        <van-cell title="就诊人电话" :value="orderDetail.client?.mobile" />
        <van-cell title="接送地址" :value="orderDetail.receiveAddress" />
        <van-cell title="其他需求" :value="orderDetail.demand" />
    </van-cell-group>
    <van-cell-group class="card">
      <div class="header-text">订单信息</div>
        <van-cell title="订单编号" :value="orderDetail.out_trade_no" />
        <van-cell title="下单时间" :value="handelTime(orderDetail.order_start_time)" />
        <van-cell title="联系电话" :value="orderDetail.tel" />
        <van-cell title="应付金额(元)" :value="orderDetail.price" />
        <van-cell title="联系客服" value="疑问或投诉>" />
    </van-cell-group>
  </div>
</template>

<script setup>
import StatusBar from "../../components/statusBar.vue";
import NavBar from "../../components/navBar.vue";
import Tips from "../../components/tips.vue";
import { onMounted, reactive } from "vue";
import { getOrderInfoAPI } from "../../api/order";
import { useRoute } from "vue-router";
import handelTime from "../../utils/handelTime"

const orderDetail = reactive({})
const route = useRoute()
// 控制进度条
const stateMap = {
  '待支付':10,
  '待服务':20,
  '已完成':30,
  '已取消':40
}

// 获取详情数据
onMounted(async()=>{
  const res = await getOrderInfoAPI({oid:route.query.oid})
  Object.assign(orderDetail,res.data)
  console.log(orderDetail);
})
</script>

<style scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>