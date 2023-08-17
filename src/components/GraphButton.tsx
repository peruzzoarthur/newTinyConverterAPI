import React from "react";
import { TERipple } from "tw-elements-react";

type ConvertButtonProps = {
  onClick: () => Promise<void>;
  text: string;
};

const GraphButton: React.FC<ConvertButtonProps> = ({ onClick, text }) => {
  return (
    <TERipple>
      <button
        onClick={onClick}
        type="button"
        className="inline-block rounded bg-neutral-100 px-1 
                mt-1 mr-1 pb-1 pt-1 text-xs font-medium uppercase l
                eading-normal text-neutral-700 shadow-[0_4px_9px_-4px_#cbcbcb] 
                transition duration-150 ease-in-out hover:bg-neutral-100 
                hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                 focus:bg-neutral-100 
                focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
                focus:outline-none focus:ring-0 active:bg-neutral-200 
                active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] 
                dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
      >
        {text}
      </button>
    </TERipple>
  );
};

export default GraphButton;
