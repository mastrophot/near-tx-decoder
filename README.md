# near-tx-decoder

Decode NEAR transactions into human-readable format.

## Features

- **Action Decoding:** Supports all 8 NEAR action types (Transfer, FunctionCall, etc.).
- **Human Readable:** Provides clear explanations of what each action does.
- **ABI Registry:** Extensible system to support custom contract ABIs for even better descriptions.
- **UI Ready:** Data structures optimized for display in explorers or wallets.

## Installation

```bash
npm install near-tx-decoder
```

## Usage

```typescript
import { decodeAction } from "near-tx-decoder";

const action = {
  Transfer: { deposit: "1000000000000000000000000" },
};

const decoded = decodeAction(action);
console.log(decoded.humanReadable); // "Transfer 1 NEAR"
```

### Using ABIs

```typescript
import { defaultRegistry, decodeAction } from "near-tx-decoder";

defaultRegistry.register({
  contractId: "my-app.near",
  methods: {
    buy: { description: "Bought {item_id}" },
  },
});

const action = {
  FunctionCall: {
    methodName: "buy",
    args: Buffer.from(JSON.stringify({ item_id: "sword" })),
  },
};
const decoded = decodeAction(action, "my-app.near");
console.log(decoded.humanReadable); // "Bought sword"
```

## License

MIT
