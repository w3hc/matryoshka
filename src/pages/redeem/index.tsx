import { Heading, Button, useToast, Text } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { LinkComponent } from '../../components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../lib/consts'
import useSound from 'use-sound' // https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'
import { GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI } from '../../lib/consts'

export default function Redeem() {
  const { data: signer } = useSigner()

  const cfa = new ethers.Contract(GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI, signer)

  const [loading, setLoading] = useState<boolean>(false)
  const [userBal, setUserBal] = useState<string>('')
  const [txLink, setTxLink] = useState<string>('')
  const [cfaBal, setCfaBal] = useState<number>(0)
  const [matryoshkaBalance, setMatryoshkaBalance] = useState<number>(0)

  const { data } = useFeeData()
  const { address, isConnecting, isDisconnected } = useAccount()

  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })
  const network = useNetwork()

  // const [play, { stop, pause }] = useSound(stevie, {
  //   volume: 0.5,
  // })

  const toast = useToast()

  const explorerUrl = network.chain?.blockExplorers?.default.url

  const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

  const getBalances = async () => {
    const y = await nft.balanceOf(address)
    setMatryoshkaBalance(Number(y / 10 ** 18))
    console.log('setMatryoshkaBalance:', Number(y / 10 ** 18))
    return Number(y / 10 ** 18)
  }

  useEffect(() => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
  }, [bal?.formatted, bal?.symbol, address])

  const checkFees = () => {
    console.log('data?.formatted:', JSON.stringify(data?.formatted))
    return JSON.stringify(data?.formatted)
  }

  const redeem = async () => {
    console.log('redeeming...')
    const supply = await nft.totalSupply()
    console.log('supply?.formatted:', Number(supply))
    const gcfaBalance = await getBalances()
    if (isDisconnected === true) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } else {
      const nftBalance = await nft.balanceOf(address)
      console.log('nftBalance:', nftBalance)
      if (nftBalance === 0) {
        toast({
          title: 'Unable to check NFT ownership',
          description: "It seems like you don't hold any Matryoshka NFT.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
        return
      }
      const isRedeemable = await nft.isRedeemable(supply)
      if (isRedeemable === false) {
        toast({
          title: 'Already redeemed',
          description: 'This NFT is not redeemable anymore.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
        return
      }
      try {
        setLoading(true)

        const redeemCall = await nft.redeem(supply)

        const redeemReceipt = await redeemCall.wait(1)
        console.log('tx:', redeemReceipt)
        toast({
          title: 'Successful redeem',
          description: 'You just redeemed your NFT and got 50k gCFA! 🎉',
          status: 'success',
          position: 'top',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })
        setTxLink(explorerUrl + '/tx/' + redeemReceipt.transactionHash)
        setLoading(false)
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
        <p>You can now redeem the 50k gCFA that are held in your Matryoshka NFT.</p>
        {isDisconnected ? (
          <>
            <br />
            <p>Please connect your wallet.</p>
          </>
        ) : (
          <></>
        )}
        <br />

        {!loading ? (
          <Button colorScheme="blue" variant="outline" onClick={redeem}>
            Redeem
          </Button>
        ) : (
          <Button isLoading colorScheme="blue" loadingText="Minting" variant="outline">
            Minting
          </Button>
        )}

        {txLink && (
          <>
            <br />
            <br />

            <p>Done! You can view your transaction on Etherscan:</p>
            <br />
            <Text fontSize="20px" color="#45a2f8">
              <LinkComponent target="blank" href={txLink}>
                <strong>{txLink}</strong>
              </LinkComponent>
            </Text>
            <br />
            <Image height="500" width="500" alt="matryoshka-image" src="/simon-hurry-QtiZpH_N2sA-unsplash-min.jpg" />
          </>
        )}
        <br />

        {/* <Image height="800" width="800" alt="contract-image" src="/thistle-contract-feb-15-2023.png" /> */}
      </main>
    </>
  )
}
