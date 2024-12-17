import { JsObject } from "../../../@types/JsObject";
import { TemplaterProvider } from "../TemplaterProvider";
import Handlebars from "handlebars";


export class TemplaterHandlebarsImpl implements TemplaterProvider {
  async render(template: string, data: JsObject): Promise<string> {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(data);
  }
}