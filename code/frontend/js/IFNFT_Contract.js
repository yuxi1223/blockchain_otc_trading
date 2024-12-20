//跳轉功能
async function contract_change(IFNFT_contract) {

    var data = await IFNFT_contract.methods.getRole().call();
    switch (data) {
        case '0':
            location.href = '近期掛買1.html';
            break;
        case '1':
            location.href = '經濟部商業司登入.html';
            break;
        case '2':
            location.href = '集保中心登入.html';
            break;
        case '3':
            location.href = '公司.html';
            break;
    }
}




//公司申請資料
async function contract_addCOLTDS(IFNFT_contract, _symbol, _name, _total) {
    try {
        var data = await IFNFT_contract.methods.addCOLTDs(_symbol, _name, _total).send({from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行註冊公司addCOLTDS成功");
        return data;
        
    } catch (error) {
        console.log("addCOLTDS");
        console.log(error);
        // alert("執行註冊公司addCOLTDS失敗");
    }
}
//掛買單
async function contract_addHangBuy(IFNFT_contract, _symbol, _quanitity, _prices){
    try {
        var data = await IFNFT_contract.methods.addHangBuy(_symbol, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行掛買單addHangBuy成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行掛買單addHangBuy失敗");
    }
}
//掛賣單
async function contract_addHangSell(IFNFT_contract, _symbol, _quanitity, _price) {
    try {
        var data = await IFNFT_contract.methods.addHangSell(_symbol, _quanitity, _price).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行掛賣單addHangSell成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行掛賣單addHangSell失敗");
    }
}
//買單資料
async function contract_BuyByIndex(IFNFT_contract, _symbol, _BuyAccount, _quanitity, _prices) {
    try {
        var data = await IFNFT_contract.methods.BuyByIndex(_symbol, _BuyAccount, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行買單交易BuyByIndex成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行買單交易BuyByIndex失敗");
    }
}
//刪買單 
async function contract_deleteBuy(IFNFT_contract, _symbol, _quanitity, _prices) {
    try {
        var data = await IFNFT_contract.methods.deleteBuy(_symbol, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行刪除買單deleteBuy成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行刪除買單deleteBuy失敗");
    }
}
//刪賣單
async function contract_deleteSell(IFNFT_contract, _symbol, _quanitity, _prices) {
    try {
        var data = await IFNFT_contract.methods.deleteSell(_symbol, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行刪除賣單deleteSell成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行刪除賣單deleteSell失敗");
    }
}
//公司審核
async function contract_examine(IFNFT_contract, _symbol, J2) {
    try {
        var data = await IFNFT_contract.methods.examine(_symbol, J2).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行審核公司examine成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行審核公司examine失敗");
    }
}
//賣單交易 
async function contract_SellByIndex(IFNFT_contract, _symbol, _SellAccount, _quanitity, _prices) {
    try {
        var data = await IFNFT_contract.methods.SellByIndex(_symbol, _SellAccount, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        // alert("執行賣單交易SellByIndex成功");
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行賣單交易SellByIndex失敗");
    }
}
//直接交易
async function contract_Transaction(IFNFT_contract, _symbol, _Account, _quanitity, _prices) {
    try {
        var data = await IFNFT_contract.methods.Transaction(_symbol, _Account, _quanitity, _prices).send({ from: web3.eth.defaultAccount, gas: 3000000 });
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行Transaction失敗");
    }
}
//檢查公司資格
async function contract_checkCOLTDs(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.checkCOLTDs(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行checkCOLTDs失敗");
    }
}
//檢查股票持有者
async function contract_checkStockHolders(IFNFT_contract, _symbol, _Account) {
    try {
        var data = await IFNFT_contract.methods.checkStockHolders(_symbol, _Account).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行checkStockHolders失敗");
    }
}

//看公司詳細資料
async function contract_getCOLTDs(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.getCOLTDs(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行getCOLTDs失敗");
    }
}
//查詢合約角色
async function contract_getRole(IFNFT_contract) {
    try {
        var data = await IFNFT_contract.methods.getRole().call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行getRole失敗");
    }
}
//網站(審核合約)
async function contract_MOEA(IFNFT_contract) {
    try {
        var data = await IFNFT_contract.methods.MOEA().call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行MOEA失敗");
    }
}

//查買單
async function contract_SearchBuy(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.SearchBuy(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行SearchBuy失敗");
    }
}

//查投資人
async function contract_searchinvestor(IFNFT_contract) {
    try {
        var data = await IFNFT_contract.methods.searchinvestor().call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行searchinvestor失敗");
    }
}
//查賣單
async function contract_SearchSell(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.SearchSell(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行SearchSell失敗");
    }
}
//查股票
async function contract_searchStock(IFNFT_contract, _symbol, _Account) {
    try {
        var data = await IFNFT_contract.methods.searchStock(_symbol, _Account).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行searchStock失敗");
    }
}



//總掛買(該帳戶)
async function contract_totalhangbuy(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.totalhangbuy(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行totalhangbuy失敗");
    }
}
//總掛賣(該帳戶) 
async function contract_totalhangsell(IFNFT_contract, _symbol) {
    try {
        var data = await IFNFT_contract.methods.totalhangsell(_symbol).call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行totalhangsell失敗");
    }
}

//集保中心
async function contract_TPEX(IFNFT_contract) {
    try {
        var data = await IFNFT_contract.methods.TPEX().call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行TPEX失敗");
    }
}


//查詢帳號
async function contract_reAccount(IFNFT_contract) {
    try {
        var data = await IFNFT_contract.methods.reAccount().call();
        return data;
    } catch (error) {
        console.log(error);
        // alert("執行reAccount失敗");
    }
}








