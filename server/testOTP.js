const http = require("http");

const data = JSON.stringify({
  email: "fazalmir48@gmail.com",
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/send-otp",
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
  });
});

req.on("error", (error) => {
  console.error("Request failed:", error.message);
});

req.write(data);
req.end();