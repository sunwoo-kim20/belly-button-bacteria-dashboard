// Use D3 to read data from json file
d3.json("samples.json").then(function(data) {
  // console.log(data.samples.filter(d => d.id === "940"));
  // console.log(data);

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
    // create array of dictionaries for selected id
    var samplesData = [];
    var currentSample = data.samples.filter(d => d.id === currentId);
    console.log(currentSample);

    // Bubble Chart

    // Demographic info table
  }



});
