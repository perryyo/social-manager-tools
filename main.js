// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_window;
let app_icon, context_menu;

require("electron-context-menu")({
    prepend: (params, browserWindow) => [{
        labels: {
            cut: "Configured Cut",
            copy: "Configured Copy",
            paste: "Configured Paste"
        },

        // Only show it when right-clicking images
        visible: params.mediaType === "input"
    }]
});

function create_window() {
    // Create the browser window.
    main_window = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "Social Manager Tools",
        icon: path.join(__dirname, "/src/img/smt_logo.png")
    });

    if (process.platform == "win32") {
        app_icon = new Tray(path.join(__dirname, "/src/img/smt_logo.ico"));
    } else if (process.platform != "darwin") {
        app_icon = new Tray(path.join(__dirname, "/src/img/smt_logo.png"));
    }

    if (process.platform != "darwin") {
        context_menu = Menu.buildFromTemplate([{
            label: "Quit",
            click: function() {
                app.isQuiting = true;
                app.quit();
            }
        }]);
    }

    main_window.loadFile("src/index.html");

    if (process.platform != "darwin") {
        app_icon.on("click", function(event) {
            event.preventDefault();
            if (main_window.isVisible()) {
                main_window.hide();
            } else {
                main_window.show();
            }
        });

        main_window.on("minimize", function(event) {
            event.preventDefault();
            main_window.hide();
        });

        main_window.on("show", function() {
            app_icon.setHighlightMode("always");
        });

        app_icon.setContextMenu(context_menu);
    }

    // Emitted when the window is closed.
    main_window.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        main_window = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", create_window);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    app.quit();
});

app.on("activate", function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (main_window === null) {
        create_window();
    }
});

exports.instagrambot_start = (json) => {

    let config = json;
    let Bot = require("instagrambotlib");
    let bot = new Bot(config);
    bot.start();
};

exports.twitterbot_start = (json) => {

    let config = json;
    let Bot = require("twitterbotlib");
    let bot = new Bot(config);
    bot.start();
};