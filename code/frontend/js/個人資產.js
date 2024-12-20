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
      var contract_address ='0x6700aC1C3D30AB86d371C4971ebc32EF81832AE5' //合約位置
      console.log('contract_address', contract_address)

      contract = createContract(contract_address)


    } catch (error) {
      alert(error.message)
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
  
  
  var investCompanyArray = new Array();                                                   //所有買單array
  var investCompany = await contract_searchinvestor(IFNFT_contract);                      //取得投資的公司
  for (var i = 0; i < investCompany.length; i++) {
    
    var data = await contract_getCOLTDs(IFNFT_contract,investCompany[i][0]);              //data[1]取得公司名稱,data[3]取得總股數
    var account = await contract_reAccount(IFNFT_contract);
    var quantity=await contract_searchStock(IFNFT_contract,investCompany[i][0],account);
    var totalBuy=await contract_totalhangbuy(IFNFT_contract,investCompany[i][0]);
    var totalSell=await contract_totalhangsell(IFNFT_contract,investCompany[i][0]);
    var array = {
      name:data[1],
      symbol: investCompany[i][0],
      quantity:quantity,
      totalRate:((quantity/data[3])*100).toFixed(1)+"%",
      totalBuy:totalBuy,
      totalSell:totalSell

    }
    investCompanyArray.push(array);
  }

  createInvestTable(investCompanyArray);
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




function createInvestTable(investCompanyArray) {

  var table = $('<table>').addClass('table');
  var tr = $('<tr>').addClass('tr');
  var arrheader = ['公司名稱', '統一編號', '股數',"占比", '總買單股數','總賣單股數'];
  for (var j = 0; j < arrheader.length; j++) {
    tr.append($('<th>').text(arrheader[j]).addClass('th'));
  }

  table.append(tr);

  for (var i = 0; i < investCompanyArray.length; i++) {
    table.append(
      $('<tr>').append(
        $('<td>').html("<a href='./公司.html' id='" + investCompanyArray[i].symbol + "'>"+investCompanyArray[i].name+"</a>").addClass('tt'),
        $('<td>').text(investCompanyArray[i].symbol).addClass('td'),
        $('<td>').text(investCompanyArray[i].quantity).addClass('td'),
        $('<td>').text(investCompanyArray[i].totalRate).addClass('td'),
        $('<td>').text(investCompanyArray[i].totalBuy).addClass('td'),
        $('<td>').text(investCompanyArray[i].totalSell).addClass('td'),
      ));

  }
  var div = $('<div>').addClass('div');
  div.append(table)
  $("body").append(div,$('<div>').addClass('control').text("控制項"));
  $("a").click( function(){
    
     var stock = $(this).attr("id");
     localStorage.setItem('queryStock', stock)
     alert(stock);
   
});

}

