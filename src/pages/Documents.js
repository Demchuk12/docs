import React, { Component } from "react";
import "../App.css";
import AllPagesPDFViewer from "../components/pdf-pages";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  Table,
  Button,
} from "react-bootstrap";
import { serverUrl } from "../config.json";
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
      pdf: null,
    };
  }

  downloadFile(event) {
    window.open(serverUrl + "v1/docs/load/" + this.state.documentsItem.id);
    event.preventDefault();
  }
  componentDidMount() {
    const checkPdf = (nameFile, id) => {
      if (nameFile.includes("pdf") === true) {
        this.setState({ pdf: `${serverUrl}v1/docs/load/${id}` });
      } else {
        this.setState({ pdf: `${serverUrl}v1/docs/load/${id}/pdf` });
      }
    };
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
          checkPdf(result.data.fileName, result.data.id);
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
    const { error, isLoaded, documentsItem, status, categoryName, pdf } =
      this.state;
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
          <br></br>
          <Row>
            <Col sm={3}>
              <Table className="table">
                <tbody>
                  <tr>
                    <td>
                      <b>Назва:</b>
                    </td>
                    <td clas>{documentsItem.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Категорія:</b>
                    </td>
                    <td>
                      <Link
                        className="tableLink"
                        to={"/category/" + documentsItem.sectionId}
                      >
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
            <Col sm={1}></Col>
            <Col sm={8}>
              <h4>{documentsItem.name}</h4>
              <AllPagesPDFViewer pdf={pdf} />
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
