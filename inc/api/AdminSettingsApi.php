<?php
namespace Omnipress\AIChatbot\Api;

use Omnipress\AIChatbot\Loader;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * All the settings options handler like any settings related chatbot related theme customization , api key
 * Role show hide and more.
 *
 * @author Asishwor
 * @copyright (c) 2025
 */
final class AdminSettingApi extends RestApi {
	const  SETTING_OPTION_GROUP = 'omnipress_ai_chatbot_settings';
	const  SETTING_OPTION_NAME  = 'chat_settings';
	const REST_BASE             = 'settings';
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
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_items' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . self::REST_BASE . '/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_item' ),
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
		error_log( 'data ==>' . print_r( $data, true ) );
		$data = $this->controller->update_items( json_decode( $data ) );

		if ( false === $data ) {
			return $this->send_error_response( array( 'message' => 'Failed to update settings' ), 500 );
		}

		return $this->send_success_response( array( 'message' => 'Settings updated successfully' ) );
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
