async function sendTransaction({
  amount,
  comment,
  toAddress,
  contractAddress,
  gasFee,
  repeat = 10,
  interval = 60 * 1000,
}: {
  amount: string;
  comment: string;
  toAddress: string;
  contractAddress?: string;
  gasFee?: string;
  repeat?: number;
  interval?: number;
}) {
  if (tonConnectUI === undefined)
    throw new Error("wallet connect is not initialized");
  if (!comment || comment.length === 0) {
    comment = `${Date.now()}`;
  }
  const toRealAddress = await getContractAddress(toAddress);
  const realAddress = await getContractAddress(
    tonConnectUI?.wallet?.account?.address
  );
  const conRealAddress = await getContractAddress(realAddress, contractAddress);
  let payload = beginCell();
  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
  };
  if (contractAddress) {
    payload = payload
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)
      .storeCoins(toNano(amount))
      .storeAddress(toRealAddress)
      .storeAddress(realAddress)
      .storeUint(0, 1)
      .storeCoins(toNano(0.01))
      .storeUint(0, 1)
      .storeUint(0, 32)
      .storeStringTail(`${comment}`)
      .endCell()
      .toBoc()
      .toString("base64");
  } else {
    payload = payload
      .storeUint(0, 32)
      .storeStringTail(comment)
      .endCell()
      .toBoc()
      .toString("base64");
  }
  transaction.messages = [
    {
      address: conRealAddress.toString(),
      amount: toNano(contractAddress ? gasFee : amount).toString(),
      payload,
    },
  ];
  // 发送
  const ddd = tonConnectUI.sendTransaction(transaction);
  console.log("boc", JSON.stringify(ddd));

  // let transCount = 0
  // const c = await client()
  // const needOp = contractAddress ? 0x7362d09c.toString(16) : undefined
  // const fun = (tr) => {
  //   try {
  //     const slice = tr.inMessage.body.beginParse()
  //     if (needOp) {
  //       const cop = slice.loadUint(32).toString(16)
  //       if (cop !== needOp) {
  //         return false
  //       }
  //       slice.loadUint(64)
  //       slice.loadCoins()
  //       slice.loadAddress().toString()
  //       slice.loadBit()
  //       slice.loadUint(32).toString(16)
  //     } else {
  //       slice.loadUint(32)
  //     }
  //     const currentComment = slice.loadStringTail()
  //     return comment === currentComment
  //   } catch (e) {
  //     console.log(e)
  //     return false
  //   }
  // }
  // while (transCount++ < repeat) {
  //   const transactions = await c.getTransactions(Address.parse(toAddress), { limit: 10 })
  //   const tr = transactions.find(tr => fun(tr))
  //   if (tr) {
  //     return tr
  //   }
  //   await new Promise(resolve => setTimeout(resolve, interval))
  // }
  return null;
}
