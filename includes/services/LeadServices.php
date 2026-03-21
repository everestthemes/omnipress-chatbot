<?php
namespace Omnipress\AIChatbot\Services;

use Omnipress\AIChatbot\Abstracts\AbstractService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * LeadServices class.
 *
 * @author omnipressteam
 * @copyright (c) 2025
 */
class LeadServices extends AbstractService {

	/**
	 * {@inheritDoc}
	 */
	public function add_item( mixed $data ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_leads';

		$result = $wpdb->insert(
			$table_name,
			array(
				'name'       => sanitize_text_field( $data['name'] ),
				'email'      => sanitize_email( $data['email'] ),
				'phone'      => sanitize_text_field( $data['phone'] ),
				'session_id' => sanitize_text_field( $data['session_id'] ),
			)
		);

		return $result !== false;
	}

	public function find_all() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_leads';
		return $wpdb->get_results( "SELECT * FROM $table_name ORDER BY created_at DESC" );
	}

	public function find_one( $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_leads';
		return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE id = %d", $id ) );
	}

	public function delete_item( int $id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_leads';
		return $wpdb->delete( $table_name, array( 'id' => $id ) );
	}

	public function update_item( int $id, mixed $data ) {
		return false;
	}

	/**
	 * {@inheritDoc}
	 */
	public function update_items( mixed $data ) {
		return false;
	}
}
