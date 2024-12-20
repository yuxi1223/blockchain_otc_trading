//載入頁面時執行
$(document).ready(

    function () {
      var role = 1/*這邊放判斷角色的function*/;
      switch (role) {
        case (1):/*一般使用者*/
          $("#DivRegisteredCompany").show();
          $("#DivConditionOfAssets").hide();
          $("#DivStockRecord").hide();
          break;
        case (2):/*登錄後的投資人*/
          $("#DivRegisteredCompany").hide();
          $("#DivRegisteredCompany").hide();
          $("#DivConditionOfAssets").show();
          break;
        case (3):/*公司*/
          $("#DivRegisteredCompany").hide();
          $("#DivRegisteredCompany").hide();
          $("#DivConditionOfAssets").show();
          break;
      }
  
    }
  
)