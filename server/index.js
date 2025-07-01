const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Extra files
const authRoutes = require("./routers/auth.routes");
const userRoutes = require("./routers/user.routes");
const taskRoutes = require("./routers/task.routes");
const { logError, errorHandler } = require("./middlewares/error.handler");
const { config } = require('./config/config');

const app = express();
const port = config.port || 3060;
// MiddleWares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(logError);
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/home", (req, res) => {
  res.send('ONINE')
});

app.listen(port, () => {
  console.log(`LISTENING PORT: ${port}`);
});
