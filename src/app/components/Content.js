import React from "react";
import Select from "react-select";
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
            selectBit: ''
        };
        this.convert = this.convert.bind(this);
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
        while(number.length !== num) {
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
            for (var j = (num - 1) ; j >= 0 ; j--) {
                const a = (i / Math.pow(2,j)) % 2;
                row[num-1 -j] = Math.floor(a);
                if (i === num - 1) {
                    arr2.push(letterR + (num -1 -j));
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
                    'R': {$set: arr2}
                }
            })
        }, () => {console.log("arr2", this.state.array)})
    }

    output() {
        console.log("output", data);
        console.log("shift", data.output.shift())
        var arrDNF = [];
            data.output.map((obj) => {
                const ar = Array.from(obj.R);
                ar.forEach((n, i) => {
                    const idx = arrDNF.map(ii => ii.index).indexOf(i);
                    if(+n === 1 && (arrDNF.length === 0 || idx === -1)) {
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
                arrayDNF: arrDNF
            }, () => {console.log("arrayDNF", this.state.arrayDNF)})
    }

    render() {
        const {
            selectOperand,
            selectBit,
            clearable,
            arrSelectOperands,
            arrayOperands,
            array,
            array1
        } = this.state;
        const valueOperand = selectOperand && selectOperand.value;
        const valueBit = selectBit && selectBit.value;
        const validNumbers = ((selectOperand !== null && selectBit !== null) && selectOperand.value * selectBit.value);
        const selectOper = "selOperand";

        function Verilog() {

            return (<div>
                <textarea>
                    module jdoodle;
                        reg[10*10:0] string;
                        reg[3:0] mem;
                        initial begin
                             string = "D:\espresso\output.txt";
                             i = 0;
                             repeat (16) begin
                                 $display ("Current value of i is %d", i);
                                 i = i + 1;
                             end
                             data_file = $fopen("D:\\espresso\\ver.txt");
                               if (data_file == 0) begin
                               end
                        end
                         always @(*) begin
                           scan_file = $fscanf(data_file, "%d", captured_data); 
                           if (!$feof(data_file)) begin
                             //use captured_data as you would any other wire or reg value;
                             $display ("Welcome to JDoodle!!! %s");
                           end
                         end
                    endmodule
                </textarea>
            </div>)
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
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            {array1[0].A.map((o,i) => (<th key={i}>{o}</th>))}
                                            {array1[0].R.map((o,i) => (<th key={i}>{o}</th>))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {array[0].A.map((o,i) => (
                                            <tr key={i}>
                                                {o.value.a.map((ob,ii) => (
                                                    <td key={ii}>
                                                        {ob}
                                                    </td>))}
                                                {o.value.r.map((ob,ii) => (
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
                                </Table>
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