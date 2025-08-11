<?php

namespace Omnipress\AIChatbot;

use Omnipress\AIChatbot\Admin\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Core class
 *
 * @author omnipressteam
 *
 * @copyright (c) 2025
 *
 * @since 0.1.0
 */
final class Core {
	/**
	 * Loader class.
	 *
	 * @var Loader $loader
	 */
	protected Loader $loader;

	protected Admin $admin;

	/**
	 * Construct function
	 */
	public function __construct() {
		$this->loader = new Loader();
		$this->admin  = new Admin( $this->loader );
	}


	/**
	 * Initialize the plugin
	 */
	public function init(): void {
		$this->loader->register_hooks();
	}
}
