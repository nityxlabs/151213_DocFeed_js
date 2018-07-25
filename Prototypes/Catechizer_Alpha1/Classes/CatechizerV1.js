function catechizer_v1( arrSents ) {
    //retrieve all sentences
    this.arrSents = arrSents;

    //record each category for questions & words
    this.hashQuestions = {};
    this.hashQuestions["what_before"] = "is,are,was,can,has,cause,causing,causation";     //word in question is before (e.g. A tuxedo is, Lobsters are, The virus causes)
    this.hashQuestions["what_after"] = "such as,for instance,for example";        //word in question is are (e.g. brain processes such as..., animals in the wild, for instance...)
    this.hashQuestions["when_num"] = "before,after,during,am,pm,at,for,by,until,till,around";
    
    //record sentence indices
    this.sentWhat = [];
}

catechizer_v1.prototype = {
    constructor: catechizer_v1,

    return_matches: function( sent, arrWords ) {
        //see if any words are found in sent
        var wordMatch = null;
        for ( var i in arrWords ) {
            var regExpWord = new RegExp( "\\b" + arrWords[ i ] + "\\b", "i" );
            if ( sent.match( regExpWord ) ) {
                wordMatch = arrWords[i];
                break;
            }
        }

        return wordMatch;
    },

    find_what: function() {
        //METHOD: finds sentences that could potentially answer the question "what"

        //go through all sentences and find words associated with question "what"
        var arrSentWhat = [];
        var arrWhat = this.hashQuestions[ "what_before" ].split( "," );
        for (var i in this.arrSents) {
            //see if there is a word match, and if so record the sentence index & the word match
            var wordMatch = this.return_matches( this.arrSents[ i ], arrWhat );
            if (wordMatch)
                arrSentWhat.push([i, wordMatch]);     //format: [0] = sent index, [1] = question word found in sentence
        }

        this.sentWhat = arrSentWhat;
        // return arrSentWhat;
    },

    phrase_what: function() {
        //METHOD: will phrase "what" questions

        //go through each recorded 
        for (var i in this.sentWhat) {
            //split each sentence by word found
            var sentI = this.sentWhat[i][0];
            var wordSplit = this.sentWhat[i][1];
            var regExpSplit = new RegExp( "\\b" + this.sentWhat[i][1] + "\\b", "i" );
            var arrSplit = this.arrSents[sentI].split(regExpSplit);

            //TEST::
            var dispSplitSent = arrTools_showArr_ConsoleLog( arrSplit );
            console.log( i + " - WHAT: wordSplit = " + wordSplit + " & arrSplit = "+ dispSplitSent );
        }
    },
}


/* Functions for searching multiple words */
function multiRegExp (arrWords, specialChar, flags) {
    //VAR: arrWords = array of words that will be turned into regular expression
    //VAR: specialChar = character that will be added to both ends of word, such as "\\b" (word boundary)
    //VAR: flag = flags for regular expression, such as "g", "i", "gi"
    //METHOD: returns each word in array "arrWords" as a regular expression
    return arrWords.map(function(word){ return new RegExp(specialChar + word + specialChar, flags); });
}

String.prototype.searchOrder = function (arrWords) {
    //VAR: str = string that will be searched for words
    //VAR: arrWords = array of words. This will be used to see if words in "str" have same order as this array
    //METHOD: finds words in the specific order of array "arrWords" in string "str", returns true if order is preserve, else returns false
    var str = this.toString();      //need to use .toString() as to convert the object back to a string

    if (arrWords.length == 0)
        return true;

    var strIndex = str.toLowerCase().indexOf(arrWords[0]);
    if (strIndex > -1)
        return str.substring(strIndex + 1).searchOrder(arrWords.slice(1));
    else
        return false;
}

String.prototype.searchOrderRegExp = function (arrRegExp) {
    //VAR: arrRegExp = array of regular expressions. This will be used to see if words in this.toString() have same order as this array. NOTE: Make sure regular expression does not have "/g" flag as this will require resetting regular expression's lastIndex to 0 each time for a match
    //METHOD: finds words in the specific order of array "arrRegExp" in string this.toString(), returns true if order is preserve, else returns false
    var str = this.toString();      //need to use .toString() as to convert the object back to a string

    if (arrRegExp.length == 0)
        return true;

    var match = arrRegExp[0].exec(str);
    //if not null, then continue
    if (match)
        return str.substring(match.index + 1).searchOrderRegExp(arrRegExp.slice(1));
    else
        return false;
}

//searchOD_Backup - this is a back up for function searchOD()
function searchOD_Backup (str, words, dist) {
    //searchOD = string search Order & Distance
    //VAR: str = the string that will be searched into
    //VAR: words = array of words that will be used to search within string "str"
    //VAR: dist = array (length = word.length - 1) of integers that specific the distance between words.
    //METHOD: returns true if all the words are within distance, & false if not 

    //find all instances of first element in array "words""
    var arrStr = str.toLowerCase().split(" ");
    var indices = [];
    var idx = arrStr.indexOf(words[0]);
    while (idx > -1) {
        indices.push(idx);
        idx = arrStr.indexOf(words[0], idx + 1);
    } 

    //if first word is not found, then return false
    if (indices.length == 0)
        return false;

    //begin search of all words after first word
    var bool = true;        //true as long as words found within distance
    var indices_next = indices;
    for (var i = 1; i < words.length; i++) {
        //find plausible positions where next words with distance are found
        indices_next = searchODNext(arrStr, indices_next, words[i], dist[i - 1]);
        //if not plausible positions found, break out of loop & return false
        if (indices_next.length == 0) {
            bool = false;
            break;
        }
    }

    return bool;
}

function searchOD (str, words, dist) {
    //searchOD = string search Order & Distance
    //VAR: str = the string that will be searched into
    //VAR: words = array of words that will be used to search within string "str"
    //VAR: dist = array (length = word.length - 1) of integers that specific the distance between words.
    //METHOD: returns true if all the words are within distance, & false if not 

    //find all instances of first element in array "words""
    var arrStr = str.toLowerCase().split(" ");
    var indices = [];
    var idx = arrStr.indexOf(words[0]);
    while (idx > -1) {
        indices.push(idx);
        idx = arrStr.indexOf(words[0], idx + 1);
    } 

    //if nothing found, then return false
    if (indices.length == 0)
        return false;

    //begin search of all words after first word
    var bool = true;        //true as long as words found within distance
    // var indices_next = indices;
    for (var i = 1; i < words.length; i++) {
        //find plausible positions where next words with distance are found
        var indices_next = searchODNext(arrStr, indices, words[i], dist[i - 1]);
        //if not plausible positions found, break out of loop & return false
        if (indices_next.length == 0) {
            bool = false;
            break;
        }

        //record the next set of indices for searchODNext
        indices = indices_next;
    }

    return bool;
}

function searchODNext (arrStr, indices, word, dist) {
    //VAR: arrStr = array that is a sentence that has been split into individual words
    //VAR: indices = array of indices where search for "word" will start in "arrStr"
    //VAR: word = string of word that will be searched in "arrStr"
    //VAR: dist = allowable distance between an index & word
    //METHOD: returns indices where word is within distance "dist" of indices

    var idx;        //records indices where word is found within distance "dist"
    var indices_next = [];
    for (var i of indices) {
        idx = arrStr.indexOf(word, i + 1);      //NOTE: this uses Array.indexOf, not String.indexOf
        if ((idx > -1) && ((idx - i) <= dist))
            indices_next.push(idx);
    }

    return indices_next;
}


//For Reference
// function searchOrderRecursive( str, arrWords ) {
//     //VAR: str = string that will be searched for words
//     //VAR: arrWords = array of words. This will be used to see if words in "str" have same order as this array
//     //METHOD: finds words in the specific order of array "arrWords" in string "str", returns true if order is preserve, else returns false
//     if ( arrWords.length == 0 )
//         return true;

//     var strIndex = str.toLowerCase().indexOf( arrWords[0] );
//     if ( strIndex > -1 )
//         return searchOrderRecursive( str.substring( strIndex + 1 ), arrWords.slice( 1 ) );
//     else
//         return false;
// }

// function searchOrderRecursiveV2( str, arrRegExp ) {
//     //VAR: str = string that will be searched for words
//     //VAR: arrRegExp = array of regular expressions. This will be used to see if words in "str" have same order as this array
//     //METHOD: finds words in the specific order of array "arrRegExp" in string "str", returns true if order is preserve, else returns false
//     if ( arrRegExp.length == 0 )
//         return true;

//     var match = arrRegExp[ 0 ].exec( str );
//     //if not null, then continue
//     if ( match )
//         return searchOrderRecursiveV2( str.substring( match.index + 1 ), arrRegExp.slice( 1 ) );
//     else
//         return false;
// }

/* Types of questions to ask
-who? Proper Nouns (check for capitalization)
-what? - is, are, was, can, causes/causing (e.g. X causes Y -> what does X do? What causes Y?)
    -what is X?
    -what does X do? - can, will, should, does, do, cause
        -X causes blah blah
    -what causes X?
-where? - some sort of preposition: inside, outside, under, below, over, on top, into, between, within, on (noun, on the table), in (noun), around (noun), next to, beside (noun, e.g. beside the car), from (noun), towards (article, noun), onto (article, noun)
    -don't confuse "beside" with "besides"
-when? - before, after, during, am, pm, at (#, e.g. 4pm, night, day), for (# time, e.g. 3 years), ago, on (same date or time), since, in (e.g. an hour), until, past (#), till, by (#), before (#), around (#)
-why? - because, why ( maybe the word is included ), reason??, since, as
    -why did Carmen think Destiny was getting better? - Carmen thought Destiny was getting better because she was no longer coughing.
    -why do I want another baby? - I want another baby because I want more children.
    -why does everyone win in trade? - Everyone wins in trade, because goods are reallocated in a way that increases utility to all parties involved
    -CAUTION: Is it because winning the award gives them more confidence? - why do is it?? This doesn't make sense, another reason to use non-common words
-how? - may?, by?
*/

/* Creating class
-what is the smallest thing I will be manipulating? A letter? Word? Sentence? Start with the smallest thing and make methods for that 
-for Catechizer, the smallest unit: sentence, as this is what conveys information 
*/

/* Ideas for Catechizer
-word math: perhaps there is a formulaic way or ways to convey information (e.g. X is Y means X = Y), need to find more examples
-the subject & the associated information can be separated by prepositions
    -FU Orionis star in the constellation of Orion is the prototype example
*/



/* POTENTIAL ANSWERS:
-RCW 106 is a sprawling cloud of gas and dust located about 12,000 light-years away in the southern constellation of Norma (The Carpenter's Square).
-The lower filaments are RCW 104, surrounding the Wolf-Rayet star WR 75.
-H II regions like RCW 106 are clouds of hydrogen gas that are being ionised by the intense starlight of scorching-hot, young stars, causing them to glow and display weird and wonderful shapes.
*/