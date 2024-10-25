import JSZip from "jszip";
import { ThailandData } from "../components/ThailandAddressSearch";

let cachedData: ThailandData[] | undefined = undefined;

interface LoadThailandDataOptions {
  dataSource?: string;
}

export async function loadThailandData({
  dataSource,
}: LoadThailandDataOptions) {
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(dataSource ?? "/data/thailand.zip");
    const zipBuffer = await response.arrayBuffer();

    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(zipBuffer);

    const jsonFile = await loadedZip.file("thailand.json")?.async("string");
    if (!jsonFile) {
      throw new Error("thailand.json not found in zip file");
    }

    cachedData = JSON.parse(jsonFile);
    return cachedData;
  } catch (error) {
    console.error("Error loading Thailand data:", error);
    throw error;
  }
}
