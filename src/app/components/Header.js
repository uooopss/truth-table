import React from "react";

import "./Header.scss"

export class Header extends React.Component {
    render() {
        return (
                <header className="header">
                    <div className="container-fluid">
                         <div className="row">
                             <div className="col-12 d-flex justify-content-center align-items-center header-style">
                                 <h1> header</h1>
                             </div>
                         </div>
                    </div>
                </header>
             
        );
    }
}