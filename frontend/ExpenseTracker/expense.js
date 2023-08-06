function addNewExpense(event) {
  event.preventDefault();

  const expenseDetails = {
    expenseamount: event.target.expenseamount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };
  console.log(expenseDetails);
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:3000/expense/addexpense", expenseDetails, {
      headers: { Authorization: token },
    })
    .then((response) => {
      addNewExpensetoUI(response.data.expense);
    })
    .catch((err) => {
      showError(err);
    });
}

function showPremiumUserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  console.log(decodedToken);
  const isadmin = decodedToken.ispremiumuser;
  if (isadmin) {
    showPremiumUserMessage();
    showLeaderboard();
    download();
  }
  axios
    .get("http://localhost:3000/expense/getexpenses", {
      headers: { Authorization: token },
    })
    .then((response) => {
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });
    })
    .catch((err) => {
      showError(err);
    });
});

function addNewExpensetoUI(expense) {
  const parentElement = document.getElementById("listOfExpenses");
  console.log(parentElement);
  const expenseElemId = `expense-${expense.id}`;
  const children = `
    <li id=${expenseElemId}>
        ${expense.expenseamount} - ${expense.category} - ${expense.description}
        <button onclick='deleteExpense(event,${expense.id})'>
        Delete Expense
        </button>
    </li>
  `;
  parentElement.innerHTML = children + parentElement.innerHTML;
}

function deleteExpense(event, expenseid) {
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeExpensefromUI(expenseid);
    })
    .catch((err) => {
      showError(err);
    });
}

function showError(err) {
  document.body.innerHTML += `<div style="color:red;">${err}</div>`; // changes made
}

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get(
      "http://localhost:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);

    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML += "<h1> Leader Board </<h1>";
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li>Name - ${
        userDetails.name
      } Total Expense - ${userDetails.totalExpenses || 0} </li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

function download() {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      showError(err);
    });
}

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    name: "Demo",
    order_id: response.data.order.id, // For one time payment
    prefill: {
      name: "Ayub",
      email: "mdayubansari2014@gmail.com",
      contact: "7008416089",
    },
    theme: {
      color: "#3399cc",
    },
    // This handler function will handle the success payment
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("You are a Premium User Now");
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "You are a premium user";
      // localStorage.setItem("isadmin", true);
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
      download();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
};
