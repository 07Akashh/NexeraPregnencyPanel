"use client"

import { useRef, useEffect, useState, Suspense } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import ChatArea from "../components/ChatArea";
import SidebarWrapper from "../components/sidebar/SidebarWrapper";
import {
  initializeChat,
  saveLanguage,
  selectOption,
  getProfile,
  submitBusinessProfile,
  getOpenAIResponse
} from "../lib/api";
import { v4 as uuid } from "uuid";

// Theme configuration
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#010727", icon: "#8C92A1", black: "#000000" },
    secondary: { main: "#f50057" },
    background: { default: "#FBFBFB", paper: "#ffffff" },
    success: { main: "#10B872" },
    customGreen: { main: "#10B872" },
  },
  typography: {
    fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.05)"
        }
      }
    }
  }
});

// Utility: Check if code is running in browser
const isBrowser = typeof window !== "undefined";

// Utility: Get language from localStorage safely
const getInitialLanguage = () => {
  if (isBrowser) {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

// Utility: Get profile answers from localStorage safely
const getInitialAnswers = () => {
  if (isBrowser) {
    try {
      return JSON.parse(localStorage.getItem("profile_answers")) || [];
    } catch {
      return [];
    }
  }
  return [];
};

// Utility: Save full chat to localStorage
const saveChatToLocalStorage = (chatId, messages, options = []) => {
  if (!isBrowser) return;
  
  const key = `chat_${chatId}`;
  const chatRecord = {
    id: chatId,
    messages,
    options,
    title: messages.find(m => m.role === "assistant")?.content?.slice(0, 30) || "New Chat",
    date: new Date().toISOString().split('T')[0]
  };
  localStorage.setItem(key, JSON.stringify(chatRecord));
};

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("chats");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatId, setChatId] = useState(() => searchParams.get('chat'));
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [profileQuestions, setProfileQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(getInitialAnswers || []);

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (hasMounted) setSidebarExpanded(isLargeScreen);
  }, [isLargeScreen, hasMounted]);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const loadChatList = () => {
      const chatKeys = Object.keys(localStorage).filter(key => key.startsWith("chat_"));
      const loadedChats = chatKeys.map(key => {
        try {
          const chat = JSON.parse(localStorage.getItem(key));
          return chat ? { id: chat.id, title: chat.title, date: chat.date } : null;
        } catch {
          return null;
        }
      }).filter(Boolean);
      setChatList(loadedChats);
    };
    loadChatList();
  }, []);

  useEffect(() => {
    const initOrRestoreChat = async () => {
      const chatIdFromUrl = searchParams.get('chat');
      if (chatIdFromUrl) {
        setChatId(chatIdFromUrl);
        try { 
          await saveLanguage(chatIdFromUrl, language);
          const chatData = JSON.parse(localStorage.getItem(`chat_${chatIdFromUrl}`));
          if (chatData) {
            setMessages(chatData.messages);
            setOptions(chatData.options || []);
          }
        } catch (err) { 
          console.error(err); 
        }
      } else {
        try {
          const res = await initializeChat(language);
          const newId = res?.response?.chat_id;
          if (newId) {
            setChatId(newId);
            const assistantMsg = res.response.message;
            const initialMessages = [{ id: uuid(), role: "assistant", content: assistantMsg }];
            const initialOptions = res.response.options || [];
            setMessages(initialMessages);
            setOptions(initialOptions);
            await saveLanguage(newId, language);
            router.push(`?chat=${newId}`);
            saveChatToLocalStorage(newId, initialMessages, initialOptions);
          }
        } catch (err) {
          console.error("Chat initialization failed", err);
        }
      }
    };
    initOrRestoreChat();
  }, [language, searchParams]);

  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chat');
    if (chatIdFromUrl) {
      handleChatSelect(chatIdFromUrl);
    }
  }, [searchParams]);

  const handleInputChange = (e) => setInput(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) handleSubmit();
  };

  const handleSubmit = async () => {
    if (isLoading || !input.trim() || !chatId) return;

    const userMsg = { id: uuid(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await getOpenAIResponse(chatId, language, currentInput);
      const assistantMsg = { id: uuid(), role: "assistant", content: res.output.response };
      const updated = [...messages, userMsg, assistantMsg];
      setMessages(updated);
      setOptions(res.output.options || []);
      saveChatToLocalStorage(chatId, updated, res.output.options || []);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: uuid(), role: "assistant", content: "An error occurred." }]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (optionId) => {
    if (!chatId) return;

    if (profileQuestions.length > 0 && currentQuestionIndex < profileQuestions.length) {
      const question = profileQuestions[currentQuestionIndex];
      const updated = [
        ...answers.filter(a => a.question_id !== question.id),
        { question_id: question.id, option_id: optionId }
      ];
      setAnswers(updated);
      localStorage.setItem("profile_answers", JSON.stringify(updated));

      const selected = question.options.find(o => o.id === optionId);
      setMessages(prev => [...prev, { id: uuid(), role: "user", content: selected?.text }]);

      if (currentQuestionIndex + 1 < profileQuestions.length) {
        const next = profileQuestions[currentQuestionIndex + 1];
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        const newMessages = [...messages, { id: uuid(), role: "user", content: selected?.text }, { id: uuid(), role: "assistant", content: next.text }];
        setMessages(newMessages);
        setOptions(next.options);
        saveChatToLocalStorage(chatId, newMessages, next.options);
      } else {
        await submitBusinessProfile(chatId, updated);
        const finalMessages = [...messages, { id: uuid(), role: "user", content: selected?.text }, { id: uuid(), role: "assistant", content: "Thank you for your answers!" }];
        setMessages(finalMessages);
        setProfileQuestions([]);
        setOptions([]);
        saveChatToLocalStorage(chatId, finalMessages, []);
      }
    } else {
      const selected = options.find(o => o.id === optionId);
      const userMessage = { id: uuid(), role: "user", content: selected?.label || selected.text };
      setMessages(prev => [...prev, userMessage]);
      const res = await selectOption(chatId, optionId);
      const assistantMessage = { id: uuid(), role: "assistant", content: res.response.message };
      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);
      const newOptions = res.response.options || [];
      setOptions(newOptions);
      saveChatToLocalStorage(chatId, newMessages, newOptions);

      if (res.response.step === "User Request") {
        const profile = await getProfile();
        setProfileQuestions(profile);
        setCurrentQuestionIndex(0);
        const profileMessages = [...newMessages, { id: uuid(), role: "assistant", content: profile[0].text }];
        setMessages(profileMessages);
        const profileOptions = profile[0].options;
        setOptions(profileOptions);
        saveChatToLocalStorage(chatId, profileMessages, profileOptions);
      }
    }
  };

  const handleSectionClick = (section) => {
    if (activeSection === section) setSidebarExpanded(!sidebarExpanded);
    else {
      setActiveSection(section);
      setSidebarExpanded(true);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await initializeChat(language);
      const newId = res?.response?.chat_id;
      if (newId) {
        setChatId(newId);
        const initialMessages = [{ id: uuid(), role: "assistant", content: res.response.message }];
        const initialOptions = res.response.options || [];
        setMessages(initialMessages);
        setOptions(initialOptions);
        setInput("");
        setError(null);
        router.push(`?chat=${newId}`);
        
        // Update chat list
        const chatRecord = {
          id: newId,
          messages: initialMessages,
          options: initialOptions,
          title: res.response.message.slice(0, 30) || "New Chat",
          date: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem(`chat_${newId}`, JSON.stringify(chatRecord));
        setChatList(prev => [chatRecord, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create new chat", err);
      setError("Failed to create new chat");
    }
  };

  const handleClearChat = () => window.location.reload();
  const handleSidebarToggle = () => setMobileOpen(!mobileOpen);

  const handleChatSelect = (selectedChatId) => {
    const chatKey = `chat_${selectedChatId}`;
    const chatData = JSON.parse(localStorage.getItem(chatKey));
    if (chatData) {
      setChatId(selectedChatId);
      setMessages(chatData.messages);
      setOptions(chatData.options || []);
      router.push(`?chat=${selectedChatId}`);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100dvh", width: "100dvw", overflow: "hidden" }}>
      <SidebarWrapper
        expanded={sidebarExpanded}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        chatList={chatList}
        mobileOpen={mobileOpen}
        onSidebarToggle={handleSidebarToggle}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: { xs: 0 },
          transition: "margin-left 0.3s ease",
          width: { xs: 0 }
        }}
      >
        <Header
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
          onSidebarToggle={handleSidebarToggle}
          language={language}
          setLanguage={setLanguage}
        />
        <ChatArea
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
          language={language}
          options={options}
          handleOptionClick={handleOptionClick}
          setLanguage={setLanguage}
        />
      </Box>
    </Box>
  );
}

export default function ChatPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<div>Loading...</div>}>
        <ChatContent />
      </Suspense>
    </ThemeProvider>
  );
} 