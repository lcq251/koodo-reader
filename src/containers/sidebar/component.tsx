import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import "./sidebar.css";
import { sideMenu } from "../../constants/sideMenu";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { getWebsiteUrl, openInBrowser } from "../../utils/common";
import toast from "react-hot-toast";
import logoDark from "../../assets/images/logo-dark.png";
import logoDarkPro from "../../assets/images/logo-dark-pro.png";
import logoLight from "../../assets/images/logo-light.png";
import logoLightPro from "../../assets/images/logo-light-pro.png";
import {
  addBooksToFavorite,
  isBookDragEvent,
  moveBooksToTrash,
  parseBookDragData,
} from "../../utils/reader/bookDrag";
import { useAppStore } from "../../store/useAppStore";
import { getDivinationCategories } from "../../constants/divinationCategory";

export interface SidebarState {
  hoverMode: string;
  isCollapsed: boolean;
  dropTargetShelf: string;
}

const Sidebar = () => {
  const mode = useAppStore((s) => s.sidebar.mode);
  const category = useAppStore((s) => s.sidebar.category);
  const isCollapsed = useAppStore((s) => s.sidebar.isCollapsed);
  const isAuthed = useAppStore((s) => s.manager.isAuthed);
  const handleMode = useAppStore((s) => s.handleMode);
  const handleCategory = useAppStore((s) => s.handleCategory);
  const handleSearch = useAppStore((s) => s.handleSearch);
  const handleSortDisplay = useAppStore((s) => s.handleSortDisplay);
  const handleCollapse = useAppStore((s) => s.handleCollapse);
  const handleSelectBook = useAppStore((s) => s.handleSelectBook);
  const handleShelf = useAppStore((s) => s.handleShelf);
  const handleFetchBooks = useAppStore((s) => s.handleFetchBooks);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState<SidebarState>(() => ({
    hoverMode: "",
    isCollapsed:
      ConfigService.getReaderConfig("isCollapsed") === "yes" || false,
    dropTargetShelf: "",
  }));

  const handleDocumentDragEnd = useCallback(() => {
    setState((prev) => ({ ...prev, dropTargetShelf: "" }));
  }, []);

  useEffect(() => {
    handleMode(
      document.URL.split("/").reverse()[0] === "empty"
        ? "home"
        : document.URL.split("/").reverse()[0]
    );
    document.addEventListener("dragend", handleDocumentDragEnd);
    return () => {
      document.removeEventListener("dragend", handleDocumentDragEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSidebar = (mode: string) => {
    handleSelectBook(false);
    navigate(`/manager/${mode}`);
    handleMode(mode);
    handleShelf("");
    handleSearch(false);
    handleSortDisplay(false);
  };
  const handleHover = (mode: string) => {
    setState((prev) => ({ ...prev, hoverMode: mode }));
  };
  const handleCollapseSidebar = (isCollapsed: boolean) => {
    setState((prev) => ({ ...prev, isCollapsed }));
    handleCollapse(isCollapsed);
    ConfigService.setReaderConfig("isCollapsed", isCollapsed ? "yes" : "no");
  };
  const handleJump = (url: string) => {
    openInBrowser(url);
  };
  const handleCategoryChange = (value: string) => {
    handleCategory(value);
    handleShelf("");
    handleSearch(false);
    handleSortDisplay(false);
  };
  const handleFavoriteDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setState((prev) => ({ ...prev, dropTargetShelf: "" }));
    if (!isBookDragEvent(event)) return;

    const bookKeys = parseBookDragData(event);
    if (bookKeys.length === 0) return;

    const added = addBooksToFavorite(bookKeys);
    if (added === 0) {
      toast(t("Duplicate book"));
      return;
    }
    toast.success(t("Addition successful"));
    handleFetchBooks();
    handleShelf("");
    handleMode("favorite");
    navigate("/manager/favorite");
  };
  const handleTrashDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setState((prev) => ({ ...prev, dropTargetShelf: "" }));
    if (!isBookDragEvent(event)) return;

    const bookKeys = parseBookDragData(event);
    if (bookKeys.length === 0) return;

    const moved = moveBooksToTrash(bookKeys);
    if (moved === 0) {
      toast(t("Duplicate book in trash bin"));
      return;
    }
    toast.success(t("Deletion successful"));
    handleFetchBooks();
    handleShelf("");
    handleMode("trash");
    navigate("/manager/trash");
  };
  const getBookDragHandlers = (
    targetId: string,
    onDrop: (event: React.DragEvent) => void
  ) => ({
    onDragEnter: (event: React.DragEvent) => {
      if (isBookDragEvent(event)) {
        event.preventDefault();
        setState((prev) => ({ ...prev, dropTargetShelf: targetId }));
      }
    },
    onDragLeave: (event: React.DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setState((prev) => ({ ...prev, dropTargetShelf: "" }));
      }
    },
    onDragOver: (event: React.DragEvent) => {
      if (isBookDragEvent(event)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }
    },
    onDrop,
  });
  const isBookDropTarget = (mode: string) =>
    mode === "favorite" || mode === "trash";

  const renderSideMenu = () => {
    return sideMenu.map((item) => {
      const isDropTarget = isBookDropTarget(item.mode);
      return (
        <li
          key={item.name}
          className={
            (mode === item.mode
              ? "active side-menu-item"
              : "side-menu-item") +
            (state.dropTargetShelf === item.mode ? " shelf-drop-target" : "")
          }
          id={`sidebar-${item.icon}`}
          onClick={() => {
            handleSidebar(item.mode);
          }}
          onMouseEnter={() => {
            handleHover(item.mode);
          }}
          onMouseLeave={() => {
            handleHover("");
          }}
          style={isCollapsed ? { width: 40, marginLeft: 15 } : {}}
          {...(isDropTarget
            ? getBookDragHandlers(
                item.mode,
                item.mode === "favorite"
                  ? handleFavoriteDrop
                  : handleTrashDrop
              )
            : {})}
        >
          {mode === item.mode ? (
            <div className="side-menu-selector-container"></div>
          ) : null}
          {state.hoverMode === item.mode ? (
            <div className="side-menu-hover-container"></div>
          ) : null}
          <div
            className={
              mode === item.mode
                ? "side-menu-selector active-selector"
                : "side-menu-selector "
            }
          >
            <div
              className="side-menu-icon"
              style={isCollapsed ? {} : { marginLeft: "38px" }}
            >
              <span
                className={
                  mode === item.mode
                    ? `icon-${item.icon}  active-icon`
                    : `icon-${item.icon}`
                }
                style={
                  isCollapsed
                    ? { position: "relative", marginLeft: "-9px" }
                    : {}
                }
              ></span>
            </div>

            <span
              style={
                isCollapsed
                  ? { display: "none", width: "70%" }
                  : { width: "60%" }
              }
            >
              {t(item.name)}
            </span>
          </div>
        </li>
      );
    });
  };

  return (
    <>
      <div className="sidebar">
        <div
          className="sidebar-list-icon"
          onClick={() => {
            handleCollapseSidebar(!isCollapsed);
          }}
        >
          <span className="icon-menu sidebar-list"></span>
        </div>

        <img
          src={
            ConfigService.getReaderConfig("appSkin") === "night" ||
            (ConfigService.getReaderConfig("appSkin") === "system" &&
              ConfigService.getReaderConfig("isOSNight") === "yes")
              ? isAuthed
                ? logoDarkPro
                : logoDark
              : isAuthed
              ? logoLightPro
              : logoLight
          }
          alt=""
          onClick={() => {
            handleJump(getWebsiteUrl());
          }}
          style={isCollapsed ? { display: "none" } : {}}
          className="logo"
        />
        <div
          className="side-menu-container-parent"
          style={isCollapsed ? { width: "70px" } : {}}
        >
          {!isCollapsed && (
            <div className="side-category-container">
              <select
                className="side-category-select"
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
              >
                {getDivinationCategories().map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <ul className="side-menu-container">{renderSideMenu()}</ul>
        </div>
        {/* Stats button at the bottom */}
        <div className="side-menu-about" style={{ paddingBottom: 8 }}>
          <div
            className={"side-menu-selector"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/stats");
            }}
          >
            <div
              className="side-menu-icon"
              style={
                isCollapsed
                  ? {}
                  : { marginLeft: "20px", marginRight: "15px" }
              }
            >
              <span
                className="icon-chart sidebar-shelf-icon"
                style={
                  isCollapsed
                    ? {
                        position: "relative",
                        marginLeft: "-0px",
                        fontSize: 14,
                      }
                    : { fontSize: 14 }
                }
              ></span>
            </div>
            <span
              style={
                isCollapsed
                  ? { display: "none", width: "70%" }
                  : { width: "61%" }
              }
            >
              {t("Reading Stats")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
