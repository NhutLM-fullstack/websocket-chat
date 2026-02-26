import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import './App.css'

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Array<{ user: string; message: string; type?: 'message' | 'system' }>>([])
  const [input, setInput] = useState('')
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)

  useEffect(() => {
    if (!username || !socket) return

    socket.on('newMessage', (data: { user: string; message: string }) => {
      setMessages((prev) => [...prev, { ...data, type: 'message' }])
    })

    socket.on('userConnected', (data: { user: string }) => {
      setMessages((prev) => [...prev, { user: 'System', message: `${data.user} joined the chat`, type: 'system' }])
    })

    socket.on('userDisconnected', (data: { user: string }) => {
      setMessages((prev) => [...prev, { user: 'System', message: `${data.user} left the chat`, type: 'system' }])
    })

    return () => {
      socket.off('newMessage')
      socket.off('userConnected')
      socket.off('userDisconnected')
    }
  }, [socket, username])

  const connect = (name: string) => {
    const newSocket = io('http://localhost:3000', {
      query: { username: name },
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      setUsername(name)
      setShowLoginForm(false)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(newSocket)
  }

  const sendMessage = () => {
    if (input.trim() && socket) {
      socket.emit('sendMessage', { message: input })
      setInput('')
    }
  }

  if (showLoginForm) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Chat Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') connect(username)
            }}
          />
          <button onClick={() => connect(username)}>Join Chat</button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Room</h1>
        <span className="user-info">{username} {isConnected ? '🟢' : '🔴'}</span>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type === 'system' ? 'system-message' : ''}`}>
              <span className="message-user">{msg.user}:</span>
              <span className="message-text">{msg.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  )
}

export default App
