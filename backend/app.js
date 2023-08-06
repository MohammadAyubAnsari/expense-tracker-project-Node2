const path = require("path");

const express = require("express");
var cors = require("cors");
const sequelize = require("./utils/database");
const User = require("./models/users");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user");
const purchaseRoutes = require("./routes/purchase");
const expenseRoutes = require("./routes/expense");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetpassword");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
