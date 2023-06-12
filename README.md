# Matryoshka

This project was developed during Mantle/Encode Hackathon in June 2023.

"Matryoshka" means "russian doll" in russian. We used [Minifolio](https://github.com/ATO-nft/minifolio), which is an implementation of the [ERC-5560](https://eips.ethereum.org/EIPS/eip-5560) (aka redeemable NFTs) to store some value in an NFT. Minifolio allows you to store ETH, ERC-20 tokens, or another NFT. In our case, we store an ERC-20 called [gCFA](https://github.com/w3hc/gcfa-contracts): a crypto version of the CFA franc (a currency used in 16 countries in Africa). The CFA and gCFA is fully pegged to the euro. We also have deployed a DAO ([Gov](https://github.com/w3hc/gov)) to Mantle Testnet as a recovery address (required by gCFA).

- Live demo: [https://matryoshka.on.fleek.co/](https://matryoshka.on.fleek.co/)
- YouTube video:

## Contract addresses:

- Matryoshka NFT: [0xCC0C150605f20ce2F0Ade5333cD46eE69A198bb2](https://explorer.testnet.mantle.xyz/address/0xCC0C150605f20ce2F0Ade5333cD46eE69A198bb2)
- EURm: [0x0cF22fEb54DCdB343d085f8CCA74F4a71C2CFc4f](https://explorer.testnet.mantle.xyz/address/0x0cF22fEb54DCdB343d085f8CCA74F4a71C2CFc4f)
- gCFA: [0x0965410A9e0052BC49261Ca39307E502d7cD7e6A](https://explorer.testnet.mantle.xyz/address/0x0965410A9e0052BC49261Ca39307E502d7cD7e6A)
- DAO: [0x1712FA50bd0f29Bbd46c0a48b04FfE927100A4d1](https://explorer.testnet.mantle.xyz/address/0x1712FA50bd0f29Bbd46c0a48b04FfE927100A4d1)

## Install

```sh
npm i
```

## Run

```sh
npm run dev
```

## Contribute

- Task board: https://github.com/orgs/w3hc/projects/8/views/6

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discord.gg/bHKJV3NWUQ), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).

## License

[GPL-3.0](https://github.com/w3hc/w3hc-web/blob/main/LICENSE)
