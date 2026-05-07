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
    buttons: {
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল করুন",
      addToCart: "কার্টে যোগ করুন",
      leave: "ত্যাগ করুন",
      change: "পরিবর্তন করুন",
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
  modelCategory: {
    title: "বিভাগ নির্বাচন করুন",
    all: "সব বিভাগ",
    men: "পুরুষদের জন্য",
    women: "মহিলাদের জন্য",
    kids: "শিশুদের জন্য",
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
    },
    ordersHistory: {
      title: "অর্ডারের ইতিহাস",
      subtitle: "আপনার সব টেইলরিং অনুরোধ ট্র্যাক করুন",
      search: "রেফারেন্স দিয়ে খুঁজুন...",
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
};
