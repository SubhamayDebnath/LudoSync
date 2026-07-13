import app from "./app.js";
import envConfig from "./config/env.js";
import connectDatabase from "./config/database.js";

const PORT = envConfig.PORT;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database and start server:", error);
    process.exit(1);
  }
};

startServer();
