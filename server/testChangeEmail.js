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

    req.on("error", (error) => {
      reject(error);
    });

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
// CHANGE EMAIL
// ==========================================
async function changeEmail(
  newEmail,
  currentPassword,
  otp,
  accessToken
) {
  const data = JSON.stringify({
    newEmail,
    currentPassword,
    otp,
  });

  return await sendRequest(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/change-email",
      method: "PUT",
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
  console.log("");
  console.log("==========================================");
  console.log(" CHANGE ADMIN EMAIL");
  console.log("==========================================");
  console.log("");

  try {
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

    rl.question(
      "Enter your NEW email address: ",
      (newEmailInput) => {
        const newEmail = newEmailInput
          .trim()
          .toLowerCase();

        rl.question(
          "Enter your CURRENT password: ",
          (currentPassword) => {
            rl.question(
              "Enter the OTP sent to your NEW email: ",
              async (otpInput) => {
                try {
                  const otp = otpInput.trim();

                  if (
                    !newEmail.includes("@") ||
                    !newEmail.includes(".")
                  ) {
                    console.log(
                      "Invalid email address."
                    );

                    rl.close();
                    return;
                  }

                  if (!otp) {
                    console.log(
                      "OTP is required."
                    );

                    rl.close();
                    return;
                  }

                  console.log("");
                  console.log(
                    "Changing admin email..."
                  );

                  const response =
                    await changeEmail(
                      newEmail,
                      currentPassword,
                      otp,
                      accessToken
                    );

                  console.log(
                    "Status Code:",
                    response.statusCode
                  );

                  console.log(
                    "Response:",
                    JSON.stringify(
                      response.body
                    )
                  );

                  if (
                    response.statusCode === 200
                  ) {
                    console.log("");
                    console.log(
                      "=========================================="
                    );
                    console.log(
                      "EMAIL CHANGED SUCCESSFULLY"
                    );
                    console.log(
                      "=========================================="
                    );
                    console.log(
                      `New Admin Email: ${newEmail}`
                    );
                    console.log(
                      "All refresh sessions were revoked."
                    );
                    console.log(
                      "Please login again using the new email."
                    );
                  }
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
        );
      }
    );
  } catch (error) {
    console.error(
      "Unexpected error:",
      error.message
    );

    rl.close();
  }
}

main();