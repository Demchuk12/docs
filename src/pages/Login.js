import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Breadcrumb,
  Modal,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";
import { toBeRequired } from "@testing-library/jest-dom/dist/matchers";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailDirty: false,
      passwordDirty: false,
      show: false,
      isEmptyEmail: true,
      isEmptyPassword: true,
    };
  }
  emailHandle(e) {
    this.state.email = e.target.value;
    this.setState({});
    if (this.state.email.length !== 0) {
      this.setState({ isEmptyEmail: false });
      document.getElementById("email").className = "form-control";
    } else {
      this.setState({ isEmptyEmail: true });
      document.getElementById("email").className = "form-control is-invalid";
    }
  }
  passwordHandle(e) {
    this.state.password = e.target.value;
    this.setState({});
    if (this.state.password.length !== 0) {
      this.setState({ isEmptyPassword: false });
      document.getElementById("password").className = "form-control";
    } else {
      this.setState({ isEmptyPassword: true });
    }
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit(event) {
    if (this.state.email.length === 0) {
    }
    if (this.state.password.length === 0) {
    }
    let checkError = false;
    this.setState({ show: true });

    axios
      .post(serverUrl + "v1/auth/login", {
        password: this.state.password,
        email: this.state.email,
      })
      .then(function (response) {
        localStorage.setItem("accsess_token", response.data.accessToken);
        localStorage.setItem("refresh_token", response.data.refreshTokrn);
        document.location.href = "/management/document";
      })
      .catch(function (error) {
        checkError = true;
      });
    this.setState({ show: checkError });
    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Вхід";
  }

  render() {
    const { emailDirty, passwordDirty, emailError, passwordError, show } =
      this.state;
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
                    value={this.state.email}
                    onChange={(e) => this.emailHandle(e)}
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Введіть електронну адресу"
                  />
                  <Form.Control.Feedback type="invalid">
                    Це поле не може бути пустим{" "}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    onChange={(e) => this.passwordHandle(e)}
                    value={this.state.password}
                    name="password"
                    type="password"
                    id="password"
                    placeholder="Введіть пароль"
                  />
                  <Form.Control.Feedback type="invalid">
                    Це поле не може бути пустим
                  </Form.Control.Feedback>
                </Form.Group>
                <br></br>

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

        <Modal show={show} onHide={this.handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
