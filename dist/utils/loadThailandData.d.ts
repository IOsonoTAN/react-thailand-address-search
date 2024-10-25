import { ThailandData } from "../components/ThailandAddressSearch";
interface LoadThailandDataOptions {
    dataSource?: string;
}
export declare function loadThailandData({ dataSource, }: LoadThailandDataOptions): Promise<ThailandData[] | undefined>;
export {};
