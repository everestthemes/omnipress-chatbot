<?php

namespace Omnipress\AIChatbot\Services;

use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


use Omnipress\AIChatbot\Abstracts\AbstractService;

/**
 * ChatServices class.
 *
 * @author omnipressteam
 * @copyright (c) 2025
 * @since 0.1.0
 */
class ChatServices extends AbstractService {

	const REMOTE_URL = 'https://omnipressai.com/api';
	// const REMOTE_URL = 'http://localhost:3000/api';

	/**
	 * {@inheritDoc}
	 */
	public function find_all() {
		return array();
	}

	/**
	 * {@inheritDoc}
	 */
	public function add_item( $data ) {
		return true;
	}

	/**
	 * {@inheritDoc}
	 */
	public function delete_item( int $id ) {
		return true;
	}

	/**
	 * {@inheritDoc}
	 */
	public function find_one( $id ) {
		return true;
	}

	/**
	 * {@inheritDoc}
	 */
	public function update_item( $id, $data ) {
		return true;
	}

	public function validate_ai_reponse( WP_REST_Response $response ) {
	}

	/**
	 * {@inheritDoc}
	 */
	public function update_items( $data ) {
		if (
			empty( $data )
			|| ( ! isset( $data->messages ) && ! isset( $data->question ) )
		) {
			return array(
				'success'  => false,
				'messages' => 'Invalid data',
			);
		}

		$configs = get_option( AdminSettingServices::ADMIN_SETTING_OPTION, array() );

		if ( ! isset( $configs->apiKey ) ) {
			return array(
				'success'  => false,
				'messages' => 'Api key not found!',
			);
		}

		$res = wp_remote_post(
			self::REMOTE_URL . '/generate/chatbot',
			array(
				'method'  => 'POST',
				'body'    => wp_json_encode( $data ),
				'timeout' => '30',
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $configs->apiKey,
				),
			)
		);

		if ( is_wp_error( $res ) ) {
			return array(
				'success'     => false,
				'messages'    => 'Failed to send request',
				'status_code' => $res->get_error_code(),
			);
		}

		if ( 200 !== $res['response']['code'] ) {
			return array(
				'success'     => false,
				'messages'    => json_decode( $res['body'], true )['message'],
				'status_code' => $res['response']['code'],
			);
		}

		return array(
			'success' => true,
			'data'    => json_decode( $res['body'], true ),
		);
	}
}
