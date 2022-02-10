const package = require("../package.json");
/**
 * addChainId.
 *
 * @param {Array<object>} tokens
 * @param {1 | 3 | 4} chainId
 */
function addChainId(tokens, chainId) {
  return tokens.map((t) => ({
    chainId,
    ...t,
  }));
}

/**
 * generateTokenList.
 *
 * @param {Array<object>} specList
 * @param {Object} extraInfo
 */
function generateTokenList(specList, extraInfo) {
  const uniqueSet = new Set();
  return {
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
    ...extraInfo,
    timestamp: new Date().toISOString(),
    version: {
      major: Number.parseInt(package.version.split(".")[0]),
      minor: Number.parseInt(package.version.split(".")[1]),
      patch: Number.parseInt(package.version.split(".")[2]),
    },

    tokens: specList
      .filter((record) => {
        return (
          record.name.length <= 40 &&
          record.symbol.length <= 20 &&
          new RegExp("^[ \\w.'+\\-%/À-ÖØ-öø-ÿ]+$").test(record.name)
        );
      })
      .filter((x) => {
        const key = x.address.toLowerCase();
        if (uniqueSet.has(key)) return false;
        uniqueSet.add(key);
        return true;
      }),
  };
}

exports.addChainId = addChainId;
exports.generateTokenList = generateTokenList;
