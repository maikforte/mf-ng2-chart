export class MfBarChartComparator {
    public label: string;
    public value: number;

    constructor();
    constructor(label: string, value: number);
    constructor(label?: string, value?: number) {
        this.label = label;
        this.value = value;
    }
}
