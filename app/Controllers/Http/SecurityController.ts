import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SecurityController {
  async login({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  async authenticate({
    request,
    auth,
    response,
    session,
  }: HttpContextContract) {
    const { email, password } = request.all();

    try {
      await auth.use("web").attempt(email, password);
      response.redirect().toRoute("home");
    } catch {
      session.flash({ error: "Identifiants incorrects" });
      response.redirect().toRoute("login");
    }
  }
}
