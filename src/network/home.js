import {request} from './request'

export default {
  getHomeMultiData() {
    return request({
      url: '/home/multidata',
      method: 'get'
    })
  },
  getHomeGoods(type,page) {
    return request({
      url: '/home/data',
      params: {
        type: type,
        page: page
      }
    })
  }
}
