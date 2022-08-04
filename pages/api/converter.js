const functionConverter = (input) => {
  let oldLength = 0;

  let commentStack = [];

  const matchPattern = "function";

  const commentListBackslash = ["//", "/*", "*/", "\t", '"', "'", "`", "\n"];

  const matchPaternLength = matchPattern.length;

  let response = input;
  //--------------------------------------------------------------------------

  const commentControll = (i) => {
    let temp;
    if (response[i] === "/" || response[i] === "*") {
      temp = response[i] + response[i + 1];
    } else {
      temp = response[i];
    }

    if (commentListBackslash.includes(temp)) {
      if (commentStack.length > 0) {
        if (commentStack[0] === temp) {
          commentStack.pop();
        } else if (temp === "*/" && commentStack[0] === "/*") {
          commentStack.pop();
        } else if (
          (temp === "\t" && commentStack[0] === "//") ||
          (temp === "\n" && commentStack[0] === "//")
        ) {
          commentStack.pop();
        }
      } else {
        if (temp !== "\t" && temp !== "\n") {
          commentStack.push(temp);
        }
      }
    }
  };

  const commentedOutChecker = (type) => {
    if (commentStack.length > 0) {
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
    const beforeText = response.substring(0, i);
    const afterText = response.substring(i + matchPaternLength + 1);
    const afterTextWithArrow = insertArrow(i, afterText);
    return beforeText + afterTextWithArrow;
  };

  const insertArrow = (i, rem) => {
    const regExp = /(\([^]*?\)) /;
    const regLetters = /[a-zA-Z]/;
    const regMulti = /[a-zA-Z0-9]*, [a-zA-Z0-9]*/;
    let match = rem.replace(regExp, "$1 => ");
    match = statementCheck(match);

    const temp = /\(([^]*?)\)/.exec(match);

    if (temp !== null) {
      if (regLetters.test(temp[0]) && !regMulti.test(temp[0])) {
        match = match.replace(/\(([^]*?)\)/, "$1");
      }
    }

    return match;
  };

  const statementCheck = (text) => {
    const regExp = /(\{[^]*?\})/;
    const regSemi = /;/g;
    const temp = regExp.exec(text);

    let collection = "";

    let curlyStack = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "}") {
        curlyStack.pop();
      }
      if (curlyStack.length > 0) {
        collection += text[i];
      }

      if (text[i] === "{") {
        curlyStack.push("{");
      }
      if (text[i] === ";" && curlyStack.length === 0) {
        break;
      }
    }
    const count = (collection.match(regSemi) || []).length;
    if (count === 1) {
      const statement = /\t([^]*?);/.exec(temp[0]);

      let pure;

      if (statement[0].match("\treturn ")) {
        pure = statement[0].replace(/\treturn /g, "");
      } else {
        pure = statement[0].replace(/\t/g, "");
      }
      pure = pure.replace(/\t/g, "");

      pure = pure.replace(";", "");

      return text.replace(temp[0], pure);
    }
    return text;
  };
  // ------------------------------------------------------------------------

  for (let i = 0; i < response.length; i++) {
    commentControll(i);

    if (oldLength === 0) {
      oldLength = response.length;
    }

    if (response[i] === matchPattern[0] && !commentedOutChecker()) {
      if (checkRemainingLength(i, matchPaternLength, response.length)) {
        if (
          response[i + matchPaternLength - 1] ===
          matchPattern[matchPaternLength - 1]
        ) {
          response = removeFunction(i);
          if (oldLength !== response.length) {
            i = 0;
            commentStack = [];
            oldLength = response.length;
          }
        }
      } else {
        finished = true;
        console.log("string to short to contain function");
        break;
      }
    }
  }
  return response;
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const input = req.body.input.text;
    const response = functionConverter(input);
    res.status(200).json({ result: `${response}` });
  }
}
