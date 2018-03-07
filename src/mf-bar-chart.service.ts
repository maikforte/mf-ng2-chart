import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class MfBarChartService {

  svg: any;

  constructor() {

  }

  public createBarChart(element: string, comparators: Array<any>, data: Array<any>): void {
    this.svg = d3.select(element);
    this.clearChart();
    this.generateChart(comparators, data);
  }

  public clearChart(): void {
    this.svg.selectAll('*').remove();
  }

  public generateChart(comparators: Array<any>, data: Array<any>): void {
    const MAX_CHART_HEIGHT = 200;
    const MAX_CHART_WIDTH = 300;
    const VIEW_BOX_HEIGHT = 400;
    const VIEW_BOX_WIDTH = 400;
    const CHART_CONTAINER_X = 5;
    const CHART_CONTAINER_Y = 5;
    const CHART_CONTAINER_HEIGHT = 200;
    const CHART_CONTAINER_WIDTH = 300;
    const INITIAL_COMPARATOR_Y = 180;
    const COMPARATOR_HEIGHT_INTERVAL = MAX_CHART_HEIGHT / comparators.length;
    const INITIAL_DATA_LIST_X = 50;
    const DATA_LIST_Y = 200;
    const DATA_LIST_WIDTH_INTERVAL = MAX_CHART_WIDTH / data.length;
    const BAR_Y = DATA_LIST_Y - 20;
    const BAR_WIDTH = 20;

    this.setSvgSize(0, 0, VIEW_BOX_HEIGHT, VIEW_BOX_WIDTH);
    this.generateChartBox(CHART_CONTAINER_X, CHART_CONTAINER_Y, CHART_CONTAINER_HEIGHT, CHART_CONTAINER_WIDTH);
    this.generateComparator(comparators, INITIAL_COMPARATOR_Y, COMPARATOR_HEIGHT_INTERVAL);
    this.generateDataList(data, INITIAL_DATA_LIST_X, DATA_LIST_Y, DATA_LIST_WIDTH_INTERVAL);
    this.generateBars(data, comparators, INITIAL_DATA_LIST_X, BAR_Y, BAR_WIDTH, DATA_LIST_WIDTH_INTERVAL, COMPARATOR_HEIGHT_INTERVAL);
  }

  private setSvgSize(minx: number, miny: number, height: number, width: number): void {
    this.svg.attr('viewBox', `${miny} ${minx} ${height} ${width}`);
  }

  private generateChartBox(x: number, y: number, height: number, width: number): void {
    this.svg
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', height)
      .attr('width', width)
      .attr('stroke-width', '2')
      .attr('opacity', '.5')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', 'rgba(0,0,0,1)');
  }

  private generateComparator(comparators: Array<any>, y: number, heightInterval: number): void {
    comparators.reverse();
    for (let i = comparators.length - 1; i >= 0; i -- ) {
      this.svg
      .append('line')
      .attr('x1', 30)
      .attr('y1', y)
      .attr('x2', 300)
      .attr('y2', y)
      .attr('stroke', 'rgba(0,0,0,.05)');

      this.svg
      .append('text')
      .text(comparators[i].value)
      .attr('x', 30)
      .attr('y', y)
      .attr('text-anchor', 'end');
      y -= heightInterval;
    }
  }

  private generateDataList(data: Array<any>, x: number, y: number, widthInterval: number): void {
    for (let i = 0; i < data.length; i ++) {
      this.svg
      .append('text')
      .text(data[i].label)
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle');

      x += widthInterval;
    }
  }

  private generateBars(data: Array<any>, comparators: Array<any>, x: number, y: number, barWidth: number, widthInterval: number, heightInterval: number): void {
    comparators.reverse();
    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      innerLoop:
      for (let comparatorIndex = 0; comparatorIndex < comparators.length; comparatorIndex ++) {
        if (data[dataIndex].number <= comparators[comparatorIndex].value) {
            const equalComparator = data[dataIndex].number === comparators[comparatorIndex].value
                                    ? true
                                    : false;
            const range = Math.abs(comparators[comparatorIndex - 1].value - comparators[comparatorIndex].value);
            const denominator = heightInterval / range;
            const difference = equalComparator
                          ? 0
                          : Math.abs(comparators[comparatorIndex].value - data[dataIndex].number);
            const height = ( ( heightInterval * ( comparatorIndex + 1 ) ) - heightInterval ) - difference * denominator;
            data[dataIndex]['height'] = height;
            break innerLoop;
        }
      }
    }
    for (let i = 0; i < data.length; i ++) {
      this.svg
        .append('rect')
        .attr('id', `bar${i + 1}`)
        .attr('x', x - (barWidth / 2.5))
        .attr('y', y - (data[i].height
                        ? data[i].height
                        : 0))
        .attr('width', barWidth)
        .attr('height', data[i].height)
        .attr('fill', '#2196F3')
        .attr('opacity', .5);
      x += widthInterval;
    }
  }

  private onBarMouseOver(d, i, e) {
    d3.select(`rect#${e[0].id}`)
    .style({
      'opacity' : 1
    });
  }

  private onBarMouseOut(d, i, e) {
    d3.select(`rect#${e[0].id}`)
    .style({
      'opacity' : .5
    });
  }
}
