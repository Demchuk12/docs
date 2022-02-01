import React, { Component } from "react";
import {
  Container,
  Breadcrumb,
  Table,
  Button,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { serverUrl } from "../config.json";

export default class managemenetDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      show: false,
      deleteId: null,
      findDocumnets: [],
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
    event.preventDefault();
  }

  findDoc(event) {
    const searchName = document.getElementById("search").value;
    const sections = this.state.categories;
    fetch(serverUrl + "v1/docs/find/" + searchName, {
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
            findDocuments: result.data,
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
          console.log(result.data);
          this.setState({
            isLoaded: true,
            categories: result.data,
            findDocumnets: result.data,
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
    const { error, isLoaded, categories, show, deleteId, findDocumnets } =
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
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="search">Пошук</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
          />
        </InputGroup>
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
            {findDocumnets.map((categories) =>
              categories.documents.map((documents) => (
                <tr>
                  <td>
                    <Link to={`/document/${documents.id}`}>
                      {documents.name}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/category/${categories.id}`}>
                      {categories.name}
                    </Link>
                  </td>
                  <td>{documents.createTime.split("T")[0]}</td>
                  <td>{documents.status}</td>
                  <td>
                    <Link to={"/management/document/update/" + documents.id}>
                      <i
                        class="fas fa-edit"
                        style={{ fontSize: 24 + "px", color: "black" }}
                      ></i>
                    </Link>
                    <> </>
                    <Link>
                      <i
                        onClick={(e) => this.handleShow(e, documents.id)}
                        class="fas fa-trash-alt"
                        style={{ fontSize: 24 + "px", color: "black" }}
                      ></i>
                    </Link>
                  </td>
                </tr>
              ))
            )}
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
