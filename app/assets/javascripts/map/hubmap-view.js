HubMap.View = function(startLat, startLong, startZoom){
  this.map = L.map('map', {scrollWheelZoom:false}).setView([startLat,startLong], startZoom);
  this.setTileLayers();
  this.bindEvents();
};

HubMap.View.prototype = {

  setTileLayers: function(){
    var satLayer = L.esri.basemapLayer("Imagery");
    var osmLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    var baseLayers = {"Satellite": satLayer, "Open Street Maps": osmLayer };
    L.control.layers(baseLayers, null, {collapsed:false}).addTo(this.map);
    osmLayer.addTo(this.map);
  },

  createMarker: function(hub){
    icon =  L.AwesomeMarkers.icon({prefix:"fa"});
    icon.options.icon = this.getSymbol(hub);
    icon.options.markerColor = this.getStatus(hub);
    return L.marker([hub.latitude, hub.longitude], {icon:icon, riseOnHover:true});
  },

  createMarkers:function(hubs){
    markers = [];
    for (var i=0; i<hubs.length; i++){
      if (hubs[i].latitude && hubs[i].longitude){
        var marker = this.createMarker(hubs[i]);
        var popup = this.makePopUp(hubs[i]);
        markers.push(marker.bindPopup(popup));
      }
    }
    return markers;
  },

  getStatus:function(hub){
    switch(hub.status_code){
    case 1:
      return "green";
      break;
    case 0:
      return "orange";
      break;
    case -1:
      return "red";
      break;
    }
  },

  getSymbol:function(hub){
    if (hub.type === "pump")
      return "tint";
    else
      return "home";
  },

  createPopUp: function(hub){
    return L.popup().setContent('<p>'+ hub.name +'<br />' + hub.type + '<br/> Location Id ' + hub.location_id +'</p>');
  },

  createErrorPopUp: function(hub){
    return L.popup().setContent('<p>'+ hub.name +'<br />' + hub.type + '<br/> Location Id ' + hub.location_id +'</p>');
  },

  makePopUp: function(hub){
    if (hub.status_code === 1)
      return this.createPopUp(hub);
    else
      return this.createErrorPopUp(hub);
  },

  showPumpsLayer: function(){
    this.pumpsLayer.addTo(this.map);
  },

  showKiosksLayer: function(){
    this.kiosksLayer.addTo(this.map);
  },

  showAllHubs: function(){
    this.showKiosksLayer();
    this.showPumpsLayer();
  },

  createHubLayers: function(hubs){
    var markers = this.createMarkers(hubs);
    return L.layerGroup(markers);
  },

  renderHubsOnMap: function(hubs){
    this.pumpsLayer = this.createHubLayers(hubs.pumps);
    this.kiosksLayer =  this.createHubLayers(hubs.kiosks);
    L.control.layers(null, {"Kiosks":this.kiosksLayer, "Points":this.pumpsLayer}, {collapsed:false}).addTo(this.map);
  },

  displayHubs: function(hubs){
    this.renderHubsOnMap(hubs);
    if ($(".kiosks-map").length > 0)
      this.showKiosksLayer();
    else if ($(".pumps-index").length > 0)
      this.showPumpsLayer();
    else
      this.showAllHubs();
  },

  addToggleMapEventListener:function(){
    $(".map-button").closest(".panel-heading").on("click", this.toggleMapDisplay);
  },

  toggleMapDisplay:function(){
    $("#map").slideToggle();
    if ($(".map-button").html() === '<i class="fa fa-plus fa-fw"></i>')
      $(".map-button").html('<i class="fa fa-minus fa-fw"></i>');
    else{
      $(".map-button").html('<i class="fa fa-plus fa-fw"></i>');
    }
  },

  bindEvents:function(){
    this.addToggleMapEventListener();
  },
};
