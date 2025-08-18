<?php


namespace Omnipress\AIChatbot\Api;

use Omnipress\AIChatbot\Abstracts\AbstractController;
use Omnipress\AIChatbot\Loader;
use WP_REST_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * RestApi class.
 *
 * @author Asishwor
 * @copyright (c) 2025
 * @since 0.1.0
 */
class RestApi extends WP_REST_Controller {

	/**
	 * Controller instance
	 *
	 * @var AbstractController
	 */
	protected AbstractController $controller;
	/**
	 * Loader instance Which is handler all the actions and filters registration.
	 *
	 * @var Loader
	 */
	protected Loader $loader;

	/**
	 * Construct function
	 *
	 * @param Loader             $loader     Loader instance.
	 * @param AbstractController $controller Controller instance.
	 */
	public function __construct( Loader $loader, AbstractController $controller ) {
		$this->loader     = $loader;
		$this->controller = $controller;
		$this->namespace  = 'omnipress-ai-chatbot/v1';

		$this->loader->add_action( 'rest_api_init', $this, 'register_routes' );
	}


	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function create_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}
	/**
	 * Send success response
	 *
	 * @param mixed $data   Data to send.
	 * @param int   $status Status code.
	 *
	 * @return \WP_REST_Response
	 */
	public function send_success_response( $data, $status = 200 ) {
		$response = rest_ensure_response(
			array(
				'success' => true,
				'data'    => $data,
			)
		);
		$response->set_status( $status );
		return $response;
	}

	/**
	 * Send error response
	 *
	 * @param string $message Error message.
	 * @param int    $status  Status code.
	 *
	 * @return \WP_REST_Response
	 */
	public function send_error_response( string $message, int $status = 500 ) {
		$response = wp_send_json_error(
			array(
				'message' => $message,
			),
			$status
		);
		return $response;
	}
}
