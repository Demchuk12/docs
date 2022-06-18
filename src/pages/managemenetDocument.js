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
      isNameSort: false,
      isCategorySort: false,
      isDateSort: false,
      isStatusSort: false,
    };
  }
  handleClose = () => this.setState({ show: false });
  handleShow = (event, id) => {
    this.setState({ show: true, deleteId: id });
    event.preventDefault();
  };
  sortName() {
    let sortedData;
    if (this.state.isNameSort) {
      sortedData = this.state.findDocuments
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .reverse();
      this.setState({ isNameSort: false });
    } else {
      sortedData = this.state.findDocuments.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      this.setState({ isNameSort: true });
    }
    this.setState({ findDocuments: sortedData });
  }
  sortCategory() {
    let sortedData;
    if (this.state.isCategorySort) {
      sortedData = this.state.findDocuments
        .sort((a, b) => (a.category > b.category ? 1 : -1))
        .reverse();
      this.setState({ isCategorySort: false });
    } else {
      sortedData = this.state.findDocuments.sort((a, b) =>
        a.category > b.category ? 1 : -1
      );
      this.setState({ isCategorySort: true });
    }
    this.setState({ findDocuments: sortedData });
  }
  sortDate() {
    let sortedData;
    if (this.state.isDateSort) {
      sortedData = this.state.findDocuments
        .sort((a, b) => (a.createTime > b.createTime ? 1 : -1))
        .reverse();
      this.setState({ isDateSort: false });
    } else {
      sortedData = this.state.findDocuments.sort((a, b) =>
        a.createTime > b.createTime ? 1 : -1
      );
      this.setState({ isDateSort: true });
    }
    this.setState({ findDocuments: sortedData });
  }
  sortStatus() {
    let sortedData;
    if (this.state.isStatusSort) {
      sortedData = this.state.findDocuments
        .sort((a, b) => (a.status > b.status ? 1 : -1))
        .reverse();
      this.setState({ isStatusSort: false });
    } else {
      sortedData = this.state.findDocuments.sort((a, b) =>
        a.status > b.status ? 1 : -1
      );
      this.setState({ isStatusSort: true });
    }
    this.setState({ findDocuments: sortedData });
  }

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

  getFilteredDocuments() {
    return this.state.documents.filter((serverDocument) => {
      if (
        this.state.category !== null &&
        !serverDocument.category.includes(this.state.category)
      ) {
        return false;
      }
      if (
        this.state.documentName !== null &&
        !serverDocument.name
          .toLowerCase()
          .includes(this.state.documentName.toLocaleLowerCase())
      ) {
        return false;
      }
      if (
        this.state.status !== null &&
        !serverDocument.status.includes(this.state.status)
      ) {
        return false;
      }
      console.log(this.state.date);
      console.log(serverDocument.createTime);
      if (
        this.state.date !== null &&
        !serverDocument.createTime
          .split("T")[0]
          .includes(this.state.date.toString().split("T")[0])
      ) {
        return false;
      }

      return true;
    });
  }

  handleChange() {
    this.state.category = document.getElementById("category").value;
    this.state.findDocuments = this.getFilteredDocuments();
    this.setState({});
  }
  findStatus() {
    this.state.status = document.getElementById("status").value;
    this.state.findDocuments = this.getFilteredDocuments();
    this.setState({});
  }
  findDate() {
    this.state.date = document.getElementById("date").value;
    this.state.findDocuments = this.getFilteredDocuments();
    this.setState({});
  }
  findDoc(event) {
    this.state.documentName = event.target.value;
    this.state.findDocuments = this.getFilteredDocuments();
    this.setState({});
    event.preventDefault();
  }

  componentDidMount() {
    document.title = "Керування Документами";
    fetch(serverUrl + "v1/sections/get", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          for (let i = 0; i < result.data.length; i++) {
            for (let j = 0; j < result.data[i].documents.length; j++) {
              let curStatus;
              if (result.data[i].documents[j].status === "ACTIVE")
                curStatus = "Діючий";
              if (result.data[i].documents[j].status === "INOPERATIVE")
                curStatus = "Припинений";
              if (result.data[i].documents[j].status === "ARCHIVED")
                curStatus = "Архівний";
              this.state.documents.push({
                name: result.data[i].documents[j].name,
                id: result.data[i].documents[j].id,
                categoryId: result.data[i].id,
                category: result.data[i].name,
                status: curStatus,
                createTime: result.data[i].documents[j].createTime,
              });
              this.state.findDocuments.push({
                name: result.data[i].documents[j].name,
                id: result.data[i].documents[j].id,
                categoryId: result.data[i].id,
                category: result.data[i].name,
                status: curStatus,
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
    document.getElementById("category").addEventListener("change", () => {
      console.log("You selected: ", document.getElementById("category").value);
      this.handleChange();
    });
    document.getElementById("status").addEventListener("change", () => {
      console.log("select: ", document.getElementById("status").value);
      this.findStatus();
    });
    document.getElementById("date").addEventListener("change", () => {
      console.log("select: ", document.getElementById("date").value);
      this.findDate();
    });
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
              <th
                onClick={() => {
                  this.sortName();
                }}
              >
                Назва
              </th>
              <th
                onClick={() => {
                  this.sortCategory();
                }}
              >
                Категорія
              </th>
              <th
                onClick={() => {
                  this.sortDate();
                }}
              >
                Дата
              </th>
              <th
                onClick={() => {
                  this.sortStatus();
                }}
              >
                Статус
              </th>
              <th>Дії над документами</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  id="name"
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
                <Form.Select id="category" size="sm">
                  <option value={""}>-</option>
                  {categories.map((categories) => (
                    <option id={categories.id} value={categories.name}>
                      {categories.name}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" type="date" id="date" />
              </td>
              <td>
                <Form.Select id="status" size="sm">
                  onChange={}
                  <option>-</option>
                  <option value="Діючий">Діючий</option>
                  <option value="Припинений">Припинений</option>
                  <option value="Aрхівний">Архівний</option>
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
