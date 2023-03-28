import { Neat as _Neat, methods, architect } from 'neataptic'

let Neat = _Neat
let Methods = methods
let Architect = architect

let neat, network

let MUTATION_RATE = 0.3
let ELITISM_RATE = 0.1

let USE_TRAINED_POP = false // use already trained population

let isPersonPlaying = false
let isAIPlaying = false
let games

export function initNeat(isResetting) {
    if (isResetting) {
        let oldPop = neat.population
    }
    // hidden layer nodes rule of thumb: inputs + ouptputs = 5 + 1 = 6
    neat = new Neat(
        5, 1, null, 
        {
            mutation: [
                Methods.mutation.ADD_NODE,
                Methods.mutation.SUB_NODE,
                Methods.mutation.ADD_NODE,
                Methods.mutation.SUB_NODE,
                Methods.mutation.MOD_WEIGHT,
                Methods.mutation.MOD_BIAS,
                Methods.mutation.ADD_GATE,
                Methods.mutation.SUB_GATE,
                Methods.mutation.ADD_SELF_CONN,
                Methods.mutation.SUB_SELF_CONN,
                Methods.mutation.ADD_BACK_CONN,
                Methods.mutation.SUB_BACK_CONN,
            ],
            popsize: populationSize,
            mutationRate: MUTATION_RATE,
            elitism: Math.round(ELITISM_RATE * populationSize),
            network: network
        }
    )
    neat.generation = 1
    if (isResetting) {
        // copy previous population into new population
        let smallerSize = populationSize < oldPop.length ? populationSize : oldPop.length
        for (let i = 0; i < smallerSize; i++) {
            neat.population[i] = oldPop[i]
        }
    }
    // } else if (USE_TRAINED_POP) {
    //     getPopulationFromFiles()
    // }
}

// function getPopulationFromFile(newPopArray) {
//     // Convert the json to an array of networks
//     var popArray = newPopArray || trainedPop;
//     var newPop = [];
//     for (var i = 0; i < populationSize; i++) {
//       var json = popArray.data[i % popArray.data.length]; // use modulo to loop back to beginning of array in case population size is too big
//       newPop[i] = neataptic.Network.fromJSON(json);
//     }
//     neat.population = newPop;
//     neat.generation = popArray.gen;
//   }

export function startEvaluation() {
    games = []
    for (let genome in neat.population) {
        genome = neat.population[genome]
        games.push(new Gamepad(genome))
    }
    remainingAlive = game.length
    baseFrame = frameCount
}

export function endEvaluation() {
    if (isPersonPlaying || isAIPlaying) {
      isPersonPlaying = false;
      isAIPlaying = false;
      endEvalButton.html('Next Generation');
      startEvaluation();
    } else {
      neat.sort();
      var newGames = [];
  
      for (var i = 0; i < neat.elitism; i++) {
        newGames.push(neat.population[i]);
      }
  
      for (var i = 0; i < neat.popsize - neat.elitism; i++) {
        newGames.push(neat.getOffspring());
      }
  
      neat.population = newGames;
      neat.mutate();
  
      neat.generation++;
      startEvaluation();
    }
  }
