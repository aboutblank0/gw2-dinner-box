import { Material, MATERIAL_GROUPS, PhilosopherStone } from "./materials";

export type MaterialRecipe = {
  name: string;
  ingredients: Array<MaterialAmount>;
  output: MaterialAmount;
};

type MaterialAmount = {
  materialId: number;
  quantity: number;
};

export const T1toT2Recipes: MaterialRecipe[] = MATERIAL_GROUPS.filter(
  (matGroup) => matGroup !== "Dust"
).map((matGroup) => {
  const recipe: MaterialRecipe = {
    name: `${matGroup} T1 to T2`,
    ingredients: [
      { materialId: Material[matGroup]["T1"].id, quantity: 50 },
      { materialId: Material[matGroup]["T2"].id, quantity: 1 },
      { materialId: Material["Dust"]["T2"].id, quantity: 5 },
      { materialId: PhilosopherStone.id, quantity: 1 },
    ],
    output: {
      materialId: Material[matGroup]["T2"].id,
      quantity: 18.51,
    },
  };

  return recipe;
});

export const T2toT3Recipes: MaterialRecipe[] = MATERIAL_GROUPS.filter(
  (matGroup) => matGroup !== "Dust"
).map((matGroup) => {
  const recipe: MaterialRecipe = {
    name: `${matGroup} T2 to T3`,
    ingredients: [
      { materialId: Material[matGroup]["T2"].id, quantity: 50 },
      { materialId: Material[matGroup]["T3"].id, quantity: 1 },
      { materialId: Material["Dust"]["T3"].id, quantity: 5 },
      { materialId: PhilosopherStone.id, quantity: 2 },
    ],
    output: {
      materialId: Material[matGroup]["T3"].id,
      quantity: 18.51,
    },
  };

  return recipe;
});

export const T3toT4Recipes: MaterialRecipe[] = MATERIAL_GROUPS.filter(
  (matGroup) => matGroup !== "Dust"
).map((matGroup) => {
  const recipe: MaterialRecipe = {
    name: `${matGroup} T3 to T4`,
    ingredients: [
      { materialId: Material[matGroup]["T3"].id, quantity: 50 },
      { materialId: Material[matGroup]["T4"].id, quantity: 1 },
      { materialId: Material["Dust"]["T4"].id, quantity: 5 },
      { materialId: PhilosopherStone.id, quantity: 3 },
    ],
    output: {
      materialId: Material[matGroup]["T4"].id,
      quantity: 18.51,
    },
  };

  return recipe;
});

export const T4toT5Recipes: MaterialRecipe[] = MATERIAL_GROUPS.filter(
  (matGroup) => matGroup !== "Dust"
).map((matGroup) => {
  const recipe: MaterialRecipe = {
    name: `${matGroup} T4 to T5`,
    ingredients: [
      { materialId: Material[matGroup]["T4"].id, quantity: 50 },
      { materialId: Material[matGroup]["T5"].id, quantity: 1 },
      { materialId: Material["Dust"]["T5"].id, quantity: 5 },
      { materialId: PhilosopherStone.id, quantity: 4 },
    ],
    output: {
      materialId: Material[matGroup]["T5"].id,
      quantity: 18.51,
    },
  };

  return recipe;
});

export const T5toT6Recipes: MaterialRecipe[] = MATERIAL_GROUPS.filter(
  (matGroup) => matGroup !== "Dust"
).map((matGroup) => {
  const recipe: MaterialRecipe = {
    name: `${matGroup} T5 to T6`,
    ingredients: [
      { materialId: Material[matGroup]["T5"].id, quantity: 50 },
      { materialId: Material[matGroup]["T6"].id, quantity: 1 },
      { materialId: Material["Dust"]["T6"].id, quantity: 5 },
      { materialId: PhilosopherStone.id, quantity: 5 },
    ],
    output: {
      materialId: Material[matGroup]["T6"].id,
      quantity: 6.91,
    },
  };

  return recipe;
});

export const AllRecipes: MaterialRecipe[] = [
  ...T1toT2Recipes,
  ...T2toT3Recipes,
  ...T3toT4Recipes,
  ...T4toT5Recipes,
  ...T5toT6Recipes,
];
