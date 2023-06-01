# Matryoshka contracts

Matryoshka contracts was forked from a projects called [Minifolio](https://github.com/w3hc/minifolio), which helps you create an NFT that can hold both a native currency (ETH) and ERC20s (e.g. wBTC). Only the current holder is allowed to redeem these assets.

Minifolio uses the [NFT redeem extension](https://github.com/ATO-nft/redeemable).

Matryoshka app allows users to deploy their own Matryoshka NFT.

## Install

```shell
npm i
```

## Test

```shell
npx hardhat test
```

## Deploy

```shell
npx hardhat run scripts/deploy.ts --network goerli
```