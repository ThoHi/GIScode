var year = 2021; 
var month1 = 3; 
var month2 = 11; 


// You can draw your own region on the map and replace this geometry.
var roi = ee.Geometry.Point([ 97.0194,19.9422]); 

var zoomLevel = 11; 


// Load the JRC Monthly Water History dataset.
var monthlyWater = ee.ImageCollection('JRC/GSW1_4/MonthlyHistory');

// Filter the collection for the specified year and month1 using calendarRange.
var waterMonth1 = monthlyWater
  .filter(ee.Filter.calendarRange(year, year, 'year'))
  .filter(ee.Filter.calendarRange(month1, month1, 'month'))
  .first(); 

// Filter the collection for the specified year and month2 using calendarRange.
var waterMonth2 = monthlyWater
  .filter(ee.Filter.calendarRange(year, year, 'year'))
  .filter(ee.Filter.calendarRange(month2, month2, 'month'))
  .first(); // Get the image for the second month


var waterVis = {
  min: 1,
  max: 2,
  palette: [
    
    'FFFFFF',
    '0000FF', // Seasonal water (Blue)
    
  ],
  
};



// Create a map panel for each image.
var leftMap = ui.Map();
var rightMap = ui.Map();

// Hide the default map.
ui.root.clear();

// Add the left and right maps to the root.
var linker = ui.Map.Linker([leftMap, rightMap]);
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  wipe: true, // Add a wipe effect for the slider
  orientation: 'horizontal',
});
ui.root.add(splitPanel);

// Add layers to the individual maps.
leftMap.addLayer(waterMonth1, waterVis , 'Month ' + month1 + ' (' + year + ')');
rightMap.addLayer(waterMonth2, waterVis, 'Month ' + month2 + ' (' + year + ')');

// Center the map on the selected ROI and zoom level.
leftMap.centerObject(roi, zoomLevel);
// The linker keeps the maps centered together.

// Add titles/labels to the maps for clarity
var leftLabel = ui.Label('Month ' + month1 + ' (' + year + ')');
var rightLabel = ui.Label('Month ' + month2 + ' (' + year + ')');

var controlPanel = ui.Panel({
  widgets: [leftLabel, rightLabel],
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    position: 'bottom-left', // Position the labels at the bottom left
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  }
});

leftMap.add(controlPanel); // Add the panel to one of the maps (it will appear on both due to linking)
