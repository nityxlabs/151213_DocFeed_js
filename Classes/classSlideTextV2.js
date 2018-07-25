//Javascript class: SlideText

/*
Requirements for use:
    -need a text field to input the time to transition between slides
    -need an area to display text
*/

function SlideText( arrSlides, displayID, timerID ) {
    //VAR: arrSlides = array of text that will be displayed transiently
    //VAR: displayID = string that is the ID where the text will be displayed
    //VAR: timerID = string that is the ID for an input field that will contain the seconds between transitions
    //CONSTRUCTOR: this is the constructor for the class SlideText
    this.tracker = 0;       //this tracks the current slide 
    this.direction = 1;     //this is the direction the text will be displayed - forward, backward, pause    

    this.arraySlides = arrSlides;
    this.displayID = displayID;
    this.timerID = timerID;
    this.intervalTimer;     //this is the interval timer for changing slides

    //class variables
    SlideText.boolPause = false;
    SlideText.offsetY = 50;       //used for the offset for letting text fade in & fade out
    SlideText.effectDelay = 600;
}

//class variables
SlideText.slideDisappear = function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "0"
        }, SlideText.effectDelay );
}

SlideText.slideAppear = function( slideID, strSlide, displayID ) {
    //VAR: strSlide = the string to display in the display area "displayID"
    //METHOD: makes a slide appear using slide animation
    //get window dimensions
    var docWidth = $( window ).width();
    var docHeight = $( window ).height();

    //set the font-size
    var percentFont = 0.05;
    var textSize = docHeight * percentFont;       //global variable that sets the font-size

    //create text that will be displayed
    var dispSent = "<span id='newSlide' style='position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + slideID + ": " + strSlide + "</span>";
    //add the displayed text to the larger display area
    $( "#" + displayID ).html( dispSent );

    //get dimensions for display area
    var outerHeight = $( "#newSlide" ).outerHeight(); 
    var outerWidth = $( "#newSlide" ).outerWidth(); 

    //get the middle point of the height & width
    var midH = ( parseInt($( "#" + displayID ).css("height") ) - outerHeight ) / 2;
    var midW = ( parseInt($( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
    //position the string sentence
    $( "#newSlide" ).css( {"top" : midH + SlideText.offsetY, "left" : midW, "opacity" : "0"} );

    $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "1"
        }, SlideText.effectDelay );

    console.log( "cL in classSlideText = " + slideID );

    //Code for displaying & removing slide
    //     $( "#newSlide" ).animate( {
    //         top: "-=" + SlideText.offsetY,
    //         opacity: "1"
    //     }, "slow" ).delay( inputSpeed ).animate( {
    //         top: "-=" + SlideText.offsetY,
    //         opacity: "0"
    //     }, "slow", function() {
    //         thisObj.moveDirection();
    //         thisObj.slideController();
    //     });
}

SlideText.prototype = {
    constructor: SlideText,

    //controller - change the direction of the controller
    setDirection: function( direction ) {
        this.direction = direction;
    },

    //move in desired direction
    moveDirection: function() {
        //decide the direction. 0 = pause, 1 = forward, 2 = backwards
        if ( this.direction == 0 )
            this.slidePause();
        else if ( this.direction == 1 )
            this.slideForward();
        else if ( this.direction == 2 )
            this.slideBackward();
    },

    getSlideRate: function() {
        //METHOD: set timer for slide
        var slideRate = parseInt( $( "#" + this.timerID ).val() )
        if ( isNaN(slideRate) )     //if not a number, then set to default value of 5000 milliseconds
            slideRate = 3 * 1000;
        else
            slideRate *= 1000;

        console.log( "slidePlay timer = " + slideRate );

        return slideRate;
    },

    //NOTE: SHOULD RENAME THIS FUNCTION
    slideController: function( direction ) {
        //METHOD: controls the flow of slides being presented

        //prepare display text by incrementing to next slide and then prepare to show the slide
        this.setDirection( direction );
        this.moveDirection();

        //if element id = newSlide exists, then make it disappear
        // SlideText.slideDisappear();
        this.disappearSlide();
        //display slide
        // setTimeout( SlideText.slideAppear, SlideText.effectDelay, this.tracker, this.arraySlides[this.tracker], this.displayID );
        setTimeout( this.appearSlide, SlideText.effectDelay );
    },

    slidePlay: function() {
        //retrieve time
        var slideRate = this.getSlideRate();
        
        //set speed
        var t = this;
        clearInterval( this.intervalTimer );
        this.intervalTimer = setInterval( function() { t.slideController( 1 ); }, slideRate );
    },

    slidePause: function() {
        //METHOD: will pause on the current slide
        clearInterval( this.intervalTimer );
    },

    slideForward: function() {
        //METHOD: will play the slides forward
        this.tracker++;
        if ( this.tracker >= this.arraySlides.length )
            this.tracker = 0
    },

    slideBackward: function() {
        //METHOD: will play the slides backwards
        this.tracker--;
        if ( this.tracker < 0 )
            this.tracker = this.arraySlides.length - 1;
    },

    insertSlide: function() {
        //METHOD: adds slide to display area
        //get window dimensions
        var docWidth = $( window ).width();
        var docHeight = $( window ).height();

        //set the font-size
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size

        //create text that will be displayed
        var dispSent = "<span id='newSlide' style='position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + this.tracker + ": " + this.arraySlides[ this.tracker ] + "</span>";
        //add the displayed text to the larger display area
        $( "#" + this.displayID ).html( dispSent );

        //get dimensions for display area
        var outerHeight = $( "#newSlide" ).outerHeight(); 
        var outerWidth = $( "#newSlide" ).outerWidth(); 

        //get the middle point of the height & width
        var midH = ( parseInt($( "#" + this.displayID ).css("height") ) - outerHeight ) / 2;
        var midW = ( parseInt($( "#" + this.displayID ).css("width") ) - outerWidth ) / 2;
        
        //position the string sentence
        $( "#newSlide" ).css( {"top" : midH + SlideText.offsetY, "left" : midW, "opacity" : "0"} );
    },

    appearSlide: function() {
        //VAR: argument = array of functions to be called
        //METHOD: animates slide after being inserted by method "this.insertSlide()"
        //insert slide
        this.insertSlide();

        //animate slide
        if ( arguments.length == 0 ) {
            $( "#newSlide" ).animate( {
                top: "-=" + SlideText.offsetY,
                opacity: "1"
            }, SlideText.effectDelay );
        }
        else {      //else if arguments > 0, meaning each argument is a function, then append after
            $( "#newSlide ").animate( {
                top: "-=" + SlideText.offsetY,
                opacity: "1"
            }, SlideText.effectDelay, function() {
                for ( var x in arguments )
                    arguments[x]();
            } );
        }
    },

    disappearSlide: function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "0"
        }, SlideText.effectDelay );
    },
};
