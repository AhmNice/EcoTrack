import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connect_to_database } from "./src/db/db.connect.js";
import authRoute from "./src/routes/auth.route.js";
import issueRoute from "./src/routes/issue.route.js";
import reportRoute from "./src/routes/report.route.js";
import voteRoute from "./src/routes/vote.route.js";
import commentRouter from "./src/routes/comment.route.js";
import OrganizationRoute from "./src/routes/organization.route.js";
import notificationRoute from "./src/routes/notification.route.js";
import auditLogRoute from "./src/routes/auditlog.route.js";
import statRoute from "./src/routes/stat.route.js";
dotenv.config();

if (!process.env.PORT) throw new Error("PORT not set in .env");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not set in .env");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Server is active");
});
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});
app.use('/api/auth', authRoute)
app.use("/api/issues", issueRoute)
app.use("/api/reports", reportRoute)
app.use("/api/votes", voteRoute)
app.use("/api/comments", commentRouter)
app.use("/api/organizations", OrganizationRoute)
app.use("/api/notifications", notificationRoute)
app.use("/api/audit-logs", auditLogRoute)
app.use("/api/statistics", statRoute)
const startServer = async () => {
  console.log("🔄 Starting server...");
  try {
    await connect_to_database();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} 🌐`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};
startServer();
