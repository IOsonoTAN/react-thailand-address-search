import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadThailandData } from "../utils/loadThailandData";

export interface ThailandData {
  id: number;
  provinceCode: number;
  provinceNameEn: string;
  provinceNameTh: string;
  districtCode: number;
  districtNameEn: string;
  districtNameTh: string;
  subdistrictCode: number;
  subdistrictNameEn: string;
  subdistrictNameTh: string;
  postalCode: number;
}

export interface ThailandAddressSearchProps {
  containerClassName?: string;
  inputClassName?: string;
  dataSource?: string;
  highlightColor?: string;
  language?: "th" | "en";
  onSelectLocation: (location: ThailandData | undefined) => void;
  searchTermFormat?: string;
}

const ThailandAddressSearch: React.FC<ThailandAddressSearchProps> = ({
  containerClassName = "max-w-md mx-auto mt-8",
  inputClassName = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  dataSource,
  highlightColor = "bg-yellow-200",
  language = "th",
  onSelectLocation,
  searchTermFormat = ":districtName - :subdistrictName - :provinceName - :postalCode",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ThailandData[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [thailandData, setThailandData] = useState<ThailandData[]>([]);
  const resultsContainerRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadThailandData({ dataSource })
      .then((data) => {
        if (data) {
          setThailandData(data);
        }
      })
      .catch((error) => console.error("Error loading Thailand data:", error));
  }, []);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm]);

  const filterResults = useCallback(
    (query: string) => {
      if (query.length < 2) return [];

      return thailandData.filter((item) => {
        if (/^\d+$/.test(query)) {
          return item.postalCode.toString().startsWith(query);
        }
        return Object.entries(item).some(([key, value]) => {
          if (key !== "id" && typeof value === "string") {
            if (language === "en" && key.endsWith("NameEn")) {
              return value.toLowerCase().includes(query.toLowerCase());
            } else if (language === "th" && key.endsWith("NameTh")) {
              return value.toLowerCase().includes(query.toLowerCase());
            }
          }
          if (key !== "id" && typeof value === "number") {
            return value.toString().includes(query);
          }
          return false;
        });
      });
    },
    [thailandData, language]
  );

  useEffect(() => {
    const filteredResults = filterResults(searchTerm);
    setResults(filteredResults);
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0;
    }
  }, [searchTerm, filterResults]);

  useEffect(() => {
    if (resultsContainerRef.current && focusedIndex >= 0) {
      const focusedElement = resultsContainerRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        const containerHeight = resultsContainerRef.current.clientHeight;
        const elementTop = focusedElement.offsetTop;
        const elementHeight = focusedElement.clientHeight;

        if (elementTop < resultsContainerRef.current.scrollTop) {
          resultsContainerRef.current.scrollTop = elementTop;
        } else if (
          elementTop + elementHeight >
          resultsContainerRef.current.scrollTop + containerHeight
        ) {
          resultsContainerRef.current.scrollTop =
            elementTop + elementHeight - containerHeight;
        }
      }
    }
  }, [focusedIndex]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className={highlightColor}>
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const getLocationText = (result: ThailandData): string => {
    const data =
      language === "en"
        ? {
            districtName: result.districtNameEn,
            subdistrictName: result.subdistrictNameEn,
            provinceName: result.provinceNameEn,
          }
        : {
            districtName: result.districtNameTh,
            subdistrictName: result.subdistrictNameTh,
            provinceName: result.provinceNameTh,
          };
    return searchTermFormat
      .replace(/:districtName/g, data.districtName)
      .replace(/:subdistrictName/g, data.subdistrictName)
      .replace(/:provinceName/g, data.provinceName)
      .replace(/:postalCode/g, result.postalCode.toString());
  };

  const renderLocationText = (result: ThailandData) => {
    const text = getLocationText(result);
    return highlightText(text, searchTerm);
  };

  const handleInputClick = () => {
    if (searchTerm !== "") {
      setSearchTerm("");
      setResults([]);
      onSelectLocation(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const selectedResult = results[focusedIndex];
      setSearchTerm(getLocationText(selectedResult));
      setResults([]);
      setFocusedIndex(-1);
      onSelectLocation(selectedResult);
    } else if (e.key === "Escape") {
      setResults([]);
      setFocusedIndex(-1);
      onSelectLocation(undefined);
    }
  };

  const handleSelectLocation = (result: ThailandData) => {
    setSearchTerm(getLocationText(result));
    setResults([]);
    setFocusedIndex(-1);
    onSelectLocation(result);
    inputRef.current?.blur();
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
          placeholder={
            language === "en"
              ? "Search for a location in Thailand..."
              : "ค้นหาสถานที่ในประเทศไทย..."
          }
          className={inputClassName}
        />
        {results.length > 0 && (
          <ul
            ref={resultsContainerRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {results.map((result, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  index === focusedIndex ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectLocation(result)}
              >
                {renderLocationText(result)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ThailandAddressSearch;
