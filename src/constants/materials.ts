export type Material = {
  id: number;
  name: string;
};

export const MATERIAL_GROUPS = [
  "Blood",
  "Bone",
  "Claw",
  "Fang",
  "Scale",
  "Totem",
  "Venom",
  "Dust",
];
type MaterialGroup = (typeof MATERIAL_GROUPS)[number];

export const MATERIAL_TIERS = ["T1", "T2", "T3", "T4", "T5", "T6"];
type MaterialTier = (typeof MATERIAL_TIERS)[number];

export const Material: Record<MaterialGroup, Record<MaterialTier, Material>> = {
  Blood: {
    T1: { id: 24290, name: "Vial of Weak Blood" },
    T2: { id: 24291, name: "Vial of Thin Blood" },
    T3: { id: 24292, name: "Vial of Blood" },
    T4: { id: 24293, name: "Vial of Thick Blood" },
    T5: { id: 24294, name: "Vial of Potent Blood" },
    T6: { id: 24295, name: "Vial of Powerful Blood" },
  },
  Bone: {
    T1: { id: 24342, name: "Bone Chip" },
    T2: { id: 24343, name: "Bone Shard" },
    T3: { id: 24344, name: "Bone" },
    T4: { id: 24345, name: "Heavy Bone" },
    T5: { id: 24341, name: "Large Bone" },
    T6: { id: 24358, name: "Ancient Bone" },
  },
  Claw: {
    T1: { id: 24346, name: "Tiny Claw" },
    T2: { id: 24347, name: "Small Claw" },
    T3: { id: 24348, name: "Claw" },
    T4: { id: 24349, name: "Sharp Claw" },
    T5: { id: 24350, name: "Large Claw" },
    T6: { id: 24351, name: "Vicious Claw" },
  },
  Fang: {
    T1: { id: 24352, name: "Tiny Fang" },
    T2: { id: 24353, name: "Small Fang" },
    T3: { id: 24354, name: "Fang" },
    T4: { id: 24355, name: "Sharp Fang" },
    T5: { id: 24356, name: "Large Fang" },
    T6: { id: 24357, name: "Vicious Fang" },
  },
  Scale: {
    T1: { id: 24284, name: "Tiny Scale" },
    T2: { id: 24285, name: "Small Scale" },
    T3: { id: 24286, name: "Scale" },
    T4: { id: 24287, name: "Smooth Scale" },
    T5: { id: 24288, name: "Large Scale" },
    T6: { id: 24289, name: "Armored Scale" },
  },
  Totem: {
    T1: { id: 24296, name: "Tiny Totem" },
    T2: { id: 24297, name: "Small Totem" },
    T3: { id: 24298, name: "Totem" },
    T4: { id: 24363, name: "Engraved Totem" },
    T5: { id: 24299, name: "Intricate Totem" },
    T6: { id: 24300, name: "Elaborate Totem" },
  },
  Venom: {
    T1: { id: 24278, name: "Tiny Venom Sac" },
    T2: { id: 24279, name: "Small Venom Sac" },
    T3: { id: 24280, name: "Venom Sac" },
    T4: { id: 24281, name: "Full Venom Sac" },
    T5: { id: 24282, name: "Potent Venom Sac" },
    T6: { id: 24283, name: "Powerful Venom Sac" },
  },
  Dust: {
    T1: { id: 24272, name: "Pile of Glittering Dust" },
    T2: { id: 24273, name: "Pile of Shimmering Dust" },
    T3: { id: 24274, name: "Pile of Radiant Dust" },
    T4: { id: 24275, name: "Pile of Luminous Dust" },
    T5: { id: 24276, name: "Pile of Incandescent Dust" },
    T6: { id: 24277, name: "Pile of Crystalline Dust" },
  },
};

export const PhilosopherStone: Material = {
  id: 20796,
  name: "Philosopher's Stone",
};
