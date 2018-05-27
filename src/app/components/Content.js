import React from "react";
import Select from "react-select";
import { Tabs, Tab, Alert } from "react-bootstrap";
import update from "react-addons-update";
import { Table } from 'reactstrap';

import data from "../../../output.json"

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
            array: [
                {
                    A: [],
                    R: []
                }
            ],
            array1: [
                {
                    A: [],
                    R: []
                }
            ],
            arrayDNF: [],
            clearable: true,
            selectOperand: '',
            selectBit: '',
            show: false,
            showBuild: false
        };
        this.convert = this.convert.bind(this);
    }

    handleSelectOperand = (e, name) => {
        console.log("name", e, name)
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

    convert(row, num) {
        const arr = [...row];
        var n = 1;
        for (var i = 0; i < this.state.selectOperand.value; i++) {
            var s = '';
            for (var j = 0; j < this.state.selectBit.value; j++) {
                s = s + arr[j];
            }
            n = n * parseInt(s, 2);
            arr.splice(0, this.state.selectBit.value);
        }
        const number = String((n >>> 0).toString(2)).split("");
        while (number.length !== num) {
            number.unshift('0');
        }
        return number;
    }

    build(num) {
        const arr = [];
        const arr1 = [];
        const arr2 = [];
        const letterR = String.fromCharCode(65 + 17).toLowerCase();

        for (var i = 0; i < this.state.selectOperand.value; i++) {
            const letterA = String.fromCharCode(65 + i).toLowerCase();
            for (var j = 0; j < this.state.selectBit.value; j++) {
                arr1.push(letterA + j);
            }
        }

        for (var i = 0; i < Math.pow(2, num); i++) {
            const row = [];
            var str = '';
            // 17
            for (var j = (num - 1); j >= 0; j--) {
                const a = (i / Math.pow(2, j)) % 2;
                row[num - 1 - j] = Math.floor(a);
                if (i === num - 1) {
                    arr2.push(letterR + (num - 1 - j));
                }

                str += Math.floor(a);
            }
            const o = {
                index: i,
                value: {
                    a: row,
                    r: this.convert(row, num)
                }
            }
            arr.push(o);

        }
        this.setState({
            array: update(this.state.array, {
                [0]: {
                    'A': { $set: arr }
                }
            }),
            array1: update(this.state.array1, {
                [0]: {
                    'A': { $set: arr1 },
                    'R': { $set: arr2 }
                }
            }),
            showBuild: true
        }, () => { console.log("arr2", this.state.array) })
    }

    output() {
        console.log("output", data);
        console.log("shift", data.output.shift())
        var arrDNF = [];
        data.output.map((obj) => {
            const ar = Array.from(obj.R);
            ar.forEach((n, i) => {
                const idx = arrDNF.map(ii => ii.index).indexOf(i);
                if (+n === 1 && (arrDNF.length === 0 || idx === -1)) {
                    const p = {
                        index: i,
                        name: [obj.A]
                    }
                    arrDNF.push(p);
                }
                else if (+n === 1 && idx !== -1) {
                    arrDNF[idx].name.push(obj.A)
                }
            })
        })
        this.setState({
            arrayDNF: arrDNF,
            show: true
        })
    }

    render() {
        const {
            selectOperand,
            selectBit,
            clearable,
            arrSelectOperands,
            arrayOperands,
            array,
            array1,
            arrayDNF,
            show
        } = this.state;
        const valueOperand = selectOperand && selectOperand.value;
        const valueBit = selectBit && selectBit.value;
        const validNumbers = ((selectOperand !== null && selectBit !== null) && selectOperand.value * selectBit.value);
        const selectOper = "selOperand";

        return (
            <main className="content">
                <div className="container-fluid">
                    {validNumbers > 16 &&
                        (<div className="row">
                            <div className="col-12 alert-pad">
                                <Alert bsStyle="warning" className="d-flex justify-content-center">
                                    <strong>Warning!</strong> 
                                    <p className="alert-p-mar">The sum of all bits must not exceed 16</p>
                                </Alert>;
                            </div>
                        </div>)
                    }
                    <div className="row">
                        <div className="col-4 content-menu ">
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
                                                <button type="button" className="btn btn-warning but" onClick={() => this.build(validNumbers)}>BUILD</button>
                                                {this.state.showBuild && (<button type="button" className="btn btn-warning but" disabled={show ? true : false} onClick={() => this.output()}>OUTPUT</button>)}
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                        <div className="col-8 content-main d-flex justify-content-center align-items-center">
                            <div className="col-6">
                                {!show ?
                                         (<Table bordered> 
                                            <thead>
                                                <tr>
                                                    {array1[0].A.map((o, i) => (<th key={i}>{o}</th>))}
                                                    {array1[0].R.map((o, i) => (<th key={i}>{o}</th>))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {array[0].A.map((o, i) => (
                                                    <tr key={i}>
                                                        {o.value.a.map((ob, ii) => (
                                                            <td key={ii}>
                                                                {ob}
                                                            </td>))}
                                                        {o.value.r.map((ob, ii) => (
                                                            <td key={ii}>
                                                                {ob}
                                                            </td>))}
                                                    </tr>))}
                                            </tbody>
                                        </Table>) :
                                    (
                                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" className="tabs-margin">
                                            <Tab eventKey={1} title={"tb"}>
                                                <div className="borFiles">
                                                    <p>library ieee;</p>
                                                    <p>use ieee.std_logic_1164.all;</p>
                                                    <p>entity tb is</p>
                                                    <p>end entity tb;</p>
                                                    <p>architecture TEST of tb is</p>
                                                    <p>signal x: std_logic_vector([{validNumbers} -1] downto 0);</p>
                                                    <p>signal output: std_logic_vector (0 to [{validNumbers}-1]);</p>
                                                    {arrayDNF.map((o, i) => (
                                                        <div key={i}>
                                                            <p>component f{i}</p>
                                                            <p>port (</p>
                                                            <p>x : in std_logic_vector([{validNumbers}-1] downto 0);</p>
                                                            <p>f:out std_logic</p>
                                                            <p>);</p>
                                                            <p>end component;</p>
                                                        </div>
                                                    ))}
                                                    <p>begin</p>
                                                    <p>{"x <= x + 1;"}</p>
                                                    {arrayDNF.map((o, i) => (
                                                        <div key={i}>
                                                            <p>inst_f{i}: f{i}</p>
                                                            <p>port map(x => x, f => output({i}));</p>
                                                        </div>
                                                    ))}
                                                    <p>end architecture TEST;</p>
                                                </div>
                                            </Tab>
                                            {this.state.arrayDNF.map((o, i) => (

                                                <Tab key={i} eventKey={i + 2} title={"f" + i}>
                                                    <div className="borFiles">
                                                        <p>entity f{i} is</p>
                                                        <p>port(</p>
                                                        <p>x : in std_logic_vector([{validNumbers}-1] downto 0);</p>
                                                        <p>f:out std_logic</p>
                                                        <p>);</p>
                                                        <p>end entity;</p>
                                                        <p>architecture arch of f{i} is</p>
                                                        <p>signal con : std_logic_vector([{arrayDNF.length}-1] downto 0):= (others => '0');</p>
                                                        <p>signal result: std_logic := '0';</p>
                                                        <p>type in_data is array(0 to [{arrayDNF.length}-1]) of std_logic_vector([{validNumbers}-1] downto 0);</p>
                                                        <p>signal table: in_data :=(</p>
                                                        {o.name.map((obj, ii) => (
                                                            <p key={ii}>"{obj}"</p>
                                                        ))}
                                                        <p>);</p>
                                                        <p>begin</p>
                                                        <p>process(x)</p>
                                                        <p>variable word: std_logic_vector([{validNumbers}-1] downto 0);</p>
                                                        <p>variable i, j, k: integer := 0;</p>
                                                        <p>begin</p>
                                                        <p>for i in 0 to [{arrayDNF.length}-1] loop</p>
                                                        <p>word := table(i);</p>
                                                        <p>for j in 0 to [{validNumbers}-1] loop</p>
                                                        <p>if word(j) = '1' then</p>
                                                        <p>{"con(i) <= con(i) and x(j);"}</p>
                                                        <p>end if;</p>
                                                        <p>end loop;</p>
                                                        <p>end loop;</p>

                                                        <p>for k in 0 to [{arrayDNF.length}-1] loop</p>
                                                        <p>{"result <= result or con(k);"}</p>
                                                        <p>end loop;</p>
                                                        <p>end process;</p>
                                                        <p>end arch;</p>
                                                    </div>
                                                </Tab>))}
                                        </Tabs>)
                                }
                            </div>
                            <div className="col-6">
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        );
    }
}