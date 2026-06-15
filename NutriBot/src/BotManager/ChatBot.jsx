import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function ChatBot({ setScreen }) {
  const user = getCurrentUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi, I am your NutriBot assistant. Ask me about meals, macros, or goals.' },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setMessages((currentMessages) => [...currentMessages, { role: 'user', text: userMessage }]);

    try {
      const reply = await NutriBotClientService.getBotReply(userMessage, user.id);
      setMessages((currentMessages) => [...currentMessages, { role: 'bot', text: reply }]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'bot', text: 'I could not load your nutrition data right now. Please try again soon.' },
      ]);
    }
  };

  return (
    <AppLayout title="AI Nutrition Assistant" setScreen={setScreen}>
      <Card title="Nutrition assistant prototype">
        <div className="mb-4 h-96 space-y-3 overflow-y-auto rounded-lg bg-slate-100 p-4">
          {messages.map((item, index) => (
            <div key={index} className={`max-w-2xl rounded-lg p-3 ${item.role === 'user' ? 'ml-auto bg-sky-600 text-white' : 'bg-white text-slate-800'}`}>
              {item.text}
            </div>
          ))}
        </div>
        <form className="flex gap-3" onSubmit={handleSubmit}>
          <input value={message} onChange={(event) => setMessage(event.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2" placeholder="Ask a nutrition question..." />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </AppLayout>
  );
}
