<?php

namespace Omnipress\AIChatbot;

use Omnipress\AIChatbot\Abstracts\AbstractController;
use Omnipress\AIChatbot\Admin\Admin;
use Omnipress\AIChatbot\Api\AdminSettingApi;
use Omnipress\AIChatbot\Api\RestApi;
use Omnipress\AIChatbot\Controllers\AdminSettingsController;

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

	/**
	 * Admin class.
	 *
	 * @var Admin $admin
	 */
	protected Admin $admin;

	/**
	 * AdminSettingApi class.
	 *
	 * @var AdminSettingApi $admin_setting_api
	 */
	protected AdminSettingApi $admin_setting_api;

	/**
	 * RestApi class.
	 *
	 * @var RestApi $rest_api
	 */
	protected RestApi $rest_api;

	/**
	 * AbstractController class.
	 *
	 * @var AbstractController $controller
	 */
	protected AbstractController $controller;

	/**
	 * AdminSettingsController class.
	 *
	 * @var AdminSettingsController $admin_settings_controller
	 */
	protected AdminSettingsController $admin_settings_controller;

	/**
	 * Construct function
	 */
	public function __construct() {
		$this->loader                    = new Loader();
		$this->admin                     = new Admin( $this->loader );
		$this->admin_settings_controller = new AdminSettingsController();
		$this->admin_setting_api         = new AdminSettingApi( $this->loader, $this->admin_settings_controller );

		$this->loader->register_hooks();
	}
}
