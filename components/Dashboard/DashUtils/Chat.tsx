"use client";

import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";

import EmotionSvg from "@/components/UI/SvgIcons/EmotionSvg";
import PhoneSvg from "@/components/UI/SvgIcons/PhoneSvg";
import EllipsesSvg from "@/components/UI/SvgIcons/EllipsesSvg";
import PaperPlaneSvg from "@/components/UI/SvgIcons/PaperPlaneSvg";
import AddSvg from "@/components/UI/SvgIcons/AddSvg";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!;

const Chat = ({ status, chat }: { status: string; chat: any }) => {
  console.log(chat);
  //   console.log(pusherKey, cluster);
  console.log(status);
  const [chats, setChats] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [messageToSend, setMessageToSend] = useState("");

  useEffect(() => {
    const user: any = localStorage.getItem("userInfo");

    setUserInfo(JSON.parse(user));
  }, []);

  useEffect(() => {
    const pusher = new Pusher("e597b63b0a16d6c4a2c6", {
      cluster: "mt1",
      channelAuthorization: {
        endpoint: "https://backend.apkxchange.com/api/chat/auth",
        transport: "ajax",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${"11|ITqRVhblUMf8e3JBXQ1szGn22e37TsWI8x5shZ7F"}`,
        },
      },
      userAuthentication: {
        endpoint: "https://backend.apkxchange.com/api/chat/auth",
        transport: "ajax",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer 11|ITqRVhblUMf8e3JBXQ1szGn22e37TsWI8x5shZ7F`,
        },
      },
    });

    pusher.signin();

    pusher.connection.bind("error", (err: any) => {
      if (err) {
        console.log(err);
      }
    });

    console.log(userInfo);

    const channel = pusher.subscribe(`private-chatify.${userInfo?.user.id}`);
    console.log(channel);

    pusher.allChannels().forEach((channel) => console.log(channel));

    channel.bind("messaging", (data: any) => {
      console.log(data);
      setChats((prevState: any) => [
        ...prevState,
        { sender: data.sender, message: data.message },
      ]);
    });

    return () => pusher.unsubscribe("channel-name");
  }, [userInfo]);

  console.log(chats);

  const handleMessage = (e: any) => {
    setMessageToSend(e.target.value);
  };
  const handleReply = async () => {
    // e.preventDefault();

    await axios.post("/api/pusher", {
      sender: userInfo.user.firstname,
      message: messageToSend,
      userId: userInfo.user.id,
    });

    setMessageToSend("");
  };

  // const handleChatSubmit = () => {};
  return (
    <>
      {status.toString() === "1" ? (
        <div className="w-full   flex-grow flex flex-col  h-[750px] relative mt-20 py-4  lg:border-l-2 lg:border-tertiary lg:w-[35%] lg:mt-0 lg:h-full ">
          <div className="w-full flex flex-1 justify-between px-4  ">
            <div className="flex gap-x-3">
              <div className="">
                {/* <img
                  className="object-cover w-10 h-10 rounded-lg"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                  alt=""
                /> */}
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-pink-400 rounded-full ">
                  <span className="font-medium text-gray-600 ">A</span>
                </div>
              </div>
              <div>
                <p className="font-semibold">Admin</p>
                <p className="text-gray-500 text-sm">Online</p>
              </div>
            </div>
            {/* <div className="flex gap-x-2">
              <button className="px-3 py-3 bg-primary rounded-lg ">
                <PhoneSvg />
              </button>
              <button className="px-3 py-3 bg-primary rounded-lg">
                <EllipsesSvg />
              </button>
            </div> */}
          </div>
          <div className="px-4 h-full flex-2 overflow-scroll ">
            <div className="w-full flex justify-center mt-10">
              <p className="text-xs font-light">Today, 8:26 AM</p>
            </div>
            {/* <div className="my-10">
              <p>Hello Linh!</p>
            </div> */}
            {/* <div className="my-10">
              <p>I really love your work, great job</p>
              <span className="text-gray-400 text-xs mt-6 block">03:49PM</span>
            </div> */}
            {/* {chats.map((chat: any) => (
              <div key={chat.message} className="my-10 flex justify-end ">
                <div className="px-4 py-3 bg-[#7995f5] rounded-xl">
                  <p>{chat.message}</p>
                </div>
              </div>
            ))} */}
            {chats.map((chat: any) => (
              <div
                key={chat.message}
                dangerouslySetInnerHTML={{ __html: chat.message }}
              ></div>
            ))}
          </div>
          <div className="w-full  bg-secondary  flex flex-1 py-6 items-center justify-between px-4   ">
            <div className="flex gap-x-2 ">
              <button className="px-3 py-3 bg-primary rounded-lg ">
                <EmotionSvg />
              </button>
              <button className="px-3 py-3 bg-primary rounded-lg ">
                <AddSvg />
              </button>
            </div>

            <div className="w-full  mx-4">
              <input
                value={messageToSend}
                placeholder="Type Something..."
                className="bg-transparent text-white text-sm w-full outline-none"
                onChange={handleMessage}
              />
            </div>
            <button
              onClick={handleReply}
              className="px-2 py-2 bg-[#7995f5] rounded-lg "
            >
              <PaperPlaneSvg />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Chat;
