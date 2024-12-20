(function () {
  class HotSpotty {
    constructor(containerSelector, options = {}) {
      try {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
          throw new Error(`Container not found: ${containerSelector}`);
        }

        this.targetElement = this.container.querySelector(options.tag || 'img');
        this.spots = [];
        this.config = this.mergeConfig(options);

        this.init();
      } catch (error) {
        console.error(`Error initializing HotSpotty: ${error.message}`);
      }
    }

    mergeConfig(options) {
      return {
        mode: options.mode || 'display',
        initialSpots: options.initialSpots || [],
        onSpotsChange: options.onSpotsChange || null,
        onSpotAdded: options.onSpotAdded || null,
        storageKey: options.storageKey || null,
        iconOptions: options.iconOptions || ['📍', '🔴', '🟢', '🔷', '❗', '❓'],
        animationOptions: options.animationOptions || ['pulse', 'bounce', 'none'],
        defaultIcon: options.defaultIcon || '📍',
        defaultColor: options.defaultColor || '#1ABC9C',
        defaultAnimation: options.defaultAnimation || 'none'
      };
    }

    init() {
      try {
        this.setupEventListeners();
        this.loadInitialSpots();
      } catch (error) {
        console.error(`Error during initialization: ${error.message}`);
      }
    }

    setupEventListeners() {
      if (!this.container) {
        console.error('Container not found or undefined.');
        return;
      }

      if (this.config.mode === 'admin') {
        if (typeof this.handleContainerClick === 'function') {
          this.container.addEventListener('click', this.handleContainerClick.bind(this));
        } else {
          console.error('handleContainerClick is not defined.');
        }
      }

      // Safely handle window resize
      if (typeof this.repositionSpots === 'function') {
        window.addEventListener('resize', this.repositionSpots.bind(this));
      } else {
        console.error('repositionSpots is not defined.');
      }
    }

    loadInitialSpots() {
      try {
        this.clearSpots();

        if (this.config.initialSpots && this.config.initialSpots.length) {
          this.config.initialSpots.forEach(spot => this.createSpot(spot));
        } else if (this.config.storageKey) {
          const savedSpots = localStorage.getItem(this.config.storageKey);
          if (savedSpots) {
            const parsedSpots = JSON.parse(savedSpots);
            parsedSpots.forEach(spot => this.createSpot(spot));
          }
        }
      } catch (error) {
        console.error(`Error loading initial spots: ${error.message}`);
      }
    }

    repositionSpots() {
      // Check if spots are available and container exists
      if (!this.container || this.spots.length === 0) {
        return;
      }

      // Loop through each spot and adjust its position
      this.spots.forEach((spot, index) => {
        const markers = this.container.querySelectorAll('.hotspotty-marker');
        const marker = markers[index]; // Match marker to spot data
        if (marker) {
          marker.style.left = `${spot.x}%`;
          marker.style.top = `${spot.y}%`;
        }
      });
    }

    handleContainerClick(event) {
      try {
        const containerRect = this.container.getBoundingClientRect();
        const x = ((event.clientX - containerRect.left) / containerRect.width) * 100;
        const y = ((event.clientY - containerRect.top) / containerRect.height) * 100;

        const title = prompt('Enter spot title:');
        const message = prompt('Enter spot message:');

        if (title || message) {
          const newSpot = {
            x,
            y,
            title: title || 'Untitled',
            message: message || '',
            icon: this.config.defaultIcon,
            color: this.config.defaultColor,
            animation: this.config.defaultAnimation
          };

          this.createSpot(newSpot);
        }
      } catch (error) {
        console.error(`Error handling container click: ${error.message}`);
      }
    }

    createSpot(spotData) {
      try {
        const marker = document.createElement('div');
        marker.className = `hotspotty-marker ${spotData.animation}`;
        marker.style.left = `${spotData.x}%`;
        marker.style.top = `${spotData.y}%`;
        marker.style.backgroundColor = spotData.color;
        marker.innerHTML = `
                    <span>${spotData.icon}</span>
                    <div class="hotspotty-tooltip">
                        <strong>${spotData.title}</strong>
                        <p>${spotData.message}</p>
                    </div>
                `;

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.className = 'hotspotty-hidden-input';
        hiddenInput.name = 'hotspotty_spots[]';
        hiddenInput.value = JSON.stringify(spotData);

        this.container.appendChild(marker);
        this.container.appendChild(hiddenInput);
        this.spots.push(spotData);

        this.triggerSpotsChange();

        if (this.config.onSpotAdded) {
          this.config.onSpotAdded(spotData);
        }

        this.saveSpots();
      } catch (error) {
        console.error(`Error creating spot: ${error.message}`);
      }
    }

    triggerSpotsChange() {
      if (this.config.onSpotsChange) {
        this.config.onSpotsChange([...this.spots]);
      }
    }

    saveSpots() {
      try {
        if (this.config.storageKey) {
          localStorage.setItem(this.config.storageKey, JSON.stringify(this.spots));
        }
      } catch (error) {
        console.error(`Error saving spots: ${error.message}`);
      }
    }

    getSpots() {
      return [...this.spots];
    }

    clearSpots() {
      try {
        const markers = this.container.querySelectorAll('.hotspotty-marker, .hotspotty-hidden-input');
        markers.forEach(marker => marker.remove());
        this.spots = [];

        if (this.config.storageKey) {
          localStorage.removeItem(this.config.storageKey);
        }

        this.triggerSpotsChange();
      } catch (error) {
        console.error(`Error clearing spots: ${error.message}`);
      }
    }

    addSpot(customSpotData) {
      const defaultSpot = {
        icon: this.config.defaultIcon,
        color: this.config.defaultColor,
        animation: this.config.defaultAnimation
      };
      this.createSpot({...defaultSpot, ...customSpotData});
    }

    populateSpots(spotsArray) {
      try {
        this.clearSpots();
        spotsArray.forEach(spot => this.createSpot(spot));
      } catch (error) {
        console.error(`Error populating spots: ${error.message}`);
      }
    }
  }

  window.HotSpottyManager = {
    instances: [],

    create: function (containerSelector, options = {}) {
      try {
        const hotspotty = new HotSpotty(containerSelector, options);
        this.instances.push(hotspotty);
        return hotspotty;
      } catch (error) {
        console.error(`Error creating HotSpotty instance: ${error.message}`);
      }
    },

    getInstances: function () {
      return this.instances;
    },

    clearAllSpots: function () {
      this.instances.forEach(instance => instance.clearSpots());
    }
  };
})();