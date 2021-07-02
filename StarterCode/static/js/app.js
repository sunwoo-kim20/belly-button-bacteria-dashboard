// Use D3 to read data from json file
d3.json("samples.json").then(function(data) {
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
    var traceBubble = {
      x : samplesData.map(otu => otu.otuID),
      y : samplesData.map(otu => otu.sampleValue),
      mode: "markers",
      text: samplesData.map(otu => otu.otuLabel),
      marker: {
        size: samplesData.map(otu => otu.sampleValue),
        color: samplesData.map(otu => otu.otuID)
      }
    };
    var bubbleLayout = {
      title: `Bacteria Cultures Per Sample for ID ${currentId}`,
      xaxis: "OTU ID"
    };

    var bubbleData = [traceBubble];



    // Demographic info table
    //-------------------------------------------------

    // Gauge Chart
    //-------------------------------------------------
  }



});
