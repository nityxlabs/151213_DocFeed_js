//PhraseWords.js//
/*
REQUIRMENTS:
classStemmer.js
*/

var commonWordsText = "the,be,to,of,and,a,in,that,have,I,it,for,not,on,with,he,as,you,do,does,at,this,but,his,by,from,they,we,say,her,she,or,an,will,my,one,all,would,there,their,what,so,up,out,if,about,who,get,which,go,me,when,make,can,like,time,no,just,him,know,take,people,into,year,your,good,some,could,them,see,other,than,then,now,look,only,come,its,over,think,also,back,after,use,two,what,when,where,why,how,our,well,way,even,new,want,because,any,these,give,day,most,us,time,person,year,way,day,thing,man,world,life,hand,part,number,fact,be,have,do,say,said,get,make,go,know,take,see,come,look,want,give,use,find,tell,ask,seem,feel,try,leave,call,good,new,first,last,long,great,little,own,other,old,right,big,high,different,such,next,early,young,important,few,public,bad,same,able,was,were,is,are,has,have,it,those,had,did,run,ran,between,within,more,less,across,been,require,requires,however,where,whereas,though,although,furthermore,moreover,show,both,according,accordingly,begin,begun,determine,yet,many,often,may,might,et,al,must,during,meanwhile,while,upon";
var arrCW = commonWordsText.split(',');


function PhraseWords(phraseLen, thresFreq) {
    this.phraseLen = parseInt( phraseLen );
    this.thresFreq = parseInt( thresFreq );
}

PhraseWords.stemDoc = function( text, sentThres, stemMinLen, minSimThres ) {
    //VAR: text = document that will be converted into a string
    //VAR: sentThres = integer that is the minimum sentence character length to be considered a true sentence
    //VAR: stemMinLen = integer that is the minimum character length for a string to be considered a stem
    //VAR: minSimThres = integer that is minimum percentage similarity for 2 strings to be considered similar
    //METHOD: converts the document as a stem but preserves all common words
    // var sentThres = 20;             //this is the minimum sentence character length to be considered a true sentence
    // var stemMinLen = 2;         //the minimum character length for a string to be considered a stem
    // var minSimThres = 0.9;      //minimum percentage similarity for 2 strings to be considered similar

    //retrieve document & split into full sentences
    var objDoc = new FullSent( text, sentThres );

    var objStem = new classStemmer( text, stemMinLen, minSimThres );
    return objStem.docWordToStem( objDoc.arrCompSent, true );     //true = includes common words, false = does not include common words
}

PhraseWords.prototype = {
    constructor: PhraseWords,

    phraseFreq: function(text) {
        //VAR: text = string that will be split into individual words. NOTE: it would be useful to use function 'PhraseWords.stemDoc()' because this will allow to find words that match the same stem
        //VAR: phraseLen = integer that is the length of the phrase
        //METHOD: quantifies each phrase in the document
        var hashPhraseFreq = {};

        //split document into individual words
        var arrWords = this.splitDoc( text );

        //quantify phrase words
        //NOTE: in "for ( var i in arrWords )", i is not an integer but a string
        for ( var i = 0; i < arrWords.length; i++ ) {
            //do not want access indices past the length of the array 
            if ( arrWords.length - i < this.phraseLen )
                break;

            //create phrase & record phrase
            var phrase = this.retrievePhrase(i, arrWords);
            //if phrase contains a common word, then do not record
            if ( this.commonWordPresent(phrase) )
                continue;

            (phrase in hashPhraseFreq)? hashPhraseFreq[phrase] += 1 : hashPhraseFreq[phrase] = 1; 
        }

        //apply threshold
        hashPhraseFreq = this.applyThreshold(hashPhraseFreq, this.thresFreq);

        //sort hash
        hashPhraseFreq = objSortByVal(hashPhraseFreq, true);

        return hashPhraseFreq;
    },

    retrievePhrase: function(index, arrWords) {
        //METHOD: create the phrase of length 
        var phrase = "";
        for ( var a = 0; a < this.phraseLen; a++ )
            phrase += arrWords[index + a] + ' ';
        
        return phrase.trim();
    },

    commonWordPresent: function(strPhrase) {
        //METHOD: checks if a phrase contains one of the common words
        var arrPhrase = strPhrase.split(' ');
        for ( var i in arrPhrase )
            if ( arrCW.indexOf( arrPhrase[i].toLowerCase() ) > -1 )
                return true;

        //if no common words found, then return false
        return false;
    },

    applyThreshold: function(obj, threshold) {
        //VAR: obj = hash where key = anything, value = integer. Usually this will be a hash recording phrases (key) & how often each phrase occurs (value), so this function will remove phrases that occur <= threshold.
        //METHOD: returns object that only contains phrases about a threshold value
        for (var w in obj)
            if (obj[w] <= threshold)
                delete obj[w];

        return obj;
    },

    splitDoc: function(text) {
        //METHOD: splits document into individual words
        //homogenize text (make text all lower case & remove non-words), split words, remove blanks & trim each word
        var text2 = this.homogenizeText( text );
        var arrWords = text2.split( /\s/ ).removeBlanks();
        arrWords = arrWords.map( function(w) { return w.trim(); } );

        return arrWords;
    },

    removeNonWords: function(text) {
        //METHOD: removes all non-word characters from string
        return text.replace( /[\W]/g, ' ' );           //removes non-word characters
    },

    removeMultiBlanks: function(text) {
        //METHOD: replace multiple blanks with single blanks
        return text.replace( /\s+/g, ' ' );
    },

    homogenizeText: function(text) {
        //METHOD: homogenize text by making everything lowercase & removing non-word characters
        text = text.toLowerCase();
        return this.removeNonWords(text);
    },
}

// Array.prototype.removeBlanks = function() {
//     //METHOD: removes blank elements
//     return this.map( function(x) {
//         if ( /\S/.test(x) )
//             return x;
//     } ).filter( function(x) { return x; } );        //filter out elements that are undefined
// }

//defining Array.prototype.removeBlanks using Object.defineProperty hides it from being accessed in an array when traversing array
Object.defineProperty( Array.prototype, 'removeBlanks', {
    value: function() {
        return this.map( function(x) {
            if ( /\S/.test(x) )
                return x;
        } ).filter( function(x) { return x; } );
    },
    enumerable: false,
    configurable: false,
    writable: false,
});

function arrayRemoveBlanks(arr) {
    return arr.map( function(x) {
        if (/\S/.test(x) )
            return x;
    } ).filter( function(x) { return x; } );        //filter out elements that are undefined
}

//OBJECT HASH FUNCTION: SORT - these functions will sort objects
function objSortByValKeysOnly(getObj, boolGtoL) {
    //VAR: getObj = object that has keys & values
    //VAR: boolGtoL (boolean Greatest to Least) = boolean that, if true, will sort getObj from greatest to least. Else, if false, will sort getObj from least to greatest
    //METHOD: this function will sort an object by its value and return the sorted object
    //OUTPUT: will return an array of keys sorted by the value

    //STEP: sort object & retrieve keys
    if(boolGtoL)
        var arrKeysSorted = Object.keys(getObj).sort( function(a, b) { return getObj[b] - getObj[a] } );      //sort by value from greatest to least
    else
        var arrKeysSorted = Object.keys(getObj).sort( function(a, b) { return getObj[a] - getObj[b] } );      //sort by value from least to greatest

    return arrKeysSorted;
}

function objSortByVal(getObj, boolGtoL) {
    //VAR: getObj = object that has keys & values
    //VAR: boolGtoL (boolean Greatest to Least) = boolean that, if true, will sort getObj from greatest to least. Else, if false, will sort getObj from least to greatest
    //METHOD: this function will sort an object by its value and return the sorted object

    //STEP: sort object & retrieve keys
    var arrKeysSorted = objSortByValKeysOnly(getObj,boolGtoL);

    //STEP: insert object values into new sorted key
    var objSorted = {};
    for ( var k in arrKeysSorted )
        objSorted[arrKeysSorted[k]] = getObj[arrKeysSorted[k]];

    return objSorted;
}

function objSortByKeyKeysOnly(getObj, boolGtoL) {
    //VAR: getObj = object that has keys & values
    //VAR: boolGtoL (boolean Greatest to Least) = boolean that, if true, will sort getObj from greatest to least. Else, if false, will sort getObj from least to greatest
    //METHOD: this function will sort an object by its key and return the sorted object
    //OUTPUT: will return an array of keys sorted by the key

    //sort object & retrieve keys
    if (boolGtoL)
        var arrKeysSorted = Object.keys(getObj).sort(function(a,b){return b-a});     //sort by value from greatest to least
    else
        var arrKeysSorted = Object.keys(getObj).sort(function(a,b){return a-b});     //sort by value from least to greatest

    return arrKeysSorted;
}

function objSortByKey(getObj, boolGtoL) {
    //VAR: getObj = object that has keys & values
    //VAR: boolGtoL (boolean Greatest to Least) = boolean that, if true, will sort getObj from greatest to least. Else, if false, will sort getObj from least to greatest
    //METHOD: this function will sort an object by its key and return the sorted object

    //STEP: sort object & retrieve keys
    var arrKeysSorted = objortByKeyKeysOnly(getObj,boolGtoL);

    //STEP: insert object values into new sorted key
    var objSorted = {};
    for ( var k in arrKeysSorted )
        objSorted[arrKeysSorted[k]] = getObj[arrKeysSorted[k]];

    return objSorted;
}

