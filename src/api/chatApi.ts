import apiFetch from '@wordpress/api-fetch';
import { toast } from 'sonner';

export const chatApi = {
	chat: async (body: any) => {
		try {
			const res = await apiFetch({
				method: 'POST',
				path: '/omnipress-ai-chatbot/v1/chat',
				body: JSON.stringify(body),
			});


			console.log(res, 'response');
			toast.success('Chat sent successfully');

			return res;
		} catch (error) {
			console.log(error, 'error');
			toast.error(error?.data?.message || 'Failed to send chat');
		}
	},
};
