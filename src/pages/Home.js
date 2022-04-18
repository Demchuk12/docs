import React, { Component } from "react";
import {
  Container,
  Tab,
  Row,
  Col,
  ListGroup,
  Button,
  InputGroup,
  FormControl,
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
              <h3>Пошук за реквізитами</h3>
              <InputGroup className="mb-3">
                <FormControl
                  id="documentName"
                  placeholder="Пошук"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <Button variant="primary" onClick={this.handleSubmit}>
                  Найти
                </Button>
              </InputGroup>
            </Col>
            <Col sm={6}>
              <br></br>

              <h3>Категорії</h3>
              <ListGroup variant="flush">
                {items.map((items) => (
                  <ListGroup.Item className="listCategory" id={items.id}>
                    <Link className="link" to={`/category/${items.id}`}>
                      {items.name}
                    </Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
