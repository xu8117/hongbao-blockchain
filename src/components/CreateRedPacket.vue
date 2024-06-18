<script>
import { chains } from "@/assets/js/chains";
import { ethers } from "ethers";

export default {
  data() {
    return {
      account: null,
      chainId: 0,
      tokenType: "ETH",
      tokenAddress: "",
      tokenAmount: "1.0",
      total: 7,
      bonusType: "0", // 0=Identical, 1=Random
      password: "",
      conditionAddress: "",
      BLOCKCHAINS: chains.BLOCKCHAINS,
      ETH_ADDRESS: chains.ETH_ADDRESS,
      ZERO_ADDRESS: chains.ZERO_ADDRESS,
      mainnets: [],
      testnets: [],
      RED_PACKET_ADDR: "0xFe6667986f58F2F7ed1e7C17Cee3951d8ABb717f",
      RED_PACKET_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"redPacketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"total","type":"uint32"},{"indexed":false,"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"redPacketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"bonus","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bonusLeft","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"totalLeft","type":"uint32"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"},{"internalType":"uint256","name":"passcodeHash","type":"uint256"},{"internalType":"address","name":"condition","type":"address"}],"name":"create","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getRedPacket","outputs":[{"components":[{"internalType":"uint256","name":"passcodeHash","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"amountLeft","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"condition","type":"address"},{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"uint32","name":"totalLeft","type":"uint32"},{"internalType":"enum RedPacket.BonusType","name":"bonusType","type":"uint8"}],"internalType":"struct RedPacket.RedPacketInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"addr","type":"address"}],"name":"isOpened","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256[]","name":"proof","type":"uint256[]"}],"name":"open","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"},{"internalType":"uint256[2]","name":"input","type":"uint256[2]"}],"name":"verifyProof","outputs":[{"internalType":"bool","name":"r","type":"bool"}],"stateMutability":"view","type":"function"}]',
      CONDITION_ABI:
        '[{"inputs":[{"internalType":"address","name":"redpacketContract","type":"address"},{"internalType":"uint256","name":"redpacketId","type":"uint256"},{"internalType":"address","name":"operator","type":"address"}],"name":"check","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]',
      ERC20_ABI:
        '[{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
      CREATE_TOPIC:
        "0xf526b6d6ff0fac13f7e16aeea0f08bc8f0789c188dc429de0ea4b56bc06e82c6",
    };
  },
  computed: {
    nativeToken() {
      let c = this.BLOCKCHAINS[this.chainId];
      if (c) {
        return c.native;
      }
      return "ETH";
    },
    popularTokens() {
      let c = this.BLOCKCHAINS[this.chainId];
      if (c) {
        let ts = [];
        for (let t of c.tokens) {
          if (ts.length < 10 && t.address !== this.ETH_ADDRESS) {
            ts.push(t);
          }
        }
        return ts;
      }
      return [];
    },
    ready() {
      return this.account && this.chainId > 0;
    },
    networkName() {
      if (this.account) {
        let c = this.BLOCKCHAINS[this.chainId];
        if (c) {
          return c.name;
        }
        return "Unsupported Chain (0x" + this.chainId.toString(16) + ")";
      }
      return "Not connected";
    },
    wrongNetwork() {
      return this.account && !this.BLOCKCHAINS[this.chainId];
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let mainnets = [],
        testnets = [];
      for (let chainId in this.BLOCKCHAINS) {
        let chain = this.BLOCKCHAINS[chainId];
        if (chain.testnet) {
          testnets.push(chain);
        } else {
          mainnets.push(chain);
        }
      }
      mainnets.sort((c1, c2) => c1.id - c2.id);
      testnets.sort((c1, c2) => c1.id - c2.id);
      this.mainnets = mainnets;
      this.testnets = testnets;
    },
    keccak(str) {
      let arr = new TextEncoder().encode(str);
      return ethers.utils.keccak256(arr);
    },

    async prove(addrBN, secretBN) {
      return await snarkjs.groth16.fullProve(
        {
          addr: addrBN.toString(),
          secret: secretBN.toString(),
        },
        "passcode_js/passcode.wasm",
        "passcode_js/passcode_0001.zkey",
      );
    },

    toBN(s, decimals) {
      try {
        return ethers.utils.parseUnits(s.trim(), decimals);
      } catch (e) {
        return null;
      }
    },

    isValidBN(s, decimals) {
      let bn = toBN(s, decimals);
      return bn !== null && !bn.isZero() && !bn.isNegative();
    },

    isValidAddress(s) {
      try {
        ethers.utils.getAddress(s);
        return true;
      } catch (e) {
        return false;
      }
    },
    getWeb3Provider() {
      if (!window.web3Provider) {
        if (!window.ethereum) {
          console.error("there is no web3 provider.");
          return null;
        }
        window.web3Provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any",
        );
      }
      return window.web3Provider;
    },

    showAlert(title, message) {
      /*let m = $("#alertModal");
      m.find(".x-title").text(title);
      m.find(".x-message").text(message);
      let myModal = new bootstrap.Modal(m.get(0), {
        backdrop: "static",
        keyboard: false,
      });
      myModal.show();*/
    },

    showInfo(title, message) {
      /*let m = $("#infoModal");
      m.find(".x-title").text(title);
      if (message.startsWith("<")) {
        m.find(".x-message").html(message);
      } else {
        m.find(".x-message").text(message);
      }
      let myModal = new bootstrap.Modal(m.get(0), {
        backdrop: "static",
        keyboard: false,
      });
      myModal.show();*/
    },

    showLoading(title, message) {
      /*let m = $("#loadingModal");
      let myModal = new bootstrap.Modal(m.get(0), {
        backdrop: "static",
        keyboard: false,
      });
      let obj = {
        setTitle: (t) => {
          m.find(".x-title").text(t);
        },
        setMessage: (t) => {
          m.find(".x-message").text(t);
        },
        close: () => {
          setTimeout(() => {
            myModal.hide();
          }, 500);
        },
      };
      obj.setTitle(title);
      obj.setMessage(message);
      myModal.show();
      return obj;*/
    },

    translateError(err) {
      window.err = err;
      if (typeof err === "string") {
        return err;
      }
      /*if (err.error && err.error.code && err.error.message) {
        return `Error (${err.error.code}): ${err.error.message}`;
      }
      if (err.code && err.message) {
        return `Error (${err.code}): ${err.message}`;
      }*/
      return err.message || err.toString();
    },
    setPopularToken(t) {
      this.tokenAddress = t.address;
    },
    async createRedPacket() {
      // check:
      let chainId = this.chainId,
        tokenAddress,
        tokenAmount,
        decimals,
        total,
        bonusType,
        password,
        account,
        passcode,
        passcodeHash,
        conditionAddress = this.ZERO_ADDR,
        value,
        redPacketId = 0;
      if (!this.ready) {
        return showAlert("Error", "Please connect to wallet first!");
      }
      if (this.wrongNetwork) {
        return showAlert("Error", "The connected network is not supported!");
      }
      // important: account must be lowercase:
      account = this.account.toLowerCase();
      if (this.tokenType === "ETH") {
        tokenAddress = this.ETH_ADDRESS;
        decimals = 18;
      } else {
        if (!isValidAddress(this.tokenAddress)) {
          return showAlert("Error", "Token address is invalid!");
        }
        tokenAddress = this.tokenAddress;
        let loading1 = showLoading(
            "Get ERC Token",
            "Get ERC token information...",
          ),
          erc1 = new ethers.Contract(
            tokenAddress,
            this.ERC20_ABI,
            this.getWeb3Provider().getSigner(),
          );
        try {
          decimals = await erc1.decimals();
          loading1.close();
          console.log(
            "got erc " +
              tokenAddress +
              " decimals = " +
              decimals +
              " type = " +
              typeof decimals,
          );
        } catch (err) {
          loading1.close();
          return showAlert(
            "Error",
            "Failed to get decimals of token: " + translateError(err),
          );
        }
      }
      // check tokenAmount:
      if (!isValidBN(this.tokenAmount, decimals)) {
        return showAlert("Error", "Bonus amount is invalid!");
      }
      tokenAmount = toBN(this.tokenAmount, decimals);
      total = parseInt(this.total);
      if (isNaN(total) || total < 0 || total > 100000) {
        return showAlert("Error", "Max perticipates is invalid!");
      }
      bonusType = parseInt(this.bonusType);
      // check password:
      password = this.password.trim();
      if (password === "") {
        return showAlert("Error", "Password must be set!");
      }
      // check condition:
      if (this.conditionAddress.trim() !== "") {
        if (!isValidAddress(this.conditionAddress)) {
          return showAlert("Error", "Validator address is invalid!");
        }
        conditionAddress = this.conditionAddress;
        let loading2 = showLoading(
            "Check Validator",
            "Check validator contract...",
          ),
          cc = new ethers.Contract(
            conditionAddress,
            this.CONDITION_ABI,
            this.getWeb3Provider().getSigner(),
          );
        try {
          await cc.check(this.RED_PACKET_ADDR, 1, account);
          loading2.close();
        } catch (err) {
          loading2.close();
          return showAlert(
            "Error",
            "Failed to check validator contract: " + translateError(err),
          );
        }
      }

      // now generate password hash:
      passcode = ethers.BigNumber.from(keccak(account + password));
      let { proof, publicSignals } = await prove(
        ethers.BigNumber.from("0"),
        passcode,
      );
      console.log(publicSignals);
      passcodeHash = ethers.BigNumber.from(publicSignals[0]);
      console.log(
        "keccak(" + (account + password) + ") = " + passcode.toHexString(),
      );
      console.log("passcode hash = ", passcodeHash.toHexString());

      let loading = showLoading("Create", "Check balance..."),
        redPacket = new ethers.Contract(
          this.RED_PACKET_ADDR,
          this.RED_PACKET_ABI,
          this.getWeb3Provider().getSigner(),
        );
      try {
        if (tokenAddress === this.ETH_ADDRESS) {
          let eth_balance = await this.getWeb3Provider().getBalance(account);
          if (eth_balance.lt(tokenAmount)) {
            throw "You don't have enough " + this.nativeToken + ".";
          }
        } else {
          let erc = new ethers.Contract(
              tokenAddress,
              this.ERC20_ABI,
              this.getWeb3Provider().getSigner(),
            ),
            erc_symbol = await erc.symbol(),
            erc_balance = await erc.balanceOf(account);
          if (erc_balance.lt(tokenAmount)) {
            throw "You don't have enough " + erc_symbol + ".";
          }
          console.log("check allowance...");
          loading.setMessage("Check allowance...");
          let erc_allowance = await erc.allowance(
            account,
            this.RED_PACKET_ADDR,
          );
          console.log("allowance = " + erc_allowance);
          if (erc_allowance.lt(tokenAmount)) {
            console.log("must increase allowance.");
            loading.setMessage(
              "Please approve the Red Packet contract to spend your " +
                erc_symbol +
                " in MetaMask...",
            );
            let tx_approve = await erc.approve(
              this.RED_PACKET_ADDR,
              ethers.utils.parseUnits("1000000000000000000", 18),
            );
            loading.setMessage("Please wait for blockchain confirmation...");
            await tx_approve.wait(1);
          }
        }
        loading.setMessage("Please sign transaction in MetaMask...");
        value = tokenAddress === this.ETH_ADDRESS ? tokenAmount : 0;
        console.log(
          "tokenAddress = " +
            tokenAddress +
            "\n" +
            "tokenAmount = " +
            tokenAmount +
            ", type = " +
            typeof tokenAmount +
            "\n" +
            "total = " +
            total +
            "\n" +
            "bonusType = " +
            bonusType +
            "\n" +
            "passcodeHash = " +
            passcodeHash +
            "\n" +
            "conditionAddress = " +
            conditionAddress +
            "\n" +
            "value = " +
            value,
        );
        let tx = await redPacket.create(
          tokenAddress,
          tokenAmount,
          total,
          bonusType,
          passcodeHash,
          conditionAddress,
          {
            value: value,
          },
        );
        loading.setMessage("Please wait for blockchain confirmation...");
        await tx.wait(1);
        loading.setMessage("Get transaction logs...");
        // get red packet id from log:
        let receipt = await getWeb3Provider().getTransactionReceipt(tx.hash);
        let logs = receipt.logs;
        for (let i = 0; i < logs.length; i++) {
          let log = logs[i];
          if (log.topics && log.topics[0] === this.CREATE_TOPIC) {
            redPacketId = parseInt(log.data.substring(0, 66), 16);
            console.log("red packet id: " + redPacketId);
            break;
          }
        }
        loading.close();
        let url =
          location.protocol +
          "//" +
          location.host +
          "/rp.html?chain=" +
          chainId +
          "&id=" +
          redPacketId;
        showInfo(
          "Success",
          "<p>Red packet created successfully!</p><p>Password: " +
            password +
            '</p><p>You can share this red packet:</p><p><a target="_blank" href="' +
            url +
            '">' +
            url +
            ' <i class="bi bi-box-arrow-up-right"></i></a></p>',
        );
      } catch (err) {
        loading.close();
        return showAlert("Error", translateError(err));
      }
    },
    abbrAddress(addr) {
      if (!addr) {
        return "";
      }
      let s = addr.toString();
      if (s.indexOf("0x") === 0 && s.length === 42) {
        let addr = ethers.utils.getAddress(s.substring(0));
        return addr.substring(0, 6) + "..." + addr.substring(38);
      }
      return s;
    },
    tokenUrl(addr) {
      let c = this.BLOCKCHAINS[this.chainId];
      if (c) {
        return c.scan + "/token/" + addr;
      } else {
        return "#1";
      }
    },
    gotoScanUrl() {
      let c = this.BLOCKCHAINS[this.chainId];
      if (c) {
        window.open(c.scan + "/address/" + this.account);
      } else {
        console.error("Invalid chain id: ", this.chainId);
      }
    },
    displayBN(bn, decimals) {
      let BN100 = ethers.utils.parseUnits("100", 0),
        B = ethers.utils.parseUnits("1000000000", decimals),
        M = ethers.utils.parseUnits("1000000", decimals),
        K = ethers.utils.parseUnits("1000", decimals);
      if (bn.gte(B)) {
        return ethers.utils.formatUnits(bn.mul(BN100).div(B), 2) + " B";
      }
      if (bn.gte(M)) {
        return ethers.utils.formatUnits(bn.mul(BN100).div(M), 2) + " M";
      }
      if (bn.gte(K)) {
        return ethers.utils.formatUnits(bn.mul(BN100).div(K), 2) + " K";
      }
      // ##.###
      let s = ethers.utils.formatUnits(bn, decimals),
        n = s.indexOf("."),
        pad;
      if (n === -1) {
        return s + ".000";
      }
      pad = 3 - (s.length - n - 1);
      if (pad > 0) {
        return s + "0".repeat(3 - (s.length - n - 1));
      }
      return s.substring(0, n + 4);
    },
    formatBN(bn, decimals) {
      let s = ethers.utils.formatUnits(bn, decimals),
        n = s.indexOf(".");
      if (n == -1) {
        s = s + "." + "0".repeat(decimals);
      } else {
        s = s + "0".repeat(decimals - (s.length - n - 1));
      }
      return s;
    },
    accountChanged(accounts) {
      console.log(
        "wallet account changed:",
        accounts.length === 0 ? null : accounts[0],
      );
      if (accounts.length === 0) {
        this.disconnected();
      } else {
        this.account = accounts[0];
        document.cookie = "__account__=" + this.account + ";max-age=1296000";
      }
    },
    async disconnected() {
      console.warn("wallet disconnected.");
      this.account = null;
    },
    chainChanged(chainId) {
      console.log(
        "wallet chainId changed: " + chainId + " = " + parseInt(chainId, 16),
      );
      this.chainId = parseInt(chainId, 16);
    },
    async connectWallet() {
      console.log("try connect wallet...");
      if (this.getWeb3Provider() === null) {
        console.error("there is no web3 provider.");
        return false;
      }
      console.log("enter 2");
      try {
        this.accountChanged(
          await window.ethereum.request({
            method: "eth_requestAccounts",
          }),
        );
        this.chainChanged(
          await window.ethereum.request({
            method: "eth_chainId",
          }),
        );
        window.ethereum.on("disconnect", this.disconnected);
        window.ethereum.on("accountsChanged", this.accountChanged);
        window.ethereum.on("chainChanged", this.chainChanged);
      } catch (e) {
        console.error("could not get a wallet connection.", e);
        return false;
      }
      console.log("wallet connected.");
      return true;
    },
  },
};
</script>

<template>
  <div>
    <!-- Loading Modal -->
    <div
      id="loadingModal"
      aria-hidden="true"
      aria-labelledby="loadingLabel"
      class="modal fade"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header align-items-center d-flex">
            <h4 id="loadingLabel" class="modal-title x-title">&nbsp;</h4>
          </div>
          <div class="modal-body">
            <div class="float-start">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="ms-5 ps-4 float-none">
              <p class="x-message">&nbsp;</p>
            </div>
          </div>
          <!-- <div class="modal-footer">
              <button class="btn btn-outline-primary" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
          </div> -->
        </div>
      </div>
    </div>
    <!-- Alert Modal -->
    <div
      id="alertModal"
      aria-hidden="true"
      aria-labelledby="alertLabel"
      class="modal fade"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header align-items-center d-flex">
            <h4 id="alertLabel" class="modal-title x-title">&nbsp;</h4>
            <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
            >
              <span aria-hidden="true"><i class="fe fe-x-circle"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="float-start">
              <i class="fs-2 text-danger fe fe-alert-triangle"></i>
            </div>
            <div class="ms-5 ps-4 float-none">
              <p class="x-message">&nbsp;</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              aria-label="Close"
              class="btn btn-outline-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Modal -->
    <div
      id="infoModal"
      aria-hidden="true"
      aria-labelledby="infoLabel"
      class="modal fade"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header align-items-center d-flex">
            <h4 id="infoLabel" class="modal-title x-title">&nbsp;</h4>
            <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
            >
              <span aria-hidden="true"><i class="fe fe-x-circle"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="float-start">
              <i class="fs-2 fe fe-info"></i>
            </div>
            <div class="ms-5 ps-4 float-none">
              <p class="x-message">&nbsp;</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              aria-label="Close"
              class="btn btn-outline-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="vm" class="container">
      <nav
        class="navbar navbar-expand-lg navbar-light bg-light border-bottom"
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 99"
      >
        <div class="container">
          <a class="navbar-brand" href="#0"
            ><i class="bi bi-envelope-paper"></i> Red Packet</a
          >
          <ul class="mr-2 navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="list.html">
                <i class="bi bi-list-ul"></i>
                Explore
              </a>
            </li>
          </ul>
          <ul
            id="wallet"
            class="mr-2 navbar-nav navbar-right-wrap"
            style="flex-direction: row !important"
          >
            <li class="nav-item">
              <span class="nav-link"
                ><i class="bi bi-globe"></i> <span v-text="networkName"></span
              ></span>
            </li>
            <li v-if="account === null" class="nav-item">
              <button
                class="btn btn-primary"
                type="button"
                v-on:click="connectWallet"
              >
                Connect Wallet
              </button>
            </li>
            <li v-if="account !== null" class="nav-item">
              <a class="nav-link" href="#0" v-on:click="gotoScanUrl"
                ><i class="bi bi-wallet"></i>
                <span v-text="abbrAddress(account)"></span>
                <i class="fe fe-external-link"></i
              ></a>
            </li>
            <li v-if="wrongNetwork" class="ms-2 d-inline-block">
              <span class="nav-link"
                >Unsupported chain (<span v-text="chainId"></span>)</span
              >
            </li>
          </ul>
        </div>
      </nav>

      <div style="padding-top: 80px">
        <div class="row">
          <div class="col">
            <div class="x-border">
              <h5>Introduction</h5>
              <p>
                The Red Packet is an Ethereum contract that support distribute
                bonus with lucky. A lucky guy who want to get the bonus must
                know the password that is set by creator. It uses zk-proof to
                make all things safe. Supported chains:
              </p>
              <p id="mainnetList">
                <a
                  v-for="(chain, idx) in mainnets"
                  :href="'chain.scan/address/' + RED_PACKET_ADDR"
                  class="me-4l"
                  target="_blank"
                >
                  {{ chain.name }}
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </p>
              <p id="testnetList">
                <a
                  v-for="(chain, idx) in testnets"
                  :href="'chain.scan/address/' + RED_PACKET_ADDR"
                  class="me-4l"
                  target="_blank"
                >
                  {{ chain.name }}
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </p>
              <p>
                Make sure you have tested on testnet before use the mainnet.
                (e.g. test with
                <a
                  href="https://blockscan.com/address/0xBBB02DE94E1Dd1E99b43458027f31aBb2d75659B"
                  target="_blank"
                  >tWBTC <i class="bi bi-box-arrow-up-right"></i
                ></a>
                ,
                <a
                  href="https://blockscan.com/address/0xEEE0C84193E02E67164b9b4402e47ef9CffA5b09"
                  target="_blank"
                  >tWETH <i class="bi bi-box-arrow-up-right"></i
                ></a>
                ,
                <a
                  href="https://blockscan.com/address/0xDDD076E315e288a7146E8c8612a57Baae4Df21C7"
                  target="_blank"
                  >tUSD <i class="bi bi-box-arrow-up-right"></i
                ></a>
                . Use faucet() to get test token.)
              </p>
            </div>
          </div>
        </div>

        <!-- create red packet -->
        <div class="row mt-4">
          <div class="col">
            <div class="container" style="width: 480px">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Create a Red Packet</h5>
                  <hr />
                  <form onsubmit="return false">
                    <div class="mb-3">
                      <label class="form-label">Bonus:</label>
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            v-model="tokenType"
                            class="form-check-input"
                            name="tokenType"
                            type="radio"
                            value="ETH"
                          />
                          <span v-text="nativeToken"></span>
                        </label>
                      </div>
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            v-model="tokenType"
                            class="form-check-input"
                            name="tokenType"
                            type="radio"
                            value="ERC"
                          />
                          ERC20
                        </label>
                      </div>
                    </div>
                    <div class="mb-3 ms-4">
                      <label class="form-label" for="bonus-token"
                        >Token Address:</label
                      >
                      <div class="input-group">
                        <input
                          id="bonus-token"
                          v-model="tokenAddress"
                          class="form-control"
                          maxlength="42"
                          placeholder="0x"
                          type="text"
                          v-bind:disabled="tokenType === 'ETH'"
                        />
                        <button
                          class="btn btn-outline-secondary dropdown-toggle"
                          data-bs-toggle="dropdown"
                          type="button"
                          v-bind:disabled="tokenType === 'ETH'"
                        >
                          <i class="bi bi-coin"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li v-for="token in popularTokens">
                            <button
                              class="dropdown-item"
                              type="button"
                              v-on:click="setPopularToken(token)"
                            >
                              <img
                                :src="token.icon"
                                style="
                                  width: 16px;
                                  height: 16px;
                                  margin-top: -2px;
                                  margin-right: 10px;
                                "
                              />
                              <span v-text="token.symbol"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div class="form-text">The token you want to sent.</div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="bonus-amount"
                        >Bonus Amount:</label
                      >
                      <input
                        id="bonus-amount"
                        v-model="tokenAmount"
                        class="form-control"
                        maxlength="42"
                        type="text"
                      />
                      <div class="form-text">
                        The amount of bonus you want to sent.
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="bonus-amount"
                        >Max Participates:</label
                      >
                      <input
                        id="bonus-amount"
                        v-model:number="total"
                        class="form-control"
                        max="100000"
                        min="1"
                        type="number"
                      />
                      <div class="form-text">
                        The max participates who can get the bonus.
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Bonus Mode:</label>
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            id="bonus-type-identical"
                            v-model="bonusType"
                            class="form-check-input"
                            name="bonusType"
                            type="radio"
                            value="0"
                          />
                          Identical for Each
                        </label>
                      </div>
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            id="bonus-type-random"
                            v-model="bonusType"
                            class="form-check-input"
                            name="bonusType"
                            type="radio"
                            value="1"
                          />
                          Random for Each
                        </label>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="bonus-password"
                        >Password:</label
                      >
                      <input
                        id="bonus-password"
                        v-model="password"
                        class="form-control"
                        maxlength="100"
                        placeholder="e.g. Bitcoin is awesome!"
                        type="text"
                      />
                      <div class="form-text">
                        The case-sensitive password to open the red packet.
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="condition-address"
                        >Validator Address:</label
                      >
                      <input
                        id="condition-address"
                        v-model="conditionAddress"
                        class="form-control"
                        maxlength="42"
                        placeholder="0x"
                        type="text"
                      />
                      <div class="form-text">
                        You can specify a validator contract, or just leave it
                        blank.
                      </div>
                      <div class="form-text">
                        <a
                          href="https://github.com/michaelliao/red-packet-contract/blob/master/docs/validator.md"
                          target="_blank"
                        >
                          What is validator?</a
                        >
                      </div>
                    </div>
                    <div class="mb-2 text-center">
                      <button
                        class="btn btn-primary ps-5 pe-5"
                        type="button"
                        v-on:click="createRedPacket"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="p-5 mt-5 bg-light border-top">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="mb-4">
              <i class="bi bi-envelope-paper"></i> Red Packet, copyleft 2023
            </div>
            <ul class="list-unstyled small text-muted">
              <li class="mb-2">
                Designed and built by
                <a href="https://github.com/michaelliao" target="_blank"
                  >Michael Liao <i class="bi bi-box-arrow-up-right"></i></a
                >.
              </li>
              <li class="mb-2">
                Check the source code on
                <a
                  href="https://github.com/michaelliao/red-packet-contract"
                  target="_blank"
                  >Github <i class="bi bi-box-arrow-up-right"></i
                ></a>
              </li>
              <li class="mb-2">
                Code licensed
                <a
                  href="https://github.com/michaelliao/red-packet-contract/blob/master/LICENSE"
                  target="_blank"
                  >GPLv3 <i class="bi bi-box-arrow-up-right"></i
                ></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.x-border {
  border: 1px solid #ced4da;
  border-left: 0.25rem solid #5bc0de;
  border-radius: 0.25rem;
  padding: 1rem;
}

a {
  text-decoration: none;
}
</style>
