import React from "react";
import Select from "react-select";
import update from "react-addons-update";
import { Table } from 'reactstrap';

import "./Content.scss"
import 'react-select/dist/react-select.css';

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSelectGroups: [
                {
                    value: 2,
                    label: '2'
                },
                {
                    value: 3,
                    label: '3'
                },
                {
                    value: 4,
                    label: '4'
                }
            ],
            arrayGroups: [],
            clearable: true,
            selectGroup: '',
            inputValue: ''
        }
    }

    handleSelectGroup = (selectGroup) => {
        const arr = [];
        if (selectGroup) {
            for (var i = 0; i < selectGroup.value; i++) {
                const obj = {
                    index: i,
                    groupLetter: String.fromCharCode(65 + i),
                    groupMultiplier: ''
                }
                arr.push(obj);
            }
        }
        this.setState({
            selectGroup,
            arrayGroups: arr
        }, () => { console.log("selectGroup", this.state.selectGroup, this.state.arrayGroups) })
    }

    handleChange = (e, i) => {
        console.log("input index", i);
        this.setState({
            arrayGroups: update(this.state.arrayGroups, {
                [i]: { 'groupMultiplier': { $set: e.target.value } }
            })
        }, () => { console.log("update", this.state.arrayGroups) })
    }

    build = () => {
        // const row = [];
        // for (var i = (Math.pow(2, 2) - 1) ; i >= 0 ; i--) {
        //     for (var j = (2 - 1) ; j >= 0 ; j--) {
        //       row[j] = (i & Math.pow(2,j)) ? 1 : 0
        //     }
        //     console.log('row', row)
        //   }
    }

    render() {
        const {
            selectGroup,
            clearable,
            arrSelectGroups,
            arrayGroups
        } = this.state;
        const valueGroup = selectGroup && selectGroup.value;

        return (
            <main className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4 content-menu d-flex justify-content-center align-items-center">
                            {/* <h1>menu selects</h1> */}
                            <div className="col-11 mt-4 mb-4 content-form">
                                <form>
                                    <div className={"form-group row d-flex align-items-center " + (this.state.selectGroup ? "form-group-num" : '')}>
                                        <label className="col-6">Number of operands:</label>
                                        <div className="col-6">
                                            <Select
                                                options={arrSelectGroups}
                                                clearable={clearable}
                                                name="selected-state-group"
                                                value={valueGroup}
                                                onChange={this.handleSelectGroup}
                                            />
                                        </div>
                                    </div>
                                    {arrayGroups && arrayGroups.map((o, i) => (
                                        <div key={i} className="form-group row d-flex align-items-center">
                                            <label className="col-6 ">Number of multipliers for {o.groupLetter} (1-6):</label>
                                            <div className="col-6">
                                                <input type="text" className="form-control" placeholder={"Enter for " + o.groupLetter}
                                                    value={o.groupMultiplier} onChange={(event) => this.handleChange(event, o.index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {selectGroup && (
                                        <div className="form-group row form-button">
                                            <div className="col-12 d-flex justify-content-center">
                                                {/* <button type="button" className="btn btn-warning">MINIMIZATION</button> */}
                                                <button type="button" className="btn btn-warning" onClick={this.build}>BUILD</button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                        <div className="col-8 content-main d-flex justify-content-center align-items-center">
                            <div className="col-6">
                                <Table bordered>
                                    <thead>
                                    <tr>
                                        {arrayGroups.map((o,i) => (<th key={i}>{o.groupLetter}</th>))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col-6">
                                <h1> main content</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        );
    }
}