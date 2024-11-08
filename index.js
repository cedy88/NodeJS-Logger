const { stripAnsi } = require('./string.js');
const {getColor} = require('./colorette.js');
const readline = require('readline');
const keypress = require('keypress');

const colors = {
    text_formatting: {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
    },
    foreground_colors: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        
        bright_black: "\x1b[90m",
        bright_red: "\x1b[91m",
        bright_green: "\x1b[92m",
        bright_yellow: "\x1b[93m",
        bright_blue: "\x1b[94m",
        bright_magenta: "\x1b[95m",
        bright_cyan: "\x1b[96m",
        bright_white: "\x1b[97m",
      
        palette: Array.from({ length: 256 }, (_, i) => `\x1b[38;5;${i}m`),
    
        reset: "\x1b[0m",
    },
    background_colors: {  
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        
        bright_black: "\x1b[100m",
        bright_red: "\x1b[101m",
        bright_green: "\x1b[102m",
        bright_yellow: "\x1b[103m",
        bright_blue: "\x1b[104m",
        bright_magenta: "\x1b[105m",
        bright_cyan: "\x1b[106m",
        bright_white: "\x1b[107m",
      
        palette: Array.from({ length: 256 }, (_, i) => `\x1b[48;5;${i}m`),
        reset: "\x1b[0m",
    },
};
var foreground_colors = colors.foreground_colors;
var background_colors = colors.background_colors;
var text_formatting = colors.text_formatting;

const presets = {
    dividers: {
        solid: ' ─ ',
        double: ' ═ ',
        dashed: ' - ',
        dotted: ' . ',
        star: ' ★ ',
        arrow: ' ➜ ',
        wave: ' ~ ',
        slash: ' / ',
        pipe: ' | ',
        hash: ' # ',
        dot: ' ● ',
        plus: ' + ',
        cross: ' ✖ ',
        square: ' ■ ',
        triangle: ' ▲ ',
        diamond: ' ◆ ',
        bullet: ' • ',
        check: ' ✔ ',
        x: ' ✘ ',
    },
    box_style_presets: {
        solid: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
        double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
        doubleSingle: { tl: "╓", tr: "╖", bl: "╙", br: "╜", h: "─", v: "║" },
        doubleSingleRounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "║" },
        singleThick: { tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃" },
        singleDouble: { tl: "╒", tr: "╕", bl: "╘", br: "╛", h: "═", v: "│" },
        singleDoubleRounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "═", v: "│" },
        rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
    },
    loading_animation_presets: {
        arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
        braille_dots: ['⣾', '⣷', '⣯', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯'],
        just_dots: ['.', '..', '...', '....', '.....'],
        clock: ['◐', '◓', '◑', '◒'],
        stars: ['*', '✦', '✧', '✩'],
        box: ['[ ]', '[=]', '[ ]', '[=]'],
        waves: ['~', '~~~', '~~~~~', '~~~~', '~~'],
        dual_circle: ['◉◯', '◯◉', '◉◯', '◯◉'],
    },
    progress_bar_presets: {
        solid_block: {
            filled: '█',
            empty: ' ',
            style: '[{filled}{empty}] {percentage}%'
        },
        half_block: {
            filled: '▌',
            empty: ' ',
            style: '[{filled}{empty} ] {percentage}%'
        },
        dashed: {
            filled: '▬',
            empty: '-',
            style: '[{filled}{empty}] {percentage}%'
        },
        arrows: {
            filled: '➜',
            empty: ' ',
            style: '[{filled}{empty}] {percentage}%'
        },
        slashes: {
            filled: '/',
            empty: '\\',
            style: '[{filled}{empty}] {percentage}%'
        },
        stars: {
            filled: '★',
            empty: '☆',
            style: '[{filled}{empty}] {percentage}%'
        },
        dots: {
            filled: '●',
            empty: '○',
            style: '[{filled}{empty}] {percentage}%'
        },
        hash_bar: {
            filled: '#',
            empty: ' ',
            style: '[{filled}{empty}] {percentage}%'
        },
    },
};

function create_error(message) {
    const error = new Error(message);
    const stack_lines = error.stack.split('\n');
    const caller_line = stack_lines[2].trim();

    const function_match = caller_line.match(/at\s(\S+)\s/);
    const location_match = caller_line.match(/(?:\/|\\)([^\/\\]+:\d+:\d+)/);

    const function_name = function_match ? function_match[1] : 'anonymous_function';
    const short_location = location_match ? location_match[1] : 'unknown_location';

    return {
        message: message,
        function_name: function_name,
        location: short_location
    };
}

class Logger {
    constructor(settings) {
        if(!settings){
            this.settings = {
                b_display_time: false,
                b_display_icons: true,
                b_display_tags: true,
                s_time_format: 'de-DE',
                s_time_zone: 'Europe/Berlin',
                box_settings: {
                    border_color: 'white',
                    border_style: 'double',
                    padding: 2,
                    marginLeft: 1,
                    b_display_time: true,
                },
                loading_animation: presets.loading_animation_presets.braille_dots,
                progress_bar: presets.progress_bar_presets.dashed,
                divider: presets.dividers.dot,
            };
        }
        else {
            switch(settings.s_display_mode){
                case 'icon_only':
                    this.settings = {
                        b_display_time: settings.b_display_time,
                        b_display_icons: true,
                        b_display_tags: false,
                        s_time_format: settings.s_time_format,
                        s_time_zone: settings.s_time_zone,
                        box_settings: settings.box_settings,
                        loading_animation: settings.loading_animation,
                        progress_bar: settings.progress_bar,
                        divider: settings.divider,
                    };
                    break;
                case 'tag_only':
                    this.settings = {
                        b_display_time: settings.b_display_time,
                        b_display_icons: false,
                        b_display_tags: true,
                        s_time_format: settings.s_time_format,
                        s_time_zone: settings.s_time_zone,
                        box_settings: settings.box_settings,
                        loading_animation: settings.loading_animation,
                        progress_bar: settings.progress_bar,
                        divider: settings.divider,
                    };
                    break;
                case 'icon_and_tag':
                    this.settings = {
                        b_display_time: settings.b_display_time,
                        b_display_icons: true,
                        b_display_tags: true,
                        s_time_format: settings.s_time_format,
                        s_time_zone: settings.s_time_zone,
                        box_settings: settings.box_settings,
                        loading_animation: settings.loading_animation,
                        progress_bar: settings.progress_bar,
                        divider: settings.divider,
                    };
                    break;
                default:
                    this.settings = {
                        b_display_time: settings.b_display_time,
                        b_display_icons: true,
                        b_display_tags: true,
                        s_time_format: settings.s_time_format,
                        s_time_zone: settings.s_time_zone,
                        box_settings: settings.box_settings,
                        loading_animation: settings.loading_animation,
                        progress_bar: settings.progress_bar,
                        divider: settings.divider,
                    };
                    break;
            }
        }
    }
    #return_current_time_tag() {
        return (`${foreground_colors.white}[${new Date().toLocaleString(this.settings.s_time_format, { timeZone: this.settings.s_time_zone })}]`);
    }
    #empty_char(amount) {
        return (" ".repeat(amount));
    }

    log(...args) {
        const normal_log_tag = background_colors.bright_black + foreground_colors.white +  "LOG" +  text_formatting.reset + this.settings.divider;
        const log_icon = (this.settings.b_display_icons ? "📝" : "");
        const log_tag = (this.settings.b_display_tags ? normal_log_tag : foreground_colors.white);

        const log_message = log_icon + this.#empty_char(1) +log_tag + args;

        const current_time = this.#return_current_time_tag();
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);
        
        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    error(error_custom){  
        const code_error_tag =  background_colors.red + foreground_colors.white +  "ERROR" +  text_formatting.reset + this.settings.divider + foreground_colors.red;
        const log_icon = (this.settings.b_display_icons ? "❌" : "");
        const log_tag = (this.settings.b_display_tags ? code_error_tag : foreground_colors.red);

        if(!error_custom.message && !error_custom.function_name && !error_custom.location){
            console.log("\nFAILED TO READ ERROR AT CALLING 'error()'\nCall this Function using the create_error function to create an error!\n");
            return;
        }

        const log_message = log_icon + this.#empty_char(1) + log_tag + error_custom.message + foreground_colors.white + this.settings.divider +
         foreground_colors.red + error_custom.function_name + "()-> (" + error_custom.location + ")";

        const current_time = this.#return_current_time_tag();
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);

        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    errorEx(...args) {
        const error_tag =  background_colors.red + foreground_colors.white +  "ERROR" +  text_formatting.reset + this.settings.divider + foreground_colors.red;
        const log_icon = (this.settings.b_display_icons ? "❌" : "");
        const log_tag = (this.settings.b_display_tags ? error_tag : foreground_colors.red);

        const log_message = log_icon + this.#empty_char(1) + log_tag + args;
        
        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);


        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    box(text, overwrite_settings = this.settings.box_settings) {//Box is not displaying time when text length is greater than 21
        const opts = { style: { ...overwrite_settings } };
        const text_lines = text.split("\n");
        const box_lines = [];

        opts.style.marginBottom = 2;
        opts.style.marginTop = 2;
    
        const _color = getColor(opts.style.border_color);
        var border_style = typeof opts.style.border_style === "string"
            ? presets.box_style_presets[opts.style.border_style] || presets.box_style_presets.solid
            : opts.style.border_style;
    
        if (_color) {
            for (const key in border_style) {
                if (border_style.hasOwnProperty(key)) {
                    border_style[key] = _color(border_style[key]);
                }
            }
        }
    
        const max_line_length = Math.max(...text_lines.map(line => line.length));
        const padding_offset = opts.style.padding % 2 === 0 ? opts.style.padding : opts.style.padding + 1;
        const height = text_lines.length + padding_offset;
        const width = max_line_length + padding_offset;
        const width_offset = width + padding_offset;
    
        const left_space = this.#empty_char(1).repeat(opts.style.marginLeft);
    
        if (opts.style.marginTop > 0) box_lines.push("".repeat(opts.style.marginTop));
    
        var date_str = "";
        var date_width = 0;
        if (opts.style.b_display_time && max_line_length >= 21) {
            date_str = new Date().toLocaleString(this.settings.s_time_format, { timeZone: this.settings.s_time_zone });
            date_width = date_str.length + 2;
        } else {
            date_str = "";
            date_width = 0;
        }
    
        const total_width = Math.max(width_offset, date_width);
        const left_padding = Math.floor((total_width - date_width) / 2);
        const left_border = border_style.h.repeat(left_padding);
        const right_border = border_style.h.repeat(total_width - left_padding - date_width);
    
        box_lines.push(`${left_space}${border_style.tl}${left_border}${opts.style.b_display_time ? max_line_length >= 21 ? "[" + date_str + "]" : "" : ""}${right_border}${border_style.tr}`);
    
        for (let i = 0; i < Math.floor(padding_offset / 2); i++) {
            box_lines.push(`${left_space}${border_style.v}${this.#empty_char(1).repeat(width_offset)}${border_style.v}`);
        }
    
        for (let i = 0; i < text_lines.length; i++) {
            const line = text_lines[i];
            const left = this.#empty_char(1).repeat(padding_offset);
            const right = this.#empty_char(1).repeat(width - stripAnsi(line).length);
            box_lines.push(`${left_space}${border_style.v}${left}${line}${right}${border_style.v}`);
        }
    
        for (let i = 0; i < Math.ceil(padding_offset / 2); i++) {
            box_lines.push(`${left_space}${border_style.v}${this.#empty_char(1).repeat(width_offset)}${border_style.v}`);
        }
    
        box_lines.push(`${left_space}${border_style.bl}${border_style.h.repeat(width_offset)}${border_style.br}`);
        if (opts.style.marginBottom > 0) box_lines.push("".repeat(opts.style.marginBottom));
    
        console.log(box_lines.join("\n"));
    }     
    
    success(...args) {
        const success_tag =  background_colors.green + foreground_colors.white +  "SUCCESS" +  text_formatting.reset + this.settings.divider + foreground_colors.green;
        const log_icon = (this.settings.b_display_icons ? "✅" : "");
        const log_tag = (this.settings.b_display_tags ? success_tag : foreground_colors.green);

        const log_message = log_icon + this.#empty_char(1) + log_tag + args;

        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);

        console.log(padded_message, this.settings.b_display_time ? current_time : "" , text_formatting.reset);
    }

    async get_int_input(question, min = "empty", max = "empty") {
        const question_tag = background_colors.magenta + foreground_colors.white + "QUESTION" +  text_formatting.reset + this.settings.divider + foreground_colors.magenta;
        const question_icon = (this.settings.b_display_icons ? "❓" : "");
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true
            });

            const render = () => {
                readline.cursorTo(process.stdout, 0);
                
                const log_message = question_icon + this.#empty_char(1) + (this.settings.b_display_tags ? question_tag : foreground_colors.magenta) + question;

                const current_time = this.#return_current_time_tag();;
                const max_Width = process.stdout.columns || 80; 
                const msg_length = stripAnsi(log_message).length;
                const padding = max_Width - msg_length - current_time.length - 1;
                const padded_message = msg_length + current_time.length >= max_Width
                  ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
                  : log_message + ' '.repeat(padding > 0 ? padding : 0);
        
                console.log(padded_message, this.settings.b_display_time ? current_time : "");
            };
            render();
            
            const ask = () => {
                rl.question('> ', (input) => {
                    var min_number = "";
                    var max_number = "";
                    if(min_number === ""){
                        if(min === "empty" || min === NaN || min === undefined || min === null){
                            min_number = "empty"; 
                        }
                        else {
                            min_number = parseInt(min);
                        }
                    }
                    if(max_number === ""){
                        if(max === "empty" || max === NaN || max === undefined || max === null){    
                            max_number = "empty";
                        }
                        else {
                            max_number = parseInt(max);
                        }
                    }
                    input = input.trim();
                    const input_number = parseInt(input, 10);

                    var max_is_valid = false;
                    var min_is_valid = false;
                    if(min === "empty" || input_number >= min_number){
                        min_is_valid = true;
                    }
                    else {
                        min_is_valid = false;
                    }
                    if(max === "empty" || input_number <= max_number){
                        max_is_valid = true;
                    }
                    else {
                        max_is_valid = false;
                    }

                    if (/^-?\d+$/.test(input) && min_is_valid && max_is_valid) {
                        rl.close();
                        resolve(parseInt(input, 10));
                    } else {
                        this.errorEx("Please enter a valid integer.");
                        ask();
                    }
                });
            };
            ask();
        });
    }

    async get_string_input(question){
        const question_tag = background_colors.magenta + foreground_colors.white +  "QUESTION" +  text_formatting.reset + this.settings.divider + foreground_colors.magenta;
        const question_icon = (this.settings.b_display_icons ? "❓" : "");
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            const render = () => {
                readline.cursorTo(process.stdout, 0);
                
                const log_message = question_icon + this.#empty_char(1) + (this.settings.b_display_tags ?  question_tag : foreground_colors.magenta) + question;

                const current_time = this.#return_current_time_tag();;
                const max_Width = process.stdout.columns || 80; 
                const msg_length = stripAnsi(log_message).length;
                const padding = max_Width - msg_length - current_time.length - 1;
                const padded_message = msg_length + current_time.length >= max_Width
                  ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
                  : log_message + ' '.repeat(padding > 0 ? padding : 0);
        
                console.log(padded_message, this.settings.b_display_time ? current_time : "");
            };
            render();

            const ask = () => {
                rl.question('> ', (input) => {
                    rl.close();
                    resolve(input.trim());
                });
            };
            ask();
        });
    }

    async bool_question(question) {
        const question_tag = (this.settings.b_display_tags ? background_colors.magenta + foreground_colors.white +  "QUESTION(Y/N)" +  text_formatting.reset + this.settings.divider : "") + foreground_colors.magenta;
        const question_icon = (this.settings.b_display_icons ? "❓" : "");

        const answer_tag = (this.settings.b_display_tags ? background_colors.magenta + foreground_colors.white +  "ANSWER" +  text_formatting.reset + this.settings.divider : "") + foreground_colors.magenta;
        const answer_icon = (this.settings.b_display_icons ? "🗨️" : "");	

        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: true
            });

            const render_answer = (answer) => {
                readline.cursorTo(process.stdout, 0);
                readline.clearLine(process.stdout, 0);
                const log_message = answer_icon + this.#empty_char(1) + answer_tag + answer;
                const current_time = this.#return_current_time_tag();;
                const max_width = process.stdout.columns || 80; 
                const msg_length = stripAnsi(log_message).length;
                const padding = max_width - msg_length - current_time.length - 1;
                const padded_message = msg_length + current_time.length >= max_width
                  ? log_message.substring(0, max_width - current_time.length - 4) + '...'
                  : log_message + ' '.repeat(padding > 0 ? padding : 0);
                process.stdout.write("\r" + padded_message + (this.settings.b_display_time ? current_time : "") + '\n');

            };

            const render = () => {
                readline.cursorTo(process.stdout, 0);
                readline.clearLine(process.stdout, 0);
    
                const log_message = question_icon + this.#empty_char(1) + question_tag + question;
    
                const current_time = this.#return_current_time_tag();;
                const max_width = process.stdout.columns || 80; 
                const msg_length = stripAnsi(log_message).length;
                const padding = max_width - msg_length - current_time.length - 1;
                const padded_message = msg_length + current_time.length >= max_width
                  ? log_message.substring(0, max_width - current_time.length - 4) + '...'
                  : log_message + ' '.repeat(padding > 0 ? padding : 0);
    
    
                process.stdout.write("\r" + padded_message + (this.settings.b_display_time ? current_time : "") + '\n');
            };

            render();

            keypress(process.stdin);
            process.stdout.write("> ");
            process.stdin.on('keypress', (ch, key) => {
                if (key && (key.name === 'y' || key.name === 'Y')) {
                    render_answer("Yes");
                    process.stdin.resume();
                    rl.close();
                    resolve(true);
                } else if (key && (key.name === 'n' || key.name === 'N')) {
                    render_answer("No");
                    process.stdin.resume();
                    rl.close();
                    resolve(false);
                } else {
                    readline.cursorTo(process.stdout, 0);
                    readline.clearLine(process.stdout, 0);
                    process.stdout.write(" | Please press 'Y' or 'N' to answer the question\n");
                    process.stdout.write("> ");
                }
            });


            process.stdin.setRawMode(true);
            process.stdin.resume();
        });
    }

    async loading_circle(message, delay) {
        const spinner_frames = this.settings.loading_animation;
        let current_frame = 0;
    
        const spinner_tag = background_colors.bright_cyan + foreground_colors.white + "LOADING" + text_formatting.reset + this.settings.divider + foreground_colors.bright_cyan;
        const spinner_icon = (this.settings.b_display_icons ? "⏳" : "");
        
        const spinner_message = spinner_icon + this.#empty_char(1) + spinner_tag + message;
    
        const spinner_interval = setInterval(() => {
            process.stdout.write(`\r${spinner_message} ${foreground_colors.white + spinner_frames[current_frame]}`);
            current_frame = (current_frame + 1) % spinner_frames.length;
        }, 100);
    
        return new Promise((resolve) => {
            setTimeout(() => {
                clearInterval(spinner_interval);
                process.stdout.write(`\r${spinner_message} ${foreground_colors.green}✔${text_formatting.reset}\n`);
                resolve();
            }, delay);
        });
    }

    async progress_bar(task_function, loading_message) {
        const spinner_tag = background_colors.bright_cyan + foreground_colors.white + "LOADING" + text_formatting.reset + this.settings.divider + foreground_colors.bright_cyan;
        const spinner_icon = (this.settings.b_display_icons ? "⏳" : "");
        const spinner_message = spinner_icon + this.#empty_char(1) + spinner_tag + loading_message;
    
        const bar_preset = this.settings.progress_bar;
    
        if (bar_preset.frames) {
            let frame_index = 0;
            const spinner_interval = setInterval(() => {
                const current_frame = bar_preset.frames[frame_index];
                frame_index = (frame_index + 1) % bar_preset.frames.length;
                process.stdout.write(`\r${spinner_message + text_formatting.reset} ${bar_preset.style.replace('{frame}', current_frame)}`);
            }, 100);
    
            await task_function();
            clearInterval(spinner_interval);
        } else {
            for (let step = 0; step <= 100; step++) {
                const percentage = step / 100;
                const total_bars = 20;
                const filled_bars = Math.round(percentage * total_bars);
                const empty_bars = total_bars - filled_bars;
    
                const filled_str = bar_preset.filled.repeat(filled_bars);
                const empty_str = bar_preset.empty.repeat(empty_bars);
                const progress_bar = bar_preset.style
                    .replace('{filled}', filled_str)
                    .replace('{empty}', empty_str)
                    .replace('{percentage}', (percentage * 100).toFixed(2));
    
                process.stdout.write(`\r${spinner_message + text_formatting.reset} ${progress_bar}`);
                await task_function();
            }
            process.stdout.write(`\r${' '.repeat(process.stdout.columns)}\r`);
            process.stdout.write(`\r${spinner_message} ${foreground_colors.green}✔${text_formatting.reset}\n`);
        }
    }

    warn(...args) {
        const warn_tag =  background_colors.bright_yellow + foreground_colors.white +  "WARNING" +  text_formatting.reset + this.settings.divider + foreground_colors.bright_yellow;
        const log_icon = (this.settings.b_display_icons ? "⚠️" : "");
        const log_tag = (this.settings.b_display_tags ? warn_tag : foreground_colors.bright_yellow);

        const log_message = log_icon + this.#empty_char(1) + log_tag + args;

        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);


        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    info(...args) {
        const information_tag =  background_colors.blue + foreground_colors.white +  "INFORMATION" +  text_formatting.reset + this.settings.divider + foreground_colors.blue;
        const log_icon = (this.settings.b_display_icons ? "ℹ️" : "");
        const log_tag = (this.settings.b_display_tags ? information_tag : foreground_colors.blue);

        const log_message = log_icon + this.#empty_char(1) + log_tag + args;

        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);

        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    user_activity(action, username, req, is_admin_activity) {
        const yellow_bold_text = '\x1b[1m\x1b[33m';

        var resolved_ip_adress = "";
        if(req.headers){
            resolved_ip_adress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').replace(/^.*:/, '');
        }
        else {
            resolved_ip_adress = "Request had no Header";
        }

        const icon = is_admin_activity ? "🛡️" : "⚙️";
        const activity_tag = (is_admin_activity ? background_colors.red : background_colors.green) + foreground_colors.white +  (is_admin_activity ? "ADMIN-ACTIVITY" : "USER-ACTIVITY") +  text_formatting.reset;
        const action_done = `${foreground_colors.white}User-Action: ${yellow_bold_text}${action}`;
        const adminaction_done = `${foreground_colors.white}Admin-Action: ${yellow_bold_text}${action}`;
        const user_name = `${foreground_colors.white}User: ${yellow_bold_text}${username}`;
        const ip = `${foreground_colors.white}IP: ${yellow_bold_text}${resolved_ip_adress}`;

        const log_message = icon + this.#empty_char(1) + (this.settings.b_display_tags ? activity_tag + this.settings.divider : "") + (is_admin_activity ? adminaction_done : action_done) + this.#empty_char(1) + user_name + this.#empty_char(1) + ip + text_formatting.reset;

        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);

        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    user_activityEx(action, username, req, is_admin_activity, ...args) {
        const yellow_bold_text = '\x1b[1m\x1b[33m';

        var resolved_ip_adress = "";
        if(req.headers){
            resolved_ip_adress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').replace(/^.*:/, '');
        }
        else {
            resolved_ip_adress = "Request had no Header";
        }

        const icon = is_admin_activity ? "🛡️" : "⚙️";
        const activity_tag = (is_admin_activity ? background_colors.red : background_colors.green) + foreground_colors.white +  (is_admin_activity ? "ADMIN-ACTIVITY" : "USER-ACTIVITY") +  text_formatting.reset;
        const action_done = `${foreground_colors.white}User-Action: ${yellow_bold_text}${action}`;
        const adminaction_done = `${foreground_colors.white}Admin-Action: ${yellow_bold_text}${action}`;
        const user_name = `${foreground_colors.white}User: ${yellow_bold_text}${username}`;
        const ip = `${foreground_colors.white}IP: ${yellow_bold_text}${resolved_ip_adress}`;

        const log_message = icon + this.#empty_char(1) + (this.settings.b_display_tags ? activity_tag + this.settings.divider : "") + (is_admin_activity ? adminaction_done : action_done) + this.#empty_char(1) + user_name + text_formatting.reset + " " + args + text_formatting.reset +this.#empty_char(1) + ip ;

        const current_time = this.#return_current_time_tag();;
        const max_Width = process.stdout.columns || 80; 
        const msg_length = stripAnsi(log_message).length;
        const padding = max_Width - msg_length - current_time.length - 1;
        const padded_message = msg_length + current_time.length >= max_Width
          ? log_message.substring(0, max_Width - current_time.length - 4) + '...'
          : log_message + ' '.repeat(padding > 0 ? padding : 0);

        console.log(padded_message, this.settings.b_display_time ? current_time : "", text_formatting.reset);
    }

    space(){
        console.log('\n');
    }
    
    reset_color() {
        console.log('\x1b[0m');
    }

    clear_console() {
        this.reset_color();
        console.clear();
    }
}

module.exports = {
    Logger,
    presets,
    colors,
    create_error,   
};