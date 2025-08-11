import apiFetch from '@wordpress/api-fetch';
import { toast } from 'sonner';
export const settingsApi = {
	get: async () => {
		try {
			const res = await apiFetch( {
				method: 'GET',
				path: '/omnipress-ai-chatbot/v1/settings',
			} );
			return res;
		} catch ( error ) {}
	},

	update: async ( body: any ) => {
		try {
			const res = await apiFetch( {
				method: 'POST',
				path: '/omnipress-ai-chatbot/v1/settings',
				body: JSON.stringify( body ),
			} );
			toast.success( 'Settings updated successfully' );
			return res;
		} catch ( error ) {
			toast.error( 'Failed to update settings' );
		}
	},
};
