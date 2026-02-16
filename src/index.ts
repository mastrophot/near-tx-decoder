import { decodeAction, DecodedAction } from './decoder';
import { ABIRegistry, defaultRegistry } from './registry';

export class TransactionDecoder {
  constructor(private registry: ABIRegistry = defaultRegistry) {}

  decodeActions(actions: any[], contractId?: string): DecodedAction[] {
    return actions.map(action => {
      const decoded = decodeAction(action);
      
      if (decoded.type === 'FunctionCall' && contractId) {
        const enhancedDescription = this.registry.decodeWithABI(
          contractId, 
          decoded.data.methodName, 
          decoded.data.args
        );
        if (enhancedDescription) {
          decoded.humanReadable = enhancedDescription;
        }
      }
      
      return decoded;
    });
  }
}

export * from './decoder';
export * from './registry';
