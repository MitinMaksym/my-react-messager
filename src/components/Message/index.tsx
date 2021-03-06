import React from 'react'

import { Time, IconReaded } from '..'
import isAudio from '../../utils/helpers/isAudio'
import { Avatar } from '../'
import { UserDataType, AttachmentServerType } from '../../types/types'

import classNames from 'classnames'
import { Popover, Button } from 'antd'

import './Message.scss'
import MessageAudio from '../MessageAudio'

const Render = require('react-emoji-render')
const Emoji = Render.Emojione

type Props = {
  id?: string
  key?: string
  alt?: string
  createdAt?: string
  text?: string
  user: UserDataType
  date?: Date
  isMe?: boolean
  attachments?: Array<AttachmentServerType>
  isTyping?: boolean
  readed?: boolean
  setImageUrl?: (url: string) => void
  onDeleteMessage?: (id: string) => void
}
const Message: React.FC<Props> = ({
  id,
  createdAt,
  text,
  user,
  date,
  isMe,
  attachments,
  isTyping,
  readed,
  setImageUrl,
  onDeleteMessage
}) => {
  const renderAttachment = (item: AttachmentServerType) => {
    if (item.ext !== 'webm') {
      return (
        <div key={item._id} className="message__attachments-item">
          {item.url && (
            <img
              src={item.url.replace(/http/, 'https')}
              alt={item.filename}
              onClick={() => {
                if (item.url) onShowImage(item.url)
              }}
            />
          )}
        </div>
      )
    } else {
      return <MessageAudio key={item._id} audioSrc={item.url ? item.url : ''} />
    }
  }

  let onShowImage = (url: string) => {
    if (setImageUrl) {
      setImageUrl(url)
    }
  }
  return (
    <div
      className={classNames('message', {
        'message--isme': isMe,
        'message--is-typing': isTyping,
        'message--image': attachments && attachments.length === 1 && !text,
        'message--is-audio': isAudio(attachments)
      })}
    >
      <div className="message__content">
        {isMe && readed !== undefined && (
          <IconReaded isMe={isMe} isReaded={readed} />
        )}
        {isMe && (
          <div className="message__icon-actions">
            <Popover
              content={
                <div>
                  <Button
                    onClick={(e) => {
                      if (onDeleteMessage && id) {
                        onDeleteMessage(id)
                      }
                    }}
                  >
                    Удалить сообщение
                  </Button>
                </div>
              }
              trigger="click"
            >
              <Button type="link" shape="circle" icon="ellipsis" />
            </Popover>
          </div>
        )}
        <div className="message__avatar">
          <Avatar user={user} />
        </div>
        <div className="message__info">
          {' '}
          {(isTyping || text) && (
            <div className="message__bubble">
              {text && <p className="message__text">{<Emoji text={text} />}</p>}

              {isTyping && (
                <div className="message__typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          )}
          {attachments && (
            <div className="message__attachments">
              {attachments.map((item) => renderAttachment(item))}
            </div>
          )}
          {date && createdAt && (
            <span className="message__date">
              <Time date={new Date(createdAt)} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
