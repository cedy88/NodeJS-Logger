const {Logger, presets, create_error} = require('../NodeJS-Logger/index.js');

const logger_settings = {// 
    b_display_time: true,
    s_display_mode: 'icon_and_tag', // icon_only, tag_only, icon_and_tag
    s_time_format: 'de-DE',
    s_time_zone: 'Europe/Berlin',
    box_settings: {
        border_color: 'white',
        border_style: 'double',
        valign: 'center',
        padding: 0,
        marginLeft: 1,
        b_display_time: false, //Make sure the text is not too short, otherwise the time wont be displayed in the box
    },
    loading_animation: presets.loading_animation_presets.braille_dots,
    progress_bar: presets.progress_bar_presets.dashed,
    divider: presets.dividers.dot,
};

function task_todo(step) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();//call resolve to indicate that the task is done
        }, 10);
    });
}

async function main(){
    const logger = new Logger(logger_settings);

    // Normal box call
    // Displays a simple message in a box with default styling.
    logger.box('Welcome!');

    // Box call with unique settings
    // Displays a message in a customized box. 
    // Parameters:
    // - message: The content to display in the box (string).
    // - options: An object containing styling options:
    //   - border_color: The color of the box border (string).
    //   - border_style: The style of the box border (string).
    //   - padding: The padding inside the box (number).
    //   - marginLeft: The left margin for the box (number).
    //   - b_display_time: If true, the display time will be shown (boolean).
    logger.box('Watupp\nThis is a box message', { border_color: 'green', border_style: 'doubleSingleRounded', padding: 2, marginLeft: 1, b_display_time: false});
    
    // Basic log message
    // Logs a general message to the console.
    logger.log("This is a log message!");

    // Basic warning message
    // Logs a warning message, indicating a potential issue.
    logger.warn("This is a warning!");

    // Basic success message
    // Logs a success message, indicating a successful operation.
    logger.success("This was a success!");
    
    // Basic info message
    // Logs an informational message that is neither a warning nor an error.
    logger.info("This is an info!");
    
    // Basic error message
    // Logs an error message, including an exception object for debugging.
    logger.errorEx("This is an error message!");

    // Logs an error message with the position of the code where this log was called at
    // Parameters:
    // - error(create_error("message")) | You have to call the create_error function to get the error message
    logger.error(create_error("This message faild to send!"));

    // Get integer input from the user
    // Prompts the user with a question and waits for an integer(Number) response.
    await logger.get_int_input("How good is this repo?");
    await logger.get_int_input("Rate this repo from 1-10", 1, 10);

    // Get string input from the user
    // Prompts the user with a question and waits for a string response.
    // Parameters:
    // - question: The question to ask the user (string).
    await logger.get_string_input("Whats your name?");

    // Logs user activity
    // Parameters:
    // - action: The action being logged (string).
    // - username: The username of the user performing the action (string).
    // - request: The web request for your users stuff, its necacary to display the IP Adress
    // - is_admin_action: Indicates whether the action was successful (boolean).
    logger.user_activity("Create User", "Alibaba1337", "request", false);
    logger.user_activity("Delete User", "AdminSenpai69", "request", true);

    // Logs user activity with extended parameters
    // Records a detailed action taken by a user.
    // Parameters:
    // - action: The action being logged (string).
    // - username: The username of the user performing the action (string).
    // - context: Additional context about the action (string).
    // - success: Indicates whether the action was successful (boolean).
    // - details: Any additional details about the action (string).
    logger.user_activityEx("Create Auction", "AdminSenpai69","request", true, `AuctionID: ${foreground_colors.yellow + "78346875463785634"}`);

    // Adds space in the log for better readability
    logger.space();

    // Ask a yes/no question
    // Prompts the user with a yes/no question and waits for a boolean response.
    // Parameters:
    // - question: The question to ask the user (string).
    await logger.bool_question("are you sure?");

    // Adds space in the log for better readability
    logger.space();

    // Displays a progress bar
    // Indicates the progress of a long-running task.
    // Parameters:
    // - task: The total number of tasks to complete (number).
    // - message: A message to display alongside the progress bar (string).
    await logger.progress_bar(task_todo, "Updating Network adapters..");

    // Displays a loading circle
    // Indicates that a task is in progress for a specified duration.
    // Parameters:
    // - message: A message to display while loading (string).
    // - duration: The duration to display the loading indicator (number).
    await logger.loading_circle("Updating Profile..", 5000);
}
main();