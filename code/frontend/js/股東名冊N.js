
$(document).ready(async function () {
    var symbol = window.localStorage.getItem('queryStock')
    var apiURL = 'https://localhost:44397/api/StockHolder';
    $.ajax({
        url: apiURL+"?symbol="+symbol,  // 指定API 的 URL 
        method: 'GET', // 指定請求方法
        // API的格式
        dataType: "json",
        traditional: true , 
        data: {}, //若有傳送資料時的資料設定 (GET沒有)
        async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
        // contentType: "application/json",
        success: res => { // 成功的話執行...
          var stockHolder = res;
          var stockHolderArray = new Array();                                                   //所有買單array
          for (var i = 0; i < stockHolder.length; i++) {
    
            var array = {
                symbol: stockHolder[i].symbol,
                address: stockHolder[i].address,
                total: stockHolder[i].total,
                time: stockHolder[i].time
            }
            stockHolderArray.push(array);
          }
          createStockHolderTable(stockHolderArray);
    
        },
        error: err => { // 失敗的話執行...
          // alert("Get失敗");
        },
      })
    
  
  
    
 
})





function createStockHolderTable(stockHolderArray) {

  var table = $('<table>').addClass('table');
  var tr = $('<tr>').addClass('tr');
  var arrheader = ['變更時間', '帳號位置', '股數', '持有比例'];
  for (var j = 0; j < arrheader.length; j++) {
    tr.append($('<th>').text(arrheader[j]).addClass('th'));
  }

  table.append(tr);

  for (var i = 0; i < stockHolderArray.length; i++) {
    table.append(
      $('<tr>').append(
        $('<td>').text(stockHolderArray[i].time).addClass('td'),
        $('<td>').text(stockHolderArray[i].address.substring(0, 5)).addClass('td'),
        $('<td>').text(stockHolderArray[i].total).addClass('td'),
        $('<td>').text((stockHolderArray[i].total/100000).toFixed(2)+"%").addClass('td'),
      
      ));

  }
  var div = $('<div>').addClass('div');
  div.append(table)
  $("body").append(div, $('<div>').addClass('control').html("<img src='../img/控制向.jpg' style='height: 30px'>"));
  



    
}
