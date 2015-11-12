//= require jquery

// =============================================================================
// Modules
// =============================================================================

//= require modules/jpw.stickyNav.js

var jpw = window.jpw || {};

// =============================================================================
// Global/init logic
// -> let's do this
// =============================================================================

jQuery(function($) {

    // make jump navs 'sticky' on scroll
    jpw.sticky.init(".js-sticky");
});