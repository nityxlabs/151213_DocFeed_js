
/*
THINGS NEEDED:
-calculating probability of co-occurrence
    -likelihood of N words co-occurring = [ P(wordA) * P(wordB) * .... * P(word_N) ] * total # of words
        -have threshold at least >= 3 or 2
    -likelihood of 2 words co-occurring = [ P(wordA) * P(wordB) ] * total # of words
        -QUES: what about negative binomial distribution??
    -frequency of word - calculate the probabilty of finding word in document (frequency/total # of words)
    -average word occurrence per sentence & st. dev?
    -number of unique words in document
*/

function WordDimension( word, arrSentI, arrSents, objDocAnalysis ) {
    //this will record the co-occurring frequency for each word
    if( typeof( arrSentI[0] == "string" ) )
        arrSentI = arrStrToInt( arrSentI );

    WordDimension.docAnlys = objDocAnalysis;

    this.word = word;
    // this.cooccurThreshold = WordDimension.docAnlys.wordAvg + ( 1 * WordDimension.docAnlys.wordStd );        //OR could use objDocAnalysis.wordAvg + n * objDocAnalysis.wordStd
    this.cooccurWords = this.filter_cooccur_words( word, arrSentI, arrSents );
    // this.phrase = objPhrases;
}

WordDimension.prototype = {
    constructor: WordDimension,
    
    find_cooccur_words: function( word, arrSentI, arrSents ) {
        //VAR: word = string that is the word
        //VAR: arrSentI = array of sentence indices where word is located
        //VAR: arrSents = array of sentences
        //VAR: threshold = number that is the threshold for frequency
        //METHOD: finds words that co-occur with a word of interest

        //split each sentence into individual words & save frequency of each word - ASSUMPTION: sentence preprocessed so no punctuations
        var neighborWords = {};
        for ( var i in arrSentI ) {
            //retrieve new sentence
            var getSent = arrSents[ arrSentI[ i ] ];
            var eachWord = getSent.split( /\s/g );
            for ( var j in eachWord )
                neighborWords.hasOwnProperty( eachWord[ j ] ) ? neighborWords[ eachWord[ j ] ] += 1 : neighborWords[ eachWord[ j ] ] = 1;
        }

        //remove word being searched for
        delete neighborWords[ word ];

        return neighborWords;
    },

    filter_cooccur_words: function( word, arrSentI, arrSents ) {
        //METHOD: filters words 
        var thresFreq = 3;
        var thresDensity = 0.5;

        //retrieve all co-occurring words
        var neighborWords = this.find_cooccur_words( word, arrSentI, arrSents );

        //threshold to select for neighborWords that co-occur significantly
        // var cooccurWords = {};
        // for ( var i in neighborWords ) {
        //     if ( neighborWords[ i ] >= this.cooccurThreshold )
        //         cooccurWords[ i ] = neighborWords[ i ];
        // }

        //calculate & threshold words to select for neighborWords that co-occur significantly (based on co-occurring density & co-occurring frequency)
        var cooccurDensity = {};
        for( var i in neighborWords ) {     //i = word, neighborWords[ i ] = co-occurrence frequency
            var density = neighborWords[ i ] / WordDimension.docAnlys.quantWords[ i ];

            //TEST::
            // console.log( "neighbor = ", i, " & neighborWords[ i ] = ", neighborWords[ i ], " && freq = ", WordDimension.docAnlys.quantWords[ i ], " & density = ", density );

            if ( ( density >= thresDensity ) && ( neighborWords[ i ] >= thresFreq ) )
            {
                //TEST::
                // console.log( "filter_cooccur for ", word, ": i = ", i, " & neighborWords[i] = ", neighborWords[ i ], " & WordDimension.docAnlys.quantWords[i] = ", WordDimension.docAnlys.quantWords[ i ] );
                cooccurDensity[ i ] = [ density, neighborWords[ i ] ] ; 
            }
        }

        //TEST::
        console.log( "word = ", word, " & neighborWords = ", Object.keys( neighborWords ).length, " & co-occurWords = ", Object.keys( cooccurDensity ).length, " & words = ", cooccurDensity );

        return cooccurDensity;
    },

    find_phrases: function( word, arrSentI ) {
        //METHOD: returns a list of phrases & occurrence in document

        //split each sentence & retrieve the surrounding sentences
    },
}


//other functions
function arrStrToInt( array ) {
    //METHOD: converts an array of strings to integers
    return array.map( function( i ){ return +i; } );
}