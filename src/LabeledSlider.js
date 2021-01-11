import xs from 'xstream';
import {div, span, input} from '@cycle/dom';
import isolate from '@cycle/isolate';

const intent = (domSource) => {
  return domSource.select('.slider').events('input').map(ev => ev.target.value);
};

const model = (newValue$, props$) => {
  const initialValue$ = props$.map((props) => props.initial).take(1);
  return xs.merge(initialValue$, newValue$).remember();
};

const view = (props$, value$) => {
  return xs.combine(props$, value$).map(([props, value]) =>
    div('.labeled-slider', [
      span('.label', `${props.label}:`),
      input('.slider', {
        attrs: {type: 'range', min: props.min, max: props.max, value}
      }),
      span('.units', `${value} ${props.unit}`)
    ])
  );
};

const LabeledSlider = (sources) => {
  const change$ = intent(sources.DOM);
  const value$ = model(change$, sources.props$);
  const vdom$ = view(sources.props$, value$);
  return {
    DOM: vdom$,
    value: value$
  };
};

const IsolatedLabeledSlider = (sources) => {
  return isolate(LabeledSlider)(sources);
};

export default IsolatedLabeledSlider;
