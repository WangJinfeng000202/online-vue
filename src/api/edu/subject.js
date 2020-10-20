import request from '@/utils/request'
export default {
  getAll(){
    return request({
      url:"/edu/subject/getAllSubject",
      method:'get'
    })
  }
}
