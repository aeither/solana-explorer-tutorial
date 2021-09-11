import "./styles.css";
import {
  Supply,
  Connection,
  clusterApiUrl,
  VoteAccountStatus,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  abbreviatedNumber,
  lamportsToSol,
} from "./utils/index";
import React from "react";
import { Heading, VStack, Text, HStack } from "@chakra-ui/react";

function displayLamports(value: number) {
  return abbreviatedNumber(lamportsToSol(value));
}

export default function SupplyCard() {
  const [supply, setSupply] = useState<Supply>();
  const [voteAccounts, setVoteAccounts] = useState<VoteAccountStatus>();
  useEffect(() => {
    getSupply();
  }, []);
  async function getSupply() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");
    const supply: Supply = (await connection.getSupply()).value;
    const voteAccounts = await connection.getVoteAccounts();
    setVoteAccounts(voteAccounts);
    setSupply(supply);
  }

  const delinquentStake = React.useMemo(() => {
    if (voteAccounts) {
      return voteAccounts.delinquent.reduce(
        (prev, current) => prev + current.activatedStake,
        0
      );
    }
  }, [voteAccounts]);

  const activeStake = React.useMemo(() => {
    if (voteAccounts && delinquentStake) {
      return (
        voteAccounts.current.reduce(
          (prev, current) => prev + current.activatedStake,
          0
        ) + delinquentStake
      );
    }
  }, [voteAccounts, delinquentStake]);

  let delinquentStakePercentage;
  if (delinquentStake && activeStake) {
    delinquentStakePercentage = ((delinquentStake / activeStake) * 100).toFixed(
      1
    );
  }

  return (
    <HStack py="2" spacing="2">
      <VStack w="100%" align="start" background="white" rounded="lg" p="4">
        <Heading size="md">Active Stake</Heading>
        {activeStake && supply && (
          <>
            <Text fontSize="lg" fontWeight="bold">
              <em>{displayLamports(activeStake)}</em> /{" "}
              <small>{displayLamports(supply.total)}</small>
            </Text>
            {delinquentStakePercentage && (
              <Text>
                24h Vol: Delinquent stake: <em>{delinquentStakePercentage}%</em>
              </Text>
            )}
          </>
        )}
      </VStack>
      <VStack w="100%" align="start" background="white" rounded="lg" p="4">
        <Heading size="md">Circulating Supply</Heading>
        {activeStake && supply && (
          <>
            <Text fontSize="lg" fontWeight="bold">
              <em>{displayLamports(supply.circulating)}</em> /{" "}
              <small>{displayLamports(supply.total)}</small>
            </Text>
            <Text>
              Non circulating <em>{displayLamports(supply.nonCirculating)}</em>
            </Text>
          </>
        )}
      </VStack>
    </HStack>
  );
}
