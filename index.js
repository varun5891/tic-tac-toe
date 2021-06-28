import express from 'express';
import router from './server/routes/index.js';
import userRoutes from './server/routes/user.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './server/models/index.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();


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

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
})