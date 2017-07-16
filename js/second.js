
var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";


var heartDiseaseSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.0.json",
      "description": "A simple bar chart to show poverty rate.",
      "width": 860,
      "height": 240,
      "data": {
        "values": [
          {"State": "AK","Heart Disease Mortality Rate ": 269.3}, {"State": "AR","Heart Disease Mortality Rate ": 418.1},
          {"State": "AL","Heart Disease Mortality Rate ": 435.3}, {"State": "AZ","Heart Disease Mortality Rate ": 273.1},
          {"State": "CA","Heart Disease Mortality Rate ": 289.5}, {"State": "CO","Heart Disease Mortality Rate ": 247.7},
          {"State": "CT","Heart Disease Mortality Rate ": 290.6},
          {"State": "DE","Heart Disease Mortality Rate ": 325.9}, {"State": "FL","Heart Disease Mortality Rate ": 293},
          {"State": "GA","Heart Disease Mortality Rate ": 345.9},
          {"State": "HI","Heart Disease Mortality Rate ": 264.1}, {"State": "ID","Heart Disease Mortality Rate ": 290.1},
          {"State": "IL","Heart Disease Mortality Rate ": 331.7},
          {"State": "IN","Heart Disease Mortality Rate ": 359.6}, {"State": "IA","Heart Disease Mortality Rate ": 321.3},
          {"State": "KS","Heart Disease Mortality Rate ": 304.6},
          {"State": "KY","Heart Disease Mortality Rate ": 394.8}, {"State": "LA","Heart Disease Mortality Rate ": 414.9},
          {"State": "ME","Heart Disease Mortality Rate ": 288.2},
          {"State": "MD","Heart Disease Mortality Rate ": 331.6}, {"State": "MA","Heart Disease Mortality Rate ": 270.8},
          {"State": "MI","Heart Disease Mortality Rate ": 387},
          {"State": "MN","Heart Disease Mortality Rate ": 229.6}, {"State": "MS","Heart Disease Mortality Rate ": 450.8},
          {"State": "MO","Heart Disease Mortality Rate ": 376.2},
          {"State": "MT","Heart Disease Mortality Rate ": 293.3}, {"State": "NE","Heart Disease Mortality Rate ": 283.2},
          {"State": "NV","Heart Disease Mortality Rate ": 378.5},
          {"State": "NM","Heart Disease Mortality Rate ": 282.8}, {"State": "NH","Heart Disease Mortality Rate ": 286.9},
          {"State": "NJ","Heart Disease Mortality Rate ": 328.6},
          {"State": "NY","Heart Disease Mortality Rate ": 356.1}, {"State": "NC","Heart Disease Mortality Rate ": 316.2},
          {"State": "ND","Heart Disease Mortality Rate ": 291.3},
          {"State": "OH","Heart Disease Mortality Rate ": 362.9}, {"State": "OK","Heart Disease Mortality Rate ": 437.8},
          {"State": "OR","Heart Disease Mortality Rate ": 257.4},
          {"State": "PA","Heart Disease Mortality Rate ": 344.4}, {"State": "RI","Heart Disease Mortality Rate ": 317.5},
          {"State": "SC","Heart Disease Mortality Rate ": 347.8},
           {"State": "SD","Heart Disease Mortality Rate ": 296.6}, {"State": "TN","Heart Disease Mortality Rate ": 395.5},
           {"State": "TX","Heart Disease Mortality Rate ": 330.7},
           {"State": "UT","Heart Disease Mortality Rate ": 286.4}, {"State": "VT","Heart Disease Mortality Rate ": 295.5},
           {"State": "VA","Heart Disease Mortality Rate ": 304.7},
           {"State": "WA","Heart Disease Mortality Rate ": 268.4}, {"State": "WV","Heart Disease Mortality Rate ": 382.7},
           {"State": "WI","Heart Disease Mortality Rate ": 307.7},
           {"State": "WY","Heart Disease Mortality Rate ": 311.1}
         ]
       },
       "mark": "bar",
       "encoding": {
         "x": {
               "field": "State",
               "type": "ordinal"
         },
         "y": {"field": "Heart Disease Mortality Rate ",
               "type": "quantitative",
               "axis" : {
                 "title": "Heart Disease Mortality Rate"
               }
             },
         "color": {
           "field": "Heart Disease Mortality Rate ",
           "scale": {
              "domain": [220,320,460],
              "type" : "threshold",
              "range": [GREEN,YELLOW,RED]

            },
           "type": "quantitative",
            "legend": {
              "title" : "Mortality Rate per 100K Adults"
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


vega.embed('#secondVis', heartDiseaseSpec, opt2, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  var tooltipOption = {
    		showAllFields: false,
    		fields: [
      		{ field: "Heart Disease Mortality Rate ", title: "Overall Poverty Rate" }
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
