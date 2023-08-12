import React from "react";
import { TERipple } from "tw-elements-react";

type ConvertButtonProps = {
  onClick: () => void;
};

const ConvertButton: React.FC<ConvertButtonProps> = ({ onClick }) => {
  return (
    <div>
      <TERipple>
        <button
          onClick={onClick}
          type="button"
          className="mt-7 inline-block rounded bg-stone-100 px-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal
             text-black shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 
             hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
              focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
              focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
              dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
              dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
        >
          💸 Convert 💸
        </button>
      </TERipple>
    </div>
  );
};

export default ConvertButton;
