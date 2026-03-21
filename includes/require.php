<?php

/**
 * @package Omnipress\AIChatbot
 */

// Core files.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/Loader.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/Core.php';

// Abstracts.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/abstracts/AbstractService.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/abstracts/AbstractController.php';

// Services.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/services/AdminSettingServices.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/services/ChatServices.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/services/LeadServices.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/services/ChatHistoryServices.php';

// Admin.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/admin/admin.php';

// Api.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/api/RestApi.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/api/AdminSettingsApi.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/api/ChatApi.php';

// Controllers.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/controllers/AdminSettingsController.php';
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/controllers/ChatController.php';

// Client.
require_once OMNIPRESS_AI_CHATBOT_DIR . '/includes/client/InitChatbot.php';
