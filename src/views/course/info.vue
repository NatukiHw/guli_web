<template>
	<div class="app-container">
		<h2 style="text-align: center;">发布新课程</h2>
		<el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
			<el-step title="填写课程基本信息" />
			<el-step title="创建课程大纲" />
			<el-step title="最终发布" />
		</el-steps>
		<el-form label-width="120px">
			<el-form label-width="120px">
				<el-form-item label="课程标题">
					<el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
				</el-form-item>
				<el-form-item label="课程分类">
					<el-cascader v-model="selectedSubject"
						:props="{value: 'id', label: 'title', expandTrigger: 'hover'}" :options="subjectList">
					</el-cascader>
				</el-form-item>
				<el-form-item label="课程讲师">
					<el-select v-model="courseInfo.teacherId" filterable placeholder="请选择讲师">
						<el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="总课时">
					<el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right"
						placeholder="请填写课程的总课时数" />
				</el-form-item>
				<el-form-item label="课程简介">
					<mavon-editor v-model="courseInfo.description"/>
					<!-- <el-input type="textarea" :rows="3" placeholder="请输入课程简介" v-model="courseInfo.description"> -->
					</el-input>
				</el-form-item>
				<el-form-item label="课程封面">
					<el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload" :action="`${BASE_API}/eduoss/course/cover/upload`"
						class="avatar-uploader">
						<img :src="courseInfo.cover">
					</el-upload>
				</el-form-item>
				<el-form-item label="课程价格">
					<el-input-number :min="0" v-model="courseInfo.price" controls-position="right"
						placeholder="免费课程请设置为0元" /> 元
				</el-form-item>
				<el-form-item>
					<el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
				</el-form-item>
			</el-form>
		</el-form>
	</div>
</template>
<script>
	import courseApi from "@/api/course";
	import subjectApi from "@/api/subject";
	import teacherApi from "@/api/teacher";

	export default {
		data() {
			return {
				BASE_API: process.env.VUE_APP_BASE_API,
				saveBtnDisabled: false,
				courseInfo: {
					title: "",
					subjectId: "",
					subjectParentId: "",
					teacherId: "",
					lessonNum: 0,
					description: "",
					cover: "/static/course_default_cover.jpg",
					price: 0,
				},
				courseId: null,
				teacherList: [],
				subjectList: [],
				selectedSubject: null,
			};
		},
		created() {
			if (this.$route.params && this.$route.params.id) {
				this.courseId = this.$route.params.id;
				this.loadCourseInfo();
			}
			this.loadSubjectList();
			this.loadTeacherList();
		},
		methods: {
			loadCourseInfo() {
				courseApi.getOne(this.courseId).then(resp => {
					if(resp.success && resp.data.course) {
						this.courseInfo = resp.data.course;
						this.selectedSubject = [resp.data.course.subjectParentId, resp.data.course.subjectId];
					}
				})
			},
			loadSubjectList() {
				subjectApi.getList().then((resp) => {
					if (resp.success && resp.data.subjects) {
						let subjectList = new Array();
						for (let i in resp.data.subjects) {
							if (resp.data.subjects[i].parentId == "0") {
								resp.data.subjects[i].children = new Array();
								subjectList.push(resp.data.subjects[i]);
							}
						}
						for (let i in resp.data.subjects) {
							if (resp.data.subjects[i].parentId != "0") {
								for (let j in resp.data.subjects) {
									if (
										resp.data.subjects[i].parentId ==
										resp.data.subjects[j].id
									) {
										resp.data.subjects[j].children.push(
											resp.data.subjects[i]
										);
									}
								}
							}
						}
						this.subjectList = subjectList;
					}
				});
			},
			loadTeacherList() {
				teacherApi.getAll().then((resp) => {
					if (resp.success && resp.data.items) {
						this.teacherList = resp.data.items;
					}
				});
			},
			handleAvatarSuccess(res, file) {
				this.courseInfo.cover = res.data.url;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === "image/jpeg";
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error("上传头像图片只能是 JPG 格式");
				}
				if (!isLt2M) {
					this.$message.error("上传头像图片大小不能超过 2MB");
				}
				return isJPG && isLt2M;
			},
			next() {
				let api = courseApi.add;
				if(this.courseId) {
					api = courseApi.update;
					this.courseInfo.id = this.courseId;
				}
				api(this.courseInfo).then((resp) => {
					if (resp.success) {
						this.$message({
							type: "success",
							message: "保存课程信息成功",
						});
						this.$router.push(`/course/chapter/${resp.data.courseId?resp.data.courseId:this.courseId}`);
					}
				});
			},
		},
		watch: {
			selectedSubject() {
				if (this.selectedSubject && this.selectedSubject.length >= 2) {
					this.courseInfo.subjectId = this.selectedSubject[1];
					this.courseInfo.subjectParentId = this.selectedSubject[0];
				}
			},
		},
	};
</script>