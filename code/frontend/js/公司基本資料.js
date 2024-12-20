
$(document).ready(async function () {
  const stock = window.localStorage.getItem('queryStock')
  const apiURL = 'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6?$format=json&$filter=Business_Accounting_NO%20eq%20' + stock + '&$skip=0&$top=50';
  $.ajax({
    url: apiURL,  // 指定API 的 URL 
    method: 'GET', // 指定請求方法
    dataType: 'json',// API的格式
    data: '', //若有傳送資料時的資料設定 (GET沒有)
    async: true,　//  預設是true=非同步,false=同步 (true時整行可省略)
    success: res => { // 成功的話執行...
      $("#Company_Name").append("公司名稱："+res[0].Company_Name.replace("股份有限公司", ""));
      $("#Business_Accounting_NO").append("統一編號："+res[0].Business_Accounting_NO);
      $("#Company_Setup_Date").append("核准設立日期："+res[0].Company_Setup_Date);
      $("#Capital_Stock_Amount").append("資本額："+tranNumber(res[0].Capital_Stock_Amount), 2);
      $("#Paid_In_Capital_Amount").append("實收資本額"+tranNumber(res[0].Paid_In_Capital_Amount, 2));
      $("#Responsible_Name").append("董事長："+res[0].Responsible_Name);
      $("#Company_Location").append("公司地址："+res[0].Company_Location);
      $("#Company_Status_Desc").append("公司狀態："+res[0].Company_Status_Desc);
      $("#Change_Of_Approval_Data").append("最後核准變更日期："+res[0].Change_Of_Approval_Data);
      $("#Register_Organization_Desc").append("登記機關："+res[0].Register_Organization_Desc);
      $("#issued_shares").append("授權股數：10萬股");
      $("#address").append("擁有人位置：0xF07BF077D1a05b55e850d62B118216c957c42A99");
    },
    error: err => { // 失敗的話執行...
      alert("失敗");
    },



  });
  // var data =await contract_reAccount(IFNFT_contract);
  // console.log(data);
  // alert("成功");
});







function tranNumber(num, point) {
  // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
  let numStr = num.toString().split('.')[0]
  if (numStr.length < 6) { // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
    console.log(numStr);
    return numStr;
  } else if (numStr.length >= 6 && numStr.length <= 8) { // 如果数字大于6位,小于8位,让其数字后面加单位万
    let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
    console.log(decimal);
    // 由千位,百位组成的一个数字
    return parseFloat(parseInt(num / 10000) + '.' + decimal) + '萬'
  } else if (numStr.length > 8) { // 如果数字大于8位,让其数字后面加单位亿
    let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
    console.log(decimal);
    return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '億'
  }
}



