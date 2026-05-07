export const en = {
  common: {
    units: {
      cm: "cm",
      inch: "inch",
    },
    currencies: {
      sar: "SAR",
      usd: "$",
    },
    categories: {
      all: "All",
      men: "Men",
      women: "Women",
      kids: "Kids",
    },
    price: "Price",
    optional: "Optional",
    buttons: {
      save: "Save",
      cancel: "Cancel",
      addToCart: "Add to Cart",
      leave: "Leave",
      change: "Change",
    },
    inputs: {
      imageInput: {
        placeholder: "Click to upload",
        info: "PNG, JPG up to 10MB",
        sourceModal: {
          title: "Choose a Source",
          camera: "Camera",
          gallery: "Gallery",
        },
      },
    },
    alerts: {
      unsavedChanges: {
        header: "Unsaved Changes",
        message: "You have unsaved alterations. Are you sure you want to leave?",
      },
      changePhoto: {
        header: "Change Photo?",
        message: "This will remove all your current pinpoints.",
      },
      zoneOptions: {
        header: "Zone Options",
        addNew: "Add New Alteration",
        removeAll: "Remove all alterations",
      },
      noAlterations: "Please add at least one alteration.",
      itemAdded: "Item added to cart successfully.",
    },
    errors: {
      voiceRecorder: {
        permissionDenied: "Microphone permission is required to record voice messages.",
        startFailed: "Failed to start recording.",
        saveFailed: "Failed to save voice message.",
      },
      loadModels: "Failed to load models.",
      loadImages: "Failed to load model images.",
      loadAlterations: "Failed to load alterations.",
      loadOrders: "Failed to load orders.",
      addToCartFailed: "Failed to add item to cart.",
      uploadImage: "Failed to upload image.",
      requiredField: "This field is required",
    },
  },
  login: {
    form: {
      phoneNumber: {
        label: "Phone Number",
        placeholder: "Enter your phone number",
        undefinedErrorMessage: "Phone Number is required",
        numericErrorMessage: "Phone Number must be numeric",
        lengthErrorMessage: "Phone Number must be 10 digits",
      },
      signup: {
        title: "Complete Your Profile",
        firstName: {
          label: "First Name",
          placeholder: "Enter your first name",
        },
        lastName: {
          label: "Last Name",
          placeholder: "Enter your last name",
        },
      },
      status: {
        pending: "Your login request is pending admin approval.",
        rejected: "Your login request has been rejected.",
      },
      buttons: {
        login: "Login",
        signup: "Sign Up",
        back: "Back",
      },
    },
  },
  profileSettings: {
    title: "Settings",
    profile: {
      title: "Manage Profile",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      email: "Email (optional)",
    },
    preferences: {
      title: "Preferences",
      language: "Language",
      darkTheme: "Dark Theme",
    },
    logAsTailor: "Login as Tailor",
    logAsCustomer: "Login as Customer",
    logout: "Logout",
  },
  modelCategory: {
    title: "Choose a Category",
    all: "All Categories",
    men: "Modify Men's Clothes",
    women: "Modify Women's Clothes",
    kids: "Modify Kids' Clothes",
  },
  orderStatus: {
    all: "All",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    waitingForPickup: "Waiting for Pickup",
  },
  modelMode: {
    title: "Choose a Mode",
    predefined: {
      title: "Existing Models",
      description: "Choose from our predefined models",
    },
    custom: {
      title: "Custom",
      description: "Upload your own photo",
    },
  },
  predefinedModelsList: {
    title: "Select a Model",
  },
  customModel: {
    title: "Choose a Category",
    upload: "Upload Your Photo",
    instructions: "Click on the areas of the garment you want to modify",
    changePhoto: "Change Photo",
    pointSelection: "Custom Point Selection",
    categories: {
      dress: "Dress",
      shirt: "Shirt",
      pants: "Pants",
      sweater: "Sweater",
      coat: "Coat",
      suit: "Suit",
    },
  },
  alterationForm: {
    alterationType: "Select an Alteration",
    extrasPrice: "Additional Cost",
    price: "Total Price",
    noMoreAlterations: "No more alterations are available for this section",
  },
  cart: {
    title: "Cart",
    showDetails: "Show details",
    hideDetails: "Hide details",
    emptyTitle: "Your cart is empty",
    emptyDescription: "Add some alterations to see them here",
    shopNow: "Shop Now",
    alterations: "Alterations",
    moreImages: "more images",
    zone: "Zone",
    alteration: "Alteration",
    price: "Price",
    itemsCount: "Total Items",
    totalPrice: "Total Price",
    clearAll: "Clear All",
    checkout: "Checkout",
  },
  cartEdit: {
    title: "Edit Cart Item",
    save: "Save",
    cancel: "Cancel",
    priceCard: {
      title: "Price details",
      basePrice: "Base Price",
      extrasPrice: "Additional Cost",
      totalPrice: "Total Price",
    },
  },
  customer: {
    dashboard: {
      title: "My Dashboard",
      recentOrders: "Recent Orders",
    },
    ordersHistory: {
      title: "Orders History",
      subtitle: "Track your tailoring requests",
      search: "Search by reference...",
    },
  },
  chat: {
    placeholder: "Type a message...",
    recording: "Recording...",
    mockMessages: {
      customer: "Hello, can you do this?",
      tailor: "Yes sure, we can do that for you.",
    },
  },
  tailor: {
    navBar: {
      dashboard: "Dashboard",
      orders: "Orders",
      wallet: "Wallet",
    },
    dashboard: {
      title: "Overview",
    },
    orders: {
      title: "Order List",
      subtitle: "Manage your orders",
      search: "Search for orders...",
    },
    wallet: {
      title: "Wallet",
      subtitle: "Manage your wallet",
      currentBalance: "Current Balance",
      income: "Income",
      transfers: "Transfers",
      recentTransaction: "Recent Transactions",
      payementRecieved: "Payment Received",
      transferSent: "Transfer Sent",
    },
    orderDetails: {
      title: "Order Details",
      reference: "Order Reference",
      referenceLabel: "Reference",
      alterations: {
        title: "Alterations",
      },
      chat: {
        title: "Chat with Customer",
      },
      acceptOrder: {
        buttonText: "Accept Order",
        successMessage: "Order accepted successfully",
        errorMessage: "Error accepting order",
      },
      declineOrder: {
        buttonText: "Decline Order",
        successMessage: "Order declined successfully",
        errorMessage: "Error declining order",
      },
      markAsCompleted: {
        buttonText: "Mark as Completed",
        successMessage: "Order marked as completed successfully",
        errorMessage: "Error marking order as completed",
      },
    },
  },
};
