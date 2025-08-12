<?php
namespace Omnipress\AIChatbot\Services;

use Omnipress\AIChatbot\Abstracts\AbstractService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * AdminSettingServices class.
 *
 * @author Asishwor
 * @copyright (c) 2025
 * @since 0.1.0
 */
class AdminSettingServices extends AbstractService {
	const ADMIN_SETTING_OPTION = 'omnipress_ai_chatbot_settings';
	/**
	 * {@inheritDoc}
	 */
	public function find_all() {
		return get_option( self::ADMIN_SETTING_OPTION, array() );
	}

	/**
	 * Update items
	 *
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	public function update_items( $data ) {
		return update_option( 'omnipress_ai_chatbot_settings', $data );
	}

	/**
	 * {@inheritDoc}
	 */
	public function find_one( int $id ) {
		return get_option( 'omnipress_ai_chatbot_settings' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function add_item( $data ) {
		return update_option( 'omnipress_ai_chatbot_settings', $data );
	}

	/**
	 * {@inheritDoc}
	 */
	public function update_item( int $id, $data ) {
		return update_option( 'omnipress_ai_chatbot_settings', $data );
	}

	/**
	 * {@inheritDoc}
	 */
	public function delete_item( int $id ) {
		return delete_option( 'omnipress_ai_chatbot_settings' );
	}
}
