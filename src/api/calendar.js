import http from '@/utils/http'

export function getUsername() {
  return http.get('/personal/getAccount')
}
