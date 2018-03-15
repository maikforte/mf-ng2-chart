# mf-ng2-chart

## Installation

To install this library, run:

```bash
$ npm install mf-ng2-chart --save
```

<br>

## Note
Follow the quickstart provided that you have at least one `<svg>` defined in your Angular Component's `.html`

```xml
<div>
  <svg id="chart"></svg>
</div>
```

<br>

## Table of Contents
- [BarChart](#bar-chart)

<br>

## Bar Chart
On your Angular `AppModule`, import `MfBarChartService` Angular Service and define the service in your module providers.

```typescript
import { MfBarChartService } from 'mf-ng2-chart';
```

```typescript
providers: [MfBarChartService]
```
<br>

On your Angular `AppComponent`, import `MfBarChartService`, `MfBarChartComparator`, and `MfBarChartData`.

```typescript
import { MfBarChartService, MfBarChartComparator, MfBarChartData } from 'mf-ng2-chart';
```

```typescript
constructor (private mfBarChartService: MfBarChartService) {}
```
<br>

`MfBarChartComparator` takes 2 parameters.<br>
```typescript
MfBarChartComparator(<label: string>, <value: number>)
```

`label` - Comparator label as displayed in chart<br>
`value` - Value where the data is being compared<br><br>

`MfBarChartData` on the otherhand, takes 3 parameters.<br>
```typescript
MfBarChartComparator(<label: string>, <value: number>, <description: string>)
```

`label` - Data label as displayed in chart<br>
`value` - Value of data<br>
`description` - Short description of the data (Currently not being used. Leave '' for now)<br><br>

Lastly, `MfBarChartService.createBarChart()` takes 3 required parameters and 1 optional options.<br>
```typescript
MfBarChartService.createBarChart(<your_svg: string>,
  <comparators: Array<MfBarChartComparator>>,
  <data: Array<MfBarChartData>>,
  <options?: any>)
```

#### Sample Options
```typescript
options = {
  chartHeight: 200, // Defaults to 200
  chartWidth: 300, // Defaults to 300
  barWidth: 20, // Defaults to 20
  comparatorStrokeWidth: 1, // Defaults to 1. 0 for none
  borderStrokeWidth: 2 // Defaults to 2. 0 for none
}
```
<br>

### Usage

```typescript
export class AppComponent implements OnInit {

  // Define the Comparators
  public comparators: Array<MfBarChartComparator> = [
    new MfBarChartComparator('0', 0),
    new MfBarChartComparator('5', 5),
    new MfBarChartComparator('10', 10),
    new MfBarChartComparator('15', 15),
    new MfBarChartComparator('', 20)
  ];

  // Define the Data
  public data: Array<MfBarChartData> = [
    new MfBarChartData('A', 9, ''),
    new MfBarChartData('B', 10, ''),
    new MfBarChartData('C', 7, ''),
    new MfBarChartData('D', 15, '')
  ];

  constructor (
    private mfBarChartService: MfBarChartService
  ) {}

  ngOnInit() {
    this.mfBarChartService.createBarChart('svg#chart', this.comparators, this.datum, {
      barWidth: 30,
      chartHeight: 400
    });
  }

}
```

## License

MIT © [Michael Ardan](mailto:michael.ardan2000@gmail.com)
