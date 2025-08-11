<?php

namespace Omnipress\AIChatbot;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loader class
 *
 * @author omnipressteam
 *
 * @copyright (c) 2025
 *
 * @since 0.1.0
 */
final class Loader {

	/**
	 * Actions array which registerd in the add_action method.
	 *
	 * @var array
	 */
	private array $actions = array();

	/**
	 * Filters array which registerd in the add_filter method.
	 *
	 * @var array
	 */
	private array $filters = array();

	/**
	 * Register all the action and filter hooks which are added to the actions and filters arrays.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		/**
		 * Register all the action hooks which are added to the actions array.
		 */
		foreach ( $this->actions as $action ) {
			add_action( $action['hook'], array( $action['component'], $action['callback'] ), $action['priority'], $action['accepted_args'] );
		}

		/**
		 * Register all the filter hooks which are added to the filters array.
		 */
		foreach ( $this->filters as $filter ) {
			add_filter( $filter['hook'], array( $filter['component'], $filter['callback'] ), $filter['priority'], $filter['accepted_args'] );
		}
	}


	/**
	 * Add Action to register hooks from one place.
	 *
	 * @param string $hook name of the hook.
	 * @param mixed  $component Instance of the class or object where defined the callback method.
	 * @param string $callback Name of the callback method.
	 * @param int    $priority priority of the hook.
	 * @param int    $accepted_args number of arguments accepted by the callback method.
	 * @return void
	 */
	public function add_action( string $hook, $component, string $callback, int $priority = 10, int $accepted_args = 1 ) {
		$this->add( 'action', $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Add Filter to register hooks from one place.
	 *
	 * @param string $hook name of the hook.
	 * @param mixed  $component Instance of the class or object where defined the callback method.
	 * @param string $callback Name of the callback method.
	 * @param int    $priority priority of the hook.
	 * @param int    $accepted_args number of arguments accepted by the callback method.
	 * @return void
	 */
	public function add_filter( string $hook, $component, string $callback, int $priority = 10, int $accepted_args = 1 ) {
		$this->add( 'filter', $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Add action or filters to the lists of the actions and filter hooks.
	 *
	 * @param string $action_type name of the action or filter hook.
	 * @param string $hook name of the hook.
	 * @param mixed  $component Instance of the class or object where defined the callback method.
	 * @param string $callback Name of the callback method.
	 * @param int    $priority priority of the hook.
	 * @param int    $accepted_args number of arguments accepted by the callback method.
	 * @return void
	 */
	protected function add( string $action_type, string $hook, $component, string $callback, int $priority = 10, int $accepted_args = 1 ) {
		if ( 'action' === $action_type ) {
			$this->actions[] = array(
				'hook'          => $hook,
				'component'     => $component,
				'callback'      => $callback,
				'priority'      => $priority,
				'accepted_args' => $accepted_args,
			);
		} elseif ( 'filter' === $action_type ) {
			$this->filters[] = array(
				'hook'          => $hook,
				'component'     => $component,
				'callback'      => $callback,
				'priority'      => $priority,
				'accepted_args' => $accepted_args,
			);
		}
	}
}
