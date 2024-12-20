$(document).ready(function () {
    $("#option2").hide();
})
$('#btn').click(async function () {
    var symbol = $("#symbol").val(); //symbol值    
    var data = await contract_getCOLTDs(IFNFT_contract, symbol);
    $("#address").attr('readonly', 'readonly').val(data[0].substring(0, 10));
    $("#name").attr('readonly', 'readonly').val(data[1]);

    var status = "";
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
    $("#status").val(status).attr("readonly","readonly");
    $("#total").val(data[3]).attr("readonly","readonly");

    $("#option1").hide();
    $("#option2").show();

}
)
$('#btnClean').click(function () {
    $("#symbol").val("");
    $("#option1").show();
    $("#option2").hide();

});

// 要刪除
$('#testbtn').click(
    async function () {



   

}




);

// 要刪除