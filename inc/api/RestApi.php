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
		$this->rest_base  = 'chat';
	}

	/**
	 * Register routes function
	 *
	 * @return void
	 */
	public function register_routes() {
		$this->loader->add_action( 'rest_api_init', $this, 'register_routes' );
	}
}
