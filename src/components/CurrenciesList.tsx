import { Listbox, Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type CurrenciesListProps = {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
};

async function populateSymbolList(): Promise<string[]> {
  const requestURL = "https://api.exchangerate.host/latest";
  try {
    const response = await fetch(requestURL);
    if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
    }
    const data = await response.json();
    const symbols = Object.keys(data.rates);
    return symbols;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const CurrenciesList = ({
  selectedCurrency,
  setSelectedCurrency,
}: CurrenciesListProps): JSX.Element => {
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCurrencies() {
      const symbols = await populateSymbolList();
      setSymbols(symbols);
    }

    fetchCurrencies();
  }, []);

  return (
    <div className="relative z-50">
      <Listbox value={selectedCurrency} onChange={setSelectedCurrency}>
        <div className="relative">
          <Listbox.Button
            className="relative w-28 h-10 cursor-default rounded-lg
           bg-stone-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none
            focus-visible:border-indigo-500 focus-visible:ring-2
             focus-visible:ring-white focus-visible:ring-opacity-75 
             focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 
             sm:text-sm"
          >
            <span className="block truncate">{selectedCurrency}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-100"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 w-28 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {symbols.map((c) => (
                <Listbox.Option
                  key={c}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-cyan-900" : "text-gray-900"
                    }`
                  }
                  value={c}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {c}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CurrenciesList;
