import Head from "next/head"
import { useAccount, useSigner } from "wagmi"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { AppProps } from "next/app"
const AuthWrapper = (props) => {
    // const {Component, pageProps} = props
    const router = useRouter()
    const { data: signer } = useSigner()

    const { isConnected, isDisconnected, status } = useAccount()

    useEffect(() => {
        console.log(signer)
        if (isDisconnected && router.pathname !== "/" && router.pathname !== "/registration") {
            console.log("reached")
            router.push("/")
        }
    }, [status])

    return (
        <>
            {isConnected
                ? props.children
                : router.pathname === "/" || router.pathname === "/registration"
                ? props.children
                : null}
        </>
    )
}

export default AuthWrapper
