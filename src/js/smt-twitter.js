
function twitterbot_start(json) {
    const main = require("electron").remote.require("./main");
    main.twitterbot_start(json);
}

function twitter_get_user_form() {
    let tokens = {};
    tokens.twitter_username = $("#twitter_username").val();
    tokens.twitter_username = tokens.twitter_username.replace(/@/g, "");
    tokens.twitter_password = $("#twitter_password").val();
    tokens.twitter_hashtag = $("#twitter_hashtag").val();
    tokens.twitter_language = $("#twitter_language").val();
    tokens.bot_mode = $("#bot_mode").val();
    tokens.executable_path = $("#executable_path").val();
    tokens.twitter_hashtag = tokens.twitter_hashtag.replace(/ /g, "");
    tokens.twitter_hashtag = tokens.twitter_hashtag.replace(/,/g, "\",\"");

    tokens.bot_likeday_min = parseInt($("#bot_likeday_max").val() - 100);
    tokens.bot_likeday_max = $("#bot_likeday_max").val();

    let min = 0;
    do {
        min++;
    } while ((60 / min * 24 * 20) > tokens.bot_likeday_min);
    tokens.bot_fastlike_max = min--;
    min = 0;
    do {
        min++;
    } while ((60 / min * 24 * 20) > tokens.bot_likeday_max);
    tokens.bot_fastlike_min = min--;

    if($("#chrome_headless").val() != "enabled" && $("#chrome_headless").val() != "disabled"){
        tokens.chrome_headless = "disabled";
    }else{
        tokens.chrome_headless = $("#chrome_headless").val();
    }

    if (process.platform === "win32") {
        tokens.config_path = remoteapp.getPath("userData");
        tokens.config_path = tokens.config_path.replace(/\\/g, "/");
    } else {
        tokens.config_path = remoteapp.getPath("userData");
    }

    return tokens;
}

function twitter_load_config() {
    if ($("#executable_path").val() == "") {
        if (process.platform === "linux") {
            $("#executable_path").val("/usr/bin/google-chrome");
        } else if (process.platform === "win32") {
            $("#executable_path").val("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe");
        } else if (process.platform === "darwin") {
            $("#executable_path").val("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
        }
    }

    $("#bot_mode").change();

    fs.exists(remoteapp.getPath("userData") + "/config_" + $("#twitter_username").val() + "_twitter.json", function(exists) {
        if (exists) {
            let data = fs.readFileSync(remoteapp.getPath("userData") + "/config_" + $("#twitter_username").val() + "_twitter.json", "utf8");
            let config = JSON.parse(data.toString());

            $("#twitter_password").val(config.twitter_password);
            $("#bot_mode").val(config.bot_mode);
            $("#bot_likeday_max").val(config.bot_likeday_max);
            $("#executable_path").val(config.executable_path);
            $("#chrome_headless").val(config.chrome_headless);
            $("#twitter_hashtag").val(config.twitter_hashtag.join());
            $("#twitter_language").val(config.twitter_language);

            twitter_check_bot_mode();
        }
    });

}

function twitter_check_form() {
    let check_err = 0;

    if ($("#twitter_username").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Username is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#twitter_password").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Password is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#twitter_hashtag").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Hashtag list is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_likeday_max").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max like/day is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if (check_err == 0) {
        check_err += twitter_check_max_like();
    }

    return check_err;
}

function twitter_save_config(bot) {
    let check_err = twitter_check_form();

    if (list_actived_bot[$("#twitter_username").val() + "_" + $("#bot_mode").val()] == true) {
        app.dialog.create({ title: "Status", text: "@" + $("#twitter_username").val() + " bot is running... Stop app and start again this user if you need change configuration", buttons: [{ text: "OK" }] }).open();
        return 1;
    }else if (bot === "twitter" && check_err <= 0) {
        let tokens = twitter_get_user_form();
        let json = jtr.replace(tokens, require("../config_twitter.json"));
        // clean old logs
        fs.writeFile(remoteapp.getPath("userData") + "/" + $("#twitter_username").val() + "_twitter.log", "", function(err) {
            if (err) {
                return console.log(err);
            }
        });

        fs.writeFile(remoteapp.getPath("userData") + "/config_" + $("#twitter_username").val() + "_twitter.json", JSON.stringify(json), function(err) {
            if (err) {
                return console.log(err);
            }

            fs.exists($("#executable_path").val(), function(exists) {
                if (exists) {
                    app.dialog.create({ title: "Status", text: "Bot started...<br /><br />How check if work: check your like timeline in profile<br /><br />Bot like/rt tweets for you :D", buttons: [{ text: "OK" }] }).open();
                    list_actived_bot[tokens.twitter_username + "_" + tokens.bot_mode] = true;
                    twitterbot_start(json);
                } else {
                    app.dialog.create({ title: "Warning", text: "Google Chrome path doesn't exist, please install google chrome or chromium and retry", buttons: [{ text: "OK" }] }).open();
                }
            });
        });
    }
}

function twitter_save_2fa() {

    fs.writeFile(remoteapp.getPath("userData") + "/" + $("#twitter_username").val() + "_pin_twitter.txt", $("#twitter_2fapin").val(), function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function twitter_open_logs() {
    clearInterval(logs_interval);
    $("#logs").val("[INFO] Loading...");
    logs_interval = setInterval(function() {
        let logs = fs.readFileSync(remoteapp.getPath("userData") + "/" + $("#twitter_username").val() + "_twitter.log", "utf8");
        $("#logs").val(logs);
    }, 1000);
}

function twitter_check_bot_mode() {
    if ($("#bot_mode").val() == "likemode_realistic") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, like 19-20 tweet fast and stop X minutes in loop");
        $(".mode_all").hide();
        $(".likemode_realistic").show();
    } else if ($("#bot_mode").val() == "rtmode_realistic") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, retweet 19-20 tweet fast and stop X minutes in loop");
        $(".mode_all").hide();
        $(".rtmode_realistic").show();
    }
}

function twitter_check_hashtag() {
    return 1;
}


function twitter_check_max_like() {
    if ($("#bot_likeday_max").val() != "" && parseInt($("#bot_likeday_max").val()) > 1000) {
        $("#bot_likeday_max").val(900);

        app.dialog.create({ title: "Warning", text: "Twitter ban you if like/rt more than 1000 photos/day. App restore default value.", buttons: [{ text: "OK" }] }).open();

        return 1;
    }

    return 0;
}