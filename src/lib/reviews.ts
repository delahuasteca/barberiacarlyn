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

export const studioReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJ6cunWscn14UR8NYun6GJNJ4";

// Los enlaces vacíos usan el enlace oficial de Maps definido en branches.ts.
// writeUrl permite añadir un enlace directo al formulario de evaluación.
// Sustituye cada ejemplo por una reseña real y cambia isExample a false.
// Las reseñas se editan aquí manualmente; no se sincronizan con Google.
// Puedes agregar más objetos a reviews o dejar [] para mostrar el estado vacío.
export const branchReviews: Record<string, BranchReviews> = {
  "aviacion-civil": {
    writeUrl: "https://search.google.com/local/writereview?placeid=ChIJ_XbO2Y0n14URZ-NIOMfVCdE",
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
    writeUrl: "https://search.google.com/local/writereview?placeid=ChIJwTB3Qzwn14URBE3l6rQGcUQ",
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
    writeUrl: "https://search.google.com/local/writereview?placeid=ChIJJfJcvNQn14URd_9HlYtvWtE",
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
