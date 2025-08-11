<?php

namespace Omnipress\AIChatbot\Admin;

use Omnipress\AIChatbot\Core;
use Omnipress\AIChatbot\Loader;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

error_log( 'admin settings' );

/**
 * Admin class
 *
 * @author omnipressteam
 *
 * @copyright (c) 2025
 *
 * @since 0.1.0
 */
class Admin {
	/**
	 * Loader instance
	 *
	 * @var Loader
	 */
	private Loader $loader;

	/**
	 * Construct function
	 */
	public function __construct( Loader $loader ) {
		$this->loader = $loader;
		if ( is_admin() ) {
			$this->register_actions();
		}
	}

	/**
	 * Register all the admin area related actions.
	 *
	 * @return void
	 */
	public function register_actions(): void {
		$this->loader->add_action( 'admin_menu', $this, 'register_settings_menu' );
	}

	/**
	 * todo: add api key settings (First phase).
	 * todo: custumize theme and position of the chat ui (top left , top right, bottom left, bottom right, type will be sidebar/ popup). primarycolor, bot avatar, custom css. (First phase).
	 * todo: Store chat in the database toggle options, export and clear chat history (less priority that will be inplement in the next phase)
	 * todo: Add Custom Instructions field for ai.
	 * todo: Role based access control (less priority that will be inplement in the next phase)
	 *
	 * todo: Page base access control (less priority that will be inplement in the next phase).
	 */


	/**
	 * Added  settings options with setting page ui.
	 *
	 * @return void
	 */
	public function add_settings_page(): void {

		register_setting(
			'omnipress_ai_chatbot_settings',
			'omnipress_ai_chatbot_settings',
			array( $this, 'validate_settings' )
		);

		add_settings_section(
			'omnipress-chat-bot-settings',
			'OmniPress AI Chatbot Settings',
			array( $this, 'render_settings_section' ),
			'omnipress-ai-chatbot'
		);

		add_settings_field(
			'omnipress_ai_chatbot_api_key',
			'API Key',
			array( $this, 'render_api_key_field' ),
			'omnipress-ai-chatbot',
			'omnipress-chat-bot-settings'
		);
	}

	public function render_settings_section(): void {
		echo '<p>OmniPress AI Chatbot Settings</p>';
	}

	public function render_api_key_field(): void {
		echo '<input type="text" name="omnipress_ai_chatbot_api_key" value="' . esc_attr( get_option( 'omnipress_ai_chatbot_api_key' ) ) . '" />';
	}

	/**
	 *
	 * Calidate data if required.
	 *
	 * @param mixed $input Input data.
	 *
	 * @return mixed
	 */
	public function validate_settings( $input ) {
		error_log( 'settings input ==> ' . print_r( $input, true ) );
		return $input;
	}

	/**
	 * Register settings menu
	 */
	public function register_settings_menu(): void {
		add_management_page(
			'OmniPress AI Chatbot',
			'OmniPress AI Chatbot',
			'manage_options',
			'omnipress-ai-chatbot',
			array( $this, 'render_settings' )
		);
	}

	public function render_settings(): void {
		?>
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<?php
	}
}
