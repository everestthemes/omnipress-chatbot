import apiFetch from '@wordpress/api-fetch';
import { toast } from 'sonner';

export const chatApi = {
	chat: async ( body: any ) => {
		try {
			const res = await apiFetch( {
				method: 'POST',
				path: '/omnipress-ai-chatbot/v1/chat',
				body: JSON.stringify( body ),
			} );
			toast.success( 'Chat sent successfully' );

			return res;
		} catch ( error ) {
			toast.error( 'Failed to send chat' );
		}
	},
};
