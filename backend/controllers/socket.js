const socketIO = require("socket.io");

module.exports = (server) => {
    const io = socketIO(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {

        // Handle joining a chat room
        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
        });

        // Handle sending messages
        socket.on("sendMessage", (message) => {
            io.to(message.chat).emit("messageReceived", message);
        });

        socket.on("disconnect", () => { });
    });
};
