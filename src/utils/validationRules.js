export const createAdValidationRules = {
  title: {
    required: "Podaj tytuł ogłoszenia",
    minLength: {
      value: 5,
      message: "Tytuł musi mieć co najmniej 5 znaków",
    },
  },
  description: {
    required: "Podaj opis ogłoszenia",
    minLength: {
      value: 20,
      message: "Opis musi mieć co najmniej 20 znaków",
    },
  },
  price: {
    required: "Podaj cenę",
    min: {
      value: 0,
      message: "Cena nie może być ujemna",
    },
  },
  location: {
    required: "Podaj lokalizację",
  },
  category: {
    required: "Wybierz kategorię",
  },
};

export const createAdDefaultValues = {
  title: "",
  description: "",
  price: "",
  location: "",
  category: "",
};
