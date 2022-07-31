import http from '@/utils/http'
const home = {
  getUrl() {
    return http.get('/personal/getUrl')
  },
  getLength() {
    return http.get('/message/' + '1')
  },
  sendNotice() {
    return http.get('/message/sendNotebook')
  }
}
export default home
