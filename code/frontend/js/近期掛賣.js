// #region 合約基本設定
var web3
var IFNFT_contract = null
var stock
// #region 畫面載入執行
$(document).ready(async function () {

  // #region 檢查合約
  console.log('ethereum', window.ethereum)
  if (typeof window.ethereum !== 'undefined') {
    //檢查瀏覽器是否已安裝MetaMask
    try {
      //var accounts = await ethereum.enable(); //MetaMask請求用戶授權, 舊版的用法未來會停用
      var accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }) //MetaMask請求用戶授權, 連結會登入到MetaMask
      console.log('accounts', accounts)

      //web3 = new Web3(web3.currentProvider);  //web3初始化, 設定Provider為MetaMask提供的Provider, 舊版的用法未來會停用
      web3 = new Web3(window.ethereum) //web3初始化

      updateWeb3Information()
      updateWeb3Account(accounts[0])
      var contract_address = '0x688634EbCE4b8C6317C31Af837EC008eCE03a655' //合約位置
      console.log('contract_address', contract_address)

      contract = createContract(contract_address)


    } catch (error) {
      // alert(error.message)
    }
  } else {
    // alert('未安裝 MetaMask!')
  }
  // #endregion
  // #region 判斷角色顯示navs
  var role = await contract_getRole(IFNFT_contract);
  switch (role) {
    case ("0"):/*一般投資人*/
      $("#DivRegisteredCompany").show();
      $("#DivConditionOfAssets").show();
      $("#DivStockRecord").show();
      //alert("身分：一般投資人");
      break;
    case ("1"):/*經濟部商業司*/
      $("#DivRegisteredCompany").hide();
      $("#DivConditionOfAssets").hide();
      $("#DivStockRecord").hide();
      //alert("身分：經濟部商業司");
      break;
    case ("2"):/*集保中心*/
      $("#DivRegisteredCompany").hide();
      $("#DivConditionOfAssets").hide();
      $("#DivStockRecord").hide();
      //alert("身分：集保中心");
      break;
    case ("3"):/*公司*/
      $("#DivRegisteredCompany").show();
      $("#DivConditionOfAssets").show();
      $("#DivStockRecord").show();
      //alert("身分：公司");
      break;
  }
  //#endregion


  stock = window.localStorage.getItem('queryStock')         //取得當前統一編號
  var SellArray = new Array();                                   //所有賣單array
  var sell = await contract_SearchSell(IFNFT_contract, stock);    //取得買單
  for (var i = 0; i < sell.length; i++) {
    var array = {
      address: sell[i][0],
      quantity: sell[i][1],
      price: sell[i][2]

    }
    SellArray.push(array);
  }


  createSellTable(SellArray);
})
// #endregion



//MetaMask連結區塊鏈
ethereum.on('connect', async function (connectInfo) {
  console.log('connect', connectInfo)
  let chain = '(' + connectInfo.chainId + ')' + getChainNameByID(connectInfo.chainId)
  $('#chain').val(chain)
})

//MetaMask切換網路
ethereum.on('chainChanged', function (chainId) {
  console.log('chain id', chainId)
  window.location.reload()
})

//MetaMask切換帳戶
ethereum.on('accountsChanged', function (accounts) {
  console.log('accountsChanged', accounts)
  window.location.reload(true)
  updateWeb3Account(accounts[0])





})

//根據Chain ID取得網路名稱
function getChainNameByID(chainid) {
  switch (chainid) {
    case '0x1':
      return 'Ethereum Main Network'
    case '0x3':
      return 'Ropsten Test Network'
    case '0x4':
      return 'Rin by Test Network'
    case '0x5':
      return 'Goerli Test Network'
    case '0x2a':
      return 'Kovan Test Network'
    default:
      return '8545 Network'
  }
}

//更新web3資訊
async function updateWeb3Information() {
  $('#web3_version').html(web3.version)
  console.log('providers', web3.providers)
  console.log('given provider', web3.givenProvider)

  var block_number = await web3.eth.getBlockNumber() //查詢目前的區塊編號
  console.log('Block Number', block_number)
  $('#block_number').val(block_number)
}

//設定web3使用的帳戶
async function updateWeb3Account(accounts) {
  web3.eth.defaultAccount = accounts //設定web3使用的帳戶
  $('#account').val(accounts)
  var balance = await web3.eth.getBalance(web3.eth.defaultAccount) //查詢帳戶的以太幣餘額
  console.log('eth餘額:', balance)
  $('#balance').val(web3.utils.fromWei(balance, 'ether'))


}

//建立智能合約實體
async function createContract(address) {
  IFNFT_contract = new web3.eth.Contract(abi, address, {
    gasPrice: '3000000', //以wei為單位的gas價格，設定為20 gwei
  });
  console.log('contract', IFNFT_contract)

  // if (IFNFT_contract) {
  //   //監聽事件
  //   IFNFT_contract.events.merchandise().on("data", async function (event) {
  //     var transctiondata = event.returnValues;
  //     var symbol = transctiondata[0];
  //     var transction = transctiondata[1];
  //     var buyaddress = transctiondata[2];
  //     var selladdress = transctiondata[3];
  //     var total = transctiondata[4];
  //     var price = transctiondata[5];
  //     var time = transctiondata[6];
  //     console.log(transctiondata);
  //     const apiURL = 'https://localhost:44397/api/transction';
  //     $.ajax({
  //       url: apiURL,  // 指定API 的 URL 
  //       method: 'POST', // 指定請求方法
  //       // API的格式
  //       dataType: "json",
  //       data: { symbol: symbol, transction: transction, buyaddress: buyaddress, selladdress: selladdress, total: total, price: price, time: time }, //若有傳送資料時的資料設定 (GET沒有)
  //       async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
  //       // contentType: "application/json",
  //       success: res => { // 成功的話執行...
  //         alert("Post成功");
  //       },
  //       error: err => { // 失敗的話執行...
  //         alert("Post失敗");
  //       },
  //     })
  //   });


  //   IFNFT_contract.events.stockholder().on("data",
  //           async function (event) {
  //               var registerdata = event.returnValues;
  //               var symbol = registerdata[0];
  //               var address = registerdata[1];
  //               var total = registerdata[2];
  //               var time = registerdata[3];
  //             console.log(registerdata)
  //               const apiURL = 'https://localhost:44397/api/StockHolder';
  //               $.ajax({
  //                   url: apiURL,  // 指定API 的 URL 
  //                   method: 'POST', // 指定請求方法
  //                   // API的格式
  //                   dataType: "json",
  //                   data: { symbol: symbol, address: address, total: total, time: time }, //若有傳送資料時的資料設定 (GET沒有)
  //                   async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
  //                   // contentType: "application/json",
  //                   success: res => { // 成功的話執行...
  //                       alert("Post成功");
  //                   },
  //                   error: err => { // 失敗的話執行...
  //                       alert("Post失敗");
  //                   },
  //               })
  //           }
  //       )

  // }
}
// #endregion




function createSellTable(SellArray) {

  var table = $('<table>').addClass('table');
  var tr = $('<tr>').addClass('tr');
  var arrheader = ['日期', '帳號位置', '股數(股)', '價格', ''];
  for (var j = 0; j < arrheader.length; j++) {
    tr.append($('<th>').text(arrheader[j]).addClass('th'));
  }

  table.append(tr);

  for (var i = 0; i < SellArray.length; i++) {
    table.append(
      $('<tr>').append(
        $('<td>').text(new Date().toLocaleString()).addClass('td'),
        $('<td>').text(SellArray[i].address.substring(0, 5)).addClass('td'),
        $('<td>').text(SellArray[i].quantity).addClass('td'),
        $('<td>').text(SellArray[i].price).addClass('td'),
        $('<td>').html("<button class='btn buy' id='" + SellArray[i].address + "'>買進</button>").addClass('td')
      ));

  }
  var div = $('<div>').addClass('div');
  div.append(table)
  $("body").append(div, $('<div>').addClass('control').html("<img src='../img/控制向.jpg' style='height: 30px'>"));
  $("button").click(async function () {
    var symbol = window.localStorage.getItem('queryStock');
    var quantity = $(this).parent().prev().prev().text();
    var price = $(this).parent().prev().text();
    var time = new Date().toLocaleString();
    var address = await contract_reAccount(IFNFT_contract);
    var order = "buy";
    var apiURL = 'https://localhost:44397/api/StockHolder';

    $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'POST', // 指定請求方法
      // API的格式
      dataType: "json",
      data: { symbol: symbol, address: address, total: quantity, order: order, time: time }, //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      // contentType: "application/json",
      success: res => { // 成功的話執行...
        // alert("Post成功");
      },
      error: err => { // 失敗的話執行...
        // alert("Post失敗");
      },
    })

    var address = $(this).attr("id");
    var order = "sell";
    await contract_SellByIndex(IFNFT_contract, stock, address, quantity, price);
    
    // alert("買入：" + address + "股數：" + quantity + "價格：" + price);

    var apiURL = 'https://localhost:44397/api/PendingOrder';
    $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'Delete', // 指定請求方法
      // API的格式
      dataType: "json",
      data: { stock: stock, address: address, quantity: quantity, price: price, order: order }, //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      success: res => { // 成功的話執行...
        // alert("Post成功");
      },
      error: err => { // 失敗的話執行...
        // alert("Post失敗");
      },
    })
    


    var time = new Date().toLocaleString();
    apiURL = 'https://localhost:44397/api/StockHolder';
    $.ajax({
      url: apiURL,  // 指定API 的 URL 
      method: 'POST', // 指定請求方法
      // API的格式
      dataType: "json",
      data: { symbol: symbol, address: address, total: quantity, order: order, time: time }, //若有傳送資料時的資料設定 (GET沒有)
      async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
      // contentType: "application/json",
      success: res => { // 成功的話執行...
        // alert("Post成功");
      },
      error: err => { // 失敗的話執行...
        // alert("Post失敗");
      },
    });
    setTimeout(function(){location.reload()}, 1000);
  });

}

