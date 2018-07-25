//CoOccurWord.js

/*
Requirements
-requires FullSent.js
-requires PhraseWords.js
-requires strTools_docFeed.js - need to manipulate strings
*/

function CoOccurWord(arrSents, dist_back, dist_forward, thresFreq) {
    //VAR: this.arrSents = array where each element is a sentence (processed by FullSent.js)
    //VAR: dist_back = integer that is the number of sentences to retrieve before the current sentence
    //VAR: dist_forward = integer that is the number of sentences to retrieve after the current sentence
    //VAR: thresFreq = integer that is the threshold for words to co-occur with a specific word (if <= thresFreq, then remove)
    //CLASS: finds co-occurring words in a document
    this.arrSents = arrSents;
    this.thresFreq = thresFreq;
    this.lastI = this.arrSents.length - 1;
    this.dist_back = dist_back;         //retrieve these number of sentences previous to current sentence
    this.dist_forward = dist_forward;   //retrieve these number of sentences subsequent to current sentence
}

CoOccurWord.prototype = {
    constructor: CoOccurWord,

    setPerimeter: function(dist_back, dist_forward) {
        //METHOD: resets the properties
        this.dist_back = dist_back;
        this.dist_forward = dist_forward;
    },

    findSentI: function(word) {
        //METHOD: retrieve the sentence indices that contain
        //make regular expression form of word
        var regExp = new RegExp('\\b' + word + '\\b', 'i');

        return this.arrSents.map( function(sent, i) {
            if ( sent.search(regExp) > -1 )
                return i;
        } ).filter( function(x) { return x; } );
    },

    radiusSentI: function(indices) {
        //VAR: indices = array of indices for each sentence
        //METHOD: returns sentence indices with radius applied
        if ( (this.dist_back == 0) && (this.dist_forward == 0) )
            return indices;

        var rangeI = [];

        for ( var i of indices ) {
            //get starting sentence index
            var startI = i - this.dist_back;
            if ( startI < 0 )
                startI = 0;
            //get ending sentence index
            var endI = i + this.dist_forward;
            if ( endI > this.lastI )
                endI = this.lastI;

            //add range to javascript array
            for ( var i2 = startI; i2 <= endI; i2++ )
                rangeI.push(i2);
        }

        //make unique array, sort, & return
        var uniqI = [];
        for (var i of rangeI)
            if ( uniqI.indexOf(i) == -1 )
                uniqI.push(i)

        return uniqI.sort();
    },

    findCoOccurWords: function(word) {
        //VAR: word = string that will be the hub word, find other words co-occurring with this word
        //METHOD: retrieves all words that co-occur with the word in the variable 'word'

        //retrieve all sentences that contain word
        var arrSentI = this.findSentI(word);

        //take into consideration the perimeter around a specific sentence
        arrSentI = this.radiusSentI(arrSentI);

        //find individual words that co-occur with word of interest: retrieve all sentences, remove all non-words characters, split into individual words, homogenize words, then quantify each word
        var hashCOW = {};       //hashCOW = hash Co-Occurring Words
        for (var i of arrSentI) {
            var sentWords = this.arrSents[i].toLowerCase().split(' ');
            for (var eachWord of sentWords)
                (eachWord in hashCOW)? hashCOW[eachWord] += 1 : hashCOW[eachWord] = 1;
        }

        //apply threshold
        hashCOW = this.applyThreshold(hashCOW, this.thresFreq);

        return hashCOW;
    },

    applyThreshold: function(obj, threshold) {
        //VAR: obj = hash where key = anything, value = integer. Usually this will be a hash recording co-occurring (key) & how often each word occurs (value), so this function will remove co-occurring words that occur <= threshold.
        //METHOD: returns object that only contains phrases about a threshold value
        for (var w in obj)
            if (obj[w] <= threshold)
                delete obj[w];

        return obj;
    },

    matchAllWords: function(arrWords) {
        //VAR: arrWords = array of words
        //METHOD: returns all sentence indices that contains all words in array 'arrWords'
        //record all sentence indices
        var arrMatches = [];
        for ( var i = 0; i < this.arrSents.length; i++ )
            arrMatches.push(i);

        //find all sentence indices that contain each word
        for (var word of arrWords) {
            //find sentence indices in 'arrMatches' that contain 'word'
            var newMatches = [];
            var regEx = new RegExp(word, 'i');
            for ( var i of arrMatches )
                if ( this.arrSents[i].search( regEx ) > -1 )
                    newMatches.push(i);

            //record matches as to search again in the next loop
            arrMatches = newMatches;
        }

        return arrMatches;
    },

    betweenWords: function(index, wordA, wordB) {
        //VAR: index = index of sentence in this.arrSents
        //VAR: wordA & wordB = strings that will be the words used to find words in between 
        //METHOD: finds the words in between 2 words. Assumes that the index contains both words
        
        //TEST::
        console.log("betweenWords: wordA = ", wordA, " & wordB = ", wordB);


        //split sentence into individual words & find position of wordA & wordB
        var sentWords = this.arrSents[index].toLowerCase().split(' ');
        var posA = sentWords.indexOf( wordA.toLowerCase() );
        var posB = sentWords.indexOf( wordB.toLowerCase() );
        var posRange = [posA, posB].sort( function(a, b) { return a - b; } );

        //extract words & turn into a string
        var arrSub = sentWords.slice( posRange[0], posRange[1] + 1 );

        return arrSub.join(' ');
    },

    allBetweenWords: function(wordA, wordB) {
        //METHOD: retrieves all words between string 'wordA' & 'wordB' from all sentences
        //find all sentences that contain all words in 
        var arrWords = [wordA, wordB];
        var arrMatches = this.matchAllWords(arrWords);

        //retrieve all between words
        var allBetweens = [];
        for (var i of arrMatches)
            allBetweens.push( this.betweenWords(i, wordA, wordB) );

        return allBetweens;
    },
}