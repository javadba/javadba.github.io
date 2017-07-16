
var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";

var povertySpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.0.json",
      "description": "A simple bar chart to show poverty rate.",
      "width": 860,
      "height": 240,
      "data": {
        "values": [
          {"State": "AK","Overall Poverty (%)": 10.4}, {"State": "AR","Overall Poverty (%)": 18.7},
          {"State": "AL","Overall Poverty (%)": 18.5}, {"State": "AZ","Overall Poverty (%)": 17.4},
          {"State": "CA","Overall Poverty (%)": 15.4}, {"State": "CO","Overall Poverty (%)": 11.5},
          {"State": "CT","Overall Poverty (%)": 10.6},
          {"State": "DE","Overall Poverty (%)": 12.6}, {"State": "FL","Overall Poverty (%)": 15.8},
          {"State": "GA","Overall Poverty (%)": 17.2},
          {"State": "HI","Overall Poverty (%)": 10.7}, {"State": "ID","Overall Poverty (%)": 14.7},
          {"State": "IL","Overall Poverty (%)": 13.6},
          {"State": "IN","Overall Poverty (%)": 14.4}, {"State": "IA","Overall Poverty (%)": 12.1},
          {"State": "KS","Overall Poverty (%)": 12.9},
          {"State": "KY","Overall Poverty (%)": 18.3}, {"State": "LA","Overall Poverty (%)": 19.5},
          {"State": "ME","Overall Poverty (%)": 13.5},
          {"State": "MD","Overall Poverty (%)": 9.9}, {"State": "MA","Overall Poverty (%)": 11.5},
          {"State": "MI","Overall Poverty (%)": 15.7},
          {"State": "MN","Overall Poverty (%)": 10.2}, {"State": "MS","Overall Poverty (%)": 22.1},
          {"State": "MO","Overall Poverty (%)": 14.8},
          {"State": "MT","Overall Poverty (%)": 14.4}, {"State": "NE","Overall Poverty (%)": 12.2},
          {"State": "NV","Overall Poverty (%)": 14.9},
          {"State": "NM","Overall Poverty (%)": 19.8}, {"State": "NH","Overall Poverty (%)": 8.4},
          {"State": "NJ","Overall Poverty (%)": 10.8},
          {"State": "NY","Overall Poverty (%)": 15.5}, {"State": "NC","Overall Poverty (%)": 16.4},
          {"State": "ND","Overall Poverty (%)": 10.7},
          {"State": "OH","Overall Poverty (%)": 14.8}, {"State": "OK","Overall Poverty (%)": 16.0},
          {"State": "OR","Overall Poverty (%)": 15.2},
          {"State": "PA","Overall Poverty (%)": 13.1}, {"State": "RI","Overall Poverty (%)": 14.1},
          {"State": "SC","Overall Poverty (%)": 16.8},
           {"State": "SD","Overall Poverty (%)": 13.5}, {"State": "TN","Overall Poverty (%)": 16.7},
           {"State": "TX","Overall Poverty (%)": 15.9},
           {"State": "UT","Overall Poverty (%)": 11.2}, {"State": "VT","Overall Poverty (%)": 10.4},
           {"State": "VA","Overall Poverty (%)": 11.2},
           {"State": "WA","Overall Poverty (%)": 12.2}, {"State": "WV","Overall Poverty (%)": 18.0},
           {"State": "WI","Overall Poverty (%)": 12.1},
           {"State": "WY","Overall Poverty (%)": 10.6}
         ]
       },
       "mark": "bar",
       "encoding": {
         "x": {
               "field": "State",
               "type": "ordinal"
         },
         "y": {"field": "Overall Poverty (%)",
               "type": "quantitative"
             },
         "color": {
           "field": "Overall Poverty (%)",
           "scale": {
              "domain": [8.4,13.1,22.1],
              "type" : "threshold",
              "range": [GREEN,YELLOW,RED]

            },
           "type": "quantitative",
           "legend": {
             "title" : "Poverty Rate"
            },
            "legend": {
              "title" : "Poverty Rate in USA"
             }
          }
       },

       "config": {
            "mark": {
               "filled": true,
               "color": "steelblue"
            },
            "axis" : {
              "labelFontSize": 13,
              "titleFontSize": 16
            }
       }
}

var opt = {
  "renderer": "canvas",
  "actions": {
    "export": false,
    "source": false,
    "editor": false
  }
}

var opt2 = {
  mode: "vega-lite",
  actions: false
};


vega.embed('#stemVis', povertySpec, opt2, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  var tooltipOption = {
    		showAllFields: false,
    		fields: [
      		{ field: "Overall Poverty (%)", title: "Overall Poverty Rate" }
    		]
  		};
  vegaTooltip.vegaLite(result.view, povertySpec,tooltipOption);
  });



var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}
