import { Injectable } from "@angular/core";

namespace SIZE {
  export const DEFAULT_WIDTH_CONS = 600;
  export const DEFAULT_HEIGHT_CONS = 400;
  export var DEFAULT_WIDTH = 600;
  export var DEFAULT_HEIGHT = 400;
  export const MARGIN_LEFT_CONS = 27;
  export const MARGIN_TOP_CONS = 17;
  export const MARGIN_LR_CONS = MARGIN_LEFT_CONS + MARGIN_TOP_CONS;
  export const MARGIN_TB_CONS = 50;
  export var MARGIN_LEFT = 27;
  export var MARGIN_TOP = 17;
  export var MARGIN_LR = MARGIN_LEFT + MARGIN_TOP;
  export var MARGIN_TB = 50;
}

@Injectable()
export class ComboChartService {
  public s;
  public parentGroup;
  public labelGroup;
  public verticalLabelGroup;
  public horizontalLabelGroup;
  public chartGroup;
  public chartVerticalRefArray = [1, 2, 5];
  public dataSetRefObj = { minVal: 4, maxVal: 7 };
  public tens_pow = -1;
  public axisLineGroup;
  public barChartGroup;
  public lineChartGroup;
  public scatterChartGroup;
  public verticalLabelData;
  public numberOfVerticalLabel = 0;
  public axisArray = [];
  public chartDataSource;

  setChartHeightWidth(width, height) {
    if (width) {
      SIZE.DEFAULT_WIDTH = width;
    } else {
      SIZE.DEFAULT_WIDTH = SIZE.DEFAULT_WIDTH_CONS;
    }
    if (height) {
      SIZE.DEFAULT_HEIGHT = height;
    } else {
      SIZE.DEFAULT_HEIGHT = SIZE.DEFAULT_HEIGHT_CONS;
    }
  }

  createChartBox(dataSource) {
    SIZE.MARGIN_LEFT = SIZE.MARGIN_LEFT_CONS;
    SIZE.MARGIN_LR = SIZE.MARGIN_LR_CONS;
    SIZE.MARGIN_TB = SIZE.MARGIN_TB_CONS;
    SIZE.MARGIN_TOP = SIZE.MARGIN_TOP_CONS;
    this.chartDataSource = dataSource;
    var max_str_data = this.findMaxValueOfArray(this.chartDataSource.data)
      .value;
    if (max_str_data.length >= 2) {
      if (max_str_data.length % 2 === 0) {
        SIZE.MARGIN_LEFT = SIZE.MARGIN_LEFT + max_str_data.length * 7;
        SIZE.MARGIN_LR = SIZE.MARGIN_LEFT + SIZE.MARGIN_TOP;
      } else {
        SIZE.MARGIN_LEFT = SIZE.MARGIN_LEFT + max_str_data.length * 6;
        SIZE.MARGIN_LR = SIZE.MARGIN_LEFT + SIZE.MARGIN_TOP;
      }
    }
    var bgGroup = this.parentGroup
      .group()
      .attr({ id: "chart-backgroundgroup" });
    bgGroup.rect(1, 1, SIZE.DEFAULT_WIDTH - 2, SIZE.DEFAULT_HEIGHT - 2).attr({
      fill:
        "url('#rr-168-90-rgba_203_203_203_0.5__0-rgba_233_233_233_0.5__100')",
      "fill-opacity": 1
    });
    bgGroup
      .rect(0.5, 0.5, SIZE.DEFAULT_WIDTH - 1, SIZE.DEFAULT_HEIGHT - 1)
      .attr({
        fill: "none",
        stroke: "#767575",
        "stroke-opacity": 0.5,
        "stroke-width": 1
      });
    var canvasGroup = this.parentGroup
      .group()
      .attr({ id: "chart-canvasgroup" });
    canvasGroup
      .rect(
        SIZE.MARGIN_LEFT,
        SIZE.MARGIN_TOP,
        SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR,
        SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB
      )
      .attr({
        fill: "none",
        stroke: "#545454",
        "stroke-opacity": 1,
        "stroke-linejoin": "miter",
        "stroke-width": 2
      });
    canvasGroup
      .rect(
        SIZE.MARGIN_LEFT + 1,
        SIZE.MARGIN_TOP + 1,
        SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR - 2,
        SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB - 2
      )
      .attr({
        fill: "#ffffff",
        stroke: "none",
        "fill-opacity": 1,
        "stroke-width": 0
      });
  }

  createChartUsingData(dataSource) {
    this.chartDataSource = dataSource;
    this.labelGroup = this.parentGroup.group().attr({ id: "label-group" });
    this.createVerticalLabelGroup();
    this.createHorizontalLabelGroup();
    this.createChartGroup();
  }

  createVerticalLabelGroup() {
    this.verticalLabelGroup = this.labelGroup
      .group()
      .attr({ id: "vertical-group" });
    this.createVerticalLabel();
  }

  createHorizontalLabelGroup() {
    this.horizontalLabelGroup = this.labelGroup
      .group()
      .attr({ id: "horizontal-group" });
    this.createHorizontalLabel();
  }

  createVerticalLabel() {
    var y_axis_label = this.verticalLabelGroup.group().attr({
      "font-family": "Verdana,sans",
      "font-size": "10px",
      "font-weight": "normal",
      "font-style": "normal"
    });
    this.verticalLabelData = 1;
    var labelCount = 0;
    var text_x = SIZE.MARGIN_LEFT - 5,
      text_y = 21;
    var max_str_data = this.findMaxValueOfArray(this.chartDataSource.data)
      .value;
    if (+max_str_data > 0) {
      this.tens_pow = Math.round(Math.log10(+max_str_data)) - 1;
    } else {
      this.tens_pow = 0;
    }

    for (var i = 0; i < this.chartVerticalRefArray.length; i++) {
      if (
        this.chartVerticalRefArray[i] *
          this.dataSetRefObj.maxVal *
          Math.pow(10, this.tens_pow) >
        +max_str_data
      ) {
        this.verticalLabelData = this.chartVerticalRefArray[i];
        break;
      }
    }
    this.numberOfVerticalLabel = Math.floor(
      +max_str_data / (this.verticalLabelData * Math.pow(10, this.tens_pow)) + 1
    );
    if (this.numberOfVerticalLabel < this.dataSetRefObj.minVal) {
      this.numberOfVerticalLabel = this.dataSetRefObj.minVal;
    }

    for (var i = this.numberOfVerticalLabel; i >= 0; i--) {
      if (i != this.numberOfVerticalLabel) {
        if (i % 2 === 0) {
          text_y =
            text_y +
            ((SIZE.DEFAULT_HEIGHT - 50) / this.numberOfVerticalLabel - 1);
        } else {
          text_y =
            text_y + (SIZE.DEFAULT_HEIGHT - 50) / this.numberOfVerticalLabel;
        }
      }
      var text =
        Math.trunc(
          i * Math.pow(10, this.tens_pow) * this.verticalLabelData * 10
        ) / 10;

      y_axis_label.text(text_x, text_y, text.toString()).attr({
        fill: "#555555",
        stroke: "none",
        "text-anchor": "end",
        opacity: 1,
        "fill-opacity": 1
      });
    }

    this.createAxisReferenceVisualsFloor(this.numberOfVerticalLabel);
  }

  createHorizontalLabel() {
    var x_axis_label = this.horizontalLabelGroup.group().attr({
      "font-family": "Verdana,sans",
      "font-size": "10px",
      "font-weight": "normal",
      "font-style": "normal"
    });
    var text_x = 0,
      text_y = 0;
    text_y = SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TOP - 2;
    var eachXLabelArea =
      (SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR - 2) /
      this.chartDataSource.data.length;
    for (var i = 0; i < this.chartDataSource.data.length; i++) {
      if (!text_x) {
        text_x = text_x + eachXLabelArea / 2 + SIZE.MARGIN_LEFT + 1;
      } else {
        text_x = text_x + eachXLabelArea;
      }
      x_axis_label
        .text(text_x, text_y, this.chartDataSource.data[i].label)
        .attr({
          fill: "#555555",
          stroke: "none",
          "text-anchor": "middle",
          opacity: 1,
          "fill-opacity": 1
        });
    }
  }

  createAxisReferenceVisualsFloor(yLabelNumber) {
    var axisFloorGroup = this.parentGroup.group().attr({ id: "axis-floor" });
    this.axisLineGroup = this.parentGroup.group().attr({ id: "axis-line" });
    var rect_x = SIZE.MARGIN_LEFT + 1;
    var rect_y = SIZE.MARGIN_TOP + 1;
    rect_y = SIZE.MARGIN_TOP + 1;
    var rect_width = SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR - 2;
    var rect_height = (SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB - 2) / yLabelNumber;
    for (var i = yLabelNumber; i > 0; i--) {
      if (i % 2 === 0) {
        this.drawLine(rect_x, rect_y, rect_x + rect_width, rect_y);
        this.drawLine(
          rect_x,
          rect_y + rect_height,
          rect_x + rect_width,
          rect_y + rect_height
        );
        axisFloorGroup.rect(rect_x, rect_y, rect_width, rect_height).attr({
          fill: "#eeeeee",
          stroke: "#000000",
          "stroke-width": 0,
          "fill-opacity": 0.5
        });
        rect_y = rect_y + rect_height;
      } else {
        rect_y = rect_y + rect_height;
      }
    }
  }

  drawLine(x1, y1, x2, y2) {
    var linePath = `M ${x1} ${y1} L ${x2} ${y2}`;
    var lineDraw = this.axisLineGroup.path(linePath);
    lineDraw.attr({
      fill: "none",
      stroke: "#717170",
      "stroke-width": 1,
      "stroke-dasharray": "none",
      "stroke-opacity": "0.4",
      "stroke-linecap": "butt"
    });
    lineDraw.animate({ strokeDashoffset: 0 });
  }

  createChartGroup() {
    this.chartGroup = this.parentGroup.group().attr({ id: "chart-group" });
    this.createBarChart();
    this.createLineChart();
    this.createScatterChart();
    this.createLegendText();
  }

  createBarChart() {
    this.barChartGroup = this.chartGroup.group().attr({ id: "bar-chart" });
    var bar_x = SIZE.MARGIN_LEFT + 1;
    var bar_y = SIZE.MARGIN_TOP + 1;
    var bar_width = 50;
    var spaceBtwn =
      (SIZE.DEFAULT_WIDTH -
        SIZE.MARGIN_LR -
        2 -
        bar_width * this.chartDataSource.data.length) /
      (this.chartDataSource.data.length * 2);
    var totalHeight = SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB - 2;
    var bar_height = SIZE.MARGIN_TOP + 1;
    var maxVerticalNumber =
      Math.trunc(
        this.numberOfVerticalLabel *
          Math.pow(10, this.tens_pow) *
          this.verticalLabelData *
          10
      ) / 10;

    for (var i = 0; i < this.chartDataSource.data.length; i++) {
      var eachPartSizePerCentage =
        100 - (+this.chartDataSource.data[i].value / maxVerticalNumber) * 100;
      bar_y =
        SIZE.MARGIN_TOP + 1 + totalHeight * (eachPartSizePerCentage / 100);
      bar_height = totalHeight + SIZE.MARGIN_TOP + 1 - bar_y;
      if (i === 0) {
        bar_x = bar_x + spaceBtwn;
      } else {
        bar_x = bar_x + spaceBtwn * 2 + bar_width;
      }
      this.barChartGroup.rect(bar_x, bar_y, bar_width, bar_height).attr({
        // fill: "#afd8f8",
        fill: "url('#rr-168-270-rgba_175_216_248_1_-rgba_255_255_255_1_')",
        stroke: "#333333",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "stroke-dasharray": "none",
        "fill-opacity": 1,
        "stroke-linejoin": "miter"
      });
    }
  }

  createLineChart() {
    this.lineChartGroup = this.chartGroup.group().attr({ id: "line-chart" });
    this.axisArray = [];
    var line_x = SIZE.MARGIN_LEFT + 1;
    var line_y = SIZE.MARGIN_TOP + 1;
    var totalHeight = SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB - 2;
    var spaceBtwn =
      (SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR - 2) /
      (this.chartDataSource.data.length * 2);
    var maxVerticalNumber =
      Math.trunc(
        this.numberOfVerticalLabel *
          Math.pow(10, this.tens_pow) *
          this.verticalLabelData *
          10
      ) / 10;
    var lineChartPath;
    for (var i = 0; i < this.chartDataSource.data.length; i++) {
      var eachPartSizePerCentage =
        100 - (+this.chartDataSource.data[i].value / maxVerticalNumber) * 100;
      line_y =
        SIZE.MARGIN_TOP + 1 + totalHeight * (eachPartSizePerCentage / 100);
      if (i === 0) {
        line_x = line_x + spaceBtwn;
        lineChartPath = `M ${line_x} ${line_y}`;
      } else {
        line_x = line_x + spaceBtwn * 2;
        lineChartPath = lineChartPath + `L ${line_x} ${line_y}`;
      }
      var axisObject = {
        x: line_x,
        y: line_y,
        label: this.chartDataSource.data[i].value
      };
      this.axisArray.push(axisObject);
    }
    var lineChartDraw = this.lineChartGroup.path(lineChartPath);
    lineChartDraw.attr({
      fill: "none",
      stroke: "#f6bd0f",
      "stroke-width": 2,
      "stroke-dasharray": "none",
      "stroke-opacity": 1,
      "stroke-linecap": "round",
      "stroke-linejoin": "miter"
    });
    lineChartDraw.animate({ strokeDashoffset: 0 });
  }

  createScatterChart() {
    this.scatterChartGroup = this.chartGroup
      .group()
      .attr({ id: "scatter-chart" });
    var scr_x = SIZE.MARGIN_LEFT + 1;
    var scr_y = SIZE.MARGIN_TOP + 1;
    var totalHeight = SIZE.DEFAULT_HEIGHT - SIZE.MARGIN_TB - 2;
    var spaceBtwn =
      (SIZE.DEFAULT_WIDTH - SIZE.MARGIN_LR - 2) /
      (this.chartDataSource.data.length * 2);
    var maxVerticalNumber =
      Math.trunc(
        this.numberOfVerticalLabel *
          Math.pow(10, this.tens_pow) *
          this.verticalLabelData *
          10
      ) / 10;

    for (var i = 0; i < this.chartDataSource.data.length; i++) {
      var eachPartSizePerCentage =
        100 - (+this.chartDataSource.data[i].value / maxVerticalNumber) * 100;
      scr_y =
        SIZE.MARGIN_TOP + 1 + totalHeight * (eachPartSizePerCentage / 100);
      if (i === 0) {
        scr_x = scr_x + spaceBtwn;
      } else {
        scr_x = scr_x + spaceBtwn * 2;
      }
      var linePath = `M ${scr_x - 3} ${scr_y} A 3, 3, 0, 0, 0, ${scr_x +
        3} ${scr_y} A 3, 3, 0, 0, 0, ${scr_x - 3} ${scr_y} Z`;
      var lineDraw = this.scatterChartGroup.path(linePath);
      lineDraw.attr({
        fill: "#ffffff",
        stroke: "#f6bd0f",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "stroke-linecap": "round",
        "fill-opacity": 1
      });
      lineDraw.animate({ strokeDashoffset: 0 });
    }
  }

  createLegendText() {
    var legendTextGroup = this.chartGroup.group().attr({ id: "legend-text" });
    for (var i = 0; i < this.axisArray.length; i++) {
      var axis_y = this.axisArray[i].y - 10;
      if (axis_y - 10 < SIZE.MARGIN_TOP) {
        axis_y = axis_y + 30;
      } else if (this.axisArray[i].y - axis_y <= 2) {
        axis_y = axis_y - 10;
      }
      legendTextGroup
        .text(this.axisArray[i].x, axis_y, this.axisArray[i].label)
        .attr({
          fill: "#555555",
          stroke: "none",
          opacity: 1,
          "font-size": "10px",
          "text-anchor": "middle",
          "fill-opacity": 1
        });
    }
  }

  findMaxValueOfArray(dataArray) {
    var tempDataArray = dataArray.slice(0);
    tempDataArray.sort((a, b) => {
      if (+a.value > +b.value) {
        return -1;
      } else {
        return 1;
      }
    });
    return tempDataArray[0];
  }
}
