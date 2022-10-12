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
			url: `/eduservice/courses/`,
			method: 'put',
			data: courseVo
		})
	}
}