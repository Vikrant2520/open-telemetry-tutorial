import { trace , Span} from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';


const tracer = trace.getTracer('dice-lib');

function rollOnce(i: number, min: number, max: number) {
  return tracer.startActiveSpan(`rollOnce:${i}`, (span: Span) => {
    const result = Math.floor(Math.random() * (max - min) + min);
    span.end();
    return result;
  });
}

export function rollTheDice(rolls: number, min: number, max: number) {
  // Create a span. A span must be closed.
  return tracer.startActiveSpan('rollTheDice', (parentSpan: Span) => {
    const result: number[] = [];
    for (let i = 0; i < rolls; i++) {
      result.push(rollOnce(i, min, max));
    }
    // Be sure to end the span!
    parentSpan.setAttribute(SemanticAttributes.CODE_FUNCTION,'rollTheDice')
    parentSpan.setAttribute(SemanticAttributes.CODE_FILEPATH,__filename)
    parentSpan.end();
    return result;
  });
}