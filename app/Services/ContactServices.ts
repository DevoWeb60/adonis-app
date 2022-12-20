export class ContactServices {
  constructor(
    private to: string,
    private Mailer: any,
    private Validation: any
  ) {}

  async send(params: Record<string, any>) {
    const { validator, schema, rules } = this.Validation;
    const payload = await validator.validate({
      schema: schema.create({
        name: schema.string({ trim: true }),
        email: schema.string({ trim: true }, [rules.email()]),
        message: schema.string({ trim: true }),
      }),
      data: params,
    });
    await this.Mailer.send((message) => {
      message
        .from(payload.email)
        .to(this.to)
        .subject("Contact")
        .htmlView("emails/contact", payload);
    });
  }
}

// SANS PROVIDERS (voir ContactController.ts et AppProvider.ts)

// import { rules, schema, validator } from "@ioc:Adonis/Core/Validator";
// import Mail from "@ioc:Adonis/Addons/Mail";

// export class ContactServices {
//   static async send(params: Record<string, any>) {
//     const payload = await validator.validate({
//       schema: schema.create({
//         name: schema.string({ trim: true }),
//         email: schema.string({ trim: true }, [rules.email()]),
//         message: schema.string({ trim: true }),
//       }),
//       data: params,
//     });
//     await Mail.send((message) => {
//       message
//         .from(payload.email)
//         .to("truc@machin.fr")
//         .subject("Contact")
//         .htmlView("emails/contact", payload);
//     });
//   }
// }
