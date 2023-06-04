import { Heading, Button, useToast, FormControl, FormLabel, FormHelperText, Input, Text } from '@chakra-ui/react'
import { Head } from '../../components/layout/Head'
import Image from 'next/image'
import { LinkComponent } from '../../components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import { GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI, EURM_CONTRACT_ADDRESS, EURM_CONTRACT_ABI } from '../../lib/consts'
import useSound from 'use-sound' // https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'

export default function Gcfa() {
  const { data: signer } = useSigner()

  const cfa = new ethers.Contract(GCFA_CONTRACT_ADDRESS, GCFA_CONTRACT_ABI, signer)
  const eur = new ethers.Contract(EURM_CONTRACT_ADDRESS, EURM_CONTRACT_ABI, signer)
  const { address, isConnecting, isDisconnected } = useAccount()

  const [loadingMint, setLoadingMint] = useState<boolean>(false)
  const [mintTxLink, setMintTxLink] = useState<string>('')
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false)
  const [depositTxLink, setDepositTxLink] = useState<string>('')
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false)
  const [withdrawTxLink, setWithdrawTxLink] = useState<string>('')
  const [loadingTransfer, setLoadingTransfer] = useState<boolean>(false)
  const [transferTxLink, setTransferTxLink] = useState<string>('')
  const [loadingFaucet, setLoadingFaucet] = useState<boolean>(false)
  const [faucetTxLink, setFaucetTxLink] = useState<string>('')
  const [cfaBal, setCfaBal] = useState<number>(0)
  const [eurBal, setEurBal] = useState<number>(0)
  const [eurAmount, setEurAmount] = useState<string>('1')
  const [depositAmount, setDepositAmount] = useState<string>('1')
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>('1000')
  const [recipientAddress, setRecipientAddress] = useState<string>(address)
  const [transferAmount, setTransferAmount] = useState<string>('500')
  const [supply, setSupply] = useState<string>('?')

  const [userBal, setUserBal] = useState<string>('')

  const { data } = useFeeData()

  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })
  const network = useNetwork()

  const provider = useProvider()

  // const [play, { stop, pause }] = useSound(stevie, {
  //   volume: 0.5,
  // })

  const explorerUrl = network.chain?.blockExplorers?.default.url

  const toast = useToast()

  useEffect(() => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
  }, [bal?.formatted, bal?.symbol, address, provider])

  const checkFees = () => {
    console.log('data?.formatted:', JSON.stringify(data?.formatted))
    return JSON.stringify(data?.formatted)
  }

  const getBalances = async () => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
    console.log('BIT bal:', Number(bal?.formatted).toFixed(4))
    const x = await eur.balanceOf(address)
    setEurBal(Number(x / 10 ** 18))
    console.log('eur bal:', Number(x / 10 ** 18))
    const y = await cfa.balanceOf(address)
    setCfaBal(Number(y / 10 ** 18))
    console.log('cfa bal:', Number(y / 10 ** 18))
    getSupply()
  }

  const getSupply = async () => {
    const supplyRaw = await cfa.totalSupply()
    console.log('supplyRaw', supplyRaw)
    const supply = ethers.utils.formatEther(supplyRaw)
    setSupply(supply)
    console.log('setSupply', supply)
    return supply
  }

  const mint = async () => {
    console.log('minting...')
    try {
      setLoadingMint(true)
      setMintTxLink('')
      console.log('eurAmount:', eurAmount)
      const mint = await eur.mint(address)
      const mintReceipt = await mint.wait(1)
      console.log('tx:', mintReceipt)
      setMintTxLink(explorerUrl + '/tx/' + mintReceipt.transactionHash)
      setLoadingMint(false)
      console.log('Minted. ✅')
      toast({
        title: 'Successful mint',
        position: 'top',
        description: "You've just minted 10 euros! You can go ahead and click on 'Deposit'",
        status: 'success',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
      // play()
      getBalances()
    } catch (e) {
      setLoadingMint(false)
      console.log('error mint:', e)
      toast({
        title: 'Minting error',
        description: "Your mint transaction didn't go through. We're sorry about that (" + e.message + ')',
        status: 'error',
        position: 'top',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
    }
  }

  const deposit = async () => {
    console.log('Depositing...')
    try {
      setDepositTxLink('')
      setLoadingDeposit(true)

      const bitBal = Number(bal.formatted)
      const eurBal = await eur.balanceOf(address)
      console.log('eurBal:', eurBal)
      // if (eurBal == 0) {
      //   toast({
      //     title: 'You need some EUR',
      //     description: "Please click on 'Mint EUR' first.",
      //     status: 'error',
      //     position: 'top',
      //     variant: 'subtle',
      //     duration: 20000,
      //     isClosable: true,
      //   })

      //   setLoadingDeposit(false)
      //   return
      // }
      const approveTx = await eur.approve(cfa.address, ethers.utils.parseEther(depositAmount))
      const approveReceipt = await approveTx.wait(1)
      console.log('tx:', approveReceipt)

      console.log('GCFA_CONTRACT_ADDRESS:', GCFA_CONTRACT_ADDRESS)
      console.log('GCFA_CONTRACT_ABI:', GCFA_CONTRACT_ABI)
      console.log('cfa.address:', cfa.address)

      const check = await cfa.name()
      console.log('check:', check)

      const check2 = await eur.balanceOf(address)
      console.log('check2 (EUR bal):', check2 / 10 ** 18)
      console.log('depositAmount:', depositAmount)

      const deposit = await cfa.depositFor(address, 1000)
      const depositReceipt = await deposit.wait(1)
      console.log('tx:', depositReceipt)
      setDepositTxLink(explorerUrl + '/tx/' + depositReceipt.transactionHash)

      const check3 = await cfa.balanceOf(address)
      console.log('check3 (CFA bal):', check3 / 10 ** 18)

      const check4 = await eur.balanceOf(address)
      console.log('check4 (EUR bal):', check4 / 10 ** 18)

      setLoadingDeposit(false)
      console.log('Deposited. ✅')
      toast({
        title: 'Successful deposit',
        description: "You've just deposited EUR. You have more gCFA now! 🎉",
        status: 'success',
        position: 'top',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
      getBalances()
      // play()
    } catch (e) {
      setLoadingDeposit(false)
      console.log('error:', e)
      toast({
        title: '',
        description: "You don't have enough EUR on your wallet. Please mint some EUR. (" + e.message + ')',
        status: 'error',
        position: 'top',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
    }
  }

  const withdraw = async () => {
    console.log('Withdrawing...')
    try {
      setWithdrawTxLink('')
      setLoadingWithdraw(true)

      const cfaBal = await cfa.balanceOf(address)
      if (cfaBal == 0) {
        toast({
          title: '',
          description: "You don't have any gCFA on your wallet yet. Please deposit first.",
          status: 'error',
          position: 'top',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })

        setLoadingWithdraw(false)
        return
      }

      const withdraw = await cfa.withdrawTo(address, ethers.utils.parseEther('0.000000000000655957'))
      const withdrawReceipt = await withdraw.wait(1)
      console.log('tx:', withdrawReceipt)
      setWithdrawTxLink(explorerUrl + '/tx/' + withdrawReceipt.transactionHash)

      setLoadingWithdraw(false)
      console.log('Withdrawn. ✅')
      toast({
        title: 'Successful withdrawal',
        description: "You just withdrawn gCFA. You've got some EUR in your pocket",
        status: 'success',
        position: 'top',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
      getBalances()
    } catch (e) {
      setLoadingWithdraw(false)
      console.log('error:', e)
      const cfaBal = await cfa.balanceOf(address)

      toast({
        title: '',
        description: "You don't have enough gCFA on your wallet yet. Please deposit some EUR. (" + e.message + ')',
        status: 'error',
        position: 'top',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
    }
  }

  const transfer = async () => {
    console.log('Transfering...')
    try {
      setTransferTxLink('')
      setLoadingTransfer(true)

      const cfaBal = await cfa.balanceOf(address)
      if (cfaBal == 0) {
        toast({
          title: '',
          description: "You don't have any gCFA on your wallet yet. Please deposit first.",
          status: 'error',
          position: 'top',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })

        setLoadingTransfer(false)
        return
      }

      const withdraw = await cfa.transfer(recipientAddress, ethers.utils.parseEther('0.000000000000000008'))
      const withdrawReceipt = await withdraw.wait(1)
      console.log('tx:', withdrawReceipt)
      setTransferTxLink(explorerUrl + '/tx/' + withdrawReceipt.transactionHash)

      setLoadingTransfer(false)
      console.log(transferAmount + 'units transferred. ✅')
      console.log('transferAmount', transferAmount)
      toast({
        title: 'Successful transfer',
        description: "You've just transferred some gCFA! Congrats and thank you.",
        status: 'success',
        variant: 'subtle',
        position: 'top',
        duration: 20000,
        isClosable: true,
      })
      getBalances()
    } catch (e) {
      setLoadingTransfer(false)
      console.log('error:', e)
      const cfaBal = await cfa.balanceOf(address)

      if (cfaBal < 500) {
        toast({
          title: '',
          description: 'You dont have enough gCFA on your wallet yet. Please deposit some EUR.' + e,
          status: 'error',
          position: 'top',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })

        setLoadingTransfer(false)
        return
      }
    }
  }

  const getFreeMoney = async () => {
    console.log('Getting free money...')
    try {
      setFaucetTxLink('')
      setLoadingFaucet(true)

      console.log('bal:', bal)
      console.log('bal.formatted:', bal.formatted)
      const bitBal = Number(bal.formatted)
      if (bitBal >= 0.001) {
        toast({
          title: 'You already have enough BIT',
          description: "You're ready: you can go ahead and click on 'Mint EUR'.",
          status: 'success',
          variant: 'subtle',
          duration: 20000,
          position: 'top',
          isClosable: true,
        })
        setLoadingFaucet(false)
        return
      }

      const pKey = process.env.NEXT_PUBLIC_MANTLE_TESTNET_FAUCET_PRIVATE_KEY
      const specialSigner = new ethers.Wallet(pKey, provider)

      const tx = await specialSigner.sendTransaction({
        to: address,
        value: ethers.utils.parseEther('0.001'),
      })
      const txReceipt = await tx.wait(1)
      console.log('tx:', txReceipt)
      setFaucetTxLink(explorerUrl + '/tx/' + txReceipt.transactionHash)

      const x = await eur.balanceOf(address)
      console.log('x:', Number(x / 10 ** 18))

      setLoadingFaucet(false)
      console.log('Done. You got 0.001 BIT on Mantle Testnet ✅')
      getBalances()
    } catch (e) {
      setLoadingFaucet(false)
      console.log('error:', e)
    }
  }

  return (
    <>
      <Head />

      <main>
        {isDisconnected ? (
          <>
            <p>Please connect your wallet.</p>
          </>
        ) : (
          <>
            <br />
            <p>
              You can deposit your EUR to get the equivalent in gCFA, you can withdraw your gCFA and get your EUR back, and you also can do a simple
              transfer.
            </p>
            <br />
            <p>
              Contract address: <strong>{GCFA_CONTRACT_ADDRESS}</strong>
            </p>
            <br />
            <p>
              Current total supply: <strong>{supply}</strong> gCFA
            </p>
            <br />
            {cfaBal || eurBal ? (
              <>
                <p>
                  You&apos;re connected to <strong>{network.chain?.name}</strong> and your wallet currently holds
                  <strong> {userBal}</strong>, <strong>{cfaBal.toFixed(18)}</strong> gCFA, and <strong>{eurBal.toFixed(2)}</strong> EUR.{' '}
                </p>
                <br />
              </>
            ) : (
              <>
                <p>
                  You&apos;re connected to <strong>{network.chain?.name}</strong>{' '}
                  <Button size="xs" mr={3} mb={3} colorScheme="blue" variant="outline" onClick={() => getBalances()}>
                    Get balances
                  </Button>
                </p>
              </>
            )}
          </>
        )}

        <br />
        {!loadingFaucet ? (
          <>
            <FormLabel>1. Faucet</FormLabel>

            <Button mr={3} mb={3} colorScheme="green" variant="outline" onClick={getFreeMoney}>
              Get some free BIT
            </Button>
          </>
        ) : (
          <Button mr={3} mb={3} isLoading colorScheme="green" loadingText="Cashing in" variant="outline">
            Cashing in
          </Button>
        )}
        {faucetTxLink ? (
          <>
            <br />
            <Text fontSize="12px" color="#45a2f8">
              <LinkComponent target="blank" href={faucetTxLink}>
                View your faucet tx on Etherscan: <strong>{faucetTxLink}</strong>
              </LinkComponent>
            </Text>
          </>
        ) : (
          <>
            <br />
          </>
        )}
        <br />

        <FormControl>
          <FormLabel>2. Mint EUR</FormLabel>
          {/* <Input value={eurAmount} type="number" onChange={(e) => setEurAmount(e.target.value)} placeholder="Proposal title" />
          <FormHelperText>How many euros do you want to mint?</FormHelperText> */}

          {!loadingMint ? (
            <Button mr={3} mb={3} colorScheme="green" variant="outline" onClick={mint}>
              Mint EUR
            </Button>
          ) : (
            <Button mr={3} mb={3} isLoading colorScheme="green" loadingText="Minting" variant="outline">
              Minting
            </Button>
          )}
          {mintTxLink ? (
            <>
              <br />
              <Text fontSize="12px" color="#45a2f8">
                <LinkComponent target="blank" href={mintTxLink}>
                  View your mint tx on Etherscan: <strong>{mintTxLink}</strong>
                </LinkComponent>
              </Text>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </FormControl>
        <br />
        <FormControl>
          <FormLabel>3. Deposit</FormLabel>
          {/* <Input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Proposal title" />
          <FormHelperText>How many euros do you want to deposit?</FormHelperText> */}

          {!loadingDeposit ? (
            <Button mr={3} mb={3} colorScheme="green" variant="outline" onClick={deposit}>
              Deposit
            </Button>
          ) : (
            <Button mr={3} mb={3} isLoading colorScheme="green" loadingText="Depositing" variant="outline">
              Depositing
            </Button>
          )}
          {depositTxLink ? (
            <>
              <br />
              <Text fontSize="12px" color="#45a2f8">
                <LinkComponent target="blank" href={depositTxLink}>
                  View your deposit tx on Etherscan: <strong>{depositTxLink}</strong>
                </LinkComponent>
              </Text>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </FormControl>

        <br />

        <FormControl>
          <FormLabel>4. Withdraw</FormLabel>
          {/* <Input value={amountToWithdraw} onChange={(e) => setAmountToWithdraw(e.target.value)} placeholder="Proposal title" />
          <FormHelperText>How many gCFA do you want to withdraw?</FormHelperText> */}

          {!loadingWithdraw ? (
            <Button mr={3} mb={3} colorScheme="green" variant="outline" onClick={withdraw}>
              Withdraw
            </Button>
          ) : (
            <Button mr={3} mb={3} isLoading colorScheme="green" loadingText="Withdrawing" variant="outline">
              Withdrawing
            </Button>
          )}
          {withdrawTxLink ? (
            <>
              <br />
              <Text fontSize="12px" color="#45a2f8">
                <LinkComponent target="blank" href={withdrawTxLink}>
                  View your withdraw tx on Etherscan: <strong>{withdrawTxLink}</strong>
                </LinkComponent>
              </Text>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </FormControl>

        <br />
        <FormControl>
          <FormLabel>5. Transfer gCFA</FormLabel>
          <Input value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
          <FormHelperText>What&apos;s the recipent address?</FormHelperText>

          {/* <Input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
          <FormHelperText>How many gCFA do you want to transfer?</FormHelperText> */}
          <br />
          {!loadingTransfer ? (
            <Button mr={3} mb={3} colorScheme="green" variant="outline" onClick={transfer}>
              Transfer
            </Button>
          ) : (
            <Button mr={3} mb={3} isLoading colorScheme="green" loadingText="Transferring" variant="outline">
              Transferring
            </Button>
          )}
          {transferTxLink ? (
            <>
              <br />
              <Text fontSize="12px" color="#45a2f8">
                <LinkComponent target="blank" href={transferTxLink}>
                  View your transfer tx on Etherscan: <strong>{transferTxLink}</strong>
                </LinkComponent>
              </Text>
            </>
          ) : (
            <>
              <br />
            </>
          )}
        </FormControl>

        <br />
        {/* {txLink && (
          <Button colorScheme="red" variant="outline" onClick={() => stop()}>
            Stop the music
          </Button>
        )} */}
        {/* <Image
          priority
          height="800"
          width="1000"
          alt="contract-image"
          src="https://bafybeidfcsm7moglsy4sng57jdwmnc4nw3p5tjheqm6vxk3ty65owrfyk4.ipfs.w3s.link/gcfa-code.png"
        /> */}
      </main>
    </>
  )
}
