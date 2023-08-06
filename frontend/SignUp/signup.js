async function signup(event) {
  try {
    event.preventDefault();
    console.log(event.target.email.value);

    const signupDetails = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phNo: event.target.phonenumber.value,
    };

    console.log(signupDetails);
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      signupDetails
    );
    if (response.status === 201) {
      // redirecting the user on successful login
      alert(response.data.message);
      window.location.href = "../Login/login.html";
    } else if (response.status === 200) {
      alert(response.data.message);
      window.location.href = "../Login/login.html";
    } else {
      throw new Error("Failed to login");
    }
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;">${err} </div>`;
  }
}
