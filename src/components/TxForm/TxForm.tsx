import React, { useCallback, useState } from "react";
import ReactJson, { InteractionProps } from "react-json-view";
import "./style.scss";
import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { toNano } from "@ton/core";

// 在此示例中，我们使用预定义的智能合约状态初始化 (`stateInit`)
// 与“EchoContract”交互。该合约旨在将价值发送回发送者，
// 作为测试工具，防止用户意外花钱
const defaultTx: SendTransactionRequest = {
  // The transaction is valid for 10 minutes from now, in unix epoch seconds.
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [
    {
      // 收件人地址。
      address: "0QCSES0TZYqcVkgoguhIb8iMEo4cvaEwmIrU5qbQgnN8fo2A",
      // 以 nanoTON 形式发送的金额。例如，0.005 TON 等于 5000000 nanoTON
      amount: toNano("0.005").toString(),
      // （可选）boc base64 格式的状态初始化
      stateInit:
        "te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==",
      // （可选）boc base64 格式的有效负载.
      payload: "SGVsbG8gV29ybGQgfn5+",
    },

    // 取消注释以下消息以在一个事务中发送两条消息
    /*
    {
      // 注意：发送到该地址的资金将不会退还给发送者。
      address: 'UQAuz15H1ZHrZ_psVrAra7HealMIVeFq0wguqlmFno1f3B-m',
      amount: toNano('0.01').toString(),
    }
    */
  ],
};

export function TxForm() {
  const [tx, setTx] = useState(defaultTx);

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
