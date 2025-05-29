// Create a panel to hold the UI elements
var panel = ui.Panel();
panel.style().set({
  width: '200px',
  position: 'top-center'
});
ui.root.add(panel);

// Add a title to the panel
panel.add(ui.Label('Select Date for Active Fires (SNPP VIIRS C2)', {fontWeight: 'bold', fontSize: '16px'}));

// Define the visualization parameters for the SNPP VIIRS C2 dataset
var band_vis = {
  min: [280.0],
  max: [400.0],
  palette: ['yellow', 'orange', 'red', 'white', 'darkred'],
  bands: ['Bright_ti4']
};

// Create a date slider for selecting the date range
var startDate = ee.Date('2025-01-01'); // Start of the date range
var endDate = ee.Date(Date.now());    // Current date

var dateSlider = ui.DateSlider({
  start: startDate,
  end: endDate,
  value: [startDate, endDate],  // Default range is from start to current date
  period: 1,                    // Step size in days
  onChange: function(range) {
    var selectedStartDate = ee.Date(range.start());
    var selectedEndDate = ee.Date(range.end());

    // Load the SNPP VIIRS C2 dataset and filter by the selected date range
    var suomi_viirs = ee.ImageCollection('NASA/LANCE/SNPP_VIIRS/C2')
      .filterDate(selectedStartDate, selectedEndDate); // Filter for fires in the selected range

    // Clear previous layers and add the new fire data to the map
    Map.layers().reset(); // Clear all layers
    Map.addLayer(suomi_viirs, band_vis, 'Suomi nrt firms');
    
    // Optionally, set the map's center and zoom level
    Map.setCenter(96.10121686827266,21.928911624144757, 7);
  }
});

// Add the date slider to the panel
panel.add(dateSlider);

// Load the SNPP VIIRS C2 dataset initially (default range)
var initialStartDate = startDate;
var initialEndDate = endDate;

var suomi_viirs = ee.ImageCollection('NASA/LANCE/SNPP_VIIRS/C2')
  .filterDate(initialStartDate, initialEndDate); // Filter for fires detected today

// Add the initial fire data to the map
Map.addLayer(suomi_viirs, band_vis, 'Suomi nrt firms');

// Set the map's center and zoom level (example: latitude=59.3943, longitude=-113.2487, zoom=8)
Map.setCenter(96.10121686827266,21.928911624144757, 7);

// Optionally, add a base map (e.g., street map or satellite imagery)
Map.setOptions('HYBRID'); // You can also use 'ROADMAP' or 'SATELLITE'or 'HYBRID'
