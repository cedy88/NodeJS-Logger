~~__NodeJS-Logger__~~

Welcome to this Project, its a small project ive made for my own projects in NodeJS

# 🌟 NodeJS-Logger

**a good looking Logging Libary with some cool features**

![Project Banner](https://github.com/cedy88/NodeJS-Logger/blob/main/nodejsloggerpic.png)

---

## 🚀 Features

- **Feature 1** – Describe what it does, focusing on the value it provides
- **Feature 2** – Another cool thing about your project
- **Feature 3** – Mention unique aspects that make your project stand out

---

## 📥 Installation

To install dependencies, clone the repository and run:

```bash
# Clone the repo
git clone https://github.com/yourusername/projectname.git

# Navigate into the project directory
cd projectname

# Install dependencies
npm install

Example:
```nodejs
const {Logger, presets, create_error, colors} = require('nodejs-logging-libary');

// Define colors for the logger
var { foreground_colors, background_colors, text_formatting } = colors;

const custom_logger_settings = {//Custom Settings for the logger
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

function task_todo() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();//call resolve() to indicate that the task is done
        }, 10);
    });
}

async function main(){
    // const logger = new Logger(custom_logger_settings); // Custom settings
    const logger = new Logger(); // Default settings

    // Displays a simple message in a box with default styling.
    logger.box('Welcome!');

    // Displays a message in a customized box.
    logger.box('Watupp\nThis is a box message', { border_color: 'green', border_style: 'doubleSingleRounded', padding: 2, marginLeft: 1, b_display_time: false});
    
    // Logs a general message to the console.
    logger.log("This is a log message!");

    // Logs a warning message, indicating a potential issue.
    logger.warn("This is a warning!");

    // Logs a success message, indicating a successful operation.
    logger.success("This was a success!");
    
    // Logs an informational message.
    logger.info("This is an info!");
    
    // Logs an error message, without the position of the code where this log was called at
    logger.errorEx("This is an error message!");

    // Logs an error message with the position of the code where this log was called at
    // Parameters:
    // - error(create_error("message")) | You have to call the create_error function to get the error message
    logger.error(create_error("This message faild to send!"));

    // Get integer input from the user
    await logger.get_int_input("How old is you?");

    // Get integer input from the user with a specified range of allowed 
    await logger.get_int_input("Rate this repo from 1-10", 1, 10);

    // Get string input from the user
    await logger.get_string_input("Whats your name?");

    // Logs user activity
    // Parameters:
    // - action: The action being logged 
    // - username: The username of the user performing the action 
    // - request: The request, its necacary to display the IP Adress!
    // - is_admin_activity: Indicates whether the action was done by an admin or user.
    logger.user_activity("Create User", "Alibaba1337", "request", false);
    logger.user_activity("Delete User", "AdminSenpai69", "request", true);

    // Logs user activity with unlimited additional custom arguments
    // Parameters:
    // - action: The action being logged
    // - username: The username of the user performing the action.
    // - request: The request, its necacary to display the IP Adress!
    // - is_admin_activity: Indicates whether the action was done by an admin or user.
    // - additional args: Additional arguments to include in the log message.
    logger.user_activityEx("Create Auction", "AdminSenpai69","request", true, `AuctionID: ${foreground_colors.yellow + "78346875463785634"}`);

    // Adds space in the log for better readability same as "console.log('\n');"
    logger.space();

    // Ask a yes/no question
    // Prompts the user with a yes/no question and waits for a Yes/No response.
    const is_user_sure = await logger.bool_question("are you sure?");

    // Adds space in the log for better readability
    logger.space();

    // Displays a progress bar
    // Indicates the progress of a running task.
    await logger.progress_bar(task_todo, "Updating Network adapters..");

    // Indicates that a task is in progress displaying a loading circle/symbol for a specified duration(milliseconds).
    await logger.loading_circle("Updating Profile..", 5000);
};
main();
```
