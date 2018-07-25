/*
Requirements
-requires RegExpFuzzyV2.js - StrMetric, RegExpFuzzy, DiversiFuzzy
*/

/*
Regular Expression tricks for RegExpFuzzy
-\\Ss\\b = finds words that end in s
*/

//qK = questionKeys
qK = {};
qK["what_is"] = [];
qK["what_is"].push( "@@@x::0::0>>\\bis\\b|\\bwas\\b::0::1>>\\ba\\b|\\ban\\b|\\bthe\\b|\\bwhen\\b|\\bany\\b::0::1" );      //x is\was a\the
qK["what_is"].push( "@@@x::0::0>>\\bis\\b|\\bwas\\b::0::1>>\\bdefined\\b|\\bdescribed\\b::0::1>>\\bas\\b|\\bby\\b::0::1" );      //x is\was a\the
// qK["what_is"].push( "@@@x::0::0>>\\bis\\b&&\\bwas\\b::0::1>>\\ba\\b&&\\ban\\b&&\\bthe\\b::0::1" );      //x is\was a\the
qK["what_is"].push( "@@@x::0::0>>\\bare\\b::0::1>>\\Ss\\b::0::2" );      //x are [word]s
qK["what_is"].push( "@@@x::0::0>>\\bis\\b|\\bare\\b|\\bwere\\b::0::1>>\\blike\\b::0::1" );      //x is|are like
qK["what_is"].push( "@@@x::0::0>>\\bcan\\b::0::1>>\\bbe\\b::0::1>>\\bdefined\\b|\\bdescribed\\b::0::2" );      //x is|are like
qK["what_is"].push( "\\bcalled\\b::0::0>>@@@x::0::2" );      //called x
qK["what_is"].push( "\\bknown\\b::0::0>>\\bas\\b::0::1>>@@@x::0::1" );      //known as x

qK["what_does_it_do"] = [];
qK["what_does_it_do"].push( "@@@x::0::0>>\\bcause|\\bcausing\\b|\\bcausation\\b::0::2" );   //form regular expression = /\bcause|\bcausing\b|\bcausation/gi; where "|" means OR
qK["what_does_it_do"].push( "@@@x::0::0>>\\baffect|\\bchange|\\bincrease|\\bdecrease::0::2" );

qK["what_affect"] = [];
qK["what_affect"].push( "@@@x::0::0>>\\bcan\\b|\\bis\\b|\\bwas\\b|\\bwill\\b|\\bare\\b|\\bwere\\b::0::2>>\\baffect|\\bchange|\\bincrease|\\bdecrease::0::2" );
qK["what_affect"].push( "@@@x::0::0>>\\baffect|\\bchange|\\bincrease|\\bdecrease::0::2" );

qK["what_can"] = [];
qK["what_can"].push( "@@@x::0::0>>\\bcan\\b::0::2" );
qK["what_can"].push( "@@@x::0::0>>\\bact\\b|\\bacts\\b|\\bprovide|\\boffer\\b|\\boffers\\b::0::2" );

qK["what_cause"] = [];
qK["what_cause"].push( "@@@x::0::0>>\\bis\\b|\\bare\\b|\\bwas\\b|\\bwere\\b::0::2>>\\bcaus::0::1" )
qK["what_cause"].push( "@@@x::0::0>>\\bis\\b|\\bare\\b|\\bwas\\b|\\bwere\\b::0::2>>\\bcause::0::1>>\\bby\\b::0::1" )     //Not sure about using just "by" yet

qK["what_compose"] = [];
qK["what_compose"].push( "@@@x::0::0>>\\bis\\b&&\\bwas\\b::0::2>>\\bcompos|\\bcompris|\\bmade\\sup|\\bmade\\sfrom::0::2" );
qK["what_compose"].push( "@@@x::0::0>>\\bconsist\\b|\\bconsists\\b|\\bconsisting\\b::0::1>>\\bof\\b::0::2" );
qK["what_compose"].push( "@@@x::0::0>>\\bconsist\\b|\\bconsists\\b|\\bconsisting\\b|\\binclude::0::2" );

qK["what_known"] = [];
qK["what_known"].push( "@@@x::0::0>>\\bis\\b|\\bwas\\b::0::2>>\\bknown\\b|\\bbelieve|\\bthought\\b|\\bassume::0::1" );
//Perhaps "known X is/are"
qK["what_known"].push( "\\bknown\\b|\\bbelieve|\\bthought\\b|\\bassume|\\bpossible::0::0>>@@@x::0::1" );
qK["what_known"].push( "\\bknown\\b|\\bbelieve|\\bthought\\b|\\bassume|\\bpossible|\\bsuggest\\b|\\bsuggests\\b::0::0>>\\bthat\\b::0::2>>@@@x::0::1" );

qK["what_associate"] = [];
qK["what_associate"].push( "@@@x::0::0>>\\bis\\b|\\bwas\\b::0::2>>\\bassociate|\\bcorrelate|\\baffiliate|\\blink|\\bconnect|\\brelated\\b|\\brelevant\\b::0::1");
qK["what_associate"].push( "@@@x::0::0>>\\bassociat|\\bcorrelat|\\baffiliat|\\blink|\\bconnect::0::1");

qK["why"] = [];
qK["why"].push( "@@@x::0::0>>\\bbecause\\b::0::2" );

qK["when"] = [];
qK["when"].push( "@@@x::0::0>>\\bhappen|\\boccur::0::2>>\\d::0::2" );

qK["where"] = [];
qK["where"].push( "@@@x::0::0>>\\boccur::0::2>>[^\\d]::0::2" );


qK["how_made"] = [];
//CONJ: I think using "|" is the same as using "&&", looking for multiple words
// \\bmade\\b && \\bcreat && \\bsynthesiz && \\bgenerat && \\bdevelop && \\bproduc && \\bconstruct && \\bassembl && \\bmanufactur && \\bbuil && \\bdesign ::0::2
qK["how_made"].push( "@@@x::0::0>>\\bis\\b|\\bwas\\b|\\bare\\b|\\bwere\\b::0::2>>\\bcreat|\\bsynthesiz|\\bgenerat|\\bdevelop|\\bproduc|\\bconstruct|\\bassembl|\\bmanufactur|\\bbuil|\\bdesign::0::2" );
qK["how_made"].push( "@@@x::0::0>>\\bmade\\sby|\\bmade\\susing::0::2>>")
// qK["how_made"].push( "@@x>>\\bis\\b&&\\bwas\\b::0::2>>\\bmade\\b&&\\bcreat&&\\bsynthesiz&&\\bgenerat&&\\bdevelop&&\\bproduc&&\\bconstruct&&\\bassembl&&\\bmanufactur&&\\bbuil&&\\bdesign::0::2" );

qK["how_work"] = [];
qK["how_work"].push( "@@@x::0::0>>\\bwork\\b|\\bworks\\b::0::2>>\\bby\\b::0::1" );

//qP = questionPhrases
qP = {};
qP["what_is"] = "what is @@x";
qP["what_can"] = "what can @@x do";
qP["what_cause"] = "what can cause @@x";
qP["what_compose"] = "what is @@x composed of";
qP["what_known"] = "what is known about @@x";
qP["what_associate"] = "what is associated with @@x";
qP["what_does_it_do"] = "what does @@x do";
qP["what_affect"] = "what affects @@x";
qP["why"] = "why @@x";
qP["when"] = "when did @@x occur";
qP["where"] = "where do @@x occur";
qP["how_made"] = "how is @@x made";
qP["how_work"] = "how does @@x work";

function Catechizer() {

    //distance between main word & question category words
    Catechizer.wordspace = 1;

    //record each category for questions & words
    Catechizer.questionKeys = {};
    //word in question is before (e.g. A tuxedo is, Lobsters are, The virus causes)
    Catechizer.questionKeys["what_before"] = "is,are,was,can,has,cause,causing,causation";
    // Catechizer.questionKeys["what_before"] = "is a,is an,is the,is when," + 
    // "are a,are an,are the,are when," + 
    // "was a,was an,was the,was when," + 
    // "can,has,cause,causing,causation";

    Catechizer.questionKeys["what_after"] = "such as,for instance,for example";        //word in question is are (e.g. brain processes such as..., animals in the wild, for instance...)
    // Catechizer.questionKeys[ "when_num" ] = "before,after,during,am,pm,at,for,by,until,till,around";

    Catechizer.questionKeys["why_A"] = "because,why";
    Catechizer.questionKeys["when_occur"] = "occur,occurs,occurred,occurring,happens";

    //phrase questions based on keys in hash Catechizer.questionKeys
    Catechizer.questionPhrase = {};
    Catechizer.questionPhrase["what_before"] = "what";
    Catechizer.questionPhrase["what_after"] = "what";
    Catechizer.questionPhrase["why_A"] = "why";
    Catechizer.questionPhrase["when_occur"] = "when does";
    
    //split each cateogory into an array of words
    for (var i in Catechizer.questionKeys)
        Catechizer.questionKeys[i] = Catechizer.questionKeys[i].split(",");

    //TEST:: console.log( "all Q types = ", Catechizer.questionKeys );
}


Catechizer.questionModels = function(qKey) {
    //VAR: qKey = string that is a key to hash of question models 'qK'
    //METHOD: returns the array of question structures (aka question models)
    return qK[qKey];
}

// Catechizer.transposePhraseWord = function(phrase) {
//     //VAR: phrase = string that should have a white space between 2 or more words
//     //METHOD: prepares a phrase to be transpose into question model (words transposed into phrases with function DiversiFuzzy.insertAllReZ() )

//     //check if white spaces present
//     if ( !( /\s/.test(phrase) ) )
//         return '\\b' + phrase + '\\b'

//     var transposePhrase = [];
//     var arrPhrase = phrase.split(' ');
//     for (var word of arrPhrase)
//         transposePhrase.push('\\b' + word + '\\b');
//     //add dumb phrase so this can be skipped by RegExpFuzzy
//     transposePhrase.push('~DUMB_WORD~');

//     return transposePhrase.join('::0::1>>');
// }

Catechizer.prototype = {
    constructor: Catechizer,


    answerPresentTEMPv2: function(str, transposons) {
        //VAR: str = string that will be searched into, see if any question structures are present 
        //VAR: transposons = hash where key is element that will replace '@@key' in question structures 'qK', and value is an array of words that will each replace '@@key'
        //METHOD: determines which question categories can be answered by string 'str'
        //NOTE: for now, only use single combination of transposons as I cannot sort through

        var quesCateg = [];     //records all question types that can be answered by this sentence
        for (var q in qK) {     //q = string that is question type, qK[q] = array of question structures for specific question type
            var qPresent = this.answerQuesType(str, q, transposons);
            if (qPresent) {
                if ( quesCateg.indexOf(q) == -1 )       //if question type not present, then record question type
                    quesCateg.push(q);
            }
        }

        //TEST: console.log( "aPTEMPv2 - str = ", str, " transposons = ", transposons, " & quesCateg = ", quesCateg );

        return quesCateg;
    },

    answerQuesType: function(str, qType, transposons) {
        //VAR: str = string that will be searched into, see if any question structures are present 
        //VAR: qType = question category type, see keys in global hash 'qK'
        //VAR: transposons = hash where key is element that will replace '@@key' in question structures 'qK', and value is an array of words that will replace '@@key'
        //METHOD: determines if question type 'qType' is present in 'str', returns true if present & false if not present
        for ( var eachQ of qK[qType] ) {        //eachQ = each question structure for question type 'q'
            var listQ = DiversiFuzzy.insertAllReZ(eachQ, transposons, 2);

            for ( var q in listQ ) {        //q = specific version of question model with certain word inserted into question model
                //create RegExpFuzzy object & search
                var qModel = new RegExpFuzzy( listQ[q] );

                //if question structure is found, then save question type & break out of loop
                var found = qModel.search( str );
                if (found.length > 0)
                    return true;
            }
        }

        return false;
    },

    // answerPresentTEMP: function(str, transposons) {
    //     //VAR: str = string that will be searched into, see if any question structures are present 
    //     //VAR: transposons = hash where key is element that will replace '@@key' in question structures 'qK', and value is an array of words that will replace 
    //     //METHOD: determines if the string 'str' can be the answer to the question of interest

    //     //go through each question type
    //     var saveQT = [];        //save Question Types
    //     for (var q in qK) {     //q = string that is question type, qK[q] = array of question structures for specific question type
    //         //go through each question structure in each question type
    //         for ( var eachQ of qK[q] ) {        //eachQ = each question structure for question type 'q'
    //             //generate a RegExpFuzzy object of all words 
    //             var listQ = DiversiFuzzy.insertAllReZ(eachQ, transposons, 2);

    //             //go through each combination of the phrased question with the words inserted into the question model
    //             for (var q2 in listQ) {     //q2 = specific version of question model with certain word inserted into question model
    //                 //create RegExpFuzzy object & search
    //                 var qModel = new RegExpFuzzy( listQ[q2] );

    //                 //if question structure is found, then save question type & break out of loop
    //                 var found = qModel.search( str );
    //                 if (found.length > 0) {
    //                     saveQT.push(q);
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     return saveQT;
    // },

    questionType: function(str) {
        //VAR: str = string that will be searched into, see if any question structures are present
        //METHOD: determine the type of questions this sentence can answer

        //create RegExpFuzzy object for each question
        var saveQT = [];        //save Question Types
        for (var q in qK) {     //q = string that is question type, qK[q] = 
            //go through each question structure in each question type
            for ( var eachQ of qK[q] ) {
                //remove flags & see if question structure is present in sentence
                var qStr = DiversiFuzzy.removeFlags( eachQ );
                var qModel = new RegExpFuzzy( qStr );
                
                //if question structure is found, then save question type & break out of loop
                var found = qModel.search( str );
                if (found.length > 0) {
                    saveQT.push(q);
                    break;
                }
            }
        }

        return saveQT;
    },

    possibleAnswers: function(word, arrStr) {
        //METHOD: determine the type of questions all elements in array 'arrStr' can answer
    },

    phraseQuestion: function(quesType, transposons) {
        //VAR: transposons = hash where key is element that will replace '@@key' in question structures 'qK', and value is an array of words that will each replace '@@key'
        //METHOD: remove flag place holders '@@key' with corresponding words in array in value of hash 'transposons'
        //NOTE: for now, only use single combination of transposons as I cannot sort through

        //replace key with words in transposon 
        var phrase = qP[quesType];
        for (var k in transposons) {
            var flag = '@@' + k;
            phrase = phrase.replace( flag, transposons[k] );
        }

        return phrase + '?';
    },



    //---------------------


    searchQuestion: function (keyQuestion, sent) {
        //VAR: keyQuestion = key in Catechizer.questionKeys, which is basically a question category
        //VAR: sent = string that is the sentence
        //METHOD: searches sentence & records any key question words in this found in "Catechizer.questionKeys[keyQuestion]" & returns array of words found
        var question = Catechizer.questionKeys[keyQuestion];       //question = array
        var wordsFound = [];        //records key words found for a given category
        for ( var i in question ) {    //question[ i ] = word within question category "keyQuestion"
            var regExp = new RegExp("\\b" + question[i] + "\\b", "gi");  
            if ( sent.match(regExp) )
                wordsFound.push(question[i]);
        }

        return wordsFound;
    },

    questionType_old: function (sent) {
        //METHOD: determine the question type based on words used
       
        //go through each type of question, and then return the potential types of question this sentence can answer
        var possibleQues = {};
        for (var i in Catechizer.questionKeys) {  //i = question type (e.g. who, what, when), Catechizer.questionKeys[i] = each word in question type "i"
            var wordsFound = this.searchQuestion(i, sent);
            if (wordsFound.length > 0)
                possibleQues[i] = wordsFound;
        }

        //TEST:: console.log("TEST - pQ = ", possibleQues);

        return possibleQues;
    },

    searchQuestionV2: function (keyQuestion, word, sent) {
        //VAR: keyQuestion = key in Catechizer.questionKeys, which is basically a question category
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: sent = string that is the sentence. Variable "word" will be searched in this variable "sent"
        //METHOD: searches sentence & records any key question words in this found in "Catechizer.questionKeys[keyQuestion]" & returns array of words found
        var question = Catechizer.questionKeys[keyQuestion];       //question = array
        var wordsFound = [];        //records key words found for a given category
        for (var i in question) {    //question[ i ] = word within question category "keyQuestion"
            //create order & distance to be searched, and if true then record question category word
            searchwords = [word, question[i]];      //order in array does matter
            if (searchOD(sent, searchwords, [Catechizer.wordspace]))
                wordsFound.push(question[i]);
        }

        return wordsFound;
    },

    questionTypeV2: function(word, sent) {
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: sent = string that is the sentence. Variable "word" will be searched in this variable "sent" 
        //METHOD: determine the question type based on words used

        //go through each type of question, and then return the potential types of question this sentence can answer
        var possibleQues = {};
        //i = question type (e.g. who, what, when), Catechizer.questionKeys[ i ] = each word in question type in variable "i"
        for (var i in Catechizer.questionKeys) { 
            var wordsFound = this.searchQuestionV2(i, word, sent);
            if (wordsFound.length > 0)
                possibleQues[i] = wordsFound;
        }

        //TEST:: console.log(word, " - pQ = ", possibleQues);

        return possibleQues;
    },

    questionPhrase: function(word, quesType, quesWord) {
        //VAR: word = the main word that will be used in the question. e.g. What is a panda, "panda" is the word
        //VAR: quesType = the type of question to be answered (e.g. who, what, where, when, why, how)
        //VAR: quesWord = the word in the quesType (i.e. the question cateogory) - e.g. "is" = "what" category
        //METHOD: this will phrase the question

        //retrieve question category, word in category, and 
        return Catechizer.questionPhrase[quesType] + " " + quesWord + " " + word + "?";
    },

    find_what: function() {
        //METHOD: finds sentences that could potentially answer the question "what"

        //go through all sentences and find words associated with question "what"
        var arrSentWhat = [];
        var arrWhat = Catechizer.questionKeys[ "what_before" ].split( "," );
        for ( var i in this.arrSents ) {
            //see if there is a word match, and if so record the sentence index & the word match
            var wordMatch = this.return_matches( this.arrSents[ i ], arrWhat );
            if ( wordMatch )
                arrSentWhat.push( [ i, wordMatch ] );     //format: [0] = sent index
        }

        this.sentWhat = arrSentWhat;
        // return arrSentWhat;
    },

    phrase_what: function() {
        //METHOD: will phrase "what" questions

        //go through each recorded 
        for ( var i in this.sentWhat ) {
            //split each sentence by word found
            var sentI = this.sentWhat[ i ][ 0 ];
            var wordSplit = this.sentWhat[ i ][ 1 ];
            var regExpSplit = new RegExp( "\\b" + this.sentWhat[ i ][ 1 ] + "\\b", "i" );
            var arrSplit = this.arrSents[ sentI ].split( regExpSplit );

            //TEST::
            var dispSplitSent = arrTools_showArr_ConsoleLog( arrSplit );
            console.log( i + " - WHAT: wordSplit = " + wordSplit + " & arrSplit = " + dispSplitSent );
        }
    },
}

/* Types of questions to ask
-who? Proper Nouns (check for capitalization)
-what? - is, are, was, can, causes/causing (e.g. X causes Y -> what does X do? What causes Y?)
    -what is X?
    -what does X do? - can, will, should, does, do, cause
        -X causes blah blah
    -what causes X?
        -Once iron is fused, the fuel runs out, causing the core to collapse.
        -Outflowing material slams into clouds of material in interstellar space, causing it to collapse and form a solar system.
    -what can satellite galaxies do?
        -These satellite galaxies can orbit for billions of years around their host before a potential merger.
    -X consists of...
-where? - some sort of preposition: inside, outside, under, below, over, on top, into, between, within, on (noun, on the table), in (noun), around (noun), next to, beside (noun, e.g. beside the car), from (noun), towards (article, noun), onto (article, noun)
    -don't confuse "beside" with "besides"
    -where does X occur? - X occurs in, Ys occur in, 
-when? - before, after, during, am, pm, at (#, e.g. 4pm, night, day), for (# time, e.g. 3 years), ago, on (same date or time), since, in (e.g. an hour), until, past (#), till, by (#), before (#), around (#)
-why? - because, why ( maybe the word is included ), reason??, since, as
    -why did Carmen think Destiny was getting better? - Carmen thought Destiny was getting better because she was no longer coughing.
    -why do I want another baby? - I want another baby because I want more children.
    -why does everyone win in trade? - Everyone wins in trade, because goods are reallocated in a way that increases utility to all parties involved
    -why has dust lost its individuality? dust has lost its individuality because it was homogenised in the cosmic "witch's cauldron" of the interstellar medium
    -CAUTION: Is it because winning the award gives them more confidence? - why do is it?? This doesn't make sense, another reason to use non-common words
-how? - may?, by?
    -how is X made? X is made, X is created, X is synthesized, X is generated, X is developed
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