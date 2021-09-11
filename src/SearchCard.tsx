import { useForm } from "react-hook-form";
import bs58 from "bs58";
import { queryAtom } from "./state/searchValue";
import { useAtom } from "jotai";
import AccountDetailsCard from "./SearchResult/AccountDetailsCard";
import TxDetailsCard from "./SearchResult/TxDetailsCard";
import {
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

export default function SearchCard() {
  const [query, setQuery] = useAtom(queryAtom);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    const decoded = bs58.decode(data.query);
    if (decoded.length === 32) {
      setQuery({ searchValue: data.query, searchType: "address" });
      console.log(decoded);
    } else if (decoded.length === 64) {
      setQuery({ searchValue: data.query, searchType: "signature" });
      console.log(decoded);
    } else {
      console.log("Input not correct");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="query">Search for:</FormLabel>
          <Input id="query" placeholder="Search..." {...register("query")} />
        </FormControl>
        <Button mt={4} colorScheme="pink" type="submit">
          Search
        </Button>
      </form>
      {query?.searchType === "signature" ? (
        <TxDetailsCard />
      ) : (
        <AccountDetailsCard />
      )}
    </>
  );
}
