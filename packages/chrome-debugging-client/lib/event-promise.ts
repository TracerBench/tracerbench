import { IEventNotifier } from "./types";

export function eventPromise<T>(
  emitter: IEventNotifier,
  resolveEvent: string,
  rejectEvent: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const resolveHandler = (evt: T) => {
      resolve(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    const rejectHandler = (evt: any) => {
      reject(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    emitter.on(resolveEvent, resolveHandler);
    emitter.on(rejectEvent, rejectHandler);
  });
}
