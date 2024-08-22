import React, { useCallback, useState } from "react";
import ReactJson, { InteractionProps } from "react-json-view";
import "./style.scss";
import {
  CHAIN,
  SendTransactionRequest,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { beginCell, Cell, toNano } from "@ton/core";
import { useTonConnect } from "../../hooks/useTonConnect";

const transactionComment = (text: string) => {
  const cell = beginCell()
    .storeUint(0x00000000, 32)
    .storeStringTail(text)
    .endCell();

  const boc = cell.toBoc();
  return boc.toString("base64");
};

// 交易有效负载
// const payload = beginCell()
//   .storeUint(0x00000000, 32)
//   .storeStringTail("Hello, TON!")
//   .endCell()
//   .toBoc()
//   .toString("base64");

// 默认交易配置
const defaultTx: SendTransactionRequest = {
  // The transaction is valid for 10 minutes from now, in unix epoch seconds.
  validUntil: Math.floor(Date.now() / 1000) + 600,
  network: CHAIN.TESTNET,
  messages: [
    {
      // 收件人地址。
      address: "0QCSES0TZYqcVkgoguhIb8iMEo4cvaEwmIrU5qbQgnN8fo2A",
      // 以 nanoTON 形式发送的金额。例如，0.005 TON 等于 5000000 nanoTON
      amount: toNano("0.005").toString(),
      // （可选）boc base64 格式的有效负载.
      payload: transactionComment("Hello, TON!"),
    },
  ],
};
console.log("payload", transactionComment("Hello, TON!"));

export function TxForm() {
  const { sender, connected } = useTonConnect();
  const [tx, setTx] = useState(defaultTx);
  const userAddr = useTonAddress();

  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const onChange = useCallback((value: InteractionProps) => {
    setTx(value.updated_src as SendTransactionRequest);
  }, []);

  return (
    <div className="send-tx-form">
      <h3>Configure and send transaction</h3>

      <ReactJson
        theme="ocean"
        src={defaultTx}
        onEdit={onChange}
        onAdd={onChange}
        onDelete={onChange}
      />

      {wallet ? (
        <button onClick={() => tonConnectUi.sendTransaction(tx)}>
          Send transaction
        </button>
      ) : (
        <button onClick={() => tonConnectUi.openModal()}>
          Connect wallet to send the transaction
        </button>
      )}
    </div>
  );
}
