const express = require("express");
const app = express();
app.use(express.json());


// Ajout des routes pour les movies
const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.post("/api/movies", movieControllers.postMovie);
app.put("/api/movies/:id", movieControllers.updateMovie);
app.delete("/api/movies/:id", movieControllers.deleteMovie);

// Ajout des routes pour les utilisateurs
const userControllers = require('./controllers/userControllers');

app.get('/api/users', userControllers.getUsers);
app.get('/api/users/:id', userControllers.getUserById);
app.post("/api/users", userControllers.postUsers);
app.put("/api/users/:id", userControllers.updateUsers);
app.delete("/api/users/:id", userControllers.deleteUsers);

module.exports = app;