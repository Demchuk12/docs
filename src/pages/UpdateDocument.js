import React, { Component } from "react";
import { serverUrl } from "../config.json";
import {
  Container,
  Breadcrumb,
  Form,
  Button,
  FormGroup,
  Col,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
export default class UpdateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      documentItem: [],
      show: false,
    };
  }

  handleSubmit(event) {
    const indexCategory =
      document.getElementById("category").options.selectedIndex;
    const indexStatus = document.getElementById("status").options.selectedIndex;
    fetch(serverUrl + "v1/docs/" + this.props.match.params.id, {
      method: "PATCH",
      body: JSON.stringify({
        createTime: document.getElementById("date").value + "T15:15:46.001Z",
        name: document.getElementById("name").value,
        sectionId:
          document.getElementById("category").options[indexCategory].id,
        status: document.getElementById("status").options[indexStatus].value,
      }),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
        accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.data);
      });

    this.setState({ show: true });
    event.preventDefault();
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(serverUrl + "v1/sections/get", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
        accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            categories: result.data,
          });
          fetch(serverUrl + "v1/docs/get/" + id, {
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
                  documentItem: result.data,
                });
              },
              (error) => {
                this.setState({
                  isLoaded: true,
                  error,
                });
              }
            );
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
    const { error, isLoaded, categories, documentItem, show } = this.state;
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Головна</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/management/document"}>Керування</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Оновлення Документа</Breadcrumb.Item>
        </Breadcrumb>
        <h2>Змінити документ: "{documentItem.name}"</h2>
        <br></br>
        <br></br>
        <FormGroup>
          <Form.Row>
            <Form.Label column lg={2}>
              Назва
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                id="name"
                placeholder="Назвіть документ"
              />
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={2}>
              Категорія
            </Form.Label>
            <Col>
              <Form.Control id="category" as="select" defaultValue="">
                {categories.map((categories) => (
                  <option id={categories.id}>{categories.name}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={2}>
              Статус
            </Form.Label>
            <Col>
              <Form.Control id="status" as="select">
                <option value="ACTIVE">Діючий</option>
                <option value="INOPERATIVE">Припинений</option>
                <option value="ARCHIVED">Архівний</option>
              </Form.Control>
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={2}>
              Дата
            </Form.Label>
            <Col>
              <Form.Control
                id="date"
                type="text"
                placeholder="Введіть дату в форматі 2021-06-22"
              />
            </Col>
          </Form.Row>

          <br></br>
          <Col xs="auto" className="my-1">
            <Button onClick={(e) => this.handleSubmit(e)} type="submit">
              Оновити документ
            </Button>
          </Col>
        </FormGroup>
        <Modal
          size="sm"
          show={show}
          onHide={() => this.setState({ show: false })}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
              Документ Змінено
            </Modal.Title>
          </Modal.Header>
        </Modal>
      </Container>
    );
  }
}
