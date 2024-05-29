import {useEffect, useState} from 'react'
import {
    AlchemyEndpoint,
    Safe4337ModuleAddress,
    SafeSingletonAddress,
    SafeProxyFactoryAddress,
    SafeSingletonContract,
    SafeModuleSetupAddress,
    SafeProxyFactoryContract,
    Safe4337ModuleContract,
    SafeModuleSetupContract
} from './constants';
import './App.css'
import {ethers} from "ethers";



const calculateProxyAddress = async (inititalizer: string, nonce: number | string): Promise<string> => {
    const proxyCreationCode = await SafeProxyFactoryContract.proxyCreationCode()

    const deploymentCode = ethers.solidityPacked(['bytes', 'uint256'], [proxyCreationCode, SafeSingletonAddress])
    const salt = ethers.solidityPackedKeccak256(['bytes32', 'uint256'], [ethers.solidityPackedKeccak256(['bytes'], [inititalizer]), nonce])
    return ethers.getCreate2Address(SafeProxyFactoryAddress, salt, ethers.keccak256(deploymentCode))
}

function App() {

    const [deployedAddress, setDeployedAddress] = useState<string>("")
    const [initCode, setInitCode] = useState<string>("")
    const [wallet, setWallet] = useState<ethers.Wallet>()

    useEffect(() => {
        console.log('init')
        const wallet = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY as string)
        setWallet(wallet)
        const testWallet = wallet.address
        const encodedInitializer = SafeSingletonContract.interface.encodeFunctionData("setup", [
            [testWallet],
            1,
            SafeModuleSetupAddress,
            SafeModuleSetupContract.interface.encodeFunctionData('enableModules', [[Safe4337ModuleAddress]]),
            Safe4337ModuleAddress,
            ethers.ZeroAddress,
            0,
            ethers.ZeroAddress,
        ]);
        const _initCode = ethers.concat([
            SafeProxyFactoryAddress,
            SafeProxyFactoryContract.interface.encodeFunctionData("createProxyWithNonce", [SafeSingletonAddress as string, encodedInitializer, 73]),
        ]);
        console.log('before calculate')
        const _deployedAddress = calculateProxyAddress(encodedInitializer, 73).then((address) => {
            console.log('_deployedAddress: ', address)
            setDeployedAddress(address)
            return address
        });
        console.log('_initCode: ', _initCode)
        console.log('local wallet', wallet.address)
        setInitCode(_initCode)
    }, [])

    function testCreateSafe() {
        // // Native tokens for the pre-fund 💸
        // await wallet.sendTransaction({ to: deployedAddress, value: hre.ethers.parseEther("0.005") });
        // // The bundler uses a different node, so we need to allow it sometime to sync
        //
        // const userOperation = {
        //     sender: deployedAddress,
        //     nonce: "0x0",
        //     initCode,
        //     callData: userOpCallData,
        //     callGasLimit: "0x1",
        //     verificationGasLimit: "0x1",
        //     preVerificationGas: "0x1",
        //     maxFeePerGas,
        //     maxPriorityFeePerGas,
        //     paymasterAndData: "0x",
        //     signature: "0x",
        // };


    }

  return (
    <>
        <h3>Local wallet: {wallet?.address}</h3>
        <h3>Deployed address: {deployedAddress}</h3>
      <button>Create wallet</button>
    </>
  )
}

export default App
