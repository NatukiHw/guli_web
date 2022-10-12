<template>
	<div class="app-container">
		<el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
		<el-tree ref="subjectTree" :data="subjectList" :props="defaultProps" :filter-node-method="filterNode"
			class="filter-tree" default-expand-all />
	</div>
</template>

<script>
	import subjectApi from "@/api/subject";

	export default {
		data() {
			return {
				filterText: "",
				subjectList: [],
				defaultProps: {
					children: "children",
					label: "title",
				},
			};
		},
		watch: {
			filterText(val) {
				this.$refs.subjectTree.filter(val);
			},
		},
		created() {
			this.fetchNodeList();
		},
		methods: {
			fetchNodeList() {
				subjectApi.getList().then((res) => {
					if (res.success === true) {
						let subjectList = new Array();
						for (let i in res.data.subjects) {
							if (res.data.subjects[i].parentId == "0") {
								res.data.subjects[i].children = new Array();
								subjectList.push(res.data.subjects[i]);
							}
						}
						for (let i in res.data.subjects) {
							if (res.data.subjects[i].parentId != "0") {
								for (let j in res.data.subjects) {
									if (
										res.data.subjects[i].parentId ==
										res.data.subjects[j].id
									) {
										res.data.subjects[j].children.push(
											res.data.subjects[i]
										);
									}
								}
							}
						}
						this.subjectList = subjectList;
					}
				});
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			},
		},
	};
</script>

<style>
</style>