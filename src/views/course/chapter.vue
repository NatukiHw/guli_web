<template>
	<div class="app-container">
		<h2 style="text-align: center;">发布新课程</h2>
		<el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
			<el-step title="填写课程基本信息" />
			<el-step title="创建课程大纲" />
			<el-step title="最终发布" />
		</el-steps>
		<el-button type="primary" @click="openChapterEditDialog()">添加章节</el-button>
		<!-- 章节 -->
		<ul class="chanpterList">
			<li v-for="chapter in chapterNestedList" :key="chapter.id">
				<p>
					{{ chapter.title }}
					<span class="acts">
						<el-button type="text" @click="openVideoEditDialog(chapter.id)">添加课时</el-button>
						<el-button type="text" @click="openChapterEditDialog(chapter.id)">编辑</el-button>
						<el-button type="text" @click="deleteChapter(chapter)">删除</el-button>
					</span>
				</p>
				<!-- 视频 -->
				<ul class="chanpterList videoList">
					<li v-for="video in chapter.children" :key="video.id">
						<p>{{ video.title }}
							<span class="acts">
								<el-button type="text" @click="openVideoEditDialog(chapter.id, video.id)">编辑</el-button>
								<el-button type="text" @click="deleteVideo(video)">删除</el-button>
							</span>
						</p>
					</li>
				</ul>
			</li>
		</ul>
		<div>
			<el-button @click="previous">上一步</el-button>
			<el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
		</div>
		<!-- 添加和修改章节表单 -->
		<el-dialog :visible.sync="isChapterEditDialogVisible" title="添加章节">
			<el-form :model="chapter" label-width="120px">
				<el-form-item label="章节标题">
					<el-input v-model="chapter.title" />
				</el-form-item>
				<el-form-item label="章节排序">
					<el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeChapterEditDialog">取消</el-button>
				<el-button type="primary" @click="saveChapter">确定</el-button>
			</div>
		</el-dialog>
		<!-- 添加和修改课时表单 -->
		<el-dialog :visible.sync="isVideoEditDialogVisible" title="添加课时">
			<el-form :model="video" label-width="120px">
				<el-form-item label="课时标题">
					<el-input v-model="video.title" />
				</el-form-item>
				<el-form-item label="课时排序">
					<el-input-number v-model="video.sort" :min="0" controls-position="right" />
				</el-form-item>
				<el-form-item label="是否免费">
					<el-radio-group v-model="video.isFree">
						<el-radio :label="1">免费</el-radio>
						<el-radio :label="0">默认</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="上传视频">
					<!-- TODO -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeVideoEditDialog">取消</el-button>
				<el-button type="primary" @click="saveVideo">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import chapterApi from "@/api/chapter";
	import videoApi from "@/api/video";

	export default {
		data() {
			return {
				saveBtnDisabled: false,
				courseId: null,
				chapterNestedList: [],
				isChapterEditDialogVisible: false,
				chapter: {},
				isVideoEditDialogVisible: false,
				video: {},
			};
		},
		created() {
			if (this.$route.params && this.$route.params.id) {
				this.courseId = this.$route.params.id;
				this.loadChapterList();
			}
		},
		methods: {
			openChapterEditDialog(chapterId) {
				this.clearChapterEditDialog();
				this.isChapterEditDialogVisible = true;
				if (chapterId) {
					this.chapter.id = chapterId;
					this.loadChapter();
				}
				this.chapter.courseId = this.courseId;
			},
			openVideoEditDialog(chaperId, videoId) {
				this.clearVideoEditDialog();
				this.isVideoEditDialogVisible = true;
				if (videoId) {
					this.video.id = videoId;
					this.loadVideo();
				}
				this.video.courseId = this.courseId;
				this.video.chapterId = chaperId;
			},
			closeChapterEditDialog() {
				this.isChapterEditDialogVisible = false;
			},
			closeVideoEditDialog() {
				this.isVideoEditDialogVisible = false;
			},
			clearChapterEditDialog() {
				this.chapter = {
					id: null,
					title: "",
					sort: 0,
				};
			},
			clearVideoEditDialog() {
				this.video = {
					title: '',
					sort: 0,
					isFree: 1,
					videoSourceId: ''
				};
			},
			saveChapter() {
				let api = chapterApi.add;
				if (this.chapter.id) {
					api = chapterApi.update;
				}
				api(this.chapter).then((resp) => {
					if (resp.success) {
						this.$message({
							type: "success",
							message: "保存章节信息成功",
						});
						this.closeChapterEditDialog();
						this.loadChapterList();
					}
				});
			},
			saveVideo() {
				let api = videoApi.add;
				if (this.video.id) {
					api = videoApi.update;
				}
				api(this.video).then((resp) => {
					if (resp.success) {
						this.$message({
							type: "success",
							message: "保存小节信息成功",
						});
						this.closeVideoEditDialog();
						this.loadChapterList();
					}
				});
			},
			deleteChapter(chapter) {
				this.$confirm(`确定删除章节[${chapter.title}]吗？`, "删除提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						chapterApi.remove(chapter.id).then((resp) => {
							if (resp.success) {
								this.$message({
									type: "success",
									message: "删除章节信息成功",
								});
								this.loadChapterList();
							} else {
								this.$message({
									type: "error",
									message: resp.message,
								});
							}
						});
					})
					.catch((res) => {
						if (res === "cancel") {
							this.$message({
								type: "info",
								message: "已取消删除",
							});
						} else {
							this.$message({
								type: "error",
								message: "删除失败",
							});
						}
					});
			},
			deleteVideo(video) {
				this.$confirm(`确定删除小节[${video.title}]吗？`, "删除提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						videoApi.remove(video.id).then((resp) => {
							if (resp.success) {
								this.$message({
									type: "success",
									message: "删除小节信息成功",
								});
								this.loadChapterList();
							} else {
								this.$message({
									type: "error",
									message: resp.message,
								});
							}
						});
					})
					.catch((res) => {
						if (res === "cancel") {
							this.$message({
								type: "info",
								message: "已取消删除",
							});
						} else {
							this.$message({
								type: "error",
								message: "删除失败",
							});
						}
					});
			},
			loadChapterList() {
				chapterApi.getListByCourseId(this.courseId).then((resp) => {
					if (resp.success && resp.data.chapters) {
						this.chapterNestedList = resp.data.chapters;
					}
				});
			},
			loadChapter() {
				chapterApi.getOne(this.chapter.id).then((resp) => {
					if (resp.success && resp.data.chapter) {
						this.chapter = resp.data.chapter;
					}
				});
			},
			loadVideo() {
				videoApi.getOne(this.video.id).then((resp) => {
					if (resp.success && resp.data.video) {
						this.video = resp.data.video;
					}
				});
			},
			previous() {
				this.$router.replace(`/course/info/${this.courseId}`);
			},
			next() {
				this.$router.push(`/course/publish/${this.courseId}`);
			},
		},
	};
</script>

<style scoped>
	.chanpterList {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.chanpterList li {
		position: relative;
	}
	.chanpterList p {
		float: left;
		font-size: 20px;
		margin: 10px 0;
		padding: 10px;
		height: 70px;
		line-height: 50px;
		width: 100%;
		border: 1px solid #ddd;
	}
	.chanpterList .acts {
		float: right;
		font-size: 14px;
	}
	.videoList {
		padding-left: 50px;
	}
	.videoList p {
		float: left;
		font-size: 14px;
		margin: 10px 0;
		padding: 10px;
		height: 50px;
		line-height: 30px;
		width: 100%;
		border: 1px dotted #ddd;
	}
</style>