import React from "react";
import "./Avatar.scss";

const Avatar: React.FC<{ tagImage?: string; profileImage: string }> = ({
  tagImage,
  profileImage,
}) => {
  return (
    <div className="avatar-img-content">
      <img src={profileImage} alt="" />
      {tagImage && (
        <div className="profile-img">
          <img src={tagImage} alt="" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
