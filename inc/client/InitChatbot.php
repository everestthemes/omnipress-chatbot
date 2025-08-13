<?php
namespace Omnipress\AIChatbot\Client;

use Omnipress\AIChatbot\Abstracts\AbstractController;
use Omnipress\AIChatbot\Api\ChatApi;
use Omnipress\AIChatbot\Controllers\ChatController;
use Omnipress\AIChatbot\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * InitChatbot class.
 *
 * @author omnipressteam
 *
 * @copyright (c) 2025
 *
 * @since 0.1.0
 */
final class InitChatbot {
	/**
	 * Core class.
	 *
	 * @var Core $core
	 */
	protected Core $core;

	/**
	 * Construct function.
	 *
	 * @param Core $core Core class.
	 */
	public function __construct( Core $core ) {
		$this->core = $core;

		if ( ! $this->can_render() ) {
			return;
		}

		$this->core->loader->add_action( 'wp_footer', $this, 'render' );
		$this->core->loader->add_action( 'wp_enqueue_scripts', $this, 'load_assets' );
	}

	/**
	 * Load chatbot assets.
	 *
	 * @return void
	 */
	public function load_assets() {
		$assets = require_once OMNIPRESS_AI_CHATBOT_DIR . 'build/js/chatbot.asset.php';
		wp_enqueue_script( 'omnipress-ai-chatbot', OMNIPRESS_AI_CHATBOT_URL . '/build/js/chatbot.js', $assets['dependencies'], $assets['version'], true );
	}
	/**
	 * Check if chatbot can be rendered.
	 *
	 * @return bool
	 */
	public function can_render(): bool {
		$admin_settings = $this->core->admin_settings_controller->get_items();

		//phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		return isset( $admin_settings->isEnableChatBot ) && $admin_settings->isEnableChatBot;
	}

	/**
	 * Render chatbot in footer.
	 *
	 * @return void
	 */
	public function render() {

		$css_variables = '';

		$admin_settings = $this->core->admin_settings_controller->get_items();

		if ( ! isset( $admin_settings ) || ! is_object( $admin_settings ) ) {
			return;
		}

		if ( is_object( $admin_settings->customizations ) && isset( $admin_settings->customizations->backgroundColor ) ) {
			$css_variables = '--bg-color: ' . $admin_settings->customizations->backgroundColor . ';';
		}

		if ( is_object( $admin_settings->customizations ) && isset( $admin_settings->customizations->textColor ) ) {
			$css_variables .= '--text-color: ' . $admin_settings->customizations->textColor . ';';
		}

		if ( is_object( $admin_settings->customizations ) && isset( $admin_settings->customizations->linkColor ) ) {
			$css_variables .= '--link-color: ' . $admin_settings->customizations->linkColor . ';';
		}
		?>
		<div style="<?php echo esc_attr( $css_variables ); ?>" id="omnipress-ai-chatbot">omnipress ai chat bot</div>
		<?php
	}
}
