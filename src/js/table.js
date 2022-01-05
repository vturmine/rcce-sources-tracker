// table js

// get dimensions formatted in tags
function getFormattedDimension(item){
    var items = [] ;
    var arr = item.split(",");
    var trimedArr = arr.map(x => x.trim());
    for (let index = 0; index < trimedArr.length; index++) { //remove empty elements
        if (trimedArr[index]) {
            items.push(trimedArr[index]);
        }
    }
    var formatedDims = "";
    items.forEach(element => {
        var className = slugify(element);
        formatedDims +='<label class="alert tag-'+className+'">'+element+'</label>';
    });
    return formatedDims;
}//getFormattedDimension

function getDataTableData(data = sourcesDataFiltered){
    var dt = [];
    data.forEach(element => {
        dt.push(
            [element['source_id'],element['title'],
            getFormattedDimension(element['dimension']), 
            element['region'],
            element['source_date'], 
            element['organisation'],
            '<a href="'+element['link']+'" target="blank"><i class="fa fa-external-link"></i></a>',
            //hidden
            element['details'],element['authors'],element['countries'],
            element['variables'],element['source_comment'],element['methodology'],
            element['target_pop'], element['sample_type'],element['quality_check']
        ]);
    });
    return dt;
} //getDataTableData

// generate data table
function generateDataTable(){
    var dtData = getDataTableData();
    datatable = $('#datatable').DataTable({
        data : dtData,
        "columns": [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '<i class="fa fa-plus-circle"></i>',
                "width": "1%"
            },
            {"width": "25%"},
            {"width": "15%"},
            {"width": "15%"},
            {"width": "5%"},
            {"width": "10%"},
            {"width": "1%"}
        ],
        "columnDefs": [
            {
                "className": "dt-head-left",
                "targets": "_all"
            },
            {
                "defaultContent": "-",
                "targets": "_all"
            },
            {"targets": [7], "visible": false},{"targets": [8], "visible": false},{"targets": [9], "visible": false},
            {"targets": [10], "visible": false},{"targets": [11], "visible": false},{"targets": [12], "visible": false},
            {"targets": [13], "visible": false},{"targets": [14], "visible": false},{"targets": [15], "visible": false},
            { "searchable" : true, "targets": "_all"},
            {"type": "myDate","targets": 4}
        ],
        "pageLength": 20,
        "bLengthChange": false,
        "pagingType": "simple_numbers",
        "order":[[1, 'asc']],
        "dom": "Blrtp",
        "buttons": {
            "buttons": [
                {
                    extend: 'excelHtml5',
                    "className": "exportData",
                    exportOptions:{
                        // columns: ':visible',
                        rows: ':visible',
                        format:{
                            header: function(data, columnIdx){
                                var hd = ['details', 'authors', 'countries', 'variables', 'source_comment','methodology','target_pop','sample_type','quality_check'];
                                if(columnIdx >= 7){
                                    return hd[columnIdx-7];
                                }else {
                                    return data;
                                }
                            }
                        }
                    }
                }
            ]
        }
    });

    $('#datatable tbody').on('click', 'td.details-control', function(){
        var tr = $(this).closest('tr');
        var row = datatable.row(tr);
        if(row.child.isShown()){
            row.child.hide();
            tr.removeClass('shown');
            tr.css('background-color', '#fff');
            tr.find('td.details-control i').removeClass('fa-minus-circle');
            tr.find('td.details-control i').addClass('fa-plus-circle');
        }
        else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
            tr.css('background-color', '#f5f5f5');
            $('#cfmDetails').parent('td').css('border-top', 0);
            $('#cfmDetails').parent('td').css('padding', 0);
            $('#cfmDetails').parent('td').css('background-color', '#f5f5f5');
            tr.find('td.details-control i').removeClass('fa-plus-circle');
            tr.find('td.details-control i').addClass('fa-minus-circle');
    
        }
    });
} //generateDataTable

function format(arr){
    filtered = sourcesData.filter(function(d){ return d['source_id']==arr[0]; });    
    return '<table class="tabDetail" id="cfmDetails" >'+
                '<tr>'+
                    '<td>&nbsp;</td>'+
                    '<td>&nbsp;</td>'+
                    '<td>&nbsp;</td>'+'<td>&nbsp;</td>'+
                    '<td>'+
                        '<table class="tabDetail" >'+
                            '<tr>'+
                                '<th><strong>Geo</strong></th>'+
                                '<td>Region</td>'+
                                '<td>'+filtered[0]['region']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Countries ('+filtered[0]['country_count']+')</td>'+
                                '<td>'+filtered[0]['countries']+'</td>'+
                            '</tr>'+
                        
                            '<tr>'+
                                '<th><strong>Purpose</strong></th>'+
                                '<td>Summary</td>'+
                                '<td>'+filtered[0]['details']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Indicators</td>'+
                                '<td>'+filtered[0]['variables']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Target</td>'+
                                '<td>'+filtered[0]['target_pop']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<th><strong>Method</strong></th>'+
                                '<td>Survey</td>'+
                                '<td>'+filtered[0]['methodology']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Sample</td>'+
                                '<td>'+filtered[0]['sample_type']+' - '+filtered[0]['sample_size']+' respondents</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Review</td>'+
                                '<td>'+filtered[0]['quality_check']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Comment</td>'+
                                '<td>'+filtered[0]['source_comment']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                // '<th rowspan="3"><strong>Source</strong></th>'+
                                '<th><strong>Source</strong></th>'+
                                '<td>Data Type</td>'+
                                '<td>'+filtered[0]['access_type']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Authors</td>'+
                                '<td>'+filtered[0]['authors']+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>&nbsp;</td>'+
                                '<td>Publication</td>'+
                                // '<td><a href="'+filtered[0]['link']+'" target="blank"><i class="fa fa-download fa-sm"></i></a></td>'+
                                '<td>'+filtered[0]['publication_channel']+'</td>'+
                            '</tr>'+
                        '</table>'+
                    '</td>'+
                    '<td>&nbsp;</td>'+
                '</tr>'+
            '</table>'
}//format

function updateDataTable(data = sourcesData){
    var dt = getDataTableData(data);
    $('#datatable').dataTable().fnClearTable();
    $('#datatable').dataTable().fnAddData(dt);

} //updateDataTable

// search button
$('#searchInput').keyup(function () {
    datatable.search($('#searchInput').val()).draw();
});

var buttocks = document.getElementsByClassName("filter");
for (var i = 0; i < buttocks.length; i++) {
    buttocks[i].addEventListener('click', clickButton);   
}

function clickButton(){
    $('.btn').removeClass('active');
    var dimSelected = this.value;
    var regionSelected = $('#regionSelect').val();
    var data = sourcesData ;


    if(mapClicked){
        console.log(selectedCountryFromMap)
        data = data.filter(function(item){
            var arr = item['countries'].split(",");
            var trimedArr = arr.map(x => x.trim());
            return trimedArr.includes(selectedCountryFromMap) ? item : null;
        })
    }

    if (dimSelected == "all") {
        //test map clicked ? 
        mapClicked ? resetMap() : null;
        updateDataTable(data);
        $('#regionSelect').val('all');
        // mapClicked = false;
        // generateDefaultDetailPane();

    } else {
        var filteredData = data.filter(function(d) {
            var arr = d['dimension'].split(",");
            var regArr = d['region'].split(",");
            var trimedTagArr = arr.map(x => x.trim());
            var trimedRegArr = regArr.map(x => x.trim());
            regionSelected == 'all' ? trimedRegArr = "all" : null;
            return ( trimedTagArr.includes(dimSelected) && trimedRegArr.includes(regionSelected)) ? d : null;
        })
        updateDataTable(filteredData);
    }

    $(this).toggleClass('active');

}//clickButton

// on select dropdown change
$('#regionSelect').on('change',function(){
    var tagsFilter = 'all';
    var data = sourcesData;

    if(!($('#all').hasClass('active'))){
        for (var i = 0; i < buttocks.length; i++) {
            if ($(buttocks[i]).hasClass('active')) {
                tagsFilter = $(buttocks[i]).val();
            }
            
        }
    }
    var regionSelected = $('#regionSelect').val();
    mapClicked ? resetMap() : null;

    if (regionSelected == "all") {
        tagsFilter == 'all' ? updateDataTable() : $('.active').trigger('click');
    } else {
            var filter = data.filter(function(d) {
            var arr = d['dimension'].split(",");
            var regArr = d['region'].split(",");
            var trimedTagArr = arr.map(x => x.trim());
            var trimedRegArr = regArr.map(x => x.trim());
            tagsFilter == 'all' ? trimedTagArr = "all" : null; //this for the condition to be always true
            return (trimedRegArr.includes(regionSelected) && trimedTagArr.includes(tagsFilter) ) ? d : null;
        });
        updateDataTable(filter);
    }
    // $('#'+tagsFilter).toggleClass('active');
});

$("#exportTable").on("click", function() {
    // datatable.button( '.buttons-excel' ).trigger();
    $(".buttons-excel").trigger("click");
});

function getDataTableDataFromMap(country){
    var dataByCountry = sourcesDataFiltered.filter(function(p) { 
        var countries = p['countries'].split(",");
        var trimedCountriesArr = countries.map(x => x.trim());
        return trimedCountriesArr.includes(country) ; 
    });
    
    // reinitiate dim et region select filters to default
    return dataByCountry;
} //getDataTableDataFromMap

function getFilteredData(){
    console.log("get filtered data running..")
    var data = [];

    return data;

} //getFilteredData