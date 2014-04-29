/**
 * Map Component
 *
 * This component will render a google map in it's context.
 *
 * @method
 * init()
 * - Initializes the header component
 *
 * @method
 * render()
 * - Called when component is visible - if hidden while instanciating
 *
 */

/*
 * Component scope
 */
(function ($) {

  /*
   * Dashboard Component
   */
  components.GoogleMapPanorama = function (_context) {

    // public api object
    var api = {};
    var $context = $(_context);
    var $spinner = null;
    var context = $context.get(0);
    var watcher = null;
    var pano = null;
    var panoramaOptions = {};

    var DATA_FALLBACK = "fallback";

    var CLASSES_FALLBACK = "bg-cover bg-color--blank";
    var CLASS_SPINNER_INACTIVE = "spinner--inactive";
    var CLASS_MAP_LOADED = "map-loaded";

    var SELECTOR_SPINNER = '.spinner';
    
    var LOADED_CLASS_TIMEOUT = 500;

    //
    // Callbacks
    //

    function initializeMap() {
      panoramaOptions = {
        position: new google.maps.LatLng( $context.data('latitude'), $context.data('longitude') ),
        disableDefaultUI: true,
        scrollwheel: false,
        pov: {
          heading: 165,
          pitch: 0
        },
        zoom: 1
      };

      pano = new google.maps.StreetViewPanorama( context, panoramaOptions );
      pano.setVisible(true);
      hideSpinner();
      
      setTimeout(function() {
        $context.addClass( CLASS_MAP_LOADED );
      }, LOADED_CLASS_TIMEOUT);

    }

    function setFallback( url ) {
      if (!url) return;
      $context.css('background-image', 'url(' + url + ')');
      $context.addClass( CLASSES_FALLBACK );
    }

    function showSpinner() {
      if (!$spinner) return;
      // jQuery's fadeOut might add some dirty inline CSS...
      $spinner.css({
        'display': 'block',
        'visibility': 'visible'
      });

      $spinner.removeClass( CLASS_SPINNER_INACTIVE );

    }

    function hideSpinner() {
      if (!$spinner) return;
      $spinner.fadeOut(300, function() {
        $spinner.addClass( CLASS_SPINNER_INACTIVE );
      });
    }

    /**
     * Initializes the component - Called by ComponentLoader for each instance found on page.
     **/
    api.init = function () {
      // Hello spinner
      $spinner = $context.find( SELECTOR_SPINNER );

      // No maps on mobile. Saves bandwidth and awkwardness scrolling.
      if (Modernizr.touch || navigator.msMaxTouchPoints) {
        setFallback( $context.data( DATA_FALLBACK ) );
      } else {
        showSpinner();
        google.maps.event.addDomListener(window, 'load', initializeMap);
      }
    };

    /**
     * Function called by the component loader when it's time to render
     *  - only called if component was :visible
     * This function is not called if component is display:none - for instance hidden in an inactive tab-controller.
     * Call ComponentLoader.notifyAll() to trigger all hidden components to render when visibility changes.
     **/
    api.render = function () {
    };

    // returns public methods
    // to the world outside
    return api;

  };

  /*
   * Register the component
   */
  componentLoader.register("google-map-panorama", components.GoogleMapPanorama);


}(jQuery));
