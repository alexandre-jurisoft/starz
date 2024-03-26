import { type createResource } from './game';

export type Tech = {
	name: string;
	cost: number;
	tier: number;
	description: string;
	effect: () => void;
};

export type PopulationEffect = {
	onActivate: () => void;
	onDeactivate: () => void;
};

// Does nothing at the moment
export type Trait = {
	name: string;
	description: string;
	portrait: string;
	id: number;
};

export type Person = {
	name: string;
	age: number;
	population_id: number;
	// dies when reaches 0
	food_meter: number;
	// dies when reaches 0
	clean_water_meter: number;
	portrait: string;
	profession_id: number;
	traits: Trait[];
};

export type Population = {
	name: string;
	id: number;
	description: string;
	happiness: ReturnType<typeof createResource>;
	quantity: ReturnType<typeof createResource>;
	effects: {
		[quantity: number]: {
			actions: PopulationEffect;
			description: string;
		};
	};
};
export type Food = {
	value: ReturnType<typeof createResource>;
	description: string;
	depletion_rate: number;
};

export type Resource = {
	[state: string]: ReturnType<typeof createResource> | Food;
};

export type SimpleResources = 'energy';
export type ComplexResources = 'electronic_components' | 'water' | 'food';

export interface ComplexResource<ResourceType = Resource> {
	[key: ComplexResources | string]: any | ResourceType;
}

export type ElectronicComponentsResource = {
	scrap: ReturnType<typeof createResource>;
	common: ReturnType<typeof createResource>;
	rare: ReturnType<typeof createResource>;
	legendary: ReturnType<typeof createResource>;
};

export type WaterResource = {
	dirty: ReturnType<typeof createResource>;
	clean: ReturnType<typeof createResource>;
};

export interface FoodResource extends ComplexResource<Food> {
	stock: {
		types: string[];
		quantity: {
			[key: string]: number;
		};
		expires_at: number;
	}[];
}

export type GameState = {
	playing: boolean;
	onTurnEnd: (() => void)[];
	onTurnStart: (() => void)[];
	population: Population[];
	resources: {
		energy: ReturnType<typeof createResource>;
		electronic_components: ElectronicComponentsResource;
		water: WaterResource;
		food: FoodResource;
	};
	tech: {
		engineering_rate: ReturnType<typeof createResource>;
		engineering: Tech[];
		survival_rate: ReturnType<typeof createResource>;
		survival: Tech[];
		science_rate: ReturnType<typeof createResource>;
		science: Tech[];
	};
};
