// #region 合約基本設定
var web3
var IFNFT_contract = null
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
    // #region 判斷角色顯示nav
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




    $(".text-1").show();
    $(".text-3").hide();
    $(".image1").hide();
    $(".image2").hide();
    $(".image3").hide();
    var address = await contract_reAccount(IFNFT_contract);
    const apiURL = 'https://localhost:44397/api/personalinformation';
    $.ajax({
        url: apiURL + "?address=" + address,  // 指定API 的 URL 
        method: 'GET', // 指定請求方法
        // API的格式
        dataType: "json",
        traditional: true,
        data: {}, //若有傳送資料時的資料設定 (GET沒有)
        async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
        // contentType: "application/json",
        success: res => { // 成功的話執行...
            console.log(res.length);
            if (res.length != 0)
                $(location).attr('href', './個人資產N.html');
        },
        error: err => { // 失敗的話執行...
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
    console.log('contract', IFNFT_contract);
    // if (IFNFT_contract) {
    //     //監聽事件
    //     IFNFT_contract.events.showCOLTDData().on("data",
    //         async function (event) {
    //             var registerdata = event.returnValues;
    //             var symbol = registerdata[0];
    //             var time = registerdata[1];
    //             var data = await contract_getCOLTDs(IFNFT_contract, symbol);
    //             var name = data[1];
    //             var total = data[3];
    //             var status = "審核中";
    //             const apiURL = 'https://localhost:44397/api/a';
    //             $.ajax({
    //                 url: apiURL,  // 指定API 的 URL 
    //                 method: 'POST', // 指定請求方法
    //                 // API的格式
    //                 dataType: "json",
    //                 data: { symbol: symbol, name: name, total: total, time: time, status: status }, //若有傳送資料時的資料設定 (GET沒有)
    //                 async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
    //                 // contentType: "application/json",
    //                 success: res => { // 成功的話執行...
    //                     alert("Post成功");
    //                 },
    //                 error: err => { // 失敗的話執行...
    //                     alert("Post失敗");
    //                 },
    //             })
    //         }
    //     )

    //     IFNFT_contract.events.stockholder().on("data",
    //         async function (event) {
    //             var registerdata = event.returnValues;
    //             var symbol = registerdata[0];
    //             var address = registerdata[1];
    //             var total = registerdata[2];
    //             var time = registerdata[3];

    //             const apiURL = 'https://localhost:44397/api/StockHolder';
    //             $.ajax({
    //                 url: apiURL,  // 指定API 的 URL 
    //                 method: 'POST', // 指定請求方法
    //                 // API的格式
    //                 dataType: "json",
    //                 data: { symbol: symbol, address: address, total: total, time: time }, //若有傳送資料時的資料設定 (GET沒有)
    //                 async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
    //                 // contentType: "application/json",
    //                 success: res => { // 成功的話執行...
    //                     alert("Post成功");
    //                 },
    //                 error: err => { // 失敗的話執行...
    //                     alert("Post失敗");
    //                 },
    //             })
    //         }
    //     )
    // }
}
// #endregion


$("#searchphoto").click(
    function () {
        const stock = $('#searchtext').val();
        localStorage.setItem('queryStock', stock)
        $(location).attr('href', './公司N.html');
    }
);

function GetTime(time) {
    var date = new Date(time);
    var result = ((date.getFullYear().toString()) + "/" + (date.getMonth() + 1).toString() + "/" + (date.getDate()).toString() + " " + (date.getHours()).toString() + ":" + (date.getMinutes()).toString() + ":" + (date.getSeconds()).toString());
    return result;

}







var a = 0
$('#btn').click(function () {

    if (a % 2 == 0) {
        $("#btn").text("上一頁");
        $(".text-1").hide();
        $(".text-3").show();
        $("#btnClean").text("送出");
        a++;
    }
    else {
        $("#btn").text("下一頁");
        $(".text-1").show();
        $(".text-3").hide();
        $("#btnClean").text("清除");
        a++
    }
});


$('#btnClean').click(async function () {
    if (a % 2 == 0) {
        $("#id").val("");
        $("#name").val("");
    }
    else {
        await contract_reAccount(IFNFT_contract);
        var name = $("#name").val();
        var id = $("#id").val();
        var address = await contract_reAccount(IFNFT_contract);
        const apiURL = 'https://localhost:44397/api/personalinformation';
        $.ajax({
            url: apiURL,  // 指定API 的 URL 
            method: 'POST', // 指定請求方法
            // API的格式
            dataType: "json",
            traditional: true,
            data: { name: name, id: id, address: address }, //若有傳送資料時的資料設定 (GET沒有)
            async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
            // contentType: "application/json",
            success: res => { // 成功的話執行...
                // alert("Get成功");
            },
            error: err => { // 失敗的話執行...
                // alert("Get失敗");
            },
        })
        setTimeout(function () { $(location).attr('href', './身分驗證N.html') }, 1000);


    }


});

var count = 1
// $('#image').change(function () {
//     var file = $('#image')[0].files[0];
//     var reader = new FileReader;
//     reader.onload = function (e) {
//         switch (count) {
//             case (1): {
//                 $(".1").hide();
//                 $(".1").show();
//                 $('#demo1').attr('src', e.target.result);
//             }
//             case (2): {
//                 $(".2").hide();
//                 $(".image2").show();
//                 $("#demo2").attr('src', e.target.result);
//             }
//             case(3):{
//                 $(".3").hide();
//                 $(".image3").show();
//                 $("#demo3").attr('src', e.target.result);
//             }

//         }
//     };
//     reader.readAsDataURL(file);
//     count++;
// });
$('.1').change(function () {
    var file = $('.1')[0].files[0];
    var reader = new FileReader;
    reader.onload = function (e) {

        if(count==1){
        $(".1").hide();
        $(".fa1").hide();
        $(".image1").show();
        $("#demo1").attr('src', e.target.result);
    };
    if(count==2){

        $(".2").hide();
        $(".fa2").hide();
        $(".image2").show();
        $("#demo2").attr('src', e.target.result);
    };
    if(count==3){

        $(".3").hide();
        $(".fa3").hide();
        $(".image3").show();
        $("#demo3").attr('src', e.target.result);
    }
    count++;
    };
    reader.readAsDataURL(file);
});
// $('.2').change(function () {
//     var file = $('.2')[0].files[0];
//     var reader2 = new FileReader;
//     reader2.onload = function (e) {
//         $(".2").hide();
//         $(".image2").show();
//         $("#demo2").attr('src', e.target.result);
//     };
//     reader2.readAsDataURL(file);
// });
// $('.3').change(function () {
//     var file = $('.3')[0].files[0];
//     var reader3= new FileReader;
//     reader3.onload = function (e) {
//         $(".3").hide();
//         $(".image3").show();
//         $("#demo3").attr('src', e.target.result);
//     };
//     reader3.readAsDataURL(file);
// });