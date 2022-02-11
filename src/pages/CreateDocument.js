import React, { Component } from "react";
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
import { serverUrl } from "../config.json";
export default class CreateDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categorys: [],
      show: false,
    };
  }

  handleSubmit(event) {
    const indexCategory =
      document.getElementById("category").options.selectedIndex;
    const indexStatus = document.getElementById("status").options.selectedIndex;
    const uploadFile = document.getElementById("uploadFile");
    const formData = new FormData();
    formData.append("file", uploadFile.files[0]);
    fetch(serverUrl + "v1/docs", {
      method: "POST",
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
        fetch(serverUrl + "v1/docs/" + result.data.id, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accsess_token"),
            accept: "*/*",
          },
        }).then(function (res) {
          if (res.status !== 200) {
            alert(res.status);
          } else {
            document.getElementById("name").value = "";
          }
        });
      });

    this.setState({ show: true });
    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Створення Документа";
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
            categorys: result.data,
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
    const { error, isLoaded, categorys, show } = this.state;

    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>Головна</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/management/document"}>Керування Документами</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Створення Документа</Breadcrumb.Item>
        </Breadcrumb>
        <h2>Створення документа</h2>
        <br></br>
        <br></br>
        <FormGroup>
          <Form.Row>
            <Form.Label column lg={2}>
              Назва
            </Form.Label>
            <Col>
              <Form.Control
                id="name"
                type="text"
                placeholder="Назвіть документ"
              />
            </Col>
          </Form.Row>
          <br />

          <Form.Row>
            <Form.Label column lg={2}>
              Катеогорія
            </Form.Label>
            <Col>
              <Form.Control id="category" as="select" defaultValue="">
                {categorys.map((categorys) => (
                  <option id={categorys.id}>{categorys.name}</option>
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
          <input type="file" id="uploadFile"></input>
          <br></br>
          <Col xs="auto" className="my-1">
            <Button onClick={(e) => this.handleSubmit(e)} type="submit">
              Створити документ
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
              Документ створено
            </Modal.Title>
          </Modal.Header>
        </Modal>
      </Container>
    );
  }
}
