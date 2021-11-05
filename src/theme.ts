import { extendTheme } from "@chakra-ui/react";

const BG_COLOR = "purple.300";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: () => ({
    body: {
      bg: BG_COLOR,
      color: "black",
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
