<?php
namespace Omnipress\AIChatbot\Api;

use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


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
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
			)
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_items( $request ) {
		$data = $this->controller->get_items();

		if ( is_wp_error( $data ) ) {
			return $this->send_error_response( array( 'message' => $data->get_error_message() ), $data->get_error_code() ?? 500 );
		}

		return $this->send_success_response( $data );
	}

	/**
	 * {@inheritdoc}
	 */
	public function update_items( \WP_REST_Request $request ) {
		$data = $request->get_body();

		$data = $this->controller->update_items( json_decode( $data ) );

		if ( false === $data || false === $data['success'] ) {
			return $this->send_error_response( array( 'message' => $data['messages'] ?? 'Failed to update settings' ), 500 );
		}

		return $this->send_success_response( $data['data'] );
	}

	/**
	 * {@inheritdoc}
	 */
	public function update_item( $request ) {
		$id         = sanitize_text_field( $request->get_param( 'id' ) );
		$item_value = $request->get_param( 'data' );

		if ( empty( $id ) ) {
			return $this->send_error_response( array( 'message' => 'Invalid id' ), 400 );
		}

		$data = $this->controller->update_item( $id, $item_value );

		if ( is_wp_error( $data ) ) {
			return $this->send_error_response( array( 'message' => $data->get_error_message() ), $data->get_error_code() ?? 500 );
		}

		if ( ! isset( $data[ $id ] ) && is_array( $data ) ) {
			foreach ( $data as  $item ) {
				if ( $item['id'] === $id ) {
					$data[ $id ] = $item_value;
				}
			}
		}

		return $this->send_success_response( $data );
	}
}
