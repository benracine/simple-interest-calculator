import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import SimpleInterestCalculator from './SimpleInterestCalculator';

const main = SimpleInterestCalculator;

run(main, {
  DOM: makeDOMDriver('#main-container')
});
