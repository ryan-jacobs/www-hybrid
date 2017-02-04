<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 * 
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */



function main_alpha_page_structure_alter(&$vars) {
  // Add a 'sub-region' that will be nested inside top of the main content 
  // region. This allows a region to be styled above the main site context,
  // that can contain multiple blocks and will stack properly.
  if (!drupal_is_front_page() && !drupal_match_path(current_path(), 'photos')) { // We don't want this region on the landing pages
    $vars['content']['content']['content']['#sorted'] = FALSE;
    if (!empty($vars['#excluded']['preface_second'])) {
      $vars['#excluded']['preface_second']['#weight'] = -99;
      $vars['content']['content']['content']['preface_second'] = $vars['#excluded']['preface_second'];
      // Also dynamically set the width of this special region depend on
      // whether-or-not there is a sidebar.
      $preface_second_width = 9;
      if (empty($vars['content']['content']['sidebar_second'])) {
        $preface_second_width = 12;
      }
      $vars['content']['content']['content']['preface_second']['#grid']['columns'] = $preface_second_width;
    }
  }
}


/*----------------------------------------------------------------------------
  Preprocess functions (could go into /proprocess folder)
  ----------------------------------------------------------------------------*/


function main_preprocess_html(&$vars) {
  // Add template suggestions for html per node type
  $node = menu_get_object();
  if ($node && $node->nid) {
    $vars['theme_hook_suggestions'][] = 'html__' . $node->type;
  }
}

function main_preprocess_block(&$vars) {
  // We want all sidebar blocks to have a "box" style, so set the needed
  // class.
  $add_classes = FALSE;
  if (strpos($vars['elements']['#block']->region, 'sidebar') === 0 || strpos($vars['elements']['#block']->region, 'postscript_second') === 0) {
    $add_classes = TRUE;
  }
  if ($add_classes) {
    $vars['attributes_array']['class'][] = 'layered-box';
  }
}


function main_preprocess_region(&$vars) {
  $unwrapped_content = FALSE;
  $unwrapped_content_contexts = array('common_unwrapped_content');
  $active_contexts = array_keys(context_active_contexts());
  $intersect = array_intersect($active_contexts, $unwrapped_content_contexts);
  if (!empty($intersect)) {
    $unwrapped_content = TRUE;
  }
  // We want some regions to have a "box" style.
  $add_box_classes = FALSE;
  // The first preface region gets the "box" style.
  if ($vars['region'] == 'preface_first') {
    $add_box_classes = TRUE;
  }
  // Preface second gets a "box" style only if it's above unwrapped content.
  // Otherwise it's nested inside a region that should already have a box 
  // style (so we use "nested-region" class to strip some padding, etc).
  if ($vars['region'] == 'preface_second') {
    if ($unwrapped_content) {
      $add_box_classes = TRUE;
    }
    else {
      $vars['attributes_array']['class'][] = 'nested-region';
    }
  }
  // The main content region typically gets a "box" style, unless it should be
  // unwrapped or is a "plain content" page.
  if ($vars['region'] == 'content' && !$unwrapped_content && !isset($_GET['pc'])) {
    $add_box_classes = TRUE;
  }
  if ($add_box_classes) {
    $vars['attributes_array']['class'][] = 'layered-box';
  }
}


/*----------------------------------------------------------------------------
  Theme Overrides
  ----------------------------------------------------------------------------*/


// Delta Blocks: Add "»" glue between breadcrumb items and setup custom
// "anchors"
function main_delta_blocks_breadcrumb($variables) {
  
  // See if breadcrumb should be simple project anchor
  $project_contexts = array('section_projects_index', 'section_projects_pages');
  $active_contexts = array_keys(context_active_contexts());
  $intersect = array_intersect($active_contexts, $project_contexts);
  if (!empty($intersect)) {
    return '<div class="section-crumb"><a href="/projects"><span class="sprite section-anchor"></span>all projects</a></div>';
  }
  // See if breadcrumb should be simple project anchor
  $active_contexts = array_keys(context_active_contexts());
  foreach ($active_contexts as $context) {
    if (strpos($context, 'section_projects') === 0) {
      return '<div class="section-crumb"><a href="/projects"><span class="sprite section-anchor"></span>all projects</a></div>';
    }
    if (strpos($context, 'section_galleries') === 0) {
      return '<div class="section-crumb"><a href="/photos"><span class="sprite section-anchor"></span>all photos</a></div>';
    }
  }
  
  
  $output = '';
  $glue = "»";
  // Update breadcrumb just in case.
  $variables['breadcrumb'] = drupal_get_breadcrumb();
  if (!empty($variables['breadcrumb'])) {
    if ($variables['breadcrumb_current']) {
      $variables['breadcrumb'][] = l(drupal_get_title(), current_path(), array('html' => TRUE));
    }
    $output = '<div id="breadcrumb" class="clearfix"><ul class="breadcrumb">';
    $switch = array('odd' => 'even', 'even' => 'odd');
    $zebra = 'even';
    $last = count($variables['breadcrumb']) - 1;
    foreach ($variables['breadcrumb'] as $key => $item) {
      $zebra = $switch[$zebra];
      $attributes['class'] = array('depth-' . ($key + 1), $zebra);

      if ($key == 0) {
        $attributes['class'][] = 'first';
      }

      if ($key == $last) {
        $attributes['class'][] = 'last';
        $glue = '';
      }
      $output .= '<li' . drupal_attributes($attributes) . '>' . $item . ' ' . $glue . '</li>';
    }
    $output .= '</ul></div>';
  }
  return $output;
}


// Delta Blocks: Override delta blocks title output in order to catch some 
// custom title tweaks.
function main_delta_blocks_page_title($variables) {
  // Have a chance to override the title here
  if (function_exists('local_helpers_set_custom_title')) {
    $variables['page_title'] = local_helpers_set_custom_title($variables['page_title']);
  }
  if ($variables['page_title'] !== '') {
    $attributes['id'] = 'page-title';
    $attributes['class'][] = 'title';
    
    if ($variables['page_title_hidden']) {
      $attributes['class'][] = 'element-invisible';
    }
    
    return '<h1' . drupal_attributes($attributes) . '>' . $variables['page_title'] . '</h1>';
  }
}


// Core: Modify the system links output to accomodate artisteer menu styles
function main_links__system_main_menu($variables) {
  $links = $variables['links'];
  $attributes = $variables['attributes'];
  // Adjust attributes for this case
  $attributes['class'][] = 'art-menu';
  $key = array_search('clearfix', $attributes['class']);
  if ($key) {
    unset($attributes['class'][$key]);
  }
  $heading = $variables['heading'];
  global $language_url;
  $output = '';

  if (count($links) > 0) {
    $output = '';

    // Treat the heading first if it is present to prepend it to the
    // list of links.
    if (!empty($heading)) {
      if (is_string($heading)) {
        // Prepare the array that will be used when the passed heading
        // is a string.
        $heading = array(
          'text' => $heading,
          // Set the default level of the heading.
          'level' => 'h2',
        );
      }
      $output .= '<' . $heading['level'];
      if (!empty($heading['class'])) {
        $output .= drupal_attributes(array('class' => $heading['class']));
      }
      $output .= '>' . check_plain($heading['text']) . '</' . $heading['level'] . '>';
    }

    $output .= '<ul' . drupal_attributes($attributes) . '>';

    $num_links = count($links);
    $i = 1;
    foreach ($links as $key => $link) {
      $class = array($key);

      // Add first, last and active classes to the list of links to help out themers.
      if ($i == 1) {
        $class[] = 'first';
      }
      if ($i == $num_links) {
        $class[] = 'last';
      }
      if (isset($link['href']) && ($link['href'] == $_GET['q'] || ($link['href'] == '<front>' && drupal_is_front_page()))
          && (empty($link['language']) || $link['language']->language == $language_url->language) || strpos($key, 'active-trail') !== FALSE) {
        $class[] = 'active';
      }
      $output .= '<li' . drupal_attributes(array('class' => $class)) . '>';

      if (isset($link['href'])) {
        // Pass in $link as $options, they share the same keys.
        $output .= '<a' . drupal_attributes(array('class' => $class)) . 'href="' . url($link['href']) . '"><span class="l"> </span> <span class="r"> </span> <span class="t">' . check_plain($link['title']) . '</span></a>';
      }
      elseif (!empty($link['title'])) {
        // Some links are actually not links, but we wrap these in <span> for adding title and class attributes.
        if (empty($link['html'])) {
          $link['title'] = check_plain($link['title']);
        }
        $span_attributes = '';
        if (isset($link['attributes'])) {
          $span_attributes = drupal_attributes($link['attributes']);
        }
        $output .= '<span' . $span_attributes . '>' . $link['title'] . '</span>';
      }

      $i++;
      $output .= "</li>\n";
    }

    $output .= '</ul>';
  }

  return $output;
}


// Core: Modify the general menu links to support icons for tax links
function main_menu_link(array $variables) {
  $element = $variables['element'];
  $added_span = '';
  if (isset($element['#href'])) {
    // General menu links that are taxonomy links may get icon span
    if (strpos($element['#href'], 'taxonomy/term/') === 0) {
      $added_span = '<span class="tax-icon tax-icon-' . str_replace('taxonomy/term/', '', $element['#href']) . '"></span>';
      $element['#title'] = $added_span . $element['#title'];
      $element['#localized_options']['html'] = TRUE;
      $element['#attributes']['class'][] = 'tax-icon-wrap';
    }
    // Menu links that point to "tagadelic" page get special treatment
    if (strpos($element['#href'], 'node/42') === 0) {
      $added_span = '<span class="tax-icon"></span>';
      $element['#title'] = $added_span . $element['#title'];
      $element['#localized_options']['html'] = TRUE;
      $element['#localized_options']['attributes']['class'][] = 'make-shadow';
      $element['#attributes']['class'][] = 'tax-icon-wrap';
    }
  }
  $sub_menu = '';
  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}


// Preprocess field links in certain taxonomy reference links.
function main_preprocess_field(&$vars) {
  if (isset($vars['element']['#field_name'])) {
    if ($vars['element']['#field_name'] == 'field_project_concepts' || 
        $vars['element']['#field_name'] == 'field_project_roles') {
      foreach ($vars['items'] as &$item) {
        if (isset($item['#href'])) {
          if (strpos($item['#href'], 'taxonomy/term/') === 0) {
            $added_span = '<span class="tax-icon tax-icon-' . str_replace('taxonomy/term/', '', $item['#href']) . '"></span>';
            $item['#title'] = $added_span . $item['#title'];
            $item['#options']['html'] = TRUE;
          }
        }
      }
    }
  }
}
