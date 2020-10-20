import request from '@/utils/request'

export default {
  getChapterVideo(courseId){
    return request({
      url:`/edu/chapter/getChapterVideo/${courseId}`,
      method:'get'
    })
  },
  getById(id){
    return request({
      url:`/edu/chapter/getChapter/${id}`,
      method:'get'
    })
  }
  ,
  add(chapter){
    return request({
      url:'/edu/chapter/addChapter',
      method:'post',
      data:chapter
    })
  },
  update(chapter){
    return request({
      url:'/edu/chapter/updateChapter',
      method:'post',
      data:chapter
    })
  },
  delete(id){
    return request({
      url:`/edu/chapter/deleteChapterVideo/${id}`,
      method:'delete'
    })
  }

}
