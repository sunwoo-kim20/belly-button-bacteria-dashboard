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
});
