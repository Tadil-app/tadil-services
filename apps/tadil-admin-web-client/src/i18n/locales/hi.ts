export const hi = {
  nav: {
    informations: "बदलाव",
    alterations: "सेवाएं",
    extras: "अतिरिक्त",
    models: "प्रारूप",
  },
  common: {
    tableHeaders: {
      id: "आईडी",
      englishName: "अंग्रेजी नाम",
      arabicName: "अरबी नाम",
      hindiName: "हिंदी नाम",
      bengaliName: "बंगाली नाम",
      urduName: "उर्दू नाम",
      value: "मान",
      unit: "इकाई",
      price: "मूल्य",
      actions: "कार्यवाई",
    },
    inputs: {
      englishName: {
        label: "अंग्रेजी नाम",
        placeholder: "अंग्रेजी नाम दर्ज करें",
        errorMessage: "अंग्रेजी नाम आवश्यक है",
      },
      arabicName: {
        label: "अरबी नाम",
        placeholder: "अरबी नाम दर्ज करें",
        errorMessage: "अरबी नाम आवश्यक है",
      },
      hindiName: {
        label: "हिंदी नाम",
        placeholder: "हिंदी नाम दर्ज करें",
        errorMessage: "हिंदी नाम आवश्यक है",
      },
      bengaliName: {
        label: "बंगाली नाम",
        placeholder: "बंगाली नाम दर्ज करें",
        errorMessage: "बंगाली नाम आवश्यक है",
      },
      urduName: {
        label: "उर्दू नाम",
        placeholder: "उर्दू नाम दर्ज करें",
        errorMessage: "उर्दू नाम आवश्यक है",
      },
      category: {
        options: {
          all: "सभी",
          men: "पुरुष",
          women: "महिला",
          kids: "बच्चे",
        },
        label: "वर्ग",
        placeholder: "वर्ग चुनें",
        errorMessage: "वर्ग आवश्यक है",
      },
      unit: {
        label: "इकाई (वैकल्पिक)",
        placeholder: "इकाई दर्ज करें",
        errorMessage: "इकाई आवश्यक है",
      },
      imageFile: {
        label: "छवि",
        placeholder: "छवि चुनें",
        errorMessage: "छवि आवश्यक है",
      },
      price: {
        label: "मूल्य",
        placeholder: "0.00",
        errorMessage: "मूल्य आवश्यक है",
      },
      sections: {
        label: "खंड",
        placeholder: "खंड चुनें",
        errorMessage: "खंड आवश्यक हैं",
      },
      alterations: {
        label: "बदलाव",
        placeholder: "बदलाव चुनें",
        errorMessage: "बदलाव आवश्यक हैं",
      },
    },
    buttons: {
      cancel: "रद्द करें",
      add: "जोड़ें",
      save: "सहेजें",
      delete: "मिटाएँ",
    },
  },
  alterations: {
    noAlterations: {
      title: "कोई बदलाव उपलब्ध नहीं",
      subTitle: "शुरू करने के लिए एक बदलाव जोड़ें",
    },
    addNewAlterationModal: {
      title: "नया बदलाव जोड़ें",
      success: "बदलाव सफलतापूर्वक बनाया गया",
      error: "बदलाव जोड़ते समय एक त्रुटि हुई",
    },
    editAlterationModal: {
      title: "बदलाव संपादित करें",
      success: "बदलाव सफलतापूर्वक अपडेट किया गया",
      error: "बदलाव अपडेट करते समय एक त्रुटि हुई",
    },
    deleteAlteration: {
      confirmMessage: "क्या आप वाकई इस बदलाव को हटाना चाहते हैं?",
      success: "बदलाव सफलतापूर्वक हटाया गया",
      error: "बदलाव हटाते समय एक त्रुटि हुई",
    },
  },
  models: {
    noModels: {
      title: "कोई प्रारूप उपलब्ध नहीं",
      subTitle: "शुरू करने के लिए एक प्रारूप जोड़ें",
    },
    modelsListCard: {
      sections: "खंड",
    },
    noModelSelected: {
      title: "कोई प्रारूप नहीं चुना गया",
      subTitle: "सूची से एक प्रारूप चुनें",
    },
    addNewModelModal: {
      title: "नया प्रारूप जोड़ें",
      success: "प्रारूप सफलतापूर्वक बनाया गया",
      error: "नया प्रारूप बनाते समय एक त्रुटि हुई",
    },
    editModel: {
      title: "प्रारूप नाम",
      success: "प्रारूप सफलतापूर्वक अपडेट किया गया",
      error: "प्रारूप अपडेट करते समय एक त्रुटि हुई",
    },
    deleteModel: {
      confirmMessage: "क्या आप वाकई इस प्रारूप को हटाना चाहते हैं?",
      deleteButton: "प्रारूप मिटाएँ",
      success: "प्रारूप सफलतापूर्वक हटाया गया",
      error: "प्रारूप हटाते समय एक त्रुटि हुई",
    },
    images: {
      deleteImage: {
        confirmMessage: "क्या आप वाकई इस छवि को हटाना चाहते हैं?",
        deleteButton: "छवि मिटाएँ",
        success: "छवि सफलतापूर्वक हटाया गया",
        error: "छवि हटाते समय एक त्रुटि हुई",
      },
    },
    sections: {
      title: "खंड",
      createSection: {
        addNewSection: "नया खंड जोड़ें",
        coordinatesPlaceholder: "छवि पर ड्रा करें और कम से कम 3 बिंदु चुनें",
        coordinatesValidated: "खंड सफलतापूर्वक चुना गया",
        success: "खंड सफलतापूर्वक बनाया गया",
        error: "खंड बनाते समय एक त्रुटि हुई",
      },
      deleteSection: {
        confirmMessage: "क्या आप वाकई इस खंड को हटाना चाहते हैं?",
        success: "खंड सफलतापूर्वक हटाया गया",
        error: "खंड हटाते समय एक त्रुटि हुई",
      },
    },
  },
  services: {
    noServices: {
      title: "कोई सेवाएं उपलब्ध नहीं",
      subTitle: "शुरू करने के लिए एक सेवा जोड़ें",
    },
    addNewServiceModal: {
      title: "नई सेवा जोड़ें",
      success: "सेवा सफलतापूर्वक बनाई गई",
      error: "नई सेवा बनाते समय एक त्रुटि हुई",
    },
    editService: {
      title: "सेवा संपादित करें",
      success: "सेवा सफलतापूर्वक अपडेट की गई",
      error: "सेवा अपडेट करते समय एक त्रुटि हुई",
    },
    deleteService: {
      confirmMessage: "क्या आप वाकई इस सेवा को हटाना चाहते हैं?",
      success: "सेवा सफलतापूर्वक हटाई गई",
      error: "सेवा हटाते समय एक त्रुटि हुई",
    },
  },
  extras: {
    noExtras: {
      title: "कोई अतिरिक्त सुविधा उपलब्ध नहीं है",
      subTitle: "शुरू करने के लिए एक अतिरिक्त जोड़ें",
    },
    addNewExtraModal: {
      title: "नई अतिरिक्त सुविधा जोड़ें",
      success: "अतिरिक्त सुविधा सफलतापूर्वक बनाई गई",
      error: "नई अतिरिक्त सुविधा बनाते समय त्रुटि हुई",
    },
    editExtra: {
      title: "अतिरिक्त सुविधा संपादित करें",
      success: "अतिरिक्त सुविधा सफलतापूर्वक अपडेट की गई",
      error: "अतिरिक्त सुविधा अपडेट करते समय त्रुटि हुई",
    },
    deleteExtra: {
      title: "क्या आप वाकई इस अतिरिक्त सुविधा को हटाना चाहते हैं?",
      success: "अतिरिक्त सुविधा सफलतापूर्वक हटा दी गई",
      error: "अतिरिक्त सुविधा हटाते समय त्रुटि हुई",
    },
  },
};
