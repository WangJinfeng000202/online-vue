import request from '@/utils/request'

export default {

  getTeacherList(){
    return request({
      url: '/edu/teacher/selectAll',
      method: 'get'
    })
  },

  getCourseInfo(courseId){
    return request({
      url: `/edu/course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },

  getCourseListPage(pageIndex,pageSize,courseQuery){
    return request({
      url:`/edu/course/getCoursePageList/${pageIndex}/${pageSize}`,
      method:'post',
      data: courseQuery
    })
  },

  addCourseInfo(courseInfo){
    return request({
      url:'/edu/course/addCourse',
      method:'post',
      data: courseInfo
    })
  },

  updateCourseInfo(courseInfo){
    return request({
      url:'/edu/course/updateCourse',
      method:'post',
      data: courseInfo
    })
  },

}
