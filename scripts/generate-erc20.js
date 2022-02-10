const { schema } = require("@uniswap/token-lists");
// const quickswapTokenlist = require("../src/erc20/quickswap-default-token-list.json");
const Ajv = require("ajv");
// const metadata = require("../src/erc20/contract-metadata.json");
const { EthereumAddress } = require("wallet.ts");
const Mainnet = require("../src/erc20/mainnet.json");
// const Ropsten = require("../src/erc20/ropsten.json");
// const Rinkeby = require("../src/erc20/rinkeby.json");
// const Optimistic = require("../src/erc20/optimistic.json");
// const Fuse = require("../src/erc20/fuse.json");
// const Bsc = require("../src/erc20/bsc.json");
// const Chapel = require("../src/erc20/chapel.json");
// const xDai = require("../src/erc20/xdai.json");
// const Fantom = require("../src/erc20/fantom.json");
// const Celo = require("../src/erc20/celo.json");
// const Matic = require("../src/erc20/matic.json");
// const Arbiturm = require("../src/erc20/arbiturm.json");
// const Mumbai = require("../src/erc20/mumbai.json");
// const Aurora = require("../src/erc20/aurora.json");
// const Avalanche = require("../src/erc20/avalanche.json");
// const Boba = require("../src/erc20/boba.json");
const { fetchDebankLogoURI } = require("./fetch-debank-logo-uri");
const { addChainId, generateTokenList } = require("./shared");

const getMatamaskLogoURI = () =>
  `https://is3-ssl.mzstatic.com/image/thumb/Purple114/v4/a7/15/d4/a715d477-bb8e-9e1f-38c5-ea28fdb8e36b/source/256x256bb.jpg`;

const chainId = Number.parseInt(process.argv.slice(2)[0]);

const chainIdToTokensMapping = {
  1: [Mainnet],
};

const getUntreatedTokens = async () => {
  const baseTokens =
    chainId === 0 
      ? Object.entries(chainIdToTokensMapping)
          .map(([key, value]) => {
            return value.map((x) => addChainId(x, Number.parseInt(key)));
          })
          .flat()
          .flat()
      : chainIdToTokensMapping[chainId]
          .map((x) => addChainId(x, chainId))
          .flat();

  const debankTokens = await fetchDebankLogoURI(
    chainId,
    baseTokens.map((x) => x.address)
  );

  return baseTokens.map((token) => {
    const { logo, ...rest } = token;
    const tokenWithLogoURI = debankTokens.find(
      (x) => x.address.toLowerCase() === token.address.toLowerCase()
    );
    const logoURI =
      tokenWithLogoURI?.logoURI ||
      (logo && getMatamaskLogoURI()) ||
      token.logoURI;

    return logoURI ? { ...rest, logoURI } : { ...rest };
  });
};

const start = async () => {
  const tokens = await getUntreatedTokens();
  const SybilTokenList = generateTokenList(
    tokens
      .map((x) => ({
        ...x,
        address: EthereumAddress.checksumAddress(x.address),
      }))
      .sort((a, z) => {
        if (a.name > z.name) return 1;
        if (a.name < z.name) return -1;
        return 0;
      }),
    {
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
    }
  );

  const ajv = new Ajv();
  schema.definitions.TokenInfo.properties.symbol.pattern =
    "^[a-zA-Z0-9+\\-%/\\$\\.]+$";
  const validate = ajv.compile(schema);
  if (validate(SybilTokenList)) {
    process.stdout.write(JSON.stringify(SybilTokenList));
  } else {
    console.error("errors on build erc20:");
    console.error(validate.errors);
    process.exit(1);
  }
};

start();
