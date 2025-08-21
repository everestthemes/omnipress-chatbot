<?php

namespace Omnipress\AIChatbot\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Omnipress\AIChatbot\Abstracts\AbstractController;
use Omnipress\AIChatbot\Services\AdminSettingServices;

/**
 * AdminSettingsController class.

 * @author omnipressteam
 * @copyright (c) 2025
 * @since 0.1.0
 */
final class AdminSettingsController extends AbstractController {
	/**
	 * Construct function
	 */
	public function __construct() {
		$this->services = new AdminSettingServices();
	}
}
