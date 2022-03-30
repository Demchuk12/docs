import React, { Component } from "react";
import { Navbar, Nav, Container, Button, NavB } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class Header extends Component {
  logout(event) {
    localStorage.clear();
    document.location.href = "/";
  }
  render() {
    if (localStorage.getItem("accsess_token")) {
      return (
        <>
          <Navbar
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
            fixed="top"
          >
            <Container>
              <Nav className="mr-auto">
                <Nav.Link href="/"> Нормативна база ТНТУ</Nav.Link>
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link>
                    <Link
                      to={"/management/document"}
                      style={{ textDecoration: "none" }}
                    >
                      Керування Документами
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link
                      to={"/management/category"}
                      style={{ textDecoration: "none" }}
                    >
                      Керування Категоріями
                    </Link>
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Link to={"/"}>
                    <Button
                      variant="outline-info"
                      href="/"
                      onClick={(e) => this.logout(e)}
                    >
                      Вийти
                    </Button>
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          {/*<Navbar
            fixed="top"
            collapseOnSelect
            expand="md"
            bg="dark"
            variant="dark"
          >
            <Container>
              <Nav className="mr-auto">
                <Nav.Link href="/"> Нормативна база ТНТУ</Nav.Link>
              </Nav>
              <Navbar.Toggle aria-controls="responive-navbar-nav" />

              <Navbar.Collapse id="responive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link>
                    <Link
                      to={"/management/document"}
                      style={{ textDecoration: "none" }}
                    >
                      Керування Документами
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link
                      to={"/management/category"}
                      style={{ textDecoration: "none" }}
                    >
                      Керування Категоріями
                    </Link>
                  </Nav.Link>
                </Nav>
                <Nav style={{}}>
                  <Link to={"/"}>
                    <Button
                      variant="outline-info"
                      href="/"
                      onClick={(e) => this.logout(e)}
                    >
                      Вийти
                    </Button>
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
      </Navbar> */}
        </>
      );
    } else {
      return (
        <>
          <Navbar
            fixed="top"
            collapseOnSelect
            expand="md"
            bg="dark"
            variant="dark"
          >
            <Container>
              <Nav className="mr-auto">
                <Nav.Link href="/">Нормативна база ТНТУ</Nav.Link>
              </Nav>
              <Navbar.Toggle aria-controls="responive-navbar-nav" />

              <Navbar.Collapse id="responive-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Link to={"/login"}>
                  <Button variant="outline-info">Увійти</Button>
                </Link>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Navbar
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
            fixed="top"
          >
            <Container>
              <Nav className="mr-auto">
                <Nav.Link href="/"> Нормативна база ТНТУ</Nav.Link>
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                  <Link to={"/login"}>
                    <Button variant="outline-info">Увійти</Button>
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      );
    }
  }
}
