<template>
	<div>
		<!--查询表单-->
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="teacherQuery.name" placeholder="讲师名" />
			</el-form-item>
			<el-form-item>
				<el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
					<el-option :value="1" label="高级讲师" />
					<el-option :value="2" label="首席讲师" />
				</el-select>
			</el-form-item>
			<el-form-item label="添加时间">
				<el-date-picker v-model="teacherQuery.begin" type="datetime" placeholder="选择开始时间"
					value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
			</el-form-item>
			<el-form-item>
				<el-date-picker v-model="teacherQuery.end" type="datetime" placeholder="选择截止时间"
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
			<el-table-column prop="name" label="名称" width="80" />
			<el-table-column label="头衔" width="80">
				<template slot-scope="scope">
					{{ scope.row.level===1?'高级讲师':'首席讲师' }}
				</template>
			</el-table-column>
			<el-table-column prop="intro" label="教师简介" />
			<el-table-column prop="career" label="教师资历" width="280" />
			<el-table-column prop="gmtCreate" label="添加时间" width="160" />
			<el-table-column prop="sort" label="排序" width="60" />
			<el-table-column label="操作" width="200" align="center">
				<template slot-scope="scope">
					<router-link :to="'/teacher/edit/'+scope.row.id">
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
	import teacherApi from "@/api/teacher";

	export default {
		data() {
			return {
				isListLoading: true,
				listData: null,
				total: 0,
				page: 1,
				limit: 10,
				teacherQuery: {},
			};
		},
		mounted() {
			this.loadList();
		},
		methods: {
			loadList(page = 1) {
				this.page = page;
				this.isListLoading = true;
				let self = this;
				teacherApi
					.getList(self.page, self.limit, self.teacherQuery)
					.then((res) => {
						if (res && res.success) {
							self.listData = res.data.rows;
							self.total = res.data.total;
						}
						self.isListLoading = false;
					});
			},
			resetQuery() {
				this.teacherQuery = {};
				this.loadList();
			},
			removeItem(item) {
				this.$confirm(`确定删除讲师[${item.name}]吗？`, "删除提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						teacherApi.remove(item.id).then((res) => {
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
