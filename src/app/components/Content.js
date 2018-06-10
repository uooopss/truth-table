import React from "react";
import Select from "react-select";
import { Tabs, Tab, Alert } from "react-bootstrap";
import update from "react-addons-update";
import { Table } from 'reactstrap';
import { Jumbotron, Container } from 'reactstrap';

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
                    A: []
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
        this.monoton = this.monoton.bind(this);
        this.compare = this.compare.bind(this);
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

        this.monoton(arr, arr2);

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
            showBuild: true,
            show: false
        })
    }

    monoton(arr, arr2) {
        const num = [];
        const a = this.state.selectOperand.value * this.state.selectBit.value;
        console.log("arr", arr)
        for (var w = 0; w < a; w++) {
            var stroka = "";
                arr.map((obj) => {
                    stroka = stroka + obj.value.r[w];
                })
            for (var i = Math.pow(2, a) / 2; i >= 1; i = i / 2) {
                var s = '';
                var result = false;
                var con = "";
                    const re = new RegExp(".{1,"+i+"}", "g");
                    s = stroka.match(re);
                    console.log("ssss", s);
                    if (this.compare(s)) {
                        num.push(w);
                        result = true;
                        con = i;
                        break;
                    }
            }
            console.log("result", result, con);
        }

        num.reverse().map(n => {arr.map(obj => (
            obj.value.r.splice(n, 1)
        ));
            arr2.splice(n, 1);
        })

        console.log("arrayMonoton", arr)
        
    }

    compare(str) {
        var count = 0;
        for (var q = 0; q < str.length; q = q+2) {
            if (parseInt(str[q], 2) > parseInt(str[q+1], 2)) {
                count++;
            }
        }
        return (count === 0 ? false : true)
    }

    output() {
        const a = (this.state.selectOperand.value + this.state.selectBit.value) * this.state.selectBit.value;
        const idx = data.output.map(i => i.index).indexOf(a);
        var arrDNF = [];
        data.output[idx].name.map((obj) => {
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

    // space (num) {
    //     var str = "";
    //     console.log("shift", data_ex.output_ex.shift());
    //   var qq =  data_ex.output_ex.map((obj, i) => {
    //       const w = obj.A.slice(0, 12) + " " + obj.A.slice(12);
    //       str = str + "\n" + w;
    //         return w;
    //     })
    //     console.log("space", qq)
    //     console.log("strrr", str);
    // }

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
                    {validNumbers > 12 &&
                        (<div className="row">
                            <div className="col-12 alert-pad">
                                <Alert bsStyle="danger" className="d-flex justify-content-center">
                                    <strong>Warning!</strong> 
                                    <p className="alert-p-mar">The sum of all bits is greater than 12</p>
                                </Alert>; 
                            </div>
                        </div>)
                    }
                    <div className="row">
                        <div className="col-4 content-menu ">
                            <div className="col-11 mt-4 mb-4 content-form">
                                <form>
                                    <div className="row form-header">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-center">
                                                        <h3 className="form-header-h3">SPECIFY VALUES</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 ">
                                                    <div className="d-flex justify-content-center">
                                                        <h4 className="form-header-h4">The sum of all bits must not exceed 12</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div className="form-group row d-flex align-items-center form-select-margin">
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
                                    {validNumbers <= 12 && (
                                        <div className="form-group row form-button form-select-margin">
                                            <div className="col-12 d-flex justify-content-center">
                                                <button type="button" className="btn btn-warning but" onClick={() => this.build(validNumbers)}>BUILD</button>
                                                {/* <button type="button" className="btn btn-warning but" onClick={() => this.space(validNumbers)}>SPACE</button> */}
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
                                                        <p>signal con : std_logic_vector([{o.name.length}-1] downto 0):= (others => '0');</p>
                                                        <p>signal result: std_logic := '0';</p>
                                                        <p>type in_data is array(0 to [{o.name.length}-1]) of std_logic_vector([{validNumbers}-1] downto 0);</p>
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
                                                        <p>for i in 0 to [{o.name.length}-1] loop</p>
                                                        <p>word := table(i);</p>
                                                        <p>for j in 0 to [{validNumbers}-1] loop</p>
                                                        <p>if word(j) = '1' then</p>
                                                        <p>{"con(i) <= con(i) and x(j);"}</p>
                                                        <p>end if;</p>
                                                        <p>end loop;</p>
                                                        <p>end loop;</p>

                                                        <p>for k in 0 to [{o.name.length}-1] loop</p>
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