const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");

app.use(cors);

let users = [];
let messages = [];
let index = 0;

io.on("connection", (socket) => {
  socket.emit("loggedIn", {
    users: users.map((s) => s.username),
    messages,
  });

  /* New User */

  socket.on("newUser", (username) => {
    console.log(`${username} has arrived.`);
    socket.username = username;
    users.push(socket);

    io.emit("userOnline", socket.username);
  });

  /* Messages */

  socket.on("msg", (msg) => {
    let message = {
      index,
      username: socket.username,
      msg,
    };
    messages.push(message);
    io.emit("msg", message);
    index++;
  });

  /* Disconnect */

  socket.on("disconnect", () => {
    console.log(`${socket.username} has left.`);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Listening on %s", process.env.PORT || 3000);
});
