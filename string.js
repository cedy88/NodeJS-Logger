//Credits: https://github.com/easylogic/react-summernote/blob/de5ac437884fb10e9ecd03e79f0dd67fe5b36b9c/.pnpm-store/v3/files/d6/2569def6a901a92c8e068c1757db751133de0293527409cab15c3f1fcf1cf21f99635800a13b0ef6f00a905d0609612d122c91d54f2c4162bf54ae703c998a
const ansiRegex = [
    String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
    String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
  ].join("|");
  
  /**
   * Removes ANSI escape codes from a given string. This is particularly useful for
   * processing text that contains formatting codes, such as colors or styles, so that the
   * the raw text without any visual formatting.
   *
   * @param {string} text - The text string from which to strip the ANSI escape codes.
   * @returns {string} The text without ANSI escape codes.
   */
  function stripAnsi(text) {
    return text.replace(new RegExp(ansiRegex, "g"), "");
  }
  
  /**
   * Centers a string within a specified total width, padding it with spaces or another specified character.
   * If the string is longer than the total width, it is returned as is.
   *
   * @param {string} str - The string to center.
   * @param {number} len - The total width in which to center the string.
   * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
   * @returns {string} The centered string.
   */
  function centerAlign(str, len, space = " ") {
    const free = len - str.length;
    if (free <= 0) {
      return str;
    }
    const freeLeft = Math.floor(free / 2);
    let _str = "";
    for (let i = 0; i < len; i++) {
      _str += i < freeLeft || i >= freeLeft + str.length ? space : str[i - freeLeft];
    }
    return _str;
  }
  
  /**
   * Right-justifies a string within a given total width, padding it with whitespace or another specified character.
   * If the string is longer than the total width, it is returned as is.
   *
   * @param {string} str - The string to right-justify.
   * @param {number} len - The total width to align the string.
   * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
   * @returns {string} The right-justified string.
   */
  function rightAlign(str, len, space = " ") {
    const free = len - str.length;
    if (free <= 0) {
      return str;
    }
    let _str = "";
    for (let i = 0; i < len; i++) {
      _str += i < free ? space : str[i - free];
    }
    return _str;
  }
  
  /**
   * Left-aligns a string within a given total width, padding it with whitespace or another specified character on the right.
   * If the string is longer than the total width, it is returned as is.
   *
   * @param {string} str - The string to align left.
   * @param {number} len - The total width to align the string.
   * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
   * @returns {string} The left-justified string.
   */
  function leftAlign(str, len, space = " ") {
    let _str = "";
    for (let i = 0; i < len; i++) {
      _str += i < str.length ? str[i] : space;
    }
    return _str;
  }
  
  /**
   * Aligns a string (left, right, or center) within a given total width, padding it with spaces or another specified character.
   * If the string is longer than the total width, it is returned as is. This function acts as a wrapper for individual alignment functions.
   *
   * @param {"left" | "right" | "center"} alignment - The desired alignment of the string.
   * @param {string} str - The string to align.
   * @param {number} len - The total width in which to align the string.
   * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
   * @returns {string} The aligned string, according to the given alignment.
   */
  function align(alignment, str, len, space = " ") {
    switch (alignment) {
      case "left":
        return leftAlign(str, len, space);
      case "right":
        return rightAlign(str, len, space);
      case "center":
        return centerAlign(str, len, space);
      default:
        return str;
    }
  }
  
  module.exports = {
    stripAnsi,
    centerAlign,
    rightAlign,
    leftAlign,
    align,
  };
  