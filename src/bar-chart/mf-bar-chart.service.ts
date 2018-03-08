import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'underscore';

import { MfBarChartComparator } from './mf-bar-chart-comparator.model';
import { MfBarChartData } from './mf-bar-chart-data.model';

@Injectable()
export class MfBarChartService {

  svg: any;

  constructor() { }

  private setDefaults(options, defaults) {
    return _.defaults({}, _.clone(options), defaults);
  }

  public createBarChart(element: string, comparators: Array<MfBarChartComparator>, data: Array<MfBarChartData>, options?: any): void {
    options = this.configureOptions(options);
    options['comparatorDistance'] = options.maxChartHeight / comparators.length;
    options['dataListDistance'] = options.maxChartWidth / data.length;
    options['barY'] = options.comparatorY;
    this.setParentElement(element);
    this.clearChart(element);
    this.setSvgSize(0, 0, options.viewBoxWidth, options.viewBoxHeight);
    this.generateChartBox(options.chartContainerX, options.chartContainerY, options.chartContainerWidth, options.chartContainerHeight);
    this.generateComparator(comparators, options.comparatorY, options.comparatorDistance);
    this.generateDataList(data, options.dataListX, options.dataListY, options.dataListDistance);
    this.generateBars(data, comparators, options.dataListX, options.barY, options.barWidth, options.dataListDistance, options.comparatorDistance);
  }

  public clearChart(element: string): void {
    d3.select(element).selectAll('*').remove();
  }

  private setParentElement(element: string): void {
    this.svg = d3.select(element);
  }

  private configureOptions(options): any {
    const defaults = {
      maxChartHeight: 200,
      maxChartWidth: 300,
      viewBoxHeight: 400,
      viewBoxWidth: 400,
      chartContainerX: 5,
      chartContainerY: 5,
      chartContainerHeight: 200,
      chartContainerWidth: 300,
      comparatorY: 180,
      dataListX: 50,
      dataListY: 200,
      barWidth: 20
    };

    return this.setDefaults(options, defaults);
  }

  private setSvgSize(minx: number, miny: number, width: number, height: number): void {
    this.svg.attr('viewBox', `${miny} ${minx} ${width} ${height}`);
  }

  private generateChartBox(x: number, y: number, width: number, height: number): void {
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

  private generateComparator(comparators: Array<MfBarChartComparator>, y: number, heightInterval: number): void {
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

  private generateDataList(data: Array<MfBarChartData>, x: number, y: number, widthInterval: number): void {
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

  private generateBars(data: Array<MfBarChartData>, comparators: Array<MfBarChartComparator>, x: number, y: number, barWidth: number, widthInterval: number, heightInterval: number): void {
    comparators.reverse();
    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      innerLoop:
      for (let comparatorIndex = 0; comparatorIndex < comparators.length; comparatorIndex ++) {
        if (data[dataIndex].value <= comparators[comparatorIndex].value) {
            const equalComparator = data[dataIndex].value === comparators[comparatorIndex].value
                                    ? true
                                    : false;
            const range = Math.abs(comparators[comparatorIndex - 1].value - comparators[comparatorIndex].value);
            const denominator = heightInterval / range;
            const difference = equalComparator
                          ? 0
                          : Math.abs(comparators[comparatorIndex].value - data[dataIndex].value);
            const height = ( ( heightInterval * ( comparatorIndex + 1 ) ) - heightInterval ) - difference * denominator;
            data[dataIndex].barHeight = height;
            break innerLoop;
        }
      }
    }
    for (let i = 0; i < data.length; i ++) {
      this.svg
        .append('rect')
        .attr('id', `bar${i + 1}`)
        .attr('x', x - (barWidth / 2.5))
        .attr('y', y - (data[i].barHeight
                        ? data[i].barHeight
                        : 0))
        .attr('width', barWidth)
        .attr('height', data[i].barHeight)
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
