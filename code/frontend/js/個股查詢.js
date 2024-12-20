$('#btn').click(function () {
    const stock = $('#stock').val();
    const apiURL = 'https://data.gcis.nat.gov.tw/od/data/api/7E6AFA72-AD6A-46D3-8681-ED77951D912D?$format=json&$filter=President_No%20eq%2015725713%20and%20Agency%20eq%20376610000A&$skip=0&$top=50';

    $.ajax({
        url: apiURL,  // 指定API 的 URL 
        method: 'GET', // 指定請求方法
        dataType: 'json',// API的格式
        data: '', //若有傳送資料時的資料設定 (GET沒有)
        async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
        success: res => { // 成功的話執行...
            $("#text").text("查詢成功");
            localStorage.setItem('queryStock', stock);
            $(location).attr('href', './公司N.html');
        },
        error: err => { // 失敗的話執行...
            $("#text").text("查無此公司");;
        },
    })
});

$('#btnClean').click(function () {
    $("#stock").val("");

});