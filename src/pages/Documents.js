import React, { Component } from "react";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  Table,
  Button,
} from "react-bootstrap";
import { serverUrl } from "../config.json";
import { Document, Page } from "react-pdf";
import { Link } from "react-router-dom";

export default class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      documentsItem: [],
      status: null,
      categoryName: null,
    };
  }

  downloadFile(event) {
    window.open(serverUrl + "v1/docs/load/" + this.state.documentsItem.id);
    event.preventDefault();
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(serverUrl + "v1/docs/get/" + id, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("accsess_token"),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          document.title = result.data.name;

          this.setState({
            isLoaded: true,
            documentsItem: result.data,
            status: result.data.status,
          });
          if (this.state.status === "ACTIVE")
            this.setState({ status: "Діючий" });

          if (this.state.status === "INOPERATIVE")
            this.setState({ status: "Припинений" });

          if (this.state.status === "ARCHIVED")
            this.setState({ status: "Архівнмй" });
          fetch(
            serverUrl + "v1/sections/get/" + this.state.documentsItem.sectionId,
            {
              method: "GET",
              headers: {
                accept: "*/*",
                Authorization:
                  "Bearer " + localStorage.getItem("accsess_token"),
              },
            }
          )
            .then((res) => res.json())
            .then(
              (result) => {
                this.setState({
                  categoryName: result.data.name,
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
    const {
      error,
      isLoaded,
      documentsItem,
      status,
      categoryName,
      pageNumber,
      numPages,
    } = this.state;
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
            <Breadcrumb.Item>
              <Link to={"/category/" + documentsItem.sectionId}>
                {categoryName}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Документи</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col sm={3}>
              <Table>
                <tbody>
                  <tr>
                    <td>
                      <b>Назва:</b>
                    </td>
                    <td>{documentsItem.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Категорія:</b>
                    </td>
                    <td>
                      <Link to={"/category/" + documentsItem.sectionId}>
                        {categoryName}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Cтатус:</b>
                    </td>
                    <td>{status}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Дата:</b>
                    </td>
                    <td>{documentsItem.createTime.split("T")[0]}</td>
                  </tr>
                </tbody>
              </Table>
              <Link>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ width: "100%" }}
                  onClick={(e) => this.downloadFile(e)}
                >
                  Завантажити файл
                </Button>
              </Link>
            </Col>
            <Col sm={9}>
              <h4>{documentsItem.name}</h4>
              <iframe
                src={`http://docs.google.com/gview?url=${serverUrl}v1/docs/load/${documentsItem.id}/pdf&embedded=true`}
                width="100%"
                height="600px"
                frameborder="0"
              ></iframe>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
