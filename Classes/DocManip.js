//CLASS 4 - DocManip//
/*
REQUIRMENTS:
-
*/

var commonWordsText = "the,be,to,of,and,a,in,that,have,I,it,for,not,on,with,he,as,you,do,does,at,this,but,his,by,from,they,we,say,her,she,or,an,will,my,one,all,would,there,their,what,so,up,out,if,about,who,get,which,go,me,when,make,can,like,time,no,just,him,know,take,people,into,year,your,good,some,could,them,see,other,than,then,now,look,only,come,its,over,think,also,back,after,use,two,what,when,where,why,how,our,work,first,well,way,even,new,want,because,any,these,give,day,most,us,time,person,year,way,day,thing,man,world,life,hand,part,child,eye,woman,place,work,week,case,point,government,company,number,fact,be,have,do,say,says,said,get,make,go,know,take,see,come,think,look,want,give,use,find,tell,ask,work,seem,feel,try,leave,call,good,new,first,last,long,great,little,own,other,old,right,big,high,different,small,large,such,next,early,young,important,few,public,bad,same,able,was,were,is,are,has,have,it,those,had,did,run,ran,between,within,more,less,across,been,require,requires,however,where,whereas,though,although,furthermore,moreover,show,both,according,accordingly,begin,begun,determine,yet,many,often,may,might,et,al,must,during,include,includes,exclude,excludes,meanwhile,sent,send,sends,sending,while,upon,work,working,put,puts";


function DocManip() {}

//set_array_cw = set array common words
DocManip.set_array_cw = function() { return commonWordsText.split( "," ); }

//Also present in class SearchWord
DocManip.check_asterisks = function( getWord ) {
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

    return [ frontStar, endStar ];
}

//Also present in class SearchWord
DocManip.format_search = function( getWord, modifier ) {
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
    var starStat = DocManip.check_asterisks( getWord );
    if( starStat[0] )
        formatWord = formatWord.substring( cCLen + 1 );

    if( starStat[1] )
        formatWord = formatWord.substring( 0, formatWord.length - cCLen - 1 );

    return formatWord;
}

DocManip.prototype = {
    constructor: DocManip,

    homogenize_text: function( getText ) {
        getText = getText.toLowerCase();
        getText = this.remove_punct( getText )

        return getText;
    },

    remove_punct: function( getText ) {
        //METHOD: this function will remove punctuations by replacing punctuations with blanks
        getText = getText.replace( /[\W]/g, " " );           //removes non-word characters
        return getText;
    },

   remove_punct_letters: function ( str ) {
        //str = str.replace(/[\W,\s]/g," ");
        str = str.replace(/[\W]/g," ");           //removes non-word characters
        str = str.replace(/\b[a-z]\b/gi," ");     //removes single letters
        str = strTools_removeSingleDigits(str);   //remove single digits from string
        return str;
    },

    process_text: function( getText ) {
        //METHOD: processes text by homogenizing text
        getText = getText.toLowerCase();
        getText = remove_punct_letters( getText );
        getText = remove_cw( getText );

        return getText;
    },

    doc_words: function( docText, boolRmCW ) {
        //VAR: docText = string that is the document of interest
        //VAR: boolRmCW (boolean Remove Common Words) = boolean that, if true, will remove the common words from docText, else will keep the common words
        //METHOD: this function will return all individual words in the document. Also, this will split compound words or words with non-word characters (e.g. words with hyphens, apostrophes, etc.)
        //OUTPUT: this function will output an array with all the words in the document.

        //STEP: homogenize text (e.g. make all lettering lowercase)
        docText = this.homogenize_text( docText );

        //STEP: if boolRmCW is true, then remove common words
        if(boolRmCW)
            docText = this.remove_cw( docText );

        //STEP: remove all the non-word characters (regExp_NWC_EWS) and then split the document into individual words
        var regExp_NWC_EWS = /[^\w\s]/g;                  //regExp_NWC_EWS (Non-word characters Except White Spaces) = this detects all non-word characters via not considering word characters (\w) nor blank spaces (\s)
        // var newText = docText.replace(regExp_NWC_EWS,"");      //NOTE: I don't think I need to do this after using function "strTools_homogenize_textV0"
        var arrWords = docText.split( " " );
        arrWords = arrWords.filter( function( i ) { return i != undefined; } );
        arrWords = arr_rm_dup(arrWords);
        // arrWords = arrTools_removeBlanks(arrWords);

        return arrWords;
    },

    remove_cw: function(getText) {
        //METHOD: this function will remove all common words (recorded in listCW = list Common Words) from string "getText" and return get text with words removed
        var modifiers = "gi";
        var listCW = DocManip.set_array_cw();
        for (var x in listCW) { getText = this.remove(getText, listCW[x], modifiers); }

        return getText;
    },

    remove: function(fullStr, strRM, modifiers) {
        //VARS: fullStr = larger string where smaller string "strRM" will be removed from "fullStr"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
        //METHOD: this function will remove a string "strRM" from a larger string "fullStr"

        //STEP: format the word to either search for the whole word unless there are "*" present
        // strRM = escapeRegExp(strRM);           //escape all characters that need to be escaped before creating new RegExp element
        var formatWord = DocManip.format_search( strRM, "\\b" );
        //STEP: create regular expression and search for word & remove string "strRM" from "fullStr"

        var reSearchStr = new RegExp( formatWord, modifiers );
        fullStr = fullStr.replace( reSearchStr, "" );

        // console.log("strTools_removeStr 99 = "+fullStr);
        
        return fullStr;
    }
}