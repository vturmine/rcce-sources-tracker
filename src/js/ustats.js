let lastCountryCharted = '';
let dimensionChart,
    countryData_,
    xAxisArr = ['x'],
    yAxisArr = ['dimension'],
    collections = {};

function generateDefaultDetailPane(){
    $('.details > h6').text('global overwiew');
    $('#globalStats').html('');
    $('#globalStats')
        .append(
            '<div class="row">'+
                '<div class="col-md-6 key-figure">'+
                    '<div class="num" id="totalSources">'+sourcesData.length+'</div>'+
                    '<h5>QUANTITATIVE studies</h5>'+
                '</div>'+
                    '<div class="col-md-6 key-figure">'+
                    '<div class="num" id="date">'+countriesArr.length+'</div>'+
                    '<h5># countries and territories</h5>'+
                '</div>'+
            '</div>'

        );
    $('#overview').addClass('hidden');
    $('#globalStats').removeClass('hidden');
} // generateDefaultDetailPane

function generateDetailPaneFromDim(data, dimension){
    var countriesDim = [];
    data.forEach(element => {
        var arr = element['iso3'].split(",");
        var trimedArr = arr.map(x => x.trim());
        trimedArr.forEach(d => {
            countriesDim.includes(d.trim()) ? '' : countriesDim.push(d.trim());
        });
    });
    $('.details > h6').text(dimension +' dimension overwiew');
    $('#globalStats').html('');
    $('#globalStats')
        .append(
            '<div class="row">'+
                '<div class="col-md-6 key-figure">'+
                    '<div class="num" id="totalSources">'+data.length+'</div>'+
                    '<h5>QUANTITATIVE studies</h5>'+
                '</div>'+
                    '<div class="col-md-6 key-figure">'+
                    '<div class="num" id="date">'+countriesDim.length+'</div>'+
                    '<h5># countries and territories</h5>'+
                '</div>'+
            '</div>'

        );
    $('#overview').addClass('hidden');
    $('#globalStats').removeClass('hidden');
} //generateDetailPane

function generatePaneFromRegion(data, region){
    countryData_ = data;
    for (let index = 0; index < dimensionsArr.length; index++) {
        const element = dimensionsArr[index];
        collections[element] = {"value": 0};
        xAxisArr.push(element);
    }
    countryData_.forEach(element => {
        var dims = element['dimension'].split(",");
        var trimedDimsArr = dims.map(x => x.trim());
        trimedDimsArr.forEach(d => {
            collections[d.trim()].value +=1;
        });
    });
    var totalDim = 0;
    for(k in collections){
        totalDim += collections[k].value;
    }
    for (let index = 1; index < xAxisArr.length; index++) {
        const element = xAxisArr[index];
        yAxisArr[index] = collections[element].value;
    }
    drawPanelChart(region);
} //generatePaneFromRegion 

function generateCountrytDetailPane(country, name){
    if (lastCountryCharted != name) {
        countryData_ = getDataTableDataFromMap(country);
        lastCountryCharted = name;
        for (let index = 0; index < dimensionsArr.length; index++) {
            const element = dimensionsArr[index];
            collections[element] = {"value": 0};
            xAxisArr.push(element);
        }
        countryData_.forEach(element => {
            var dims = element['dimension'].split(",");
            var trimedDimsArr = dims.map(x => x.trim());
            trimedDimsArr.forEach(d => {
                // d.trim() != "" ? collections[d.trim()].value +=1 : null;
                collections[d.trim()].value +=1;
            });
        });
        var totalDim = 0;
        for(k in collections){
            totalDim += collections[k].value;
        }
        for (let index = 1; index < xAxisArr.length; index++) {
            const element = xAxisArr[index];
            yAxisArr[index] = collections[element].value;
        }
        
    }
    
    drawPanelChart(name);
} // generateCountrytDetailPane

function generateOverviewclicked(country, name){
    $('.details > h6').text('global overwiew');
    generateCountrytDetailPane(country, name);
}

function drawPanelChart(name){
    $('.details > h6').text(name+' overwiew');
    $('#overview').html('');
    $('#overview')
        .append(
            '<div class="row">'+
                '<div class="col-md-12 key-figure">'+
                    '<span class="num" id="totalSources">'+countryData_.length+'</span>'+
                    '<span id="sourceLabel"> QUANTITATIVE studies</span>'+
                '</div>'+
            '</div>'+
            '<div class="row">'+
                '<div class="col-md-12">'+
                    '<div id="dimChart">'+
                '</div>'+
            '</div>'
        );
    
    var chart = c3.generate({
        bindto: '#dimChart',
        size: { height: 150 },
        data: {
            x : 'x',
            columns: [xAxisArr, yAxisArr],
            type: 'bar'
        },
        bar: {
            width: 25
        },
        color: {
            pattern: ['#D90368']
        },
        axis: {
            x: {
                type: 'category',
                // height: 100,
                tick: {
                    outer: false,
                    fit: true,
                    rotate: -35,
                    multiline: false
                }
            },
            y: {
                // show: false,
                tick: {
                    outer: false,
                    format: d3.format('d'),
                    count: 3
                }
              }
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
          }
    });
    $('#globalStats').addClass('hidden');
    $('#overview').removeClass('hidden');
}//drawPanelChart