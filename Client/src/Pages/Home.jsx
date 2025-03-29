import React, { useState } from "react";
import {
  CalendarDays,
  ChartColumnBig,
  FolderOpen,
  House,
  LogOut,
  MessageSquareText,
  Search,
  Settings,
} from "lucide-react";
import Overview from "../Components/Overview.jsx";
import Projects from "../Components/Projects.jsx";
import Stats from "../Components/Stats.jsx";
import Chat from "../Components/Chat.jsx";
import Calendar from "../Components/Calendar.jsx";
import "../CSS/Home.css";

const navLinks = [
  {
    name: "Overviews",
    icon: <House />,
    component: Overview,
  },
  {
    name: "Stat",
    icon: <ChartColumnBig />,
    component: Stats,
  },
  {
    name: "Project",
    icon: <FolderOpen />,
    component: Projects,
  },
  {
    name: "Chats",
    icon: <MessageSquareText />,
    component: Chat,
  },
  {
    name: "Calendars",
    icon: <CalendarDays />,
    component: Calendar,
  },
];

function Home() {
  const [activeSection, setActiveSection] = useState(0);

  const ActiveSectionComponent = navLinks[activeSection].component;

  return (
    <div className="home-main">
      <div className="sidenavbar">
        <div className="sidenav-logo">
          <h2>.taskez</h2>
        </div>
        <div className="sidenav-links">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={activeSection === idx ? "active-link" : ""}
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </div>
        <div className="sidenav-btns">
          <button className="sidenav-btn">{<Settings />} Settings</button>
          <button className="sidenav-btn">{<LogOut />} Log Out</button>
        </div>
      </div>
      <div className="home-content">
        <div className="content-nav">
          <div className="searchbar-container">
            <input type="text" placeholder="Search" />
            <Search className="search-icon" />
          </div>

          <div className="user-imgs">
            {/* <img src="" alt="sdafas" /> */}
          </div>
          <div className="user-info">
            <p>Hi John Doe</p>
            {/* <img src="" alt="user-img" /> */}
          </div>
        </div>
        <div className="content-section">
          {<ActiveSectionComponent />}
        </div>
      </div>
    </div>
  );
}

export default Home;
