const http = require("http");
const readline = require("readline");

const ADMIN_EMAIL = "fazalmir48@gmail.com";
const ADMIN_PASSWORD = "@afridi1234";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ==========================================
// HTTP REQUEST HELPER
// ==========================================
function sendRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        let parsedBody;

        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = {
            raw: body,
          };
        }

        resolve({
          statusCode: res.statusCode,
          body: parsedBody,
        });
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

// ==========================================
// LOGIN
// ==========================================
async function loginAdmin() {
  const data = JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  return await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    },
    data
  );
}

// ==========================================
// SEND CHANGE EMAIL OTP
// ==========================================
async function sendChangeEmailOTP(
  newEmail,
  accessToken
) {
  const data = JSON.stringify({
    newEmail,
  });

  return await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/send-change-email-otp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Length": Buffer.byteLength(data),
      },
    },
    data
  );
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  rl.question(
    "Enter your NEW email address: ",
    async (input) => {
      try {
        const newEmail = input.trim().toLowerCase();

        if (
          !newEmail.includes("@") ||
          !newEmail.includes(".")
        ) {
          console.log("Invalid email address.");
          rl.close();
          return;
        }

        console.log("");
        console.log("Logging in...");

        const loginResponse = await loginAdmin();

        console.log(
          "Login Status:",
          loginResponse.statusCode
        );

        if (
          loginResponse.statusCode !== 200 ||
          !loginResponse.body.accessToken
        ) {
          console.log(
            "Login failed:",
            JSON.stringify(loginResponse.body)
          );
          rl.close();
          return;
        }

        const accessToken =
          loginResponse.body.accessToken;

        console.log(
          "Fresh Access Token fetched successfully."
        );

        console.log("");
        console.log(
          `Sending OTP to ${newEmail}...`
        );

        const otpResponse =
          await sendChangeEmailOTP(
            newEmail,
            accessToken
          );

        console.log(
          "OTP Status:",
          otpResponse.statusCode
        );

        console.log(
          "OTP Response:",
          JSON.stringify(otpResponse.body)
        );
      } catch (error) {
        console.error(
          "Request failed:",
          error.message
        );
      } finally {
        rl.close();
      }
    }
  );
}

main();