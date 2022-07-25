const express = require("express");
const cors = require('cors');
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
const BooksRoute = require("./api/routes/books");
const CategoryRoute = require("./api/routes/category");
const AccountRoute = require("./api/routes/account");
const ImagesRoute = require("./api/routes/images");
const AuthRoute = require("./api/routes/auth");
const CartRoute = require("./api/routes/cart");
const OrderRoute = require("./api/routes/order");
const ConversationRoute = require("./api/routes/conversations");

var app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

app.use("/api/Books", BooksRoute);
app.use("/api/Category", CategoryRoute);
app.use("/api/Account", AccountRoute);
app.use("/api/image", ImagesRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/cart", CartRoute);
app.use("/api/order", OrderRoute);
app.use("/api/chat", ConversationRoute);

const port = process.env.PORT || 3000;
var server = app.listen(port, () => {
    console.log("Backend server is running!");
    console.log("localhost:" + port);
});
//Connect to MongoDB
Mongoose.connect(
    "mongodb+srv://tuanvu1607:vu16072000@cluster0.um3as.mongodb.net/BookStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    () => {
        console.log("Connected to MongoDB");
    }
);

//Connect Socket
let adminId = [];
let clientId = [];
console.log(server);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("user-connect");
    // socket.on("admin-connect", () => {
    //     if (!adminId.includes(socket.id)) {
    //         adminId.push(socket.id);
    //     }
    // });
    socket.on("clientChat", () => {
        console.log("push-to-admin");
        if (!clientId.includes(socket.id)) {
            clientId.push(socket.id);
        }
        socket.emit("forwardToAdmin", "hello");
    });
    socket.on("adminChat", () => {
        console.log("push-to-client");
        if (!adminId.includes(socket.id)) {
            adminId.push(socket.id);
        }
        socket.emit("newMessageFromAdmin", "hello");
    });
});