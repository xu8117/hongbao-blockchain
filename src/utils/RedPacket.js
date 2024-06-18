export class Token {
  #address;
  #symbol;
  #decimals;

  constructor(address, symbol, decimals) {
    this.#address = address;
    this.#symbol = symbol;
    this.#decimals = decimals;
  }

  get address() {
    return this.#address;
  }

  get symbol() {
    return this.#symbol;
  }

  get decimals() {
    return this.#decimals;
  }
}

export class RedPacket {
  chain;
  id;

  // properties for contract storage:
  passcodeHash; // passcode hash of red packet
  amount; // amount of token
  amountLeft; // mutable: balance of token
  creator; // creator address
  token; // token address
  condition; // condition contract address
  total; // total number of address
  totalLeft; // mutable: current number of address that can withdraw
  bonusType; // 0=identical, 1=random

  symbol = "";
  decimals = NaN;

  // private:
  #rpParams = {};
  #sig;
  #sigValid = false;
  #preview = false;

  constructor(chain, id, creator, token, amount, total, bonusType) {
    this.chain = chain;
    this.id = id;
    this.creator = creator;
    this.token = token;
    this.amount = amount;
    this.total = total;
    this.bonusType = bonusType;
  }

  constructor() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    this.chain = parseInt(urlSearchParams.get("chain"));
    this.id = parseInt(urlSearchParams.get("id"));
    // verify signature of rpXxx params:
    for (let [k, v] of urlSearchParams) {
      if (k.startsWith("rp")) {
        console.log(k, "=", v);
        this.#rpParams[k] = v;
      } else if (k === "sig") {
        this.#sig = v;
      } else if (k == "preview") {
        this.#preview = v === "true";
      }
    }
  }

  setRedPacketInfo(rp) {
    this.passcodeHash = rp[0]; // BN
    this.amount = rp[1]; // BN
    this.amountLeft = rp[2]; // BN
    this.creator = rp[3]; // address
    this.token = rp[4]; // address
    this.condition = rp[5]; // address
    this.total = rp[6]; // int
    this.totalLeft = rp[7]; // int
    this.bonusType = rp[8]; // int
  }

  get redPacketAddress() {
    return "0xFe6667986f58F2F7ed1e7C17Cee3951d8ABb717f";
  }

  get redPacketABI() {
    return '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"redPacketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"total","type":"uint32"},{"indexed":false,"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"redPacketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"bonus","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bonusLeft","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"totalLeft","type":"uint32"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"},{"internalType":"uint256","name":"passcodeHash","type":"uint256"},{"internalType":"address","name":"condition","type":"address"}],"name":"create","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getRedPacket","outputs":[{"components":[{"internalType":"uint256","name":"passcodeHash","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"amountLeft","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"condition","type":"address"},{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"uint32","name":"totalLeft","type":"uint32"},{"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"}],"internalType":"struct RedPacket.RedPacketInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"addr","type":"address"}],"name":"isOpened","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256[]","name":"proof","type":"uint256[]"}],"name":"open","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"},{"internalType":"uint256[2]","name":"input","type":"uint256[2]"}],"name":"verifyProof","outputs":[{"internalType":"bool","name":"r","type":"bool"}],"stateMutability":"view","type":"function"}]';
  }

  get createTopic() {
    return "0xf526b6d6ff0fac13f7e16aeea0f08bc8f0789c188dc429de0ea4b56bc06e82c6";
  }

  get withdrawTopic() {
    return "0x98ae10cde2519298a29f9d069abdf1971fa4cceb70f49a01994333fe70c7cf10";
  }

  get conditionABI() {
    return '[{"inputs":[{"internalType":"address","name":"redpacketContract","type":"address"},{"internalType":"uint256","name":"redpacketId","type":"uint256"},{"internalType":"address","name":"operator","type":"address"}],"name":"check","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]';
  }

  get erc20ABI() {
    return '[{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';
  }

  getRpParamsMessageForSign() {
    let params = ["chain=" + this.chain, "id=" + this.id];
    for (let k in this.#rpParams) {
      if (k.startsWith("rp")) {
        params.push(k + "=" + this.#rpParams[k]);
      }
    }
    params.sort();
    return params.join("&");
  }

  verifyParams() {
    if (!this.#sig) {
      console.log("skip verify params for no sig found.");
    } else {
      console.log("verify params with address: " + this.creator);
      try {
        let message = this.getRpParamsMessageForSign();
        console.log("verifyParams: message = " + message);
        let recoveredAddress = ethers.utils.verifyMessage(message, this.#sig);
        console.log("verifyParams: recovered = " + recoveredAddress);
        this.#sigValid =
            recoveredAddress.toLowerCase() === this.creator.toLowerCase();
        console.log("verify: " + this.#sigValid);
        if (!this.#sigValid) {
          throw "invalid parameter sig";
        }
      } catch (err) {
        console.error("failed verify params signature.", err);
      }
    }
  }

  get preview() {
    return this.#preview;
  }

  getRpCreator(creatorAddress) {
    return this.getRpParam("rpCreator", this.abbrAddress(creatorAddress));
  }

  getRpGreeting() {
    return this.getRpParam("rpGreeting");
  }

  getRpCoverImage() {
    return this.getRpParam("rpCoverImage");
  }

  getRpBgImage() {
    return this.getRpParam("rpBgImage");
  }

  getRpOpenImage() {
    return this.getRpParam("rpOpenImage");
  }

  getRpIconImage() {
    return this.getRpParam("rpIconImage");
  }

  getRpDisplayOpenInfo(display = true) {
    let p = this.getRpParam("rpDisplayOpenInfo");
    if (p === undefined || p === null) {
      return display;
    }
    return p !== "false";
  }

  getRpParams() {
    return this.#rpParams;
  }

  getRpParam(k, defaultValue) {
    if (this.#sigValid || this.preview) {
      let v = this.#rpParams[k];
      if (v === undefined || v === null) {
        return defaultValue;
      }
      return v;
    }
    return defaultValue;
  }

  #BN_1K = ethers.utils.parseUnits("1000", 0);
  #BN_1M = ethers.utils.parseUnits("1000000", 0);
  #BN_1B = ethers.utils.parseUnits("1000000000", 0);

  #intBN(bn, decimals) {
    for (let i = 0; i < decimals; i++) {
      bn = bn.div(10);
    }
    return bn;
  }

  abbrBN(bn, decimals, precision = 5) {
    if (this.#intBN(bn, decimals).lt(this.#BN_1K)) {
      let s = ethers.utils.formatUnits(bn, decimals);
      return s.substr(0, 6);
    }
    bn = bn.div(1000);
    if (this.#intBN(bn, decimals).lt(this.#BN_1K)) {
      let s = ethers.utils.formatUnits(bn, decimals);
      return s.substr(0, 6) + "K";
    }
    bn = bn.div(1000);
    if (this.#intBN(bn, decimals).lt(this.#BN_1K)) {
      let s = ethers.utils.formatUnits(bn, decimals);
      return s.substr(0, 6) + "M";
    }
    bn = bn.div(1000);
    if (this.#intBN(bn, decimals).lt(this.#BN_1K)) {
      let s = ethers.utils.formatUnits(bn, decimals);
      return s.substr(0, 6) + "B";
    }
    bn = bn.div(1000);
    let s = ethers.utils.formatUnits(bn, decimals);
    let n = s.indexOf(".");
    if (n < 0) {
      return s + "T";
    }
    return s.substring(0, n) + "T";
  }

  abbrAddress(address, chars = 4) {
    let addr = ethers.utils.getAddress(address);
    return (
        addr.substring(0, chars + 2) + "..." + addr.substring(addr.length - chars)
    );
  }
}
