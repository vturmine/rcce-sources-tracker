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
                    '<h5># unique countries</h5>'+
                '</div>'+
            '</div>'

        );
    $('#overview').addClass('hidden');
    $('#globalStats').removeClass('hidden');
} // generateDefaultDetailPane

function generateCountrytDetailPane(country){
    if (lastCountryCharted != country) {
        countryData_ = getDataTableDataFromMap(country);
        lastCountryCharted = country;
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
        
    }
    $('.details > h6').text(country+' overwiew');
    $('#overview').html('');
    $('#overview')
        .append(
            '<div class="col-md-6 key-figure">'+
                '<span class="num" id="totalSources">'+countryData_.length+'</span>'+
                '<span id="sourceLabel"> QUANTITATIVE studies</span>'+
            '</div>'+
            '<div class="row">'+
                '<div id="dimChart">'+
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
                tick: {
                    outer: false,
                    // multiline: false,
                    fit: true
                }
            },
            y: {
                show: false
                // max: 91,
                // label: {
                //     text: 'Percentage',
                //     position: 'outer-center'
                // },
                // tick: {
                //     outer: false,
                //     format: d3.format('d'),
                //     count: 4
                // }
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
    
} // generateCountrytDetailPane

function generateOverviewclicked(country){
    $('.details > h6').text('global overwiew');
    generateCountrytDetailPane(country);
}