const http = require("http");

// ==========================================
// FRESH ACCESS TOKEN
// ==========================================
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2Q1YjQzY2QxY2I0MDBiNGU1YzMyMiIsImVtYWlsIjoiZmF6YWxtaXI0OEBnbWFpbC5jb20iLCJpYXQiOjE3ODY2MTM1NDIsImV4cCI6MTc4NjYxNDQ0Mn0.wu_IPIr4HPDeYGTyZMnKbpkDQkRcHnzszn_S6L-kvjE";

// ==========================================
// CHANGE PASSWORD DATA
// ==========================================
const data = JSON.stringify({
  currentPassword: "@afridi123",
  newPassword: "@afridi1234",
  confirmPassword: "@afridi1234",
});

// ==========================================
// REQUEST OPTIONS
// ==========================================
const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/change-password",
  method: "PUT",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Length": Buffer.byteLength(data),
  },
};

// ==========================================
// SEND REQUEST
// ==========================================
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

// ==========================================
// ERROR HANDLER
// ==========================================
req.on("error", (error) => {
  console.error("Request failed:", error.message);
});

// ==========================================
// SEND DATA
// ==========================================
req.write(data);
req.end();