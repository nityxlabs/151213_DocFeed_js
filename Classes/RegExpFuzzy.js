//global variables
var g_delimInfo = '::';
var g_delimGroup = '>>';

//CLASS 1: StrMetric
function StrMetric(str, metric) {
    //VAR: str = string that will be split by string 'metric'
    //VAR: metric = regular expression that will dissect 'str' into individual parts based on occurrences of 'metric' in 'str'. Make sure 'g' is present as it will be used in .exec to find all positions
    //METHOD: measures string based on spaces of string 'metric'
    this.str = str;
    this.metric = metric;
    this.brackets = StrMetric.makeBrackets(str, metric);
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
            return -1;
        
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

        //TEST::
        console.log( "inRange: searchStr = ", searchStr );


        var nextIndex = searchStr.search(re);
        if (nextIndex == -1)            //nothing was found
            return nextIndex;
        else {
            var pos = this.brackets[start] + nextIndex;
            return this.getBracket(pos);
        }
    },

    extract: function (start, end) {
        //METHOD: extracts string based on start and end position
        //NOTE: to extract last word, use start = obj.brackets.length - 1, end = obj.brackets.length
        if (start == null)
            start = 0;
        if (end == null)
            end = this.brackets.length;
        
        //retrieve the first & last position
        var startPos = this.brackets[start];
        var endPos = this.brackets[end];

        return this.str.substring(startPos, endPos);
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

    //split string into each regular expression group
    this.eachReZ = [];      //records each Regular Expression and distance
    var groupReZ = reZ.split(RegExpFuzzy.delimGroup);
    for (x in groupReZ) {
        //split each group into constituents
        var elemReZ = groupReZ[x].split(RegExpFuzzy.delimInfo);     //elemReZ is array: 0 = regular expression, 1 = case-sensitivity, 2 = distance
        if (elemReZ[1] == '0')      //0 means case-insensitive, 1 means case sensitive
            var regEx = new RegExp(elemReZ[0], 'gi');     //need 'g' for RegExp.exec()
        else
            var regEx = new RegExp(elemReZ[0], 'g');      //need 'g' for RegExp.exec()

        //record the distance
        this.eachReZ.push( { 'word': regEx, 'dist': parseInt(elemReZ[2]) } );
    }
}

RegExpFuzzy.makeRegExp = function(strRegExp) {
    //VAR: strRegExp = string in the format "strA::caseSensitivityA" or "strA::caseSensitivityA::distA", but note that the distance 'distA' 
    //METHOD: turns string "strRegExp" into a regular expression

    var elemReZ = strRegExp.split(RegExpFuzzy.delimInfo);
    if (elemReZ[1] == '0')      //0 means case-insensitive, 1 means case sensitive
        return new RegExp(elemReZ[0], 'gi');     //need 'g' for RegExp.exec()
    else
        return new RegExp(elemReZ[0], 'g');      //need 'g' for RegExp.exec()
}

RegExpFuzzy.prototype = {
    constructor: RegExpFuzzy,

    searchEach: function(strMetric, regExpZ, start, dist) {
        //VAR: strMetric = strMetric object, see if any words in array "mutables" are present
        //VAR: regExpZ = regular expression that will be searched for in "strMetric"
        //VAR: start = integer that is the starting bracket in "strMetric"
        //VAR: dist = integer that is the distance from start
        //METHOD: looks for 

        var end = start + dist;
        var nextIndex = strMetric.inRange(regExpZ, start, end);

        if (nextIndex == -1)
            return false;
        else
            return nextIndex;
    },

    search: function (str) {
        //VAR: str = string that will be searched
        //METHOD: determines if all elements in 'this.regExZ' is present in string 'str'
        var strMetric = new StrMetric(str, /\s/g);

        //find all instances of first element
        var brackets = strMetric.getMultiIndex( this.eachReZ[0]['word'] );

        if (brackets.length == 0)
            return false;

        //go through each bracket, and the first instance of pattern matching, return true
        var match = false;
        var recordPos = [];
        for (var i in brackets) {
            //search to see if all word present
            var trackBrackets = [ brackets[i] ];
            trackBrackets = this.searchAll(strMetric, brackets[i], 1, trackBrackets);
            
            //if all words present, then reocrd
            if (trackBrackets != false)
                recordPos.push(trackBrackets);
            
            // if ( this.searchAll(strMetric, brackets[i], 1, trackBrackets) ) {
            //     match = true;
            //     break;
            // }
        }

        return recordPos;
    },

    searchAll: function (strMetric, start, zIndex, trackBrackets) {
        //VAR: strMetric = strMetric object, used to see if all regular expression 'this.eachReZ' is present
        //VAR: start = the starting position 
        //VAR: zIndex = for 'this.eachReZ', finding the word needed
        //VAR: trackBrackets = array that will record 
        //METHOD: determines if object 'strMetric' has all words within distance defined in this.eachReZ

        //retrieve the nearest distance, and if within range then continue search, else return false
        var end = start + this.eachReZ[zIndex]['dist'];
        var nextIndex = strMetric.inRange(this.eachReZ[zIndex]['word'], start, end);
        //OR: var nextIndex = this.searchEach(strMetric, this.eachReZ[zIndex]['word'], start, this.eachReZ[zIndex]['dist'])

        if (nextIndex == -1)
            return false;
        else if (zIndex == this.eachReZ.length - 1) {
            trackBrackets.push(nextIndex);
            return trackBrackets;
        }
        else {
            trackBrackets.push(nextIndex);
            return this.searchAll(strMetric, nextIndex, zIndex + 1, trackBrackets);
        }
    },
}


//class DiversiFuzzy: play on "Diversiform" + "RegExpFuzzy"
function DiversiFuzzy(reZ, hashCombos) {
    //VAR: reZ = string that is the format for RegExpFuzzy

    //CLASS: Extension of RegExpFuzzy that will allow to swap individual words. Play on "Diversiform"
    DiversiFuzzy.flagSwap = '@@';        //if present, then this RegExpZ can be swapped with different strings designated by a hash
    DiversiFuzzy.delimInfo = g_delimInfo;
    DiversiFuzzy.delimGroup = g_delimGroup;

}

DiversiFuzzy.allCombinations = function(hashCombos) {
    //METHOD: creates all combinations in hashCombos

}