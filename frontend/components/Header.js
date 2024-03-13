import { ConnectButton } from "web3uikit"

export default function Header() {
    return (

        <>
            {/* <section class="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">

                    <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">We invest in the world’s potential</h1>
                    <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">Join the raffle and win the NFT.</p>

                </div>
                <div class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
            </section> */}




            <nav className="p-5 border-b-2 flex flex-row">
                <h1 className="py-4 px-4 font-bold text-3xl"> Raffle Proof System</h1>
                <div className="ml-auto py-2 px-4">
                    <ConnectButton moralisAuth={false} />
                </div>
            </nav></>
    )
}