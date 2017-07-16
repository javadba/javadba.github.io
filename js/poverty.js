// Global variables

var WIDTH = 960, HEIGHT = 600; //originally 1600
var COLOR_FIRST = "#3fae07", COLOR_LAST = "#ff0404";
var COLOR_COUNTS = 10;
var MAP1_TITLE = "Poverty Rate (States)";
var MAP_VALUE_2 = "obese_children_and_adolescents_number";
var MAP2_TITLE = "Heart Disease Mortality (35+ Adults)";
var SCALE = 0.5;
var active = d3.select(null);
var centered;

var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";



var state_names = [

  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"

];

name_id_map = {};
id_name_map = {};

poverty_data = {};
heart_disease_data = {};
overall_rate = {};
overall_rate_by_state = [];
clean_hd_data = [];
//generic functions

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function() {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}



//////////////// read us state names /////////////////

d3.tsv("/data/us-state-names.tsv", function(error, names) {
for (var i = 0; i < names.length; i++) {
  name_id_map[names[i].name] = names[i].id;
  id_name_map[names[i].id] = names[i].name;
}
});

function makeMap(svgId) {

  // Build the map

  var width = WIDTH,
      height = HEIGHT;

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10,0])
              .html(function(d) {
                var stateName = id_name_map[d.id];
                var povertypercentage = poverty_data[stateName][3];
                return "<span class='details'>" +
                       stateName + "<br>" +
                       "Overall Poverty <span class='details'>" +
                              povertypercentage + "%" ;
              });
  var quantize = d3.scaleQuantize()
          .domain([8.4,22.1])
          .range([GREEN,YELLOW,RED]);


 var scaleColor = d3.scaleLinear()
                    .domain([8.4,13.5,22.1])
                    .range([GREEN, YELLOW, RED])



  //console.log(quantize);

        // D3 Projection
  var projection = d3.geoAlbersUsa()
          .translate([250, 150]) // translate to center of screen
          .scale([550]); // scale things down so see entire US

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

  var svg = d3.select(svgId).append("svg")
                         .attr("width", width/2)
                         .attr("height", height/2)
                         .on("click", stopped, true);

  svg.call(tip);


   d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
             if (error) throw error;


                                //.range(["rgb(0,100,0)", "rgb(255,178,102)","rgb(255,0,0)"]);

               svg.append("g").attr("class", "states")
               .selectAll("path")
               .data(topojson.feature(us, us.objects.states).features)
               .enter().append("path")
               .style("fill", function(d) {
                   var stateName = id_name_map[d.id];

                   if (stateName == undefined) return;
                   //return scaleColor(poverty_data[stateName][3]);
                   return quantize(poverty_data[stateName][3]);
                   /*
                   //console.log(stateName, poverty_data[stateName][3]);
                   if (poverty_data[stateName][3] < 13) {
                      //console.log("green");
                      return "rgb(0,100,0)";
                   }
                   else if ((poverty_data[stateName][3] > 12.5) &&
                         (poverty_data[stateName][3] < 15.9)) {
                      //console.log("orange");
                      return "rgb(255,178,102)";
                   }
                   else  {
                      //console.log("red");
                      return "rgb(204,0,0)"
                   }
                   */


               })
               .on("mouseover", function(d,i) {
                 var stateName = id_name_map[d.id];
                 $(this).attr("fill-opacity", "0.8");

                 if (stateName == undefined) return;
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 0.6);
                  tip.show(d);

               })
               .on("mouseout", function(d,i) {
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 1.0);
                  tip.hide(d);
               })
               .on("click", function(d,i) {
                  var stateName = id_name_map[d.id];
                  console.log("You clicked on ", stateName);
                  makeBar(".chart1", stateName);
                  makeBar2(".chart2", stateName);
               })
               .attr("d", path);

             svg.append("path")
                 .attr("class", "state-borders")
                 .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
           });

}


function makeBar(svgId, stateName) {

   // Build the Bar chart

   var width = WIDTH,
      height = HEIGHT;
   var margin = {top: 20, right: 20, bottom: 30, left: 40};
   /*  var margin = {top: 50, right: 20, bottom: 30, left: 40},
      width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;*/
   var data = [poverty_data[stateName][0],
              poverty_data[stateName][1],
              poverty_data[stateName][2],
              poverty_data[stateName][3]];

   var barChartLabels = ["0 - 5 Years ",
                 "0 -17 Years ",
                 "5 - 17 Years ",
                 "Overall "];

   var barChartColors =  [" rgb(255,112,11)",
                          "rgb(144,18,41)",
                          "rgb(32, 127, 66)",
                          "rgb(65, 100, 127)"];

   var y = d3.scaleBand().range([height,0]).padding(0.1);

   //var yScale = d3.scaleOrdinal([0, height]);
   y.domain(data.map(function(d,i) {console.log(d,i,barChartLabels[i]); return barChartLabels[i]; }));

   var svgBar = d3.select(".svgBar");



   var ordinal = d3.scaleOrdinal()
     .domain(barChartLabels)
     .range(barChartColors);

   console.log("Create a Poverty Bar chart for state for ", stateName);

   d3.select("#barTitle1")
     .html("Poverty Level in <strong>" + stateName + "</strong> for various age groups");

   /*
   d3.select(".chart1")
     .attr("x",0)
     .attr("y",0)
     .attr("alignment-baseline","middle")
     .attr("text-anchor","end")
     .text(barChartLabels[0]);
   */



   d3.select(svgId)
   .selectAll("div")
     .data(data)
   .enter().append("div")
     .style("width", function(d) { return d * 8 + "px"; })
     .style("background-color", function(d,i) { return barChartColors[i];})
     //.text(function(d,i) { return "( " + barChartLabels[i] + " ) " + d + "%"; })
     .text(function(d,i) { return   d + "%"; })
   .exit().transition()
        .style("opacity", 0)
        .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
        .remove();

   d3.select(".chart1")
        .selectAll("div").transition()
        .duration(600)
       //.text(function(d,i) { return  "( " + barChartLabels[i] + " ) "  + d + "%"; })
       .text(function(d,i) { return   d + "%"; })
       .style("width", function(d) { return d * 8 + "px"; })

   svgBar.append("g")
     .attr("class", "legendOrdinal")
     .attr("transform", "translate(20,100)");


    var legendOrdinal = d3.legendColor()
                          .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                          .cells(4)
                          .shapeWidth(60)
                          .orient("vertical")
                          .scale(ordinal);

    svgBar.select(".legendOrdinal")
     .call(legendOrdinal);

}
///////////////// read poverty data /////////////////

var processPovertyData = function(err,data) {


  var rgb = hexToRgb(COLOR_FIRST);
  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);


  var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();

  var colors = [];

  for (var i = 0; i < COLOR_COUNTS; i++) {
    var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    colors.push(new Color(r, g, b));
  }

  if (err != null) console.log(err);
  //console.log("Poverty Data");
  //console.log(data.length);
  //console.log(id_name_map);
  //console.log(data);

  // We have the data, let's extract the important features

  for (i = 0; i < data.length; i++) {
    if (name_id_map[data[i].Area_Name]) {

      poverty_data[data[i].Area_Name] = [
                                      data[i].PCTPOV05_2015,
                                      data[i].PCTPOV017_2015,
                                      data[i].PCTPOV517_2015,
                                      data[i].PCTPOVALL_2015
                                    ];
    }
  } // end of for(i...)

  //console.log(poverty_data);

  makeMap("#map1-svg", MAP1_TITLE);
  makeBar(".chart1", "California");

}


/////////////// crate map for heart disease /////////////


function makeMap2(svgId) {

  // Build the map

  var width = WIDTH,
      height = HEIGHT;

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10,0])
              .html(function(d) {
                var stateName = id_name_map[d.id];
                var hdRate = overall_rate[stateName];
                return "<span class='details'>" +
                       stateName + "<br>" +
                       "Mortality Rate <span class='details'>" +
                              hdRate + " / 100K Adults" ;
              });


  var zoom = d3.zoom()
      // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
      // .translate([0, 0])
      // .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  var quantize = d3.scaleQuantize()
          .domain([220,460])
          .range([GREEN,YELLOW,RED]);

  var scaleColor = d3.scaleLinear()
                     .domain([220,320,460])
                     .range([GREEN, YELLOW, RED]);
                     //.range(["rgb(0,100,0)", "rgb(255,178,102)","rgb(204,0,0)"]);



  //console.log(quantize);

        // D3 Projection
  var projection = d3.geoAlbersUsa()
          .translate([250, 150]) // translate to center of screen
          .scale([550]); // scale things down so see entire US

  // Define path generator
  var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

  var svg = d3.select(svgId).append("svg")
                         .attr("width", width/2)
                         .attr("height", height/2)
                         .on("click", stopped, true);

  svg.call(tip);

   var active = d3.select(null);

   d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
             if (error) throw error;





               svg.append("g").attr("class", "states")
               .selectAll("path")
               .data(topojson.feature(us, us.objects.states).features)
               .enter().append("path")
               .style("fill", function(d) {
                   var stateName = id_name_map[d.id];

                   if (stateName == undefined) return;
                   //return scaleColor(overall_rate[stateName]);
                   return quantize(overall_rate[stateName]);
                   /*
                   //console.log(stateName, poverty_data[stateName][3]);
                   if (overall_rate[stateName] < 290) {
                      //console.log("green");
                      return "rgb(0,100,0)";
                   }
                   else if ((overall_rate[stateName] > 290) &&
                         (overall_rate[stateName] < 360)) {
                      //console.log("orange");
                      return "rgb(255,178,102)";
                   }
                   else  {
                      //console.log("red");
                      return "rgb(204,0,0)";
                   }
                   */


               })
               .on("mouseover", function(d,i) {
                 var stateName = id_name_map[d.id];
                 //$(this).attr("fill-opacity", "0.6");
                 //$(this).attr("transform", "scaleZ(0.3)");
                 if (stateName == undefined) return;
                  console.log(d,i);
                  d3.select(this).style("fill-opacity", 0.6);
                  tip.show(d);

               })
               .on("mouseout", function(d,i) {
                  console.log(d,i);
                  d3.select(this).style("fill-opacity", 1.0);
                  d3.select(this).style("zoom", 1);
                  tip.hide(d);
               })
               .on("click", function(d,i) {
                  var stateName = id_name_map[d.id];
                  console.log("You clicked on ", stateName);
                  makeBar2(".chart2", stateName);
                  makeBar(".chart1", stateName);
               })
               .attr("d", path);

             svg.append("path")
                 .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                 .attr("class", "mesh")
                 .attr("d", path);
           });

      function zoommap(d) {
        console.log("Zoom map");

        if (active.node() === this) return reset();
        //active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
      }

      function reset() {
        active.classed("active", false);
        active = d3.select(null);
        svg.transition()
            .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
            .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
      }

      function zoomed() {
        svg.append("g").style("stroke-width", 1.5 / d3.event.transform.k + "px");
        // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
        svg.append("g").attr("transform", d3.event.transform); // updated for d3 v4
      }

      // If the drag behavior prevents the default click,
      // also stop propagation so we don’t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }

}

//////////////// create bar chart of heart disease data ////////////////

function populate_state_level_data(stateName) {
    var data = [0,0,0,0,0,0];
    var hgLegends = [
                  "Overall",
                  "Black",
                  "White",
                  "Hispanic",
                  "Asian and Pacific Islander",
                  "American Indian and Alaskan Native"];

    // extract the state specific data
    // we will look for race, leave gender as Overall
    // save the values in the order listed in data2
    var indata = clean_hd_data;

    console.log(indata.length);

    for (var i = 0; i < indata.length; i++) {
      // check for statename match
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[0]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[0] = indata[i].Data_Value;
      }
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[1]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[1] = indata[i].Data_Value;
      }
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[2]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[2] = indata[i].Data_Value;
      }
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[3]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[3] = indata[i].Data_Value;
      }
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[4]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[4] = indata[i].Data_Value;
      }
      if ((indata[i].LocationDesc == stateName) &&
          (indata[i].Stratification2 == hgLegends[5]) &&
          (indata[i].Stratification1 == hgLegends[0])) {
        // check for match for race
           data[5] = indata[i].Data_Value;
      }

    }
    return data;
}

function makeBar2(svgId, stateName,incomingdata) {
  console.log("You clicked on ", stateName);
  var data = populate_state_level_data(stateName);


  console.log("Create a Mortality chart for state for ", stateName);

  d3.select("#barTitle2")
    .html("Heart Disease Mortality Rate in <strong>" + stateName + "</strong> per 100K Adults");
   var svgBar = d3.select(".svgBar2");
    var w = parseInt(svgBar.style("width"), 10);
    var h = parseInt(svgBar.style("height"), 10);

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

      var hgLegends = [
                    "Overall",
                    "Black",
                    "White",
                    "Hispanic",
                    "Asian and Pacific Islander",
                    "American Indian and Alaskan Native"];

      var barChartColors =  ["rgb(255,112,11)",
                             "rgb(144,18,41)",
                             "rgb(32, 127, 66)",
                             "rgb(65, 100, 127)",
                             "#a05d56", "	rgb(0,139,139)"];
      var z = d3.scaleOrdinal()
                        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);


      var ordinal = d3.scaleOrdinal()
           .domain(hgLegends)
           .range(barChartColors);

   var y = d3.scaleBand().range([height,0]).padding(0.1);
   //var yScale = d3.scaleOrdinal([0, height]);
   y.domain(data.map(function(d,i) {console.log(d,i,hgLegends[i]); return hgLegends[i]; }));

      // process state specific data and store it in a safe variable
      var keys = hgLegends;

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin

        svgBar.append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Scale the range of the data in the domains
        //x.domain([0, d3.max(data, function(d){ return d.value; })])
        y.domain(data.map(function(d) { return d.race; }));
        //y.domain([0, d3.max(data, function(d) { return d.sales; })]);


        d3.select(svgId)
           .selectAll("div")
             .data(data)
           .enter().append("div")
             .style("width", function(d) { return d * 0.7 + "px"; })
             .style("visibility", function(d) {
                  if (d > 0) {
                      return "visible";
                  }
                  else {
                      return "hidden";
                  }
              })
             .style("background-color", function(d,i) { return barChartColors[i];})
             //.text(function(d,i) { return "( " + barChartLabels[i] + " ) " + d + "%"; })
             .text(function(d,i) { return d.value; })
           .exit().transition()
                .style("opacity", 0)
                .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
                .remove();

           d3.select(".chart2")
                .selectAll("div").transition()
                .duration(600)
               //.text(function(d,i) { return  "( " + barChartLabels[i] + " ) "  + d + "%"; })
               .text(function(d,i) { return   d ; })
               .style("width", function(d) { return d * 0.7 + "px"; })
               .style("visibility", function(d) {
                    if (d > 0) {
                        return "visible";
                    }
                    else {
                        return "hidden";
                    }
                });

        svgBar.append("g")
          .attr("class", "legendOrdinal")
          .attr("transform", "translate(20,75)");


         var legendOrdinal = d3.legendColor()
                               .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                               .cells(6)
                               .shapeWidth(60)
                               .orient("vertical")
                               .scale(ordinal);

         svgBar.select(".legendOrdinal")
          .call(legendOrdinal);


}

///////////////// read Disease data /////////////////

var processDiseaseData = function(err,data) {

  //console.log("Entering HD data processing")
  if (err != null) return err;
  //console.log(data);

  for (i = 0; i < data.length; i++) {
     var stateName = data[i].LocationDesc;
     if (name_id_map[stateName]) {
             var gender = String(data[i].Stratification1);
             var race = String(data[i].Stratification2);
             var rate = data[i].Data_Value;
             //console.log(stateName,gender,race,rate)
             heart_disease_data["" + stateName + ","+ gender + ","+ race] = rate;
     }
  }

//229.6, 247.7, 257.4, 264.1, 268.4, 269.3, 270.8, 273.1, 282.8,
//283.2, 286.4, 286.9, 288.2, 289.5, 290.1, 290.6, 291.3, 293, 293.3,
//295.5, 296.6, 304.6, 304.7, 307.7, 311.1, 316.2, 317.5, 321.3, 325.9,
//328.6, 330.7, 331.6, 331.7, 344.4, 345.9, 347.8, 356.1, 359.6, 362.9,
//376.2, 378.5, 382.7, 387, 394.8, 395.5, 411.1, 414.9, 418.1, 435.3, 437.8, 450.8


  for (var i = 0; i < state_names.length; i++) {
     var key = state_names[i] + ",Overall,Overall";
     //console.log(heart_disease_data[key]);
     overall_rate[state_names[i]] = +heart_disease_data[key];
  }
  // Save data in a global variables
  // not ideal but doable
  clean_hd_data = data;
  makeMap2("#map2-svg", MAP2_TITLE);
  makeBar2(".chart2", "California");

}

d3.csv("/data/PovertyEstimates.csv", processPovertyData);

d3.csv("/data/clean_heart_disease.csv", processDiseaseData);





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
