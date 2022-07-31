import http from '@/utils/http'

export function getTableList(state) {
  return http.get('/Table/GetTable/' + state)
}

export function updateTableList(timetable) {
  return http.post('/Table/UpDataTable', timetable)
}

export function deleteTableList(id) {
  return http.delete('/Table/DeleteTable/' + id)
}

export function getWeek(state) {
  return http.get('/Table/GetWeek/' + state)
}

export function UpdateWeek(weekDto) {
  return http.post('/Table/UpdateWeek', weekDto)
}

export function gatState() {
  return http.get('/Table/GetState')
}

export function UpdateState(state) {
  return http.post('/Table/UpdateState/' +state )
}

export function sendExcel(data) {
  return http.post('/Table/ImportLessons', data)
}
