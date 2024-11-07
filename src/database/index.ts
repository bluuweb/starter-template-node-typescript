import { Sequelize } from "sequelize";

declare const global: {
  sequelizeGlobal: Sequelize | undefined;
};

const sequelize =
  global.sequelizeGlobal ??
  new Sequelize({
    dialect: "sqlite",
    storage: "src/db.sqlite",
  });

if (process.env.NODE_ENV !== "production") {
  global.sequelizeGlobal = sequelize;
}

export default sequelize;
