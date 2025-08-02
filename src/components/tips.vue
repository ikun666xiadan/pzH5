<template>
  <div class="tips">
    <div class="item" v-if="orderInfo.trade_state === '待支付'">
      <div class="text1">订单待支付</div>
      <div class="text2">
        请在<Counter :second="second" />内完成支付，超时订单自动取消
      </div>
      <div class="text3">
        <van-button type="success" @click="payMoney">立即支付</van-button>
      </div>
    </div>
    <div class="item" v-if="orderInfo.trade_state === '待服务'">
      <div class="text1">正在为您安排服务专员</div>
      <div class="text2">请保持手机通畅，稍后将有服务专员与您联系</div>
    </div>
    <div class="item" v-if="orderInfo.trade_state === '已取消'">
      <div class="text1">订单已取消</div>
      <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
    </div>
  </div>
  <!-- 微信支付二维码 -->
  <van-dialog v-model:show="showQRcode" :show-confirm-button="false">
    <van-icon name="cross" class="close" @click="showQRcode = false" />
    <div>微信支付</div>
    <van-image width="150" height="150" :src="QRcodeImg" />
    <div>请使用本人微信扫码二维码进行支付</div>
  </van-dialog>
</template>

<script setup>
import QRcode from "qrcode";
import { ref, computed } from "vue";
import Counter from "../components/counter.vue";

const showQRcode = ref(false);
const QRcodeImg = ref("");
const { orderInfo } = defineProps({
  orderInfo: {
    type: Object,
    default: {},
  },
});

// 计算倒计时
const second = computed(() => {
  return orderInfo.order_start_time ? orderInfo.order_start_time + 7200000 - Date.now() : 0;
});

// 支付按钮
const payMoney = () => {
  QRcode.toDataURL(orderInfo.code_url).then((url) => {
    showQRcode.value = true;
    QRcodeImg.value = url;
  });
};
</script>

<style lang="less" scoped>
.item {
  padding: 20px;
  .text1 {
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
    color: #666;
  }
  .text2 {
    font-size: 14px;
    color: #666;
  }
  .text3 {
    text-align: center;
    .van-button {
      margin-top: 10px;
      margin-left: 10px;
      width: 80%;
      font-weight: bold;
    }
  }
}
</style>
