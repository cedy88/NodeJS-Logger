//Credits: https://github.com/jorgebucaran/colorette/blob/20fc196d07d0f87c61e0256eadd7831c79b24108/index.js

const tty = require("tty");

// TODO: Migrate to std-env
const {
  env = {},
  argv = [],
  platform = "",
} = typeof process === "undefined" ? {} : process;
const isDisabled = "NO_COLOR" in env || argv.includes("--no-color");
const isForced = "FORCE_COLOR" in env || argv.includes("--color");
const isWindows = platform === "win32";
const isDumbTerminal = env.TERM === "dumb";
const isCompatibleTerminal =
  tty && tty.isatty && tty.isatty(1) && env.TERM && !isDumbTerminal;
const isCI =
  "CI" in env &&
  ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);

/**
 * Determines support for terminal colours based on the environment and capabilities of the terminal.
 * @type {boolean} isColorSupported - Indicates whether colour support is enabled in the terminal.
 */
const isColorSupported =
  !isDisabled &&
  (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI);

function replaceClose(
  index,
  string,
  close,
  replace,
  head = string.slice(0, Math.max(0, index)) + replace,
  tail = string.slice(Math.max(0, index + close.length)),
  next = tail.indexOf(close),
) {
  return head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
}

function clearBleed(
  index,
  string,
  open,
  close,
  replace,
) {
  return index < 0
    ? open + string + close
    : open + replaceClose(index, string, close, replace) + close;
}

function filterEmpty(
  open,
  close,
  replace = open,
  at = open.length + 1,
) {
  return (string) =>
    string || !(string === "" || string === undefined)
      ? clearBleed(
          ("" + string).indexOf(close, at),
          string,
          open,
          close,
          replace,
        )
      : "";
}

function init(open, close, replace) {
  return filterEmpty(`\u001B[${open}m`, `\u001B[${close}m`, replace);
}

const colorDefs = {
  reset: init(0, 0),
  bold: init(1, 22, "\u001B[22m\u001B[1m"),
  dim: init(2, 22, "\u001B[22m\u001B[2m"),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49),
};

/**
 * Creates an object that maps colour names to their respective colour functions,
 * based on whether or not colour support is enabled.
 * @param {boolean} [useColor=isColorSupported] - Specifies whether to use colour functions or fallback to plain strings.
 * @returns {Record<string, Function>} An object where keys are colour names and values are functions to apply those colours.
 */
function createColors(useColor = isColorSupported) {
  return useColor
    ? colorDefs
    : Object.fromEntries(Object.keys(colorDefs).map((key) => [key, String]));
}

/**
 * An object containing functions for colouring text. Each function corresponds to a terminal colour.
 */
const colors = createColors();

/**
 * Gets a colour function by name, with an option for a fallback colour if the requested colour is not found.
 * @param {string} color - The name of the colour function to get.
 * @param {string} [fallback="reset"] - The name of the fallback colour function if the requested colour is not found.
 * @returns {Function} The colour function that corresponds to the requested colour, or the fallback colour function.
 */
function getColor(color, fallback = "reset") {
  return colors[color] || colors[fallback];
}

/**
 * Applies a specified colour to a given text string or number.
 * @param {string} color - The colour to apply.
 * @param {string | number} text - The text to colour.
 * @returns {string} The coloured text.
 */
function colorize(color, text) {
  return getColor(color)(text);
}

module.exports = {
  isColorSupported,
  colors,
  getColor,
  colorize,
};
