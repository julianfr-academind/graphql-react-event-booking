import React, { Component } from "react";
import "./Auth.css";

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    let query = this.state.isLogin
      ? {
          query: `
      query {
        login(email:"${email}", password:"${password}") {
          user
          token
          expiration
        }
      }
      `
        }
      : {
          query: `
          mutation {
            createUser(user:{ email:"${email}", password:"${password}"}) {
              _id
              email
            }
          }
        `
        };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  render = () => (
    <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={this.emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl} />
      </div>
      <div className="form-actions">
        <button>Submit</button>
        <button type="button" onClick={this.switchHandler}>
          Switch to {this.state.isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
}

export default AuthPage;
