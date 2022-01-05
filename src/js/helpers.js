// helpers js
let sourcesDataFiltered;
let datatable;

// let regionsArr = ['All regions', 'AP', 'ESAR', 'EURO', 'LAC', 'MENA', 'WCAR'];
let regionsArr = ['All regions'];
let dimensionsArr = [];

function slugify(texte){
    return texte.toLowerCase()
             .replace(/[^\w ]+/g, '')
             .replace(/ +/g, '-');
}

// 
function generateRegionDropdown(){
    var options = "";
    console.log(regionsArr)
    for (let index = 0; index < regionsArr.length; index++) {
        const element = regionsArr[index];
        index == 0 ? options += '<option value="all" selected>' + element + '</option>'  : 
            options += '<option value="' + element + '">' + element + '</option>';
    }
    $('#regionSelect').append(options);
    $('#all').toggleClass('active');

} //generateRegionDropdown

function generateDimensionFilterSpan(){
    var labels = "<label><strong>Filter by: <strong></label>";
    for (let index = 0; index < dimensionsArr.length; index++) {
        const item = dimensionsArr[index];
        // if(item == "Structural factor" || item == "Social environment"){
        //     labels += '<label><button type="button" class="btn btn-secondary filter" id="'+slugify(item)+'" value="'+item+'">'+item+'</button></label>';
        // } else {
        //     labels += '<label><button type="button" class="btn btn-secondary filter" id="'+slugify(item)+'" value="'+item+'">'+item+'</button></label>';
        // }
        labels += '<label><button type="button" class="btn btn-secondary filter" id="'+slugify(item)+'" value="'+item+'">'+item+'</button></label>';
    }
    $('.dimensionFilter').append(labels);
}//generateDimensionFilterSpan

function getColumnUniqueValues(){
    var values = [];
    for (let index = 0; index < arguments.length; index++) {
        var arr = [];
        values.push(arr);
    }
    sourcesData.forEach(element => {
        for (let index = 0; index < arguments.length; index++) {
            var arr = element[arguments[index]].split(",");
            var returnArr = values[index];
            var trimedArr = arr.map(x => x.trim());
            trimedArr.forEach(d => {
                returnArr.includes(d.trim()) ? '' : returnArr.push(d.trim());
            });
            values[index] = returnArr;
        }
    });

    return values;
}//getColumnUniqueValues

