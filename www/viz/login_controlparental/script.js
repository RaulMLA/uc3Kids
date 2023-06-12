visSocket.emit("CP_VIS_CONNECTED");

visSocket.on("CTRL_CP_LOGGED", function () {
    window.location.href = "../controlparental";
});
