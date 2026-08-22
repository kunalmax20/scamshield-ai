import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "MONGODB_URI=mongodb+srv://k80658092_db_user:EsLxLb3DUOeMl9ZV@cluster0.tarp2bu.mongodb.net/?appName=Cluster0",
  jwtSecret: process.env.JWT_SECRET || "fallback_jwt_secret_dev_only",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  aiApiKey: process.env.AI_API_KEY || "",
};
