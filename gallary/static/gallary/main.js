/** @format */

class MetmusuamGallaryManageer {
  constructor(refreshInterval = 10, refreshIntervalThreshold = 8, primaryImage = false) {
    if (refreshInterval < 1) {
      throw new Error("Refresh interval must be at least 1 second.");
    }
    console.log("Metmesuean Gallary Manager Initialized");
    this.imageContainer = document.getElementById("image");
    this.spinner = document.getElementById("spinner");
    this.refreshInterval = refreshInterval;
    this.refreshIntervalThreshold = refreshIntervalThreshold;
    this.counter = refreshInterval; // seconds before changing arts
    this.intervalId = null;
    this.maxImagesCount = 471581; // As per Met Museum API documentation
    this.objectUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
    this.prefecthedImages = [];
    this.maxRetry = 100; // Max retry attempts to fetch a valid image
    this.modal = document.getElementById("artModal");
    this.modalBtn = document.getElementById("closeModal");
    this.title = document.getElementById("title");
    this.artist = document.getElementById("artist");
    this.creditLine = document.getElementById("creditLine");
    this.date = document.getElementById("date");
    this.primaryImage = primaryImage;

    this.init();
  }

  // Initialize the gallery manager
  async init() {
    this.imageContainer.onload = () => this.addLoadingClass();
    this.modalBtn.onclick = () => this.closeModal();
    this.imageContainer.onclick = () => this.openModal();
    this.spin();
    await this.fetchImageData();
    this.stopSpin();
    this.loadImage();
    this.upateCounter();
  }

  // Generate a random image ID
  getRandomId() {
    return Math.floor(Math.random() * this.maxImagesCount) + 1;
  }

  //  Fetch image data from the Met Museum API
  async fetchImageData() {
    let attemps = 0;
    while (attemps < this.maxRetry) {
      try {
        const response = await fetch(`${this.objectUrl}/${this.getRandomId()}`);
        if (!response.ok) {
          attemps++;
          console.log("attemping again..." + attemps);
          continue;
        }

        const data = await response.json();

        if (!data.primaryImageSmall && !data.primaryImage) {
          attemps++;
          console.log("attemping again..." + attemps);
          continue;
        }
        let url = this.getPreferedImageUrl(data.primaryImageSmall, data.primaryImage);

        this.prefecthedImages.push({
          imageUrl: url,
          title: data.title,
          artist: data.artistDisplayName,
          date: data.objectDate,
          creditLine: data.creditLine
        });
        console.log("Prefetched images count: " + this.prefecthedImages.length);

        break;
      } catch (error) {
        attemps++;
        console.log("attemping again..." + attemps);
      }
    }
  }

  // Load the next image from the prefetched images
  loadImage() {
    this.removeClassLoadingClass();
    const imgData = this.prefecthedImages.shift();
    if (!imgData) {
      alert("Seems like we were not able to load an art on time. Let us refresh the page and try again.");
      location.reload();
    }
    this.imageContainer.src = imgData.imageUrl;
    this.title.innerText = imgData.title.trim() || "Unknown Title";
    this.artist.innerText = imgData.artist.trim() || "Unknown Artist";
    this.creditLine.innerText = imgData.creditLine || "Unknown Credit Line";
    this.date.innerText = imgData.date || "Unknown Date";
  }
  async loadNextImage() {
    // Prefetch BEFORE counter reaches 0
    if (this.counter === this.refreshIntervalThreshold) {
      console.log("Prefetching next image...");
      await this.fetchImageData();
      return;
    }

    // When counter reaches 0, load the already-prefetched image
    if (this.counter === 0) {
      this.loadImage();
      this.counter = this.refreshInterval;
    }
  }

  // Update the countdown timer
  upateCounter() {
    this.intervalId = setInterval(() => {
      if (this.shouldDecrementCounter()) {
        document.getElementById("counter").innerText = this.counter;
        this.loadNextImage();
        this.counter--;
      }
    }, 1000);
  }

  // Remove loading class from image container
  removeClassLoadingClass() {
    this.imageContainer.classList.remove("loaded");
  }

  //  Add loading class to image container
  addLoadingClass() {
    this.imageContainer.classList.add("loaded");
  }

  getPreferedImageUrl(smallImageUrl, primaryImageUrl) {
    if (this.primaryImage && primaryImageUrl) {
      // If primaryImage is preferred and available
      console.log("Using primary image as preferred.");
      return primaryImageUrl;
    }
    return smallImageUrl ? smallImageUrl : primaryImageUrl; // Fallback to primaryImage if primaryImageSmall is not available
  }

  spin() {
    this.spinner.style.display = "block";
  }

  stopSpin() {
    this.spinner.style.display = "none";
  }

  openModal() {
    this.modal.classList.remove("hidden");
  }

  closeModal() {
    this.modal.classList.add("hidden");
  }

  shouldDecrementCounter() {
    return this.modal.classList.contains("hidden");
  }
}

window.metmusuamGallaryManageer = new MetmusuamGallaryManageer(20,4, false);
