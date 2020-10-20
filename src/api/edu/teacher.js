import request from '@/utils/request'

export default {
    getTeacherPage(pageIndex,pageSize,teacherQuery){
        return request({
            url: `/edu/teacher/pageTeacherCondition/${pageIndex}/${pageSize}`,
            method: 'post',
            data: teacherQuery
          })
    },
    deleteById(id){
        return request({
            url: `/edu/teacher/${id}`,
            method: 'delete'
        })
    },
    addTeacher(teacher){
        return request({
            url:'/edu/teacher/addTeacher',
            method:'post',
            data: teacher
        })
    },
    getTeacherInfo(id){
        return request({
            url:`/edu/teacher/getTeacher/${id}`,
            method:'get'
        })
    },
    updateTeacher(teacher){
        return request({
            url:'/edu/teacher/updateTeacher',
            method:'post',
            data: teacher
        })
    }
}