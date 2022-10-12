import request from '@/utils/request'

export default {
	getListByCourseId(courseId) {
		return request({
			url: `/eduservice/courses/${courseId}/chapters`,
			method: 'get'
		})
	}
}