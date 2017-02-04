<?php
/**
* @file views-view-grid.tpl.php
* Default simple view template to display a rows in a grid.
*
* - $rows contains a nested array of rows. Each row contains an array of
* columns.
*
* @ingroup views_templates
*/
?>
<?php if (!empty($title)) : ?>
<h3><?php print $title; ?></h3>
<?php endif; ?>

<?php foreach ($rows as $columns): ?>
<div class="grid-9 alpha omega equal-height-container views-grid-column">
<?php foreach ($columns as $counter => $item): ?>
<?php
  if ($counter == 0) {
    $alpha_omega = ' alpha';
  }
  elseif (count($columns) == ($counter + 1)) {
    $alpha_omega = ' omega';
  }
  else {
    $alpha_omega = '';
  }
  // If we have content then add "layered-box" style.
  $added_class = ' layered-box';
  $trimmed_content = trim($item);
  if (empty($trimmed_content)) {
    $added_class = '';
  }
?>
<div class="grid-3 views-grid-item equal-height-element<?php print $alpha_omega . $added_class ?>">
  <div class="views-grid-item-inner"> 
<?php print $item; ?>
  </div>
</div>
<?php endforeach; ?>
</div>
<?php endforeach; ?>