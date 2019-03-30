/*
 * Entry-point into the app on the client side
 *
 */

import React from 'react'
import { connect } from 'react-redux'

import { AppContainer, LoadableChatComponent } from '../components/main'
import LoginForm from '../components/login/'
import PopupRenderer from '../components/popups/'
import Helmet from './helmet'

import TopMenuBar from './topMenuBar'

import {
  closePopup,
  isSignedIn,
  unlock,
  showResetPassword,
  changeEncryptionPassword,
  showSignInPopup,
  signIn,
  signUp,
  signOut
} from '../actions/viewerAccount'
import { login } from '../actions/sessionActions'

import {
  getIsSignedIn,
  getSavedAvatars,
  getSavedGrids
} from '../selectors/viewer'
import { getIsLoggedIn } from '../selectors/session'
import { selectPopup, selectPopupData } from '../selectors/popup'

const Popups = React.memo(PopupRenderer)

class App extends React.PureComponent {
  componentDidMount () {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.isSignedIn) return // component was hot reloaded
    }

    this.props.getIsSignedIn()
  }

  render () {
    const isLoggedIn = this.props.isLoggedIn
    const mainSection = isLoggedIn
      ? <LoadableChatComponent />
      : <LoginForm
        login={this.props.login}
        isSignedIn={this.props.isSignedIn}
        avatars={this.props.avatars}
        grids={this.props.grids}
        showSignInPopup={this.props.showSignInPopup}
      />

    return <AppContainer>
      <Helmet />
      {mainSection}
      <TopMenuBar />
      <Popups
        popup={this.props.popup}
        closePopup={this.props.closePopup}
        displayResetPassword={this.props.showResetPassword}
        data={this.props.popupData}
        signUp={this.props.signUp}
        signIn={this.props.signIn}
        unlock={this.props.unlock}
        signOut={this.props.signOut}
        changePassword={this.props.changeEncryptionPassword}
      />
    </AppContainer>
  }
}

const mapStateToProps = state => {
  return {
    avatars: getSavedAvatars(state),
    grids: getSavedGrids(state),
    isLoggedIn: getIsLoggedIn(state), // Avatar session
    isSignedIn: getIsSignedIn(state), // Viewer account
    popup: selectPopup(state),
    popupData: selectPopupData(state)
  }
}

const mapDispatchToProps = {
  closePopup,
  getIsSignedIn: isSignedIn,
  showSignInPopup,
  showResetPassword,
  changeEncryptionPassword,
  unlock,
  signIn, // For viewer-account (to sync)
  signUp,
  signOut,
  login // For Avatar
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
