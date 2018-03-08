import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from './utilities/utility-service.service';
import { MfBarChartService } from './bar-chart/mf-bar-chart.service';

export * from './bar-chart/mf-bar-chart.service';
export * from './bar-chart/mf-bar-chart-comparator.model';
export * from './bar-chart/mf-bar-chart-data.model';
export * from './utilities/utility-service.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class SampleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SampleModule,
      providers: [
        MfBarChartService,
        UtilityService
      ]
    };
  }
}
