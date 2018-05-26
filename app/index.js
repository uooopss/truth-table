import React from "react";
import { render } from "react-dom";

import "../style.css"

// Components
import { Header } from "./components/Header";
import { Content } from "./components/Content";

class App extends React.Component {
    render() {
        return (
            <div className="Diplom_main">
                <Header/>
                <Content/>
            </div>
             
        );
    }
}

render(<App/>, window.document.getElementById("app"));