import request from '@/utils/request'

export default {
	add(courseVo) {
		return request({
			url: '/eduservice/courses/',
			method: 'post',
			data: courseVo
		})
	},
	getOne(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}`,
			method: 'get',
		})
	},
	update(courseVo) {
		return request({
			url: '/eduservice/courses/',
			method: 'put',
			data: courseVo
		})
	},
	getCoursePublishVo(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}/publisher`,
			method: 'get'
		})
	},
	publish(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}/publisher`,
			method: 'post'
		})
	},
	getList(page, limit, data) {
		let url = '/eduservice/courses/view?'
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
	remove(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}`,
			method: 'delete'
		})
	}
}