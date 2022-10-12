import request from '@/utils/request'

export default {
	getList(page, limit, data) {
		let url = '/eduservice/teachers/view?'
		if (page) {
			url += `page=${page}`
		}
		if (limit) {
			url += `&limit=${limit}`
		}
		return request({
			url: url,
			method: 'post',
			data: data
		})
	},
	remove(id) {
		return request({
			url: `/eduservice/teachers/${id}`,
			method: 'delete',
		})
	},
	add(teacher) {
		return request({
			url: '/eduservice/teachers/',
			method: 'post',
			data: teacher
		})
	},
	getOne(id) {
		return request({
			url: `/eduservice/teachers/${id}`,
			method: 'get',
		})
	},
	update(teacher) {
		return request({
			url: `/eduservice/teachers/`,
			method: 'put',
			data: teacher
		})
	},
	getAll() {
		return request({
			url: '/eduservice/teachers/',
			method: 'get'
		})
	}
}