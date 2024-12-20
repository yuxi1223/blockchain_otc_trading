$('#btn').click(async function () {
    var symbol = $("#symbol").val(); //symbol值    
    var data = await contract_getCOLTDs(IFNFT_contract, symbol);
    $("#address").text("帳號：" + data[0]);
    $("#name").text("公司名稱：" + data[1]);

    var status="";
    switch (data[2]) {
        case ("0"):
            status = "尚未檢查";
            break;
        case ("1"):
            status = "檢查中";
            break;
        case ("2"):
            status = "通過";
            break;
        case ("3"):
            status = "未通過";
            break;

    }

    $("#status").text("審核狀態：" + status);
    $("#total").text("授權股數：" + data[3]);
}
)
$('#btn1').click(async function () {
    var symbol = $("#symbol").val(); //symbol值    
    var data = await contract_examine(IFNFT_contract,symbol,true);
    
}
)