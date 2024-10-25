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
    onSelectLocation: (location: ThailandData | undefined) => void;
    containerClassName?: string;
    highlightColor?: string;
    searchTermFormat?: string;
    language?: "th" | "en";
    dataSource?: string;
}
declare const ThailandAddressSearch: React.FC<ThailandAddressSearchProps>;
export default ThailandAddressSearch;
