// Theme
var theme = "auto";
if (document.location.search.indexOf("theme=") >= 0) {
    theme = document.location.search.split("theme=")[1].split("&")[0];
}

// Init App
var app = new Framework7({
    id: "io.framework7.testapp",
    root: "#app",
    theme: theme,
    routes: routes
});

let shell = require("electron").shell;
document.addEventListener("click", function(event) {
    if (event.target.tagName === "A" && event.target.href.startsWith("http")) {
        event.preventDefault();
        shell.openExternal(event.target.href);
    }
});

var $ = require("jquery");