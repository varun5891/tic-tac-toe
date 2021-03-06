import express from 'express';
import router from './server/routes/index.js';
import userRoutes from './server/routes/user.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './server/models/index.js';
import dotenv from "dotenv";
dotenv.config();
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});



var corsOptions = {
    origin: "http://localhost:5000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.use('/', router);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes)

//For Database Connection
const Role = db.role;

db.mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB...!!");
        initial();
    })
    .catch(err => {
        console.error("Connection error...!!", err);
        process.exit();
    });

// Database Function 
const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'admin' to roles collection");
            });
        }
    });
}

// set port, listen for requests
const PORT = process.env.PORT || 5000;

const HOST = "localhost";

httpServer.listen(PORT, HOST, () => {
    console.log(`Listening to ${HOST}:${PORT}`);
})

var players = {}; // It will keep all the players data who have register using mobile number. you can use actual persistence database I have used this for temporery basis  
var sockets = {}; // stores all the connected clients  
var games = {}; // stores the ongoing game  
var winCombinations = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
]; // game winning combination index   

io.on('connection', client => {
    console.log("connected : " + client.id);
    client.emit('connected', { "id": client.id }); // STEP 5 ::=> Notify request cllient that it is not connected with server  

    // STEP 6 ::=> It is a event which will handle user registration process  
    client.on('checkUserDetail', data => {
        var flag = false;
        for (var id in sockets) {
            if (sockets[id].userName === data.userName) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            sockets[client.id] = {
                userName: data.userName,
                is_playing: false,
                game_id: null
            };

            var flag1 = false;
            for (var id in players) {
                if (id === data.userName) {
                    flag1 = true;
                    break;
                }
            }
            if (!flag1) {
                players[data.userName] = {
                    played: 0,
                    won: 0,
                    draw: 0
                };
            }

        }
        client.emit('checkUserDetailResponse', !flag);
    });

    // STEP 7 ::=> It will send all the players who are online and avalable to play the game  
    client.on('getOpponents', data => {
        var response = [];
        for (var id in sockets) {
            if (id !== client.id && !sockets[id].is_playing) {
                response.push({
                    id: id,
                    userName: sockets[id].userName,
                    played: players[sockets[id].userName].played,
                    won: players[sockets[id].userName].won,
                    draw: players[sockets[id].userName].draw
                });
            }
        }
        client.emit('getOpponentsResponse', response);
        client.broadcast.emit('newOpponentAdded', {
            id: client.id,
            userName: sockets[client.id].userName,
            played: players[sockets[client.id].userName].played,
            won: players[sockets[client.id].userName].won,
            draw: players[sockets[client.id].userName].draw
        });
    });

    // STEP 8 ::=> When Client select any opponent to play game then it will generate new game and return playboard to play the game. New game starts here  
    client.on('selectOpponent', data => {
        var response = { status: false, message: "Opponent is playing with someone else." };
        if (!sockets[data.id].is_playing) {
            var gameId = uuidv4();
            sockets[data.id].is_playing = true;
            sockets[client.id].is_playing = true;
            sockets[data.id].game_id = gameId;
            sockets[client.id].game_id = gameId;
            players[sockets[data.id].userName].played = players[sockets[data.id].userName].played + 1;
            players[sockets[client.id].userName].played = players[sockets[client.id].userName].played + 1;

            games[gameId] = {
                player1: client.id,
                player2: data.id,
                whose_turn: client.id,
                playboard: [["", "", ""], ["", "", ""], ["", "", ""]],
                game_status: "ongoing", // "ongoing","won","draw"  
                game_winner: null, // winner_id if status won  
                winning_combination: []
            };
            games[gameId][client.id] = {
                userName: sockets[client.id].userName,
                sign: "x",
                played: players[sockets[client.id].userName].played,
                won: players[sockets[client.id].userName].won,
                draw: players[sockets[client.id].userName].draw
            };
            games[gameId][data.id] = {
                userName: sockets[data.id].userName,
                sign: "o",
                played: players[sockets[data.id].userName].played,
                won: players[sockets[data.id].userName].won,
                draw: players[sockets[data.id].userName].draw
            };
            
            io.sockets.sockets.get(client.id).join(gameId);
            io.sockets.sockets.get(data.id).join(gameId);
            io.emit('excludePlayers', [client.id, data.id]);
            io.to(gameId).emit('gameStarted', { status: true, game_id: gameId, game_data: games[gameId] });

        }
    });

    var gameBetweenSeconds = 10; // Time between next game  
    var gameBetweenInterval = null;

    // STEP 9 ::=> When Player select any cell then it will check all the necessory logic of Tic Tac Toe Game  
    client.on('selectCell', data => {
        games[data.gameId].playboard[data.i][data.j] = games[data.gameId][games[data.gameId].whose_turn].sign;

        var isDraw = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (games[data.gameId].playboard[i][j] == "") {
                    isDraw = false;
                    break;
                }
            }
        }
        if (isDraw)
            games[data.gameId].game_status = "draw";


        for (let i = 0; i < winCombinations.length; i++) {
            var tempComb = games[data.gameId].playboard[winCombinations[i][0][0]][winCombinations[i][0][1]] + games[data.gameId].playboard[winCombinations[i][1][0]][winCombinations[i][1][1]] + games[data.gameId].playboard[winCombinations[i][2][0]][winCombinations[i][2][1]];
            if (tempComb === "xxx" || tempComb === "ooo") {
                games[data.gameId].game_winner = games[data.gameId].whose_turn;
                games[data.gameId].game_status = "won";
                games[data.gameId].winning_combination = [[winCombinations[i][0][0], winCombinations[i][0][1]], [winCombinations[i][1][0], winCombinations[i][1][1]], [winCombinations[i][2][0], winCombinations[i][2][1]]];
                players[games[data.gameId][games[data.gameId].game_winner].userName].won++;
            }
        }
        if (games[data.gameId].game_status == "draw") {
            players[games[data.gameId][games[data.gameId].player1].userName].draw++;
            players[games[data.gameId][games[data.gameId].player2].userName].draw++;
        }
        games[data.gameId].whose_turn = games[data.gameId].whose_turn == games[data.gameId].player1 ? games[data.gameId].player2 : games[data.gameId].player1;
        io.to(data.gameId).emit('selectCellResponse', games[data.gameId]);

        if (games[data.gameId].game_status == "draw" || games[data.gameId].game_status == "won") {
            gameBetweenSeconds = 10;
            gameBetweenInterval = setInterval(() => {
                gameBetweenSeconds--;
                io.to(data.gameId).emit('gameInterval', gameBetweenSeconds);
                if (gameBetweenSeconds == 0) {
                    clearInterval(gameBetweenInterval);

                    var gameId = uuidv4();
                    sockets[games[data.gameId].player1].game_id = gameId;
                    sockets[games[data.gameId].player2].game_id = gameId;
                    players[sockets[games[data.gameId].player1].userName].played = players[sockets[games[data.gameId].player1].userName].played + 1;
                    players[sockets[games[data.gameId].player2].userName].played = players[sockets[games[data.gameId].player2].userName].played + 1;

                    games[gameId] = {
                        player1: games[data.gameId].player1,
                        player2: games[data.gameId].player2,
                        whose_turn: games[data.gameId].game_status == "won" ? games[data.gameId].game_winner : games[data.gameId].whose_turn,
                        playboard: [["", "", ""], ["", "", ""], ["", "", ""]],
                        game_status: "ongoing", // "ongoing","won","draw"  
                        game_winner: null, // winner_id if status won  
                        winning_combination: []
                    };
                    games[gameId][games[data.gameId].player1] = {
                        userName: sockets[games[data.gameId].player1].userName,
                        sign: "x",
                        played: players[sockets[games[data.gameId].player1].userName].played,
                        won: players[sockets[games[data.gameId].player1].userName].won,
                        draw: players[sockets[games[data.gameId].player1].userName].draw
                    };
                    games[gameId][games[data.gameId].player2] = {
                        userName: sockets[games[data.gameId].player2].userName,
                        sign: "o",
                        played: players[sockets[games[data.gameId].player2].userName].played,
                        won: players[sockets[games[data.gameId].player2].userName].won,
                        draw: players[sockets[games[data.gameId].player2].userName].draw
                    };
                    io.sockets.sockets.get(games[data.gameId].player1).join(gameId);
                    io.sockets.sockets.get(games[data.gameId].player2).join(gameId);

                    io.to(gameId).emit('nextGameData', { status: true, game_id: gameId, game_data: games[gameId] });

                    io.sockets.sockets.get(games[data.gameId].player1).leave(data.gameId);
                    io.sockets.sockets.get(games[data.gameId].player2).leave(data.gameId);
                    delete games[data.gameId];
                }
            }, 1000);
        }

    });

    // STEP 10 ::=> When any player disconnect then it will handle the disconnect process  
    client.on('disconnect', () => {
        console.log("disconnect : " + client.id);
        if (typeof sockets[client.id] != "undefined") {
            if (sockets[client.id].is_playing) {

                io.to(sockets[client.id].game_id).emit('opponentLeft', {});
                players[sockets[games[sockets[client.id].game_id].player1].userName].played--;
                players[sockets[games[sockets[client.id].game_id].player2].userName].played--;
                io.sockets.sockets.get(client.id == games[sockets[client.id].game_id].player1 ? games[sockets[client.id].game_id].player2 : games[sockets[client.id].game_id].player1).leave(sockets[client.id].game_id);
                delete games[sockets[client.id].game_id];
            }
        }
        delete sockets[client.id];
        client.broadcast.emit('opponentDisconnected', {
            id: client.id
        });
    });
});

// Generate Game ID  
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}