import {Map, fromJS, List} from 'immutable';
import {expect} from 'chai';

import {vote} from '../src/core'

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspotting', '28 Days Later']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    });
    const action = {type: 'VOTE', entry: 'Trainspotting'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1}
      },
      entries: []
    }));
  });

});

describe('reducer', () => {

  // ...

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting']
    }));
  });

});

it('can be used with reduce', () => {
  const actions = [
    {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
    {type: 'NEXT'},
    {type: 'VOTE', entry: 'Trainspotting'},
    {type: 'VOTE', entry: '28 Days Later'},
    {type: 'VOTE', entry: 'Trainspotting'},
    {type: 'NEXT'}
  ];
  const finalState = actions.reduce(reducer, Map());

  expect(finalState).to.equal(fromJS({
    winner: 'Trainspotting'
  }));
});

describe('vote', () => {

  it('creates a tally for the voted entry', () => {
    const state = Map({
      pair: List.of('Trainspotting', '28 Days Later')
    });
    const nextState = vote(state, 'Trainspotting')
    expect(nextState).to.equal(Map({
      pair: List.of('Trainspotting', '28 Days Later'),
      tally: Map({
        'Trainspotting': 1
      })
    }));
  });

  it('adds to existing tally for the voted entry', () => {
    const state = Map({
      pair: List.of('Trainspotting', '28 Days Later'),
      tally: Map({
        'Trainspotting': 3,
        '28 Days Later': 2
      })
    });
    const nextState = vote(state, 'Trainspotting');
    expect(nextState).to.equal(Map({
      pair: List.of('Trainspotting', '28 Days Later'),
      tally: Map({
        'Trainspotting': 4,
        '28 Days Later': 2
      })
    }));
  });

});

import makeStore from '../src/store';

describe('store', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({
      type: 'SET_ENTRIES',
      entries: ['Trainspotting', '28 Days Later']
    });
    expect(store.getState()).to.equal(fromJS({
      entries: ['Trainspotting', '28 Days Later']
    }));
  });

});
