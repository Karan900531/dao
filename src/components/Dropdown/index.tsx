import React, { useState, useEffect, useRef } from "react";

import "./Dropdown.scss";
import { ReactComponent as DownArrowIcon } from "../../assets/icons/down-arrow.svg";
import { useSwitchNetwork } from "wagmi";
// import { ReactComponent as DrodpownDownArrowIcon } from "../../assets/icons/dropdown-down-arrow.svg";

interface IDropdownProps {
  label: string;
  lists: {
    label: string;
    leftIcon?: string;
    chain?: number;
  }[];
  setSelectedList?: React.Dispatch<
    React.SetStateAction<{
      label: string;
      leftIcon?: string;
    } | null>
  >;
  selectedList?: {
    label: string;
    leftIcon?: string;
  } | null;
}

const Dropdown: React.FC<IDropdownProps> = ({ lists, label, setSelectedList, selectedList }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { switchNetwork } = useSwitchNetwork();
  const [active, setActive] = useState<{
    label: string;
    leftIcon?: string;
  }>();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setOpenDropdown((d) => !d)}>
        <span>
          {/* <DrodpownDownArrowIcon /> */}
          {selectedList ? (
            <>
              <img src={selectedList?.leftIcon} alt="" />
              {selectedList.label}
            </>
          ) : active ? (
            <>
              <img src={active?.leftIcon} alt="" />
              {active.label}
            </>
          ) : (
            label
          )}
        </span>
        <DownArrowIcon />
      </div>
      {openDropdown && (
        <div className="dropdown-content">
          {lists.map((list, index) => (
            <div
              key={index}
              className="dropdown-content-list"
              onClick={() => {
                if (switchNetwork && list.chain) switchNetwork(list.chain);
                if (setSelectedList) {
                  setSelectedList(list);
                }
                setActive(list);
                setOpenDropdown(false);
              }}
            >
              <span>
                {list.leftIcon && <img src={list.leftIcon} alt={list.label} />}
                &nbsp;{list.label}
              </span>
              {/* <DownArrowIcon /> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
