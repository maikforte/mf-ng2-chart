export class MfBarChartData {
    public label: string;
    public value: number;
    public description: string;
    public barHeight: number;

    constructor();
    constructor(label: string, value: number, description: string);
    constructor(label?: string, value?: number, description?: string) {
        this.label = label;
        this.value = value;
        this.description = description;
        this.barHeight = 0;
    }
}
