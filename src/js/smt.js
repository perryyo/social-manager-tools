const fs = require("fs");

$.ajaxSetup({ cache: false });
$.get("https://api.ptkdev.io/v1/bot/social-manager-tools/version/?time=" + new Date().getTime(), function(version) {
    let current_version = require("../version").version;
    if (version != current_version) {
        app.dialog.create({ title: "Update available", text: "Your bot version is v" + current_version + ", is available v" + version + "<br /><br /><a href='https://socialmanagertools.ptkdev.io'>DOWNLOAD</a>", buttons: [{ text: "OK", }] }).open();
    }
});

function instagrambot_start(json) {
    save_config();
    const main = require("electron").remote.require("./main");
    main.instagrambot_start(json);
}

function get_user_form() {
    let tokens = {};
    tokens.instagram_username = $("#instagram_username").val();
    tokens.instagram_password = $("#instagram_password").val();
    tokens.instagram_hashtag = $("#instagram_hashtag").val();
    tokens.bot_mode = "likemode_realistic";
    tokens.executable_path = $("#executable_path").val();
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/ /g, "");
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/#/g, "");
    tokens.instagram_hashtag = tokens.instagram_hashtag.replace(/,/g, "\",\"");

    return tokens;
}

function load_config() {
    if ($("#executable_path").val() == "") {
        if (process.platform === "linux") {
            $("#executable_path").val("/usr/bin/google-chrome");
        } else if (process.platform === "win32") {
            $("#executable_path").val("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe");
        } else if (process.platform === "darwin") {
            $("#executable_path").val("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
        }
    }

    const remote = require("electron").remote;
    const app = remote.app;
    fs.exists(app.getPath("userData") + "/config_" + $("#instagram_username").val() + ".json", function(exists) {
        if (exists) {
            let data = fs.readFileSync(app.getPath("userData") + "/config_" + $("#instagram_username").val() + ".json", "utf8");
            let config = JSON.parse(data.toString());

            $("#instagram_password").val(config.instagram_password);
            $("#bot_mode").val("likemode_realistic");
            $("#executable_path").val(config.executable_path);
            $("#instagram_hashtag").val(config.instagram_hashtag.join());
        }
    });

}

function save_config(bot) {
    const remote = require("electron").remote;
    const app = remote.app;
    const Jtr = require("json-token-replace");
    const jtr = new Jtr();
    let tokens = get_user_form();
    let json = jtr.replace(tokens, require("../config.json"));

    fs.writeFile(app.getPath("userData") + "/config_" + tokens.instagram_username + ".json", JSON.stringify(json), function(err) {
        if (err)
            return console.log(err);

        if (bot === "instagram") {
            instagrambot_start(json);
        }
    });

}