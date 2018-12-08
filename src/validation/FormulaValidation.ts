import { HashMap } from "../ExportsSheet";
import { Formula, Operand } from "../database/IDatabaseAdapter";

class FormulaValidation {
    private _formula: Formula;
    private static _supportedFunctions: HashMap<(operands: Operand[]) => boolean> = {
        sum: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'SUM: Cannot accept less than 1 operand.'
            }
            return true;
        }

        ,
        mod: (operands: Operand[]) => {
            if (operands.length != 2) {
                throw 'MOD: Can only accept two operands.'
            }
            return true;
        }
        ,
        round: (operands: Operand[]) => {
            if (operands.length != 2) {
                throw 'ROUND: Can only accept two operands.'
            }
            return true;
        }
        ,
        average: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'AVERAGE: Cannot accept less than 1 operand.'
            }
            return true;
        }
        ,
        max: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'MAX: Cannot accept less than 1 operand.'
            }
            return true;
        }
        ,
        int: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'INT: Can only accept one operand.'
            }
            return true;
        }
        ,
        rand: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'RAND: Can only accept one operand.'
            }
            return true;
        }
        ,
        min: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'MIN: Cannot accept less than 1 operand.'
            }
            return true;
        }
        ,
        abs: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ABS: Can only accept one operand.'
            }
            return true;
        }
        ,
        and: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'AND: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'AND: can only accept string.'
            })
            return true;
        }
        ,
        or: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'OR: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'OR: can only accept string.'
            })
            return true;
        }
        ,
        not: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'NOT: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string || boolean')
                    throw 'NOT: can only accept string or boolean.'
            })
            return true;
        }
        ,
        xor: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'XOR: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'XOR: can only accept string.'
            })
            return true;
        }
        ,
        if: (operands: Operand[]) => {
            if (operands.length != 3) {
                throw 'IF: Can only accept three operands.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string || boolean')
                    throw 'IF: can only accept string or boolean.'
            })
            return true;
        }
        ,
        sin: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'SIN: Can only accept one operand.'
            }
            return true;
        }
        ,
        cos: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'COS: Can only accept one operand.'
            }
            return true;
        }
        ,
        tan: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'TAN: Can only accept one operand.'
            }
            return true;
        }
        ,
        cot: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'COT: Can only accept one operand.'
            }
            return true;
        }
        ,
        csc: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'CSC: Can only accept one operand.'
            }
            return true;
        }
        ,
        sec: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'SEC: Can only accept one operand.'
            }
            return true;
        }
        ,
        sech: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'SECH: Can only accept one operand.'
            }
            return true;
        }
        ,
        acos: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ACOS: Can only accept one operand.'
            }
            return true;
        }
        ,
        acosh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ACOSH: Can only accept one operand.'
            }
            return true;
        }
        ,
        acot: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ACOT: Can only accept one operand.'
            }
            return true;
        }
        ,
        acoth: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ACOTH: Can only accept one operand.'
            }
            return true;
        }
        ,
        sinh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'SINH: Can only accept one operand.'
            }
            return true;
        }
        ,
        asin: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ASIN: Can only accept one operand.'
            }
            return true;
        }
        ,
        asinh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ASINH: Can only accept one operand.'
            }
            return true;
        }
        ,
        atan: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ATAN: Can only accept one operand.'
            }
            return true;
        }
        ,
        tanh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'TANH: Can only accept one operand.'
            }
            return true;
        }
        ,
        atanh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ATANH: Can only accept one operand.'
            }
            return true;
        }
        ,
        cosh: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'COSH: Can only accept one operand.'
            }
            return true;
        }
        ,
        coth: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'COTH: Can only accept one operand.'
            }
            return true;
        }
        ,
        csch: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'CSCH: Can only accept one operand.'
            }
            return true;
        }
        ,
        sqrt: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'SQRT: Can only accept one operand.'
            }
            return true;
        }
        ,
        power: (operands: Operand[]) => {
            if (operands.length != 2) {
                throw 'POWER: Can only accept two operands.'
            }
            return true;
        }
        ,
        trunc: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'TRUNC: Can only accept one operand.'
            }
            return true;
        }
        ,
        log: (operands: Operand[]) => {
            if (operands.length != 2) {
                throw 'LOG: Can only accept two operands.'
            }
            return true;
        }
        ,
        oct2bin: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'OCT2BIN: Can only accept one operand.'
            }
            return true;
        }
        ,
        oct2dec: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'OCT2DEC: Can only accept one operand.'
            }
            return true;
        }
        ,
        oct2hex: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'OCT2HEX: Can only accept one operand.'
            }
            return true;
        }
        ,
        day: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'DAY: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'DAY: can only accept string.'
            })
            return true;
        }
        ,
        hour: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'HOUR: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'number || string')
                    throw 'HOUR: can only accept number or string.'
            })
            return true;
        }
        ,
        minute: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'MINUTE: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'number || string')
                    throw 'MINUTE: can only accept number or string.'
            })
            return true;
        }
        ,
        second: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'SECOND: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'number || string')
                    throw 'SECOND: can only accept number or string.'
            })
            return true;
        }
        ,
        month: (operands: Operand[]) => {
            if (operands.length <= 0) {
                throw 'MONTH: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'number || string')
                    throw 'MONTH: can only accept number or string.'
            })
            return true;
        }
        ,
        networkdays: (operands: Operand[]) => {
            if (operands.length != 3) {
                throw 'NETWORKDAYS: Can only accept three operands.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'NETWORKDAYS: can only accept number string.'
            })
            return true;
        }
        ,
        weekday: (operands: Operand[]) => {
            if (operands.length != 2) {
                throw 'WEEKDAY: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string || number')
                    throw 'WEEKDAY: can only accept string or number.'
            })
            return true;
        }
        ,
        year: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'YEAR: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'WEEKDAY: can only accept string.'
            })
            return true;
        }
        ,
        isnumber: (operands: Operand[]) => {
            if (operands.length != 1) {
                throw 'ISNUMBER: Can only accept one operand.'
            }
            operands.forEach((operand: Operand) => {
                if (operand.TYPE != 'string')
                    throw 'ISNUMBER: can only accept string.'
            })
            return true;
        }


    };
    constructor(formula: Formula) {
        this._formula = formula;
    }
}
