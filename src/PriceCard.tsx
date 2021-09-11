import { useState } from "react";
import { abbreviatedNumber } from "./utils/index";
import { Heading, Text, VStack, Tag, Box } from "@chakra-ui/react";
import { useEffect } from "react";

export interface CoinInfo {
  price: number;
  volume_24: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  last_updated: Date;
}

export enum CoingeckoStatus {
  Success,
  FetchFailed,
  Loading,
}

export type CoinGeckoResult = {
  coinInfo?: CoinInfo;
  status: CoingeckoStatus;
};

export interface CoinInfoResult {
  market_data: {
    current_price: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap_rank: number;
  };
  last_updated: string;
}

export default function PriceCard() {
  const [coinInfo, setCoinInfo] = useState<CoinGeckoResult>();
  const coinId = "solana";
  useEffect(() => {
    getPrice();
  }, []);
  function getPrice() {
    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
      .then((res) => res.json())
      .then((info: CoinInfoResult) => {
        setCoinInfo({
          coinInfo: {
            price: info.market_data.current_price.usd,
            volume_24: info.market_data.total_volume.usd,
            market_cap: info.market_data.market_cap.usd,
            market_cap_rank: info.market_data.market_cap_rank,
            price_change_percentage_24h:
              info.market_data.price_change_percentage_24h,
            last_updated: new Date(info.last_updated),
          },
          status: CoingeckoStatus.Success,
        });
      })
      .catch((error: any) => {
        setCoinInfo({
          status: CoingeckoStatus.FetchFailed,
        });
      });
  }

  return (
    <VStack align="start" background="white" rounded="lg" p="4" mt="4">
      {coinInfo?.coinInfo && (
        <>
          <Heading size="md">
            Price{" "}
            <Tag colorScheme="green">
              Rank #{coinInfo.coinInfo.market_cap_rank}
            </Tag>
          </Heading>
          <Text fontSize="lg" fontWeight="bold">
            ${coinInfo.coinInfo.price.toFixed(2)}{" "}
            {coinInfo.coinInfo.price_change_percentage_24h > 0 && (
              <Box as="span" color="green" fontSize="sm">
                &uarr;{" "}
                {coinInfo.coinInfo.price_change_percentage_24h.toFixed(2)}%
              </Box>
            )}
            {coinInfo.coinInfo.price_change_percentage_24h < 0 && (
              <Box as="span" color="red" fontSize="sm">
                &darr;{" "}
                {coinInfo.coinInfo.price_change_percentage_24h.toFixed(2)}%
              </Box>
            )}
            {coinInfo.coinInfo.price_change_percentage_24h === 0 && (
              <Box as="span" fontSize="sm">
                0%
              </Box>
            )}
          </Text>
          <Text>
            24h Vol: <em>${abbreviatedNumber(coinInfo.coinInfo.volume_24)}</em>{" "}
            MCap: <em>${abbreviatedNumber(coinInfo.coinInfo.market_cap)}</em>
          </Text>
        </>
      )}
    </VStack>
  );
}
