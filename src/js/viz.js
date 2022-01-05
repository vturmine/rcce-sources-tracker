let geodataUrl = 'data/worldmap.json';
let data_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQDTIju76FYADX9ZKbKBD1JBA7eFLv86Y8ltOTs24eLqrf3FnKJENmtcUkP1HUMCQq7JL9hgwofz0q/pub?gid=1612863274&single=true&output=csv';

let geomData,
    sourcesData;


$( document ).ready(function(){
    function getData(){
        Promise.all([
            d3.json(geodataUrl),
            d3.csv(data_url),
        ]).then(function(data){
            geomData = topojson.feature(data[0], data[0].objects.geom);
            sourcesData = data[1];
            // sourcesData.forEach(element => {
            //     var date = new Date(element['source_date']);
                
            //     element['source_date'] = date;
            // });
            sourcesDataFiltered = data[1];
            // console.log(sourcesData)
            var arrs = getColumnUniqueValues("iso3", "dimension", "region");
            countriesArr = arrs[0],
            dimensionsArr = arrs[1],
            regionsArr.push(...arrs[2]);
     
            generateRegionDropdown();
            // init map global stats
            initiateMap();
            generateDataTable();
            generateDefaultDetailPane();
            //remove loader and show vis
            $('.loader').hide();
            $('#main').css('opacity', 1);
        }); // then
    } // getData

    getData();
});

