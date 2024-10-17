# NeuronOS Dev Exercise

## Table of Contents
1. [Installation](#installation)
2. [Local Setup Instructions](#instructions)
4. [Assumptions](#assumptions)
5. [Architectural Decisions](#decisions)
6. [Future Improvements](#improvements)

## Chrome Extension Installation

You have two options to install this Chrome extension:
1. Install the latest build
2. Install from your local development environment

**Installing from the latest build**

The latest build (v0.0.3) can be [downloaded from this link](#download-link) as a zip file.

1. Click on the link above & download the zip file
2. Once the file is downloaded unzip the file
3. Note the directory where you unzipped the contents (the folder that contains the extension code)
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable “Developer mode” using the toggle in the upper-right corner
6. Click the **Load unpacked** button and select the directory that contains the extension code (ref: step 3)

The extension should now be available in Chrome, and you can open the popup to view and interact with messages.

**Installing from your local environment**

1. Follow the [instructions to setup and build this repository locally](#link-to-section)
2. Once the build has been completed, note the `dist/` directory that contains the build
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable “Developer mode” using the toggle in the upper-right corner
5. Click the **Load unpacked** button and select the `dist/` directory within this repository

## Development Setup Instructions

### Prerequisites
Ensure that you have the following software and corresponding version installed on your machine:

- **NodeJS** (v20.16.0 or higher)
- **NPM** (10 recommended)
- **Google Chrome** (Latest version)

**Clone the repository**
```
git clone <repo-url>/neuronos-dev-exercise.git
cd neuronos-dev-exercise
```

**Install the dependencies**
```
npm install
```

**Build the extension**
```
npm run build
```

This will generate the `dist/` directory that contains the unpacked extension.
