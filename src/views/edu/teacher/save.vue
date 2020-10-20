<template>
<div class="app-container">
    <el-form label-position="left" label-width="120px" :model="teacher">
        <el-form-item label="名称">
            <el-input v-model="teacher.name"></el-input>
        </el-form-item>
        <el-form-item label="头衔">
            <el-select v-model="teacher.level" placeholder="选择" clearable>
                <el-option label="高级讲师" :value="1"></el-option>
                <el-option label="首席讲师" :value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="排序">
            <el-input-number v-model="teacher.sort" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="资历">
            <el-input v-model="teacher.career"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
            <el-input v-model="teacher.intro" type="textarea" :rows="10"></el-input>
        </el-form-item>
        <!-- 头像 -->
        <el-form-item label="头像">
            <PanThumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
           <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">更换头像</el-button>
           <ImageCropper
            v-show="imageCropperShow"
            :width="300"
            :height="300"
            :key="imageCropperKey"
            :url="BASE_API+'/eduoss/upload'"
            field="file"
            @close="close"
            @crop-upload-success="cropSuccess"
           />
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';

export default {
    components:{ImageCropper,PanThumb},
    data() {
        return {
            BASE_API: process.env.VUE_APP_BASE_API,
            imageCropperShow: false,
            imageCropperKey: 0,
            saveBtnDisabled: false,
            teacher: {
                id: '',
                name: '',
                intro: '',
                career: '',
                level: '',
                sort: '',
                avatar: 'https://online-edu-adela.oss-cn-chengdu.aliyuncs.com/2020/10/10/8f0a599c01554e6baa00b442e0805f22581a77813c674cd0849b6f7aeb7c9118!400x400.jpeg'
            }
        }
    },
  //页面渲染之前执行
    created() {
        //判断路径是否有id
        if (this.$route.params && this.$route.params.id) {
            //从路径获取id值
            const id = this.$route.params.id
            //调用根据id查询的方法
            this.getInfo(id)
        }
    },
    methods: {
        saveOrUpdate() {
            if (this.teacher.id) {
                teacherApi.updateTeacher(this.teacher)
                    .then(res => {
                        this.$router.push({
                            path: "/teacher/list"
                        });
                        this.saveBtnDisabled = true;
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({
                            type: 'error',
                            message: '修改失败!'
                        })
                    })
            } else {
                teacherApi.addTeacher(this.teacher)
                    .then(res => {
                        this.$router.push({
                            path: "/teacher/list"
                        });
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({
                            type: 'error',
                            message: '添加失败!'
                        })
                    })
            }
        },
        getInfo(id) {
            teacherApi.getTeacherInfo(id)
                .then(res => {
                    this.teacher = res.data.teacher
                })
                .catch(err => {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败!'
                    })
                })
        },
        close(){
            this.imageCropperShow=false;
            this.imageCropperKey++;
        },
        cropSuccess(data){
            this.imageCropperShow=false;
            this.teacher.avatar=data.url;
            this.imageCropperKey++;
        }

    }
}
</script>

<style>

</style>
