// Use D3 to read data from json file
d3.json("samples.json").then(function(data) {
  console.log(data.metadata[0]);

  // Add ids to dropdown menu
  var dropDown = d3.select("#selDataset");
  data.names.forEach(function(id) {
    dropDown.append("option")
      .attr("value", id)
      .text(id);
  });

  // Create array of dictionaries to hold data

  // Set up event for dropdown and form
  var dropdown = d3.select("#selDataset");
  var form = d3.select("#form");

  dropdown.on("change", genCharts);
  form.on("submit", genCharts);

  function genCharts() {
    // Prevent page refresh
    d3.event.preventDefault();

    // Horizontal Bar Chart

    // Bubble Chart

    // Demographic info table
  }



});
