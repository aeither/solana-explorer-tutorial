import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { displayTimestampUtc } from "./utils/date";
import { Table, Tbody, Tr, Th, Td, Heading, VStack } from "@chakra-ui/react";

export const SAMPLE_HISTORY_HOURS = 6;

export type ClusterStats = {
  absoluteSlot: number;
  blockHeight: number | undefined;
  blockTime: number;
  currentEpoch: string;
  epochProgress: string;
};

export default function StatsCard() {
  const [clusterStats, setClusterStats] = useState<ClusterStats>();
  useEffect(() => {
    getClusterStats();
  }, []);
  async function getClusterStats() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url);

    const epochInfo = await connection.getEpochInfo();
    const blockTime = await connection.getBlockTime(epochInfo.absoluteSlot);
    const { blockHeight, absoluteSlot } = epochInfo;
    const currentEpoch = epochInfo.epoch.toString();
    const { slotIndex, slotsInEpoch } = epochInfo;
    const epochProgress = ((100 * slotIndex) / slotsInEpoch).toFixed(1) + "%";

    if (blockTime !== null) {
      const clusterStatsData = {
        absoluteSlot,
        blockHeight,
        blockTime: blockTime * 1000,
        currentEpoch,
        epochProgress,
      };
      setClusterStats(clusterStatsData);
    }
  }
  return (
    <VStack w="100%" align="start" background="white" rounded="lg" p="4">
      <Heading size="md">Cluster Stats</Heading>
      {clusterStats ? (
        <>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Slot</Td>
                <Td isNumeric>{clusterStats.absoluteSlot}</Td>
              </Tr>
              {clusterStats.blockHeight !== undefined && (
                <Tr>
                  <Td>Block height</Td>
                  <Td isNumeric>{clusterStats.blockHeight}</Td>
                </Tr>
              )}
              {clusterStats.blockTime && (
                <Tr>
                  <Td>Cluster time</Td>
                  <Td isNumeric>
                    {displayTimestampUtc(clusterStats.blockTime)}
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td>Epoch</Td>
                <Td isNumeric>{clusterStats.currentEpoch}</Td>
              </Tr>
              <Tr>
                <Td>Epoch progress</Td>
                <Td isNumeric>{clusterStats.epochProgress}</Td>
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
