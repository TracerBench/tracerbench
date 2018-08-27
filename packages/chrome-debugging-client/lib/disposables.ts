import { IDisposable } from "./types";

export default class Disposables implements IDisposable {
  private disposables: IDisposable[] = [];

  public add<T extends IDisposable>(disposable: T): T {
    this.disposables.push(disposable);
    return disposable;
  }

  public async dispose(): Promise<void> {
    const { disposables } = this;
    let disposable: IDisposable | undefined;
    while ((disposable = disposables.pop()) !== undefined) {
      try {
        await disposable.dispose();
      } catch (err) {
        // intentionally ignored because dispose meant to be called from finally
        // don't want to overwrite the error

        // tslint:disable-next-line:no-console
        console.error(err);
      }
    }
  }
}
