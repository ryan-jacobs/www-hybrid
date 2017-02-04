<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
  <head>
    <title><?php print $head_title; ?></title>
    <?php print $styles; ?>
    <?php print $scripts; ?>
    <meta charset="utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <style type="text/css">
      body {
        margin: 0px;
      }
    </style>
  </head>
  <body>
    <?php
    print render(module_invoke('system', 'block_view', 'main')); 
    print $page_bottom;
    ?>
  </body>
</html>
