<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <!--课程信息确认-->


    <el-form label-width="120px" inline >
      <el-form-item>
        <el-card class="course-card"></el-card>
      </el-form-item>
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'chapter',
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '',
      publishInfo:{
        cover:'',
        teacher:'',
        oneSubject:'',
        twoSubject:'',
        price:''
      },
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      //从路径获取id值
      this.courseId = this.$route.params.id
    }
  }
  ,
  methods: {
    getPublishInfo(){

    },
    //上一步，编辑章节
    previous() {
      this.$router.push({ path: '/course/chapter/' + this.courseId })
    },
    //最终发布
    publish() {

    }
  }

}
</script>

<style scoped>
.course-card {
  width: 800px;
  height: 400px;
}
</style>

