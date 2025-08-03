<template>
  <div class="container">
    <div class="user">
      <van-image
        class="img"
        width="100"
        height="100"
        :src="userInfo?.avatar || defaultAvatar"
      />
      <div class="text">{{ userInfo?.name || "请先登录" }}</div>
    </div>
    <div class="order">
      <div class="top">
        <div class="text1">我的订单</div>
        <div class="text2">全部</div>
      </div>
      <div class="bottom">
        <div class="item" @click="goOrder(1)">
          <van-image
            class="img"
            width="40"
            height="40"
            src="/images/od_10.png"
          />
          <div>待支付</div>
        </div>
        <div class="item" @click="goOrder(2)">
          <van-image
            class="img"
            width="40"
            height="40"
            src="/images/od_20.png"
          />
          <div>待服务</div>
        </div>
        <div class="item" @click="goOrder(3)">
          <van-image
            class="img"
            width="40"
            height="40"
            src="/images/od_30.png"
          />
          <div>已完成</div>
        </div>
        <div class="item" @click="goOrder(4)">
          <van-image
            class="img"
            width="40"
            height="40"
            src="/images/od_40.png"
          />
          <div>已取消</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="foot1" @click="showShare = true">
        <div class="left">
          <van-image width="30" height="30" src="/images/card_2.png" />
          分享转发
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="foot2" @click="contact">
        <div class="left">
          <van-image width="30" height="30" src="/images/contact-mobile.png" />
          联系客服
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
    <van-button type="danger" class="quit" @click="isShowDialog = true"
      >退出登录</van-button
    >
    <van-dialog
      v-model:show="isShowDialog"
      title="提示"
      show-cancel-button
      @cancel="isShowDialog = false"
      @confirm="logout"
    >
      <div class="quit_text">是否确认退出登录</div>
    </van-dialog>
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { removeToken } from "../../utils/handleToken";
import { useRouter } from "vue-router";
import { useClipboard } from "@vueuse/core";

const defaultAvatar = "/images/avatar.jpg";
const isShowDialog = ref(false);
const router = useRouter();
const showShare = ref(false);
const options = [
  { name: "QQ", icon: "qq" },
  { name: "微信", icon: "wechat" },
  { name: "微博", icon: "weibo" },
  { name: "复制链接", icon: "link" },
];

// 获取用户信息
const userInfo = computed(() => {
  return JSON.parse(localStorage.getItem("h5_userInfo"));
});

// 退出登录
const logout = () => {
  removeToken();
  router.push("/login");
  showToast("账号退出成功");
  isShowDialog.value = false;
};

// 前往订单页
const goOrder = (active) => {
  router.push(`/order?active=${active}`);
};

// 分享
const onSelect = async (option) => {
  const shareData = {
    title: "发现一个好用的服务应用",
    text: "快来体验这款便捷的服务应用吧！",
    url: window.location.href, // 当前页面URL或你的应用下载链接
  };

  try {
    switch (option.name) {
      case "QQ":
        // QQ分享需要特定的URL格式
        window.open(
          `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
            shareData.url
          )}&title=${encodeURIComponent(shareData.title)}`
        );
        break;
      case "微信":
        showToast("请使用微信内置的分享功能");
        // 微信分享在移动端需要调用微信JS-SDK
        // 这里简单提示用户手动分享
        break;
      case "微博":
        window.open(
          `http://service.weibo.com/share/share.php?url=${encodeURIComponent(
            shareData.url
          )}&title=${encodeURIComponent(shareData.title)}`
        );
        break;
      case "复制链接":
        const { copy } = useClipboard();
        await copy(shareData.url);
        showToast("链接已复制到剪贴板");
        break;
    }
  } catch (error) {
    showToast("分享失败，请稍后重试");
    console.error("分享错误:", error);
  } finally {
    showShare.value = false;
  }
};

// 联系客服
const contact = () => {
  // 显示客服对话框
  showDialog ({
    title: "联系客服",
    message:
      "工作时间：9:00-18:00\n客服电话：666-114514-666\n客服邮箱：114514cxk.com",
  });
};
</script>

<style scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: hidden;
  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;
    .img {
      margin-top: 30px;
    }
    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }
  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .text1 {
        color: #333;
      }
      .text2 {
        color: #999;
      }
      border-bottom: 0.5px solid #f5f5f5;
    }
    .bottom {
      padding: 10px;
      display: flex;
      justify-content: space-around;
      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;
    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #555;
      .left {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
      }
    }
    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }
  .quit {
    width: 90%;
    margin: 20px;
  }
  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
