export type AttributionResult = {
  schemaId: number;
  codes: string[];
  codeRegistryChainId?: number;
  codeRegistryAddress?: string;
};

export function parseERC8021Suffix(data: Uint8Array): AttributionResult | null {
  const ercSuffix = new Uint8Array([
    0x80, 0x21, 0x80, 0x21, 0x80, 0x21, 0x80, 0x21,
  ]); // 16 bytes
  if (data.length < ercSuffix.length + 1) return null;
  const suffix = data.slice(-ercSuffix.length);
  if (!arraysEqual(suffix, ercSuffix)) return null;
  const schemaId = data[data.length - ercSuffix.length - 1];
  const schemaData = data.slice(0, data.length - ercSuffix.length - 1);
  switch (schemaId) {
    case 0:
      return parseSchema0(schemaData);
    case 1:
      return parseSchema1(schemaData);
    default:
      return null;
  }
}

function parseSchema0(data: Uint8Array): AttributionResult {
  if (data.length < 1) return { schemaId: 0, codes: [] };
  const codesLength = data[0];
  const codesBytes = data.slice(1, 1 + codesLength);
  const codesStr = new TextDecoder().decode(codesBytes);
  const codes = codesStr.split(',');
  return { schemaId: 0, codes };
}

function parseSchema1(data: Uint8Array): AttributionResult {
  if (data.length < 2) return { schemaId: 1, codes: [] };
  const codesLength = data[0];
  const codesBytes = data.slice(1, 1 + codesLength);
  const codesStr = new TextDecoder().decode(codesBytes);
  const codes = codesStr.split(',');
  const chainIdLen = data[1 + codesLength];
  const chainIdBytes = data.slice(2 + codesLength, 2 + codesLength + chainIdLen);
  const chainId = Number(new TextDecoder().decode(chainIdBytes));
  const addressBytes = data.slice(2 + codesLength + chainIdLen);
  const address = '0x' + Buffer.from(addressBytes).toString('hex');
  return {
    schemaId: 1,
    codes,
    codeRegistryChainId: chainId,
    codeRegistryAddress: address,
  };
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
