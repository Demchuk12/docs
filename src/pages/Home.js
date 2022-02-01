import React, { Component } from "react";
import {
  Container,
  Tab,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
} from "react-bootstrap";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  handleSubmit(event) {
    document.location.href =
      "/search/" + document.getElementById("documentName").value;
    event.preventDefault();
  }

  componentDidMount() {
    fetch(serverUrl + "v1/sections/get", {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.data);
          this.setState({
            isLoaded: true,
            items: result.data,
          });
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
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <h1>Error</h1>;
    } else if (!isLoaded) {
      return <h1></h1>;
    } else {
      return (
        <Container>
          <Row>
            <Col sm={6}>
              <br></br>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <h3>Пошук по реквізитах</h3>
                  <Form.Control
                    id="documentName"
                    type="text"
                    placeholder="Введіть реквізити"
                  />
                </Form.Group>

                <Button
                  onClick={this.handleSubmit}
                  variant="primary"
                  type="submit"
                >
                  Пошук
                </Button>
              </Form>
            </Col>
            <Col sm={6}>
              <br></br>

              <h3>Категорії</h3>
              <ListGroup>
                {items.map((items) => (
                  <Link to={`/category/${items.id}`}>
                    <ListGroup.Item action id={items.id}>
                      {items.name}
                    </ListGroup.Item>
                  </Link>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
