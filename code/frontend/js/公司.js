
$(document).ready(
  async function () {
    const stock = window.localStorage.getItem('queryStock')
    const apiURL = 'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6?$format=json&$filter=Business_Accounting_NO%20eq%20' + stock + '&$skip=0&$top=50';
    $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'GET', // 指定請求方法
      dataType: 'json',// API的格式
      data: '', //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      success: res => { // 成功的話執行...
        // $("#Company_Name").text(res[0].Company_Name.replace("股份有限公司", ""));
        $("#title").text(res[0].Company_Name.replace("股份有限公司", ""));
        $(".body-title").text(res[0].Company_Name.replace("股份有限公司", "") + "   " + stock);
      },
      error: err => { // 失敗的話執行...
        // alert("失敗");
      },



    });
    $("#stock").text("統一編號：" + stock);
  }


);


$('#buy').click(async function () {
  var stock = window.localStorage.getItem('queryStock')   //symbol值
  var name = $(".body-title").text().split(' ')[0];       //name值
  var address = await contract_reAccount(IFNFT_contract); //address值
  var quantity = $("#quantity").val();                    //total值
  var price = $("#price").val();                          //price值
  var order = "buy";                                      //order值    
  var time =new Date().toLocaleString();                  //time值
  await contract_addHangBuy(IFNFT_contract, stock, quantity, price);
  // alert("掛買單成功");
  document.getElementById('frame').contentWindow.location.reload(true);


  const apiURL = 'https://localhost:44397/api/PendingOrder';
  $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'POST', // 指定請求方法
      // API的格式
      dataType: "json",
      data: { stock: stock, name: name, address: address, quantity: quantity,price:price,order:order,time:time }, //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      // contentType: "application/json",
      success: res => { // 成功的話執行...
          // alert("Post成功");/
      },
      error: err => { // 失敗的話執行...
          // alert("Post失敗");
      },
  })
}
)
$('#sell').click(async function () {
  var stock = window.localStorage.getItem('queryStock')   //symbol值
  var name = $(".body-title").text().split(' ')[0];       //name值
  var address = await contract_reAccount(IFNFT_contract); //address值
  var quantity = $("#quantity").val();                    //total值
  var price = $("#price").val();                          //price值
  var order = "sell";                                     //order值    
  var time =new Date().toLocaleString();                  //time值
  await contract_addHangSell(IFNFT_contract, stock, quantity, price);
  // alert("掛賣單成功");
  document.getElementById('frame').contentWindow.location.reload(true);


  const apiURL = 'https://localhost:44397/api/PendingOrder';
  $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'POST', // 指定請求方法
      // API的格式
      dataType: "json",
      data: { stock: stock, name: name, address: address, quantity: quantity,price:price,order:order,time:time }, //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      // contentType: "application/json",
      success: res => { // 成功的話執行...
          // alert("Post成功");
      },
      error: err => { // 失敗的話執行...
          // alert("Post失敗");
      },
  })
}
)

