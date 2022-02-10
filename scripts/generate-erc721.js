const { schema } = require("@uniswap/token-lists");
const Ajv = require("ajv");
const NFTMainnet = require("../src/erc721/mainnet.json");
const { addChainId, generateTokenList } = require("./shared");

const NFTSybilTokenList = generateTokenList([...addChainId(NFTMainnet, 1)], {
  name: "Sybil",
  logoURI:
  "https://is3-ssl.mzstatic.com/image/thumb/Purple114/v4/a7/15/d4/a715d477-bb8e-9e1f-38c5-ea28fdb8e36b/source/256x256bb.jpg",
  keywords: [
    "sybil token list",
    "web3",
    "spam list",
    "block list",
    "cryptography",
    "gundb",
    "privacy protection",
    "ownyourdata",
    "social network",
    "blockchain",
    "crypto",
    "sybil",
    "codingsh",
  ],
  timestamp: new Date().toISOString(),
});

const ajv = new Ajv();
const validate = ajv.compile(schema);
if (validate(NFTSybilTokenList)) {
  process.stdout.write(JSON.stringify(NFTSybilTokenList));
} else {
  console.error("errors on build erc721:");
  console.error(validate.errors);
  process.exit(1);
}
