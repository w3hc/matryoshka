import { Heading, Button, useToast } from '@chakra-ui/react'
import { Head } from '../components/layout/Head'
// import Image from 'next/image'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../lib/consts'
import useSound from 'use-sound' // https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'

export default function Index() {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBal, setUserBal] = useState<string>('')
  const [txLink, setTxLink] = useState<string>('')

  const { data } = useFeeData()
  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: signer } = useSigner()
  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })
  const network = useNetwork()

  const [play, { stop, pause }] = useSound(stevie, {
    volume: 0.5,
  })

  const toast = useToast()

  const explorerUrl = network.chain?.blockExplorers?.default.url

  const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

  useEffect(() => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
  }, [bal?.formatted, bal?.symbol, address])

  const checkFees = () => {
    console.log('data?.formatted:', JSON.stringify(data?.formatted))
    return JSON.stringify(data?.formatted)
  }

  const mint = async () => {
    console.log('minting...')
    if (isDisconnected === true) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } else {
      try {
        setLoading(true)
        const call = await nft.safeMint()
        const nftReceipt = await call.wait(1)
        console.log('tx:', nftReceipt)
        setTxLink(explorerUrl + '/tx/' + nftReceipt.transactionHash)
        setLoading(false)
        play()
      } catch (e) {
        setLoading(false)
        console.log('error:', e)
      }
    }
  }

  return (
    <>
      <Head />

      <main>
        <Heading as="h2">Matryoshka</Heading>
        {isDisconnected ? (
          <>
            <br />
            <p>Please connect your wallet if you want to mint.</p>
          </>
        ) : (
          <>
            <br />

            <p>You&apos;re about to mint 1 NFT on Ethereum Goerli Testnet.</p>
            <br />
            <p>
              You&apos;re connected to <strong>Mantle Testnet</strong> and your wallet currently holds
              <strong> {userBal}</strong>.
            </p>
            {/* You can go ahead and click on the &apos;Mint&apos; button below: you will be invited to sign your
              transaction.{' '} */}
          </>
        )}
        <br />
        <LinkComponent href="./gfca">
          {/* <Button colorScheme="green" variant="outline"> */}
          Get some gCFA
          {/* </Button> */}
        </LinkComponent>{' '}
        {/* {!loading ? (
          !txLink ? (
            <Button colorScheme="green" variant="outline" onClick={mint}>
              Mint
            </Button>
          ) : (
            <Button disabled colorScheme="green" variant="outline" onClick={mint}>
              Mint
            </Button>
          )
        ) : (
          <Button isLoading colorScheme="green" loadingText="Minting" variant="outline">
            Mint
          </Button>
        )} */}
        {txLink && (
          <>
            <br />
            <br />
            <p>Done! You can view your transaction on Etherscan:</p>
            <br />
          </>
        )}
        <br />
        <br />
        {txLink && (
          <Button colorScheme="red" variant="outline" onClick={() => stop()}>
            Stop the music
          </Button>
        )}
        {/* <Image height="800" width="800" alt="contract-image" src="/thistle-contract-feb-15-2023.png" /> */}
      </main>
    </>
  )
}
