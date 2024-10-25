[![npm version](https://badge.fury.io/js/package-name.svg)](https://badge.fury.io/js/package-name)
[![GitHub license](https://img.shields.io/github/license/username/repo-name.svg)](https://github.com/username/repo-name/blob/master/LICENSE)

# Thailand Location Search

This project is a React-based web application that provides a user-friendly interface for searching locations in Thailand. It allows users to search for provinces, districts, sub-districts, and postal codes in both Thai and English languages. The application is designed to be fast, efficient, and easy to use, making it an ideal tool for both locals and tourists navigating Thailand's administrative divisions.

![screenshot](https://res.cloudinary.com/dy4ckj9wb/image/upload/v1729849968/react-thailand-address-search/k0xwuns153xazyphzokz.png)

[Online Demo](https://react-thailand-address-autocomplete.vercel.app)

## Features

- Search for locations in Thailand by province, district, sub-district, or postal code
- Supports both Thai and English languages for seamless bilingual usage
- Auto-complete suggestions as you type, improving search efficiency
- Keyboard navigation support for search results, enhancing accessibility
- Responsive design for various screen sizes, from mobile devices to desktop computers
- Fast and efficient search algorithm for quick results
- Detailed information display for selected locations

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- JSZip: For creating a zip file from the JSON database

## How to use

Install the package
```bash
npm install react-thailand-address-search
```

Import the component (TypeScript)
```typescript
import ThailandAddressSearch, { ThailandData } from "react-thailand-address-search";
..
const [selectedLocation, setSelectedLocation] = useState<ThailandData | undefined>();
..
console.log(selectedLocation);
/**
 * Callback data
 {
    "id": 31,
    "provinceCode": 10,
    "provinceNameEn": "Bangkok",
    "provinceNameTh": "กรุงเทพมหานคร",
    "districtCode": 1005,
    "districtNameEn": "Bang Khen",
    "districtNameTh": "บางเขน",
    "subdistrictCode": 100502,
    "subdistrictNameEn": "Anusawari",
    "subdistrictNameTh": "อนุสาวรีย์",
    "postalCode": 10220
  }
 */

<ThailandAddressSearch
  language={language}
  highlightColor="bg-red-200"
  searchTermFormat=":districtName / :subdistrictName / :provinceName / :postalCode"
  onSelectLocation={setSelectedLocation}
  dataSource="/data/thailand.zip"
/>
```

## Available parameters

| Parameter | Type | Mandatory | Description |
|-----------|------|-----------|-------------|
| language | `"th"` \| `"en"` | Yes | Sets the display language for the component (Thai or English) |
| highlightColor | `string` | Yes | CSS class name for highlighting matched search terms |
| searchTermFormat | `string` | Yes | Template string for formatting how search results are displayed |
| dataSource | `string` | No | URL path to the ZIP file containing Thailand location data (Default: `/data/thailand.zip` in public folder) |

Where to get the data?
You can get the data from [data/thailand.zip](/public/data/thailand.zip).

## How It Works

1. The application loads a comprehensive JSON database of Thailand's administrative divisions on startup.
2. Users can input their search query in the search box using either Thai or English characters.
3. As the user types, the application employs a fast filtering algorithm to search the database and display matching results in real-time.
4. Users can select a result using mouse clicks or keyboard navigation (arrow keys and enter).
5. The selected location details are displayed below the search box, including province, district, sub-district, and postal code in both Thai and English.
6. The application maintains a responsive layout, adjusting to different screen sizes for optimal user experience on various devices.
7. Dont forget to run `npm run create-zip` to create the zip file for the database. and don't upload the json file to the production.

## Components

### ThailandSearch

The main component that handles the search functionality. It includes:

- Input field for search queries with real-time updates
- Results list with auto-complete suggestions, displaying up to 10 results at a time
- Keyboard navigation support for easy result selection
- Language toggle between Thai and English, affecting both input and output
- Error handling for invalid searches or no results found

### LocationDisplay

A component responsible for displaying the details of the selected location, including:

- Province name (Thai and English)
- District name (Thai and English)
- Sub-district name (Thai and English)
- Postal code

## Data Source

The Thailand location data is sourced from the [Thailand.js](https://github.com/earthchie/jquery.Thailand.js) project, which provides a comprehensive and up-to-date database of Thailand's administrative divisions. This data is then optimized and formatted to work efficiently with our React application.

## Performance Optimization

- The application uses memoization techniques to prevent unnecessary re-renders
- The search algorithm is optimized for fast filtering of large datasets
- Lazy loading is implemented for improved initial load times

## Future Enhancements

- Integration with mapping services for visual location representation
- Addition of more detailed information for each location, such as population data or points of interest
- Implementation of a backend API for more advanced search capabilities and data management

## Contributing

Contributions to improve the Thailand Location Search project are welcome. Please feel free to submit issues, feature requests, or pull requests to help enhance this tool for the community.
