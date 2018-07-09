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
    // Default route (404 page). MUST BE THE LAST
{
    path: "(.*)",
    url: "./index.html",
},
];