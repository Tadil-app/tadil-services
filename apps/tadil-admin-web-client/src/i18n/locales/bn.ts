export const bn = {
  nav: {
    informations: "প্রয়োজনীয় তথ্য",
    alterations: "পরিবর্তনসমূহ",
    extras: "অতিরিক্ত",
    models: "নমুনা",
    users: "ব্যবহারকারী",
    loginRequests: "লগইন অনুরোধ",
    payoutRequests: "পেমেন্ট অনুরোধ",
    orders: "অর্ডার",
  },
  orders: {
    title: "অর্ডার মনিটরিং",
    subtitle: "সিস্টেমের সমস্ত অর্ডার মনিটর এবং পরিচালনা করুন",
    filters: {
      status: "অবস্থা",
      tailor: "দর্জি",
      courier: "কুরিয়ার",
    },
    table: {
      reference: "রেফ",
      date: "তারিখ",
      customer: "গ্রাহক",
      tailor: "দর্জি",
      courier: "কুরিয়ার",
      status: "অবস্থা",
      total: "মোট",
      actions: "ক্রিয়াকলাপ",
      empty: "কোনো অর্ডার পাওয়া যায়নি",
    },
    buttons: {
      reset: "ফিল্টার রিসেট করুন",
      assignTailor: "দর্জি নিযুক্ত করুন",
    },
    assignModal: {
      title: "দর্জি নিযুক্ত করুন",
      subtitle: "{ref} অর্ডারের জন্য ম্যানুয়ালি একজন দর্জি নিযুক্ত করুন",
      selectLabel: "একজন দর্জি চয়ন করুন",
      submit: "এখনই নিযুক্ত করুন",
    },
  },
  loginRequests: {
    title: "লগইন অনুরোধ",
    subtitle: "দর্জি এবং কুরিয়ার লগইন অনুমোদনের অনুরোধ পরিচালনা করুন",
    table: {
      name: "নাম",
      phone: "ফোন",
      role: "ভূমিকা",
      actions: "ক্রিয়াকলাপ",
      empty: "কোনো মুলতবি লগইন অনুরোধ নেই",
    },
    buttons: {
      approve: "অনুমোদন করুন",
      reject: "প্রত্যাখ্যান করুন",
    },
  },
  payoutRequests: {
    title: "পেমেন্ট অনুরোধ",
    subtitle: "দর্জি এবং কুরিয়ারদের কাছ থেকে অর্থ উত্তোলনের অনুরোধ পরিচালনা করুন",
    table: {
      user: "ব্যবহারকারী",
      amount: "পরিমাণ",
      date: "তারিখ",
      actions: "ক্রিয়াকলাপ",
      empty: "কোনো মুলতবি পেমেন্ট অনুরোধ নেই",
    },
    buttons: {
      fulfill: "সম্পন্ন করুন",
      reject: "প্রত্যাখ্যান করুন",
    },
    confirmations: {
      fulfill: "আপনি কি ব্যাংক ট্রান্সফার সম্পন্ন করেছেন? এটি ব্যবহারকারীর ব্যালেন্স থেকে বিয়োগ করা হবে।",
      reject: "আপনি কি নিশ্চিত যে আপনি এই অনুরোধটি প্রত্যাখ্যান করতে চান?",
    },
  },
  common: {
    loading: "লোড হচ্ছে...",
    currencies: {
      ras: "RAS",
      usd: "$",
    },
    tableHeaders: {
      id: "আইডি",
      englishName: "ইংরেজি নাম",
      arabicName: "আরবি নাম",
      hindiName: "হিন্দি নাম",
      bengaliName: "বাংলা নাম",
      urduName: "উর্দু নাম",
      value: "মান",
      unit: "একক",
      price: "মূল্য",
      actions: "ক্রিয়াকলাপ",
    },
    inputs: {
      englishName: {
        label: "ইংরেজি নাম",
        placeholder: "ইংরেজি নাম লিখুন",
        errorMessage: "ইংরেজি নাম আবশ্যক",
      },
      arabicName: {
        label: "আরবি নাম",
        placeholder: "আরবি নাম লিখুন",
        errorMessage: "আরবি নাম আবশ্যক",
      },
      hindiName: {
        label: "হিন্দি নাম",
        placeholder: "হিন্দি নাম লিখুন",
        errorMessage: "হিন্দি নাম আবশ্যক",
      },
      bengaliName: {
        label: "বাংলা নাম",
        placeholder: "বাংলা নাম লিখুন",
        errorMessage: "বাংলা নাম আবশ্যক",
      },
      urduName: {
        label: "উর্দু নাম",
        placeholder: "উর্দু নাম লিখুন",
        errorMessage: "উর্দু নাম আবশ্যক",
      },
      category: {
        options: {
          all: "সমস্ত",
          men: "পুরুষ",
          women: "মহিলা",
          kids: "বাচ্চা",
        },
        label: "বিভাগটি",
        placeholder: "বিভাগটি নির্বাচন করুন",
        errorMessage: "বিভাগটি আবশ্যক",
      },
      unit: {
        label: "একক (ঐচ্ছিক)",
        placeholder: "একক লিখুন",
        errorMessage: "একক আবশ্যক",
      },
      infoType: {
        label: "ধরন",
        placeholder: "ধরন নির্বাচন করুন",
        errorMessage: "ধরন আবশ্যক",
        options: {
          label: "অপশন",
          placeholder: "ধরন অপশন",
          newButtonText: "নতুন অপশন",
          text: "টেক্সট",
          number: "নম্বর",
          selectMenu: "সিলেক্ট মেনু",
          checkbox: "চেকবক্স",
          required: "আবশ্যক",
          optional: "ঐচ্ছিক",
        },
      },
      imageFile: {
        label: "ছবি",
        placeholder: "ছবি নির্বাচন করুন",
        errorMessage: "ছবি আবশ্যক",
      },
      price: {
        label: "মূল্য",
        placeholder: "0.00",
        errorMessage: "মূল্য আবশ্যক",
      },
      sections: {
        label: "বিভাগসমূহ",
        placeholder: "বিভাগসমূহ নির্বাচন করুন",
        errorMessage: "বিভাগসমূহ আবশ্যক",
      },
      informations: {
        label: "তথ্য",
        placeholder: "প্রয়োজনীয় তথ্য নির্বাচন করুন",
        errorMessage: "তথ্য আবশ্যক",
      },
      alterations: {
        label: "পরিবর্তনসমূহ",
        placeholder: "পরিবর্তনসমূহ নির্বাচন করুন",
        errorMessage: "পরিবর্তনসমূহ আবশ্যক",
      },
      extras: {
        label: "অতিরিক্ত",
        placeholder: "অতিরিক্ত নির্বাচন করুন",
        errorMessage: "অতিরিক্ত আবশ্যক",
      },
      userRole: {
        label: "ব্যবহারকারীর ভূমিকা",
        placeholder: "ব্যবহারকারীর ভূমিকা নির্বাচন করুন",
        errorMessage: "ব্যবহারকারীর ভূমিকা আবশ্যক",
      },
      phone: {
        label: "ফোন নম্বর",
        placeholder: "ফোন নম্বর লিখুন",
        undefinedErrorMessage: "ফোন নম্বর আবশ্যক",
        numericErrorMessage: "ফোন নম্বর অবশ্যই সংখ্যা হতে হবে",
        lengthErrorMessage: "ফোন নম্বর অবশ্যই ১০ ডিজিটের হতে হবে",
      },
      firstName: {
        label: "প্রথম নাম",
        placeholder: "প্রথম নাম লিখুন",
        errorMessage: "প্রথম নাম আবশ্যক",
      },
      lastName: {
        label: "শেষ নাম",
        placeholder: "শেষ নাম লিখুন",
        errorMessage: "শেষ নাম আবশ্যক",
      },
      email: {
        label: "ইমেল",
        placeholder: "ইমেল লিখুন",
        errorMessage: "ইমেল আবশ্যক",
      },
      city: {
        label: "শহর",
        placeholder: "শহর লিখুন",
        errorMessage: "শহর আবশ্যক",
      },
      commissionRate: {
        label: "কমিশন রেট (%)",
        placeholder: "কমিশন রেট লিখুন (যেমন: ১০)",
        errorMessage: "কমিশন রেট আবশ্যক",
      },
    },
    buttons: {
      cancel: "বাতিল করুন",
      add: "যোগ করুন",
      save: "সংরক্ষণ করুন",
      delete: "মুছে ফেলুন",
      confirm: "নিশ্চিত করুন",
    },
  },
  informations: {
    noInformations: {
      title: "কোনো পরিবর্তনসমূহ উপলব্ধ নেই",
      subTitle: "শুরু করতে একটি পরিবর্তন যোগ করুন",
    },
    addNewInformationModal: {
      title: "নতুন পরিবর্তন যোগ করুন",
      success: "পরিবর্তন সফলভাবে তৈরি হয়েছে",
      error: "পরিবর্তন যোগ করার সময় একটি ত্রুটি হয়েছে",
    },
    editInformationModal: {
      title: "পরিবর্তন সম্পাদনা করুন",
      success: "পরিবর্তন সফলভাবে আপডেট হয়েছে",
      error: "পরিবর্তন আপডেট করার সময় একটি ত্রুটি হয়েছে",
    },
    deleteInformation: {
      confirmMessage: "আপনি কি নিশ্চিত যে এই পরিবর্তনটি মুছে ফেলতে চান?",
      success: "পরিবর্তন সফলভাবে মুছে ফেলা হয়েছে",
      error: "পরিবর্তন মুছে ফেলার সময় একটি ত্রুটি হয়েছে",
    },
  },
  models: {
    noModels: {
      title: "কোনো নমুনা উপলব্ধ নেই",
      subTitle: "শুরু করতে একটি নমুনা যোগ করুন",
    },
    modelsListCard: {
      sections: "বিভাগসমূহ",
    },
    noModelSelected: {
      title: "কোনো নমুনা নির্বাচন করা হয়নি",
      subTitle: "তালিকা থেকে একটি নমুনা নির্বাচন করুন",
    },
    addNewModelModal: {
      title: "নতুন নমুনা যোগ করুন",
      success: "নমুনা সফলভাবে তৈরি হয়েছে",
      error: "নতুন নমুনা তৈরি করার সময় একটি ত্রুটি হয়েছে",
    },
    editModel: {
      title: "নমুনার নাম",
      success: "নমুনা সফলভাবে আপডেট হয়েছে",
      error: "নমুনা আপডেট করার সময় একটি ত্রুটি হয়েছে",
    },
    deleteModel: {
      confirmMessage: "আপনি কি নিশ্চিত যে এই নমুনাটি মুছে ফেলতে চান?",
      deleteButton: "নমুনা মুছে ফেলুন",
      success: "নমুনা সফলভাবে মুছে ফেলা হয়েছে",
      error: "নমুনা মুছে ফেলার সময় একটি ত্রুটি হয়েছে",
    },
    images: {
      deleteImage: {
        confirmMessage: "আপনি কি নিশ্চিত যে এই ছবিটি মুছে ফেলতে চান?",
        deleteButton: "ছবি মুছে ফেলুন",
        success: "ছবি সফলভাবে মুছে ফেলা হয়েছে",
        error: "ছবি মুছে ফেলার সময় একটি ত্রুটি হয়েছে",
      },
    },
    sections: {
      title: "বিভাগসমূহ",
      createSection: {
        addNewSection: "নতুন বিভাগ যোগ করুন",
        coordinatesPlaceholder:
          "ছবির উপর ড্র করুন এবং কমপক্ষে ৩টি বিন্দু নির্বাচন করুন",
        coordinatesValidated: "বিভাগ সফলভাবে নির্বাচন করা হয়েছে",
        success: "বিভাগ সফলভাবে তৈরি হয়েছে",
        error: "বিভাগ তৈরি করার সময় একটি ত্রুটি হয়েছে",
      },
      deleteSection: {
        confirmMessage: "আপনি কি নিশ্চিত যে এই বিভাগটি মুছে ফেলতে চান?",
        success: "বিভাগ সফলভাবে মুছে ফেলা হয়েছে",
        error: "বিভাগ মুছে ফেলার সময় একটি ত্রুটি হয়েছে",
      },
    },
  },
  alterations: {
    noAlterations: {
      title: "কোনো সেবাসমূহ উপলব্ধ নেই",
      subTitle: "শুরু করতে একটি পরিষেবা যোগ করুন",
    },
    addNewAlterationModal: {
      title: "নতুন পরিষেবা যোগ করুন",
      success: "পরিষেবা সফলভাবে তৈরি হয়েছে",
      error: "নতুন পরিষেবা তৈরি করার সময় একটি ত্রুটি হয়েছে",
    },
    editAlteration: {
      title: "পরিষেবা সম্পাদনা করুন",
      success: "পরিষেবা সফলভাবে আপডেট হয়েছে",
      error: "পরিষেবা আপডেট করার সময় একটি ত্রুটি হয়েছে",
    },
    deleteAlteration: {
      confirmMessage: "আপনি কি নিশ্চিত যে এই পরিষেবাটি মুছে ফেলতে চান?",
      success: "পরিষেবা সফলভাবে মুছে ফেলা হয়েছে",
      error: "পরিষেবা মুছে ফেলার সময় একটি ত্রুটি হয়েছে",
    },
  },
  extras: {
    noExtras: {
      title: "কোন অতিরিক্ত সুবিধা উপলব্ধ নেই",
      subTitle: "শুরু করতে একটি অতিরিক্ত যোগ করুন",
    },
    addNewExtraModal: {
      title: "নতুন অতিরিক্ত যোগ করুন",
      success: "অতিরিক্তটি সফলভাবে তৈরি করা হয়েছে",
      error: "নতুন অতিরিক্ত তৈরি করার সময় একটি ত্রুটি ঘটেছে",
    },
    editExtra: {
      title: "অতিরিক্ত সম্পাদনা করুন",
      success: "অতিরিক্তটি সফলভাবে আপডেট করা হয়েছে",
      error: "অতিরিক্ত আপডেট করার সময় একটি ত্রুটি ঘটেছে",
    },
    deleteExtra: {
      title: "আপনি কি নিশ্চিত যে আপনি এই অতিরিক্তটি মুছে ফেলতে চান?",
      success: "অতিরিক্তটি সফলভাবে মুছে ফেলা হয়েছে",
      error: "অতিরিক্ত মুছে ফেলার সময় একটি ত্রুটি ঘটেছে",
    },
  },
  users: {
    roles: {
      tailor: "দর্জি",
      customer: "গ্রাহক",
      courier: "কুরিয়ার",
    },
    tableHeaders: {
      firstName: "প্রথম নাম",
      lastName: "শেষ নাম",
      phone: "ফোন নম্বর",
      email: "ইমেল",
    },
    addNewUserModal: {
      title: "নতুন ব্যবহারকারী যোগ করুন",
      success: "ব্যবহারকারী সফলভাবে তৈরি করা হয়েছে",
      error: "নতুন ব্যবহারকারী তৈরি করার সময় একটি ত্রুটি ঘটেছে",
    },
    editUserModal: {
      title: "ব্যবহারকারী সম্পাদনা করুন",
      success: "ব্যবহারকারী সফলভাবে আপডেট করা হয়েছে",
      error: "ব্যবহারকারী আপডেট করার সময় একটি ত্রুটি ঘটেছে",
    },
    deleteUser: {
      confirmMessage: "আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে মুছে ফেলতে চান?",
      success: "ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে",
      error: "ব্যবহারকারী মুছে ফেলার সময় একটি ত্রুটি ঘটেছে",
    },
  },
  toast: {
    showDetails: "বিস্তারিত দেখুন",
    hideDetails: "বিস্তারিত লুকান",
  },
};
