import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import withStateHandlers from 'recompose/withStateHandlers';

import { getSignedInUser, getIsAuthLoading } from '../selectors';
import { submitDisplayNameUpdate } from '../actions';
import googleLogo from '../images/google.svg';

const signIn = (login, toggleDrawer, showError) => () => {
  login({ provider: 'google' })
    .then(toggleDrawer)
    .catch(err => showError(`Error ${err.code}: ${err.message}`));
};

const signOut = (logout, toggleDrawer, showError) => () => {
  logout()
    .then(toggleDrawer)
    .catch(err => showError(`Error ${err.code}: ${err.message}`));
};


const SignInButton = (props) => {
  const {
    signedInUser,
    isLoading,
    isOpenDrawer,
    displayName,
    displayNameError,
    errorMsg,
    firebase,
    classes,
    toggleDrawer,
    showError,
    updateDisplayName,
    submitDisplayNameUpdate,
  } = props;
  return (
    <Fragment>
      <Button className={classes.signIn} variant="outlined" onClick={toggleDrawer}>
        { isLoading
          ? (
            <Fragment>
              <CircularProgress className={classes.avatar} size={15} />
              <span className={classes.name}>Chargement...</span>
            </Fragment>
          )
          : (signedInUser
            ? (
              <Fragment>
                <img alt="" src={signedInUser.photoURL} className={classes.avatar} />
                <Hidden xsDown>
                  <span className={classes.name}>{signedInUser.displayName}</span>
                </Hidden>
              </Fragment>
            )
            : 'Connexion'
          )
        }
      </Button>

      <Drawer anchor="right" open={isOpenDrawer} onClose={toggleDrawer}>
        { signedInUser
          ? (
            <List
              subheader={<ListSubheader>{signedInUser.displayName}</ListSubheader>}
              className={classes.list}
            >
              <ListItem>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (displayNameError) return;
                    submitDisplayNameUpdate(displayName);
                    toggleDrawer();
                  }}
                >
                  <TextField
                    error={!!displayNameError}
                    label={displayNameError || 'Changer pseudo'}
                    value={typeof displayName === 'string' ? displayName : signedInUser.displayName}
                    onChange={updateDisplayName}
                  />
                </form>
              </ListItem>
              <ListItem button onClick={signOut(firebase.logout, toggleDrawer, showError)}>
                <ListItemText primary="D&eacute;connexion" />
              </ListItem>
            </List>
          ) : (
            <List
              subheader={<ListSubheader>Se connecter avec</ListSubheader>}
              className={classes.list}
            >
              <ListItem button onClick={signIn(firebase.login, toggleDrawer, showError)}>
                <ListItemIcon><img src={googleLogo} alt="google logo" height="24" /></ListItemIcon>
                <ListItemText primary="Google" />
              </ListItem>
            </List>
          )}
      </Drawer>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => showError(null)}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        message={<span id="message-id">{errorMsg}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => showError(null)}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Fragment>
  );
};

const styles = {
  signIn: {
    position: 'absolute',
    right: '20px',
    top: '20px',
    color: 'white',
    minWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  list: {
    width: '250px',
  },
  avatar: {
    width: '20px',
  },
  name: {
    marginLeft: '10px',
  },
};

const StyledSignInButton = withStyles(styles)(SignInButton);

const validateDisplayName = (name) => {
  if (name.match(/[^a-zA-Z0-9\-' ]/)) return 'Pas de carac spéciaux';
  if (name.length < 3) return 'Trop court (4 min)';
  if (name.length > 20) return 'Trop long (20 max)';
  if (name.match(/^ /)) return 'Espace en début';
  if (name.match(/ $/)) return 'Espace en fin';
  if (name.match(/ {2}/)) return 'Double espace';
  return null;
};

const StatefulSignInButton = withStateHandlers(
  ({ signedInUser }) => ({
    isOpenDrawer: false,
    displayName: signedInUser && signedInUser.displayName,
    displayNameError: null,
  }),
  {
    toggleDrawer: ({ isOpenDrawer, displayName, displayNameError }) => () => ({
      isOpenDrawer: !isOpenDrawer,
      // reset field on drawer close
      displayName: isOpenDrawer ? displayName : null,
      displayNameError: isOpenDrawer ? displayNameError : null,
    }),
    showError: () => msg => ({ errorMsg: msg }),
    updateDisplayName: () => (e) => {
      const displayName = e.target.value;
      return { displayName, displayNameError: validateDisplayName(displayName) };
    },
  },
)(StyledSignInButton);

const mapStateToProps = state => ({
  signedInUser: getSignedInUser(state),
  isLoading: getIsAuthLoading(state),
});

const mapDispatchToProps = { submitDisplayNameUpdate };

const ConnectedSignInButton = compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(StatefulSignInButton);

export default ConnectedSignInButton;
