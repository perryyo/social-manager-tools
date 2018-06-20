$.get("http://api.ptkdev.io/v1/bot/social-manager-tools/version/", function(version) {
    let current_version = require("../version").version;
    if (version != current_version) {
        app.dialog.create({ title: "Update available", text: "Your bot version is v" + current_version + ", is available v" + version, buttons: [{ text: "OK", }] }).open();
    }
});