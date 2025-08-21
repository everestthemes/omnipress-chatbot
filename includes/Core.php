<?php

namespace Omnipress\AIChatbot;

use Omnipress\AIChatbot\Abstracts\AbstractController;
use Omnipress\AIChatbot\Admin\Admin;
use Omnipress\AIChatbot\Api\AdminSettingApi;
use Omnipress\AIChatbot\Api\ChatApi;
use Omnipress\AIChatbot\Api\RestApi;
use Omnipress\AIChatbot\Controllers\AdminSettingsController;
use Omnipress\AIChatbot\Client\InitChatbot;
use Omnipress\AIChatbot\Controllers\ChatController;

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
	public Loader $loader;

	/**
	 * Admin class.
	 *
	 * @var Admin $admin
	 */
	public Admin $admin;

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
	public AbstractController $controller;

	/**
	 * AdminSettingsController class.
	 *
	 * @var AdminSettingsController $admin_settings_controller
	 */
	public AdminSettingsController $admin_settings_controller;

	/**
	 * ChatController class.
	 *
	 * @var ChatController $chat_controller
	 */
	public ChatController $chat_controller;

	/**
	 * ChatApi class.
	 *
	 * @var ChatApi $chat_api
	 */
	public ChatApi $chat_api;

	/**
	 * InitChatbot class.
	 *
	 * @var InitChatbot $init_chatbot
	 */
	public InitChatbot $init_chatbot;


	/**
	 * Construct function
	 */
	public function __construct() {
		$this->loader                    = new Loader();
		$this->admin                     = new Admin( $this->loader );
		$this->admin_settings_controller = new AdminSettingsController();
		$this->chat_controller           = new ChatController();

		// Register apis.
		$this->admin_setting_api = new AdminSettingApi( $this->loader, $this->admin_settings_controller );
		$this->chat_api          = new ChatApi( $this->loader, $this->chat_controller );

		// initalize chat bot.
		$this->init_chatbot = new InitChatbot( $this );

		$this->loader->register_hooks();
	}
}
