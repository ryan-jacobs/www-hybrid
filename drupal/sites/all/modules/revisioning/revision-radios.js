
(function ($) {

  Drupal.behaviors.suppressPublishedForModeratedContent = {
    attach: function (context) {

      var publishedDiv = $('.form-item-status', context);
      var firstSummaryTab = $('.vertical-tabs span.summary:first', context)
      var lastSummaryTab  = $('.vertical-tabs span.summary:last', context);

      if ($('.form-item-revision-operation .form-radio:checked').val() == 2) { // NEW_REVISION_WITH_MODERATION
        // Hide the "Published" check-box, as it does not apply in this mode
        // because the new revision will always be unpublished. 
        publishedDiv.hide();
        updatedText = lastSummaryTab.text().replace(Drupal.t('Published'), Drupal.t('Not published'));
        lastSummaryTab.text(updatedText);
      }

      $('.form-radio').click(function() {
        clicked = $('.form-item-revision-operation .form-radio:checked').val();

        if (clicked == 2) { // NEW_REVISION_WITH_MODERATION
          publishedDiv.hide();
          var updatedText = lastSummaryTab.text().replace(Drupal.t('Published'), Drupal.t('Not published'));
          lastSummaryTab.text(updatedText);
        }
        else { // NO_REVISION or NEW_REVISION_NO_MODERATTION
          publishedDiv.show();
          if (clicked == 0) { // NO_REVISION
            var updatedText = firstSummaryTab.text().replace(Drupal.t('New revision'), Drupal.t('No revision'));
            firstSummaryTab.text(updatedText);
          }
          if ($('.form-item-status input').is(':checked')) {
            updatedText = lastSummaryTab.text().replace(Drupal.t('Not published'), Drupal.t('Published'));
          }
          else {
            updatedText = lastSummaryTab.text().replace(Drupal.t('Published'), Drupal.t('Not published'));
          }
          lastSummaryTab.text(updatedText);
        }

      });
    }
  };

})(jQuery);

