import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { queryAtom } from "../state/searchValue";

import { Table, Tbody, Tr, Td, Heading, VStack } from "@chakra-ui/react";

export type Confirmations = number | "max";
export type Timestamp = number | "unavailable";

export type Data = {
  signature: string;
  info: {
    slot: number;
    timestamp: Timestamp;
    confirmations: Confirmations;
    confirmationStatus: "processed" | "confirmed" | "finalized" | undefined;
    result: {
      err: string | {} | null;
    };
  } | null;
};

export default function TxDetailsCard() {
  const [query] = useAtom(queryAtom);
  const [txData, setTxData] = useState<Data>();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");

    let data;
    try {
      if (query.searchValue !== undefined) {
        const { value } = await connection.getSignatureStatus(
          query.searchValue,
          {
            searchTransactionHistory: true,
          }
        );

        let info = null;
        if (value !== null) {
          let confirmations: Confirmations;
          if (typeof value.confirmations === "number") {
            confirmations = value.confirmations;
          } else {
            confirmations = "max";
          }

          let blockTime = null;
          try {
            blockTime = await connection.getBlockTime(value.slot);
          } catch (error) {
            console.log(error);
          }
          let timestamp: Timestamp =
            blockTime !== null ? blockTime : "unavailable";

          info = {
            slot: value.slot,
            timestamp,
            confirmations,
            confirmationStatus: value.confirmationStatus,
            result: { err: value.err },
          };
        }
        console.log("info", info);
        data = { signature: query.searchValue, info };
        setTxData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack my="2" w="100%" align="start" background="white" rounded="lg" p="4">
      <Heading size="md">Transaction</Heading>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td fontSize="sm">Signature</Td>
            <Td>{query.searchValue?.substr(0, 20)}...</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm">Result</Td>
            <Td>{txData?.info?.result.err ? "Failed" : "Success"}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm">Timestamp</Td>
            <Td>
              {txData?.info?.timestamp !== "unavailable" ? (
                <p>{txData?.info?.timestamp}</p>
              ) : (
                <p>Unavailable</p>
              )}
            </Td>
          </Tr>
          <Tr>
            <Td fontSize="sm">Confirmation Status</Td>
            <Td>{txData?.info?.confirmationStatus || "Unknown"}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm">Confirmations</Td>
            <Td>{txData?.info?.confirmations}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm">Block</Td>
            <Td>{txData?.info?.slot}</Td>
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
}
