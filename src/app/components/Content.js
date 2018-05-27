import React from "react";
import Select from "react-select";
import update from "react-addons-update";
import { Table } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

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
            arrVHDL: [],
            clearable: true,
            selectOperand: '',
            selectBit: '',
            show: false
        };
        this.convert = this.convert.bind(this);
        this.outputVHDL = this.outputVHDL.bind(this);
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
            show: false
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
        this.outputVHDL(arrDNF);
        this.setState({
            arrayDNF: arrDNF,
            show: true
        })
    }

    outputVHDL(arr) {
        const mul = this.state.selectBit.value * this.state.selectOperand.value;
        var ar = [];
        for (var p = 0; p < mul; p++) {
            const o = {
                index: p
            }
            ar.push(o);
            }
        this.setState({
            arrVHDL: ar
        }, () => {console.log("arrrrr", this.state.arrVHDL)})
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
                                                <button type="button" className="btn btn-warning" onClick={() => this.build(validNumbers)}>BUILD</button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                            {/* <div>
                                <button type="button" className="btn btn-warning" onClick={() => this.output()}>OUTPUT</button>
                            </div> */}
                        </div>
                        <div className="col-8 content-main d-flex justify-content-center align-items-center">
                            <div className="col-9">
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
                                            {/* {array[0].R.map((o,i) => (
                                        <tr key={i}>
                                            {o.value.map((ob,ii) => (
                                                <td key={ii}>
                                                    {+ob} 
                                                </td>))}
                                        </tr>))} */}
                                        </tbody>
                                    </Table>) :
                                    // (this.state.arrVhdl.props.children.map((obj, i) => (
                                    //     (i !== 11 ? 
                                    //         <div>{obj.props.children.map((o, ind) => (<p key={ind}> {o}</p>))}</div> :
                                    //         <div> {obj.map((oo, ii) => (<div key={ii}>{oo.props.children.map((ooo, iii) => 
                                    //             (<p key={iii}>{ooo}</p>)
                                    //         )}</div>))}</div>
                                    //     )
                                        
                                    // )
                                        
                                    // ))
                                    (this.state.arrayDNF.map((o, i) => (<div key={i}>
                                        <p>entity f{o.index} is</p>
                                        <p>port(</p>
                                        <p>x : in std_logic_vector([{validNumbers}-1] downto 0);</p>
                                        <p>f:out std_logic</p>
                                        <p>);</p>
                                        <p>end entity;</p>
                                        <p>architecture arch of f{o.index} is</p>
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
                                    </div>)))
                                }
                            </div>
                            <div className="col-3">
                                <button type="button" className="btn btn-warning" onClick={() => this.output()}>OUTPUT</button>
                            </div>


                        </div>
                    </div>
                </div>
            </main>

        );
    }
}