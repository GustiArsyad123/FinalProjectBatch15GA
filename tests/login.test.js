const request = require("supertest");
const app = require("../index");
const { user } = require("../models");
const { encodePin } = require("../utils/bcrypt");

beforeAll(async () => {
  const hashPassword = encodePin("12345TestingOke!");
  await user.create({
    userName: "Gusti123",
    email: "selamat@gmail.com",
    password: hashPassword,
  });
});
afterAll((done) => {
  user
    .destroy({ where: {}, force: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("User try to login:", () => {
  describe("Success:", () => {
    it("Should return 200 and access_token", (done) => {
      let input = {
        email: "selamat@gmail.com",
        password: "12345TestingOke!",
      };
      request(app)
        .post("/user/login")
        .send(input)
        .then((response) => {
          let { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("token");
          expect(typeof body.token).toBe("string");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
