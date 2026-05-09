export const bn = {
  common: {
    units: {
      cm: "সেমি",
      inch: "ইঞ্চি",
    },
    currencies: {
      sar: "SAR",
      usd: "$",
    },
    categories: {
      all: "সব",
      men: "পুরুষ",
      women: "মহিলা",
      kids: "শিশু",
    },
    price: "মূল্য",
    optional: "ঐচ্ছিক",
    noAddress: "কোন ঠিকানা প্রদান করা হয়নি",
    buttons: {
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল করুন",
      addToCart: "কার্টে যোগ করুন",
      leave: "ত্যাগ করুন",
      change: "পরিবর্তন করুন",
      transfer: "স্থানান্তর করুন",
    },
    inputs: {
      imageInput: {
        placeholder: "আপলোড করতে ক্লিক করুন",
        info: "PNG, JPG সর্বোচ্চ ১০ মেগাবাইট",
        sourceModal: {
          title: "উৎস নির্বাচন করুন",
          camera: "ক্যামেরা",
          gallery: "গ্যালারি",
        },
      },
    },
    alerts: {
      unsavedChanges: {
        header: "অসংরক্ষিত পরিবর্তন",
        message: "আপনার কাছে অসংরক্ষিত পরিবর্তন আছে। আপনি কি নিশ্চিত যে আপনি চলে যেতে চান?",
      },
      changePhoto: {
        header: "ছবি পরিবর্তন করুন?",
        message: "এটি আপনার বর্তমান সমস্ত পয়েন্ট সরিয়ে ফেলবে।",
      },
      zoneOptions: {
        header: "জোন বিকল্প",
        addNew: "নতুন অল্টারেশন যোগ করুন",
        removeAll: "সমস্ত অল্টারেশন সরান",
      },
      noAlterations: "দয়া করে অন্তত একটি পরিবর্তন যোগ করুন।",
      itemAdded: "আইটেম সফলভাবে কার্টে যোগ করা হয়েছে।",
    },
    messages: {
      actionSuccess: "কাজটি সফল হয়েছে",
      actionError: "কাজটি ব্যর্থ হয়েছে",
    },
    errors: {
      voiceRecorder: {
        permissionDenied: "ভয়েস মেসেজ রেকর্ড করার জন্য মাইক্রোফোন অনুমতি প্রয়োজন।",
        startFailed: "রেকর্ডিং শুরু করতে ব্যর্থ হয়েছে।",
        saveFailed: "ভয়েস মেসেজ সেভ করতে ব্যর্থ হয়েছে।",
      },
      loadModels: "মডেল লোড করতে ব্যর্থ হয়েছে।",
      loadImages: "মডেলের ছবি লোড করতে ব্যর্থ হয়েছে।",
      loadAlterations: "পরিবর্তনগুলি লোড করতে ব্যর্থ হয়েছে।",
      loadOrders: "অর্ডার লোড করতে ব্যর্থ হয়েছে।",
      addToCartFailed: "কার্টে আইটেম যোগ করতে ব্যর্থ হয়েছে।",
      uploadImage: "ছবি আপলোড করতে ব্যর্থ হয়েছে।",
      requiredField: "এই ঘরটি পূরণ করা আবশ্যক",
    },
  },
  login: {
    form: {
      phoneNumber: {
        label: "ফোন নম্বর",
        placeholder: "আপনার ফোন নম্বর লিখুন",
        undefinedErrorMessage: "ফোন নম্বর প্রয়োজন",
        numericErrorMessage: "ফোন নম্বর অবশ্যই সংখ্যা হতে হবে",
        lengthErrorMessage: "ফোন নম্বর অবশ্যই ১০ ডিজিটের হতে হবে",
      },
      signup: {
        title: "আপনার প্রোফাইল সম্পূর্ণ করুন",
        firstName: {
          label: "প্রথম নাম",
          placeholder: "আপনার প্রথম নাম লিখুন",
        },
        lastName: {
          label: "শেষ নাম",
          placeholder: "আপনার শেষ নাম লিখুন",
        },
      },
      status: {
        pending: "আপনার লগইন অনুরোধ অ্যাডমিন অনুমোদনের অপেক্ষায় আছে।",
        rejected: "আপনার লগইন অনুরোধ প্রত্যাখ্যান করা হয়েছে।",
      },
      buttons: {
        login: "লগইন",
        signup: "নিবন্ধন করুন",
        back: "ফিরে যান",
      },
    },
  },
  profileSettings: {
    title: "সেটিংস",
    profile: {
      title: "প্রোফাইল পরিচালনা করুন",
      firstName: "প্রথম নাম",
      lastName: "শেষ নাম",
      phoneNumber: "ফোন নম্বর",
      email: "ইমেল (ঐচ্ছিক)",
      addresses: "ঠিকানা",
      noAddresses: "কোন ঠিকানা পাওয়া যায়নি",
      addAddress: "ঠিকানা যোগ করুন",
      editAddress: "ঠিকানা পরিবর্তন করুন",
      city: "শহর",
      district: "জেলা",
      street: "রাস্তা",
      updateError: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
    },
    preferences: {
      title: "পছন্দসমূহ",
      language: "ভাষা",
      darkTheme: "ডার্ক থিম",
    },
    identity: {
      title: "পরিচয়",
      logAsTailor: "দর্জি হিসেবে লগইন করুন",
      logAsCustomer: "গ্রাহক হিসেবে লগইন করুন",
      logout: "লগআউট",
    },
  },
  modelCategory: {
    title: "বিভাগ নির্বাচন করুন",
    all: "সব বিভাগ",
    men: "পুরুষদের জন্য",
    women: "মহিলাদের জন্য",
    kids: "শিশুদের জন্য",
  },
  orderStatus: {
    all: "সব",
    pending: "পেন্ডিং",
    waitingForTailorAssignement: "দর্জি নিয়োগের অপেক্ষায়",
    waitingForCourierAssignement: "কুরিয়ার নিয়োগের অপেক্ষায়",
    waitingForPickupFromCustomer: "গ্রাহকের থেকে পিকআপের অপেক্ষায়",
    waitingForDropoffToTailor: "দর্জিকে ডেলিভারির অপেক্ষায়",
    inProgress: "চলমান",
    waitingForReturnCourierAssignement: "ফেরত কুরিয়ার নিয়োগের অপেক্ষায়",
    waitingForPickupFromTailor: "দর্জির থেকে পিকআপের অপেক্ষায়",
    waitingForDropoffToCustomer: "গ্রাহককে ডেলিভারির অপেক্ষায়",
    done: "সম্পন্ন",
  },
  modelMode: {
    title: "মোড নির্বাচন করুন",
    predefined: {
      title: "বিদ্যমান মডেল",
      description: "আমাদের নির্ধারিত মডেল থেকে বেছে নিন",
    },
    custom: {
      title: "কাস্টম",
      description: "আপনার নিজের ছবি अपलोड করুন",
    },
  },
  predefinedModelsList: {
    title: "মডেল নির্বাচন করুন",
  },
  customModel: {
    title: "বিভাগ নির্বাচন করুন",
    upload: "আপনার ছবি আপলোড করুন",
    instructions: "পোশাকের যে অংশগুলি পরিবর্তন করতে চান সেখানে ক্লিক করুন",
    changePhoto: "ছবি পরিবর্তন করুন",
    pointSelection: "কাস্টম পয়েন্ট নির্বাচন",
    categories: {
      dress: "পোশাক",
      shirt: "শার্ট",
      pants: "প্যান্ট",
      sweater: "সোয়েটার",
      coat: "কোট",
      suit: "স্যুট",
    },
  },
  alterationForm: {
    alterationType: "অল্টারেশন ধরণ নির্বাচন করুন",
    extrasPrice: "অতিরিক্ত খরচ",
    price: "মোট মূল্য",
    noMoreAlterations: "এই বিভাগের জন্য আর কোনো অল্টারেশন উপলব্ধ নেই",
  },
  cart: {
    title: "কার্ট",
    showDetails: "বিস্তারিত দেখুন",
    hideDetails: "বিস্তারিত লুকান",
    emptyTitle: "আপনার কার্ট খালি",
    emptyDescription: "সেগুলো এখানে দেখতে কিছু পরিবর্তন যোগ করুন",
    shopNow: "এখনই কেনাকাটা করুন",
    alterations: "অল্টারেশন",
    moreImages: "আরও ছবি",
    zone: "অঞ্চল (Zone)",
    alteration: "পরিবর্তন (Alteration)",
    price: "মূল্য",
    itemsCount: "মোট আইটেম",
    totalPrice: "মোট মূল্য",
    clearAll: "সব মুছুন",
    checkout: "চেকআউট",
  },
  cartEdit: {
    title: "কার্ট আইটেম পরিবর্তন করুন",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    priceCard: {
      title: "মূল্যের বিবরণ",
      basePrice: "মূল দাম",
      extrasPrice: "অতিরিক্ত খরচ",
      totalPrice: "মোট মূল্য",
    },
  },
  customer: {
    dashboard: {
      title: "আমার ড্যাশবোর্ড",
      recentOrders: "সাম্প্রতিক অর্ডার",
      noOrders: "এখনও কোন অর্ডার নেই।",
    },
    ordersHistory: {
      title: "অর্ডারের ইতিহাস",
      subtitle: "আপনার সব টেইলরিং অনুরোধ ট্র্যাক করুন",
      search: "রেফারেন্স দিয়ে খুঁজুন...",
      noOrders: "আপনার মানদণ্ডের সাথে মেলে এমন কোনো অর্ডার পাওয়া যায়নি।",
    },
    orderDetails: {
      confirmReceipt: "কুরিয়ার থেকে রসিদ নিশ্চিত করুন",
      confirmReceiptSuccess: "রসিদ নিশ্চিত করা হয়েছে। অর্ডার এখন সম্পন্ন!",
      confirmReceiptError: "রসিদ নিশ্চিত করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    },
  },
  checkout: {
    address: {
      title: "ডেলিভারি ঠিকানা নির্বাচন করুন",
      empty: "আপনি এখনও কোন ঠিকানা যোগ করেননি।",
      addInProfile: "প্রোফাইলে ঠিকানা যোগ করুন",
    },
    orderInfo: {
      reference: "অর্ডার রেফারেন্স:",
      totalAmount: "মোট পরিমাণ:",
    },
    success: {
      title: "অর্ডার সম্পন্ন!",
      message: "আপনার অর্ডার #{reference} সফলভাবে সম্পন্ন হয়েছে এবং দর্জি নিয়োগের অপেক্ষায় আছে।",
    },
    buttons: {
      proceedToPayment: "পেমেন্টে এগিয়ে যান",
      bypassPayment: "পেমেন্ট বাইপাস করুন (টেস্টিং)",
    },
  },
  chat: {
    placeholder: "একটি বার্তা লিখুন...",
    recording: "রেকর্ডিং হচ্ছে...",
    mockMessages: {
      customer: "হ্যালো, আপনি কি এটি করতে পারবেন?",
      tailor: "হ্যাঁ অবশ্যই, আমরা আপনার জন্য এটি করতে পারি।",
    },
  },
  courier: {
    dashboard: {
      noPendingPickups: "কোন পেন্ডিং পিকআপ নেই",
    },
    orders: {
      noOrders: "কোন অর্ডার পাওয়া যায়নি",
      newAssignment: "নতুন অ্যাসাইনমেন্ট",
      returnTrip: "ফেরত ট্রিপ",
    },
    orderDetails: {
      confirmPickup: "পিকআপ নিশ্চিত করুন",
      markAsDelivered: "ডেলিভারি হিসেবে চিহ্নিত করুন",
      deliveryAddress: "ডেলিভারি ঠিকানা",
    },
  },
  wallet: {
    noTransactions: "কোন লেনদেন পাওয়া যায়নি",
    payoutRequest: {
      title: "পেআউট অনুরোধ",
      amountLabel: "উত্তোলনের পরিমাণ",
      submit: "অনুরোধ জমা দিন",
      success: "পেআউট অনুরোধ সফলভাবে জমা দেওয়া হয়েছে",
      error: "পেআউট অনুরোধ জমা দিতে ব্যর্থ হয়েছে",
      availableBalance: "উপলব্ধ ব্যালেন্স",
    },
  },
};
