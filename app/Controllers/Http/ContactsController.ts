import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ContactServices from "@ioc:ContactServices";

// SANS PROVIDERS (Voir ContactServices.ts et AppProvider.ts)

// import { ContactServices } from "App/Services/ContactServices";
// import { inject } from "@adonisjs/fold";

// @inject()
export default class ContactsController {
  // constructor(private contactServices: ContactServices) {}

  async contact({ view }: HttpContextContract) {
    return view.render("contact");
  }

  async store({ request, session, response }: HttpContextContract) {
    // this.contactServices.send(request.all() as any);
    ContactServices.send(request.all() as any);
    session.flash("success", "Votre message a bien été envoyé.");
    return response.redirect().back();
  }
}
