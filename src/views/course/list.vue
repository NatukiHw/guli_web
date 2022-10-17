<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="courseQuery.title" placeholder="课程名称" />
			</el-form-item>
			<el-form-item>
				<el-select v-model="courseQuery.teacherId" clearable placeholder="讲师名称">
					<el-option :value="item.id" :label="item.name" v-for="item in teacherList" :key="item.id"/>
				</el-select>
			</el-form-item>
			<el-cascader v-model="selectedSubject"
						:props="{value: 'id', label: 'title', expandTrigger: 'hover'}" :options="subjectList">
					</el-cascader>
			<el-form-item>
				<el-date-picker v-model="courseQuery.begin" type="datetime" placeholder="选择开始时间"
					value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
			</el-form-item>
			<el-form-item>
				<el-date-picker v-model="courseQuery.end" type="datetime" placeholder="选择截止时间"
					value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
			</el-form-item>
			<el-button type="primary" icon="el-icon-search" @click="loadList()">查询</el-button>
			<el-button type="default" @click="resetQuery()">重置</el-button>
		</el-form>

		<el-table v-loading="isListLoading" :data="listData" element-loading-text="数据加载中" border fit
			highlight-current-row>
			<el-table-column label="序号" width="70" align="center">
				<template slot-scope="scope">
					{{ (page - 1) * limit + scope.$index + 1 }}
				</template>
			</el-table-column>
			<el-table-column prop="title" label="课程名称" />
			<el-table-column prop="lessonNum" label="课时" width="80" />
			<el-table-column prop="price" label="课程价格" width="120" />
			<el-table-column label="状态" width="80">
				<template slot-scope="scope">
					{{ scope.row.status==="Normal"?'已发布':'草稿' }}
				</template>
			</el-table-column>
			<el-table-column prop="gmtCreate" label="添加时间" width="160" />
			<el-table-column prop="buyCount" label="购买次数" width="100" />
			<el-table-column prop="viewCount" label="浏览量" width="100" />
			<el-table-column label="操作" width="200" align="center">
				<template slot-scope="scope">
					<router-link :to="'/course/info/'+scope.row.id">
						<el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
					</router-link>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="removeItem(scope.row)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-size="limit" :total="total"
			style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
			@current-change="loadList" />
	</div>
</template>

<script>
	import courseApi from "@/api/course";
	import subjectApi from "@/api/subject";
	import teacherApi from "@/api/teacher";

	export default {
		data() {
			return {
				isListLoading: true,
				listData: null,
				total: 0,
				page: 1,
				limit: 10,
				courseQuery: {},
				teacherList: [],
				subjectList: [],
				selectedSubjectList: []
			};
		},
		mounted() {
			this.loadTeacherList();
			this.loadSubjectList();
			this.loadList();
		},
		methods: {
			loadTeacherList() {
				teacherApi.getAll().then((resp) => {
					if (resp.success && resp.data.items) {
						this.teacherList = resp.data.items;
					}
				});
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
			loadList(page = 1) {
				this.page = page;
				this.isListLoading = true;
				let self = this;
				courseApi
					.getList(self.page, self.limit, self.courseQuery)
					.then((res) => {
						if (res && res.success) {
							self.listData = res.data.rows;
							self.total = res.data.total;
						}
						self.isListLoading = false;
					});
			},
			resetQuery() {
				this.courseQuery = {};
				this.loadList();
			},
			removeItem(item) {
				this.$confirm(`确定删除课程[${item.title}]吗？`, "删除提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						courseApi.remove(item.id).then((res) => {
							console.log(res);
							if (res && res.success) {
								this.loadList();
								this.$message({
									type: "success",
									message: "删除成功",
								});
							} else {
								this.$message({
									type: "error",
									message: "删除失败",
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
		},
	};
</script>

<style></style>
