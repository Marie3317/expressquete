const request = require("supertest");

const app = require("../src/app");

const crypto = require("node:crypto");

describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/movies", () => {
  it("should return created movie", async () => {
    const newMovie = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: "1",
      duration: 120,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    // Check existence and types of properties in the response body
    expect(response.body).toHaveProperty("title");
    expect(typeof response.body.title).toBe("string");

    expect(response.body).toHaveProperty("director");
    expect(typeof response.body.director).toBe("string");

    expect(response.body).toHaveProperty("year");
    expect(typeof response.body.year).toBe("string");

    expect(response.body).toHaveProperty("color");
    expect(typeof response.body.color).toBe("string");

    expect(response.body).toHaveProperty("duration");
    expect(typeof response.body.duration).toBe("number");

    // Check if the movie is correctly stored in the database
    const [result] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      response.body.id
    );

    const [movieInDatabase] = result;

    expect(movieInDatabase).toHaveProperty("id");
    expect(movieInDatabase).toHaveProperty("title");
    expect(movieInDatabase.title).toStrictEqual(newMovie.title);
    // Repeat similar checks for other properties in the database
  });

  it("should return an error for incomplete movie data", async () => {
    const movieWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .post("/api/movies")
      .send(movieWithMissingProps);

    expect(response.status).toEqual(500);
  });
});