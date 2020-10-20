import request from '@/utils/request'
export default {
  add(video){
    return request({
      url:'/edu/video/addVideo',
      method:'post',
      data:video
    })
  },
  update(video){
    return request({
      url:'/edu/video/updateVideo',
      method:'post',
      data:video
    })
  },
  delete(id){
    return request({
      url:`/edu/video/deleteVideo/${id}`,
      method:'delete'
    })
  },
  getVideoById(id){
    return request({
      url:`/edu/video/getVideo/${id}`,
      method:'get'
    })
  }
}
