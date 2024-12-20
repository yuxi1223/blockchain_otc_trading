// #region 合約基本設定
var web3
var IFNFT_contract = null
$(async function () {
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
      var contract_address = '0x90d7aB8DdEf2A8198aAc91aE759D71D17803B8ab' //合約位置
      console.log('contract_address', contract_address)

      contract = createContract(contract_address)


    } catch (error) {
      alert(error.message)
    }
  } else {
    alert('未安裝 MetaMask!')
  }
  var role = await contract_getRole(IFNFT_contract);
    switch (role) {
        case (0):/*登錄後的投資人*/
            $("#DivRegisteredCompany").show();
            $("#DivConditionOfAssets").show();
            $("#DivStockRecord").show();
            alert("身分：一般投資人");
            break;
        case (1):/*經濟部商業司*/
            $("#DivRegisteredCompany").hide();
            $("#DivConditionOfAssets").hide();
            $("#DivStockRecord").hide();
            alert("身分：經濟部商業司");
            break;
        case (2):/*集保中心*/
            $("#DivRegisteredCompany").hide();
            $("#DivConditionOfAssets").hide();
            $("#DivStockRecord").hide();
            alert("身分：集保中心");
            break;
        case (3):/*公司*/
            $("#DivRegisteredCompany").hide();
            $("#DivConditionOfAssets").hide();
            $("#DivStockRecord").hide();
            alert("身分：公司");
            break;
    }
})

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


