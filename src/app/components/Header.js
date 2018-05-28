import React from "react";
import { Jumbotron, Container } from 'reactstrap';

import "./Header.scss"

export class Header extends React.Component {
    render() {
        return (
                <header className="header">
                   <Jumbotron fluid>
                        <Container fluid>
                            <h1 className="display-3">Генератор VHDL кода суматора</h1>
                            <p className="lead">Программа, генерирующая JavaScript код в VHDL</p>
                        </Container>
                    </Jumbotron>
                </header>
             
        );
    }
}