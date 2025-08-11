<?php
/**
 * @package Omnipress\AIChatbot
 */

// Core files.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/Loader.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/Core.php';

// Abstracts.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/abstracts/AbstractService.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/abstracts/AbstractController.php';

// Services.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/services/AdminSettingServices.php';

// Admin.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/admin/admin.php';

// Api.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/api/RestApi.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/api/AdminSettingsApi.php';

// Controllers.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/inc/controllers/AdminSettingsController.php';
