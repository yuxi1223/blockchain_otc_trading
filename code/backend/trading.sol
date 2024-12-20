/*
//主題: 台北科技大學資訊與財金管理系-專題
//鏈端編譯者: 蘇昱覡
//目的: 提供未上市上櫃公司股票交易平台
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract UNOTC{
//EVENT事件
    event merchandise(bool _check,string _symbol,address indexed _BuyAccount,address indexed _SellAccount ,uint _quantity,uint _prices,uint time); //傳出交易訊息log[公司統一編號/買方/賣方/數量/價格]
    event showCOLTDData(string _symbol,uint time); //傳出目前待審核的公司log4[統一編號] 列表
    event showcheck(bool _check,string _symbol,uint time);//經濟部商業司審核結果log5-1[結果/統一編號] 列表
    event showdeletebuy(bool _check,uint time);//刪除掛單的結果log6-1[結果]
    event showdeletesell(bool _check,uint time);//刪除掛單的結果log6-2[結果]
    event stockholder(string _symbol,address indexed _Account,uint _quantity,uint time);//股東名冊
    event modifyholder(string _symbol,address indexed _fromAccount,address indexed _toAccount,uint _quantity,uint time);//擁有的人改變
    event applydatalist(address indexed _person,string _idnumber,uint time); //身份驗證審核列表
    event applyshow(address indexed _person,bool _check,string _idnumber,uint time); //身份驗證審核結果列表
//EVENT事件
//資料
    //角色資格
    mapping(address =>uint)Role ; //帳號位置 => 公司記號(經濟部商業司:1 集保中心:2 公司:3) ]

    //公司審核狀態(經濟部商業司)
    enum Status{
        Nonce,  //尚未申請 
        Check,  //檢查中
        PASS,   //審核通過
        FALSE   //審核不通過
    }

    //股東名冊
    struct StockHolder{
        address Account;//投資人帳號        
        uint Stocks;//股數
    }
    mapping(string => mapping(address=> uint)) internal StockHolders ; //統一編號 => 股東 => 股數

    
    //投資人資料
    struct investor{
        string    coltdsSymbol;//投資人擁有的公司
    }
    mapping (address => investor[]) internal investors; //投資人帳號位置 => 投資人資料

    //身份驗證
    struct data{
        string idnumber; //身分證字號
        Status status; //審核狀態
    }
    mapping(address => data) internal Data; //投資人帳號位置 => 身份驗證


    //公司資料
    struct  COLTDData{
        address owner;      //公司帳號
        string name;        //名稱
        Status  status;     //審核狀態
        uint total;         //總股數
    }
    
    //帳號資料   
    address public MOEA;
    address public TPEX;
    mapping(string => COLTDData) internal COLTDs;    //統一編號 => 公司資料
    
    //掛買、掛賣資料
    struct Hang{
        address account; //掛單帳號位置
        uint quantity;//股數
        uint prices ;//價格
    }
    mapping (string => Hang[] ) internal hangBuy; //統一編號 => 買單資料
    mapping (string => Hang[] ) internal hangSell;//統一編號 => 賣單資料

    //確定掛買/賣股數總額用
    mapping(string => mapping(address=> uint)) internal hangerBuys ; //統一編號 => 股東 => 股數
    mapping(string => mapping(address=> uint)) internal hangerSells; //統一編號 => 股東 => 股數

    //集保中心與經濟部商業司
    constructor(address _moea, address _tpex){
        require(_moea!=_tpex); //兩者帳戶不能相同
        Role[_moea]=1; //設定經濟部商業司角色
        Role[_tpex]=2;//設定集保中心角色
        MOEA=_moea; //設定經濟部商業司
        TPEX=_tpex; //設定集保中心
    } 
//資料

//修飾子
    modifier onlypeople() {
        require(msg.sender != MOEA);
        require(msg.sender != TPEX);
        _;
    }
//修飾子

//角色
    function getRole() public view returns (uint rolenumber){
       return Role[msg.sender];
    }
//角色

//經濟部商業司&集保中心
    //MOEA-審核公司
    function examine(string memory _symbol,bool J2) public  {
        require(msg.sender==MOEA);//檢查是否為經濟部商業司
        require((COLTDs[_symbol].status == Status.Check),"Status is not a checked type.");//確認受檢查公司為檢察型態
        if(J2){//判斷是否通過
            COLTDs[_symbol].status = Status.PASS;//通過
            Role[msg.sender]=3; //設定該帳戶位置為公司資格
            emit showcheck(true,_symbol,block.timestamp);//透過log5發出結果
        }
        
        else{
            COLTDs[_symbol].status=Status.FALSE;//不通過
            modifyinvestor(_symbol,COLTDs[_symbol].owner);
            modifyStock(_symbol,COLTDs[_symbol].owner,0);
            COLTDs[_symbol].total=0;
            COLTDs[_symbol].name ="";
            emit showcheck(false,_symbol,block.timestamp);//透過log5發出結果 
        }
    }
    function exApplyData(address person,bool J2) public{
        require(msg.sender==MOEA);//檢查是否為經濟部商業司
        require((Data[person].status == Status.Check),"Status is not a checked type.");//確認受檢查公司為檢察型態
        if(J2){
            Data[person].status = Status.PASS;//通過
            emit applyshow(person,J2,Data[person].idnumber,block.timestamp);
        }
        else{
            Data[person].status = Status.FALSE;//不通過
            emit applyshow(person,J2,Data[person].idnumber,block.timestamp);
        }
        
    }
//銀行&集保中心

//申請人
    //申請
    function ApplyData(string memory _idnumber) onlypeople public {
        Data[msg.sender].idnumber=_idnumber; //身分證字號
        Data[msg.sender].status=Status.Check; //審核狀態檢查中
         emit applydatalist(msg.sender,_idnumber,block.timestamp);
       
    }
    function ShowData() public view returns (Status s){
        if(Data[msg.sender].status== Status.PASS){//判斷公司是否通過
            return Status.PASS;//通過
        }
        else if((Data[msg.sender].status== Status.FALSE)){
            return Status.FALSE;//不通過
        }
        else if((Data[msg.sender].status== Status.Check)){
            return Status.Check; //檢查中
        } 
        else{
            return Status.Nonce;//未申請
        }

    }




//申請人

//公司
    //公司申請
    function addCOLTDs( string memory _symbol, string memory _name, uint _total) onlypeople public {
        require(COLTDs[_symbol].status != Status.PASS  ,"You need to check the current applicant company type");//通過的公司不用再審核同樣的公司
        require(COLTDs[_symbol].status != Status.Check);//檢查中的公司不能再送一次
        COLTDs[_symbol].owner = msg.sender; //設定公司擁有人帳戶
        COLTDs[_symbol].name = _name;       //設定公司名稱
        COLTDs[_symbol].total = _total;//設定公司總發行量
        COLTDs[_symbol].status = Status.Check;
        createdStockHolders(_symbol, msg.sender, _total);//創建
        createdinvestor(_symbol, msg.sender);
        COLTDs[_symbol].status = Status.Check;//設定公司為預設"檢查中"
        emit showCOLTDData(_symbol,block.timestamp);//發出log4待審核公司      
    }
    //檢查指定公司審核是否通過-view
    function checkCOLTDs ( string memory _symbol) public view returns (bool J2 ){
        if(COLTDs[_symbol].status== Status.PASS){//判斷公司是否通過
            return true;//通過
        }
        else{
            return false;//不通過
        }
    }
//公司

//投資人
    //查詢當前擁有公司(限制擁有者)-view
    function searchinvestor()public view returns (investor[]  memory){
        return investors[msg.sender];//回傳目前擁有的公司
    }
//投資人


//共同-查詢
    //查詢指定公司資料
    function getCOLTDs( string memory _symbol) public view returns(address owner, string memory name, Status status, uint total) {
        return (COLTDs[_symbol].owner,COLTDs[_symbol].name,COLTDs[_symbol].status,COLTDs[_symbol].total);
    }

    //查詢指定股東的指定公司股數-view
    function searchStock(string  memory _symbol,address _Account ) public view returns(uint _quantity){
        return StockHolders[_symbol][ _Account];       
    }
    //內部功能4: 檢查股東
    function checkStockHolders(string memory _symbol,address _Account) public view returns(bool){
        if(StockHolders[_symbol][_Account]>0){
            return true;
        }
        else return false;
    }
    
//共同-查詢

// 查詢個人帳號
    function reAccount () public view returns(address _Account){
        return(msg.sender);
    }

//掛單
    //查詢個人 掛賣單的總數量
    function totalhangsell(string memory _symbol) public  view returns (uint q2num){
       return hangerSells[_symbol][msg.sender];////回傳全部掛單總數
    }
    //查詢個人 掛買單的總數量
    function totalhangbuy(string memory _symbol) public  view returns (uint q2num){
        return hangerBuys[_symbol][msg.sender];//回傳全部掛單總數
    }

    //查詢全部 買單-view
    function SearchBuy(string memory _symbol) public onlypeople view returns (Hang [] memory){
        return hangBuy[_symbol];//回傳全部掛買單
    }
    //查詢全部 賣單-view
    function SearchSell(string memory _symbol) public onlypeople view returns (Hang [] memory){
        return hangSell[_symbol];//回傳全部掛賣單
    } 

    //掛買
    function addHangBuy( string memory _symbol, uint _quantity ,uint _prices) onlypeople public{
        require(Data[msg.sender].status == Status.PASS);//檢查掛單者是否驗證通過
        require(_quantity!=0 && _prices!=0); //掛買金額不能為0
        require(checkCOLTDs(_symbol)); //檢查該股票是否為可交易公司
        hangerBuys[_symbol][msg.sender]+=_quantity; //記錄個人掛單
        uint x=0;
        if(hangBuy[_symbol].length !=0){
            for(uint i=0;i<=hangBuy[_symbol].length-1;i++){ //搜尋新增的賣單
                if(hangBuy[_symbol][i].account ==msg.sender){  //確認賣單擁有人
                    //判斷價格是否同樣
                    if(hangBuy[_symbol][i].prices==_prices ){ 
                        hangBuy[_symbol][i].quantity+=_quantity;
                        x=1;
                    }
                }
            }
        }   
        if(x==0){
            hangBuy[_symbol].push();
            hangBuy[_symbol][ hangBuy[_symbol].length-1].account=msg.sender;//掛買單擁有人
            hangBuy[_symbol][ hangBuy[_symbol].length-1].quantity=_quantity;//掛買股數
            hangBuy[_symbol][ hangBuy[_symbol].length-1].prices=_prices;//掛買單價格         
        } 
    }

    //掛賣
    function addHangSell( string memory _symbol, uint _quantity,uint _prices) onlypeople public {
        require(Data[msg.sender].status == Status.PASS);//檢查掛單者是否驗證通過
        require(checkCOLTDs(_symbol)); //檢查該股票是否為可交易公司
        require(_quantity!=0 && _prices!=0);//掛賣單不能為0
        require(checkStockHolders(_symbol, msg.sender));//檢查是否有該公司股
        hangerSells[_symbol][msg.sender]+=_quantity;
        uint x =0;
        if(hangSell[_symbol].length !=0){
            for(uint i=0;i<=hangSell[_symbol].length-1;i++){ //搜尋新增的賣單
                if(hangSell[_symbol][i].account ==msg.sender){  //確認賣單擁有人
                    if(hangSell[_symbol][i].prices==_prices ){ //判斷價格是否同樣
                        hangSell[_symbol][i].quantity+=_quantity;
                        x=1; 
                    }
                }   
            }
        }
        if(x==0){
            require(searchStock(_symbol,msg.sender)>=_quantity);//檢查掛單避免掛超過自己擁有的股票
            hangSell[_symbol].push();
            hangSell[_symbol][ hangSell[_symbol].length-1].account=msg.sender;//掛賣單擁有人
            hangSell[_symbol][ hangSell[_symbol].length-1].quantity=_quantity;//掛賣單股數
            hangSell[_symbol][ hangSell[_symbol].length-1].prices=_prices;//掛賣單金額
        }
    }
    //刪除買單
    function deleteBuy(string memory _symbol,uint _quantity,uint _prices ) public{
        require(hangBuy[_symbol].length>=0);
        deleteHangBuy(_symbol,msg.sender,_quantity,_prices);
       
    }

    //刪除賣單
    function deleteSell(string memory _symbol,uint _quantity,uint _prices) public {
        require(hangSell[_symbol].length>= 0);
        deleteHangSell(_symbol,msg.sender,_quantity,_prices);
    }
   
 
//掛單

//交易
    //買賣單
    function SellByIndex(string memory _symbol,address _SellAccount ,uint _quantity,uint _prices) onlypeople public{
        require(Data[msg.sender].status == Status.PASS);//檢查購買者是否驗證通過
        require(Data[_SellAccount].status == Status.PASS);//檢查販售者是否驗證通過
        if(hangSell[_symbol][searchhangbysellindex(_symbol, _prices,_SellAccount)].quantity >=_quantity){   //判斷購買數量未超過售出數量
            if(searchStock(_symbol,_SellAccount) != _quantity){//判斷購買數量是否等於售出者目前擁有全部的股票
                //購買數量不等於售出者擁有全部股票
                modifyStock(_symbol,_SellAccount,(searchStock(_symbol,_SellAccount) - _quantity));//透過內部功能3更改股東名冊-股數，將擁有者的賣掉的股數扣掉
                SellByTool(searchhangbysellindex(_symbol, _prices,_SellAccount),_symbol,_SellAccount,_quantity,_prices);
                           
            }
            else{//購買數量售出者擁有全部股票
                deleteStockHolders(_symbol,_SellAccount);//透過內部功能5刪除該股東股東名冊  //a
                modifyinvestor(_symbol,_SellAccount);//內部功能6刪除投資人擁有的公司統一編號 //b
                SellByTool(searchhangbysellindex(_symbol, _prices,_SellAccount),_symbol,_SellAccount,_quantity,_prices);
                        
            }
        }
        else {
            emit merchandise(false,_symbol,msg.sender,_SellAccount,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息-交易失敗
        } 
 
    }
    //賣買單
    function BuyByIndex(string memory _symbol,address _BuyAccount,uint _quantity,uint _prices) onlypeople public { 
        require(Data[_BuyAccount].status == Status.PASS);//檢查購買者是否驗證通過
        require(Data[msg.sender].status == Status.PASS);//檢查販售者是否驗證通過
        if(hangBuy[_symbol][searchhangbybuyindex(_symbol, _prices, _BuyAccount)].quantity >=_quantity){    //判斷是否買超過         
            if(searchStock(_symbol,msg.sender) !=_quantity){//判斷是否一次賣光個人擁有股票
                //尚未賣光個人擁有股票
                modifyStock(_symbol,msg.sender,(searchStock(_symbol,msg.sender)-_quantity));//透過內部功能3更改股東名冊-股數，將擁有者的售出的股數扣掉並更新股東名冊
                BuyByTool(searchhangbybuyindex(_symbol, _prices, _BuyAccount),_symbol,_BuyAccount,_quantity, _prices);
                        
            }
            else{//賣光個人擁有股票
                deleteStockHolders(_symbol,msg.sender);///透過內部功能5刪除該股東股東名冊
                modifyinvestor(_symbol,msg.sender);//內部功能6刪除擁有人目前擁有的公司統一編號
                BuyByTool(searchhangbybuyindex(_symbol, _prices, _BuyAccount),_symbol,_BuyAccount,_quantity, _prices); 
                                              
            }
        }   
        else {
            emit merchandise(false,_symbol,_BuyAccount,msg.sender,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息交易失敗
        }                  
    }
    //直接交易
    function Transaction (string memory _symbol,address _Account,uint _quantity, uint _prices) onlypeople public {
        require(Data[_Account].status == Status.PASS); //檢查購買者是否驗證通過
        require(checkCOLTDs(_symbol)); //檢查該股票是否為可交易公司)     
        //判斷擁有者股數是否足夠 or //判斷擁有股份扣掉目前已掛賣單股份是否足夠販賣
        if(hangSell[_symbol].length!=0){//判斷是否無賣單
            require(searchStock(_symbol,msg.sender)-totalhangsell(_symbol)>=_quantity);//判斷擁有股份扣掉目前已掛賣單股份是否足夠販賣
        }
        else{
            require(searchStock(_symbol,msg.sender)>=_quantity);//判斷擁有者股數是否足夠
        }
        if((searchStock(_symbol,msg.sender)-_quantity)>=0){//判斷擁有者是否賣光股份
            //尚未賣光股份
            TractionTool(_symbol,_Account,_quantity,_prices);
            modifyStock(_symbol,msg.sender,(searchStock(_symbol,msg.sender)-_quantity));
  
        }
        else{
            //賣光股份
            deleteStockHolders(_symbol,_Account);//內部功能5:刪除股東名冊
            modifyinvestor(_symbol,_Account);//內部功能6: 刪除投資人擁有的公司統一編號
            TractionTool(_symbol,_Account,_quantity,_prices);
        }      
    }
//交易

//交易內部工具
    function SellByTool(uint i,string memory _symbol,address _SellAccount ,uint _quantity,uint _prices) internal{
        if(checkStockHolders(_symbol,msg.sender)){ //透過內部功能4:檢查股東，判斷購買人是否擁有股東資格           
            modifyStock(_symbol,msg.sender,(searchStock(_symbol,msg.sender) + _quantity));//透過內部功能3更改股東名冊-股數，將購買者購買的股數紀錄至股東名冊中
            emit modifyholder(_symbol,_SellAccount,msg.sender, _quantity,block.timestamp);//log股東名冊變動事件
        }
        else{
            createdStockHolders(_symbol,msg.sender, _quantity);//透過內部功能1創建股東名冊及投資人資料
            createdinvestor(_symbol,msg.sender);
        }
                        
        if((hangSell[_symbol][i].quantity - _quantity)!=0){     //判斷賣單是否被買光
            //沒被買光
            hangerSells[_symbol][_SellAccount]-=_quantity;//修改賣家掛單狀況
            hangSell[_symbol][i].quantity=(hangSell[_symbol][i].quantity) - _quantity; //修改指定賣單股數
            emit merchandise(true,_symbol,msg.sender,_SellAccount,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
 
        }
        else{ //被買光
            deleteHangSell(_symbol,_SellAccount,_quantity, _prices); //刪除售光的賣單 //D
            emit merchandise(true,_symbol,msg.sender,_SellAccount,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
        }
    }
 
    function BuyByTool(uint i,string memory _symbol,address  _BuyAccount ,uint _quantity,uint _prices) internal {
        if(checkStockHolders(_symbol,_BuyAccount)){ ////透過內部功能4:檢查股東，判斷欲購買人是否擁有股東資格
            modifyStock(_symbol,_BuyAccount,(searchStock(_symbol,_BuyAccount) + _quantity));//透過內部功能3更改股東名冊-股數，將欲購買者購買的股數紀錄至股東名冊中
            emit modifyholder(_symbol,msg.sender,_BuyAccount, _quantity,block.timestamp);//log股東名冊變動事件
        }
        else{
            createdStockHolders(_symbol,_BuyAccount,_quantity);//透過內部功能1創建股東名冊及投資人資料
            createdinvestor(_symbol,_BuyAccount);
        }
        if((hangBuy[_symbol][i].quantity - _quantity)!=0){ //判斷買單是否被賣光
             //買單尚未賣光
            hangerBuys[_symbol][_BuyAccount]-=_quantity;//修改買家掛單狀況
            hangBuy[_symbol][i].quantity=(hangBuy[_symbol][i].quantity) - _quantity; //更改掛賣單數量
            emit merchandise(true,_symbol,_BuyAccount,msg.sender,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
        }
        else{ //買單售完
            deleteHangBuy(_symbol,_BuyAccount, _quantity, _prices);
            emit merchandise(true,_symbol,_BuyAccount,msg.sender,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
        }   
    }


    function TractionTool(string memory _symbol,address _Account,uint _quantity, uint _prices)  internal {
        if(checkStockHolders(_symbol,_Account)){//判斷購買者是否擁有股東資格
        //擁有該公司股東資格           
            modifyStock(_symbol,_Account,searchStock(_symbol,_Account)+_quantity);//內部功能3:更改股東名冊-股數，變更購買者股份
            emit merchandise(true,_symbol,_Account,msg.sender,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
            emit modifyholder(_symbol,msg.sender,_Account, _quantity,block.timestamp);//log股東名冊變動事件
            
        }
        else{
        //無該公司股東資格
            createdStockHolders(_symbol,_Account,_quantity);//內部功能1:創建股東名冊及投資人資料
            createdinvestor(_symbol,_Account);
            emit merchandise(true,_symbol,_Account,msg.sender,_quantity,_prices,block.timestamp);//LOG1-交易資料訊息
            emit modifyholder(_symbol,msg.sender,_Account, _quantity,block.timestamp);//log股東名冊變動事件
        } 
    }
//交易內部工具

//內部功能
//刪除買單(需調整)
    function deleteHangBuy(string memory _symbol,address _BuyAccount,uint _quantity,uint _prices ) internal{
        require(hangBuy[_symbol].length>=0);
        hangerBuys[_symbol][_BuyAccount]-=_quantity;     
        hangBuy[_symbol][searchhangbybuyindex(_symbol, _prices, _BuyAccount)] = hangBuy[_symbol][ hangBuy[_symbol].length-1]; //刪除指定的買單
        hangBuy[_symbol].pop();
        emit showdeletebuy(true,block.timestamp); //log5-1 刪除成功
    }

    //刪除賣單(需調整)
    function deleteHangSell(string memory _symbol,address _SellAccount,uint _quantity,uint _prices) internal {
        require(hangSell[_symbol].length>= 0);
        hangerSells[_symbol][_SellAccount]-=_quantity;          
        hangSell[_symbol][searchhangbysellindex(_symbol, _prices, _SellAccount)]=hangSell[_symbol][hangSell[_symbol].length-1]; //刪除指定的賣單
        hangSell[_symbol].pop();
        emit showdeletesell(true,block.timestamp);//log5-2 刪除成功 
    }

    //內部功能0:創建投資人資料
    function createdinvestor(string memory _symbol,address _human )internal{
        investors [_human].push();//設定投資人資料
        investors [_human][investors [_human].length-1].coltdsSymbol=_symbol;
    }
    //內部功能1:創建股東名冊及投資人資料
    function createdStockHolders(string memory _symbol, address  _Account ,uint _quantity) internal{
        StockHolders[_symbol][_Account]=_quantity;//新增股東/擁有股數進入名冊
        emit stockholder(_symbol,_Account,_quantity,block.timestamp);
        
    }
    //內部功能3:更改股東名冊-股數
    function modifyStock (string memory _symbol,address  _Account, uint  _quantity) internal  {
        StockHolders[_symbol][_Account]=_quantity;
    }

    //內部功能5:刪除股東名冊
    function deleteStockHolders(string  memory _symbol,address  _Account) internal  {
        StockHolders[_symbol][_Account]=0;
    }
    //內部功能6: 刪除投資人擁有的公司統一編號
    function modifyinvestor(string memory _symbol ,address _human) internal {
        uint i = searchinvestorindex(_symbol,_human);
        investors[_human][i]=investors[_human][investors [_human].length-1];//將最後一個資料覆蓋至刪除公司統一編沆
        investors[_human].pop();//刪除最後一個 
            
    }
    //內部功能6-1:
    function searchinvestorindex(string  memory _symbol,address _human)internal view returns(uint _i){
        for(uint i=0;i<=investors[_human].length-1;i++){//尋找指定投資人
           if(keccak256(abi.encodePacked(investors [_human][i].coltdsSymbol ))==keccak256(abi.encodePacked(_symbol))){//判斷指定刪除公司統一編號
                return i;
            } 
        }  
    }
    //內部功能7-1
    function searchhangbysellindex(string memory _symbol, uint _prices ,address _account) internal view returns(uint I){
        for(uint i=0;i<=hangSell[_symbol].length-1;i++){ //搜尋新增的賣單
            if(hangSell[_symbol][i].account ==_account){  //確認賣單擁有人
                if(hangSell[_symbol][i].prices==_prices ){ //判斷價格是否同樣
                    return i;  
                }
            }
        }
    }
    //內部功能7-2
    function searchhangbybuyindex(string memory _symbol, uint _prices ,address _account) internal view returns(uint256 I){
        for(uint i=0;i<=hangBuy[_symbol].length-1;i++){ //搜尋新增的賣單
            if(hangBuy[_symbol][i].account ==_account){  //確認賣單擁有人
                if(hangBuy[_symbol][i].prices==_prices ){ //判斷價格是否同樣
                    return i;
                }
            }
        }
    }

}