<template>
<div class="app-container">
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="teacherQuery.name" placeholder="讲师名称" clearable/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="teacherQuery.level" placeholder="讲师头衔" clearable>
                <el-option label="高级讲师" value="1"></el-option>
                <el-option label="首席讲师" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
            <el-date-picker v-model="teacherQuery.begin" type="datetime" place-holder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            <el-date-picker v-model="teacherQuery.end" type="datetime" place-holder="选择截止时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
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
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="level" label="头衔" width="180">
            <template slot-scope="scope">
                {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
            </template>
        </el-table-column>
        <el-table-column prop="intro" label="资历" width="450" />
        <el-table-column prop="gmtCreate" label="添加时间" width="160" />
        <el-table-column prop="sort" label="排序" width="70" />
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <router-link :to="'/teacher/edit/' + scope.row.id">
                    <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :total="total" :current-page="pageIndex" :page-size="pageSize" style="padding:30px 0;text-align: center" @current-change="getList" layout="total, prev, pager, next, jumper" />
</div>
</template>

<script>
import teacher from "@/api/edu/teacher";
export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            pageSize: 10,
            total: null,
            teacherQuery: {
                name: '',
                level: '',
                begin: '',
                end: ''
            },

        };
    },

    created() {
        this.getList();
    },

    methods: {
        getList(pageIndex = 1) {
            this.pageIndex = pageIndex;
            teacher
                .getTeacherPage(this.pageIndex, this.pageSize, this.teacherQuery)
                .then((res) => {
                    this.list = res.data.items;
                    this.total = res.data.total;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        removeById(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                teacher.deleteById(id)
                .then(res=>{
                    this.getList()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(err=>{
                    this.$message({
                        type: 'info',
                        message: '删除失败!'
                    })
                })
            })

        }
    },
};
</script>

<style>
</style>
