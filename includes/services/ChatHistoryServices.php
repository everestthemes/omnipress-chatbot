<?php
namespace Omnipress\AIChatbot\Services;

use Omnipress\AIChatbot\Abstracts\AbstractService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ChatHistoryServices class.
 *
 * @author omnipressteam
 * @copyright (c) 2025
 */
class ChatHistoryServices extends AbstractService {

	/**
	 * Save a message to the database.
	 *
	 * @param array $data Message data.
	 * @return bool
	 */
	public function save_message( $data ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_messages';

		$result = $wpdb->insert(
			$table_name,
			array(
				'user_id'    => isset( $data['user_id'] ) ? intval( $data['user_id'] ) : null,
				'session_id' => sanitize_text_field( $data['session_id'] ),
				'role'       => sanitize_text_field( $data['role'] ),
				'content'    => wp_kses_post( $data['content'] ),
			)
		);

		return $result !== false;
	}

	/**
	 * Get chat history for a user or session.
	 *
	 * @param int|null $user_id User ID.
	 * @param string   $session_id Session ID.
	 * @return array
	 */
	public function get_history( $user_id = null, $session_id = '' ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_messages';

		if ( ! empty( $user_id ) ) {
			$query = $wpdb->prepare( "SELECT role, content, created_at FROM $table_name WHERE user_id = %d ORDER BY created_at ASC", $user_id );
		} elseif ( ! empty( $session_id ) ) {
			$query = $wpdb->prepare( "SELECT role, content, created_at FROM $table_name WHERE session_id = %s ORDER BY created_at ASC", $session_id );
		} else {
			return array();
		}

		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map(
			function( $row ) {
				$row['timestamp'] = $row['created_at'];
				unset( $row['created_at'] );
				return $row;
			},
			$results
		);
	}

	/**
	 * Delete chat history for a user or session.
	 *
	 * @param int|null $user_id User ID.
	 * @param string   $session_id Session ID.
	 * @return bool
	 */
	public function delete_history( $user_id = null, $session_id = '' ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_messages';

		if ( ! empty( $user_id ) ) {
			$result = $wpdb->delete( $table_name, array( 'user_id' => $user_id ) );
		} elseif ( ! empty( $session_id ) ) {
			$result = $wpdb->delete( $table_name, array( 'session_id' => $session_id ) );
		} else {
			return false;
		}

		return $result !== false;
	}

	/**
	 * Cleanup messages older than 7 days.
	 *
	 * @return int Number of deleted messages.
	 */
	public function cleanup_old_messages() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'omnipress_ai_chatbot_messages';
		$days_ago   = 7;
		$date_limit = gmdate( 'Y-m-d H:i:s', time() - ( $days_ago * DAY_IN_SECONDS ) );

		$query = $wpdb->prepare( "DELETE FROM $table_name WHERE created_at < %s", $date_limit );
		return $wpdb->query( $query );
	}

	public function find_all() {
		return array();
	}

	public function add_item( $data ) {
		return $this->save_message( $data );
	}

	public function find_one( $id ) {
		return null;
	}

	public function update_item( int $id, mixed $data ) {
		return false;
	}

	public function delete_item( int $id ) {
		return $this->delete_history( null, '' ); // Generic delete not supported via ID here
	}

	/**
	 * {@inheritDoc}
	 */
	public function update_items( mixed $data ) {
		return false;
	}
}
