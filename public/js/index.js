// Google Analytics
function loadAnalytics() {
    if (window.location.hostname === "localhost") {
        console.log("[GoogleAnalytics] Initialization called")
        return
    }
    window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
    ga('create', 'UA-162994094-2', 'auto');
    ga('send', 'pageview');
    var gascript = document.createElement("script");
    gascript.async = true;
    gascript.src = "https://www.google-analytics.com/analytics.js";
    document.getElementsByTagName("head")[0].appendChild(gascript, document.getElementsByTagName("head")[0]);
}

if (document.cookie.indexOf("cookieconsent_status") !== -1 && !localStorage.getItem("password")) {
    loadAnalytics()
}

window.cookieconsent.initialise({
    "palette": {
        "popup": {
            "background": "#343c66",
            "text": "#cfcfe8"
        },
        "button": {
            "background": "#f71559"
        }
    },
    "theme": "classic",
    "position": "bottom-left",
    onStatusChange: loadAnalytics
});

// Counter animation
const duration = 1000
document.querySelectorAll("*[data-counter]").forEach(node => {
    anime({
        targets: node,
        textContent: [0, node.textContent],
        easing: "easeOutSine",
        duration,
        round: 1
    })
})