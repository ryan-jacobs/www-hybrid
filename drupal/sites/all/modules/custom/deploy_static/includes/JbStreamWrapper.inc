<?php

/**
 * Juicebox files (jb://) stream wrapper class.
 */
class JbStreamWrapper extends DrupalPublicStreamWrapper {
  public function getDirectoryPath() {
    return 'juicebox/xml';
  }
}
