import {
  Connection,
  clusterApiUrl,
  PublicKey,
  ConfirmedSignatureInfo,
} from "@solana/web3.js";
import { useEffect, useState, useMemo } from "react";
import Moment from "react-moment";
import { Table, Tbody, Tr, Td, Heading, VStack } from "@chakra-ui/react";

export type History = {
  fetched: ConfirmedSignatureInfo[];
};

export default function HistoryCard({ pubkey }: { pubkey: PublicKey }) {
  const [history, setHistory] = useState<History>();
  useEffect(() => {
    getHistory();
  }, [pubkey]);

  async function getHistory() {
    console.log("Hello");
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url);
    const options = {
      limit: 25,
    };
    const fetched = await connection.getConfirmedSignaturesForAddress2(
      pubkey,
      options
    );

    setHistory({ fetched });
    console.log(fetched);
  }

  return (
    <VStack my="2" w="100%" align="start" background="white" rounded="lg" p="4">
      <Heading size="md">History</Heading>
      {history?.fetched ? (
        <>
          <Table variant="simple">
            <Tbody>
              {history.fetched.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="sm" isTruncated>
                    {item.signature.substr(0, 20)}...
                  </Td>
                  <Td>{item.slot}</Td>

                  <Td isNumeric>
                    {item?.blockTime ? (
                      <Moment date={item.blockTime * 1000} fromNow />
                    ) : (
                      ""
                    )}
                  </Td>
                  <Td>{item?.err ? "Failed" : "Success"}</Td>
                  <Td>{item?.memo ? item.memo : ""}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <p> No History </p>
      )}
    </VStack>
  );
}
