// map js
let countriesArr = [];
let g, mapsvg, projection, width, height, zoom, path;
let viewportWidth = window.innerWidth;
let currentZoom = 1;
let mapClicked = false;
let selectedCountryFromMap = "all";
let countrySelectedFromMap = false;
let mapFillColor = '#204669',//'#C2DACA',//'#2F9C67', 
    mapInactive = '#fff',//'#DBDEE6',//'#f1f1ee',//'#C2C4C6',
    mapActive = '#2F9C67',
    hoverColor = '#2F9C67';//'#78B794';
let countryIso3Code = 'ISO_A3',
    countryGeoName = 'NAME';
function initiateMap() {
    width = viewportWidth;
    height = 500;
    var mapScale = width/10.6;
    var mapCenter = [25, 25];

    projection = d3.geoMercator()
        .center(mapCenter)
        .scale(mapScale)
        .translate([width / 1.5, height / 1.9]);

    path = d3.geoPath().projection(projection);

    zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);


    mapsvg = d3.select('#map').append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("wheel.zoom", null)
        .on("dblclick.zoom", null);
    
    mapsvg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        // .attr("fill", "#99daea");
        .attr("fill", "#ccd4d8");

    //map tooltips
    var maptip = d3.select('#map').append('div').attr('class', 'd3-tip map-tip hidden');

    g = mapsvg.append("g").attr('id', 'countries')
            .selectAll("path")
            .data(geomData.features)
            .enter()
            .append("path")
            .attr('d',path)
            .attr('id', function(d){ 
                return d.properties.countryIso3Code; 
            })
            .attr('class', function(d){
              var className = (countriesArr.includes(d.properties.ISO_A3)) ? 'hasStudy' : 'inactive';
              return className;
            })
            .attr('fill', function(d){
              return countriesArr.includes(d.properties.ISO_A3) ? mapFillColor : mapInactive ;
            })
            .attr('stroke-width', .2)
            .attr('stroke', '#fff');

    mapsvg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);

    // choroplethMap();

    //zoom controls
    d3.select("#zoom_in").on("click", function() {
        zoom.scaleBy(mapsvg.transition().duration(500), 1.5);
    }); 
    d3.select("#zoom_out").on("click", function() {
        zoom.scaleBy(mapsvg.transition().duration(500), 0.5);
    });
    
    var tipPays = d3.select('#countries').selectAll('path') 
    g.filter('.hasStudy')
    .on("mousemove", function(d){ 
        if ( !$(this).hasClass('clicked')) {
            $(this).attr('fill', hoverColor);
        }
        if (!mapClicked) {
            generateCountrytDetailPane(d.properties.ISO_A3, d.properties.NAME);
        }
        var mouse = d3.mouse(mapsvg.node()).map( function(d) { return parseInt(d); } );
        maptip
            .classed('hidden', false)
            .attr('style', 'left:'+(mouse[0])+'px; top:'+(mouse[1]+25)+'px')
            .html(d.properties.NAME);
        
    })
    .on("mouseout", function(d) { 
        if ( !$(this).hasClass('clicked')) {
            $(this).attr('fill', mapFillColor);
        }
        if (!mapClicked) {
            generateDefaultDetailPane();
        }
        maptip.classed('hidden', true);
    })
    .on("click", function(d){
        mapClicked = true;
        selectedCountryFromMap = d.properties.NAME ;
        mapsvg.select('g').selectAll('.hasStudy').attr('fill', mapFillColor);

        $(this).attr('fill', hoverColor);
        $(this).addClass('clicked');
        var countryData = getDataTableDataFromMap(d.properties.ISO_A3);
        updateDataTable(countryData);
        generateOverviewclicked(d.properties.ISO_A3, d.properties.NAME);
        $('.btn').removeClass('active');
        $('#all').toggleClass('active');
        $('#regionSelect').val('all');
        
    })

} //initiateMap

function showMapTooltip(d, maptip, text){
var mouse = d3.mouse(mapsvg.node()).map( function(d) { return parseInt(d); } );
maptip
    .classed('hidden', false)
    .attr('style', 'left:'+(mouse[0]+20)+'px;top:'+(mouse[1]+20)+'px')
    .html(text)
}

function hideMapTooltip(maptip) {
    maptip.classed('hidden', true) 
}

// zoom on buttons click
function zoomed(){
    const {transform} = d3.event;
    currentZoom = transform.k;

    if (!isNaN(transform.k)) {
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);

    }
}

function clicked(event, d){
    var offsetX = 50;//(isMobile) ? 0 : 50;
    var offsetY = 25;//(isMobile) ? 0 : 25;
    const [[x0, y0], [x1, y1]] = [[-20.75,-13.71],[31.5,27.87]];//path.bounds(d);
    // d3.event.stopPropagation(event);
    mapsvg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(5, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2 + offsetX, -(y0 + y1) / 2 - offsetY),
    //   d3.mouse(mapsvg.node())
    );
}

// choropleth map
function choroplethMap(){
    mapsvg.selectAll('path').each( function(element, index) {
        d3.select(this).transition().duration(500).attr('fill', function(d){
            // var filtered = filteredCfmData.filter(pt => pt['ISO3']== d.properties.ISO_A3);
            return '#fff';//getRightCountryCFMColor(filtered);
        });
    });

}

function resetMap(){
    mapsvg.select('g').selectAll('.hasStudy').attr('fill', mapFillColor);
    generateDefaultDetailPane();
    mapClicked = false;
    selectedCountryFromMap = "all";
}