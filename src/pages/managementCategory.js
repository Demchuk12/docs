import React, { Component } from "react";
import { Container, Breadcrumb, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { serverUrl } from "../config.json";
export default class managementCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      show: false,
      deleteId: null,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = (event, id) => {
    this.setState({ show: true, deleteId: id });
    event.preventDefault();
  };
  deleteCategory(event, id) {
    fetch(serverUrl + "v1/sections/" + id, {
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

  componentDidMount() {
    document.title = "Керування Категоріями";
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
    const { error, isLoaded, items, show, deleteId } = this.state;
    if (error) {
      return <h1>Error</h1>;
    } else if (!isLoaded) {
      return <h1></h1>;
    } else {
      return (
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={"/"}>Головна</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Керування Категоріями</Breadcrumb.Item>
          </Breadcrumb>
          <Link to={"/management/category/create"}>
            <Button variant="primary" size="lg" block>
              Створити Категорію
            </Button>
          </Link>

          <br></br>
          <br></br>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Назва Категорії</th>
                <th>Дії над категоріями</th>
              </tr>
            </thead>
            <tbody>
              {items.map((items) => (
                <tr>
                  <td>{items.id}</td>
                  <td>
                    <Link to={"/category/" + items.id}>{items.name}</Link>
                  </td>
                  <td>
                    <Link to={"/management/category/update/" + items.id}>
                      <i
                        class="fas fa-edit"
                        style={{ fontSize: 24 + "px", color: "black" }}
                      ></i>
                    </Link>
                    <> </>
                    <Link>
                      <i
                        onClick={(e) => this.handleShow(e, items.id)}
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
              <Modal.Title>Видалення категорії</Modal.Title>
            </Modal.Header>
            <Modal.Body>Ви дійсно хочете видалити категорію?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Закрити
              </Button>
              <Button
                variant="danger"
                onClick={(e) => this.deleteCategory(e, deleteId)}
              >
                Видалити
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      );
    }
  }
}
