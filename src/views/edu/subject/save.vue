<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag>
          <i class="el-icon-upload"/>
          <a :href="'https://online-edu-adela.oss-cn-chengdu.aliyuncs.com/model/02.xlsx'">点击下载模板</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/edu/subject/addSubject'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'save',
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API,
      fileUploadBtnText: '上传到服务器',
      importBtnDisabled: false,
      loading: false
    }
  },
  created() {
  },
  methods: {

    //点击按钮上传文件到接口
    submitUpload() {
      this.importBtnDisabled=true
      this.loading = true
      //js: document.getElementById("upload").submit()
      this.$refs.upload.submit()
    },
    //上传成功
    fileUploadSuccess() {
      this.loading=false
      this.$message({
        type: 'success',
        message: '课程分类添加成功'
      })
      this.$router.push({path:'/subject/list'})
    },
    //上传失败
    fileUploadError() {
      this.loading=false
      this.$message({
        type: 'error',
        message: '课程分类添加失败'
      })
    }
  }
}
</script>

<style scoped>

</style>
