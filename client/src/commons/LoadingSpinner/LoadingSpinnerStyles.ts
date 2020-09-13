import { makeStyles } from "@material-ui/styles";

import { primaryBackgroundColor } from "styles/theme";

const useStyle = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backgroundColor: primaryBackgroundColor,
    opacity: "0.8 !important",
  },
});

export default useStyle;
