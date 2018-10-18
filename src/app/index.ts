import { NgModule, ModuleWithProviders } from '@angular/core';
import { ComboChartComponent } from './combo-chart.component';
import { ComboChartService } from './combo-chart.service';

export * from './combo-chart.service';
export * from './combo-chart.component';

@NgModule({
  imports: [],
  declarations: [ComboChartComponent],
  exports: [ComboChartComponent],
  providers: [ComboChartService]
})
export class SvgComboChartModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SvgComboChartModule,
      providers: [ComboChartService]
    };
  }
}