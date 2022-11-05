//Deliverable 1: Horizontal Bar Chart

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samplesArray.filter(obj => obj.id == sample);
    var metaArray = data.metadata.filter(obj => obj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var results = resultsArray[0]
    var metaResults = metaArray[0]; 

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = results.otu_ids
    var labels = results.otu_labels;
    var samval = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Combined with other deliverable variables

    var yticks = ids.slice(0, 10).map(function(label){return `OTU ${label}`}).reverse();
    var xticks = samval.slice(0, 10).reverse();
    var labels = labels.slice(0, 10).reverse();
    var wfreq = metaResults.wfreq;

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: xticks,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels
      }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        plot_bgcolor: "srgba(255, 255, 255, 0.452)", 
        bargap: 0.05,
        margin: {
          t: 30,
          l: 120
        }
        };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

//Deliverable 2: Bubble Chart
// Bar and Bubble charts
// Create the buildCharts function.
// 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: ids,
      y: samval,
      text: labels,
      mode: 'markers',
      marker: {
        size: samval,
        color: ids,
        colorscale: 'Earth'
      }};
  
      // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      automargin: true,
      xaxis: { title: "OTU ID" },
      showlegend: false,
      hovermode: "closest",
      height: 350, 
      width: 1000
      };
  
      // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

//Deliverable 3: Gauge Chart   
  // 4. Create the trace for the gauge chart.
    var gaugeData =     {
      domain: { x: [0, 2], y: [0, 1] },
      value: wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ]
      }
    }
      ;   
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400, 
      margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}