// Use D3 to read data from json file
d3.json("data/samples.json").then(function(data) {
  // console.log(data.samples.filter(d => d.id === "940"));
  console.log(data);

  // Add ids to dropdown menu
  var dropDown = d3.select("#selDataset");
  data.names.forEach(function(id) {
    dropDown.append("option")
      .attr("value", id)
      .text(id);
  });


  // Set up event for dropdown and form
  var dropdown = d3.select("#selDataset");
  var form = d3.select("#form");

  dropdown.on("change", genCharts);
  form.on("submit", genCharts);

  function genCharts() {
    // Prevent page refresh
    d3.event.preventDefault();

    // Get selected id
    var currentId = d3.select("#selDataset").node().value;
    console.log(currentId);

    // Horizontal Bar Chart
    //---------------------------------------------

    // Initialize array of dictionaries for selected id
    var samplesData = [];
    // Filter sample with selected id
    var currentSample = data.samples.filter(d => d.id === currentId)[0];
    console.log(currentSample);

    // Loop through samples data to create array of dictionaries
    for (var i = 0; i < currentSample.otu_ids.length; i++) {
      var otu = {};
      otu.otuID = currentSample.otu_ids[i];
      otu.otuLabel = currentSample.otu_labels[i];
      otu.sampleValue = currentSample.sample_values[i];
      samplesData.push(otu);
    }
    console.log(samplesData);

    // Sort and split samples data to get top 10 otu
    var topTen = samplesData.sort(function compareFunction(firstOtu, secondOtu) {
      return secondOtu.sampleValue - firstOtu.sampleValue;
    });

    topTen = topTen.slice(0,10);
    console.log(topTen);
    console.log(topTen[0].otuID);

    // Create components to graph with plotly
    var traceBar = {
      x: topTen.map(otu => otu.sampleValue),
      y: topTen.map(otu => `OTU ${otu.otuID}`),
      type: "bar",
      orientation: "h",
      text: topTen.map(otu => otu.otuLabel)
    };

    var barData = [traceBar];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {autorange: "reversed"}
    };

    Plotly.newPlot("bar", barData, barLayout);


    // Bubble Chart
    //-------------------------------------------------

    // Create trace and layout
    var bubbleScale = 15;
    var traceBubble = {
      x : samplesData.map(otu => otu.otuID),
      y : samplesData.map(otu => otu.sampleValue),
      mode: "markers",
      text: samplesData.map(otu => otu.otuLabel),
      marker: {
        size: samplesData.map(otu => otu.sampleValue),
        color: samplesData.map(otu => otu.otuID),
        sizeref: 2.0 * Math.max(...samplesData.map(otu => otu.sampleValue)) / (bubbleScale**2),
      }
    };
    var bubbleLayout = {
      title: `Bacteria Cultures Per Sample for ID ${currentId}`,
      xaxis: {title: "OTU ID"}
    };

    var bubbleData = [traceBubble];

    // Create bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // Demographic info table
    //-------------------------------------------------

    // Filter to get metadata of selected id and get dictionary entries
    var selectedMetadata = data.metadata.filter(d => d.id === +currentId)[0];
    var metadataEntries = Object.entries(selectedMetadata);
    console.log(metadataEntries);

    // Get metadata html element and clear previous output
    var metadataDisplay = d3.select("#sample-metadata");
    metadataDisplay.html("");
    // Append each key value pair to our metadata display element
    metadataEntries.forEach(([key, value]) => {
      metadataDisplay.append("p")
        .attr("style", "font-weight : bold").text(`${key.toUpperCase()} : ${value}`);
    });

    // Gauge Chart
    //-------------------------------------------------
    var traceGauge = {
      value: selectedMetadata.wfreq,
      title: {text : "Scrubs per Week"},
      type: "indicator",
      mode: "gauge",
      gauge: {
        bar: {color: "purple"},
        axis: {
          range: [0, 9],
          dtick: 1
        },
        threshold: {
          line: {color: "red", width: 6},
          thickness: 0.75,
          value: selectedMetadata.wfreq
        },
        steps: [
          {range: [0,1], color : "rgb(255,255,255)"},
          {range: [1,2], color : "rgb(228,246,238)"},
          {range: [2,3], color : "rgb(147,186,169)"},
          {range: [3,4], color : "rgb(125,168,149)"},
          {range: [4,5], color : "rgb(111,154,135)"},
          {range: [5,6], color : "rgb(90,135,116)"},
          {range: [6,7], color : "rgb(71,122,100)"},
          {range: [7,8], color : "rgb(53,101,80)"},
          {range: [8,9], color : "rgb(32,73,55)"}
        ]
      }


    };

    var gaugeData = [traceGauge];
    var gaugeLayout = {
      title: "Belly Button Washing Frequency"
    };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  }



});
