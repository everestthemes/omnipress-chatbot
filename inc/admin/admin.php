<?php

namespace Omnipress\AIChatbot\Admin;

use Omnipress\AIChatbot\Loader;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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
			$this->loader->add_action( 'admin_enqueue_scripts', $this, 'enqueue_scripts' );
		}
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * @param string $hook The current admin page hook.
	 *
	 * @return void
	 */
	public function enqueue_scripts( string $hook ): void {
		if ( 'tools_page_omnipress-ai-chatbot' !== $hook ) {
			return;
		}

		$assets = require_once OMNIPRESS_AI_CHATBOT_DIR . 'build/js/index.asset.php';
		wp_enqueue_script( 'omnipress-ai-chatbot-admin', OMNIPRESS_AI_CHATBOT_URL . 'build/js/index.js', $assets['dependencies'], $assets['version'], true );
		wp_enqueue_style( 'omnipress-ai-chatbot-admin', OMNIPRESS_AI_CHATBOT_URL . 'build/css/global.css', array(), $assets['version'] );
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
	 *
	 * Calidate data if required.
	 *
	 * @param mixed $input Input data.
	 *
	 * @return mixed
	 */
	public function validate_settings( $input ) {
		return $input;
	}

	/**
	 * Register settings menu
	 */
	public function register_settings_menu(): void {
		add_management_page(
			'AI Chatbot',
			'AI Chatbot',
			'manage_options',
			'omnipress-ai-chatbot',
			array( $this, 'render_settings' )
		);
	}

	public function render_settings(): void {
		?>
		<div id="omnipress-chatbot-settings" class="fixed top-0 left-0 md:left-[160px] right-0 bottom-0 z-50 pt-11 bg-background px-4">

		</div>
		<?php
	}
}
