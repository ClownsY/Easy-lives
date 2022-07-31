import http from '@/utils/http'
// 账号
// 获取账号信息
export function getAccountInformation() {
  return http.get('/personal/getAccount')
}
// 修改账号信息
export function account(personForm) {
  return http.post('/personal/updateAccount', personForm)
}
// 重置密码
export function reset(email) {
  return http.get('/personal/reset', email)
}
// 修改密码
export function change(passwordForm) {
  return http.post('/personal/updatePassword', passwordForm)
}
// 个人信息
// 获取个人信息
export function getPerson() {
  return http.get('/personal/getPerson')
}
// 修改个人信息
export function changePerson(personForm) {
  return http.post('/personal/updatePerson', personForm)
}
// 上传头像
export function updateProfile(imageUrl) {
  return http.post('/personal/getUrl', imageUrl)
}
// 获取头像
export function getProfile() {
  return http.get('/personal/getUrl')
}
// 消息中心
// 获取信息
export function getMessage(status) {
  return http.get('/message/' + status)
}
// 标为已读
export function mark(id) {
  return http.get('/message/mark/' + id)
}
// 删除信息
export function deleteMessage(id) {
  return http.delete('/message/' + id)
}
