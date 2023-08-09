import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";


export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text"
  },
  {
    title: "Gallery",
    path: "/display",
    icon: <IoIcons.IoIosImages />,
    cName: "nav-text"
  },
  {
    title: "Highest Bids",
    path: "/highestbids",
    icon: <AiIcons.AiFillSignal />,
    cName: "nav-text"
  },
  {
    title: "My Bids",
    path: "/mybids",
    icon: <IoIcons.IoIosFlower />,
    cName: "nav-text"
  },
  {
    title: "About",
    path: "/about",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text"
  } 
];
