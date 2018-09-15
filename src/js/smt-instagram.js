function instagrambot_start(json) {
    const main = require("electron").remote.require("./main");
    main.instagrambot_start(json);
}

function instagram_get_user_form() {
    let tokens = {};
    tokens.instagram_username = $("#instagram_username").val();
    tokens.instagram_username = tokens.instagram_username.replace(/@/g, "");
    tokens.instagram_password = $("#instagram_password").val();
    tokens.instagram_hashtag = $("#instagram_hashtag").val();
    tokens.bot_mode = $("#bot_mode").val();
    tokens.executable_path = $("#executable_path").val();
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/ /g, "");
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/#/g, "");
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/,/g, "\",\"");

    tokens.bot_likeday_min = parseInt($("#bot_likeday_max").val() - 100);
    tokens.bot_likeday_max = $("#bot_likeday_max").val();

    tokens.bot_followday = $("#bot_followday").val();
    tokens.bot_followrotate = $("#bot_followrotate").val();
    tokens.bot_userwhitelist = $("#bot_userwhitelist").val();
    tokens.bot_userwhitelist = tokens.bot_userwhitelist.replace(/ /g, "");
    tokens.bot_userwhitelist = tokens.bot_userwhitelist.replace(/#/g, "");
    tokens.bot_userwhitelist = tokens.bot_userwhitelist.replace(/,/g, "\",\"");

    if (tokens.bot_mode == "comment_mode") {
        tokens.bot_likeday_min = parseInt($("#bot_commentsday").val() - 50);
        tokens.bot_likeday_max = $("#bot_commentsday").val();
    }

    tokens.bot_comment_list = $("#bot_comment_list").val();
    tokens.bot_comment_list = tokens.bot_comment_list.replace(/ /g, "");
    tokens.bot_comment_list = tokens.bot_comment_list.replace(/#/g, "");
    tokens.bot_comment_list = tokens.bot_comment_list.replace(/,/g, "\",\"");

    tokens.bot_likemode_competitor_users = $("#bot_likemode_competitor_users").val();


    let min = 0;
    do {
        min++;
    } while ((60 / min * 24 * 11) > tokens.bot_likeday_min);
    tokens.bot_fastlike_max = min--;
    min = 0;
    do {
        min++;
    } while ((60 / min * 24 * 11) > tokens.bot_likeday_max);
    tokens.bot_fastlike_min = min--;
    tokens.bot_superlike_n = $("#bot_superlike_n").val();

    if ($("#chrome_headless").val() != "enabled" && $("#chrome_headless").val() != "disabled") {
        tokens.chrome_headless = "disabled";
    } else {
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

function instagram_load_config() {
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

    fs.exists(remoteapp.getPath("userData") + "/config_" + $("#instagram_username").val() + ".json", function(exists) {
        if (exists) {
            let data = fs.readFileSync(remoteapp.getPath("userData") + "/config_" + $("#instagram_username").val() + ".json", "utf8");
            let config = JSON.parse(data.toString());

            $("#instagram_password").val(config.instagram_password);
            $("#bot_mode").val(config.bot_mode);
            $("#bot_likeday_max").val(config.bot_likeday_max);
            $("#bot_superlike_n").val(config.bot_superlike_n);
            $("#executable_path").val(config.executable_path);
            $("#chrome_headless").val(config.chrome_headless);
            $("#instagram_hashtag").val(config.instagram_hashtag.join());

            $("#bot_commentsday").val(config.bot_likeday_max);
            $("#bot_comment_list").val(config.comment_mode.comments.source.join());
            $("#bot_followday").val(config.bot_followday);
            $("#bot_followrotate").val(config.bot_followrotate);
            $("#bot_userwhitelist").val(config.bot_userwhitelist.join());
            $("#bot_likemode_competitor_users").val(config.likemode_competitor_users.account);

            instagram_check_bot_mode();
        }
    });

}

function instagram_check_form() {
    let check_err = 0;

    if ($("#instagram_username").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Username is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#instagram_password").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Password is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#instagram_hashtag").val() == "" && $("#bot_mode").val() != "bot_likemode_competitor_users" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Hashtag list is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_likeday_max").val() == "" && $("#bot_mode").val() != "fdfmode_classic" && $("#bot_mode").val() != "comment_mode" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max like/day is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_mode").val() == "likemode_superlike" && $("#bot_superlike_n").val() == "" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max Like photo/user is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_commentsday").val() == "" && $("#bot_mode").val() === "comment_mode" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max Comments/day is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_comment_mode").val() == "" && $("#bot_mode").val() === "comment_mode" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Comments list is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_followday").val() == "" && $("#bot_mode").val() === "fdfmode_classic" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max follow-defollow/day is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_followrotate").val() == "" && $("#bot_mode").val() === "fdfmode_classic" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Max follow rotate is empty", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if ($("#bot_likemode_competitor_users").val() == "" && $("#bot_mode").val() === "likemode_competitor_users" && check_err == 0) {
        app.dialog.create({ title: "Warning", text: "Insert competitor username", buttons: [{ text: "OK" }] }).open();
        check_err++;
    } else if (check_err == 0) {
        check_err += instagram_check_max_like();
    }

    return check_err;
}

function instagram_save_config(bot) {
    let check_err = instagram_check_form();

    if (list_actived_bot[$("#instagram_username").val()+"_"+$("#bot_mode").val()] == true) {
        app.dialog.create({ title: "Status", text: "@" + $("#instagram_username").val() + " bot is running in this mode... Stop app and start again this user if you need change configuration", buttons: [{ text: "OK" }] }).open();
        return 1;
    } else if (bot === "instagram" && check_err <= 0) {
        let tokens = instagram_get_user_form();
        let json = jtr.replace(tokens, require("../config.json"));
        // clean old logs
        fs.writeFile(remoteapp.getPath("userData") + "/" + $("#instagram_username").val() + "_" + $("#bot_mode").val() + ".log", "", function(err) {
            if (err) {
                return console.log(err);
            }
        });

        fs.writeFile(remoteapp.getPath("userData") + "/config_" + $("#instagram_username").val() + ".json", JSON.stringify(json), function(err) {
            if (err) {
                return console.log(err);
            }

            fs.exists($("#executable_path").val(), function(exists) {
                if (exists) {
                    app.dialog.create({ title: "Status", text: "Bot started...<br /><br />Example how check if work: wait 2min after start, open instagram app, tap on 3 dots on top-right corner, tap on: Post you've liked.<br /><br />Bot work for you :D", buttons: [{ text: "OK" }] }).open();
                    list_actived_bot[tokens.instagram_username+"_"+tokens.bot_mode] = true;
                    instagrambot_start(json);
                } else {
                    app.dialog.create({ title: "Warning", text: "Google Chrome path doesn't exist, please install google chrome or chromium and retry", buttons: [{ text: "OK" }] }).open();
                }
            });
        });
    }
}

function instagram_save_2fa() {

    fs.writeFile(remoteapp.getPath("userData") + "/" + $("#instagram_username").val() + "_pin.txt", $("#instagram_2fapin").val(), function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function instagram_open_logs() {
    clearInterval(logs_interval);
    $("#logs").val("[INFO] Loading...");
    logs_interval = setInterval(function() {
        let logs = fs.readFileSync(remoteapp.getPath("userData") + "/" + $("#instagram_username").val() + "_" + $("#bot_mode").val() + ".log", "utf8");
        $("#logs").val(logs);
    }, 1000);
}

function instagram_check_bot_mode() {
    if ($("#bot_mode").val() == "likemode_classic") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, like 1 photo and stop X minutes in loop");
        $(".likemode_all").hide();
        $("#bot_superlike_n").val(3);
        $("#bot_followday").val(300);
        $("#bot_followrotate").val(30);
        $("#bot_commentsday").val(300);
        $("#bot_comment_mode").val("wow, beautiful, amazing, nice photo");
        $("#bot_likemode_competitor_users").val("ptkdev");
        $(".likemode_classic").show();
    } else if ($("#bot_mode").val() == "likemode_realistic") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, like 10-12 photo fast and stop X minutes in loop");
        $(".likemode_all").hide();
        $("#bot_superlike_n").val(3);
        $("#bot_followday").val(300);
        $("#bot_followrotate").val(30);
        $("#bot_commentsday").val(300);
        $("#bot_comment_mode").val("wow, beautiful, amazing, nice photo");
        $("#bot_likemode_competitor_users").val("ptkdev");
        $(".likemode_realistic").show();
    } else if ($("#bot_mode").val() == "likemode_superlike") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, go to author profile, like 3 (configurable) random photos, return to hashtag list for 10-11 times and stop X minutes in loop");
        $(".likemode_all").hide();
        $("#bot_followday").val(300);
        $("#bot_followrotate").val(30);
        $("#bot_commentsday").val(300);
        $("#bot_comment_mode").val("wow, beautiful, amazing, nice photo");
        $("#bot_likemode_competitor_users").val("ptkdev");
        $(".likemode_superlike").show();
    } else if ($("#bot_mode").val() == "likemode_competitor_users") {
        $(".bot_mode_desc").html("(Bot go to competitor account, like photos of his followers (10-12 photo fast and stop X minutes in loop))");
        $(".likemode_all").hide();
        $("#bot_superlike_n").val(3);
        $("#bot_followday").val(300);
        $("#bot_followrotate").val(30);
        $("#bot_commentsday").val(300);
        $("#bot_comment_mode").val("wow, beautiful, amazing, nice photo");
        $(".likemode_competitor_users").show();
    } else if ($("#bot_mode").val() == "comment_mode") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, leave random comments from comments-list");
        $(".likemode_all").hide();
        $("#bot_superlike_n").val(3);
        $("#bot_followday").val(300);
        $("#bot_followrotate").val(30);
        $("#bot_likemode_competitor_users").val("ptkdev");
        $(".comment_mode").show();
    } else if ($("#bot_mode").val() == "fdfmode_classic") {
        $(".bot_mode_desc").html("Bot go to random hashtag from list, follow 30 users fast at 31 defollow first followed (number 1), follow 32, defollow number 2, in loop.");
        $(".likemode_all").hide();
        $("#bot_superlike_n").val(3);
        $("#bot_commentsday").val(300);
        $("#bot_comment_mode").val("wow, beautiful, amazing, nice photo");
        $("#bot_likemode_competitor_users").val("ptkdev");
        $(".fdfmode_classic").show();
    }
}

function instagram_check_hashtag() {
    return 1;
}

function instagram_check_superlike_n() {
    if ($("#bot_mode").val() == "likemode_superlike" && (parseInt($("#bot_superlike_n").val() * $("#bot_likeday_max").val()) >= 1000)) {
        app.dialog.create({ title: "Warning", text: $("#bot_superlike_n").val() + "x" + $("#bot_likeday_max").val() + "= is more than 1000 like/day. App restore default value.", buttons: [{ text: "OK" }] }).open();

        $("#bot_superlike_n").val(3);
        $("#bot_likeday_max").val(300);

        return 1;
    }

    return 0;
}

function instagram_check_max_like() {
    if ($("#bot_mode").val() == "likemode_superlike" && (parseInt($("#bot_superlike_n").val() * $("#bot_likeday_max").val()) >= 1000)) {
        app.dialog.create({ title: "Warning", text: $("#bot_superlike_n").val() + "x" + $("#bot_likeday_max").val() + "= is more than 1000 like/day. App restore default value.", buttons: [{ text: "OK" }] }).open();

        $("#bot_superlike_n").val(3);
        $("#bot_likeday_max").val(300);

        return 1;
    } else if ($("#bot_likeday_max").val() != "" && parseInt($("#bot_likeday_max").val()) > 1000) {
        $("#bot_likeday_max").val(900);

        app.dialog.create({ title: "Warning", text: "Instagram ban you if like more than 1000 photos/day. App restore default value.", buttons: [{ text: "OK" }] }).open();

        return 1;
    }

    return 0;
}


function instagram_check_likemode_competitor_users() {
    if ($("#bot_likemode_competitor_users").val() == "") {
        app.dialog.create({ title: "Warning", text: "Insert competitor username, restore default value", buttons: [{ text: "OK" }] }).open();

        $("#bot_likemode_competitor_users").val("ptkdev");

        return 1;
    }

    return 0;
}

function instagram_check_followrotate() {
    if ($("#bot_followrotate").val() > 3000) {
        app.dialog.create({ title: "Warning", text: "Value is overcapacity, restore default value", buttons: [{ text: "OK" }] }).open();

        $("#bot_followrotate").val(30);

        return 1;
    }

    return 0;
}

function instagram_check_followday() {
    if ($("#bot_followday").val() > 500) {
        app.dialog.create({ title: "Warning", text: "Value is overcapacity, restore default value", buttons: [{ text: "OK" }] }).open();

        $("#bot_followday").val(300);

        return 1;
    }

    return 0;
}

function instagram_check_commentsday() {
    if ($("#bot_commentsday").val() > 600) {
        app.dialog.create({ title: "Warning", text: "Value is overcapacity, restore default value", buttons: [{ text: "OK" }] }).open();

        $("#bot_commentsday").val(300);

        return 1;
    }

    return 0;
}

function instagram_check_userwhitelist() {
    return 1;
}


function instagram_check_comment_mode() {
    return 1;
}

