const express = require("express");
const http = require("http");
const socketHandler = require("./controllers/socket");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

connectDB();
const app = express();
const server = http.createServer(app);
socketHandler(server);

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chats", require("./routes/chatRoute"));
app.use("/api/messages", require("./routes/messageRoute"));

// Start the server
server.listen(process.env.PORT, () => 
  console.log(`Server running on port http://localhost:${process.env.PORT}`)
);
