import {ethers} from "ethers";
import Safe4337ModuleABI from './abi/Safe4337Module.json'
import SafeProxyFactoryABI from './abi/SafeProxyFactory.json'
import SafeSingletonABI from './abi/Safe.json'
import SafeModuleSetupABI from './abi/AddModulesLib.json'

export const Safe4337ModuleAddress = '0xa581c4A4DB7175302464fF3C06380BC3270b4037'
export const SafeProxyFactoryAddress = '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67'
export const SafeSingletonAddress = '0x41675C099F32341bf84BFc5382aF534df5C7461a'
export const SafeModuleSetupAddress = '0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb'

export const AlchemyEndpoint =`https://arb-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`

export const provider = new ethers.JsonRpcProvider(AlchemyEndpoint)
export const Safe4337ModuleContract = new ethers.Contract(Safe4337ModuleAddress, Safe4337ModuleABI, provider)
export const SafeProxyFactoryContract = new ethers.Contract(SafeProxyFactoryAddress, SafeProxyFactoryABI, provider)
export const SafeSingletonContract = new ethers.Contract(SafeSingletonAddress, SafeSingletonABI, provider)
export const SafeModuleSetupContract = new ethers.Contract(SafeModuleSetupAddress, SafeModuleSetupABI, provider)
