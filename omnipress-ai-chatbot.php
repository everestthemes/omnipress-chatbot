<?php

use Omnipress\AIChatbot\Core;

/**
 * Plugin Name: Omnipress AI Chatbot
 * Plugin URI: https://github.com/everestthemes/omnipress-ai-chatbot
 * Description: Omnipress AI Chatbot
 * Version: 0.1.0
 * Author: Everest Themes
 * Author URI: https://everestthemes.com
 * Text Domain: omnipress-ai-chatbot
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */
function omnipress_ai_chatbot_define_constants() {
	define( 'OMNIPRESS_AI_CHATBOT_VERSION', '0.1.0' );
	define( 'OMNIPRESS_AI_CHATBOT_DIR', plugin_dir_path( __FILE__ ) );
	define( 'OMNIPRESS_AI_CHATBOT_URL', plugin_dir_url( __FILE__ ) );
}

omnipress_ai_chatbot_define_constants();

require_once __DIR__ . '/includes/require.php';

$core = new Core();

/**
 * Create instance of the plugin.

 * @return void
 */
function omnipress_ai_chatbot_activate() {
	$default_settings = array(
		'apiKey'          => '',
		'isEnableChatBot' => false,
		'customizations'  => array(
			'backgroundColor' => '#4F46E5',
			'textColor'       => '#FFFFFF',
			'linkColor'       => '#FFFFFF',
			'iconPosition'    => 'bottom-right',
		),
		'client'          => array(
			'name'  => 'n1 technology',
			'email' => 'info@n1technology.com',
			'slug'  => 'n1technology',
		),
	);

	add_option( 'omnipress_ai_chatbot_settings', $default_settings );
}

/**
 * Deactivate the plugin.
 *
 * @return void
 */
function omnipress_ai_chatbot_deactivate() {
	delete_option( 'omnipress_ai_chatbot_settings' );
}

register_activation_hook( __FILE__, 'omnipress_ai_chatbot_activate' );
register_deactivation_hook( __FILE__, 'omnipress_ai_chatbot_deactivate' );
