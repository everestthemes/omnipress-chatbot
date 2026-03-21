<?php

namespace Omnipress\AIChatbot\Api;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Omnipress\AIChatbot\Services\ChatHistoryServices;
use WP_REST_Server;

/**
 * All the settings options handler like any settings related chatbot related theme customization , api key
 * Role show hide and more.
 *
 * @author omnipressteam
 * @copyright (c) 2025
 */
final class ChatApi extends RestApi {
	const REST_BASE = 'chat';

	/**
	 * Register routes function
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_items' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE . '/lead',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_lead' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE . '/history',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_history' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE . '/history',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_history' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Save lead information.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function save_lead( \WP_REST_Request $request ) {
		$body = $request->get_body();

		$params = json_decode( $body, true );

		if ( empty( $params['name'] ) || empty( $params['email'] ) ) {
			return $this->send_error_response( 'Name and email are required', 400 );
		}

		$lead_service = new \Omnipress\AIChatbot\Services\LeadServices();
		$success      = $lead_service->add_item( $params );

		if ( ! $success ) {
			return $this->send_error_response( 'Failed to save lead', 500 );
		}

		return $this->send_success_response( array( 'message' => 'Lead saved successfully' ) );
	}

	/**
	 * Delete chat history.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function delete_history( \WP_REST_Request $request ) {
		$session_id = $request->get_param( 'sessionId' );
		$user_id    = get_current_user_id();

		$history_service = new \Omnipress\AIChatbot\Services\ChatHistoryServices();
		$success         = $history_service->delete_history( $user_id, $session_id );

		if ( ! $success ) {
			return $this->send_error_response( 'Failed to clear history', 500 );
		}

		return $this->send_success_response( array( 'message' => 'History cleared successfully' ) );
	}

	/**
	 * Get chat history.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function get_history( \WP_REST_Request $request ) {
		$session_id = $request->get_param( 'sessionId' );
		$user_id    = get_current_user_id();

		$history_service = new \Omnipress\AIChatbot\Services\ChatHistoryServices();
		$history         = $history_service->get_history( $user_id, $session_id );

		return $this->send_success_response( $history );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_items( $request ) {
		$data = $this->controller->get_items();

		if ( is_wp_error( $data ) ) {
			return $this->send_error_response( $data->get_error_message(), $data->get_error_code() ?? 500 );
		}

		return $this->send_success_response( $data );
	}


	/**
	 * {@inheritdoc}
	 */
	public function update_items( \WP_REST_Request $request ) {
		$raw_body = $request->get_body();
		$data     = json_decode( $raw_body );

		if ( empty( $data ) ) {
			return $this->send_error_response( 'Invalid request body', 400 );
		}

		$settings        = get_option( 'omnipress_ai_chatbot_settings', array() );
		$collection_name = '';

		if ( isset( $settings->client->collection_name ) && ! empty( $settings->client->collection_name ) ) {
			$collection_name = $settings->client->collection_name;
		}

		// Merge in client info from saved settings
		$data->client = (object) array(
			'collection_name' => $collection_name,
			'name'            => $settings->client->name ?? '',
			'email'           => $settings->client->email ?? '',
		);

		// Forward messages history from client if present
		if ( ! isset( $data->messages ) ) {
			$data->messages = array();
		}

		$result = $this->controller->update_items( $data );

		if ( false === $result || ! $result['success'] ) {
			$error_message = $result['messages'] ?? 'Failed to get AI response';
			$status_code   = $result['status_code'] ?? 500;
			return $this->send_error_response( $error_message, $status_code );
		}

		// Save messages to history if user is logged in
		$user_id = get_current_user_id();
		if ( $user_id > 0 ) {
			$history_service = new ChatHistoryServices();
			$session_id      = isset( $data->sessionId ) ? $data->sessionId : '';

			// Save user message
			$history_service->save_message(
				array(
					'user_id'    => $user_id,
					'session_id' => $session_id,
					'role'       => 'user',
					'content'    => $data->question ?? '',
				)
			);

			// Save assistant message
			if ( isset( $result['data']['answer'] ) ) {
				$history_service->save_message(
					array(
						'user_id'    => $user_id,
						'session_id' => $session_id,
						'role'       => 'assistant',
						'content'    => $result['data']['answer'],
					)
				);
			}
		}

		return $this->send_success_response( $result['data'] );
	}

	/**
	 * {@inheritdoc}
	 */
	public function update_item( $request ) {
		$id         = sanitize_text_field( $request->get_param( 'id' ) );
		$item_value = $request->get_param( 'data' );

		if ( empty( $id ) ) {
			return $this->send_error_response( 'Invalid id', 400 );
		}

		$data = $this->controller->update_item( $id, $item_value );

		if ( is_wp_error( $data ) ) {
			return $this->send_error_response( $data->get_error_message(), $data->get_error_code() ?? 500 );
		}

		if ( ! isset( $data[ $id ] ) && is_array( $data ) ) {
			foreach ( $data as  $item ) {
				if ( $item['id'] === $id ) {
					$data[ $id ] = $item_value;
				}
			}
		}

		// client information slug, name of the company and email is required .
		$data['client'] = array(
			'slug'  => 'n1technology',
			'name'  => 'n1 technology, omnipress and everest backup',
			'email' => 'info@n1technology.com',
		);

		return $this->send_success_response( $data );
	}
}
