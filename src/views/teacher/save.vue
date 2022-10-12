<template>
	<div class="app-container">
		<el-form label-width="120px">
			<el-form-item label="讲师名称">
				<el-input v-model="teacher.name" />
			</el-form-item>
			<el-form-item label="讲师排序">
				<el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
			</el-form-item>
			<el-form-item label="讲师头衔">
				<el-select v-model="teacher.level" clearable placeholder="请选择">
					<el-option :value="1" label="高级讲师" />
					<el-option :value="2" label="首席讲师" />
				</el-select>
			</el-form-item>
			<el-form-item label="讲师资历">
				<el-input v-model="teacher.career" />
			</el-form-item>
			<el-form-item label="讲师简介">
				<el-input v-model="teacher.intro" :rows="10" type="textarea" />
			</el-form-item>
			<!-- 讲师头像 -->
			<el-form-item label="讲师头像">
				<pan-thumb :image="teacher.avatar" />
				<el-button type="primary" icon="el-icon-upload" @click="imageCropperShow = true">更换头像
				</el-button>
				<image-cropper v-show="imageCropperShow" :width="200" :height="200" :key="imageCropperKey"
					url="/eduoss/avatar/upload" field="file" @close="closeImageCropper"
					@crop-upload-success="cropSuccess" />
			</el-form-item>
			<el-form-item>
				<el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import teacherApi from "@/api/teacher";
	import ImageCropper from "@/components/ImageCropper";
	import PanThumb from "@/components/PanThumb";

	export default {
		components: { ImageCropper, PanThumb },
		data() {
			return {
				teacher: {
					name: "",
					sort: 0,
					level: 1,
					career: "",
					intro: "",
					avatar: "",
				},
				imageCropperShow: false,
				imageCropperKey: 0,
				saveBtnDisabled: false,
			};
		},
		created() {
			if (this.$route.params && this.$route.params.id) {
				let id = this.$route.params.id;
				this.loadTeacherData(id);
			}
		},
		methods: {
			saveOrUpdate() {
				this.saveBtnDisabled = true;
				if (this.$route.params && this.$route.params.id) {
					this.updateData();
				} else {
					this.addData();
				}
			},
			addData() {
				teacherApi
					.add(this.teacher)
					.then((res) => {
						if (res && res.success) {
							this.$message({
								type: "success",
								message: "添加成功",
							});
							this.$router.push("/teacher/list");
						} else {
							this.saveBtnDisabled = false;
						}
					})
					.catch((err) => {
						this.saveBtnDisabled = false;
					});
			},
			updateData() {
				teacherApi
					.update(this.teacher)
					.then((res) => {
						if (res && res.success) {
							this.$message({
								type: "success",
								message: "修改成功",
							});
							this.$router.push("/teacher/list");
						} else {
							this.saveBtnDisabled = false;
						}
					})
					.catch((err) => {
						this.saveBtnDisabled = false;
					});
			},
			loadTeacherData(id) {
				teacherApi.getOne(id).then((res) => {
					if (res && res.data && res.data.teacher) {
						this.teacher = res.data.teacher;
					}
				});
			},
			closeImageCropper() {
				this.imageCropperShow = false;
			},
			cropSuccess(data) {
				this.teacher.avatar = data.url;
			},
		},
	};
</script>