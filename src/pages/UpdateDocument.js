import React, { Component } from "react";
import { serverUrl } from "../config.json";
import {
  Container,
  Breadcrumb,
  Form,
  Button,
  Row,
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
      status: "",
      categoryId: "",
      date: null,
      documentName: "",
      show: false,
      isEmptyName: false,
    };
  }
  nameHandle(e) {
    this.state.documentName = e.target.value;
    this.setState({});
    if (this.state.documentName.length !== 0) {
      this.setState({ isEmptyName: false });
      document.getElementById("name").className = "form-control";
    } else {
      this.setState({ isEmptyName: true });
      document.getElementById("name").className = "form-control is-invalid";
    }
  }
  uploadRequest() {
    fetch(serverUrl + "v1/docs/" + this.state.documentItem.id, {
      method: "PATCH",
      body: JSON.stringify({
        createTime: document.getElementById("date").value + "T15:15:46.001Z",
        name: document.getElementById("name").value,
        sectionId: document.getElementById("category").value,
        status: document.getElementById("status").value,
      }),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
        accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {});
  }
  handleSubmit(event) {
    const uploadFile = document.getElementById("uploadFile");
    const formData = new FormData();
    formData.append("file", uploadFile.files[0]);
    console.log(uploadFile.files[0]);
    if (
      document.getElementById("name").value !== "" &&
      document.getElementById("date").value !== "" &&
      uploadFile.files[0] === undefined
    ) {
      this.uploadRequest();

      //this.setState({ show: true });
      //setTimeout(() => this.setState({ show: false }), 4000);
    }

    if (
      document.getElementById("name").value !== "" &&
      document.getElementById("date").value !== "" &&
      uploadFile.files[0] !== undefined
    ) {
      this.uploadRequest();
      fetch(serverUrl + "v1/docs/" + this.state.documentItem.id, {
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
        }
      });
    }

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
                console.log(result.data);
                this.setState({
                  isLoaded: true,
                  documentItem: result.data,
                  date: result.data.createTime.split("T")[0],
                  documentName: result.data.name,
                  status: result.data.status,
                  categoryId: result.data.sectionId,
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
  componentDidUpdate() {
    document.getElementById("date").value = this.state.date;
  }
  updateCategory(event) {
    this.state.categoryId = event.target.value;
    console.log(document.getElementById("category").value);
    this.setState({});
  }
  updateStatus(event) {
    this.state.status = event.target.value;
    this.setState({});
  }
  time() {
    return this.state.documentItem.createTime.split("T")[0];
  }

  render() {
    const {
      error,
      isLoaded,
      categories,
      documentItem,
      show,
      isEmptyName,
      status,
      categoryId,
    } = this.state;
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
        <h3 className="input-left">Змінити документ: "{documentItem.name}"</h3>
        <br></br>
        <br></br>
        <Row>
          <Col sm={6}>
            <Form.Label className="input-left" column lg={2}>
              Назва
            </Form.Label>
            <Form.Control
              onChange={(e) => {
                this.nameHandle(e);
              }}
              id="name"
              value={this.state.documentName}
              type="text"
              placeholder="Назвіть документ"
            />
            {isEmptyName && (
              <Form.Control.Feedback type="invalid">
                Заповніть поле
              </Form.Control.Feedback>
            )}
          </Col>
          <br />
          <Col sm={6}>
            <Form.Label className="input-left" column lg={2}>
              Категорія
            </Form.Label>

            <Form.Control
              id="category"
              as="select"
              value={categoryId}
              onChange={(e) => {
                this.updateCategory(e);
              }}
            >
              {categories.map((categories) => (
                <option value={categories.id} id={categories.id}>
                  {categories.name}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label className="input-left" column lg={2}>
              Статус
            </Form.Label>

            <Form.Control
              id="status"
              as="select"
              value={status}
              onChange={(e) => {
                this.updateStatus(e);
              }}
            >
              <option value="ACTIVE">Діючий</option>
              <option value="INOPERATIVE">Припинений</option>
              <option value="ARCHIVED">Архівний</option>
            </Form.Control>
          </Col>
          <br />
          <Col>
            <Form.Label className="input-left" column lg={2}>
              Дата
            </Form.Label>

            <Form.Control id="date" type="date" />
          </Col>
        </Row>

        <br></br>
        <Form.Label>Вибрати файл</Form.Label>
        <Form.Control type="file" id="uploadFile" />
        <br></br>
        <Col xs="auto" className="my-1">
          <Button onClick={(e) => this.handleSubmit(e)} type="submit">
            Оновити документ
          </Button>
        </Col>
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
