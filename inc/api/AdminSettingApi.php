<?php
namespace Omnipress\AIChatbot\Api;

use Omnipress\AIChatbot\Loader;

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

	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_items' ),
			)
		);
	}


	public function get_items( $request ) {
	}
}
