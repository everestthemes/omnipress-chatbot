import apiFetch from '@wordpress/api-fetch';

export const chatApi = {
	chat: async (body: { question: string; sessionId?: string; messages: { role: string; content: string }[] }): Promise<any> => {
		try {
			const res = await apiFetch({
				method: 'POST',
				path: '/omnipress-ai-chatbot/v1/chat',
				body: JSON.stringify(body),
			});

			return res;
		} catch (error: any) {
			// apiFetch wraps REST errors: { code, message, data: { status } }
			const statusCode = error?.data?.status || error?.status || 500;
			const message =
				error?.data?.error ||
				error?.data?.message ||
				error?.message ||
				'Failed to connect to the chatbot. Please try again.';

			console.error('[ChatAPI]', statusCode, message, error);
			throw { message, statusCode, raw: error };
		}
	},
	saveLead: async (body: { name: string; email: string; phone: string; session_id: string }): Promise<any> => {
		try {
			return await apiFetch({
				method: 'POST',
				path: '/omnipress-ai-chatbot/v1/chat/lead',
				body: JSON.stringify(body),
			});
		} catch (error: any) {
			console.error('[ChatAPI SaveLead]', error);
			throw error;
		}
	},
	getHistory: async (sessionId: string): Promise<any> => {
		try {
			return await apiFetch({
				method: 'GET',
				path: `/omnipress-ai-chatbot/v1/chat/history?sessionId=${sessionId}`,
			});
		} catch (error: any) {
			console.error('[ChatAPI GetHistory]', error);
			throw error;
		}
	},
	deleteHistory: async (sessionId: string): Promise<any> => {
		try {
			return await apiFetch({
				method: 'DELETE',
				path: `/omnipress-ai-chatbot/v1/chat/history?sessionId=${sessionId}`,
			});
		} catch (error: any) {
			console.error('[ChatAPI DeleteHistory]', error);
			throw error;
		}
	},
};
