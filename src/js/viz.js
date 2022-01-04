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
            sourcesDataFiltered = data[1];
            // console.log(sourcesData)
            sourcesData.forEach(element => {
                var countries = element['countries'].split(",");
                var dims = element['dimension'].split(",");
                var regs = element['region'].split(",");

                var trimedCountriesArr = countries.map(x => x.trim());
                var trimedDimsArr = dims.map(x => x.trim());
                var trimedRegArr = regs.map(x => x.trim());

                var paysArr = [],
                    dimsArr = [], 
                    regsArr = [];
            
                for (let index = 0; index < trimedCountriesArr.length; index++) { //remove empty elements
                    if (trimedCountriesArr[index]) {
                        paysArr.push(trimedCountriesArr[index]);
                    }
                }
                paysArr.forEach(d => {
                    countriesArr.includes(d.trim()) ? '' : countriesArr.push(d.trim());
                });
                for (let index = 0; index < trimedDimsArr.length; index++) { //remove empty elements
                    if (trimedDimsArr[index]) {
                        dimsArr.push(trimedDimsArr[index]);
                    }
                }
                dimsArr.forEach(d => {
                    dimensionsArr.includes(d.trim()) ? '' : dimensionsArr.push(d.trim());
                });
                for (let index = 0; index < trimedRegArr.length; index++) { //remove empty elements
                    if (trimedRegArr[index]) {
                        regsArr.push(trimedRegArr[index]);
                    }
                }
                regsArr.forEach(r => {
                    regionsArr.includes(r.trim()) ? '' : regionsArr.push(r.trim());
                });
            });

            generateRegionDropdown();
            // init map global stats
            initiateMap();
            generateDataTable();
            //remove loader and show vis
            $('.loader').hide();
            $('#main').css('opacity', 1);
        }); // then
    } // getData

    getData();
});

