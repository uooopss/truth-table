import React from "react";
import { Jumbotron, Container } from 'reactstrap';

import "./Header.scss"

export class Header extends React.Component {
    render() {
        return (
                <header className="header">
                   <Jumbotron fluid>
                        <Container fluid>
                            <h1 className="display-3">Multiplier VHDL code generator</h1>
                            <p className="lead">This is a program generate JavaScript code to VHDL.</p>
                        </Container>
                    </Jumbotron>
                </header>
             
        );
    }
}