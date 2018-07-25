//SearchWord.js
//REQUIREMENTS: jQuery

/*
Functions needed:
-return sentence indices that contain word(s)
    -also be able to 
*/

function SearchWord( arrSents, hashOWS, hashSOW ) {
    //NOTE: be careful to not change elements in arrSents, as this is a reference to the same array
    this.arrSents = arrSents;
    this.hashOWS = hashOWS;     //hashOWS = hash Original Word to Stem, key = original word, value = stem word
    this.hashSOW = hashSOW;     //hashSOW = hash Stem to Original Word, key = stem word, value = array of original word
}


SearchWord.check_asterisks = function( getWord ) {
    //starStat records value corresponding to position of asterisks at beginning or end of the word. 
    var checkAsterisk = /[\*\+]/i;        //the "*" means 0 or more occurrences of character (e.g. car* = ca, car, carrr) & "+" means 1 or more occurrences (e.g. car+ = car, carrr, carrrrrr)
    var frontStar = false;
    var endStar = false;
    var firstChar = getWord.charAt( 0 );
    var lastChar = getWord.charAt( getWord.length - 1 );
    
    if( firstChar.match( checkAsterisk ) )
        frontStar = true;

    if( lastChar.match( checkAsterisk ) )
        endStar = true;

    return [frontStar, endStar];
}

SearchWord.format_search = function( getWord, modifier ) {
    //VARS: getWord = the string that will be checked for special characters; modifier = the RegExp modifier that will be appended to the start & end of string "getWord"
    //METHOD: this function formats a word for RegExp formatting by appending modifiers (e.g. word boundary "\b") to the start & end of the string "getWord" unless special characters such as "*" or "+" occur in the beginning
    //if word contains "*", this is a wildcard character & should consider other characters where the "*" is presents
    if( modifier != null ) {
        var formatWord = modifier + "" + getWord + "" + modifier;
        var cCLen = modifier.length;
    }
    else {
        var formatWord = getWord;
        var cCLen = 0;
    }

    //STEP: check for "*" or "+" at the ends (start & end) of the word
    var starStat = SearchWord.check_asterisks( getWord );
    if( starStat[0] )
        formatWord = formatWord.substring( cCLen + 1 );

    if( starStat[1] )
        formatWord = formatWord.substring( 0, formatWord.length - cCLen - 1 );

    return formatWord;
}


SearchWord.prototype = {
    constructor: SearchWord,

    exist: function( word, sentence ) {
        //METHOD: returns if word is present in sentence
        var formatWord = SearchWord.format_search( word, "\\b" );       // \b is used as the word boundaries
        var regExpWord = new RegExp( formatWord, "i" );

        return sentence.match( regExpWord );
    },

    word_all_matches: function( word ) {
        //METHOD: returns all sentence indices that contain string "word"

        //go through each sentence, find the sentences that contain "word" (using function "exist()") & then return array of sentence indices
        var arrMatches = [];        //this will record all the sentence indices that contain
        for ( var s in this.arrSents ) {
            if ( this.exist( word, this.arrSents[ s ] ) )           //if this.exist is not null
                arrMatches.push( s );
        }

        //turn array into string
        // return arrMatches.join( "," );
        return arrMatches;
    },

    find_words: function( arrWords ) {
        //VAR: sentRadius = integer that is the radius to consider
        //VAR: arrWords = array of multiple words to search for. A trick to do this is make a string of words that are separated by a delimiter, then pass it int he argument - strWords.split( delim )
        //METHOD: returns sentence indices that contain each word in array "arrWords"
        //METHOD: returns sentence indices where words in array "arrWords" are found in a sentence
        
        //go through each word in array of words "arrWords"
        var objSentI = {};      //hash where key = word, value = 
        for ( var i in arrWords )
            objSentI[ arrWords[ i ] ] = this.word_all_matches( arrWords[ i ] );

        return objSentI;
    },

    find_cooccur_words: function( word, arrSentI ) {
        //VAR: word = string that is the word
        //VAR: arrSentI = array of sentence indices where word is located
        //METHOD: finds words that co-occur with a word of interest

        //split each sentence into individual words & save frequency of each word - ASSUMPTION: sentence preprocessed so no punctuations
        var objCoOccurWords = {};
        for ( var i in arrSentI ) {
            var eachWord = this.arrSents[ arrSentI ].split( /\s/g );
            for ( var j in eachWord )
                objCoOccurWords.hasOwnProperty( eachWord[j] ) ? objCoOccurWords[ eachWord[j] ] += 1 : objCoOccurWords[ eachWord[j] ] = 1;
        }
        //remove word being searched for
        delete objCoOccurWords[ word ];

        return objCoOccurWords;
    },

    find_phrases: function( word, arrSentI ) {
        //METHOD: returns a list of phrases & occurrence in document

        //split each sentence & retrieve the surrounding sentences
    },
}


Object.defineProperty( Array.prototype, "subset", {
    value: function( start, end ) {
        //METHOD: retrieves a subset of array "this"
        if( start < 0 )
            start = 0;
        
        if( !end || end >= this.length )
            end = this.length;

        return this.slice( start, end );
    },
    enumerable: false,      //make enumerable: false 
    configurable: false,
    writable: false
} );

// Array.prototype.subset = function( start, end ) {
//     //METHOD: retrieves a subset of array "this"
//     if( start < 0 )
//         start = 0;
    
//     if( !end || end >= this.length )
//         end = this.length;

//     return this.slice( start, end );
// }


function word_capture_linear( word, sentence, dist ) {
    //METHOD: returns words before (if dist < 0) or after (if dist > 0)

    //split sentence by white spaces
    var splitSent = sentence.split( /\s/g );
    splitSent.filter( function( i ) { return i != undefined; } );

    //find word & surrounding sentences
    var wordI = splitSent.indexOf( word );
    if( dist < 0 )
        return splitSent.subset( wordI + dist, wordI );
    if( dist > 0 )
        return splitSent.subset( wordI + 1, wordI + dist + 1 );

}

function word_capture_radius( word, sentence, radius ) {
    //METHOD: retrieves words within a radius of word, where radius is the number of white spaces 

    //split sentence by white spaces
    var splitSent = sentence.split( /\s/g );
    splitSent.filter( function( i ) { return i != undefined; } );

    //find word & surrounding sentences
    var wordI = splitSent.indexOf( word );
    return splitSent.subset( wordI - radius, wordI + radius + 1 );
}

function arrTools_CheckArrRangeLinear( getNum, getMax, getRange ) {
    //VARS: getNum = the specific index of interest in an array; getMax = get the maximum sentence index; getRange = number that is the distance from getNum
    //METHOD: this function checks it see a if a number is within range (i.e. 0 to getMax). I use this for arrays so I don't go below 0 or above getMax
    var startRange,endRange;
    //STEP: make sure parameters
    startRange=parseInt(getNum);        //this is the start range
    getMax=parseInt(getMax);
    getRange=parseInt(getRange);
    //STEP: get end range
    var upperRange=getNum+getRange;
    if(upperRange>getMax){endRange=getMax;}
    else{endRange=upperRange;}

    return {
        startI: startRange,
        endI: endRange
    };
}

function arrTools_CheckArrRangeRadial( getNum, getMax, getRange ) {
    //VARS: getNum = the specific index of interest in an array; getMax = get the maximum sentence index; getRange = number that is the distance from getNum
    //METHOD: this function checks it see a if a number is within range (i.e. 0 to getMax). I use this for arrays so I don't go below 0 or above getMax
    var startRange,endRange;
    //STEP: make sure parameters
    getNum=parseInt(getNum);
    getMax=parseInt(getMax);
    getRange=parseInt(getRange);
    //STEP: get start range
    if(getNum<getRange){startRange=0;}
    else{startRange=getNum-getRange;}
    //STEP: get end range
    var upperRange=getNum+getRange;
    if(upperRange>getMax){endRange=getMax;}
    else{endRange=upperRange;}

    return {
        startI: startRange,
        endI: endRange
    };
}