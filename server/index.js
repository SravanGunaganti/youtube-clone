import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { channelRoutes } from "./routes/channel.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";

import { globalErrorHandler } from "./middlewares/errorHandlers.js";
import { invalidRouteHandler } from "./middlewares/errorHandlers.js";
import { malformedJSONHandler } from "./middlewares/errorHandlers.js";
import { mongooseValidationHandler } from "./middlewares/errorHandlers.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors({
    origin: ["https://youtube-clone-smoky-eta.vercel.app/","https://youtube-clone-j8ngx8t88-sravangunagantis-projects.vercel.app/","https://youtube-clone-git-main-sravangunagantis-projects.vercel.app/", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }));
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Mern Youtube Clone API" });
});




userRoutes(app);
videoRoutes(app);
channelRoutes(app);
commentRoutes(app);

app.use(malformedJSONHandler)
app.use(mongooseValidationHandler)
app.use(invalidRouteHandler)
app.use(globalErrorHandler)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
