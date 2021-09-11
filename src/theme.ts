import { extendTheme } from "@chakra-ui/react";

const BG_COLOR = "#FFF0FB";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: () => ({
    body: {
      bg: BG_COLOR,
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
