import request from '@/utils/request'

export default {
	remove(videoId) {
		return request({
			url: `/eduvod/videos/${videoId}`,
			method: 'delete'
		})
	}
}