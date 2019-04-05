import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import MainNavigation from "./components/navigation/MainNavigation";
import AuthContext from './context/auth-context';
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

class App extends Component {
  state = {
    token: null,
    user: null,
  }

  login = (token, user, expiration) => {
    this.setState({ token, user });
  };

  logout = () => {
    this.setState({ token: null, user: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              user: this.state.user,
              login: this.login,
              logout: this.logout
            }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/auth" to="/events" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                <Route path="/events" component={EventsPage} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
