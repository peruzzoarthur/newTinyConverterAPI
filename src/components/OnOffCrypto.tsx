import { Switch } from "@headlessui/react";

interface OnOffCryptoProps {
  cryptoEnabled: boolean;
  setCryptoEnabled: (enabled: boolean) => void;
  onClick?: () => void;
}

function OnOffCrypto({
  cryptoEnabled,
  setCryptoEnabled,
  onClick,
}: OnOffCryptoProps) {
  return (
    <div className="py-4">
      {" "}
      <Switch
        checked={cryptoEnabled}
        onChange={setCryptoEnabled}
        onClick={onClick}
        className={`
        ${cryptoEnabled ? "bg-zinc-900" : "bg-zinc-700"}
        relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer 
        rounded-full border-2 border-transparent transition-colors 
        duration-200 ease-in-out focus:outline-none 
        focus-visible:ring-2  focus-visible:ring-white 
        focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`
          ${cryptoEnabled ? "translate-x-5" : "translate-x-0"}
          pointer-events-none inline-block h-[20px] w-[20px] 
          transform rounded-full bg-white shadow-lg ring-0 
          transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}

export default OnOffCrypto;
