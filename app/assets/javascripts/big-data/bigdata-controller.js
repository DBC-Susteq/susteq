BigData.DataController = function(){
  this.kiosks = [];
  this.pumps = [];
  this.container = $('#chart-container');
};

BigData.DataController.prototype = {
  getChartData:function(dataToDisplay){
    var that = this;
    $.each(dataToDisplay, function(index, data){
      switch(data.chartType){
        case "bar":
          that.container.append(that.chartElementWriter(index));
          data.svgSelector = that.chartSelector(index);
          new HubChart.BarChart(data);
          //makeTable(data);
          break;
        case "stacked":
          that.container.append(that.chartElementWriter(index));
          data.divSelector = that.chartSelector(index);
          new HubChart.StackedBarChart(data);
      }
    });
  },

  chartElementWriter: function(index) {
    return "<div id='chart" + index + "'></div>";
  },

  chartSelector: function(index) {
    return "#chart" + index;
  }
};