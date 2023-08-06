async function login(event) {
  try {
    event.preventDefault();

    const loginDetails = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    console.log(loginDetails);
    const response = await axios.post(
      "http://localhost:3000/user/login",
      loginDetails
    );

    localStorage.setItem("token", response.data.token);
    if (response.status === 201) {
      alert(response.data.message);
      window.location.href = "../ExpenseTracker/expense.html";
    } else {
      // alert(response.data.message);
      console.log(JSON.stringify(err));
      throw new Error(response.data.message);
    }
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err} </div>`;
  }
}

function forgotpassword() {
  window.location.href = "../ForgotPassword/index.html";
}
