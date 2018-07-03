// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_window;
//var app_icon, context_menu;

function create_window() {
    // Create the browser window.
    main_window = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "Social Manager Tools",
        icon: path.join(__dirname, "/src/img/smt_logo.png")
    });

    //app_icon = new Tray(path.join(__dirname, "/src/img/smt_logo.png"));

    context_menu = Menu.buildFromTemplate([{
        label: "Quit",
        click: function() {
            app.isQuiting = true;
            app.quit();
        }
    }]);



    // and load the index.html of the app.
    main_window.loadFile("src/index.html");

    // Open the DevTools.
    // main_window.webContents.openDevTools()
    // 

    /*app_icon.on("click", function(event) {
        event.preventDefault();
        if (main_window.isVisible())
            main_window.hide();
        else
            main_window.show();
    });

    app_icon.setContextMenu(context_menu);



    main_window.on("close", function(event) {
        event.preventDefault();
        main_window.hide();
    });

    main_window.on("minimize", function(event) {
        event.preventDefault();
        main_window.hide();
    });

    main_window.on("show", function() {
        app_icon.setHighlightMode("always");
    });*/

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
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.