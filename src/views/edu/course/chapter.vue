<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="primary" @click="popForm">新增章节</el-button>
    <!--章节显示-->
    <el-table
      :data="chapterVideos"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="title"
        label="章节"
        width="500">
      </el-table-column>
      <el-table-column label="操作" align="right">
        <template slot-scope="scope">
          <div v-if="scope.row.children">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="popVideoForm(scope.row.id)">新增小节
            </el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateChapterById(scope.row.id)">修改
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteChapterOpen(scope.row.id)">删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="getVideoInfo(scope.row.id)">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteVideoOpen(scope.row.id)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--新增或修改章节 TODO -->
    <el-dialog title="章节信息" :visible.sync="dialogFormVisible">
      <el-form :model="video" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="video.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="视频"></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增小节 TODO -->
    <el-dialog title="小节信息" :visible.sync="dialogVideoFormVisible">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="video.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import chapterApi from '@/api/edu/chapter'
import videoApi from '@/api/edu/video'

export default {
  name: 'chapter',
  data() {
    return {
      dialogFormVisible: false,
      dialogVideoFormVisible: false,
      chapterId: '',
      courseId: '',
      chapterVideos: [],
      chapter: {
        id: '',
        title: '',
        sort: ''
      },
      video: {
        id: '',
        title: '',
        sort: ''
      }
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      //从路径获取id值
      this.courseId = this.$route.params.id
    }
    this.getChapterVideoInfo(this.courseId)
  },

  methods: {

    //删除章节警告提示
    deleteVideoOpen(id) {
      this.$confirm('此操作将删除本小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteVideoById(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    //根绝id删除小节
    deleteVideoById(id) {
      videoApi.delete(id).then(res => {
        this.getChapterVideoInfo(this.courseId)
        this.$message.success('删除成功')
      }).catch(err => {
        this.$message.error('删除失败')
      })
    },

    //根据id查询小节信息，小节数据回显
    getVideoInfo(videoId) {
      this.dialogVideoFormVisible = true
      videoApi.getVideoById(videoId)
        .then(res => {
          this.video = res.data.video
        })
        .catch(err => {
          this.$message.error('数据加载失败')
        })
    },

    //小节信息框弹出
    popVideoForm(id) {
      this.video = {}
      this.chapterId = id
      this.dialogVideoFormVisible = true
    },

    //新增或修改小节信息
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.video.courseId = this.courseId
        this.video.chapterId = this.chapterId
        videoApi.add(this.video)
          .then(res => {
            this.dialogVideoFormVisible = false
            this.getChapterVideoInfo(this.courseId)
            this.$message.success('添加成功')
          }).catch(err => {
          this.$message.error('添加失败')
        })
      } else {
        videoApi.update(this.video)
          .then(res => {
            this.dialogVideoFormVisible = false
            this.getChapterVideoInfo(this.courseId)
            this.$message.success('修改成功')
          }).catch(err => {
          this.$message.error('修改失败')
        })
      }
    },

    //删除章节警告提示
    deleteChapterOpen(id) {
      this.$confirm('此操作将删除本章以及所有小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteChapterById(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    //根据章节id删除
    deleteChapterById(id) {
      chapterApi.delete(id).then(res => {
        this.getChapterVideoInfo(this.courseId)
        this.$message.success('删除成功')
      }).catch(res => {
        this.$message.error('删除失败')
      })
    },

    //根据章节Id查询，回显章节信息
    updateChapterById(chapterId) {
      this.dialogFormVisible = true
      chapterApi.getById(chapterId).then(res => {
        this.chapter = res.data.chapter
      })
        .catch(err => {
          this.$message.error('加载信息失败')
        })
    },

    //新增章节弹窗
    popForm() {
      this.chapter.id = ''
      this.chapter.title = ''
      this.chapter.sort = ''
      this.dialogFormVisible = true
    },

    //新增或修改
    saveOrUpdateChapter() {
      this.chapter.courseId = this.courseId
      if (!this.chapter.id) {
        chapterApi.add(this.chapter).then(res => {
          this.$message.success('添加成功')
          this.getChapterVideoInfo(this.courseId)
        }).catch(err => {
          this.$message.error('添加失败')
        })
      } else {
        chapterApi.update(this.chapter).then(res => {
          this.$message.success('修改成功')
          this.getChapterVideoInfo(this.courseId)
        }).catch(err => {
          this.$message.error('修改失败')
        })
      }
      this.dialogFormVisible = false
    },

    //根据课程id获取章节列表
    getChapterVideoInfo(courseId) {
      chapterApi.getChapterVideo(courseId)
        .then(res => {
          this.chapterVideos = res.data.items
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '章节信息获取失败'
          })
        })
    },

    //上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    //下一步
    nextStep() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }

}
</script>

<style scoped>

</style>

