import { useState } from 'react'
import {
    AlchemyEndpoint,
    Safe4337ModuleAddress,
    SafeSingletonAddress,
    SafeProxyFactoryAddress,
    SafeSingletonContract, SafeModuleSetupAddress, SafeProxyFactoryContract, Safe4337ModuleContract
} from '/constants';
import './App.css'
import {ethers} from "ethers";

function App() {

    function testCreateSafe() {
        const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY as string)
        const testWallet = wallet.address
        const encodedInitializer = SafeSingletonContract.interface.encodeFunctionData("setup", [
            [testWallet],
            1,
            SafeModuleSetupAddress,
            SafeSingletonContract.interface.encodeFunctionData('enableModules', [[Safe4337ModuleAddress]]),
            Safe4337ModuleAddress,
            ethers.ZeroAddress,
            0,
            ethers.ZeroAddress,
        ]);
        const initCode = ethers.concat([
            SafeProxyFactoryAddress,
            SafeProxyFactoryContract.interface.encodeFunctionData("createProxyWithNonce", [SafeSingletonAddress as string, encodedInitializer, 73]),
        ]);

        const userOpCallData = Safe4337ModuleContract.interface.encodeFunctionData("execTransaction", [testWallet, 0, "0x"]);

        // Native tokens for the pre-fund 💸
        await wallet.sendTransaction({ to: deployedAddress, value: hre.ethers.parseEther("0.005") });
        // The bundler uses a different node, so we need to allow it sometime to sync

        const userOperation = {
            sender: deployedAddress,
            nonce: "0x0",
            initCode,
            callData: userOpCallData,
            callGasLimit: "0x1",
            verificationGasLimit: "0x1",
            preVerificationGas: "0x1",
            maxFeePerGas,
            maxPriorityFeePerGas,
            paymasterAndData: "0x",
            signature: "0x",
        };


    }

  return (
    <>
      <button></button>
    </>
  )
}

export default App
