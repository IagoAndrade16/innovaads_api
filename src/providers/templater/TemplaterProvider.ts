import { JsObject } from "../../@types/JsObject";

export type TemplaterProvider = {
  render(template: string, data: JsObject): Promise<string>;
}


export const templaterProviderAlias = 'TemplaterProvider' as const;