import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const { socket, axios } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  //function to get all users

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to get messages

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to send messages to selected user

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to subscribe to message for selected user

  const subscribeToMessages = async () => {
    try {
      if (!socket) return;
      socket.on("newMessage", (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
          newMessage.seen = true;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prevUnseen) => ({
            ...prevUnseen,
            [newMessage.senderId]: prevUnseen[newMessage.senderId]
              ? prevUnseen[newMessage.senderId] + 1
              : 1,
          }));
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
