import React from "react";
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
    placeholder?: string;
    maxResults?: number;
    displayFields?: string[];
}
declare const ThailandAddressSearch: React.FC<ThailandAddressSearchProps>;
export default ThailandAddressSearch;
