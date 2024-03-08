import Amessage from "./Amessage";
import "./styles/Chatappstyle.css";
import React, { useState, useRef } from "react";

const Mainchat = (probs) => {
  const divRef = useRef(null);
  let [writtenmsg, setMsg] = useState("");
  let handleChange = (e) => {
    setMsg(e.target.value);
  };
  let sendMsg = (e) => {
    let newmsg = {
      didIsendIt: false,
      time: Date().toLocaleString().slice(0, 24),
      text: `${writtenmsg}`,
    };
    if (writtenmsg != "") {
      probs.addMsg(newmsg);
    }
    setMsg("");
  };
  const scrollDiv = () => {
    // Check if the divRef is available
    if (divRef.current) {
      // Scroll to a specific position (e.g., 100 pixels from the top)
      divRef.current.scrollTop = 100000000000;
    }
  };

  return (
    <>
      <div className="activeChat">
        <div className="chatHeader">
          <div className="mainChat_pic_name">
            <div onClick={probs.swap} className="goback">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
              >
                <path d="M0 0h48v48h-48z" fill="none" />
                <path d="M40 22h-24.34l11.17-11.17-2.83-2.83-16 16 16 16 2.83-2.83-11.17-11.17h24.34v-4z" />
              </svg>
            </div>
            <img
              src={require(`${probs.chat.pic}`)}
              alt=""
              className="mainChat_pic"
            />
            <div className="mainChat_name">{probs.chat.name}</div>
          </div>

          <div className="mainChat-options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <g clip-path="url(#clip0_402_3412)">
                <path
                  d="M16.0002 5.33333C17.4729 5.33333 18.6668 4.13943 18.6668 2.66667C18.6668 1.19391 17.4729 0 16.0002 0C14.5274 0 13.3335 1.19391 13.3335 2.66667C13.3335 4.13943 14.5274 5.33333 16.0002 5.33333Z"
                  fill="#263238"
                />
                <path
                  d="M16.0002 18.6673C17.4729 18.6673 18.6668 17.4734 18.6668 16.0006C18.6668 14.5279 17.4729 13.334 16.0002 13.334C14.5274 13.334 13.3335 14.5279 13.3335 16.0006C13.3335 17.4734 14.5274 18.6673 16.0002 18.6673Z"
                  fill="#263238"
                />
                <path
                  d="M16.0002 31.9999C17.4729 31.9999 18.6668 30.806 18.6668 29.3332C18.6668 27.8604 17.4729 26.6665 16.0002 26.6665C14.5274 26.6665 13.3335 27.8604 13.3335 29.3332C13.3335 30.806 14.5274 31.9999 16.0002 31.9999Z"
                  fill="#263238"
                />
              </g>
              <defs>
                <clipPath id="clip0_402_3412">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="line"></div>

        <div className="chatContainer" ref={divRef}>
          {/* {probs.chat.messages.length?(<><Amessage msg={probs.chat.messages[0]}/></>):(<></>)} */}
          {probs.chat.messages.map((msg, ind) =>
            ind == 0 ||
            msg.didIsendIt != probs.chat.messages[ind - 1].didIsendIt ? (
              msg.didIsendIt == true ? (
                <div className="Amessageholderleft">
                  <br />
                  <Amessage msg={msg} />
                </div>
              ) : (
                <div className="Amessageholderright">
                  <br />
                  <Amessage msg={msg} />
                </div>
              )
            ) : (
              <>
                {" "}
                <Amessage msg={msg} />
              </>
            )
          )}
          <br />
          <br />
        </div>

        <div className="typeArea-sendBtn">
          <textarea
            className="typeArea"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMsg();
                scrollDiv();
              }
            }}
            value={writtenmsg}
            onChange={handleChange}
            placeholder="Type a Message...."
          ></textarea>
          <div
            className="sendMsgBtn"
            onClick={() => {
              sendMsg();
              scrollDiv();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <g clip-path="url(#clip0_402_3438)">
                <path
                  d="M18.46 23.0226L14.1107 27.3719C12.8479 28.6009 11.152 29.2834 9.38996 29.2715C7.62788 29.2597 5.94129 28.5546 4.69511 27.3088C3.44892 26.063 2.74335 24.3766 2.73105 22.6145C2.71874 20.8524 3.4007 19.1564 4.62936 17.8933L8.97869 13.5399C9.22871 13.2897 9.36909 12.9505 9.36896 12.5968C9.36884 12.2431 9.22822 11.904 8.97803 11.6539C8.72784 11.4039 8.38858 11.2635 8.03489 11.2637C7.6812 11.2638 7.34204 11.4044 7.09203 11.6546L2.74403 16.0079C0.987057 17.7658 0.00035172 20.1496 0.000976859 22.6349C0.001602 25.1203 0.989506 27.5036 2.74736 29.2606C4.50522 31.0175 6.88903 32.0042 9.37438 32.0036C11.8597 32.003 14.2431 31.0151 16 29.2572L20.3494 24.9079C20.5922 24.6564 20.7266 24.3196 20.7236 23.97C20.7206 23.6205 20.5803 23.286 20.3331 23.0388C20.0859 22.7916 19.7515 22.6514 19.4019 22.6484C19.0523 22.6453 18.7155 22.7797 18.464 23.0226H18.46Z"
                  fill="#E02200"
                />
                <path
                  d="M29.2587 2.74852C28.3911 1.87494 27.3587 1.18223 26.2215 0.710516C25.0842 0.238806 23.8646 -0.00252033 22.6334 0.000521136C21.4028 -0.00274784 20.1838 0.237959 19.0468 0.708723C17.9098 1.17949 16.8775 1.87097 16.0094 2.74319L11.6534 7.09385C11.4032 7.34387 11.2626 7.68302 11.2625 8.03672C11.2623 8.39041 11.4027 8.72967 11.6527 8.97985C11.9027 9.23004 12.2419 9.37067 12.5956 9.37079C12.9493 9.37092 13.2885 9.23053 13.5387 8.98052L17.8921 4.63119C18.5128 4.00672 19.2512 3.51159 20.0646 3.17447C20.878 2.83734 21.7502 2.66492 22.6307 2.66719C23.9564 2.66763 25.2522 3.0611 26.3543 3.79785C27.4564 4.53461 28.3153 5.58158 28.8225 6.80641C29.3297 8.03125 29.4623 9.37895 29.2037 10.6792C28.945 11.9794 28.3067 13.1737 27.3694 14.1112L23.0201 18.4605C22.7699 18.7107 22.6293 19.05 22.6293 19.4039C22.6293 19.7577 22.7699 20.097 23.0201 20.3472C23.2702 20.5974 23.6096 20.7379 23.9634 20.7379C24.3172 20.7379 24.6565 20.5974 24.9067 20.3472L29.2561 16.0005C31.0108 14.242 31.9965 11.8593 31.997 9.37507C31.9975 6.89082 31.0127 4.50777 29.2587 2.74852Z"
                  fill="#E02200"
                />
                <path
                  d="M19.0577 11.0574L11.0577 19.0574C10.9303 19.1804 10.8288 19.3275 10.7589 19.4902C10.689 19.6528 10.6522 19.8278 10.6507 20.0048C10.6491 20.1819 10.6829 20.3574 10.7499 20.5213C10.817 20.6852 10.916 20.834 11.0412 20.9592C11.1663 21.0844 11.3152 21.1834 11.4791 21.2505C11.6429 21.3175 11.8185 21.3512 11.9956 21.3497C12.1726 21.3482 12.3476 21.3114 12.5102 21.2415C12.6729 21.1716 12.82 21.07 12.943 20.9427L20.943 12.9427C21.1859 12.6912 21.3203 12.3544 21.3173 12.0049C21.3142 11.6553 21.174 11.3208 20.9268 11.0736C20.6796 10.8264 20.3451 10.6862 19.9956 10.6832C19.646 10.6801 19.3092 10.8145 19.0577 11.0574Z"
                  fill="#E02200"
                />
              </g>
              <defs>
                <clipPath id="clip0_402_3438">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mainchat;
