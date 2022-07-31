import http from '@/utils/http'

export function getData() {
  return http.get('')
}
//用户密码登录
export function loginUser(loginForm) {
  return http.post('/login', loginForm)
}
// 用户邮箱验证码登录
export function loginEmail(loginForm) {
  return http.post('/loginEmail', loginForm)
}
// 请求邮箱验证码
export function requestVarCode(email) {
  return http.get('/sendEmail/' + email)
}
// 用户注册
export function registerUser(registerForm) {
  return http.post('/register', registerForm)
}
// 忘记密码
export function forgetPasswd(passwd) {
  return http.post('/forget', passwd)
}
// 退出登录
export function exit() {
  return http.get('/user/logout')
}
