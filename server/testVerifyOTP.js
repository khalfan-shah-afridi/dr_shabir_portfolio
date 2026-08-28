const http = require("http");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the OTP you received in your email: ", (otp) => {
  const data = JSON.stringify({
    email: "fazalmir48@gmail.com",
    otp: otp.trim(),
  });

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/verify-otp",
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      console.log("Status Code:", res.statusCode);
      console.log("Response:", body);
      rl.close();
    });
  });

  req.on("error", (error) => {
    console.error("Request failed:", error.message);
    rl.close();
  });

  req.write(data);
  req.end();
});