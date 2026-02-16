
export interface DecodedAction {
  type: string;
  data: any;
  humanReadable: string;
}

export function decodeAction(action: any): DecodedAction {
  // Check for enum type from @near-js/transactions
  const actionType = typeof action.enum === 'string' ? action.enum : Object.keys(action)[0];
  const actionData = action[actionType] || action;

  switch (actionType) {
    case 'CreateAccount':
      return {
        type: 'CreateAccount',
        data: {},
        humanReadable: 'Create new account'
      };
    case 'DeployContract':
      return {
        type: 'DeployContract',
        data: { codeHash: actionData.code ? '...' : undefined },
        humanReadable: 'Deploy smart contract'
      };
    case 'FunctionCall':
      const args = actionData.args ? Buffer.from(actionData.args).toString('utf8') : '{}';
      let parsedArgs = args;
      try {
        parsedArgs = JSON.parse(args);
      } catch (e) {}

      return {
        type: 'FunctionCall',
        data: {
          methodName: actionData.methodName,
          args: parsedArgs,
          deposit: actionData.deposit.toString(),
          gas: actionData.gas.toString()
        },
        humanReadable: `Call method ${actionData.methodName} with ${actionData.deposit} NEAR deposit`
      };
    case 'Transfer':
      return {
        type: 'Transfer',
        data: { deposit: actionData.deposit.toString() },
        humanReadable: `Transfer ${actionData.deposit} NEAR`
      };
    case 'Stake':
      return {
        type: 'Stake',
        data: { stake: actionData.stake.toString(), publicKey: actionData.publicKey.toString() },
        humanReadable: `Stake ${actionData.stake} NEAR with public key ${actionData.publicKey}`
      };
    case 'AddKey':
      return {
        type: 'AddKey',
        data: { publicKey: actionData.publicKey.toString() },
        humanReadable: `Add access key ${actionData.publicKey}`
      };
    case 'DeleteKey':
      return {
        type: 'DeleteKey',
        data: { publicKey: actionData.publicKey.toString() },
        humanReadable: `Delete access key ${actionData.publicKey}`
      };
    case 'DeleteAccount':
      return {
        type: 'DeleteAccount',
        data: { beneficiaryId: actionData.beneficiaryId },
        humanReadable: `Delete account and transfer remaining balance to ${actionData.beneficiaryId}`
      };
    default:
      return {
        type: 'Unknown',
        data: actionData,
        humanReadable: `Unknown action: ${actionType}`
      };
  }
}
