const functionConverter = (input) => {
  let parenthesisStack = [];
  let doubleQuoteStack = [];
  let SingleQuoteStack = [];
  let backtickStack = [];

  const matchPattern = "function";
  const matchDoubleQuote = '"';
  const matchSingleQuote = "'";
  const matchBacktick = "`";
  const matchParenthesis = "(";
  const matchMultiLineComOp = "/*";
  const matchMultiLineComClo = "*/";

  const matchPaternLength = matchPattern.length;
  const inputLength = input.length;

  let response;
  //--------------------------------------------------------------------------

  const commentedOutChecker = () => {
    if (doubleQuoteStack.length > 0) {
      return true;
    }
    return false;
  };

  const checkRemainingLength = (i, matchPaternLength, inputLength) => {
    if (i + matchPaternLength <= inputLength) {
      return true;
    }
    return false;
  };

  const removeFunction = (i) => {
    const beforeText = input.substring(0, i);
    const afterText = input.substring(i + matchPaternLength + 1);
    const afterTextWithArrow = insertArrow(i, afterText);
    return beforeText + afterTextWithArrow;
  };

  const insertArrow = (i, rem) => {
    //const remaining = input.substring(i + matchPaternLength +1);
    //console.log(remaining);
    //const beforeText = rem.substring(0, i+1);
    //console.log(beforeText);

    //let tempString = ""
    //console.log(rem);
    const regExp = /(\([^]+\))/;
    //const matches = regExp.exec(rem);
    const match = rem.replace(regExp, "$1 =>");
    //console.log(match)
    return match;
    /*
        for (let i = 0; i < remaining.length; i++){
            
            tempString += remaining[i];
            if(remaining[i] === "(" && !commentedOutChecker()){
            
                if(commentedOutChecker(doubleQuoteStack)){
                    doubleQuoteStack.pop();
                } else {
                    doubleQuoteStack.push('"');
                }
            }
            if(parenthesisStack.length === 0){

                //break;
            }
        }
        */
  };
  // ------------------------------------------------------------------------

  for (let i = 0; i < inputLength; i++) {
    if (input[i] === matchDoubleQuote) {
      if (commentedOutChecker(doubleQuoteStack)) {
        doubleQuoteStack.pop();
      } else {
        doubleQuoteStack.push('"');
      }
    }

    if (input[i] === matchPattern[0] && !commentedOutChecker()) {
      if (checkRemainingLength(i, matchPaternLength, inputLength)) {
        if (
          input[i + matchPaternLength - 1] ===
          matchPattern[matchPaternLength - 1]
        ) {
          response = "front and end match";
          response = removeFunction(i);
        }
      } else {
        response = "string to short to contain function";
        break;
      }
    }
  }
  return response;
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const input = req.body.input.text;
    //      const matchNewline = /\r|\n/.exec(input);

    const response = functionConverter(input);
    res.status(200).json({ result: `${response}` });
  }
}
