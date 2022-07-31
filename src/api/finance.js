import http from '@/utils/http'

export function getFinanceList() {
  return http.get('/finance')
}

export function updateFinanceList(finance) {
  return http.post('/finance', finance)
}

export function deleteFinanceList(id) {
  return http.delete('/finance/' + id)
}

export function getBorrow(borrowFlag) {
  return http.get('/finance/borrow/' + borrowFlag)
}

export function updateBorrow(borrow) {
  return http.post('/finance/borrow', borrow)
}

export function deleteBorrow(id) {
  return http.delete('/finance/borrow/' + id)
}

export function getAmount() {
  return http.get('/finance/prop')
}

export function getStatistics() {
  return http.get('/finance/Statistics')
}
