import request from "../utils/request";

// 获取数据
const getOrderDataAPI = () => {
  return request.get("/h5/companion");
};

// 创建订单
const createOrderAPI = (data) => {
  return request.post("/createOrder", data);
};

// 获取订单列表
const getOrderListAPI = (params) => {
  return request.get("/order/list", { params });
};

// 获取订单详情
const getOrderInfoAPI = (params) => {
  return request.get("/order/detail", { params });
};

export { getOrderDataAPI, createOrderAPI, getOrderListAPI, getOrderInfoAPI };
