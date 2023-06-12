visSocket.on("connect", function () {
    visSocket.emit("MAIN_CONNECTED");
});

visSocket.on("CTRL_CONNECTED", function () {
    window.location.href = "/viz/register";
});
