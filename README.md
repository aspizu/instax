# Instax Print Layout Tool

A modern web application for arranging and printing photos in Instax instant film layouts. Create optimized PDF layouts for printing photos that fit perfectly in Instax frames.

## Features

- **Multi-format Support**: Layout photos for Instax Mini, Square, and Wide formats
- **Paper Size Options**: A4 and US Letter paper compatibility
- **Image Processing**: Built-in cropping, color filters, and LUT application
- **Drag & Drop Interface**: Intuitive photo management with trash can functionality
- **PDF Generation**: Export optimized layouts ready for printing
- **Color Filters**: Apply cinematic color grading with included LUT files

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Preact Signals
- **Build Tool**: Vite
- **Runtime**: Bun
- **Image Processing**: image-js library
- **PDF Generation**: jsPDF
- **Drag & Drop**: Atlassian Pragmatic Drag and Drop

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd instax
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Adding Photos
1. Use the sidebar to import photos from your device
2. Photos will appear in the main workspace area

### Editing Photos
- Click on any photo to open the crop dialog
- Adjust crop area to fit the selected Instax format
- Apply color filters using the available LUT presets

### Configuring Layout
1. **Select Film Format**: Choose between Mini (54×86mm), Square (72×86mm), or Wide (108×86mm)
2. **Select Paper Size**: Choose A4 (210×297mm) or US Letter (215.9×279.4mm)
3. The app automatically calculates optimal layout based on your selections

### Generating PDF
1. Arrange photos as desired in the workspace
2. Click the print/export button to generate a PDF
3. The PDF will contain your photos laid out optimally for the selected format

### Managing Photos
- **Drag photos** to rearrange their order
- **Drag to trash can** to remove unwanted photos
- Photos maintain their aspect ratio and crop settings

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── picture.tsx     # Individual photo component
│   ├── theme-provider.tsx
│   └── ui/             # shadcn/ui components
├── features/           # Main application features
│   ├── app.tsx         # Main app component
│   ├── crop-dialog.tsx # Photo cropping interface
│   └── sidebar.tsx     # Control sidebar
├── lib/                # Core utilities
│   ├── apply-cube.ts   # LUT application
│   ├── image.ts        # Image processing
│   ├── instax.ts       # Format definitions
│   ├── parse-cube.ts   # LUT parsing
│   └── print-pdf.ts    # PDF generation
├── state/              # Application state
└── types/              # TypeScript definitions
```

## Build Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run fmt` - Format code with Prettier

## Instax Format Specifications

### Mini Format
- **Frame**: 54×86mm
- **Image Area**: 46×62mm
- **Description**: Fits in a smartphone case

### Square Format
- **Frame**: 72×86mm
- **Image Area**: 62×62mm
- **Description**: Square format instant film

### Wide Format
- **Frame**: 108×86mm
- **Image Area**: 99×62mm
- **Description**: Wide format instant film

## Color Filters

The application includes 10 cinematic LUT files (`.cube` format) for color grading:
- Cinematic-1 through Cinematic-10
- Located in `public/` directory
- Applied using 3D color lookup tables

## Browser Compatibility

- Modern browsers with ES2022 support
- File System Access API for photo import
- Canvas API for image processing
- WebAssembly support recommended

## License

This project is private and not licensed for public use.

## Contributing

This is a personal project. Please reach out before contributing.
