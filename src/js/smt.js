const fs = require("fs");
const remote = require("electron").remote;
const remoteapp = remote.app;
const Jtr = require("json-token-replace");
const jtr = new Jtr();
var list_actived_bot = [];
var logs_interval = null;
$.ajaxSetup({ cache: false });

function update_system() {
    $.get("https://api.ptkdev.io/v1/bot/social-manager-tools/version/?time=" + new Date().getTime(), function(version) {
        let current_version = require("../version").version;
        let download_url = "https://socialmanagertools.ptkdev.io/";
        if (process.platform === "linux") {
            download_url = "https://github.com/social-manager-tools/social-manager-tools/releases/download/" + version + "/Social.Manager.Tools-" + version + ".deb";
        } else if (process.platform === "win32") {
            download_url = "https://github.com/social-manager-tools/social-manager-tools/releases/download/" + version + "/Social.Manager.Tools-" + version + ".zip";
        } else if (process.platform === "darwin") {
            download_url = "https://github.com/social-manager-tools/social-manager-tools/releases/download/" + version + "/Social.Manager.Tools-" + version + ".dmg";
        }

        if (version != current_version) {
            app.dialog.create({ title: "Update available", text: "Your bot version is v" + current_version + ", is available v" + version + "<br /><br /><a href='" + download_url + "'>DOWNLOAD</a> | <a href='https://github.com/social-manager-tools/social-manager-tools/blob/master/CHANGELOG.md'>CHANGELOG</a>", buttons: [{ text: "OK" }] }).open();
        }
    });
}

setInterval(function() { update_system(); }, (43200 * 1000)); // 12h
update_system();
