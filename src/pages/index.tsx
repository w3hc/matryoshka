import { Heading, Button, useToast, Text } from '@chakra-ui/react'
import { Head } from '../components/layout/Head'
// import Image from 'next/image'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../lib/consts'
import useSound from 'use-sound' // https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'
import { GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI } from '../lib/consts'

export default function Index() {
  const { data: signer } = useSigner()

  const cfa = new ethers.Contract(GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI, signer)

  const [loading, setLoading] = useState<boolean>(false)
  const [userBal, setUserBal] = useState<string>('')
  const [txLink, setTxLink] = useState<string>('')
  const [cfaBal, setCfaBal] = useState<number>(0)

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

  const [play, { stop, pause }] = useSound(stevie, {
    volume: 0.5,
  })

  const toast = useToast()

  const explorerUrl = network.chain?.blockExplorers?.default.url

  const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

  const getBalances = async () => {
    const y = await cfa.balanceOf(address)
    setCfaBal(Number(y / 10 ** 18))
    console.log('cfa bal:', Number(y / 10 ** 18))
    return Number(y / 10 ** 18)
  }

  useEffect(() => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
    // if (address !== null) {
    //   getBalances()
    //   console.log('cfaBal:', cfaBal)
    // }
  }, [bal?.formatted, bal?.symbol, address])

  const checkFees = () => {
    console.log('data?.formatted:', JSON.stringify(data?.formatted))
    return JSON.stringify(data?.formatted)
  }

  const mint = async () => {
    console.log('minting...')
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
      console.log('cfaBal:', gcfaBalance)
      if (gcfaBalance === 0) {
        toast({
          title: 'Insufficient gCFA balance',
          description: 'Please get som gCFA first.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const uri1 = 'https://ipfs.io/ipfs/bafybeieqdjf6acdw2hwymztudsp2lbyqzngyhfznu2fsktgwqvyzmp5mui/metadata.json'
        const uri2 = 'https://ipfs.io/ipfs/bafybeieqdjf6acdw2hwymztudsp2lbyqzngyhfznu2fsktgwqvyzmp5mui/metadata.json'

        const call = await nft._mintBatch(1, uri1, uri2)
        const nftReceipt = await call.wait(1)
        console.log('tx:', nftReceipt)

        // const approval = await btcContract.connect(issuer).approve(minifolio.address, btcAmount);
        // await approval.wait(1);
        // const transferBTC = await btcContract.transfer(minifolio.address, btcAmount);
        // await transferBTC.wait(1);
        // expect(await btcContract.balanceOf(minifolio.address)).to.equal(btcAmount);

        const approve = await cfa.approve(nft.address, ethers.utils.parseEther('50000'))
        const approveReceipt = await approve.wait(1)
        console.log('approveReceipt:', approveReceipt)

        const cfaTransfer = await cfa.transfer(nft.address, ethers.utils.parseEther('50000'))
        const transferReceipt = await cfaTransfer.wait(2)
        console.log('transferReceipt:', transferReceipt)
        toast({
          title: 'Successful mint',
          description: 'Congrats! You just minted a Matryoshka NFT: it is loaded with 50k gCFA. 🎉',
          status: 'success',
          position: 'top',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })
        setTxLink(explorerUrl + '/tx/' + transferReceipt.transactionHash)
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

            <p>
              You&apos;re about to mint 1 Matryoshka NFT on <strong>Mantle Testnet</strong>. It will hold <strong>50k gCFA</strong>.
            </p>
            <br />
            <p>
              Your wallet currently holds
              <strong> {userBal}</strong> {cfaBal !== 0 ? 'and ' + cfaBal + ' gCFA!' : ''}
              {/* <strong> {userBal}</strong> */}
            </p>
            {/* You can go ahead and click on the &apos;Mint&apos; button below: you will be invited to sign your
              transaction.{' '} */}
          </>
        )}
        <br />
        <LinkComponent href="gcfa">
          <Button colorScheme="green" variant="outline">
            Get some gCFA
          </Button>
        </LinkComponent>{' '}
        <br />
        <br />
        {!loading ? (
          <Button colorScheme="blue" variant="outline" onClick={mint}>
            Mint your 50k Matryoshka NFT
          </Button>
        ) : (
          <Button isLoading colorScheme="blue" loadingText="Minting" variant="outline">
            Minting
          </Button>
        )}
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
            <Text fontSize="20px" color="#45a2f8">
              <LinkComponent target="blank" href={txLink}>
                <strong>{txLink}</strong>
              </LinkComponent>
            </Text>
          </>
        )}
        <br />
        {txLink && (
          <>
            <Button size="sm" colorScheme="red" variant="outline" onClick={() => stop()}>
              Stop the music
            </Button>
            <br />
            <br />
            <LinkComponent target="blank" href="redeem">
              <Button colorScheme="purple" variant="outline">
                Go test the redeem function
              </Button>
            </LinkComponent>
          </>
        )}
      </main>
    </>
  )
}
