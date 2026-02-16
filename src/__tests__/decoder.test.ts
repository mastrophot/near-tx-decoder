import { decodeAction } from '../decoder';
import { TransactionDecoder } from '../index';
import { ABIRegistry } from '../registry';

describe('NEAR Transaction Decoding', () => {
  test('decode Transfer action', () => {
    const action = {
      Transfer: {
        deposit: '1000000000000000000000000' // 1 NEAR
      }
    };
    const decoded = decodeAction(action);
    expect(decoded.type).toBe('Transfer');
    expect(decoded.humanReadable).toContain('Transfer 1000000000000000000000000 NEAR');
  });

  test('decode FunctionCall action', () => {
    const action = {
      FunctionCall: {
        methodName: 'say_hello',
        args: Buffer.from(JSON.stringify({ name: 'Alice' })),
        deposit: '0',
        gas: '30000000000000'
      }
    };
    const decoded = decodeAction(action);
    expect(decoded.type).toBe('FunctionCall');
    expect(decoded.data.methodName).toBe('say_hello');
    expect(decoded.data.args.name).toBe('Alice');
  });

  test('TransactionDecoder with ABI registry', () => {
    const registry = new ABIRegistry();
    registry.register({
      contractId: 'greeting.near',
      methods: {
        'set_greeting': { description: 'Change greeting to {message}' }
      }
    });

    const decoder = new TransactionDecoder(registry);
    const actions = [{
      FunctionCall: {
        methodName: 'set_greeting',
        args: Buffer.from(JSON.stringify({ message: 'Hi!' })),
        deposit: '0',
        gas: '30000000000000'
      }
    }];

    const decoded = decoder.decodeActions(actions, 'greeting.near');
    expect(decoded[0].humanReadable).toBe('Change greeting to Hi!');
  });
});
