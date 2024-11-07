import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import sequelize from "./database";
import { notFound } from "./middlewares/not-found.middleware";

import userRoute from "./routes/user.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/users", userRoute);

app.use(notFound);

const main = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};

main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
