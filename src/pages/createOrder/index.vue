<template>
  <div class="container">
    <NavBar title="填写订单" />
    <status-bar :item="stateMap" />
    <van-cell class="cell">
      <template #title style="justify-content: center">
        <van-image width="25" height="25" :src="orderData.service.serviceImg" />
        <span class="server-name">{{ orderData.service.serviceName }}</span>
      </template>
      <template #default>
        <div class="service-text">服务内容</div>
      </template>
    </van-cell>
    <van-form @submit="submit">
      <van-cell-group class="cell">
        <van-cell>
          <template #title>就诊医院</template>
          <template #default>
            <div @click="showHospitalsPopup = true">
              <span>{{ form.hospital_name || "请选择就诊医院" }}</span>
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>就诊时间</template>
          <template #default>
            <div @click="showTimePopup = true">
              <span>{{ startTime || "请选择就诊时间" }}</span>
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>陪诊师</template>
          <template #default>
            <div @click="showNursePopup = true">
              <span>{{ nurseName || "请选择陪护师" }}</span>
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>接送地址</template>
          <template #default>
            <div @click="showAreaPopup = true">
              <span>{{ form.receiveAddress || "请选择接送地址" }}</span>
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>联系电话</template>
          <template #default>
            <van-field
              class="text"
              input-align="right"
              placeholder="请输入您的联系电话"
              :rules="[
                { required: true, message: '请填写手机号' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号',
                  trigger: 'onBlur',
                },
              ]"
              v-model="form.tel"
            />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group title="服务需求" class="cell">
        <van-field
          style="height: 100px"
          placeholder="请填写您要就诊的科室..."
          v-model="form.demand"
          :rules="[{ required: true, message: '请简单填写您要就诊的科室' }]"
        />
      </van-cell-group>
      <van-button
        type="primary"
        block
        class="sumbit"
        size="large"
        native-type="submit"
        >提交</van-button
      >
    </van-form>

    <!-- 就诊医院 -->
    <van-popup
      v-model:show="showHospitalsPopup"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-picker
        :columns="hospitalsData"
        @cancel="showHospitalsPopup = false"
        @confirm="onHospitalsConfirm"
      />
    </van-popup>
    <!-- 就诊时间 -->
    <van-popup
      v-model:show="showTimePopup"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-date-picker
        title="选择日期"
        :min-date="minDate"
        @cancel="showTimePopup = false"
        @confirm="onTimeConfirm"
      />
    </van-popup>
    <!-- 陪诊师 -->
    <van-popup
      v-model:show="showNursePopup"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-picker
        :columns="nurseData"
        @cancel="showNursePopup = false"
        @confirm="onNurseConfirm"
      />
    </van-popup>

    <!-- 微信支付二维码 -->
    <van-dialog v-model:show="showQRcode" :show-confirm-button="false">
      <van-icon name="cross" class="close" @click="close" />
      <div>微信支付</div>
      <van-image width="150" height="150" :src="QRcodeImg" />
      <div>请使用本人微信扫码二维码进行支付</div>
    </van-dialog>

    <!-- 选择地区 -->
    <van-popup
      v-model:show="showAreaPopup"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-area
        title="请选择地区"
        :area-list="areaList"
        @confirm="confirmArea"
        @cancel="showAreaPopup = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import statusBar from "../../components/statusBar.vue";
import NavBar from "../../components/navBar.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { createOrderAPI, getOrderDataAPI } from "../../api/order";
import QRcode from "qrcode";
import { areaList } from "@vant/area-data";

const showHospitalsPopup = ref(false);
const showTimePopup = ref(false);
const showNursePopup = ref(false);
const showAreaPopup = ref(false);
const minDate = ref(new Date());
const startTime = ref("");
const router = useRouter();
const orderData = reactive({
  companion: [],
  hospitals: [],
  service: {},
});
const form = reactive({
  hospital_id: "",
  hospital_name: "",
  demand: "",
  companion_id: "",
  receiveAddress: "",
  tel: "",
  starttime: 0,
});
const nurseName = ref("");
const showQRcode = ref(false);
const QRcodeImg = ref("");
const stateMap = ref(0);

onMounted(async () => {
  const { data } = await getOrderDataAPI();
  Object.assign(orderData, data);
});

// 确认接送地址
const confirmArea = (value) => {
  const selectedArea = value.selectedOptions.map((item) => item.text);
  // 如果省和市相同，则去掉重复的市名
  if (selectedArea[0] === selectedArea[1]) {
    selectedArea.splice(1, 1); // 删除第二个重复的省名（即市名）
  }
  form.receiveAddress = selectedArea.join("");
  showAreaPopup.value = false;
};

// 提交按钮
const submit = async () => {
  const res = await createOrderAPI(form);
  QRcode.toDataURL(res.data.wx_code).then((url) => {
    showQRcode.value = true;
    QRcodeImg.value = url;
  });
  stateMap.value = 10;
};

// 关闭支付二维码
const close = () => {
  showQRcode.value = false;
  router.push("/order");
};

// 处理就诊医院
const hospitalsData = computed(() => {
  return orderData.hospitals.map((item) => {
    return { text: item.name, value: item.id };
  });
});

// 选择就诊医院
const onHospitalsConfirm = (value) => {
  form.hospital_id = value.selectedOptions[0].value;
  form.hospital_name = value.selectedOptions[0].text;
  showHospitalsPopup.value = false;
};

// 选择就诊时间
const onTimeConfirm = (value) => {
  startTime.value = value.selectedValues.join("-");
  form.starttime = new Date(startTime.value).getTime();
  showTimePopup.value = false;
};

// 处理陪护师
const nurseData = computed(() => {
  return orderData.companion.map((item) => {
    return { text: item.name, value: item.id };
  });
});

// 选择陪护师
const onNurseConfirm = (value) => {
  form.companion_id = value.selectedOptions[0].value;
  nurseName.value = value.selectedOptions[0].text;
  showNursePopup.value = false;
};
</script>

<style scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
}

.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;
  .server-name {
    margin-left: 10px;
  }
  .service-text {
    background: url(data:image/png;base64,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)
      no-repeat center center;
    background-size: 20px;
  }
}
::v-deep(.van-field__control) {
  color: var(--van-cell-value-color);
}
::v-deep(.van-cell__title) {
  display: flex;
  align-items: center;
}
.sumbit {
  position: absolute;
  bottom: 0;
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
