import request from '@/utils/request'

export default {
	getOne(videoId) {
		return request({
			url: `/eduservice/videos/${videoId}`,
			method: 'get'
		})
	},
	add(video) {
		return request({
			url: '/eduservice/videos/',
			method: 'post',
			data: video
		})
	},
	update(video) {
		return request({
			url: '/eduservice/videos/',
			method: 'put',
			data: video
		})
	},
	remove(videoId) {
		return request({
			url: `/eduservice/videos/${videoId}`,
			method: 'delete'
		})
	}
}