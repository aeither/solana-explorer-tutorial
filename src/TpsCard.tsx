import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
} from "@chakra-ui/react";

export const SAMPLE_HISTORY_HOURS = 6;

export type TpsStats = {
  transactionCount: number;
  averageTps: string;
};

export default function TpsCard() {
  const [tpsStats, setTpsStats] = useState<TpsStats>();
  useEffect(() => {
    getTpsStats();
  },[]);
  async function getTpsStats() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url);
    const samples = await connection.getRecentPerformanceSamples(
      60 * SAMPLE_HISTORY_HOURS
    );
    let short = samples
      .filter((sample) => {
        return sample.numTransactions !== 0;
      })
      .map((sample) => {
        return sample.numTransactions / sample.samplePeriodSecs;
      });
    const avgTps = short[0];

    const transactionCount = await connection.getTransactionCount();
    const averageTps = Math.round(avgTps).toLocaleString("en-US");

    // console.log(samples);
    const tpsData = {
      transactionCount,
      averageTps,
    };
    setTpsStats(tpsData);
  }
  return (
    <VStack my="2" w="100%" align="start" background="white" rounded="lg" p="4">
      <Heading size="md">Transaction Stats</Heading>
      {tpsStats ? (
        <>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Transaction count</Td>
                <Td isNumeric>{tpsStats.transactionCount}</Td>
              </Tr>
              <Tr>
                <Th>Transactions per second (TPS)</Th>
                <Th isNumeric>{tpsStats.averageTps}</Th>
              </Tr>
            </Tbody>
          </Table>
        </>
      ) : (
        <p>No Data</p>
      )}
    </VStack>
  );
}
