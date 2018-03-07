import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfBarChartService } from './mf-bar-chart.service';

export * from './mf-bar-chart.service';

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
      providers: [MfBarChartService]
    };
  }
}
