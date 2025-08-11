<?php
namespace Omnipress\AIChatbot\Abstracts;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abstract controller class
 *
 * @author omnipressteam
 *
 * @copyright (c) 2025
 *
 * @since 0.1.0
 * @package Omnipress\AIChatbot\Abstracts
 */
abstract class AbstractController {
	/**
	 * Services instance
	 *
	 * @var AbstractService
	 */
	protected AbstractService $services;

	/**
	 * Get all items
	 *
	 * @return array|bool
	 */
	public function get_items() {
		if ( method_exists( $this->services, 'find_all' ) ) {
			return $this->services->find_all();
		}
		return false;
	}

	/**
	 * Get item
	 *
	 * @param int $id item id.
	 *
	 * @return mixed
	 */
	public function get_item( int $id ) {
		if ( method_exists( $this->services, 'get_item' ) ) {
			return $this->services->find_one( $id );
		}
		return false;
	}

	/**
	 * Create item
	 *
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	public function create_item( $data ) {
		if ( method_exists( $this->services, 'create_item' ) ) {
			return $this->services->add_item( $data );
		}
		return false;
	}

	/**
	 * Update item
	 *
	 * @param int   $id item id.
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	public function update_item( int $id, mixed $data ) {
		if ( method_exists( $this->services, 'update_item' ) ) {
			return $this->services->update_item( $id, $data );
		}
		return false;
	}

	/**
	 * Delete item
	 *
	 * @param int $id item id.
	 *
	 * @return bool
	 */
	public function delete_item( int $id ) {
		if ( method_exists( $this->services, 'delete_item' ) ) {
			return $this->services->delete_item( $id );
		}
		return false;
	}

	/**
	 * Update items
	 *
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	public function update_items( $data ) {
		if ( method_exists( $this->services, 'update_items' ) ) {
			error_log( 'updatingggg' );
			return $this->services->update_items( $data );
		}
		return false;
	}
}
