<?php

namespace Omnipress\AIChatbot\Abstracts;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Class AbstractService
 *
 * @author Ishwor Khadka <asishwor@gmail.com>
 * @package app\core
 */

abstract class AbstractService {
	/**
	 * Find all items
	 *
	 * @return mixed
	 */
	abstract public function find_all();

	/**
	 * Find one item
	 *
	 * @param int $id item id.
	 *
	 * @return mixed
	 */
	abstract public function find_one( int $id );


	/**
	 * Add item
	 *
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	abstract public function add_item( mixed $data );

	/**
	 * Update item
	 *
	 * @param int   $id item id.
	 * @param mixed $data item data.
	 *
	 * @return bool
	 */
	abstract public function update_item( int $id, mixed $data );

	/**
	 * Delete item
	 *
	 * @param int $id item id.
	 *
	 * @return bool
	 */
	abstract public function delete_item( int $id );
}
