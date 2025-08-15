export type MaterialRecipe = {
  id: number;
  name: string;
  ingredients: Array<MaterialAmount>;
  output: MaterialAmount;
};

type MaterialAmount = {
  materialId: number;
  quantity: number;
};

export const FangRecipe: MaterialRecipe = {
  id: 404,
  name: "Fang T2 to T3",
  ingredients: [
    { materialId: 24353, quantity: 50 },
    { materialId: 24354, quantity: 1 },
    { materialId: 20796, quantity: 2 },
    { materialId: 24274, quantity: 5 },
  ],
  output: { materialId: 24354, quantity: 18.51 },
};
