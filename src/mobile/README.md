# Nightwatch Mobile

## Prerequisites

- Node.js >= v10 LTS
- NativeScript (`npm install -g nativescript` or `yarn global add nativescript`)

## Usage

``` bash
cd src/mobile

# Install dependencies
npm i # (or yarn)

# Preview the application, watch for changes
tns preview --bundle

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle
```