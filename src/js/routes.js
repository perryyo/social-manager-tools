let routes = [{
    path: "/",
    url: "./index.html",
},
{
    path: "/instagrambot/",
    url: "./pages/instagrambot.html",
},
{
    path: "/twitterbot/",
    url: "./pages/twitterbot.html",
},
{
    path: "/facebookpagebot/",
    url: "./pages/facebookpagebot.html",
},
{
    path: "/wordpresstelegrambot/",
    url: "./pages/wordpresstelegrambot.html",
},
{
    path: "/mediumtelegrambot/",
    url: "./pages/mediumtelegrambot.html",
},
    // Default route (404 page). MUST BE THE LAST
{
    path: "(.*)",
    url: "./index.html",
},
];