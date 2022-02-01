import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Category from "./pages/Category";
import Documents from "./pages/Documents";
import managemenetDocument from "./pages/managemenetDocument";
import CreateDocument from "./pages/CreateDocument";
import UpdateDocument from "./pages/UpdateDocument";
import createCategory from "./pages/createCategory";
import managementCategory from "./pages/managementCategory";
import searchDocument from "./pages/searchDocument";
import changeCategoty from "./pages/changeCategoty";
import notFound from "./pages/notFound";

function App() {
  const [isLogin, setLogin] = useState(false);

  const logout = () => {
    setLogin(false);
  };

  const login = () => {
    setLogin(true);
  };

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("accsess_token") ? ( // your auth mechanism goes here
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );

  return (
    <div className="App">
      <Router>
        <Header isLogin={isLogin} logout={logout} />
        <br></br>
        <br></br>
        <br></br>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/login"
            component={Login}
            isLogin={isLogin}
            login={login}
          />
          <Route exact path="/category/:id" component={Category} />
          <Route exact path="/document/:id" component={Documents} />
          <Route exact path="/search/:name" component={searchDocument} />
          <PrivateRoute
            exact
            path="/management/document"
            component={managemenetDocument}
          />
          <Route
            exact
            path="/management/document/create"
            component={CreateDocument}
          />
          <Route
            exact
            path="/management/document/update/:id"
            component={UpdateDocument}
          />
          <PrivateRoute
            exact
            path="/management/category"
            component={managementCategory}
          />
          <Route
            exact
            path="/management/category/create"
            component={createCategory}
          />
          <Route
            exact
            path="/management/category/update/:id"
            component={changeCategoty}
          />
          <Route exact={true} path="*" component={notFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
