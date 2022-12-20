import type { ApplicationContract } from "@ioc:Adonis/Core/Application";
import { Ioc } from "@adonisjs/fold";
import { ContactServices } from "App/Services/ContactServices";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton("ContactServices", (ioc: Ioc) => {
      return new ContactServices(
        "contact@devoweb.fr",
        ioc.resolveBinding("Adonis/Addons/Mail"),
        ioc.resolveBinding("Adonis/Core/Validator")
      );
    });
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
