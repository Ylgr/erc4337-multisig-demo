import {AlchemySigner, User} from "@alchemy/aa-alchemy";
import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {Input} from "@alchemy/aa-alchemy/react";

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

    useEffect(() => {
        setSigner(
            new AlchemySigner({
                client: {
                    connection: {
                        apiKey: process.env.VITE_ALCHEMY_API_KEY,
                    },
                    iframeConfig: {
                        iframeContainerId: "turnkey-iframe-container0",
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
                        iframeContainerId: "turnkey-iframe-container1",
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
                        iframeContainerId: "turnkey-iframe-container2",
                    },
                }
            })
        );
    }, []);

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
            // username: "testuser",
        });
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
                <Card>
                    <Card.Body>
                        <Card.Title>Passkey Signup</Card.Title>
                        <Card.Text>
                            <Button onClick={signup}>Signup</Button>
                        </Card.Text>
                        <Button onClick={() => logUser()}>Log user</Button>
                        <div id="turnkey-iframe-container0"/>
                        {user && Object.keys(user).map((key) => <Card.Text>{key}: {user[key]}</Card.Text>)}
                    </Card.Body>
                </Card>
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
                        <div id="turnkey-iframe-container1"/>
                        {user1 && Object.keys(user1).map((key) => <Card.Text>{key}: {user1[key]}</Card.Text>)}
                    </Card.Body>
                </Card>
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
                        <div id="turnkey-iframe-container2"/>
                        {user2 && Object.keys(user2).map((key) => <Card.Text>{key}: {user2[key]}</Card.Text>)}
                    </Card.Body>
                </Card>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <Card.Title>Multisigs account</Card.Title>
                        <Card.Text>
                            2 of 3 threshold
                            Deployed address:
                        </Card.Text>
                        <Button>Create account</Button>
                    </Card.Body>
                </Card>
            </Row>

        </Container>
    );
};
