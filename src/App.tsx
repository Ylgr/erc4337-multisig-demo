import {useEffect, useState, useMemo} from 'react'
import {
    AlchemyEndpoint,
    Safe4337ModuleAddress,
    SafeSingletonAddress,
    SafeProxyFactoryAddress,
    SafeSingletonContract,
    SafeModuleSetupAddress,
    SafeProxyFactoryContract,
    Safe4337ModuleContract,
    SafeModuleSetupContract, entryPoint, provider
} from './constants';
import './App.css'
import {ethers} from "ethers";
import { AlchemySigner } from "@alchemy/aa-alchemy";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import {PasskeySignupComponent} from "./PasskeySignupComponent.tsx";
import {Button, Card} from "react-bootstrap";

function App() {

    const [deployedAddress, setDeployedAddress] = useState<string>("")
    const [initCode, setInitCode] = useState<string>("")
    // const [wallet, setWallet] = useState<ethers.Wallet>()
    // const [safe4337Pack, setSafe4337Pack] = useState<Safe4337Pack>(null)
    const nonce = 0

    // useEffect(() => {
    //     console.log('init')
    //     const wallet = new ethers.Wallet(process.env.VITE_PRIVATE_KEY as string)
    //     setWallet(wallet)
    //
    //     const testWallet = wallet.address
    //     const encodedInitializer = SafeSingletonContract.interface.encodeFunctionData("setup", [
    //         [testWallet],
    //         1,
    //         SafeModuleSetupAddress,
    //         SafeModuleSetupContract.interface.encodeFunctionData('enableModules', [[Safe4337ModuleAddress]]),
    //         Safe4337ModuleAddress,
    //         ethers.ZeroAddress,
    //         0,
    //         ethers.ZeroAddress,
    //     ]);
    //     const _initCode = ethers.concat([
    //         SafeProxyFactoryAddress,
    //         SafeProxyFactoryContract.interface.encodeFunctionData("createProxyWithNonce", [SafeSingletonAddress as string, encodedInitializer, nonce]),
    //     ]);
    //     console.log('before calculate')
    //     const _deployedAddress = calculateProxyAddress(encodedInitializer, nonce).then((address) => {
    //         console.log('_deployedAddress: ', address)
    //         setDeployedAddress(address)
    //         return address
    //     });
    //     console.log('_initCode: ', _initCode)
    //     console.log('local wallet', wallet.address)
    //     setInitCode(_initCode)
    //
    //     // Safe4337Pack.init({
    //     //     provider: AlchemyEndpoint,
    //     //     signer: process.env.VITE_PRIVATE_KEY as string,
    //     //     rpcUrl: AlchemyEndpoint,
    //     //     bundlerUrl: AlchemyEndpoint,
    //     //     options: {
    //     //         owners: [wallet.address],
    //     //         threshold: 1
    //     //     },
    //     //     // ...
    //     // }).then((_safe4337Pack) => {
    //     //     setSafe4337Pack(_safe4337Pack)
    //     // });
    //
    // }, [])


    // async function testCreateSafe() {
    //     const [nonce, block, maxPriorityFeePerGasResult] = await Promise.all([
    //         (async () => {
    //             return entryPoint.getNonce(deployedAddress, 0);
    //         })(),
    //         provider.getBlock("latest"),
    //         axios.post(
    //             AlchemyEndpoint,
    //             {
    //                 jsonrpc: "2.0",
    //                 method: "rundler_maxPriorityFeePerGas",
    //                 params: [],
    //                 id: 1,
    //             },
    //         ),
    //     ]);
    //     const preMaxPriorityFeePerGas = ethers.parseUnits(ethers.formatUnits(maxPriorityFeePerGasResult.data.result, 0), 0);
    //     const baseFeePerGas = block?.baseFeePerGas;
    //     console.log('baseFeePerGas: ', baseFeePerGas)
    //     console.log('type pf preMaxPriorityFeePerGas: ', typeof preMaxPriorityFeePerGas)
    //     console.log('preMaxPriorityFeePerGas: ', preMaxPriorityFeePerGas)
    //     console.log('ethers.parseUnits(preMaxPriorityFeePerGas, 0): ', preMaxPriorityFeePerGas)
    //     const maxFeePerGas = (baseFeePerGas + preMaxPriorityFeePerGas) * 150n/100n
    //     console.log(2)
    //     const maxPriorityFeePerGas = preMaxPriorityFeePerGas * 105n / 100n
    //     console.log(3)
    //     // Create an instance of the Alchemy bundler
    //     const userOpCallData = Safe4337ModuleContract.interface.encodeFunctionData("executeUserOp", ['0xeaBcd21B75349c59a4177E10ed17FBf2955fE697', 0, "0x", 0]);
    //
    //     // Define the user operation
    //     const userOperation = {
    //         sender: deployedAddress,
    //         nonce: '0x' + nonce.toString(16),
    //         initCode,
    //         callData: userOpCallData,
    //         maxFeePerGas: '0x' + maxFeePerGas.toString(16),
    //         maxPriorityFeePerGas: '0x' + maxPriorityFeePerGas.toString(16),
    //         paymasterAndData: "0x",
    //         signature: "0x",
    //     };
    //     console.log('userOperation: ', userOperation)
    //     const gasEstimate = await estimateGas(userOperation);
    //     console.log('gasEstimate: ', gasEstimate)
    //     // userOperation.callGasLimit = gasEstimate.callGasLimit;
    //     // userOperation.verificationGasLimit = gasEstimate.verificationGasLimit;
    //     // userOperation.preVerificationGas = gasEstimate.preVerificationGas;
    //     //
    //     // const opHash = await entryPoint.getUserOpHash(userOperation as any);
    //     //
    //     // const signature = await wallet.signMessage(ethers.getBytes(opHash));
    //     // userOperation.signature = ethers.solidityPacked(["bytes"], [signature]);
    //     //
    //     // // Submit the user operation using the bundler
    //     // const simulateResult = await simulateUserOperationAssetChanges(userOperation);
    //     // console.log('simulateResult: ', simulateResult)
    // }
    //
    // async function estimateGas(op: any) {
    //
    //     const result = await axios.post(
    //         AlchemyEndpoint,
    //         {
    //             jsonrpc: "2.0",
    //             method: "eth_estimateUserOperationGas",
    //             params: [op, entryPoint.target],
    //             id: 1,
    //         },
    //     );
    //     return result.data;
    // }
    //
    //
    // async function simulateUserOperationAssetChanges(
    //     userOperation
    // ) {
    //     // https://docs.alchemy.com/reference/throughput
    //     // await delay(d);
    //     const res = await axios.post(
    //         AlchemyEndpoint,
    //         {
    //             jsonrpc: "2.0",
    //             method: "alchemy_simulateUserOperationAssetChanges",
    //             params: [userOperation, entryPoint.target],
    //             id: 1,
    //         },
    //     );
    //
    //     const { changes } = res.data;
    //     return changes;
    // }

    // async function testCreateSafe2() {
    //     const transaction1 = { to: '0xeaBcd21B75349c59a4177E10ed17FBf2955fE697', data: "0x", value: "0x" }
    //     const transaction2 = { to: '0xad2ada4B2aB6B09AC980d47a314C54e9782f1D0C', data: "0x", value: "0x" }
    //     const transactions = [transaction1, transaction2]
    //     const safeOperation = await safe4337Pack.createTransaction({ transactions })
    //     console.log('safeOperation: ', safeOperation)
    // }

  return (
    <>
        {/*<h3>Local wallet: {wallet?.address}</h3>*/}
        {/*<h3>Deployed address: {deployedAddress}</h3>*/}
      {/*<button onClick={() => testCreateSafe()}>Test wallet</button>*/}
        <PasskeySignupComponent />
    </>
  )
}

export default App
