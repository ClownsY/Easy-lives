import http from '@/utils/http'

const order = {
  getAll() {
    return http.get('/order/getFoods')
  },
  del(id) {
    return http.delete('/order/deleteFood/' + id)
  },
  add(data) {
    return http.post('/order/insertFood', data)
  },
  update(data) {
    return http.post('/order/upDataFood', data)
  }
}

export default order
