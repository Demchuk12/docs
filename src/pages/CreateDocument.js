import React, { Component } from "react";
import {
  Container,
  Breadcrumb,
  Form,
  Button,
  FormGroup,
  Col,
  Modal,
  Row,
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
      documentName: "",
      date: null,
      file: null,
      isEmptyName: true,
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
  handleSubmit(event) {
    const indexCategory =
      document.getElementById("category").options.selectedIndex;
    const indexStatus = document.getElementById("status").options.selectedIndex;
    const uploadFile = document.getElementById("uploadFile");
    const formData = new FormData();
    formData.append("file", uploadFile.files[0]);
    console.log(uploadFile.files[0]);
    if (
      document.getElementById("name").value !== "" &&
      document.getElementById("date").value !== "" &&
      uploadFile.files[0] !== undefined
    ) {
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
            }
          });
        });

      this.setState({ show: true });
      setTimeout(() => this.setState({ show: false }), 3000);
    }

    event.preventDefault();
  }

  componentDidMount() {
    document.title = "?????????????????? ??????????????????";
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
    document.getElementById("date").valueAsDate = new Date();
  }
  today() {
    let d = new Date();
    let currDate = d.getDate();
    let currMonth = d.getMonth() + 1;
    let currYear = d.getFullYear();
    return (
      currYear +
      "-" +
      (currMonth < 10 ? "0" + currMonth : currMonth) +
      "-" +
      (currDate < 10 ? "0" + currDate : currDate)
    );
  }
  render() {
    const { error, isLoaded, categorys, show, isEmptyName } = this.state;

    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>??????????????</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={"/management/document"}>?????????????????? ??????????????????????</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>?????????????????? ??????????????????</Breadcrumb.Item>
        </Breadcrumb>
        <h3 className="input-left">?????????????????? ??????????????????</h3>
        <br></br>
        <br></br>
        <Row>
          <Col sm={6}>
            <Form.Label className="input-left" column lg={2}>
              ??????????
            </Form.Label>
            <Form.Control
              onChange={(e) => {
                this.nameHandle(e);
              }}
              value={this.state.documentName}
              id="name"
              type="text"
              placeholder="?????????????? ????????????????"
            />
            {isEmptyName && (
              <Form.Control.Feedback type="invalid">
                ?????????????????? ????????
              </Form.Control.Feedback>
            )}
          </Col>
          <br />
          <Col sm={6}>
            <Form.Label className="input-left" column lg={2}>
              ????????????????????
            </Form.Label>

            <Form.Control id="category" as="select" defaultValue="">
              {categorys.map((categorys) => (
                <option id={categorys.id}>{categorys.name}</option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label className="input-left" column lg={2}>
              ????????????
            </Form.Label>

            <Form.Control id="status" as="select">
              <option value="ACTIVE">????????????</option>
              <option value="INOPERATIVE">????????????????????</option>
              <option value="ARCHIVED">????????????????</option>
            </Form.Control>
          </Col>
          <br />
          <Col>
            <Form.Label className="input-left" column lg={2}>
              ????????
            </Form.Label>

            <Form.Control id="date" type="date" value={this.state.date} />
          </Col>
        </Row>
        <br></br>
        <Form.Label>?????????????? ????????</Form.Label>
        <Form.Control type="file" id="uploadFile" />
        <br></br>
        <Col xs="auto" className="my-1">
          <Button onClick={(e) => this.handleSubmit(e)} type="submit">
            ???????????????? ????????????????
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
              ???????????????? ????????????????
            </Modal.Title>
          </Modal.Header>
        </Modal>
      </Container>
    );
  }
}
