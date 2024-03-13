import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers";

export default function LotteryEntrance() {

    // const [provider, setProvider] = useState(null);

    // useEffect(() => {
    //   const initializeProvider = async () => {
    //     if (window.ethereum) {
    //       await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       const provider = new ethers.providers.Web3Provider(window.ethereum);
    //       setProvider(provider);
    //     }
    //   };

    //   initializeProvider();
    // }, []);



    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [numMoneyGathered, setMoneyGathered] = useState("0")
    const [owner1, setOwner1] = useState("0")
    const { account } = useMoralis()

    const dispatch = useNotification()

    const {
        runContractFunction: enter,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enter",
        msgValue: "100000000000000000",
        params: {},
    })

    /* View Functions */

    const { runContractFunction: owner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "owner",
        params: {},
    })

    const { runContractFunction: getPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getPlayers",
        params: {},
    })

    const { runContractFunction: winner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "winner",
        params: {},
    })

    const { runContractFunction: pickWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "pickWinner",
        params: {},
    })



    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const recentWinnerFromCall = await winner()
        const owner1 = await owner()
        const numPlayersFromCallv1 = await getPlayers()
        const numPlayersFromCall = numPlayersFromCallv1.length
        const numMoneyGathered = (numPlayersFromCallv1.length * 0.1).toString()

        setMoneyGathered(numMoneyGathered)
        setOwner1(owner1)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }

    }

    console.log(owner1)
    return (

        <div className="p-5">


            <div class="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="p-8 rounded-t-xl" src="https://i.ibb.co/3y0SGCH/winner-nft.webp" alt="product image" />
                </div>
                <div class="px-5 pb-5">
                    <div>
                        <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Raffle Proof System's NFT</h5>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-l font-bold text-gray-900 dark:text-white">Entrance Fee: 0.1 ETH</span>
                        {raffleAddress ? (
                            <>
                                {//END RAFFLE BUTTON
                                    owner1.toLowerCase() == account ? (<button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                        onClick={async () => {
                                            try {
                                                await pickWinner({
                                                    onSuccess: async (result) => {
                                                        handleSuccess(result);
                                                    },
                                                    onError: (error) => console.log(error),
                                                });
                                            } catch (error) {
                                                // Handle any errors that might occur during pickWinner or sendPacket execution
                                                console.error("An error occurred:", error);
                                            }
                                        }}

                                        disabled={isLoading || isFetching}
                                    >
                                        {isLoading || isFetching ? (
                                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                        ) : (
                                            "End Raffle"
                                        )}
                                    </button>) : (<button></button>)}

                                {//ENTER RAFFLE BUTTON
                                    recentWinner == "0x0000000000000000000000000000000000000000" ? (<button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                        onClick={async () =>
                                            await enter({
                                                // onComplete:
                                                // onError:
                                                onSuccess: handleSuccess,
                                                onError: (error) => console.log(error),
                                            })
                                        }
                                        disabled={isLoading || isFetching}
                                    >
                                        {isLoading || isFetching ? (
                                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                        ) : (
                                            "Enter Raffle"
                                        )}
                                    </button>) : (<button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                        onClick={async () =>
                                            await enter({
                                                // onComplete:
                                                // onError:
                                                onSuccess: handleSuccess,
                                                onError: (error) => console.log(error),
                                            })
                                        }
                                        disabled={isLoading || isFetching}
                                    >
                                        {isLoading || isFetching ? (
                                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                        ) : (
                                            "Raffle Ended Congrats!"
                                        )}
                                    </button>)}
                            </>

                        ) : (
                            <div class="text-l font-bold text-gray-900 dark:text-white">Please connect to OP Sepolia </div>
                        )}


                    </div>

                    <div className="mt-5">
                        <div class="text-l font-bold text-gray-900 dark:text-white mb-1">The current number of players is: {numberOfPlayers}</div>
                        <div class="text-l font-bold text-gray-900 dark:text-white mb-1">Total Pot: {numMoneyGathered} ETH</div>
                        {recentWinner != "0x0000000000000000000000000000000000000000" ? (<div class="text-l font-bold text-gray-900 dark:text-white">Current Winner: {recentWinner}</div>
                        ) : (<div class="text-2xl mt-5 font-bold text-gray-900 dark:text-white">Raffle is LIVE!</div>
                        )
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
