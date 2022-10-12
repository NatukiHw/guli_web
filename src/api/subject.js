import request from '@/utils/request'

export default {
	getList() {
		return request({
			url: '/eduservice/subjects/',
			method: 'get'
		})
	},
}