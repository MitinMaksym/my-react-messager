import React, { useEffect } from 'react'
import { Icon } from 'antd'
import { Messages, ChatInput, Sidebar } from '../../containers'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { dialogsActions, messagesActions } from '../../redux/actions'
import './Home.scss'
import { signOut } from '../../redux/actions/user'
import { DialogType, MessageType } from '../../types/types'
import { AppStateType } from '../../redux/reduces'
import { Status } from '../../components'

type MapStatePropsType = {
  fullname: string
  userId: string
  currentDialogId: string
  dialogs: Array<DialogType>
}

type MapDispatchPropsType = {
  setCurrentDialog: (id: string) => void
  setDialogsItems: (items: Array<DialogType>) => void
  signOut: () => void
  setMessagesItems: (items: Array<MessageType>) => void
}

type OwnPropsType = RouteComponentProps<any>

type Props = MapStatePropsType & MapDispatchPropsType & OwnPropsType
const Home: React.FunctionComponent<Props> = (props) => {
  let {
    setCurrentDialog,
    setDialogsItems,
    setMessagesItems,
    userId,
    fullname,
    dialogs,
    currentDialogId,
    signOut
  } = props
  let onSignOut = () => {
    let check = window.confirm(
      `${fullname}, вы уверенны что хотите выйти из аккаунта?`
    )
    if (check) {
      signOut()
      setDialogsItems([])
      setMessagesItems([])
      setCurrentDialog('')
    }
  }
  useEffect(() => {
    return () => {
      props.history.push('/')
    }
  }, [props.history])
  useEffect(() => {
    let path = props.location.pathname
    let dialogId = path.split('/').pop()
    if (dialogId && dialogId.length === 24) {
      setCurrentDialog(dialogId)
    }
  }, [props.location.pathname, setCurrentDialog])

  let currentDialogObj = dialogs.find((item: DialogType) => {
    return item._id === currentDialogId
  })
  return (
    <section className="home">
      <div className="chat">
        <Sidebar />
        <div className="chat__dialog">
          <div className="chat__dialog-header">
            <div />
            <Status
              userId={userId}
              currentDialogId={currentDialogId}
              currentDialogObj={currentDialogObj!}
            />
            <div>
              <Icon
                style={{
                  fontSize: '20px',
                  marginRight: '10px',
                  color: '#389990',
                  cursor: 'pointer'
                }}
                type="logout"
                onClick={onSignOut}
              />
            </div>
          </div>
          <Messages />
          <div className="chat__dialog-input">
            <ChatInput />
          </div>
        </div>
      </div>
    </section>
  )
}
export default withRouter(
  connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(
    ({ user, dialogs }) => ({
      fullname: user.data ? user.data.fullname : '',
      userId: user.data ? user.data._id : '',
      currentDialogId: dialogs.currentDialogId,
      dialogs: dialogs.items
    }),
    {
      setCurrentDialog: dialogsActions.setCurrentDialog,
      setDialogsItems: dialogsActions.setItems,
      signOut,
      setMessagesItems: messagesActions.setMessages
    }
  )(Home)
)
