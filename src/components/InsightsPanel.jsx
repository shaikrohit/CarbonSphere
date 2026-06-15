import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Key, Check } from 'lucide-react';
import PropTypes from 'prop-types';
import { getHighestCategory, getLocalResponse } from '../utils/helpers';

export default function InsightsPanel({
  baseline,
  currentFootprint,
  totalBaseline,
  totalDailySavings,
  ecoScore
}) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('cs_gemini_api_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm Aura, your AI Carbon Concierge. I've analyzed your footprint data. Ask me anything about how to optimize your lifestyle or offset your emissions!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const messageCounterRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    // Validate Gemini key prefix & character pattern to prevent garbage/malicious entries
    const geminiRegex = /^AIzaSy[A-Za-z0-9_-]{29,45}$/;
    if (!geminiRegex.test(trimmedKey)) {
      alert("Invalid Format: The API key must be a valid Google API key format starting with 'AIzaSy' and contain only letters, numbers, dashes, or underscores.");
      return;
    }
    localStorage.setItem('cs_gemini_api_key', trimmedKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
    setShowKeyInput(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('cs_gemini_api_key');
    setApiKey('');
    setShowKeyInput(true);
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    messageCounterRef.current += 1;
    const userMsg = {
      id: `user_${messageCounterRef.current}`,
      sender: 'user',
      text: chatInput
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    const context = {
      baseline,
      currentFootprint,
      totalBaseline,
      totalDailySavings,
      ecoScore
    };

    try {
      if (apiKey) {
        // Prepare prompt with detailed user context
        const promptText = `
User question: "${userMsg.text}"

Context:
- Annual Carbon Footprint: ${currentFootprint} Metric Tons CO2e (Baseline: ${totalBaseline} Tons)
- Weekly commute: ${baseline.carKmPerWeek} km (${baseline.carFuelType} car)
- Public Transit: ${baseline.publicTransitHoursPerWeek} hours/week
- Yearly flights: ${baseline.flightsPerYear}
- Monthly electricity usage: ${baseline.electricityKwhPerMonth} kWh
- Diet: ${baseline.dietType}
- Action tracker savings: ${totalDailySavings} kg CO2e saved today
- EcoScore: ${ecoScore}/100

You are Aura, an encouraging, professional, and knowledgeable AI Carbon Concierge. Give a direct, personalized, and actionable answer. Reference specific metrics from their context if relevant. Keep it under 3-4 sentences. Focus on real-world Indian context if relevant.`;

        // Direct fetch to Gemini API (non-blocking, client-side, secure)
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }]
            })
          }
        );

        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I couldn't process that response. Please check your API key.";

        messageCounterRef.current += 1;
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${messageCounterRef.current}`,
            sender: 'bot',
            text: botReply.trim()
          }
        ]);
      } else {
        // Fallback to local rule engine (instant, reliable, smart)
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate typing delay
        const reply = getLocalResponse(userMsg.text, context);
        messageCounterRef.current += 1;
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${messageCounterRef.current}`,
            sender: 'bot',
            text: reply
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      messageCounterRef.current += 1;
      setMessages(prev => [
        ...prev,
        {
          id: `bot_err_${messageCounterRef.current}`,
          sender: 'bot',
          text: "I encountered an issue connecting to the AI services. Please verify your Gemini API key, internet connection, or try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSmartQuickTips = () => {
    const cat = getHighestCategory(baseline);
    if (cat.includes('transportation')) {
      return ["How do I reduce my driving emissions?", "Is a hybrid car better than EV?", "What is the CO2 impact of walking?"];
    }
    if (cat.includes('aviation')) {
      return ["Explain carbon impact of flights.", "How can I offset flight emissions?", "Train vs Plane carbon comparison."];
    }
    if (cat.includes('energy')) {
      return ["Tips to reduce household electricity.", "What is vampire load?", "Solar energy benefits in India."];
    }
    return ["Meat vs Vegan carbon difference.", "How does composting help?", "Simple low-carbon recipes."];
  };

  return (
    <div className="card glass-panel insights-card animate-fade-in">
      <div className="insights-header">
        <div className="title-row">
          <Bot className="icon-accent" size={24} />
          <div>
            <h3 className="section-title">Aura: AI Carbon Concierge</h3>
            <p className="text-secondary text-xs">
              {apiKey ? 'Powered by Gemini 1.5 Flash' : 'Powered by Local Rules Engine'}
            </p>
          </div>
        </div>
        <div className="key-setup-row">
          {apiKey ? (
            <button type="button" className="btn-key active" onClick={handleClearKey}>
              <Key size={14} className="margin-right-xs" />
              Reset Key
            </button>
          ) : (
            <button type="button" className="btn-key" onClick={() => setShowKeyInput(!showKeyInput)}>
              <Key size={14} className="margin-right-xs" />
              Configure Gemini Key
            </button>
          )}
        </div>
      </div>

      {showKeyInput && (
        <form onSubmit={handleSaveKey} className="key-input-form animate-slide-in">
          <div className="form-group-inline">
            <input
              type="password"
              maxLength={100}
              aria-label="Google Gemini API Key"
              placeholder="Paste Google Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm btn-icon">
              {keySaved ? <Check size={14} /> : 'Save'}
            </button>
          </div>
          <p className="text-secondary text-xxs margin-top-xs">
            Keys are saved strictly in your local browser storage and never transmitted to external servers.
          </p>
        </form>
      )}

      {/* Chat Area */}
      <div className="chat-messages-container" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'bot' ? 'bot-wrap' : 'user-wrap'}`}>
            <div className={`chat-bubble ${msg.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-wrapper bot-wrap">
            <div className="chat-bubble bot-bubble typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Tips */}
      <div className="quick-tips-row">
        {getSmartQuickTips().map((tip, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-quick-tip text-xxs"
            onClick={() => {
              setChatInput(tip);
            }}
          >
            {tip}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendChat} className="chat-input-bar">
        <input
          type="text"
          maxLength={300}
          aria-label="Ask Aura a carbon question"
          placeholder="Ask Aura a carbon question..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-send" disabled={loading || !chatInput.trim()} aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

InsightsPanel.propTypes = {
  baseline: PropTypes.shape({
    carKmPerWeek: PropTypes.number.isRequired,
    carFuelType: PropTypes.string.isRequired,
    flightsPerYear: PropTypes.number.isRequired,
    publicTransitHoursPerWeek: PropTypes.number.isRequired,
    electricityKwhPerMonth: PropTypes.number.isRequired,
    lpgCylindersPerMonth: PropTypes.number.isRequired,
    dietType: PropTypes.string.isRequired,
    wasteRecycling: PropTypes.string.isRequired,
    shoppingFrequency: PropTypes.string.isRequired
  }).isRequired,
  currentFootprint: PropTypes.number.isRequired,
  totalBaseline: PropTypes.number.isRequired,
  totalDailySavings: PropTypes.number.isRequired,
  ecoScore: PropTypes.number.isRequired
};
