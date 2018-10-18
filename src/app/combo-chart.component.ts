import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { ComboChartService } from "./combo-chart.service";
declare var Snap: any;

@Component({
  selector: "app-combo-chart",
  templateUrl: "./combo-chart.component.html",
  styleUrls: ["./combo-chart.component.css"]
})
export class ComboChartComponent implements OnChanges {
  @Input()
  width: number;
  @Input()
  height: number;
  @Input()
  chartDataSource: Object;
  public dataSource: object = {
    chart: {
      caption: "",
      theme: "fusion"
    },
    data: []
  };

  public svgWidth;
  public svgHeight;

  constructor(private comboChartService: ComboChartService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.chartDataSource.currentValue &&
      changes.chartDataSource.currentValue.data.length
    ) {
      this.svgWidth = this.width;
      this.svgHeight = this.height;
      this.comboChartService.setChartHeightWidth(this.width, this.height);
      var chartDataSource = changes.chartDataSource.currentValue;
      this.dataSource["data"] = [];
      this.comboChartService.s = Snap("#invitation-svgout");
      if (this.comboChartService.parentGroup) {
        this.comboChartService.parentGroup.remove();
      }
      this.comboChartService.parentGroup = this.comboChartService.s
        .group()
        .attr({ id: "chart-parentgroup" });
      if (chartDataSource && chartDataSource["data"].length) {
        for (var i = 0; i < chartDataSource["data"].length; i++) {
          var tempData = {
            label: chartDataSource["data"][i].label,
            value: chartDataSource["data"][i].value
          };
          this.dataSource["data"].push(tempData);
        }
      }
      this.comboChartService.createChartBox(this.dataSource);

      this.comboChartService.createChartUsingData(this.dataSource);
      console.log(changes.chartDataSource.currentValue.data);
    }
  }

}
