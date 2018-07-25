//Javascript class: hiLiteWord

/*
What do I need to do next:
*/
var isIE=document.all;

function hiLiteWord( hashWST ) {
    //VAR: hashWST (hash Word Similarity Table) = hash where the key is the word of interest & the value is a string that is a link to other words. E.g. Word to Stem, where the stem word can connect different words together (star, stars, starred, starry, stardom)
    //CLASS: these are a set of functions that will all to create highlightable text just by clicking
    this.hashWST = hashWST;

    //class variables
    hiLiteWord.hashLiteList = [];       //records all words that should be highlighted
}

hiLiteWord.colorGen = function() {
    var hslaColor = Math.floor( Math.random() * 360 ) + 1;
    return "hsla( " + hslaColor + ", 100%, 50%, 1 )";
}

hiLiteWord.splitSent = function( sent ) {
    //METHOD: splits a sentence into words
    return sent.split( /\s/ ); 
}

hiLiteWord.record = function( e ) {
    //METHOD: highlight word & record words to be highlighted in 
    var eventWord = isIE ? e.srcElement : e.target;
    var hiLiteID = eventWord.getAttribute( "hiLiteID" )

    //see if word is present in array list - if so, then remove & remove highlight status
    if ( hiLiteWord.hashLiteList.hasOwnProperty( hiLiteID ) )
        hiLiteWord.switch( hiLiteID, false );
    else
        hiLiteWord.switch( hiLiteID, true );
}

hiLiteWord.switch = function( hiLiteID, boolLiteOn ) {
    //METHOD: highlights word with ID "hiLiteID" if boolLiteOn is true, else turns it off if highlight word is off
    if ( boolLiteOn ) {
        var randColor = hiLiteWord.colorGen();
        hiLiteWord.hashLiteList[ hiLiteID ] = randColor;
        $( "[hiLiteID = " + hiLiteID + "]" ).css( "background-color", randColor );
    }
    else {
        delete hiLiteWord.hashLiteList[ hiLiteID ];
        $( "[hiLiteID = " + hiLiteID + "]" ).css( "background-color", "transparent" );
    }
}

hiLiteWord.track = function() {
    //METHOD: this function will highlight words in hash "hashLiteList"
    for( var word in hiLiteWord.hashLiteList )
        $( "[hiLiteID = " + word + "]" ).css( "background-color", hiLiteWord.hashLiteList[word] );
} 

hiLiteWord.prototype = {
    constructor: hiLiteWord,

    labelSent: function( sent ) {
        //METHOD: returns text that is highlightable

        //split text into individual words
        var arrWords = hiLiteWord.splitSent( sent );
        for ( var x in arrWords ) {
            if ( arrWords[x].search( /\W/ ) > -1 )
                arrWords[x] = this.labelWordCompound( arrWords[x] );
            else
                arrWords[x] = this.labelWord( arrWords[x] );
        }

        //join array of words back into sentence
        return arrWords.join(" ");
    },

    labelSentMulti: function( arrSent ) {
        //METHOD: highlights all words within an array of sentences and returns the array
        for( var x in arrSent ) {
            arrSent[ x ] = this.labelSent( arrSent[ x ] );
        }

        return arrSent;
    },

    labelWord: function( word ) {
        //see if the word exists in the hash "hashWST"
        if ( this.hashWST.hasOwnProperty( word ) )
            var hiLiteID = this.hashWST[ word ].toLowerCase();      //.toLowerCase() to homogenize string ID
        else
            var hiLiteID = word.toLowerCase();

        //return the labeled word
        var style = "padding:1px; text-align:center; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; cursor: pointer;";
        return "<span name = 'hiLite' hiLiteID = '" + hiLiteID + "' style = '" + style + "' onclick = 'hiLiteWord.record( event )' >" + word + "</span>";
    },

    labelWordCompound: function( compoundWord ) {
        //retrieve all the non-word characters
        var arrNonWords = compoundWord.match( /\W/g );
        
        //split string by non-words & then highlight
        var labelWord = "";
        var arrWords = compoundWord.split( /\W/g );
        for( var x in arrWords ) {
            labelWord += this.labelWord( arrWords[x] );
            if ( x < arrWords.length - 1 )      //if x is not on the last word, add the non-word characters
                labelWord += arrNonWords[x];
        }

        return labelWord;
    },
}
