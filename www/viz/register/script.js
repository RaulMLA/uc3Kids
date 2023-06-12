visSocket.emit("VIS_CONNECTED");

visSocket.on("CTRL_LOGGED", function () {
    window.location.href = "/viz";
});
