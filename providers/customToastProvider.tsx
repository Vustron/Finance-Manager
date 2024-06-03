"use client";

import toast, { Toaster, resolveValue } from "react-hot-toast";
import { styled, keyframes } from "goober";
import React from "react";

const CustomToaster = () => {
  const BaseToast = styled("div")`
    background: #fff;
    border-radius: 5px;
    display: flex;
    color: #000;
    align-items: center;
    padding: 5px;
    padding-right: 10px;
    width: 250px;
    height: 50px;
  `;

  const Content = styled("div")`
    flex: 1;
    padding: 10px;
    text-align: left;
  `;

  const Indicator = styled("div")`
    background: ${(p: any) =>
      p.type === "loading"
        ? "#fbbf24" // Yellow
        : p.type === "success"
          ? "#61d345" // Green
          : "#ff4b4b"};
    border-radius: 99px;
    width: 5px;
    height: 100%;
    transition: all 0.2s ease-in-out;
  `;

  const DismissButton = styled("button")`
    width: 16px;
    height: 16px;
    font-size: 24px;
    display: flex;
    justify-items: center;
    align-items: center;
    background: transparent;
    padding: 12px;
    border: none;
    color: gray;
    &:hover {
      color: white;
    }
  `;

  const enterAnimation = keyframes`
	from {
		opacity: 0;
		transform: translateY(-30px);
	}
	to {
		opacity: 1;
		transform: translateY(0px);
	}
	`;

  const exitAnimation = keyframes`
	from {
		opacity: 1;
		transform: translateX(0px);
	}
	to {
		opacity: 0;
		transform: translateX(100%);
	}
	`;

  return (
    <>
      <Toaster position="top-center">
        {(t) => (
          <BaseToast
            style={{
              animation: t.visible
                ? `${enterAnimation} 0.2s ease-out forwards`
                : `${exitAnimation} 0.4s ease-in forwards`,
            }}
          >
            <Indicator type={t.type} />

            <Content>{resolveValue(t.message, t)}</Content>

            {t.type !== "loading" && (
              <DismissButton onClick={() => toast.dismiss(t.id)}>
                &#215;
              </DismissButton>
            )}
          </BaseToast>
        )}
      </Toaster>
    </>
  );
};

export default CustomToaster;
