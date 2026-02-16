export interface ABIDefinition {
  contractId: string;
  methods: {
    [methodName: string]: {
      description?: string;
      args?: any;
    }
  };
}

export class ABIRegistry {
  private registry: Map<string, ABIDefinition> = new Map();

  register(abi: ABIDefinition) {
    this.registry.set(abi.contractId, abi);
  }

  get(contractId: string): ABIDefinition | undefined {
    return this.registry.get(contractId);
  }

  decodeWithABI(contractId: string, methodName: string, args: any): string | null {
    const abi = this.get(contractId);
    if (abi && abi.methods[methodName]) {
      const method = abi.methods[methodName];
      if (method.description) {
        return method.description.replace(/\{(\w+)\}/g, (_, key) => args[key] || `{${key}}`);
      }
    }
    return null;
  }
}

export const defaultRegistry = new ABIRegistry();

// Register some common ones if needed
defaultRegistry.register({
  contractId: 'wrap.near',
  methods: {
    'near_deposit': { description: 'Deposit NEAR to wrap it' },
    'near_withdraw': { description: 'Withdraw NEAR to unwrap it' }
  }
});
