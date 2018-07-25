//Class DocManip

var commonWordsText = "the,be,to,of,and,a,in,that,have,I,it,for,not,on,with,he,as,you,do,does,at,this,but,his,by,from,they,we,say,her,she,or,an,will,my,one,all,would,there,their,what,so,up,out,if,about,who,get,which,go,me,when,make,can,like,time,no,just,him,know,take,people,into,year,your,good,some,could,them,see,other,than,then,now,look,only,come,its,over,think,also,back,after,use,two,what,when,where,why,how,our,work,first,well,way,even,new,want,because,any,these,give,day,most,us,time,person,year,way,day,thing,man,world,life,hand,part,child,eye,woman,place,work,week,case,point,government,company,number,fact,be,have,do,say,said,get,make,go,know,take,see,come,think,look,want,give,use,find,tell,ask,work,seem,feel,try,leave,call,good,new,first,last,long,great,little,own,other,old,right,big,high,different,small,large,such,next,early,young,important,few,public,bad,same,able,was,were,is,are,has,have,it,those,had,did,run,ran,between,within,more,less,across,been,require,requires,however,where,whereas,though,although,furthermore,moreover,show,both,according,accordingly,begin,begun,determine,yet,many,often,may,might,et,al,must,during,include,includes,exclude,excludes,meanwhile,sent,send,sends,sending,while,upon,work,working";



function DocManip() {}


DocManip.setCommonWordsArray = function() { return commonWordsText.split( "," ); }

DocManip.prototype = {
    constructor: DocManip,

    homogenize_text: function (getText) {
        getText = getText.toLowerCase();
        getText = this.remove_punct( getText )

        return getText;
    },

    remove_punct: function (getText) {
        //METHOD: this function will remove punctuations by replacing punctuations with blanks
        getText = getText.replace( /[\W]/g, " " );           //removes non-word characters
        return getText;
    },

    remove_punct_letters: function (str) {
        //str = str.replace(/[\W,\s]/g," ");
        str = str.replace(/[\W]/g," ");           //removes non-word characters
        str = str.replace(/\b[a-z]\b/gi," ");     //removes single letters
        str = removeSingleDigits(str);   //remove single digits from string
        return str;
    },

    process_text: function (getText) {
        //METHOD: processes text by homogenizing text
        getText = getText.toLowerCase();
        getText = remove_punct_letters( getText );
        getText = remove_cw( getText );

        return getText;
    },

    doc_words: function (docText, boolRmCW) {
        //VAR: docText = string that is the document of interest
        //VAR: boolRmCW (boolean Remove Common Words) = boolean that, if true, will remove the common words from docText, else will keep the common words
        //METHOD: this function will return all individual words in the document. Also, this will split compound words or words with non-word characters (e.g. words with hyphens, apostrophes, etc.)
        //OUTPUT: this function will output an array with all the words in the document.

        //STEP: homogenize text (e.g. make all lettering lowercase)
        docText = this.homogenize_text( docText );

        //STEP: if boolRmCW is true, then remove common words
        if(boolRmCW)
            docText = remove_cw(docText);

        //STEP: remove all the non-word characters (regExp_NWC_EWS) and then split the document into individual words
        var regExp_NWC_EWS = /[^\w\s]/g;                  //regExp_NWC_EWS (Non-word characters Except White Spaces) = this detects all non-word characters via not considering word characters (\w) nor blank spaces (\s)
        // var newText = docText.replace(regExp_NWC_EWS,"");      //NOTE: I don't think I need to do this after using function "strTools_homogenize_textV0"
        var arrWords = docText.split( " " );
        arrWords = arrWords.filter( function( i ) { return i != undefined; } );
        arrWords = arr_rm_dup(arrWords);
        // arrWords = arrTools_removeBlanks(arrWords);

        return arrWords;
    },

    remove_cw: function( getText ) {
        //METHOD: this function will remove all common words (recorded in listRCW = list Remove Common WOrds) from string "getText" and return get text with words removed
        var modifiers = "gi";
        var listCW = DocManip.setCommonWordsArray();
        for( var x in listRCW ){ getText = this.remove( getText, listRCW[x], modifiers ); }

        return getText;
    },

    remove: function( fullStr, strRM, modifiers ) {
        //VARS: fullStr = larger string where smaller string "strRM" will be removed from "fullStr"; modifiers = regExp modifiers such as "g" = global, "i" = case-insensitive
        //METHOD: this function will remove a string "strRM" from a larger string "fullStr"

        //STEP: format the word to either search for the whole word unless there are "*" present
        // strRM = escapeRegExp(strRM);           //escape all characters that need to be escaped before creating new RegExp element
        var getFormattedWord = formatSearchWord( strRM, "\\b" );
        //STEP: create regular expression and search for word & remove string "strRM" from "fullStr"

        var reSearchStr = new RegExp(getFormattedWord,modifiers);
        fullStr = fullStr.replace( reSearchStr, "" );

        // console.log("strTools_removeStr 99 = "+fullStr);
        
        return fullStr;
    }
}

//SHOULD REMOVE THIS
// function strTools_retrieveDocWords( docText, boolRmCW )
// {
//     //VAR: docText = string that is the document of interest
//     //VAR: boolRmCW (boolean Remove Common Words) = boolean that, if true, will remove the common words from docText, else will keep the common words
//     //METHOD: this function will return all individual words in the document. Also, this will split compound words or words with non-word characters (e.g. words with hyphens, apostrophes, etc.)
//     //OUTPUT: this function will output an array with all the words in the document.

//     //STEP: homogenize text (e.g. make all lettering lowercase)
//     docText = strTools_homogenize_textV0(docText);

//     //STEP: if boolRmCW is true, then remove common words
//     if(boolRmCW)
//         docText = remove_cw(docText);

//     //STEP: remove all the non-word characters (regExp_NWC_EWS) and then split the document into individual words
//     var regExp_NWC_EWS = /[^\w\s]/g;                  //regExp_NWC_EWS (Non-word characters Except White Spaces) = this detects all non-word characters via not considering word characters (\w) nor blank spaces (\s)
//     // var newText = docText.replace(regExp_NWC_EWS,"");      //NOTE: I don't think I need to do this after using function "strTools_homogenize_textV0"
//     var arrWords = docText.split(" ");
//     arrWords = arr_rm_dup(arrWords);
//     arrWords = arrTools_removeBlanks(arrWords);

//     return arrWords;
// }

function removeSingleDigits(getText) {
    //METHOD: this function will remove single instances of digits within a string (i.e. number with spaces around it)
    // getText=getText.replace(/\d/g," ");                  //removes all numbers from the string
    // getText=getText.replace(/[\d]/g," ");                    //removes all numbers from the string - same as /\d/g
    // getText=getText.replace(/\d{2,3}/g," ");                 //removes all numbers from the string that occur 2 to 3 consecutive times, but not single digits
    getText=getText.replace(/\b\d\b/g," ");         //removes all numbers with spaces on both sides
    return getText;
}

function strTools_homogenize_textV0(getText)
{
    getText = getText.toLowerCase();
    getText = strTools_remove_punct(getText)

    return getText;
}

function strTools_remove_punct( getText ) {
    //METHOD: this function will remove punctuations by replacing punctuations with blanks
    return getText.replace( /[\W]/g, " " );           //removes non-word characters
}

function strTools_homogenize_text(getText)       //getText is suppose to receive normal text, not an array
{
    getText = getText.toLowerCase();
    getText = remove_punct_letters(getText);
    getText = remove_cw(getText);

    return getText;
}

function remove_punct_letters( str ) {
    //METHOD: removes non-character words, single letters, and single digits from string
    //str = str.replace(/[\W,\s]/g," ");
    str = str.replace(/[\W]/g," ");           //removes non-word characters
    str = str.replace(/\b[a-z]\b/gi," ");     //removes single letters
    str = removeSingleDigits(str);   //remove single digits from string
    return str;
}

function setCommonWordsArray()
{
    commonWordsArray = commonWordsText.split(",");

    return commonWordsArray;
}

function remove_cw(getText)
{
    //METHOD: this function will remove all common words (recorded in listRCW = list Remove Common WOrds) from string "getText" and return get text with words removed
    var modifiers = "gi";
    var listRCW = setCommonWordsArray();
    for(var x in listRCW){getText = strTools_removeStr(getText,listRCW[x],modifiers);}

    return getText;
}

function arr_rm_dup( getArr ) {
    //VARS: getArr = an array where each element contains a string
    //METHOD: this function removes multiple copies of specific value, only returning unique values in the array
    var currentVal, strCompare;
    //create new array that will hold all unique values
    var uniqArr=new Array();
    //sort array
    getArr.sort();
    for(var x in getArr)
    {
        if(x==0)
        {
            currentVal=getArr[x];
            uniqArr.push(currentVal);
        }
        else
        {
            //"localCompare" is a javascript function that compares 2 strings - str1.localeCompare(str2). 
            //"localCompare" returns -1 if str1 is sorted before str2, returns 0 if the 2 strings are equal, or returns 1 if str1 is sorted after str2 
            strCompare=currentVal.localeCompare(getArr[x]);
            if(strCompare!=0)   //means the strings are not same
            {
                currentVal=getArr[x];
                uniqArr.push(currentVal);
            }
        }
    }

    return uniqArr;
}


function strTools_orderWordsByLen(arrWords,thresVal,minThres,boolLongToShort)
{
    //VAR: arrWords= a string array that may or may not contain words
    //VAR: thresVal = the cut off value for string length
    //VAR: minThres = a value that is either -1, 0, or 1. If -1, then thresVal is the minimum string length, else if 1 then thresVal is the maximum string length, else if 0 then disregard the threshold value
    //VAR: boolLongToShort = boolean that, if true, will reverse the array to return an array from longest to shortest (as oppposed to shortest to longest)
    //METHOD: this function will order an array of words by their length from shortest to longest
    //STEP: initialize arrWordLen
    thresVal=parseInt(thresVal);
    var delim=",";
    var arrWordLen=new Array();
    //get longest word in array
    var longestWord=strTools_findLongestStrInArr(arrWords);
    //initialize each element of arrWordLen - each element will record words with length "a" - as each element will record multiple words with a specific length separated by a delimiter, each element will be exploded into an array.
    for(var a=0;a<=longestWord.length;a++){arrWordLen[a]="";}

    //STEP: record words in the array that records by length by the words respective length
    for(var b in arrWords)
    {
        var wordLen=parseInt(arrWords[b].length);
        arrWordLen[wordLen]+=arrWords[b]+""+delim;
    }

    //STEP:combine each array element then explode array by delimiter "," to make an array
    var allWordsByLen="";
    if(minThres==-1)            //this means the strings from threshold value "thresVal" to the longest word will be retrieved
    {
        for(var c=thresVal;c<=longestWord.length;c++) 
        {
            allWordsByLen+=arrWordLen[c];
        }
    }
    else if(minThres==1)        //this means the strings between 0 and threshold value "thresVal" will be retrieved
    {
        for(var c=0;c<=thresVal;c++) 
        {
            allWordsByLen+=arrWordLen[c];
        }
    }
    else    //this means that the threshold value isn't used
    {
        for(var c=0;c<=longestWord.length;c++) 
        {
            allWordsByLen+=arrWordLen[c];
        }
    }
    
    //remove the last "," so no blank elements occur
    allWordsByLen=strTools_removeLastChars(allWordsByLen,delim);

    //explode string by "," to make an array
    arrSortedByWordLen=allWordsByLen.split(delim);

    //STEP: if boolLongToShort is true, then need to reverse the array as the array has the words currently from shortest to longest
    if(boolLongToShort){arrSortedByWordLen.reverse();}

    return arrSortedByWordLen;
}