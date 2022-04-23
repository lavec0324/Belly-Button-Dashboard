function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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
    // 3. Create a variable that holds the samples array. 
    var  samples = data.samples;

    // // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var topTenOtu = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var yticks  = topTenOtu; 

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      text: otu_labels,
      orientation:'h'
    }
    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    
    //
    //Bubble Charts
    //

    // 1. Create the trace for the bubble chart.
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:'Earth'
      }
    } 
       
    var bubbleData = [trace1]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //
    // Gauge Charts
    //


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var metadata2 = data.metadata;
    // console.log(metadata2);
    // Create a variable that holds the first sample in the array.
    var resultArray2 = metadata2.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var result2 = resultArray2[0];
    // console.log(result2);

    // // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids2 = result2.otu_ids2;
    // var otu_labels2 = result2.otu_labels2;
    // var sample_values2 = result2.sample_values2;

    // console.log(otu_ids2);

    // 3. Create a variable that holds the washing frequency.
    var wfreq = result2.wfreq;
    wfreq = parseFloat(wfreq);
    console.log(wfreq);
    // Create the yticks for the bar chart.


    // // Use Plotly to plot the bar data and layout.
    // Plotly.newPlot();
    
    // // Use Plotly to plot the bubble data and layout.
    // Plotly.newPlot();
   
    
    // // 4. Create the trace for the gauge chart.
    var trace2 = {
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: 'Scrubs per week', font: { size: 16 }},
      gauge: {
        axis: { range: [0,10], tickwidth:1, dtick:2},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen"},
          { range: [8, 10], color: "darkgreen" }]
        },
    }; 
       
    var gaugeData = [trace2];
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Bely Button Washing Frequency"     
    };

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);



  });
}



