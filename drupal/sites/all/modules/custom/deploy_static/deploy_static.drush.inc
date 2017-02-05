<?php


/**
 * Implements hook_drush_command().
 */
function deploy_static_drush_command() {
  $items['deploy_static'] = array(
    'description' => 'Deploy static site.',
    'bootstrap' => DRUSH_BOOTSTRAP_DRUPAL_FULL,
    'core' => array('7+'),
    'drupal dependencies' => array(),
    'arguments' => array(),
    'examples' => array(
      'drush deploy_static' => 'Deploy static site.',
    ),
  );
  return $items;
}

/**
 * Callback for crowd-set-authmap Drush command.
 */
function drush_deploy_static() {
  deploy_static_deploy();
}