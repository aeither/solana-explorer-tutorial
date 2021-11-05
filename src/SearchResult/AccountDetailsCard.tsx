import { PublicKey } from "@solana/web3.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { queryAtom } from "../state/searchValue";
import HistoryCard from "./HistoryCard";
import { Table, Tbody, Tr, Th, Td, Heading, VStack } from "@chakra-ui/react";
export type DataDetails = {
  program: string;
  parsed: {
    info: {
      decimals?: number;
      freezeAuthority?: string;
      isInitialized?: boolean;
      mintAuthority?: string;
      supply?: string;
      isNative?: false;
      mint?: string;
      owner?: string;
      state?: string;
      tokenAmount?: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
      };
    };
    type: string;
  };
};

export type Data = {
  pubkey: PublicKey;
  lamports: number;
  details?: {
    space: number;
    executable: boolean;
    owner: PublicKey;
    data?: DataDetails;
  };
};

export function AccountHeader({ data }: { data?: Data }) {
  const [detailsData, setDetailsData] = useState<DataDetails>();

  useEffect(() => {
    setDetailsData(data?.details?.data);
    console.log("detatailsData", detailsData);
  }, [data]);
  const isToken =
    detailsData?.program === "spl-token" && detailsData?.parsed.type === "mint";

  if (isToken) {
    return (
      <VStack
        my="2"
        w="100%"
        align="start"
        background="white"
        rounded="lg"
        p="4"
      >
        <Heading size="md">Token Account</Heading>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>Address</Td>
              <Td isNumeric>{data?.pubkey.toBase58()}</Td>
            </Tr>
            <Tr>
              <Td>Current Supply</Td>
              <Td isNumeric>{detailsData?.parsed.info.supply}</Td>
            </Tr>
            <Tr>
              <Td>Mint Authority</Td>
              <Td isNumeric>{detailsData?.parsed.info.mintAuthority}</Td>
            </Tr>
            <Tr>
              <Td>Decimals</Td>
              <Td isNumeric>{detailsData?.parsed.info.decimals}</Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    );
  }

  return (
    <VStack my="2" w="100%" align="start" background="white" rounded="lg" p="4">
      <Heading size="md">Account</Heading>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td>Address</Td>
            <Td isNumeric>{data?.pubkey.toBase58()}</Td>
          </Tr>
          <Tr>
            <Td>Mint</Td>
            <Td isNumeric>{detailsData?.parsed.info.mint}</Td>
          </Tr>
          <Tr>
            <Td>Owner</Td>
            <Td isNumeric>{detailsData?.parsed.info.owner}</Td>
          </Tr>
          <Tr>
            <Td>State</Td>
            <Td isNumeric>{detailsData?.parsed.info.state}</Td>
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
}

export default function AccountDetailsCard() {
  const [query] = useAtom(queryAtom);
  const [data, setData] = useState<Data>();
  let pubkey: PublicKey | undefined;

  useEffect(() => {
    getData();
  }, [query.searchValue]);

  async function getData() {
    const url = clusterApiUrl("devnet").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");

    try {
      if (query.searchValue !== undefined) {
        pubkey = new PublicKey(query.searchValue);
        const result = (await connection.getParsedAccountInfo(pubkey)).value;

        let lamports, details;
        if (result === null) {
          lamports = 0;
        } else {
          lamports = result.lamports;

          let space: number;
          if (!("parsed" in result.data)) {
            space = result.data.length;
          } else {
            space = result.data.space;
          }

          let data: DataDetails | undefined;
          if ("parsed" in result.data) {
            data = {
              program: result.data.program,
              parsed: result.data.parsed,
            };
            details = {
              space,
              executable: result.executable,
              owner: result.owner,
              data,
            };
          } else {
            details = {
              space,
              executable: result.executable,
              owner: result.owner,
            };
          }
        }
        setData({ pubkey, lamports, details });
        console.log("address", query.searchValue);
      }
    } catch (err) {}
  }

  return (
    <>
      {!data?.pubkey ? (
        <p>Not valid pubkey</p>
      ) : (
        <>
          <AccountHeader data={data} />
          <HistoryCard pubkey={data.pubkey} />
        </>
      )}
    </>
  );
}
