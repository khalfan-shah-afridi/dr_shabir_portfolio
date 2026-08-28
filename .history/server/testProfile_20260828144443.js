const http = require("http");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste your JWT token: ", (token) => {
  const cleanToken = token.trim();

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/profile",
    method: "GET",

    headers: {
      Authorization: `Bearer ${cleanToken}`,
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

  req.end();
 });