//global variables
var g_delimInfo = '::';
var g_delimGroup = '>>';
var g_delimMultiWord = '&&';

//CLASS 1: StrMetric
function StrMetric(str, metric) {
    //VAR: str = string that will be split by string 'metric'
    //VAR: metric = regular expression that will dissect 'str' into individual parts based on occurrences of 'metric' in 'str'. Make sure 'g' is present as it will be used in .exec to find all positions
    //METHOD: measures string based on spaces of string 'metric'
    this.str = str;
    this.metric = metric;
    this.brackets = StrMetric.makeBrackets(str, metric);    //brackets = array of string that is split up by string 'metric'
}

StrMetric.makeBrackets = function (str, metric) {
    //METHOD: splits the string into units where string 'metric' occurs within string.
    //EXAMPLE: "the car is red" & the metric is a space, then will return an array [3, 7, 10], where each number refers to position of each space
    var brackets = [];     //need zero as need starting point
    var match;

    //find all positions of the metric in the string & return
    while ( match = metric.exec(str) )
        brackets.push(match.index);

    //check if 0 is in array of position - need zero to be able to retrieve first word with method 'extract()'
    if (brackets.indexOf(0) == -1)
        brackets.unshift(0);

    return brackets;
}

StrMetric.prototype = {
    constructor: StrMetric,

    getBracket: function (num) {
        //METHOD: determine which bracket the integer 'num' belongs to
        return this.brackets.filter(function(x) { return x <= num; }).length - 1;
    },

    getIndex: function (re) {
        //VAR: re = regular expression that will be search in string
        //METHOD: retrieves the relative position 
        //find 'findStr' in this.str
        if (this.str.search(re) == -1)
            return -1;
        else
            return this.getBracket( this.str.search(re) );
    },

    getMultiIndex: function (re) {
        //VAR: re = regular expression that will search in string. NOTE: need 'g' in regular expression
        //METHOD: finds all instances of 're' in this.str, returns position brackets
        //make sure 're' is this.str
        if (this.str.search(re) == -1)
            return [];
        
        //find all instances
        var brackets = [];
        var match;
        while ( match = re.exec(this.str) )
            brackets.push( this.getBracket(match.index) ); 

        return brackets;
    },

    getNextIndex: function (re, start) {
        //VAR: re = regular expression that will search in string. NOTE: need 'g' in regular expression
        //VAR: start = the starting bracket in this.brackets
        //METHOD: finds the first occurrence of 're' after the start position

        //extract string, find position, and then find new bracket
        var searchStr = this.extract(start, null);
        var nextIndex = searchStr.search(re);
        if (nextIndex == -1)            //nothing was found
            return nextIndex;
        else {
            var pos = this.brackets[start] + nextIndex;
            return this.getBracket(pos);
        }
    },

    inRange: function (re, start, end) {
        //VAR: re = regular expression that will search in string. NOTE: need 'g' in regular expression
        //VAR: start = the starting bracket in this.brackets
        //METHOD: see if 're' exists with range start & end
        //NOTE: this function is very similar to 'getNextIndex', difference is this has an end point
        //NOTE: this is important regular expressions with special characters, such as '?'

        //extract string, find position, and then find new bracket
        var searchStr = this.extract(start, end);
        var nextIndex = searchStr.search(re);
        if (nextIndex == -1)            //nothing was found
            return nextIndex;
        else {
            var pos = this.brackets[start] + nextIndex;
            return this.getBracket(pos);
        }
    },

    extract: function (start, end) {
        //METHOD: extracts string based on start bracket index and end bracket index
        //NOTE: to extract last word, use start = obj.brackets.length - 1, end = obj.brackets.length
        if (start == null)
            start = 0;
        if (end == null)
            end = this.brackets.length;
        
        //retrieve the first & last position - if 'start' or 'end' is out of range, then returns 'undefined', and substring will return entire string
        var startPos = this.brackets[start];
        var endPos = this.brackets[end];

        return this.str.substring(startPos, endPos); 
    },

    highlightSubstr: function (bracketI) {
        //VAR: bracketI = array of indices for property 'brackets', refers to the positions within the string that will be manipulated
        //METHOD: returns string that higlights substring as well as individual words

        //retrieve region of words to highlight, and highlight individual words
        var liteStr = "<span style = 'background-color: hsla(189, 96%, 26%, 1.0); padding: 3px; border-radius: 3px;'>";
        for (var i = bracketI[0]; i <= bracketI.slice(-1)[0]; i++) {

            if (bracketI.indexOf(i) > -1) {
                liteStr += "<span style = 'background-color: hsla(259, 96%, 40%, 1.0); padding: 1px; border-radius: 2px;'>";
                liteStr += this.extract(i, i + 1) + "</span>";
                // liteStr += this.str.substring( this.brackets[i] + 1, this.brackets[i + 1] ) + "</span>";
            }
            else {
                liteStr += this.extract(i, i + 1);
                // liteStr += this.str.substring( this.brackets[i] + 1, this.brackets[i + 1] )
            }
        }
        liteStr += "</span>";       //ending of highlighted sentence

        return liteStr;
    },

    highlightStr: function (bracketI) {
        //VAR: bracketI = array of indices for property 'brackets', refers to the positions within the string that will be manipulated
        //METHOD: highlights substring in this.brackets & returns a highlighted string

        //retrieve string before & after range in 'bracketI'
        var startStr = this.str.substring( this.brackets[0], this.brackets[ bracketI[0] ] + 1 );    //+1 needed to include
        var endStr = this.str.substring( this.brackets[ bracketI.slice(-1)[0] + 1 ], this.brackets.slice(-1)[0] );

        //retrieve region of words to highlight, and highlight individual words
        var liteStr = this.highlightSubstr(bracketI);

        return startStr + liteStr + endStr;
    },
}


//CLASS 2: RegExpFuzzy
function escapeRegExp(str) {
    //METHOD: this function will return a string where all escapable characters will be escaped, so then it can be used with "new RegExp"
    //SOURCE: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    // return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>\:\"\'\=\!\/]/g, "\\$&");
}


function RegExpFuzzy(reZ) {
    //VAR: reZ = string that is the format for RegExpFuzzy
    //CLASS: class that will allow to make more complex regular expression elements
    
    // Format v1 = strA:caseSensitivityA:distA>strB:caseSensitivityB:distB>strC:caseSensitivityC:distC
    // -str should be in able to created into RegExp object (e.g. blah{1,3}, ^q, s%)
    // -case sensitivity should be 0 for false & 1 for true
    // -dist = distance between the current string and the next string. The distance will be determined by splitting a string into individual words
    // -NOTE: the first character does not need a distance, so just input 0 for distance
    // -Example: \bcar\b:1:4>\bferrari\b:0:3>\bfast:1:1>?s:0:3
    RegExpFuzzy.delimInfo = g_delimInfo;
    RegExpFuzzy.delimGroup = g_delimGroup;
    RegExpFuzzy.delimMW = g_delimMultiWord;

    //split string into each regular expression group
    this.eachReZ = [];      //records each Regular Expression and distance
    var groupReZ = reZ.split(RegExpFuzzy.delimGroup);
    for (x in groupReZ) {
        var makeReZ = RegExpFuzzy.makeRegExp( groupReZ[x] );
        this.eachReZ.push( makeReZ );
    }

    //TEST:: console.log( "this.eachReZ = ", this.eachReZ );
}

RegExpFuzzy.makeRegExp = function(strRegExpZ) {
    //VAR: strRegExp = string in the format "strA::caseSensitivityA" or "strA::caseSensitivityA::distA", but note that the distance 'distA' 
    //METHOD: turns string "strRegExp" into a regular expression

    //split string into individual elements
    var elemReZ = strRegExpZ.split(RegExpFuzzy.delimInfo);

    //0 means case-insensitive, 1 means case sensitive
    var flag;
    (elemReZ[1] == '0') ? flag = 'gi' : flag = 'g';

    //check if first string is multiple strings
    var regEx = [];
    if ( elemReZ[0].includes(RegExpFuzzy.delimMW) ) {
        //split into an array
        var arrWords = elemReZ[0].split(RegExpFuzzy.delimMW);
        for (var w in arrWords)
            regEx.push( new RegExp(arrWords[w], flag) );     //need 'g' for RegExp.exec()           
    }
    else
        regEx.push( new RegExp(elemReZ[0], flag) );     //need 'g' for RegExp.exec()

    //record the distance
    return { 'listZ': regEx, 'dist': parseInt(elemReZ[2]) };
}

RegExpFuzzy.prototype = {
    constructor: RegExpFuzzy,

    //METHODS: check if all strings present, regardless of distance
    eachPresent: function (eachZ, str) {
        //METHOD: returns true when the first instance
        //go through each word to see if any words are present - return true if word found
        for ( var regExZ of eachZ['listZ'] ) {
            if ( regExZ.test(str) )
                return true;
        }

        //return false if string is not found
        return false;
    },

    allPresent: function (str) {
        //METHOD: checks if all elements in this.eachReZ are present, regardless of distance
        for ( var eachZ of this.eachReZ ) {
            //check if word present
            if ( !( this.eachPresent(eachZ, str) ) )
                return false;
        }

        return true;
    },

    //METHODS: check if all strings present by using distance
    search: function (str) {
        //VAR: str = string that will be searched
        //METHOD: determines if all elements in 'this.regExZ' is present in string 'str'
        var strMetric = new StrMetric(str, /\s/g);

        //QUES: is it possible to combine the first word in the search for all the words
        //find all instances of first element - need to consider all start positions
        var brackets = this.searchInitial( strMetric, this.eachReZ[0]['listZ'] );
        if (brackets.length == 0)
            return false;

        //if only one element in listZ, then return result
        if (this.eachReZ.length == 1)
            return brackets;

        //go through each bracket, and the first instance of pattern matching, return true
        var match = false;
        var allBrackets = [];     //array of arrays, where each element is an array of brackets where word is found
        for (var i in brackets) {
            //search to see if all word present
            var trackBrackets = [ brackets[i] ];
            trackBrackets = this.searchAll(strMetric, 1, brackets[i] + 1, trackBrackets);

            //if all words present, then record
            if (trackBrackets != false)
                allBrackets.push(trackBrackets);
        }

        return allBrackets;
    },

    searchInitial: function (strMetric, listZ) {
        //VAR: strMetric = strMetric object that will be searched
        //VAR: listZ = array of regular expression elements
        //METHOD: finds the brackets containing all words in 'listZ'
        var brackets = [];
        for (var wordZ of listZ) {
            //if results found, then insert into brackets
            var getBrackets = strMetric.getMultiIndex( wordZ );
            if (getBrackets.length > 0)
                brackets.push.apply( brackets, getBrackets );
        }

        return brackets;
    },

    searchEach: function (strMetric, regExpZ, start, dist) {
        //VAR: strMetric = strMetric object, see if any words in array "mutables" are present
        //VAR: regExpZ = array of regular expressions that will be searched for in "strMetric"
        //VAR: start = integer that is the starting bracket in "strMetric"
        //VAR: dist = integer that is the distance from start
        //METHOD: see if any of the regular expressions in regExpZ is present in strMetric
        var end = start + dist;

        //record positions found in strMetric
        var brackets = [];
        for (var i in regExpZ) {
            var nextIndex = strMetric.inRange(regExpZ[i], start, end);
            if (nextIndex != -1)
                brackets.push(nextIndex);
        }

        return brackets;
    },

    searchAll: function (strMetric, zIndex, start, trackBrackets) {
        //VAR: strMetric = strMetric object, used to see if all regular expression 'this.eachReZ' is present
        //VAR: start = the starting position 
        //VAR: zIndex = for 'this.eachReZ', finding the word needed
        //VAR: trackBrackets = array that will record 
        //METHOD: determines if object 'strMetric' has all words within distance defined in this.eachReZ

        //retrieve the nearest distance, and if within range then continue search, else return false
        var nextBrackets = this.searchEach( strMetric, this.eachReZ[zIndex]['listZ'], start, this.eachReZ[zIndex]['dist'] );

        //check if any sentence indices found in nextBrackets
        if (nextBrackets.length == 0)       //means no words found
            return false;
        else if (zIndex == this.eachReZ.length - 1) {
            //append next brackets found and return results
            trackBrackets.push.apply(trackBrackets, nextBrackets);
            return trackBrackets;
        }
        else {
            //append next brackets found
            trackBrackets.push.apply(trackBrackets, nextBrackets);
            
            //find the max bracket to start the next round of searches
            var maxBracket = Math.max.apply(null, trackBrackets);
            return this.searchAll(strMetric, zIndex + 1, maxBracket + 1, trackBrackets);
        }
    },
}


//class DiversiFuzzy: play on "Diversiform" + "RegExpFuzzy"
function DiversiFuzzy() {
    //CLASS: Extension of RegExpFuzzy that will allow to swap individual words. Play on "Diversiform" 
}

DiversiFuzzy.flagSwapGen = '@@';        //if present, then this RegExpZ can be swapped with different strings designated by a hash. Format: @@key>>
DiversiFuzzy.flagSwapWord = '@@@';      //will only replace the word, format: @@key::case_sensitive::distance, only @@key will be replace
DiversiFuzzy.delimInfo = g_delimInfo;
DiversiFuzzy.delimGroup = g_delimGroup;

DiversiFuzzy.removeFlags = function(strReZ) {
    //remove all keys
    var flagRegExp = /@[\w\d]*>>/g;        //the "@@" should be the same as DiversiFuzzy.flagSwap = '@@';
    return strReZ.replace(flagRegExp, '');
}

DiversiFuzzy.removeFlags = function(strReZ) {
    //METHOD: removes all replacement elements (i.e. @@key, @@@key)
    var flagRegExp = /@{1,}[\w\d\:]*>>/g;     //remove replacement elements that occur within body of regExpZ string
    var flagRegExpEnd = />>@{1,}[\w\d\:]*$/g;       //removes replacement elements that occur at end of regExpZ string
    
    var newStrReZ = strReZ.replace(flagRegExp, '');
    return newStrReZ.replace(flagRegExpEnd, '');
}

//METHODS: insert string into placeholders '@@key'
DiversiFuzzy.insertAllReZ = function(strReZ, transposons, swapType) {
    //VAR: strReZ = string that is the format for RegExpFuzzy that contains '@@' that will be replaced by values in 'transposons'
    //VAR: transposons = hash that exchanges '@@' for respective elements, where key = string that is present in strReZ in format '@@key', value = array of values that will substitute their respective '@@key'
    //VAR: swapType = integer that will replace flag placeholders '@@' (general replacement) or '@@@' (specific replacement)
    //METHOD: substitutes values associated with each key in RegExpFuzzy string 'strReZ'
    var saveReZ = [strReZ];
    for (var key in transposons) {
        var tempReZ = DiversiFuzzy.insertMultiReZ(saveReZ, key, transposons[key], swapType);
        saveReZ = tempReZ;
    }

    return saveReZ;
}

DiversiFuzzy.insertMultiReZ = function(allReZ, key, values, swapType) {
    //VAR: allReZ = array of all RegExpFuzzy strings that contain '@@' elements, including '@@key'
    //VAR: key = string that will replace elements '@@key' in each RegExpFuzzy string in 'allReZ'
    //VAR: values = array that contains values that will substitute '@@key'
    //METHOD: add each value where the key exists in each element in 'allReZ'
    //create new ReZ copy for each element in 'values'
    var saveReZ = [];
    for (var eachReZ of allReZ)
        saveReZ.push.apply( saveReZ, DiversiFuzzy.insertSingleReZ(eachReZ, key, values, swapType) );
    
    return saveReZ;
}

DiversiFuzzy.insertSingleReZ = function(eachReZ, key, values, swapType) {
    //VAR: RegExpFuzzy string that contain '@@' elements, including '@@key', if doesn't contain '@@key' then it will not modified
    //VAR: key = string that will replace elements '@@key' in each RegExpFuzzy string in 'allReZ'
    //VAR: values = array that contains values that will substitute '@@key'
    //METHOD: will insert all elements in array 'values' into position in string '@@key' in RegExpFuzzy string 'eachReZ'
    var saveReZ = [];
    // var strFlag = DiversiFuzzy.flagSwap + "" + key; 
    var strFlag; 
    (swapType == 1)? strFlag = DiversiFuzzy.flagSwapGen + "" + key : strFlag = DiversiFuzzy.flagSwapWord + "" + key
    //if flag doesn't exist, then do not make modified copies of eachReZ
    if ( !eachReZ.includes(strFlag) )
        return [eachReZ];

    for (var v of values) {
        var newReZ = eachReZ.replace(strFlag, v);
        saveReZ.push(newReZ);
    }

    return saveReZ;
}
