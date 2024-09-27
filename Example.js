const {Logger, presets, create_error} = require('../NodeJS-Logger/index.js');

const logger_settings = {// 
    b_display_time: true,
    s_display_mode: 'icon_and_tag', // icon_only, tag_only, icon_and_tag
    s_time_format: 'de-DE',
    s_time_zone: 'Europe/Berlin',
    box_settings: {
        border_color: 'white',
        border_style: 'double',
        padding: 0,
        marginLeft: 1,
        marginTop: 1,
        marginBottom: 1,
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

    logger.box('Watupp\nThis is a box\nItLterally is a\n BOX');


    logger.box('Watupp\nThis is a box message ma nigga', { border_color: 'green', border_style: 'doubleSingleRounded', padding: 5, marginLeft: 0, marginTop: 0, marginBottom: 0});
    
    await logger.get_int_input("How many kids do you have?");

    await logger.get_string_input("Whats your name?");

    logger.log("This is a log message ma nigga");
    logger.warn("This is a warning ma nigga");
    logger.success("This was a success ma nigga");
    logger.info("This is an info ma nigga");
    logger.errorEx("This is an error ma nigga");
    logger.error(create_error("Failed to connect nigga"));
    
    logger.user_activity("Create User", "Alibaba1337", "nigga", false);
    logger.user_activity("Delete User", "AdminSenpai69", "nigga_yjk", true);


    logger.user_activityEx("Create Auction", "AdminSenpai69","request", true, `AuctionID: ${foreground_colors.yellow + "78346875463785634"}`);

    logger.space();

    await logger.bool_question("are you sure?");

    logger.space();

    await logger.progress_bar(task_todo, "Updating Network adapters..");
    await logger.loading_circle("Updating Profile..", 5000);
}
main();