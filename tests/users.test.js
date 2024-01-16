const request = require("supertest");

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

    expect(response.status).toEqual(500);
  });
});