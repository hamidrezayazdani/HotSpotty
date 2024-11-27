# HotSpotty: Interactive Image Annotation Library

## Overview

HotSpotty is a lightweight, versatile JavaScript library that enables interactive image annotation with customizable hotspots. Whether you're creating interactive guides, product showcases, or educational materials, HotSpotty provides a seamless way to add contextual information to images.

## Features

### Key Capabilities
- **Dual Mode Operation**: Switch between display and admin modes
- **Customizable Hotspots**: 
  - Configurable icons, colors, and animations
  - Responsive design
  - Mobile-friendly interface
- **Persistent Storage**: 
  - Local storage support
  - Easy export and import of hotspot data
- **Flexible Integration**: 
  - Works with any image container
  - Minimal setup required

## Installation

### Direct Script Include
```html
<link rel="stylesheet" href="hotspotty.css">
<script src="hotspotty.js"></script>
```

### Basic Initialization
```javascript
// Display Mode
HotSpottyManager.create('#image-container', {
    mode: 'display'
});

// Admin Mode
HotSpottyManager.create('#image-container', {
    mode: 'admin',
    defaultIcon: '🌟',
    defaultColor: '#FF6B6B'
});
```

## Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `mode` | String | Operation mode ('display' or 'admin') | 'display' |
| `initialSpots` | Array | Predefined hotspots | `[]` |
| `storageKey` | String | Local storage key for saving spots | `null` |
| `onSpotsChange` | Function | Callback when spots are modified | `null` |
| `defaultIcon` | String | Default marker icon | '📍' |
| `defaultColor` | String | Default marker color | '#1ABC9C' |
| `defaultAnimation` | String | Default marker animation | 'none' |

## Advanced Methods

- `addSpot(spotData)`: Programmatically add a hotspot
- `getSpots()`: Retrieve current hotspots
- `clearSpots()`: Remove all hotspots
- `populateSpots(spotsArray)`: Load hotspots from external source

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ with polyfills

## License
MIT License

## Contributing
Contributions are welcome! Please submit pull requests or open issues on our GitHub repository.

## Support
For questions, issues, or feature requests, please contact yazdaniwp@gmail.com.