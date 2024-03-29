<?php

/**
 * @file
 *  Rules integration for Revisioning module.
 *
 */

/*************************** Rules Conditions ********************************/

/*
 * Implements hook_rules_condition_info().
 */
function revisioning_rules_condition_info() {
  return array(
    'revisioning_node_has_pending' => array(
      'label' => t('Content has pending revision'),
      'arguments' => array(
        'node' => array('type' => 'node', 'label' => t('Content'))
      ),
      'help' => t('Evaluates to TRUE, if the node has one or more pending revisions'),
      'module' => 'revisioning',
    ),
    'revisioning_condition_revision_is' => array(
      'label' => t('Content revision is'),
      'arguments' => array(
        'node' => array('type' => 'node', 'label' => t('Content'))
      ),
      'help' => t('Evaluates to TRUE, if revision is one of selected types'),
      'module' => 'revisioning',
    ),
  );
}

/*
 * Condition: check for pending revisions of the node.
 */
function revisioning_node_has_pending($node, $settings) {
  return (_revisioning_get_number_of_pending_revisions($node->nid) > 0);
}

/*
 * Condition: check for pending revisions of the node.
 */
function revisioning_condition_revision_is($node, $settings) {
  $type = _revisioning_revision_is($node);
  return in_array($type, $settings['revision_type']);
}

/*
 *  Check for content types - configuration form.
 */
function revisioning_condition_revision_is_form($settings = array(), &$form) {
  $form['settings']['revision_type'] = array(
    '#type' => 'select',
    '#title' => t('Is one of'),
    '#options' => revisioning_revision_states(),
    '#multiple' => TRUE,
    '#default_value' => isset($settings['revision_type']) ? $settings['revision_type'] : array(),
    '#required' => TRUE,
  );
}

/**
 * Label callback for "revisioning_revision_is" condition.
 */
function revisioning_condition_revision_is_label($settings, $argument_labels) {
  $names = array_intersect_key(revisioning_revision_states(), $settings['revision_type']);
  return t('Revision status of @node is: @type', $argument_labels + array('@type' => implode(' or ', $names)));
}

/**
 * Label callback for "revisioning_node_has_pending" condition.
 */
function revisioning_node_has_pending_label($settings, $argument_labels) {
  return t('Content "@node" has pending revision(s)', $argument_labels);
}

/************************** Rules Events **************************************/

/**
 * Implements hook_rules_event_info().
 */
function revisioning_rules_event_info() {
  $default = array(
    'module' => 'revisioning',
    'arguments' =>  _revisioning_rules_event_arguments(),
    'redirect' => TRUE,
  );
  $events = array(
    'revisioning_post_unpublish' => $default + array(
      'label' => t('Content has been unpublished'),
    ),
    'revisioning_post_publish' => $default + array(
      'label' => t('Pending revision has been published'),
    ),
    'revisioning_post_revert' => $default + array(
      'label' => t('Content has been reverted to revision'),
    ),
    'revisioning_pre_delete' => $default + array(
      'label' => t('Content revision is going to be deleted'),
    ),
    'revisioning_pre_revert' => $default + array(
      'label' => t('Content is going to be reverted to revision'),
    ),
  );
  return $events;
}

/**
 * Returns arguments suitable for using it with a node.
 */
function _revisioning_rules_event_arguments() {
  return array(
    'node' => array(
      'type' => 'node',
      'label' => t('target revision of operation'),
    ),
    'current_revision' => array(
      'type' => 'node',
      'label' => t('current revision of target content'),
      'handler' => 'revisioning_events_argument_current_revision'
    ),
    'author' => array(
      'type' => 'user',
      'label' => t('content author'),
      'handler' => 'rules_events_argument_node_author'
    ),
    'target_author' => array(
      'type' => 'user',
      'label' => t('target revision author'),
      'handler' => 'revisioning_events_argument_target_revision_author'
    ),
    'current_author' => array(
      'type' => 'user',
      'label' => t('current revision author'),
      'handler' => 'revisioning_events_argument_current_revision_author'
    ),
    'user' => array(
      'type' => 'user',
      'label' => t('acting user'),
      'handler' => 'rules_events_argument_global_user'
    ),
  );
}

/**
 * Current revision author argument handler.
 */
function revisioning_events_argument_current_revision_author($node) {
  $current_vid = revisioning_get_current_node_revision_id($node->nid);
  $uid = $node->revision_uid;
  if ($node->vid != $current_vid) {
    $current = node_load($node->nid, $current_vid);
    $uid = $current->revision_uid;
  }
  $user = user_load($uid);
  return $user;
}

/**
 * Target revision author argument handler.
 */
function revisioning_events_argument_target_revision_author($node) {
  $user = user_load($node->revision_uid);
  return $user;
}

/**
 * Current revision event argument handler.
 */
function revisioning_events_argument_current_revision($node) {
  $current_vid = revisioning_get_current_node_revision_id($node->nid);
  if ($node->vid != $current_vid) {
    $current = node_load($node->nid, $current_vid);
    return $current;
  }
  return $node;
}

/*************************** Rules Actions ************************************/

/**
 * Implements hook_rules_action_info().
 */
function revisioning_rules_action_info() {
  $default = array(
    'module' => 'revisioning',
  );
  return array(
    'revisioning_rules_action_publish_latest' => $default + array(
      'label' => t('Publish the most recent pending revision'),
      'arguments' => array(
        'node' => array('type' => 'node', 'label' => t('content')),
      ),
    ),
    'revisioning_rules_action_load_current' => $default + array(
      'label' => t('Load current revision of content'),
      'arguments' => array(
        'node' => array('type' => 'node', 'label' => t('content')),
      ),
      'new variables' => array(
        'loaded_current_revision' => array(
          'type' => 'node',
          'label' => t('Loaded current revision of content'),
          'save' => FALSE,
          'label callback' => 'revisioning_rules_loaded_current_label',
        ),
      ),
    ),
  );
}

/**
 * Label callback for "revisioning_rules_action_load_current" action.
 */
function revisioning_rules_action_load_current_label($settings, $argument_labels) {
  return t('Load current revision of "@node"', $argument_labels);
}

/**
 * Label callback for "loaded_current_revision" variable.
 */
function revisioning_rules_loaded_current_label($settings, $argument_labels) {
  return t('Loaded current revision of "@node"', $argument_labels);
}

/**
 * Action: load current revision of provided node.
 */
function revisioning_rules_action_load_current($node) {
  $current_vid = revisioning_get_current_node_revision_id($node->nid);
  if ($node->vid != $current_vid) {
    $current = node_load($node->nid, $current_vid);
    return array('loaded_current_revision' => $current);
  }
  return array('loaded_current_revision' => $node);
}

/**
 * Action: publish most recent pending revision.
 */
function revisioning_rules_action_publish_latest($node) {
  $published = _revisioning_publish_latest_revision($node);
}
