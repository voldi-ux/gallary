# Metmuseum Gallery Django App

This Django app displays random artworks from the [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/) using a dynamic JavaScript gallery manager. The gallery handles image prefetching, automatic refresh, modals for artwork details, and a spinner animation while loading.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Running the Django App](#running-the-django-app)
- [Gallery Class](#gallery-class)
- [Constructor Parameters](#constructor-parameters)
- [Methods](#methods)
- [Example Usage](#example-usage)
- [Future work](#Future-work)

---

## Features

- Fetches random artworks from the Met Museum API
- Displays primary or small images based on preference
- Prefetches images to avoid delays during refresh
- Countdown-based automatic image refreshing
- Modal popup with artwork details: title, artist, date, credit line
- Spinner animation while fetching data
- Retry logic if an artwork fails to load

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/voldi-ux/gallary.git
cd gallary
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Running the Django App

1. Start the development server:

```bash
python manage.py runserver
```

2. Open your browser and navigate to:

```
http://127.0.0.1:8000/
```

You should see the gallery displaying random artworks with countdown

---

## Gallery Class

The gallery functionality is handled by the `MetmuseumGallaryManageer` JavaScript class.

```javascript
new MetmusuamGallaryManageer(refreshInterval, refreshIntervalThreshold, primaryImage);
```

### Constructor Parameters

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `refreshInterval` | `number` | `10` | Time in seconds before the image automatically refreshes. Minimum is 1 second. |
| `refreshIntervalThreshold` | `number` | `8` | Time in seconds before the counter reaches 0 when the next image is prefetched. Helps avoid delays during refresh. |
| `primaryImage` | `boolean` | `true` | If `true`, prefers the high-resolution primary image from the API. If `false`, prefers smaller images when available. |

### Key Methods

| Method | Description |
|--------|-------------|
| `init()` | Initializes the gallery, binds event listeners, and starts prefetching. |
| `fetchImageData()` | Fetches artwork data from the Met Museum API. Handles retries if no image is found. |
| `loadImage()` | Loads the next prefetched image and updates modal details. |
| `loadNextImage()` | Prefetches next image and refreshes the display when counter reaches 0. |
| `upateCounter()` | Updates the countdown timer every second. |
| `addLoadingClass()` / `removeClassLoadingClass()` | Adds/removes CSS class for image loading animations. |
| `spin()` / `stopSpin()` | Shows/hides the loading spinner. |
| `openModal()` / `closeModal()` | Opens or closes the artwork modal. |
| `getPreferedImageUrl()` | Returns preferred image URL based on user preference. |
| `shouldDecrementCounter()` | Checks whether the counter should decrement (only if modal is hidden). |

---

---

## Example Usage

```javascript
// Prefers small images, refresh every 15 seconds, prefetch 5 seconds before counter ends
const gallery = new MetmusuamGallaryManageer(15, 5, false);
```

---


---
## Future work
The app can be improved in many ways e.g adding authentication and authorizations to allow people to login into the app to save their favorit arts. We also can allow users to share their favorits arts. From a technicall perpsective we can use one the sigle page applications e.g react to improve the UX and interactivity. We can try and preload a lot more images other than one into a buffer array. Perhaps caching can also be added to reduce number of requests on the server for images that the Gallary has already downloaded. 

---
