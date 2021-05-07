import { makeStyles } from "@material-ui/core/styles";
import themeInstance from "../../theme";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Link from "@material-ui/core/Link";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme: typeof themeInstance) => ({
  appBar: {
    color: theme.palette.common.white,
  },
  toolBar: {
    backgroundColor: theme.palette.common.black,
    justifyContent: "space-between",
  },
  leftContaienr: {
    flex: 1,
  },
  rightContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  homeLink: {
    fontSize: "1.25rem",
  },
  authLink: {
    cursor: "pointer",
  },
}));

export const Header = (): JSX.Element => {
  const styles = useStyles();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <AppBar
      className={styles.appBar}
      elevation={0}
      position="sticky"
      sx={{ mb: 4 }}
    >
      <Toolbar className={styles.toolBar}>
        <div className={styles.leftContaienr}>
          <Link href="/" color="inherit" className={styles.homeLink}>
            Dataware Tools
          </Link>
        </div>
        <div className={styles.rightContainer}>
          {!isAuthenticated ? (
            <Link
              color="inherit"
              className={styles.authLink}
              onClick={() => {
                loginWithRedirect({ returnTo: window.location.href });
              }}
            >
              Login
            </Link>
          ) : (
            <Link
              color="inherit"
              className={styles.authLink}
              onClick={() => {
                logout({ returnTo: window.location.origin });
              }}
            >
              Logout
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
