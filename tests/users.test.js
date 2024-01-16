const request = require("supertest");
const database = require('../database');
const app = require("../src/app");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created users", async () => {
    const newUsers = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: "1",
      duration: 120,
    };

    const response = await request(app).post("/api/users").send(newUsers);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(422);
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
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("title");
    expect(userInDatabase.title).toStrictEqual(newUsers.title);
    // Repeat similar checks for other properties in the database
  });

  it("should return an error for incomplete users data", async () => {
    const userWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

      expect(response.status).toEqual(422);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      title: "Avatar",
      director: "James Cameron",
      year: "2010",
      color: "1",
      duration: 162,
    };

    const [result] = await database.query(
      "INSERT INTO users(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [newUser.title, newUser.director, newUser.year, newUser.color, newUser.duration]
    );

    const id = result.insertId;

    const updatedUser = {
      title: "Wild is life",
      director: "Alan Smithee",
      year: "2023",
      color: "0",
      duration: 120,
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [UserInDatabase] = users;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("title");
    expect(userInDatabase.title).toStrictEqual(updatedUser.title);

    expect(userInDatabase).toHaveProperty("director");
    expect(userInDatabase.director).toStrictEqual(updatedUser.director);

    expect(userInDatabase).toHaveProperty("year");
    expect(userInDatabase.year).toStrictEqual(updatedUser.year);

    expect(userInDatabase).toHaveProperty("color");
    expect(userInDatabase.color).toStrictEqual(updatedUser.color);

    expect(userInDatabase).toHaveProperty("duration");
    expect(userInDatabase.duration).toStrictEqual(updatedUser.duration);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newUser = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});

describe('DELETE /api/users/:id', () => {
  it('should delete a user and return status 204', async () => {
    // Supposons que vous ayez déjà un ID d'utilisateur existant
    const existingUserId = 1;

    const response = await request(app).delete(`/api/users/${existingUserId}`);

    expect(response.status).toBe(204);
  });

  it('should return status 404 for non-existing user ID', async () => {
    // Supposons que vous ayez un ID d'utilisateur qui n'existe pas
    const nonExistingUserId = 999;

    const response = await request(app).delete(`/api/users/${nonExistingUserId}`);

    expect(response.status).toBe(404);
  });
});