import React, { Component } from "react";
import {
  Container,
  Breadcrumb,
  Table,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { serverUrl } from "../config.json";

export default class managemenetDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      show: false,
      deleteId: null,
      categories: [],
      documents: [],
      findDocuments: [],
      documentName: "",
      category: "",
      status: null,
      date: null,
    };
  }
  handleClose = () => this.setState({ show: false });
  handleShow = (event, id) => {
    this.setState({ show: true, deleteId: id });
    event.preventDefault();
  };

  deleteDocument(event, id) {
    fetch(serverUrl + "v1/docs/" + id, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
      },
    });
    this.setState({ show: false });
    window.location.reload();
    event.preventDefault();
  }
  handleChange(event) {
    this.setState({ category: event.target.value });
    this.state.findDocuments = this.state.documents.filter((documents) => {
      return documents.category
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    event.preventDefault();
  }
  findDoc(event) {
    this.setState({ documentName: event.target.value });
    this.state.findDocuments = this.state.documents.filter((documents) => {
      return documents.name
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Керування Документами";
    fetch(serverUrl + "v1/sections/get", {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          for (let i = 0; i < result.data.length; i++) {
            for (let j = 0; j < result.data[i].documents.length; j++) {
              this.state.documents.push({
                name: result.data[i].documents[j].name,
                id: result.data[i].documents[j].id,
                categoryId: result.data[i].id,
                category: result.data[i].name,
                status: result.data[i].documents[j].status,
                createTime: result.data[i].documents[j].createTime,
              });
              this.state.findDocuments.push({
                name: result.data[i].documents[j].name,
                id: result.data[i].documents[j].id,
                categoryId: result.data[i].id,
                category: result.data[i].name,
                status: result.data[i].documents[j].status,
                createTime: result.data[i].documents[j].createTime,
              });
            }
          }
          this.setState({
            isLoaded: true,
            categories: result.data,
          });
          console.log(this.state.documents);
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
    const { error, isLoaded, categories, show, deleteId, findDocuments } =
      this.state;
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Головна</Breadcrumb.Item>
          <Breadcrumb.Item active>Керування Документами</Breadcrumb.Item>
        </Breadcrumb>

        <Link to={"/management/document/create"}>
          <Button variant="primary" size="lg" block>
            Створити документ
          </Button>
        </Link>

        <br></br>
        <br></br>

        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Категорія</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Дії над документами</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  value={this.state.documentName}
                  onChange={(e) => {
                    this.findDoc(e);
                  }}
                  size="sm"
                  type="text"
                  placeholder="Введіть назву файлу"
                />
              </td>
              <td>
                <Form.Select
                  size="sm"
                  value={this.state.category}
                  onChange={(e) => this.handleChange(e)}
                >
                  <option value={""}>-</option>
                  {categories.map((categories) => (
                    <option id={categories.id} value={categories.name}>
                      {categories.name}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" type="date" />
              </td>
              <td>
                <Form.Select size="sm">
                  <option>-</option>
                  <option value="ACTIVE">Діючий</option>
                  <option value="INOPERATIVE">Припинений</option>
                  <option value="ARCHIVED">Архівний</option>
                </Form.Select>
              </td>
              <td></td>
            </tr>
            {findDocuments.map((findD) => (
              <tr>
                <td>
                  <Link className="tableLink" to={`/document/${findD.id}`}>
                    {findD.name}
                  </Link>
                </td>
                <td>
                  <Link
                    className="tableLink"
                    to={`/category/${findD.categoryId}`}
                  >
                    {findD.category}
                  </Link>
                </td>
                <td>{findD.createTime.split("T")[0]}</td>
                <td>{findD.status}</td>
                <td>
                  <Link to={"/management/document/update/" + findD.id}>
                    <i
                      class="fas fa-edit"
                      style={{ fontSize: 24 + "px", color: "black" }}
                    ></i>
                  </Link>
                  <> </>
                  <Link>
                    <i
                      onClick={(e) => this.handleShow(e, findD.id)}
                      class="fas fa-trash-alt"
                      style={{ fontSize: 24 + "px", color: "black" }}
                    ></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal
          show={show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Видалення документа</Modal.Title>
          </Modal.Header>
          <Modal.Body>Ви дійсно хочете видалити докуиент?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Закрити
            </Button>
            <Button
              variant="danger"
              onClick={(e) => this.deleteDocument(e, deleteId)}
            >
              Видалити
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
