<?php
namespace Omnipress\AIChatbot\Services;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AdminSettingServices extends AbstractService {
	public function find_all() {
		return get_option( 'omnipress_ai_chatbot_settings' );
	}
}
