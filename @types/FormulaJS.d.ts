declare var formula: FormulajsNS.Formula;

declare namespace FormulajsNS {
    export interface Formula {
        SUM(operands: number[]): number
        MOD(num: number, divisor: number): number
        ROUND(num: number, num_digits: number): number
        AVERAGE(operands: number[]): number
        MAX(operands: number[]): number
        INT(num: number): number
        RAND(): number
        MIN(operands: number[]): number
        ABS(num: number): number
        AND(conditions: any[]): boolean
        OR(conditions: any[]): boolean
        NOT(condition: string | boolean): boolean
        XOR(conditions: any[]): boolean
        IF(condition: boolean | string, ifPass: string, ifFail: string): boolean
        SIN(num: number): number
        COS(num: number): number
        TAN(num: number): number
        COT(num: number): number
        CSC(num: number): number
        SEC(num: number): number
        SECH(num: number): number
        ACOS(num: number): number
        ACOSH(num: number): number
        ACOT(num: number): number
        ACOTH(num: number): number
        SINH(num: number): number
        ASIN(num: number): number
        ASINH(num: number): number
        ATAN(num: number): number
        TANH(num: number): number
        ATANH(num: number): number
        COSH(num: number): number
        COTH(num: number): number
        CSCH(num: number): number
        SQRT(num: number): number
        POWER(num: number, power: number): number
        TRUNC(num: number): number
        LOG(num: number, base: number): number
        OCT2BIN(num: number): string
        OCT2DEC(num: number): string
        OCT2HEX(num: number): string
        DAY(date: string): number
        HOUR(time: number | string): number
        MINUTE(time: number | string): number
        SECOND(time: number | string): number
        MONTH(date: number | string): number
        NETWORKDAYS(start_date: string, end_date: string, holidays?: string[]): number
        WEEKDAY(serial_number: string, return_type?: number): number
        YEAR(date: string): number
        ISNUMBER(num: string): boolean
    }
}

declare module 'formulajs' {
    export = formula;
}