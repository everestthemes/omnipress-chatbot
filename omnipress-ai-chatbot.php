<?php

use Omnipress\AIChatbot\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin Name: Omnipress AI Chatbot
 * Plugin URI: https://github.com/everestthemes/omnipress-ai-chatbot
 * Description: Omnipress AI Chatbot
 * Version: 0.1.2
 * Author: Everest Themes
 * Author URI: https://everestthemes.com
 * Text Domain: omnipress-ai-chatbot
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */
function omnipress_ai_chatbot_define_constants() {
	define( 'OMNIPRESS_AI_CHATBOT_VERSION', '0.1.2' );
	define( 'OMNIPRESS_AI_CHATBOT_DIR', plugin_dir_path( __FILE__ ) );
	define( 'OMNIPRESS_AI_CHATBOT_URL', plugin_dir_url( __FILE__ ) );
}

// Check PHP Version is greater or equal to 7.4.
if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
	add_action(
		'admin_notices',
		function () {
			?>
			<div class="notice notice-error">
				<p><?php esc_html_e( 'Omnipress AI Chatbot requires PHP version 7.4 or higher.', 'omnipress-ai-chatbot' ); ?></p>
			</div>
			<?php
		}
	);

	return;
}

omnipress_ai_chatbot_define_constants();

require_once __DIR__ . '/includes/require.php';

$core = new Core();

/**
 * Create instance of the plugin.
 *
 * @return void
 */
function omnipress_ai_chatbot_activate() {
	$default_settings = array(
		'apiKey'              => '',
		'isEnableChatBot'     => false,
		'isEnableLeadCapture' => false,
		'customizations'      => array(
			'backgroundColor' => '#4F46E5',
			'textColor'       => '#FFFFFF',
			'linkColor'       => '#FFFFFF',
			'iconPosition'    => 'bottom-right',
			'logoUrl'         => '',
			'titleText'       => 'AI Assistant',
		),
		'client'              => array(
			'name'  => 'n1 technology',
			'email' => 'info@n1technology.com',
			'slug'  => 'n1technology',
		),
	);

	add_option( 'omnipress_ai_chatbot_settings', $default_settings );

	// Create database tables.
	omnipress_ai_chatbot_create_tables();

	// Store version.
	update_option( 'omnipress_ai_chatbot_db_version', OMNIPRESS_AI_CHATBOT_VERSION );

	// Schedule daily cleanup.
	if ( ! wp_next_scheduled( 'omnipress_ai_chatbot_daily_cleanup' ) ) {
		wp_schedule_event( time(), 'daily', 'omnipress_ai_chatbot_daily_cleanup' );
	}
}

/**
 * Create database tables.
 *
 * @return void
 */
function omnipress_ai_chatbot_create_tables() {
	global $wpdb;

	$charset_collate = $wpdb->get_charset_collate();

	$table_leads    = $wpdb->prefix . 'omnipress_ai_chatbot_leads';
	$table_messages = $wpdb->prefix . 'omnipress_ai_chatbot_messages';

	$sql = "CREATE TABLE $table_leads (
		id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		name varchar(255) NOT NULL,
		email varchar(255) NOT NULL,
		phone varchar(20),
		session_id varchar(100),
		created_at datetime DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY  (id)
	) $charset_collate;

	CREATE TABLE $table_messages (
		id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		user_id bigint(20) UNSIGNED,
		session_id varchar(100),
		role enum('user', 'assistant') NOT NULL,
		content text NOT NULL,
		created_at datetime DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY  (id),
		KEY user_id (user_id),
		KEY session_id (session_id)
	) $charset_collate;";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );
}

/**
 * Deactivate the plugin.
 *
 * @return void
 */
function omnipress_ai_chatbot_deactivate() {
	delete_option( 'omnipress_ai_chatbot_settings' );
	wp_clear_scheduled_hook( 'omnipress_ai_chatbot_daily_cleanup' );
}

add_action( 'omnipress_ai_chatbot_daily_cleanup', 'omnipress_ai_chatbot_run_cleanup' );

/**
 * Run chat history cleanup.
 *
 * @return void
 */
function omnipress_ai_chatbot_run_cleanup() {
	$history_service = new \Omnipress\AIChatbot\Services\ChatHistoryServices();
	$history_service->cleanup_old_messages();
}

add_action( 'plugins_loaded', 'omnipress_ai_chatbot_check_version' );

/**
 * Check plugin version and update database if needed.
 *
 * @return void
 */
function omnipress_ai_chatbot_check_version() {
	$stored_version = get_option( 'omnipress_ai_chatbot_db_version' );

	if ( version_compare( $stored_version, OMNIPRESS_AI_CHATBOT_VERSION, '<' ) ) {
		omnipress_ai_chatbot_create_tables();
		update_option( 'omnipress_ai_chatbot_db_version', OMNIPRESS_AI_CHATBOT_VERSION );
	}
}

register_activation_hook( __FILE__, 'omnipress_ai_chatbot_activate' );
register_deactivation_hook( __FILE__, 'omnipress_ai_chatbot_deactivate' );
