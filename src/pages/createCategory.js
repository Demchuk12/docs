import React, { Component } from "react";
import {
  Container,
  Breadcrumb,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Button,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { serverUrl } from "../config.json";

export default class createCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleSubmit(event) {
    if (document.getElementById("category").value !== "") {
      fetch(serverUrl + "v1/sections", {
        method: "POST",
        body: JSON.stringify({
          name: document.getElementById("category").value,
        }),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accsess_token"),
          accept: "*/*",
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        if (response.status !== 200) {
          alert(response.status);
        } else {
          document.getElementById("category").value = "";
        }
      });
      this.setState({ show: true });
      window.location = "/management/category";
      setTimeout(() => this.setState({ show: false }), 4000);
    }

    event.preventDefault();
  }
  componentDidMount() {
    document.title = "Створення Категорії";
  }

  render() {
    const { show } = this.state;
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Головна</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/management/category"}>Керування</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Створення Категорії</Breadcrumb.Item>
        </Breadcrumb>
        <br></br>
        <Row>
          <Col sm={4}>
            <h3 className="input-left">Створення категорії </h3>
          </Col>
        </Row>
        <br></br>
        <InputGroup className="mb-3">
          <FormControl
            required
            id="category"
            type="text"
            placeholder="Назвіть категорію"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <Button variant="primary" onClick={(e) => this.handleSubmit(e)}>
            Створити
          </Button>
        </InputGroup>
        <Modal
          size="sm"
          show={show}
          onHide={() => this.setState({ show: false })}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Категорію створено
            </Modal.Title>
          </Modal.Header>
        </Modal>
      </Container>
    );
  }
}
