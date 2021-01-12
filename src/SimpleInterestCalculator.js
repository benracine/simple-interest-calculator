import xs from 'xstream';
import {h, div} from '@cycle/dom';
import LabeledSlider from './LabeledSlider';

const intent = (sources) => {
  const initProps$ = xs.of({
    label: 'Initial value',
    unit: 'thousand dollars', 
    min: 0,
    initial: 20,
    max: 100
  });
  const intProps$ = xs.of({
    label: 'Annual interest rate', unit: '%', min: -5, initial: 5, max: 10
  });
  const yearsProps$ = xs.of({
    label: 'Years', unit: 'years', min: 0, initial: 10, max: 30
  });
  const initSlider = LabeledSlider({DOM: sources.DOM, props$: initProps$});
  const intSlider = LabeledSlider({DOM: sources.DOM, props$: intProps$});
  const yearsSlider = LabeledSlider({DOM: sources.DOM, props$: yearsProps$});
  return { initSlider, intSlider, yearsSlider };
};

const model = (
  initialSliderValue$,
  interestSliderValue$,
  yearsSliderValue$
) => {
  return xs.combine(
      initialSliderValue$,
      interestSliderValue$,
      yearsSliderValue$,
    ).map(([initial, interest, years]) => {
      const future = initial * Math.pow(1 + (interest / 100), years);
      return future.toFixed(2);
    });
};

const view = ( fv$, initialSliderDOM, interestSliderDOM, yearsSliderDom) => {
  return xs.combine(fv$, initialSliderDOM, interestSliderDOM, yearsSliderDom)
    .map(([fv, initialVTree, interestVTree, yearsVTree]) =>
      div([
        initialVTree,
        interestVTree,
        yearsVTree,
        h(
          'h2',
          {style: {'padding-top': '20px'}},
          [`Future value is ${fv} thousand dollars.`]
        )
      ])
    );
};

const SimpleInterestCalculator = (sources) => {
  const { initSlider, intSlider, yearsSlider } = intent(sources);
  const fv$ = model(initSlider.value, intSlider.value, yearsSlider.value);
  const vdom$ = view(fv$, initSlider.DOM, intSlider.DOM, yearsSlider.DOM);
  return {
    DOM: vdom$
  };
};

export default SimpleInterestCalculator;
