<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" type="text" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程，专业名称注意大小写"></el-input>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" @change="subjectChange" placeholder="一级分类">
          <el-option
            v-for="subject in  subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in  subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择" clearable filterable>
          <el-option
            v-for="teacher in  teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="课程简介">
        <Tinymce  v-model="courseInfo.description"></Tinymce>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :action="BASE_API+'/eduoss/upload'"
        class="avatar-uploader">
          <img :src="courseInfo.cover" alt="显示失败">
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number v-model="courseInfo.price" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import courseApi from '@/api/edu/course'
import subjectApi from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce/index'

export default {
  name: 'info',
  components: { Tinymce },
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        price: '',
        lessonNum: '',
        description: '',
        cover: 'https://online-edu-adela.oss-cn-chengdu.aliyuncs.com/model/html5css3.jpg'
      },
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: []
    }
  },

  created() {
    //树形菜单
    this.getAllSubject()
    //所有教师
    this.getAllTeacher()
    //判断路径是否有id
    if (this.$route.params && this.$route.params.id) {
      //从路径获取id值
      const id = this.$route.params.id
      //调用根据id查询的方法
      this.getCourseInfo(id)
    }
  },

  methods: {
    //根据id回显课程信息
    getCourseInfo(id){
      courseApi.getCourseInfo(id).then(res=>{
        this.courseInfo = res.data.course;
        let pid = this.courseInfo.subjectParentId;
        //二级菜单回显bug解决
        for (let i = 0; i < this.subjectOneList.length; i++) {
          if(pid === this.subjectOneList[i].id){
            this.subjectTwoList = this.subjectOneList[i].children;
            break;
          }
        }
      }).catch(err=>{
        this.$message({
          type:'error',
          message:'获取课程信息失败！'
        })
      })
    },

    //上传成功后
    handleSuccess(res,file){
      this.courseInfo.cover = res.data.url
    },

    //上传前
    beforeUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    //一级分类改变之后，从所有课程分类中找到二级分类
    subjectChange(value) {
      this.subjectOneList.forEach(item => {
        if (value === item.id) {
          this.subjectTwoList = item.children
          //一级分类改变后，二级分类清空
          this.courseInfo.subjectId = ''
        }
      })
    },

    //获取所有课程分类
    getAllSubject() {
      subjectApi.getAll()
        .then(res => {
          this.subjectOneList = res.data.items
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取课程分类失败！'
          })
        })
    },

    //添加或修改课程
    saveOrUpdate() {
      if (!this.courseInfo.id){
        courseApi.addCourseInfo(this.courseInfo).then(res => {
          this.$router.push({ path: '/course/chapter/' + res.data.courseId })
          this.$message({
            type: 'success',
            message: '课程添加成功！'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '课程添加失败！'
          })
        })
      }else {
        console.log(this.courseInfo)
        courseApi.updateCourseInfo(this.courseInfo).then(res=>{
          this.$router.push({ path: '/course/chapter/' + this.courseInfo.id })
          this.$message({
            type: 'success',
            message: '课程修改成功！'
          })
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '课程修改失败！'
          })
        })
      }

    },
    //获取所有讲师
    getAllTeacher() {
      courseApi.getTeacherList()
        .then(res => {
          this.teacherList = res.data.items
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取所有讲师失败'
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
