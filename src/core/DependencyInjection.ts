import { container, InjectionToken } from "tsyringe";



export class DependencyInjection {
  static init(): void {
    
  }
}

export function find<T>(token: InjectionToken<T>): T {
	return container.resolve(token);
}