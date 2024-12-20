import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadThailandData } from "../utils/loadThailandData";
var ThailandAddressSearch = function (_a) {
    var _b = _a.containerClassName, containerClassName = _b === void 0 ? "max-w-md mx-auto mt-8" : _b, _c = _a.inputClassName, inputClassName = _c === void 0 ? "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" : _c, dataSource = _a.dataSource, _d = _a.highlightColor, highlightColor = _d === void 0 ? "bg-yellow-200" : _d, _e = _a.language, language = _e === void 0 ? "th" : _e, onSelectLocation = _a.onSelectLocation, _f = _a.searchTermFormat, searchTermFormat = _f === void 0 ? ":districtName - :subdistrictName - :provinceName - :postalCode" : _f, placeholder = _a.placeholder, _g = _a.maxResults, maxResults = _g === void 0 ? 10 : _g, _h = _a.displayFields, displayFields = _h === void 0 ? [
        "districtName",
        "subdistrictName",
        "provinceName",
        "postalCode",
    ] : _h;
    var _j = useState(""), searchTerm = _j[0], setSearchTerm = _j[1];
    var _k = useState([]), results = _k[0], setResults = _k[1];
    var _l = useState(-1), focusedIndex = _l[0], setFocusedIndex = _l[1];
    var _m = useState([]), thailandData = _m[0], setThailandData = _m[1];
    var resultsContainerRef = useRef(null);
    var inputRef = useRef(null);
    useEffect(function () {
        loadThailandData({ dataSource: dataSource })
            .then(function (data) {
            if (data) {
                setThailandData(data);
            }
        })
            .catch(function (error) { return console.error("Error loading Thailand data:", error); });
    }, []);
    useEffect(function () {
        setFocusedIndex(-1);
    }, [searchTerm]);
    var filterResults = useCallback(function (query) {
        if (query.length < 2)
            return [];
        return thailandData.filter(function (item) {
            if (/^\d+$/.test(query)) {
                return item.postalCode.toString().startsWith(query);
            }
            return Object.entries(item).some(function (_a) {
                var key = _a[0], value = _a[1];
                if (key !== "id" && typeof value === "string") {
                    if (language === "en" && key.endsWith("NameEn")) {
                        return value.toLowerCase().includes(query.toLowerCase());
                    }
                    else if (language === "th" && key.endsWith("NameTh")) {
                        return value.toLowerCase().includes(query.toLowerCase());
                    }
                }
                if (key !== "id" && typeof value === "number") {
                    return value.toString().includes(query);
                }
                return false;
            });
        });
    }, [thailandData, language]);
    useEffect(function () {
        var filteredResults = filterResults(searchTerm);
        setResults(filteredResults.slice(0, maxResults));
        if (resultsContainerRef.current) {
            resultsContainerRef.current.scrollTop = 0;
        }
    }, [searchTerm, filterResults, maxResults]);
    useEffect(function () {
        if (resultsContainerRef.current && focusedIndex >= 0) {
            var focusedElement = resultsContainerRef.current.children[focusedIndex];
            if (focusedElement) {
                var containerHeight = resultsContainerRef.current.clientHeight;
                var elementTop = focusedElement.offsetTop;
                var elementHeight = focusedElement.clientHeight;
                if (elementTop < resultsContainerRef.current.scrollTop) {
                    resultsContainerRef.current.scrollTop = elementTop;
                }
                else if (elementTop + elementHeight >
                    resultsContainerRef.current.scrollTop + containerHeight) {
                    resultsContainerRef.current.scrollTop =
                        elementTop + elementHeight - containerHeight;
                }
            }
        }
    }, [focusedIndex]);
    var highlightText = function (text, highlight) {
        if (!highlight.trim()) {
            return React.createElement("span", null, text);
        }
        var regex = new RegExp("(".concat(highlight, ")"), "gi");
        var parts = text.split(regex);
        return (React.createElement("span", null, parts.filter(String).map(function (part, i) {
            return regex.test(part) ? (React.createElement("mark", { key: i, className: highlightColor }, part)) : (React.createElement("span", { key: i }, part));
        })));
    };
    var getLocationText = function (result) {
        var data = language === "en"
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
        if (displayFields && displayFields.length > 0) {
            return displayFields
                .map(function (field) { return data[field]; })
                .filter(Boolean)
                .join(" - ");
        }
        var formattedText = searchTermFormat;
        Object.entries(data).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            formattedText = formattedText.replace(new RegExp(":".concat(key), "g"), value || "");
        });
        return formattedText;
    };
    var renderLocationText = function (result) {
        var text = getLocationText(result);
        return highlightText(text, searchTerm);
    };
    var handleInputClick = function () {
        if (searchTerm !== "") {
            setSearchTerm("");
            setResults([]);
            onSelectLocation(undefined);
        }
    };
    var handleKeyDown = function (e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(function (prev) { return (prev < results.length - 1 ? prev + 1 : prev); });
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex(function (prev) { return (prev > 0 ? prev - 1 : 0); });
        }
        else if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            var selectedResult = results[focusedIndex];
            setSearchTerm(getLocationText(selectedResult));
            setResults([]);
            setFocusedIndex(-1);
            onSelectLocation(selectedResult);
        }
        else if (e.key === "Escape") {
            setResults([]);
            setFocusedIndex(-1);
            onSelectLocation(undefined);
        }
    };
    var handleSelectLocation = function (result) {
        var _a;
        setSearchTerm(getLocationText(result));
        setResults([]);
        setFocusedIndex(-1);
        onSelectLocation(result);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    };
    var handleInputBlur = function () {
        setTimeout(function () {
            setResults([]);
            setFocusedIndex(-1);
            if (!searchTerm.trim()) {
                setSearchTerm("");
                onSelectLocation(undefined);
            }
        }, 200);
    };
    return (React.createElement("div", { className: containerClassName },
        React.createElement("div", { className: "relative" },
            React.createElement("input", { ref: inputRef, type: "text", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onKeyDown: handleKeyDown, onClick: handleInputClick, onBlur: handleInputBlur, placeholder: placeholder ||
                    (language === "en"
                        ? "Search for a location in Thailand..."
                        : "ค้นหาสถานที่ในประเทศไทย..."), className: inputClassName }),
            results.length > 0 && (React.createElement("ul", { ref: resultsContainerRef, className: "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto" }, results.map(function (result, index) { return (React.createElement("li", { key: index, className: "px-4 py-2 cursor-pointer ".concat(index === focusedIndex ? "bg-blue-100" : "hover:bg-gray-100"), onClick: function () { return handleSelectLocation(result); } }, renderLocationText(result))); }))))));
};
export default ThailandAddressSearch;
