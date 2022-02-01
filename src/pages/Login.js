import React, { Component } from "react";
import { Container, Row, Col, Form, Button, Breadcrumb } from "react-bootstrap";
import axios from "axios";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      formErrors: { email: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
    };
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit(event) {
    axios
      .post(serverUrl + "v1/auth/login", {
        password: document.forms.auth.elements.password.value,
        email: document.forms.auth.elements.login.value,
      })
      .then(function (response) {
        localStorage.setItem("accsess_token", response.data.accessToken);
        localStorage.setItem("refresh_token", response.data.refreshTokrn);
        document.location.href = "/";
      })
      .catch(function (error) {
        alert("Невірний логін або пароль");
      });

    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Вхід";
  }

  render() {
    return (
      <>
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/"}>Головна</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Вхід</Breadcrumb.Item>
          </Breadcrumb>
          <Row className="justify-content-md-center">
            <Col sm={4}>
              <Form name="auth">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Електронна адреса</Form.Label>
                  <Form.Control
                    name="login"
                    type="email"
                    placeholder="Введіть електронну адресу"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Введіть пароль"
                  />
                </Form.Group>
                <Link to={"/"}>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    Увійти
                  </Button>
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
