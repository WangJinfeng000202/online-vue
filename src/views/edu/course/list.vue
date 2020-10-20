<template>
  <div class="app-container">
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input type="text" v-model="courseQuery.title"></el-input>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseQuery.teacherId" placeholder="请选择" clearable filterable>
          <el-option
            v-for="teacher in  teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程分类">
        <el-select v-model="courseQuery.subjectParentId" @change="subjectChange" placeholder="一级分类">
          <el-option
            v-for="subject in  subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in  subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table element-loading-text="数据加载中" :data="list" highlight-current-row border fit>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageIndex - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程" width="120"/>
      <el-table-column prop="status" label="状态" width="450">
        <template slot-scope="scope">
          {{scope.row.status==='Normal'?'已发布':'未发布'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCourseById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total" :current-page="pageIndex" :page-size="pageSize"
                   style="padding:30px 0;text-align: center" @current-change="getList"
                   layout="total, prev, pager, next, jumper"/>
  </div>
</template>

<script>
import courseApi from '@/api/edu/course'
import subjectApi from '@/api/edu/subject'

export default {
  name: 'list',
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      total: null,
      courseQuery: {
        title: '',
        teacherId: '',
        subjectParentId:'',
        subjectId:''
      },
      teacherList: [],
      subjectOneList:[],
      subjectTwoList:[]
    }
  },
  created() {
    this.getAllTeacher()
    this.getAllSubject()
    this.getList()
  },
  methods: {
    //获取分页查询课程信息
    getList() {
      courseApi.getCourseListPage(this.pageIndex,this.pageSize,this.courseQuery)
      .then(res=>{
        this.list = res.data.items
      })
      .catch(err=>{
        this.$message.error("加载数据失败")
      })
    },
    //根据id删除课程信息
    removeCourseById(id) {

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
  }

}
</script>

<style scoped>

</style>
