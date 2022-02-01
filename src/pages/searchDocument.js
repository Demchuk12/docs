import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import { serverUrl } from "../config.json";
import { Link } from "react-router-dom";
export default class searchDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      documents: [],
    };
  }

  componentDidMount() {
    document.title = "Результати пошуку";
    const name = this.props.match.params.name;
    fetch(serverUrl + "v1/docs/find/" + name, {
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
            documents: result.data,
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
    const { error, isLoaded, documents } = this.state;
    return (
      <Container>
        <h3>Результати пошуку</h3>
        <br></br>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Назва документа</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((documents) => (
              <tr>
                <td>
                  <Link to={`/document/${documents.id}`}>{documents.name}</Link>
                </td>
                <td>{documents.createTime.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
