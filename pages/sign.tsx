import { listAssets } from "hooks/use-assets"
import { useCardano, utility } from "use-cardano"
import { isNil } from "lodash"
import { Inter } from "@next/font/google"
import styles from "../styles/index.module.css"
import { lovelaceToAda } from "lib/lovelace-to-ada"


const inter = Inter({ subsets: ["latin"] })
  const Index = () => {
    const { lucid, account, showToaster, hideToaster } = useCardano()
    const { lovelace, assets } = listAssets(lucid)
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Listing Assets Example</h1>
  
        {lovelace > 0 && <div>ADA: {lovelaceToAda(lovelace)}</div>}
  
        <div>
          <ul className={styles.list}>
            {assets.map((a) => {
              const name = a.metadata?.name || a.onchain_metadata?.name || ""
  
              return (
                <li key={a.asset}>
                  <div>
                    {name}
  
                    {Number(a.quantity) > 1 &&
                      ` (${lovelaceToAda(
                        Number(a.quantity) / Math.pow(10, a.metadata?.decimals || 0)
                      )})`}
                  </div>
  
                  {!isNil(a.metadata?.logo) && (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        width="64"
                        height="auto"
                        alt={`${name} logo`}
                        src={`data:image/png;base64,${a.metadata?.logo}`}
                      />
                    </div>
                  )}
  
                  {!isNil(a.onchain_metadata?.image) && (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        width="64"
                        height="auto"
                        alt={`${name} NFT`}
                        src={(a.onchain_metadata?.image as string).replace(
                          "ipfs://",
                          "https://ipfs.blockfrost.dev/ipfs/"
                        )}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
  
  export default Index