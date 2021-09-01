// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {PokemonForm} from '../pokemon'

import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  React.useEffect(() => {
    if (pokemonName.trim() === '') {
      return
    }
    setState({...state, status: 'pending'})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({...state, status: 'resolved', pokemon: pokemonData})
      },
      error => {
        setState({...state, status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if (state.status === 'idle') {
    return 'Submit a pokemon name '
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'rejected') {
    throw state.error
  }

  throw new Error('this should be imposible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} resetKeys={[pokemonName]} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
