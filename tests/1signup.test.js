const request = require("supertest");
const {
  user,
} = require("/home/cryptography/Documents/Glints Academy Batch 15/Back-End/Final Project/backend/models");
const app = require("../index");

const { encodePin } = require("../utils");

// beforeAll(async () => {
//   let users = await user.create({
//     email: "selamat@gmail.com",
//     userName: "Gusti123",
//     password: "12345TestingOke!",
//     confirmPassword: "12345TestingOke!",
//   });
// });
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

describe("user signup", () => {
  describe("Successfully create user", () => {
    it("Should return 201 and obj (user)", (done) => {
      const hashPassword = encodePin("12345TestingOke!");
      let input = {
        email: "selamat@gmail.com",
        userName: "Gusti123",
        password: hashPassword,
        confirmPassword: hashPassword,
      };
      request(app)
        .post("/user/signup")
        .send(input)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("data");
          expect(body.data).toMatchObject({
            userName: "Gusti123",
            email: "selamat@gmail.com",
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("Email already registered", () => {
    it("Should return 400 and error messages", (done) => {
      let input = {
        email: "selamat@gmail.com",
        userName: "Gusti123",
        password: "12345TestingOke!",
        confirmPassword: "12345TestingOke!",
      };
      request(app)
        .post("/user/signup")
        .send(input)
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(400);
          expect(body).toHaveProperty("errors");
          expect(body.errors).toContain(
            "Cannot register, username was registered",
            "Cannot register, email was registered"
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
