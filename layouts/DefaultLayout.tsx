import { Footer } from "components/Footer"
import { Navigation } from "components/Navigation"
import Head from "next/head"
import { PropsWithChildren } from "react"


export const DefaultLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <Head>
        <title>Cardano Starter Kit</title>

        <meta name="description" content="Build Web3 applications on Cardano" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="px-4 w-full">
  <Navigation />

  <main
    className="min-h-[calc(100vh-295px)] pt-12 rounded-lg mt-5 w-full"
    style={{
      background: 'linear-gradient(to bottom, #001f3f, #0d47a1)' // Adjust colors as needed
    }}
  >
    {children}
  </main>

  <Footer />
</div>

    </>
  )
}
