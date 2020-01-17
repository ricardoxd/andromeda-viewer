import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { action as toggleMenu } from 'redux-burger-menu'

import TopBar from '../components/topBar'

import { logout } from '../actions/sessionActions'
import { showSignOutPopup } from '../actions/viewerAccount'

import { selectIsSignedIn, selectUserName, showPopup } from '../bundles/account'
import { selectOwnAvatarName } from '../bundles/names'
import { selectIsLoggedIn } from '../bundles/session'

export default function TopBarContainer (props) {
  const isSignedIn = useSelector(selectIsSignedIn)
  const userName = useSelector(selectUserName)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const avatarName = useSelector(selectOwnAvatarName)

  const dispatch = useDispatch()

  const doLogout = event => {
    event.preventDefault()
    dispatch(toggleMenu(false))
    dispatch(logout())
  }

  const doSignOutFromViewer = event => {
    event.preventDefault()
    dispatch(toggleMenu(false))
    dispatch(showSignOutPopup())
  }

  const doShowSignUpPopup = event => {
    event.preventDefault()
    dispatch(toggleMenu(false))
    dispatch(showPopup('signUp'))
  }

  const doShowSignInPopup = event => {
    event.preventDefault()
    dispatch(toggleMenu(false))
    dispatch(showPopup('signIn'))
  }

  return <TopBar
    isSignedIn={isSignedIn}
    userName={userName}
    isLoggedIn={isLoggedIn}
    avatarName={avatarName}
    signIn={doShowSignInPopup}
    signUp={doShowSignUpPopup}
    signOut={doSignOutFromViewer}
    logout={doLogout}
  />
}
