[![npm version](https://badge.fury.io/js/react-thailand-address-search.svg)](https://badge.fury.io/js/react-thailand-address-search)
[![GitHub license](https://img.shields.io/github/license/IOsonoTAN/react-thailand-address-search.svg)](https://github.com/IOsonoTAN/react-thailand-address-search/blob/master/LICENSE)

# Thailand Location Search

This project is a React-based web application that provides a user-friendly interface for searching locations in Thailand. It allows users to search for provinces, districts, sub-districts, and postal codes in both Thai and English languages. The application is designed to be fast, efficient, and easy to use, making it an ideal tool for both locals and tourists navigating Thailand's administrative divisions.

![screenshot](https://res.cloudinary.com/dy4ckj9wb/image/upload/v1729849968/react-thailand-address-search/k0xwuns153xazyphzokz.png)

[Online Demo](https://react-thailand-address-autocomplete.vercel.app)

## Features

- Bilingual support (Thai/English)
- Postal code search
- Keyboard navigation
- Customizable styling
- Tailwind CSS integration
- TypeScript support
- Efficient data loading with ZIP compression
- Customizable display format
- Auto-highlighting of matched terms

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- JSZip: For creating a zip file from the JSON database

## How to use

### Install the package
```bash
npm install react-thailand-address-search
```

### Import the component (TypeScript)
```typescript
import ThailandAddressSearch, { ThailandData } from "react-thailand-address-search";
..
const [selectedLocation, setSelectedLocation] = useState<ThailandData | undefined>();
..
console.log(selectedLocation);

<ThailandAddressSearch
  language={language}
  highlightColor="bg-red-200"
  searchTermFormat=":districtName / :subdistrictName / :provinceName / :postalCode"
  onSelectLocation={setSelectedLocation}
  dataSource="/data/thailand.zip"
/>
```

Response data will be like this:
```typescript
interface ThailandData {
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
```

## Available Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| clearButtonClassName | `string` | No | `"absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"` | CSS class for clear button |
| containerClassName | `string` | No | `"max-w-md mx-auto mt-8"` | Container CSS class |
| dataSource | `string` | No | `/data/thailand.zip` | Custom path to data source |
| defaultValueId | `number` | No | - | Default value ID |
| displayFields | `string[]` | No | `["districtName", "subdistrictName", "provinceName", "postalCode"]` | Fields to display |
| dropdownSelectedColor | `string` | No | `"bg-green-200"` | CSS class for selected dropdown item |
| highlightColor | `string` | No | `"bg-yellow-200"` | CSS class or color for highlighting matches |
| inputClassName | `string` | No | `"w-full px-4 py-2..."` | Input field CSS class |
| language | `"th"` \| `"en"` | No | `"th"` | Sets display language |
| maxResults | `number` | No | `10` | Maximum number of results to show |
| placeholder | `string` | No | Language-based default: `Search for a location in Thailand...`  or  `ค้นหาสถานที่ในประเทศไทย...` | Input placeholder text |
| searchTermFormat | `string` | No | - | Custom format for display (e.g. `:districtName / :subdistrictName`) |
| separator | `string` | No | `" - "` | Separator for display fields |
| showClearButton | `boolean` | No | `true` | Show clear button |
| clickToClear | `boolean` | No | `false` | Click to clear input |
| readOnlyIfSelected | `boolean` | No | `false` | Read only if selected |
| onSelectLocation | `(location: ThailandData \| undefined) => void` | Yes | - | Selection callback function |

## Data Source

The component uses a compressed ZIP file containing Thailand location data. By default, it looks for `/data/thailand.zip` in your public folder. You can provide a custom path using the `dataSource` prop.

### Setting up the Data File

1. Download the data file from the [repository](/public/data/thailand.zip)
2. Place it in your project's public folder
3. Or specify a custom path using the `dataSource` prop

## Contributing

Contributions to improve the Thailand Location Search project are welcome. Please feel free to submit issues, feature requests, or pull requests to help enhance this tool for the community.
