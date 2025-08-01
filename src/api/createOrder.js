import request from '../utils/request'

// 获取数据
const getOrderDataAPI = ()=>{
    return request.get('/h5/companion')
}

export { getOrderDataAPI }