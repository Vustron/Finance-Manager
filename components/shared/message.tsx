"use client";

import { useUser } from "@clerk/nextjs";

const Message = () => {
  // init user
  const { user, isLoaded } = useUser();

  return (
    <div className="mb-4 space-y-2">
      <h2 className="text-2xl font-medium text-white lg:text-4xl">
        Welcome back{isLoaded ? ", " : ""}
        {user?.firstName} 👋
      </h2>
      <p className="text-sm text-[#89b6fd] lg:text-base">
        This is your financial Overview Report
      </p>
    </div>
  );
};

export default Message;
