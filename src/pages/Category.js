import React, { Component } from "react";
import {
  Col,
  Container,
  ListGroup,
  Row,
  Table,
  Breadcrumb,
} from "react-bootstrap";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      section: {},
    };
  }

  changeCategory(event, id) {
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
            section: result.data,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    event.preventDefault();
  }
  componentDidMount() {
    fetch(serverUrl + "v1/sections/get/" + this.props.match.params.id, {
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
            section: result.data,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    fetch(serverUrl + "v1/sections/get/", {
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
            categories: result.data,
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
    const { error, isLoaded, categories, section } = this.state;
    if (error) {
      return <h1></h1>;
    } else if (!isLoaded) {
      return <h1></h1>;
    } else {
      return (
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/"}>Головна</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={"/"}>Категорії</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{section.name}</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col sm={3}>
              <h3>Категорії</h3>
              <ListGroup variant="flush">
                {categories.map((categories) => (
                  <Link
                    onClick={(e) => this.changeCategory(e, categories.id)}
                    to={`/category/${categories.id}`}
                  >
                    <ListGroup.Item
                      action
                      id={`category_${categories.id}`}
                      onClick={window.scrollTo(0, 0)}
                    >
                      {categories.name}
                    </ListGroup.Item>
                  </Link>
                ))}
              </ListGroup>
            </Col>
            <Col sm={9}>
              <h3>{section.name}</h3>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Назва</th>
                    <th>Двта</th>
                  </tr>
                </thead>
                <tbody>
                  {section.documents?.map((documents) => (
                    <tr>
                      <td>
                        <Link to={`/document/${documents.id}`}>
                          {documents.name}
                        </Link>
                      </td>
                      <td>{documents.createTime.split("T")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
