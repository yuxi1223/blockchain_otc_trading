
$('#btn').click(async function () {
    var symbol = $("#symbol").val(); //symbol值    
    var name = $("#name").val();     //name值  
    var total = $("#total").val();    //total值
    await contract_addCOLTDS(IFNFT_contract, symbol, name, total);


    
    var order ="buy";
    var time = new Date().toLocaleString();
    const apiURL = 'https://localhost:44397/api/StockHolder';
    $.ajax({
        url: apiURL,  // 指定API 的 URL 
        method: 'POST', // 指定請求方法
        // API的格式
        dataType: "json",
        data: { symbol: symbol, address: address, total: total, order: order,time:time }, //若有傳送資料時的資料設定 (GET沒有)
        async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
        // contentType: "application/json",
        success: res => { // 成功的話執行...
        },
        error: err => { // 失敗的話執行...
        },
    })
}
)
$('#btnClean').click(function () {
    $("#symbol").val("");
    $("#name").val("");
    $("#total").val("");

});
