import React, { useCallback, useEffect } from "react";
import classNames from "classnames";
import moment from "moment";
import { Tooltip, Menu, Dropdown, Avatar } from "antd";

import LogoutOutlined from "@ant-design/icons/LogoutOutlined";

import { getInitials, getString } from "../../lib/util";

// import useCRUD from "../../hooks/useCRUD";

import Link from "../../components/Link";
import Image from "../../components/Image";

import "./sidebar.scss";

const color = ["#2a4a79"];

const ProfileMenu = ({ loginUser, ...props }) => (
  <div className="user-profile-menu">
    <div style={{ padding: "8px", borderBottom: "1px solid #d2ddef" }}>
      <span>
        {getString([
          loginUser?.firstName,
          loginUser?.middleName,
          loginUser?.lastName,
        ])}
      </span>
    </div>
    <Menu className="profile-menu-container" {...props}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        <span data-testid="logOut">Log out</span>
      </Menu.Item>
    </Menu>
  </div>
);

function Sidebar({
  location,
  history,
  loginUser,
}) {

  const isActive = useCallback((path) => {
    const arr = path.split("/");
    return arr[1] === path;
  }, []);

  //   const [userLogoutResponse, , , userLogout, clearUserLogoutResponse] = useCRUD(
  //     {
  //       id: apiUrls.LOGOUT,
  //       url: apiUrls.LOGOUT,
  //       type: "create",
  //     }
  //   );

  useEffect(() => {
    // if (userLogoutResponse) {
    //   clearLogin();
    //   logoutUser();
    //   localStorage.clear();
    //   window.location = `${location.href}?eraseCache=true`;
    //   clearUserLogoutResponse(true);
    // }
  }, []);

  //   const onProfileMenuSelect = useCallback(() => {
  //       userLogout({
  //         data: {
  //           accessToken: localStorage.getDecryptedData("token"),
  //         },
  //       });
  //     },
  //     [userLogout]
  //   );



  return (
    <div
      className="app-sidebar"
      id="focus-app-sidebar"
    >
      <div className="side-logo">
        <Image
          data-testid="focus-after-login-logo"
          name="logo.svg"
          alt="logo"
        />
      </div>
      <div className="navigation-list">
        <ul>
          <Link
            component="li"
            root
            to="/sampleForm"
          >
            <Tooltip placement="right" color={color} title="Sample Form">
              <span
                className={classNames("app-sidebar-item doctor sprite-img", {
                  active: isActive("sampleForm"),
                })}
              />
            </Tooltip>
          </Link>
          <Link
            component="li"
            root
            to="/sampleTable"
          >
            <Tooltip placement="right" color={color} title="Sample Table">
              <span
                className={classNames("app-sidebar-item users sprite-img", {
                  active: isActive("sampleTable"),
                })}
              />
            </Tooltip>
          </Link>
        </ul>
      </div>
      <div className="header-menus">
        <ul>
          <li className="cursor-pointer">
            <span id="sidebar-clock-date" className="date-time-style" />
          </li>
          <li className="cursor-pointer">
            <span id="sidebar-clock-time" className="date-time-style" />
          </li>
          <li className="user-icon">
            <div className="user-img">
              <Dropdown
                getPopupContainer={() =>
                  document.getElementById("focus-app-sidebar")
                }
                overlay={
                  <ProfileMenu
                    loginUser={loginUser}
                    // onClick={onProfileMenuSelect}
                  />
                }
                placement="topLeft"
                trigger="click"
              >
                <Tooltip
                  placement="right"
                  color={color}
                  title={getString([
                    loginUser?.firstName,
                    loginUser?.middleName,
                    loginUser?.lastName,
                  ])}
                >
                  <Avatar>
                    {getInitials([
                      loginUser?.firstName,
                      loginUser?.middleName,
                      loginUser?.lastName,
                    ])}
                  </Avatar>
                </Tooltip>
              </Dropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
