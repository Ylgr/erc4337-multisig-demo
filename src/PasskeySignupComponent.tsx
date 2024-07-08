import {AlchemySigner, User} from "@alchemy/aa-alchemy";
import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {Input} from "@alchemy/aa-alchemy/react";
import {
    entryPoint, EntryPointAddress,
    Safe4337ModuleAddress,
    SafeModuleSetupAddress,
    SafeModuleSetupContract, SafeProxyFactoryAddress, SafeProxyFactoryContract, SafeSingletonAddress,
    SafeSingletonContract
} from "./constants.ts";
import {ethers} from "ethers";
import {buildSignatureBytes, calculateProxyAddress, signSafeOp} from "./utils.ts";
import {EthSafeSignature} from "@safe-global/protocol-kit";

export const PasskeySignupComponent = () => {
    const email1 = process.env.VITE_EMAIL1;
    const email2 = process.env.VITE_EMAIL2;
    const [signer, setSigner] = useState<AlchemySigner>();
    const [signer1, setSigner1] = useState<AlchemySigner>();
    const [signer2, setSigner2] = useState<AlchemySigner>();
    const [user, setUser] = useState<User>();
    const [user1, setUser1] = useState<any>();
    const [user2, setUser2] = useState<any>();
    const [loginLink1, setLoginLink1] = useState<string>("");
    const [loginLink2, setLoginLink2] = useState<string>("");
    const [bundle1, setBundle1] = useState<string>("");
    const [bundle2, setBundle2] = useState<string>("");
    const [orgId1, setOrgId1] = useState<string>("");
    const [orgId2, setOrgId2] = useState<string>("");
    const [multisigAddress, setMultisigAddress] = useState<string>("");
    const [initCode, setInitCode] = useState<string>("");
    const [operation, setOperation] = useState<any>(null);
    const [safeOperation, setSafeOperation] = useState<any>(null);
    const [signatures, setSignatures] = useState<EthSafeSignature[]>([]);

    const addr1= "0xad2ada4B2aB6B09AC980d47a314C54e9782f1D0C";
    const addr2= "0xB7C75A67c6F19e44014BA20d4072Bf332E33251d";
    const addr3= "0xE4FE73968025c919ed92956c2617FBAb98147b0A";
    const threshold = 2;

    useEffect(() => {
        setSigner(
            new AlchemySigner({
                client: {
                    connection: {
                        apiKey: process.env.VITE_ALCHEMY_API_KEY,
                    },
                    iframeConfig: {
                        iframeContainerId: "turnkey-iframe-container",
                    },
                },
            })
        );
        setSigner1(
            new AlchemySigner({
                client: {
                    connection: {
                        apiKey: process.env.VITE_ALCHEMY_API_KEY,
                    },
                    iframeConfig: {
                        iframeContainerId: "turnkey-iframe-container",
                    },
                }
            })
        );
        setSigner2(
            new AlchemySigner({
                client: {
                    connection: {
                        apiKey: process.env.VITE_ALCHEMY_API_KEY,
                    },
                    iframeConfig: {
                        iframeContainerId: "turnkey-iframe-container",
                    },
                }
            })
        );
    }, []);

    const initTransaction = async () => {
        const nonce = 0
        const encodedInitializer = SafeSingletonContract.interface.encodeFunctionData("setup", [
            [addr1, addr2, addr3],
            2,
            SafeModuleSetupAddress,
            SafeModuleSetupContract.interface.encodeFunctionData('enableModules', [[Safe4337ModuleAddress]]),
            Safe4337ModuleAddress,
            ethers.ZeroAddress,
            0,
            ethers.ZeroAddress,
        ]);
        const _initCode = ethers.concat([
            SafeProxyFactoryAddress,
            SafeProxyFactoryContract.interface.encodeFunctionData("createProxyWithNonce", [SafeSingletonAddress, encodedInitializer, nonce]),
        ]);
        setInitCode(_initCode)
        const _deployedAddress = await calculateProxyAddress(encodedInitializer, nonce)
        const opNonce = await entryPoint.getNonce(_deployedAddress, 0)
        console.log('opNonce: ', opNonce)
        setMultisigAddress(_deployedAddress)
        console.log('_deployedAddress: ', _deployedAddress)
        const op = {
            "initCode": opNonce ? '0x' : _initCode,
            "sender": _deployedAddress,
            "nonce": opNonce.toString(),
            "callData": "0x7bb3742800000000000000000000000038869bf66a61cf6bdb996a6ae40d5853fd43b52600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001048d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000aa00eabcd21b75349c59a4177e10ed17fbf2955fe6970000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ad2ada4b2ab6b09ac980d47a314c54e9782f1d0c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            // "signature": "0x0000000000000000000000003150023d6b3c1955098cd692b237a683668b47c0c94c3d53c98c40ed9566f21f4d7c6d0ddb529be61d8e628da5a013e84fba2f2fd23ab7b36b976da1f019cd411b",
            "signature": "0x",
            "paymasterAndData": "0x",
            "maxPriorityFeePerGas": "38413944",
            "maxFeePerGas": "2389585618",
            "callGasLimit": "139044",
            "verificationGasLimit": "794148",
            "preVerificationGas": "58031"
        }
        setOperation(op)

        const validAfter = 0
        const validUntil = 0
        const safeOp =  {
            safe: op.sender,
            nonce: BigInt(opNonce),
            initCode: op.initCode,
            callData: op.callData,
            callGasLimit: op.callGasLimit,
            verificationGasLimit: op.verificationGasLimit,
            preVerificationGas: op.preVerificationGas,
            maxFeePerGas: op.maxFeePerGas,
            maxPriorityFeePerGas: op.maxPriorityFeePerGas,
            paymasterAndData: op.paymasterAndData,
            validAfter: validAfter,
            validUntil: validUntil,
            entryPoint: EntryPointAddress
        }
        setSafeOperation(safeOp)
    }

    const signOp = async (signer, safeUserOperation, safe4337ModuleAddress = Safe4337ModuleAddress) => {
        const signature = await signSafeOp(signer, safeUserOperation, safe4337ModuleAddress)
        setSignatures([...signatures, signature])
    }

    // we are using react-query to handle loading states more easily,
    // feel free to use whatever state management library you prefer
    const signup = async () => {
        if (signer == null) {
            return;
        }

        const user = await signer.authenticate({
            type: "passkey",
            createNew: false,
            // createNew: true,
            // username: "demouser",
        });
        console.log('user: ', user);
        setUser(user);
    }

    const signup1 = async () => {
        if (signer1 == null) {
            return;
        }
        const user = await signer1.authenticate({ type: "email", email: email1});
        setUser1(user);
    }

    const login1 = async () => {
        if (signer1 == null) {
            return;
        }
        const user = await signer1.authenticate({ type: "email", bundle: bundle1, orgId: orgId1});
        setUser1(user);
    }

    const signup2 = async () => {
        if (signer2 == null) {
            return;
        }
        const user = await signer2.authenticate({ type: "email", email: email2});
        setUser2(user);
    }

    const login2 = async () => {
        if (signer2 == null) {
            return;
        }
        const user = await signer2.authenticate({ type: "email", bundle: bundle2, orgId: orgId2});
        setUser2(user);
    }

    const logUser = async () => {
        console.log(user);
        console.log(user1);
        console.log(user2);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Passkey Signup</Card.Title>
                            <Card.Text>
                                <Button onClick={signup}>Signup</Button>
                            </Card.Text>
                            <Button onClick={() => logUser()}>Log user</Button>
                            {user && Object.keys(user).map((key) => <Card.Text>{key}: {user[key]}</Card.Text>)}
                            {(user && safeOperation) &&
                                <Button onClick={() => signOp(signer, safeOperation)}>Sign operation</Button>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Email {email1}</Card.Title>
                            <Card.Text>
                                <Button onClick={signup1}>Signup</Button>
                            </Card.Text>
                            <Input type="text" value={loginLink1} onChange={(e) => {
                                setLoginLink1(e.target.value)
                                const url = new URL(e.target.value)
                                setOrgId1(url.searchParams.get("orgId"))
                                setBundle1(url.searchParams.get("bundle"))
                            }}/>
                            <Card.Text>OrgId: {orgId1}</Card.Text>
                            <Card.Text>Bundle: {bundle1}</Card.Text>
                            {orgId1 && bundle1 && <Button onClick={login1}>Login</Button>}
                            {user1 && Object.keys(user1).map((key) => <Card.Text>{key}: {user1[key]}</Card.Text>)}
                            {(user1 && safeOperation) &&
                                <Button onClick={() => signOp(signer1, safeOperation)}>Sign operation</Button>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Email {email2}</Card.Title>
                            <Card.Text>
                                <Button onClick={signup2}>Signup</Button>
                            </Card.Text>
                            <Input type="text" value={loginLink2} onChange={(e) => {
                                setLoginLink2(e.target.value)
                                const url = new URL(e.target.value)
                                setOrgId2(url.searchParams.get("orgId"))
                                setBundle2(url.searchParams.get("bundle"))
                            }}/>
                            <Card.Text>OrgId: {orgId2}</Card.Text>
                            <Card.Text>Bundle: {bundle2}</Card.Text>
                            {orgId2 && bundle2 && <Button onClick={login2}>Login</Button>}
                            {user2 && Object.keys(user2).map((key) => <Card.Text>{key}: {user2[key]}</Card.Text>)}
                            {(user2 && safeOperation) &&
                                <Button onClick={() => signOp(signer2, safeOperation)}>Sign operation</Button>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <Card.Title>Multisigs account</Card.Title>
                        <Card.Text>
                            2 of 3 threshold of:
                            <br/>

                            {addr1}
                            <br/>

                            {addr2}
                            <br/>

                            {addr3}
                            <br/>
                            Deployed address: {multisigAddress}
                        </Card.Text>
                        <Button onClick={async () => {

                            const encodedSignatures = buildSignatureBytes(signatures)

                            console.log('encodedSignatures: ', encodedSignatures)

                            operation.signature = ethers.solidityPacked(
                                ['uint48', 'uint48', 'bytes'],
                                [0, 0, encodedSignatures]
                            )
                            console.log('op: ', operation)

                            const tx = await entryPoint.handleOps([operation], '0xeaBcd21B75349c59a4177E10ed17FBf2955fE697');
                            console.log('tx: ', tx)
                        }}>Push transaction</Button>
                    </Card.Body>
                </Card>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <Card.Title>Safe operation</Card.Title>
                        <Card.Text>
                            Transfer 1 BIC to 0xeaBcd21B75349c59a4177E10ed17FBf2955fE697
                        </Card.Text>
                        {operation && (<Card.Text>
                            Sender: {operation.sender}
                            <br/>
                            Nonce: {operation.nonce.toString()}
                            <br/>
                            Paymaster and data: {operation.paymasterAndData}
                            <br/>
                            Max priority fee per gas: {operation.maxPriorityFeePerGas}
                            <br/>
                            Max fee per gas: {operation.maxFeePerGas}
                            <br/>
                            Call gas limit: {operation.callGasLimit}
                            <br/>
                            Verification gas limit: {operation.verificationGasLimit}
                            <br/>
                            Pre verification gas: {operation.preVerificationGas}
                        </Card.Text>)}
                        <Card.Text>
                            Signature:
                        </Card.Text>
                        {signatures.map((signature) => (
                            <Card.Text>
                                {signature.signer}: {signature.data}
                            </Card.Text>
                        ))}
                        <Button onClick={() => initTransaction()}>Init transaction</Button>
                    </Card.Body>
                </Card>
            </Row>

            <Row>
                <div id="turnkey-iframe-container"/>
            </Row>

        </Container>
    );
};
