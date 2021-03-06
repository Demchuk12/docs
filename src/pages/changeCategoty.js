import React, { Component } from "react";
import {
  Container,
  Breadcrumb,
  Row,
  Form,
  Col,
  Button,
  FormGroup,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";
export default class changeCategoty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      category: [],
      show: false,
      categoryName: "",
    };
  }
  nameHandle(e) {
    this.state.categoryName = e.target.value;
    this.setState({});
    if (this.state.categoryName.length !== 0) {
      this.setState({ isEmptyName: false });
      document.getElementById("category").className = "form-control";
    } else {
      this.setState({ isEmptyName: true });
      document.getElementById("category").className = "form-control is-invalid";
    }
  }
  changeeCategory(event) {
    if (document.getElementById("category").value !== "") {
      fetch(serverUrl + "v1/sections/" + this.props.match.params.id, {
        method: "PATCH",
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
      setTimeout(() => this.setState({ show: false }), 4000);
    }

    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Зиінити Категорію";
    const id = this.props.match.params.id;
    fetch(serverUrl + "v1/sections/get/" + id, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            category: result.data,
            categoryName: result.data.name,
          });
          console.log(result.data);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, category, show } = this.state;
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Головна</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/management/category"}>Керування категоріями</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Змінити Категорію</Breadcrumb.Item>
        </Breadcrumb>
        <br></br>
        <h3 className="input-left">Змінити Категорію: "{category.name}"</h3>
        <br></br>
        <br></br>
        <Row>
          <Col sm={11}>
            <InputGroup className="mb-3">
              <FormControl
                id="category"
                type="text"
                placeholder="Назвіть категорію"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={this.state.categoryName}
                onChange={(e) => {
                  this.nameHandle(e);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Заповніть поле
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
          <Col sm={1}>
            <Button variant="primary" onClick={(e) => this.changeeCategory(e)}>
              Змінити
            </Button>
          </Col>
        </Row>

        <Modal
          size="sm"
          show={show}
          onHide={() => this.setState({ show: false })}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Категорію змінено
            </Modal.Title>
          </Modal.Header>
        </Modal>
      </Container>
    );
  }
}
