import request from '../utils/request'

// 获取首页数据
const getHomeDataAPI = ()=>{
    return request.get('/Index/index')
}

export { getHomeDataAPI }