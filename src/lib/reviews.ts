export type Review = {
  author: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5 | null;
  date: string;
  isExample: boolean;
};

type BranchReviews = {
  writeUrl: string;
  readUrl: string;
  reviews: Review[];
};

// Completa los enlaces oficiales de cada sucursal. Vacíos usan la búsqueda en Maps.
// Sustituye cada ejemplo por una reseña real y cambia isExample a false.
// Las reseñas se editan aquí manualmente; no se sincronizan con Google.
// Puedes agregar más objetos a reviews o dejar [] para mostrar el estado vacío.
export const branchReviews: Record<string, BranchReviews> = {
  "aviacion-civil": {
    writeUrl: "",
    readUrl: "",
    reviews: [{
      author: "Nombre del cliente",
      text: "Aquí aparecerá la reseña de un cliente de la sucursal Aviación Civil.",
      rating: null,
      date: "",
      isExample: true,
    }],
  },
  "ex-glorieta": {
    writeUrl: "",
    readUrl: "",
    reviews: [{
      author: "Nombre del cliente",
      text: "Aquí aparecerá la reseña de un cliente de la sucursal Ex-Glorieta.",
      rating: null,
      date: "",
      isExample: true,
    }],
  },
  "tecoluco": {
    writeUrl: "",
    readUrl: "",
    reviews: [{
      author: "Nombre del cliente",
      text: "Aquí aparecerá la reseña de un cliente de la sucursal Tecoluco.",
      rating: null,
      date: "",
      isExample: true,
    }],
  },
};
