import { Injectable } from '@angular/core';
import * as d3 from 'd3';
// import * as selection from 'd3-selection';
import * as _ from 'underscore';

import { MfBarChartComparator } from './mf-bar-chart-comparator.model';
import { MfBarChartData } from './mf-bar-chart-data.model';

const MARGIN = 5;
const COMPARATOR_X = 40;
const DATA_LIST_X = COMPARATOR_X + 30;

@Injectable()
export class MfBarChartService {

  svg: any;

  constructor() { }

  private setDefaults(options, defaults) {
    return _.defaults({}, _.clone(options), defaults);
  }

  public createBarChart(element: string, comparators: Array<MfBarChartComparator>, data: Array<MfBarChartData>, options?: any): void {
    options = this.configureOptions(options);
    options['comparatorDistance'] = (options.chartHeight - (MARGIN * 7)) / comparators.length;
    options['dataListDistance'] = (options.chartWidth - DATA_LIST_X - (MARGIN * 2)) / data.length;
    this.setParentElement(element);
    this.clearChart(element);
    this.setSvgSize(0, 0, options.chartWidth, options.chartHeight);
    this.generateChartBox(options.borderStrokeWidth, options.chartWidth, options.chartHeight);
    this.generateComparator(comparators, COMPARATOR_X, options.chartHeight, options.comparatorStrokeWidth, options.comparatorDistance, options.chartWidth, options.comparatorFontSize);
    this.generateDataList(data, DATA_LIST_X, options.chartHeight, options.dataListDistance, options.dataFontSize);
    this.generateBars(data, comparators, DATA_LIST_X, options.chartHeight, options.barWidth, options.dataListDistance, options.comparatorDistance);
  }

  public clearChart(element: string): void {
    d3.select(element).selectAll('*').remove();
  }

  private setParentElement(element: string): void {
    this.svg = d3.select(element);
  }

  private configureOptions(options): any {
    const defaults = {
      chartHeight: 200,
      chartWidth: 300,
      barWidth: 20,
      comparatorStrokeWidth: 1,
      comparatorFontSize: 12,
      borderStrokeWidth: 2,
      dataFontSize: 12
    };

    return this.setDefaults(options, defaults);
  }

  private setSvgSize(minx: number, miny: number, width: number, height: number): void {
    this.svg.attr('viewBox', `${miny} ${minx} ${width + (MARGIN * 2)} ${height + (MARGIN * 2)}`);
  }

  private generateChartBox(borderStrokeWidth: number, width: number, height: number): void {
    this.svg
      .append('rect')
      .attr('x', MARGIN)
      .attr('y', MARGIN)
      .attr('height', height - (MARGIN * 2))
      .attr('width', width - (MARGIN * 2))
      .attr('stroke-width', borderStrokeWidth)
      .attr('opacity', '.5')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', 'rgba(0,0,0,1)');
  }

  private generateComparator(comparators: Array<MfBarChartComparator>, x: number, y: number, strokeWidth: number, heightInterval: number, width: number, fontSize: number): void {
    comparators.reverse();
    const LINE_END = width - (MARGIN * 2);
    let comparatorY = y - (MARGIN * 5);
    for (let i = comparators.length - 1; i >= 0; i -- ) {
      this.svg
      .append('line')
      .attr('x1', MARGIN)
      .attr('y1', comparatorY)
      .attr('x2', LINE_END)
      .attr('y2', comparatorY)
      .attr('stroke-width', strokeWidth)
      .attr('stroke', 'rgba(0,0,0,.05)');

      this.svg
      .append('text')
      .text(comparators[i].label)
      .attr('x', x)
      .attr('y', comparatorY)
      .attr('text-anchor', 'end')
      .style('font-size', fontSize);
      comparatorY -= heightInterval;
    }
  }

  private generateDataList(data: Array<MfBarChartData>, x: number, y: number, widthInterval: number, fontSize: number): void {
    const DATALIST_Y = y - (MARGIN * 2);
    for (let i = 0; i < data.length; i ++) {
      this.svg
      .append('text')
      .text(data[i].label)
      .attr('x', x)
      .attr('y', DATALIST_Y)
      .attr('text-anchor', 'middle')
      .style('font-size', fontSize);

      x += widthInterval;
    }
  }

  private generateBars(data: Array<MfBarChartData>, comparators: Array<MfBarChartComparator>, x: number, y: number, barWidth: number, widthInterval: number, heightInterval: number): void {
    comparators.reverse();
    const COMPARATOR_Y = y - (MARGIN * 5);
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
        .attr('y', COMPARATOR_Y - (data[i].barHeight
                        ? data[i].barHeight
                        : 0))
        .attr('width', barWidth)
        .attr('height', data[i].barHeight)
        .attr('fill', '#2196F3')
        .attr('opacity', .5)
        .on('mouseover', this.onBarMouseOver)
        .on('mouseout', this.onBarMouseOut);
      x += widthInterval;
    }
  }

  private onBarMouseOver(d, i, e) {
    d3.select(this)
    .style('opacity', 1);
  }

  private onBarMouseOut(d, i, e) {
    d3.select(this)
    .style('opacity', .5);
  }
}
