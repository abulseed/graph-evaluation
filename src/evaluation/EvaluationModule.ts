import * as formula from 'formulajs';

import { Node, IDatabaseAdapter, Operand, Formula, Validation_Formula } from '../database/IDatabaseAdapter';

import * as ExportsSheet from '../ExportsSheet';

export class EvaluationModel {
    DataModelService: IDatabaseAdapter;
    GraphModelService: IDatabaseAdapter;

    constructor(DataModelService: IDatabaseAdapter, GraphModelService: IDatabaseAdapter) {
        try {
            this.DataModelService = DataModelService;
            this.GraphModelService = GraphModelService;
        } catch (err) {
            throw err;
        }
    }

    async evaluateNodeByFormula(node: Node): Promise<Node> {
        try {
            const temp = node;
            const nodeFormula: Formula = temp.FORMULA_OBJ;
            const newValue: string = this.evaluateFormula(nodeFormula).toString();
            temp.CELL_VALUE = newValue;
            return temp;
        } catch (error) {
            throw error;
        }
    }

    async evaluateNodeByValidationFormula(node: Node): Promise<Node> {
        try {
            const temp = node;
            const nodeValdiationFormula: Validation_Formula = temp.VALIDATION_FORMULA_OBJ;
            const newValue: string = this.evaluateFormula(nodeValdiationFormula).toString();
            temp.CELL_VALIDATION_VALUE = newValue;
            return temp;
        } catch (error) {
            throw error;
        }
    }

    async evaluateCellsInFormula(node: Node): Promise<{ node: Node, cellsInFormula: Node[] }> {
        try {
            const temp = node;
            const cellsInFormula: Node[] = [];
            await this.fillOperandsOfCellType(temp, cellsInFormula);
            return { node: temp, cellsInFormula: cellsInFormula };
        } catch (error) {
            throw error;
        }
    }

    async evaluateCellsInValidationFormula(node: Node): Promise<{ node: Node, cellsInFormula: Node[] }> {
        try {
            const temp = node;
            const cellsInFormula: Node[] = [];
            await this.fillValidationOperandsOfCellType(temp, cellsInFormula);
            return { node: temp, cellsInFormula: cellsInFormula };
        } catch (error) {
            throw error;
        }
    }

    private fillOperandsOfCellType = (node: Node, cellsInFormula: Node[]) => {
        try {
            const operands = node.FORMULA_OBJ.OPERANDS;
            if (!operands)
                throw `Formula has no operands defined.`

            const operandsOfCellType = operands.filter((op: Operand) => {
                return op.TYPE.toLowerCase() == 'cell';
            });
            const promises: Promise<any>[] = operandsOfCellType.map(async (op: Operand) => {
                const cellNode: Node = {
                    SHEET_ID: op.VALUE.sheetId,
                    ROW_ID: op.VALUE.rowId,
                    COL_ID: op.VALUE.colId
                } as Node;
                const cellIdFirestore: string = ExportsSheet.generateId(cellNode);

                const document = await this.DataModelService.getRecord(cellNode, '');
                if (document.exists) {
                    const newValue = document.data().data;
                    op.PROCESSING_VALUE = newValue;
                    cellNode.CELL_VALUE = newValue;
                    cellsInFormula.push(cellNode);
                } else {
                    throw `Cell doesn't exist in the Data Model. ID[${ExportsSheet.generateId(cellNode)}]`;
                }
            });
            return Promise.all(promises);
        } catch (error) {
            throw error;
        }
    }

    private fillValidationOperandsOfCellType = (node: Node, cellsInFormula: Node[]) => {
        try {
            const operands = node.VALIDATION_FORMULA_OBJ.OPERANDS;
            if (!operands)
                throw `Formula has no operands defined.`

            const operandsOfCellType = operands.filter((op: Operand) => {
                return op.TYPE.toLowerCase() == 'cell';
            });
            const promises: Promise<any>[] = operandsOfCellType.map(async (op: Operand) => {
                const cellNode: Node = {
                    SHEET_ID: op.VALUE.sheetId,
                    ROW_ID: op.VALUE.rowId,
                    COL_ID: op.VALUE.colId
                } as Node;
                const cellIdFirestore: string = ExportsSheet.generateId(cellNode);

                const document = await this.DataModelService.getRecord(cellNode, '');
                if (document.exists) {
                    const newValue = document.data().data;
                    op.PROCESSING_VALUE = newValue;
                    cellNode.CELL_VALUE = newValue;
                    cellsInFormula.push(cellNode);
                } else {
                    throw `Cell doesn't exist in the Data Model. ID[${ExportsSheet.generateId(cellNode)}]`;
                }
            });
            return Promise.all(promises);
        } catch (error) {
            throw error;
        }
    }

    public async startReevaluationOfNode(node: Node) {
        try {
            const newNode: Node = await this.evaluateNodeByFormula(node);
            await this.GraphModelService.updateNodeData(ExportsSheet.generateId(newNode), newNode);
            await this.DataModelService.updateNodeData('', newNode);
            return true;
        } catch (error) {
            throw error;

        }
    }

    evaluateFormula(informula: Formula): number | boolean | string {
        try {
            const operation: string = informula.OPERATION;
            let operands: any[] = informula.OPERANDS.map((op: Operand) => {
                return op.PROCESSING_VALUE || op.VALUE;
            });

            let result: number | boolean | string;
            switch (operation.toLowerCase()) {
                case 'sum':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.SUM(operands);
                    break;
                case 'mod':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.MOD(operands[0], operands[1]); break;
                case 'int':
                    result = formula.INT(operands[0]); break;
                case 'rand':
                    result = formula.RAND(); break;
                case 'round':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.ROUND(operands[0], 0); break;
                case 'avg':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.AVERAGE(operands); break;
                case 'min':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.MIN(operands); break;
                case 'max':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.MAX(operands); break;
                case 'abs':
                    operands[0] = Number(operands[0])
                    result = formula.ABS(operands[0]); break;
                case 'if':
                    result = formula.IF(operands[0], operands[1], operands[2]); break;
                case 'and':
                    result = formula.AND(operands); break;
                case 'or':
                    result = formula.OR(operands); break;
                case 'not':
                    result = formula.NOT(operands[0]); break;
                case 'xor':
                    result = formula.XOR(operands); break;
                case '>=':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] >= operands[1]; break;
                case '<=':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] <= operands[1]; break;
                case '<>':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] != operands[1]; break;
                case '=':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] == operands[1]; break;
                case '>':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] > operands[1]; break;
                case '<':
                    operands = operands.map((op) => { return Number(op); })
                    result = operands[0] < operands[1]; break;
                case 'sin':
                    operands[0] = Number(operands[0]);
                    result = formula.SIN(this.toRadian(operands[0])); break;
                case 'cos':
                    operands[0] = Number(operands[0]);
                    result = formula.COS(this.toRadian(operands[0])); break;
                case 'tan':
                    operands[0] = Number(operands[0]);
                    result = formula.TAN(this.toRadian(operands[0])); break;
                case 'cot':
                    operands[0] = Number(operands[0]);
                    result = formula.COT(this.toRadian(operands[0])); break;
                case 'csc':
                    operands[0] = Number(operands[0]);
                    result = formula.CSC(this.toRadian(operands[0])); break;
                case 'sec':
                    operands[0] = Number(operands[0]);
                    result = formula.SEC(this.toRadian(operands[0])); break;
                case 'sech':
                    operands[0] = Number(operands[0]);
                    result = formula.SECH(this.toRadian(operands[0])); break;
                case 'acos':
                    operands[0] = Number(operands[0]);
                    result = formula.ACOS(this.toRadian(operands[0])); break;
                case 'acosh':
                    operands[0] = Number(operands[0]);
                    result = formula.ACOSH(this.toRadian(operands[0])); break;
                case 'acot':
                    operands[0] = Number(operands[0]);
                    result = formula.ACOT(this.toRadian(operands[0])); break;
                case 'acoth':
                    operands[0] = Number(operands[0]);
                    result = formula.ACOTH(this.toRadian(operands[0])); break;
                case 'sinh':
                    operands[0] = Number(operands[0]);
                    result = formula.SINH(this.toRadian(operands[0])); break;
                case 'asin':
                    operands[0] = Number(operands[0]);
                    result = formula.ASIN(this.toRadian(operands[0])); break;
                case 'asinh':
                    operands[0] = Number(operands[0]);
                    result = formula.ASINH(this.toRadian(operands[0])); break;
                case 'atan':
                    operands[0] = Number(operands[0]);
                    result = formula.ATAN(this.toRadian(operands[0])); break;
                case 'tanh':
                    operands[0] = Number(operands[0]);
                    result = formula.TANH(this.toRadian(operands[0])); break;
                case 'atanh':
                    operands[0] = Number(operands[0]);
                    result = formula.ATANH(this.toRadian(operands[0])); break;
                case 'cosh':
                    operands[0] = Number(operands[0]);
                    result = formula.COSH(this.toRadian(operands[0])); break;
                case 'coth':
                    operands[0] = Number(operands[0]);
                    result = formula.COTH(this.toRadian(operands[0])); break;
                case 'csch':
                    operands[0] = Number(operands[0]);
                    result = formula.CSCH(this.toRadian(operands[0])); break;
                case 'sqrt':
                    operands[0] = Number(operands[0]);
                    result = formula.SQRT(operands[0]); break;
                case 'power':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.POWER(operands[0], operands[1]); break;
                case 'trunc':
                    operands[0] = Number(operands[0]);
                    result = formula.TRUNC(operands[0]); break;
                case 'log':
                    operands = operands.map((op) => { return Number(op); })
                    result = formula.LOG(operands[0], operands[1]); break;
                case 'oct2bin':
                    operands[0] = Number(operands[0]);
                    result = formula.OCT2BIN(operands[0]); break;
                case 'oct2dec':
                    operands[0] = Number(operands[0]);
                    result = formula.OCT2DEC(operands[0]); break;
                case 'oct2hex':
                    operands[0] = Number(operands[0]);
                    result = formula.OCT2HEX(operands[0]); break;
                case 'day':
                    result = formula.DAY(operands[0]); break;
                case 'hour':
                    result = formula.HOUR(operands[0]); break;
                case 'minute':
                    result = formula.MINUTE(operands[0]); break;
                case 'second':
                    result = formula.SECOND(operands[0]); break;
                case 'month':
                    result = formula.MONTH(operands[0]); break;
                case 'networkdays':
                    result = formula.NETWORKDAYS(operands[0], operands[1]); break;
                case 'weekday':
                    result = formula.WEEKDAY(operands[0], operands[1]); break;
                case 'year':
                    result = formula.YEAR(operands[0]); break;
                case 'isnumber':
                    result = formula.ISNUMBER(operands[0]); break;
                case 'equals':
                    result = operands[0];
                    break;
                default:
                    result = undefined;
            }
            return (typeof result === 'number') ? formula.ROUND(result, 8) : result;
        } catch (error) {
            throw error;
        }
    }

    toRadian(angle: any) {
        return angle * (Math.PI / 180);
    }

    getOperatorSign(value: string): string {
        switch (value.toLowerCase()) {
            case 'sum':
                return '+';

            default:
                throw 'Unsupported';
        }
    }
}