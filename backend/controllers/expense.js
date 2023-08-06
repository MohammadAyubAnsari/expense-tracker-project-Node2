const Expense = require("../models/expense");
const sequelize = require("../utils/database");
const User = require("../models/users");

exports.addexpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { expenseamount, description, category } = req.body;

    if (expenseamount == undefined || expenseamount.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Parameters missing" });
    }

    const expense = await Expense.create(
      { expenseamount, description, category, userId: req.user.id },
      { transaction: t }
    );
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

    await User.update(
      {
        totalExpenses: totalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).json({ expense: expense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};

exports.getexpenses = (req, res) => {
  Expense.findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      return res.status(200).json({ expenses, success: true });
    })
    .catch((err) => {
      return res.status(500).json({ error: err, success: false });
    });
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { expenseid, expenseamount } = req.params;
    // const expenseamount = req.params.expenseamount;
    if (expenseid == undefined || expenseid === 0) {
      res.status(400).json({ success: false, message: "Bad Parameters" });
    }
    const expense = await Expense.destroy(
      { where: { id: expenseid, userId: req.user.id } },
      { transaction: t }
    );

    // console.log(req.user.totalExpenses);
    // const totalExpense = Number(req.user.totalExpenses) - Number(expenseamount);

    // await User.update(
    //   {
    //     totalExpenses: totalExpense,
    //   },
    //   {
    //     where: { id: req.user.id },
    //     transaction: t,
    //   }
    // );
    // await t.commit();
    // res.status(200).json({ expense: expense });
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ success: true, message: "Failed" });
  }
};
