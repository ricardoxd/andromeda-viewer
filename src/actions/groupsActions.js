// All group related actions

import { startNewIMChat } from './chatMessageActions'

import { getAgentId, getSessionId } from '../selectors/session'
import { getOwnAvatarName } from '../selectors/names'
import { getPosition } from '../selectors/region'

import { IMDialog } from '../types/chat'

export function startGroupChat (groups) {
  return (dispatch, getState, { circuit }) => {
    const activeState = getState()

    const AgentData = [
      {
        AgentID: getAgentId(activeState),
        SessionID: getSessionId(activeState)
      }
    ]
    const position = getPosition(activeState)
    const agentName = getOwnAvatarName(activeState).getFullName()
    const time = new Date()

    groups.forEach(group => {
      circuit.send('ImprovedInstantMessage', {
        AgentData,
        MessageBlock: [
          {
            ToAgentID: group.id,
            Position: position,
            Dialog: IMDialog.SessionGroupStart,
            ID: group.id,
            Timestamp: Math.floor(time.getTime() / 1000),
            FromAgentName: agentName
          }
        ]
      }, true)

      dispatch(startNewIMChat(15, group.id, group.name))
    })

    dispatch({
      type: 'ChatSessionsStarted',
      chatUUIDs: groups.map(group => group.id)
    })
  }
}

export function acceptGroupInvitation (transactionId, groupId) {
  return (dispatch, getState, { circuit }) => {
    const activeState = getState()

    circuit.send('ImprovedInstantMessage', {
      AgentData: [
        {
          AgentID: getAgentId(activeState),
          SessionID: getSessionId(activeState)
        }
      ],
      MessageBlock: [
        {
          ToAgentID: groupId,
          Dialog: IMDialog.GroupInvitationAccept,
          ID: transactionId,
          Timestamp: Math.floor(Date.now() / 1000),
          FromAgentName: getOwnAvatarName(activeState).getFullName()
        }
      ]
    }, true)
  }
}

export function declineGroupInvitation (transactionId, groupId) {
  return (dispatch, getState, { circuit }) => {
    const activeState = getState()

    circuit.send('ImprovedInstantMessage', {
      AgentData: [
        {
          AgentID: getAgentId(activeState),
          SessionID: getSessionId(activeState)
        }
      ],
      MessageBlock: [
        {
          ToAgentID: groupId,
          Dialog: IMDialog.GroupInvitationDecline,
          ID: transactionId,
          Timestamp: Math.floor(Date.now() / 1000),
          FromAgentName: getOwnAvatarName(activeState).getFullName()
        }
      ]
    }, true)
  }
}
