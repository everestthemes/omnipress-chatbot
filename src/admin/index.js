import { TooltipProvider } from '@radix-ui/react-tooltip';
import { createRoot } from '@wordpress/element';
import { DashboardPage } from './pages/dashboard/page';

console.log( 'enqueu' );

window.addEventListener( 'DOMContentLoaded', () => {
	const adminSettingContainer = document.getElementById(
		'omnipress-chatbot-settings'
	);
	if ( ! adminSettingContainer ) {
		return;
	}

	console.log( createRoot );

	const root = createRoot( adminSettingContainer );
	root.render(
		<TooltipProvider>
			<DashboardPage />
		</TooltipProvider>
	);
} );
