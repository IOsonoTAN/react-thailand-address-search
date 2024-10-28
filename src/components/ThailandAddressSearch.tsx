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
  dataSource?: string;
  defaultValueId?: number;
  displayFields?: string[];
  dropdownSelectedColor?: string;
  highlightColor?: string;
  inputClassName?: string;
  language?: "th" | "en";
  maxResults?: number;
  placeholder?: string;
  searchTermFormat?: string;
  separator?: string;
  onSelectLocation: (location: ThailandData | undefined) => void;
  showClearButton?: boolean;
  clearButtonClassName?: string;
  clickToClear?: boolean;
  readOnlyIfSelected?: boolean;
}

const ThailandAddressSearch: React.FC<ThailandAddressSearchProps> = ({
  containerClassName = "max-w-md mx-auto mt-8",
  clearButtonClassName = "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
  dataSource,
  defaultValueId,
  displayFields = [
    "districtName",
    "subdistrictName",
    "provinceName",
    "postalCode",
  ],
  dropdownSelectedColor = "bg-green-200",
  highlightColor = "bg-yellow-200",
  inputClassName = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  language = "th",
  maxResults = 10,
  placeholder,
  searchTermFormat,
  separator = " - ",
  showClearButton = true,
  onSelectLocation,
  clickToClear = true,
  readOnlyIfSelected = true,
}) => {
  const [searchTermId, setSearchTermId] = useState<number | undefined>();
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

  useEffect(() => {
    if (defaultValueId) {
      const defaultValue = thailandData.find(
        (item) => item.id === defaultValueId
      );
      if (defaultValue) {
        setSearchTermId(defaultValueId);
        setSearchTerm(getLocationText(defaultValue));
        onSelectLocation(defaultValue);
      }
    }
  }, [defaultValueId, thailandData]);

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
    setResults(filteredResults.slice(0, maxResults));
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0;
    }
  }, [searchTerm, filterResults, maxResults]);

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
            <mark
              key={i}
              style={{
                backgroundColor: highlightColor.startsWith("bg-")
                  ? undefined
                  : highlightColor,
              }}
              className={
                highlightColor.startsWith("bg-") ? highlightColor : undefined
              }
            >
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
            postalCode: result.postalCode.toString(),
          }
        : {
            districtName: result.districtNameTh,
            subdistrictName: result.subdistrictNameTh,
            provinceName: result.provinceNameTh,
            postalCode: result.postalCode.toString(),
          };

    if (searchTermFormat) {
      let formattedText = searchTermFormat;
      Object.entries(data).forEach(([key, value]) => {
        formattedText = formattedText.replace(
          new RegExp(`:${key}`, "g"),
          value || ""
        );
      });
      return formattedText;
    }

    if (displayFields && displayFields.length > 0) {
      return displayFields
        .map((field) => data[field as keyof typeof data])
        .filter(Boolean)
        .join(separator);
    }

    return "";
  };

  const renderLocationText = (result: ThailandData) => {
    const text = getLocationText(result);
    return highlightText(text, searchTerm);
  };

  const handleInputClick = () => {
    if (clickToClear && searchTerm !== "") {
      setSearchTermId(undefined);
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
      setSearchTermId(selectedResult.id);
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
    setSearchTermId(result.id);
    setSearchTerm(getLocationText(result));
    setResults([]);
    setFocusedIndex(-1);
    onSelectLocation(result);
    inputRef.current?.blur();
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setResults([]);
      setFocusedIndex(-1);
      if (!searchTerm.trim()) {
        setSearchTerm("");
        setSearchTermId(undefined);
        onSelectLocation(undefined);
      }
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setSearchTermId(undefined);

    if (!newValue.trim()) {
      setResults([]);
      onSelectLocation(undefined);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchTerm("");
    setSearchTermId(undefined);
    setResults([]);
    onSelectLocation(undefined);
    inputRef.current?.focus();
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnlyIfSelected && !!searchTermId}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          placeholder={
            placeholder ||
            (language === "en"
              ? "Search for a location in Thailand..."
              : "ค้นหาสถานที่ในประเทศไทย...")
          }
          className={`${inputClassName} ${showClearButton ? "pr-8" : ""}`}
        />
        {showClearButton && searchTerm && (
          <button
            onClick={handleClear}
            className={clearButtonClassName}
            type="button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {results.length > 0 && (
          <ul
            ref={resultsContainerRef}
            className={
              "absolute z-10 w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            }
          >
            {results.map((result, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  index === focusedIndex
                    ? dropdownSelectedColor
                    : "hover:bg-gray-100"
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
