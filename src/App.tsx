import "./styles.css";
import NavBar from "./NavBar";
import SearchCard from "./SearchCard";
import SupplyCard from "./SupplyCard";
import StatsCard from "./StatsCard";
import TpsCard from "./TpsCard";
import PriceCard from "./PriceCard";
import BalanceCard from "./BalanceCard";
import { Container } from "@chakra-ui/react";

export default function App() {
  return (
    <>
      <NavBar />
      <Container maxW="3xl">

        {/* Get SOL price from Coingecko */}
        <PriceCard />

        {/* Get Data from web3js */}
        <SupplyCard />
        <StatsCard />
        <TpsCard />

        {/* Try examples addresses and Txs with Search */}
        {/* <p>Spl Mint (Token): 2Zzh3VH5T3smrkp4BtKFtszN3Mt7aAr6bUy6LQVc8ZKi</p>
        <p>Spl Account: D5duahBbnCDKkge82PhJbQjvisDqdnMJYVciod5PyH4J</p>
        <p>
          Tx:
          4Rk1q5xG7gURFhLhHH3QGTWpsJCfPiHgj8rbKc2kcCiFkGozjBUNbWuHGfxkfsev1jGhWkvrQusgByT1Gf7GQEDm
        </p> */}
        <SearchCard />

        {/* Get user SOL balance with Phantom Wallet */}
        <BalanceCard />
      </Container>
    </>
  );
}
