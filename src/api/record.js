import http from '@/utils/http'

const record = {
  getAll() {
    return http.get('/notebook')
  },
  sendAll(data) {
    return http.post('/notebook', data)
  },
  summary() {
    return http.get('/notebook/getData')
  }
}

export default record
