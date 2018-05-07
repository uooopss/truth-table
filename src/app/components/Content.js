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
            arrSelectOperands: [
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
                },
                {
                    value: 5,
                    label: '5'
                },
                {
                    value: 6,
                    label: '6'
                },
                {
                    value: 7,
                    label: '7'
                },
                {
                    value: 8,
                    label: '8'
                }
            ],
            array: [],
            clearable: true,
            selectOperand: '',
            selectBit: ''
        }
    }

    handleSelectOperand = (e, name) => {
        console.log("name", e, name)
        // if (selectOperand) {
        //     for (var i = 0; i < selectOperand.value; i++) {
        //         const obj = {
        //             index: i,
        //             groupLetter: String.fromCharCode(65 + i),
        //             groupMultiplier: ''
        //         }
        //         arr.push(obj);
        //     }
        // }
        if (name === 'selOperand') {
            this.setState({
                selectOperand: e,
            }, () => { console.log("selectOperand", this.state.selectOperand) })
        } else {
            this.setState({
                selectBit: e,
            }, () => { console.log("selectBit", this.state.selectBit) })
        }
       
    }

    // handleChange = (e, i) => {
    //     console.log("input index", i);
    //     this.setState({
    //         arrayGroups: update(this.state.arrayGroups, {
    //             [i]: { 'groupMultiplier': { $set: e.target.value } }
    //         })
    //     }, () => { console.log("update", this.state.arrayGroups) })
    // }

    build = () => {
        console.log("build");
        // const arr = [];
        // for (var i = 0; i < this.state.selectOperand.value; i++) {
        //     const letter = String.fromCharCode(65 + i).toLowerCase();
        //     for (var j = 0; j < this.state.selectBit.value; j++) {
        //         const o = {
        //             value: [],
        //             label: letter + j
        //         }
        //         arr.push(o);
        //     }
        // }
        // this.setState({
        //     array: arr
        // }, () => {console.log("array", this.state.array)})
        const row = [];
        for (var i = 0; i < Math.pow(2, 3); i++) {
            for (var j = (3 - 1) ; j >= 0 ; j--) {
                const a = (i / Math.pow(2,j)) % 2;
                row[3-1 -j] = Math.floor(a);
            }
            console.log('row', row)
          }
    }

    render() {
        const {
            selectOperand,
            selectBit,
            clearable,
            arrSelectOperands,
            arrayOperands,
            array
        } = this.state;
        const valueOperand = selectOperand && selectOperand.value;
        const valueBit = selectBit && selectBit.value;
        const validNumbers = selectOperand.value * selectBit.value;
        const selectOper = "selOperand";

        function TruthTable() {

            return (<p></p>);
        }

        return (
            <main className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4 content-menu d-flex justify-content-center align-items-center">
                            {/* <h1>menu selects</h1> */}
                            <div className="col-11 mt-4 mb-4 content-form">
                                <form>
                                    <div className="form-group row d-flex align-items-center">
                                        <label className="col-6">Number of operands:</label>
                                        <div className="col-6">
                                            <Select
                                                options={arrSelectOperands}
                                                clearable={clearable}
                                                value={valueOperand}
                                                onChange={(e) => this.handleSelectOperand(e, selectOper)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row d-flex align-items-center">
                                        <label className="col-6">Number of bits:</label>
                                        <div className="col-6">
                                            <Select
                                                options={arrSelectOperands}
                                                clearable={clearable}
                                                value={valueBit}
                                                onChange={(e) => this.handleSelectOperand(e)}
                                            />
                                        </div>
                                    </div>
                                    {validNumbers <= 16 && (
                                        <div className="form-group row form-button">
                                            <div className="col-12 d-flex justify-content-center">
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
                                        {array.map((o,i) => (<th key={i}>{o.label}</th>))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {/* <TruthTable /> */}
                                    <tr>
                                        <td>0</td>
                                        <td>1</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>1</td>
                                        <td>0</td>
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