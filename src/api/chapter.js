import request from '@/utils/request'

export default {
	getListByCourseId(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}/chapters`,
			method: 'get'
		})
	},
	getOne(chapterId) {
		return request({
			url: `/eduservice/chapters/${chapterId}`,
			method: 'get'
		})
	},
	add(chapter) {
		return request({
			url: `/eduservice/chapters/`,
			method: 'post',
			data: chapter
		})
	},
	update(chapter) {
		return request({
			url: `/eduservice/chapters/`,
			method: 'put',
			data: chapter
		})
	},
	remove(chapterId) {
		return request({
			url: `/eduservice/chapters/${chapterId}`,
			method: 'delete'
		})
	}
}