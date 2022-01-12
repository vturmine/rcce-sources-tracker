let geodataUrl = 'data/wld.json';
let data_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwVG8xzJogJgeBzk5-mLaA7BOGWhwU_Z6iGrnGQwPT2OAInzFYX-5hNYh2aFyqn0sVh0PpFikSJuEq/pub?gid=1612863274&single=true&output=csv';
// 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQDTIju76FYADX9ZKbKBD1JBA7eFLv86Y8ltOTs24eLqrf3FnKJENmtcUkP1HUMCQq7JL9hgwofz0q/pub?gid=1612863274&single=true&output=csv';

let geomData,
    sourcesData;


$( document ).ready(function(){
    function getData(){
        Promise.all([
            d3.json(geodataUrl),
            d3.csv(data_url),
        ]).then(function(data){
            geomData = topojson.feature(data[0], data[0].objects.worldtopo12022020);
            sourcesData = data[1];

            sourcesDataFiltered = data[1];
            var arrs = getColumnUniqueValues("iso3", "dimension", "region");
            countriesArr = arrs[0],
            dimensionsArr = arrs[1],
            regionsArr.push(...arrs[2]);
            console.log(geomData)
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

