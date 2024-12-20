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
    alert('未安裝 MetaMask!')
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
  var symbol =localStorage.getItem('queryStock');
  var address =await contract_reAccount(IFNFT_contract);
  var order =localStorage.getItem('assets');
  const apiURL = 'https://localhost:44397/api/PendingOrder';
  $.ajax({
    url: apiURL+"?symbol="+symbol+"&address="+address+"&order="+order,  // 指定API 的 URL 
    method: 'GET', // 指定請求方法
    // API的格式
    dataType: "json",
    traditional: true , 
    data: {symbol:symbol,ddress: address, order: order}, //若有傳送資料時的資料設定 (GET沒有)
    async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
    // contentType: "application/json",
    success: res => { // 成功的話執行...
      var pendingOrder = res;
      var pendingOrderArray = new Array();                                                   //所有買單array
      for (var i = 0; i < pendingOrder.length; i++) {

        var array = {
          symbol: pendingOrder[i].symbol,
          name: pendingOrder[i].name,
          address: pendingOrder[i].address,
          total: pendingOrder[i].total,
          price: pendingOrder[i].price,
          order: pendingOrder[i].order,
          time: pendingOrder[i].time,
        }
        pendingOrderArray.push(array);
      }

      createPendingOrderTable(pendingOrderArray);

    },
    error: err => { // 失敗的話執行...
      // alert("Get失敗");
    },
  })
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
}
// #endregion




function createPendingOrderTable(pendingOrderArray) {

  var table = $('<table>').addClass('table');
  var tr = $('<tr>').addClass('tr');
  var arrheader = ['日期', '公司名稱', '統一編號', "價格", '股數', '買單取消', ''];
  for (var j = 0; j < arrheader.length; j++) {
    tr.append($('<th>').text(arrheader[j]).addClass('th'));
  }

  table.append(tr);

  for (var i = 0; i < pendingOrderArray.length; i++) {
    table.append(
      $('<tr>').append(
        $('<td>').text(pendingOrderArray[i].time).addClass('td'),
        $('<td>').html("<a href='./公司N.html' id='" + pendingOrderArray[i].symbol + "'>" + pendingOrderArray[i].name + "</a>").addClass('td'),
        $('<td>').text(pendingOrderArray[i].symbol).addClass('td'),
        $('<td>').text(pendingOrderArray[i].price).addClass('td'),
        $('<td>').text(pendingOrderArray[i].total).addClass('td'),
        $('<td>').html("<button class='btn' id='" + pendingOrderArray[i].address + "'>取消</button>").addClass('td')
      ));

  }
  var div = $('<div>').addClass('div');
  div.append(table)
  $(".main-area").append(div, $('<div>').addClass('control').html("<img src='../img/控制向.jpg' style='height: 30px'>"));
  $("a").click(function () {

    var stock = $(this).attr("id");
    localStorage.setItem('queryStock', stock)
    // alert(stock);
  });

  $("button").click(async function () {
    var stock = window.localStorage.getItem('queryStock');
    var address = $(this).attr("id");
    var quantity = $(this).parent().prev().text();
    var price = $(this).parent().prev().prev().text();
    var order =window.localStorage.getItem('assets');

    if(order=="buy")
    await contract_deleteBuy(IFNFT_contract,stock,quantity,price); 
    else if(order=="sell")
    await contract_deleteSell(IFNFT_contract,stock,quantity,price); 

    const apiURL = 'https://localhost:44397/api/PendingOrder';
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
    setTimeout(function(){location.reload()}, 1000);


  })
}

$("#searchphoto").click(
  function () {
    const stock = $('#searchtext').val();
    localStorage.setItem('queryStock', stock)
    $(location).attr('href', './公司N.html');
  }
);
