import {
    provider,
    Safe4337ModuleAddress,
    SafeProxyFactoryAddress,
    SafeProxyFactoryContract,
    SafeSingletonAddress
} from "./constants.ts";
import {ethers} from "ethers";
import {EIP712_SAFE_OPERATION_TYPE} from "@safe-global/relay-kit/dist/src/packs/safe-4337/constants";
import {
    EthSafeSignature,
} from '@safe-global/protocol-kit'
import {AlchemySigner} from "@alchemy/aa-alchemy";

export const calculateProxyAddress = async (inititalizer, nonce)=> {
    const proxyCreationCode = await SafeProxyFactoryContract.proxyCreationCode()

    const deploymentCode = ethers.solidityPacked(['bytes', 'uint256'], [proxyCreationCode, SafeSingletonAddress])
    const salt = ethers.solidityPackedKeccak256(['bytes32', 'uint256'], [ethers.solidityPackedKeccak256(['bytes'], [inititalizer]), nonce])
    return ethers.getCreate2Address(SafeProxyFactoryAddress, salt, ethers.keccak256(deploymentCode))
}


export const buildSignatureBytes = (signatures) => {
    const SIGNATURE_LENGTH_BYTES = 65

    signatures.sort((left, right) =>
        left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
    )

    let signatureBytes = '0x'
    let dynamicBytes = ''

    for (const signature of signatures) {
        if (signature.isContractSignature) {
            /*
              A contract signature has a static part of 65 bytes and the dynamic part that needs to be appended
              at the end of signature bytes.
              The signature format is
              Signature type == 0
              Constant part: 65 bytes
              {32-bytes signature verifier}{32-bytes dynamic data position}{1-byte signature type}
              Dynamic part (solidity bytes): 32 bytes + signature data length
              {32-bytes signature length}{bytes signature data}
            */
            const dynamicPartPosition = (
                signatures.length * SIGNATURE_LENGTH_BYTES +
                dynamicBytes.length / 2
            )
                .toString(16)
                .padStart(64, '0')

            signatureBytes += signature.staticPart(dynamicPartPosition)
            dynamicBytes += signature.dynamicPart()
        } else {
            signatureBytes += signature.data.slice(2)
        }
    }

    return signatureBytes + dynamicBytes
}

export async function signSafeOp(
    signer: AlchemySigner,
    safeUserOperation,
    safe4337ModuleAddress = Safe4337ModuleAddress
) {
    const network = await provider.getNetwork()
    const chainId = network.chainId
    const signerAddress = await signer.getAddress()
    console.log('adasdsad')
    console.log('{\n' +
        '            chainId,\n' +
        '            verifyingContract: safe4337ModuleAddress\n' +
        '        }: ', {
        chainId,
        verifyingContract: safe4337ModuleAddress
    })
    console.log('signer: ', signer)
    const signature = await signer.signTypedData({
            primaryType: 'SafeOp',
            domain: {
                chainId,
                verifyingContract: safe4337ModuleAddress
            },
            types: EIP712_SAFE_OPERATION_TYPE,
            message: {
                ...safeUserOperation,
                nonce: ethers.toBeHex(safeUserOperation.nonce),
                validAfter: ethers.toBeHex(safeUserOperation.validAfter),
                validUntil: ethers.toBeHex(safeUserOperation.validUntil),
                maxFeePerGas: ethers.toBeHex(safeUserOperation.maxFeePerGas),
                maxPriorityFeePerGas: ethers.toBeHex(safeUserOperation.maxPriorityFeePerGas)
            }
        }

    )
    console.log('signature: ', signature)
    return new EthSafeSignature(signerAddress, signature)
}
