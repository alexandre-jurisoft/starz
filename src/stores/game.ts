import { writable, get } from 'svelte/store';
import type { GameState } from './game.d';

export const createResource = (total: number = 0, growth: number = 0) => {
	const { subscribe, set, update } = writable({
		total,
		growth
	});
	return {
		subscribe,
		set,
		update,
		incrementPerTurn: (value: number) => {
			update((n) => {
				n.growth += value;
				return n;
			});
		},
		incrementTotal: (value: number) => {
			update((n) => {
				n.total += value;
				return n;
			});
		},
		getTotal: () => get({ subscribe }).total,
		setTotal: (value: number) => {
			update((n) => {
				n.total = value;
				return n;
			});
		}
	};
};

const gameState: GameState = {
	playing: false,
	onTurnEnd: [],
	onTurnStart: [],
	population: [
		{
			name: 'Sobreviventes Originais',
			id: 1,
			description: 'Os sobreviventes originais, bem preparados e com foco em recriar a sociedade',
			happiness: createResource(100),
			quantity: createResource(10),
			effects: {
				20: {
					description: 'Os sobreviventes estão felizes com o crescimento da comunidade',
					actions: {
						onActivate() {
							gameState.population.find((p) => p.id === 1)?.happiness.incrementTotal(10);
						},
						onDeactivate() {
							gameState.population.find((p) => p.id === 1)?.happiness.incrementTotal(-10);
						}
					}
				},
				40: {
					description:
						'Os sobreviventes estão com esperança, aumentando suas pesquisas de ciência em 40%',
					actions: {
						onActivate() {
							gameState.tech.science_rate.incrementTotal(0.4);
						},
						onDeactivate() {
							gameState.tech.science_rate.incrementTotal(-0.4);
						}
					}
				}
			}
		}
	],
	resources: {
		energy: createResource(0),
		electronic_components: {
			scrap: createResource(10),
			common: createResource(10),
			rare: createResource(0),
			legendary: createResource(0)
		},
		water: {
			dirty: createResource(70),
			clean: createResource(0)
		},
		food: {
			fruit_vegetables: {
				value: createResource(10),
				description:
					'Frutas e vegetais, os sobreviventes precisam de frutas e vegetais para sobreviver',
				depletion_rate: 0.3
			},
			dairy: {
				value: createResource(10),
				description: 'Laticínios, os sobreviventes precisam de laticínios para sobreviver',
				depletion_rate: 0.1
			},
			protein: {
				value: createResource(10),
				description: 'Proteína, os sobreviventes precisam de proteína para sobreviver',
				depletion_rate: 0.5
			},
			fat: {
				value: createResource(10),
				description: 'Gordura, os sobreviventes precisam de gordura para sobreviver',
				depletion_rate: 0.4
			},
			stock: [
				{
					types: ['fat', 'protein'],
					quantity: {
						fat: 10,
						protein: 20
					},
					expires_at: new Date().setFullYear(2025)
				}
			]
		}
	},
	tech: {
		engineering_rate: createResource(1),
		engineering: [
			{
				name: 'Filtração de água básica',
				cost: 8,
				tier: 1,
				description: 'Limpa 1 unidade de água por turno',
				effect() {
					gameState.resources.water.clean.incrementPerTurn(1);
					gameState.resources.water.dirty.incrementPerTurn(-1);
				}
			}
		],
		survival_rate: createResource(1),
		survival: [
			{
				name: 'Coleta de frutas e vegetais',
				cost: 10,
				tier: 1,
				description: 'Adiciona 1 unidade de frutas e vegetais por turno',
				effect() {
					gameState.resources.food.fruit_vegetables.value.incrementPerTurn(1);
				}
			},
			{
				name: 'Fogueira',
				cost: 2,
				tier: 1,
				description:
					'A possibilidade de fazer fogo para se esquentar e preparar comida aumenta a felicidade de todas as populações em 10, e libera o preparo de mais comidas',
				effect() {
					for (const population of gameState.population) {
						population.happiness.incrementTotal(10);
					}
				}
			}
		],
		science_rate: createResource(1),
		science: [
			{
				name: 'Reciclagem de componentes eletrônicos básica',
				cost: 15,
				tier: 1,
				description:
					'Adiciona 1 unidade de componentes eletrônicos comuns por turno, em troca de 2 unidades de sucata',
				effect() {
					gameState.resources.electronic_components.common.incrementPerTurn(1);
					gameState.resources.electronic_components.scrap.incrementTotal(-2);
				}
			}
		]
	}
};

function createGame() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		reset: () => set(0)
	};
}

export const game = createGame();
