import React, { useState, useEffect } from 'react';
import { Chat, Channel, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

// const themes = [
//   'messaging light',
//   'messaging dark',
//   'team light',
//   'team dark',
//   'commerce light',
//   'commerce dark',
//   'livestream light',
//   'livestream dark',
// ];

export function ChatPanel({
  userId,
  userName,
  avatar,
  userToken,
  channelName,
}) {
  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_KEY);
  chatClient.setUser(
    {
      id: userId,
      name: userName,
      image: avatar,
    },
    userToken
  );
  const chatChannel = chatClient.channel('messaging', channelName);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    chatChannel.watch().then(() => {
      setLoaded(true);
    });
  }, [chatChannel]);

  // const chatTheme = themes[Math.floor(Math.random() * themes.length)];
  const chatTheme = 'livestream light';

  return (
    <React.Fragment>
      {loaded ? (
        <Chat client={chatClient} theme={chatTheme}>
          <Channel channel={chatChannel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      ) : null}
    </React.Fragment>
  );
}
