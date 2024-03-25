import React, { useState, useEffect } from "react";
import "./styles/Chatappstyle.css";
import Chattitle from "./Chattitle";
import Mainchat from "./mainChat";
import { io } from 'socket.io-client';

const Chatapp = () => {
  const [mychats, setMyChats] = useState([]);
  const [activeChat, setActiveChat] = useState(0);
  const [showMainChat, setShowMainChat] = useState("");
  const [showChatsContainer, setShowChatsContainer] = useState("");
  const [windowSize, setWindowSize2] = useState("");
  const [token, setToken] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  const reformatChats = (serverChats) => {
    const currentUserID = localStorage.getItem("userId");

    return serverChats.map((serverChat) => ({
      pic: `./pics/sora.jpg`,
      chatid: serverChat._id,
      name:
        currentUserID !== serverChat.user1ID
          ? serverChat.user1name
          : serverChat.user2name,
      lastmsg:
        serverChat.messages.length > 0
          ? serverChat.messages[0].content
          : "",
      unseenMsgs: 0,
      messages: serverChat.messages.map((message) => ({
        didIsendIt: message.senderID !== currentUserID,
        time: message.timestamp,
        text: message.content,
      })),
    }));
  };

  const setWindowSize = () => {
    const x = window.matchMedia("(max-width: 992px)");
    if (x.matches) {
      setWindowSize2("phone");
      setShowMainChat("hide");
    } else {
      setWindowSize2("PC");
    }
  };

const ayhaga= (prevChats,data,newmsg) => {
  const newChats = [...prevChats];
  console.log(3);
  // Find the index of the chat where senderID matches either in the first or second half of chatid
  const chatIndex = newChats.findIndex(chat => {
    const firstHalf = chat.chatid.substring(0, chat.chatid.length / 2);
    const secondHalf = chat.chatid.substring(chat.chatid.length / 2);
    return data.msg.senderID === firstHalf || data.msg.senderID === secondHalf;
  });
  console.log(2);
  // If the chat is found, push the new message
  if (chatIndex !== -1) {
    console.log(1);

    newChats[chatIndex].messages.push(newmsg);
  }

  return newChats;
}


  useEffect(() => {
    let flag=0;
    setWindowSize();
    // Retrieve the token from localStorage
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);

    // Now you can use the token as needed, for example, in headers for API requests
    if (storedToken) {
      // Your logic here, for example, sending the token in the Authorization header
      fetch("http://localhost:8080/chat3adool/getchats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
          // Add any other headers if needed
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Data received:", result.chats);
          if (result.chats.length !== 0) {
            const chatstemp = reformatChats(result.chats);
            console.log(chatstemp);
            setMyChats(chatstemp)
            console.log(mychats);
            
          } else {
            console.log("mt");
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      // Handle the case when the token is not available
      console.error("Token not found in localStorage");
    }

    const myid = localStorage.getItem("userId");
    const socket = io("http://localhost:8080", { autoConnect: false });
    socket.auth = { myid: myid };
    socket.connect();

    // Inside the useEffect hook
socket.on('chats', data => {
  if (data.action === 'chatadded') {
    console.log(data);
    const newChat = {
      pic: `./pics/sora.jpg`,
      chatid: data.chat._id,
      name: data.chat.user1ID == myid ? data.chat.user2name : data.chat.user1name,
      lastmsg: "",
      unseenMsgs: 0,
      messages: [],
    };

    // Use the functional form of setMyChats to ensure you get the latest state
    setMyChats(prevChats => [...prevChats, newChat]);
    setNewContactEmail(""); // Clear the input value after adding contact

  } else if (data.action === 'msgadded') {
console.log("msgadded");
    let newmsg = {
      didIsendIt: data.msg.senderID == localStorage.getItem("userId") ? 0 : 1,
      time: new Date().toLocaleString().slice(0, 24),
      text: `${data.msg.content}`,
    };

    setMyChats(p=>{
      if(flag==0){
        flag=1;
        return ayhaga(p,data,newmsg);
      }
      else{
        flag=0;
        return p;
      }
    });
  }
});


  }, []); // Empty dependency array ensures useEffect runs only once on mount

  const setactiveChat = (ind) => {
    setActiveChat(ind);
  };

  const addMsg = (newMsg) => {
    let newmsgs = [...mychats];
    newmsgs[activeChat].messages.push(newMsg);
    setMyChats(newmsgs);

    const storedToken = localStorage.getItem("token");

    if (newMsg) {
      fetch("http://localhost:8080/chat3adool/sendmsg", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID: mychats[activeChat].chatid,
          content: newMsg.text,
        }),
      });
    }
  };

  const swap = () => {
    let a = showChatsContainer;
    let b = showMainChat;
    setShowChatsContainer(b);
    setShowMainChat(a);

    console.log(showChatsContainer, showMainChat);
  };

  const handleInputChange = (e) => {
    setNewContactEmail(e.target.value);
  };

  const handleAddContact = () => {
    const storedToken = localStorage.getItem("token");
    if (newContactEmail) {
      fetch("http://localhost:8080/chat3adool/addchat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatteremail: newContactEmail }),
      })
        .catch((error) => console.error("Error adding contact:", error));
    }
  };

  return (
    <>
      <div className="chatAppContainer">
        <div className={`ChatsContainer ${showChatsContainer}`}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <input
              type="text"
              placeholder="Enter contact email"
              value={newContactEmail}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                marginRight: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleAddContact}
              style={{
                padding: "8px 12px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Contact
            </button>
          </div>

          <div className="leftsideChats">
            {mychats.map((c, ind) => (
              <div
                className="ChattitleContainer"
                onClick={() => {
                  swap();
                  setactiveChat(ind);
                }}
                key={c.chatid}
              >
                <Chattitle
                  data={c}
                  ind={ind}
                  setactiveChat={setactiveChat}
                  active={ind === activeChat ? 1 : 0}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={`mainChat ${showMainChat}`}>
          {
            mychats.length !== 0 ?
              (<Mainchat
                swap={swap}
                addMsg={addMsg}
                chat={mychats[activeChat]}
              />) :
              (<div>no chats here</div>)
          }
        </div>
      </div>
    </>
  );
}

export default Chatapp;
