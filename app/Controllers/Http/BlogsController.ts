import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Category from "App/Models/Category";
import Post from "App/Models/Post";
import UpdatePostValidator from "App/Validators/UpdatePostValidator";
import { string } from "@ioc:Adonis/Core/Helpers";
import Drive from "@ioc:Adonis/Core/Drive";

export default class BlogsController {
  async index({ view, request }: HttpContextContract) {
    // const posts = await Post.all();
    const page = request.input("page", 1);
    const posts = await Database.from(Post.table).paginate(page, 3);
    return view.render("blog/index", {
      posts,
    });
  }

  async create({ view }: HttpContextContract) {
    const post = new Post();
    const categories = await Category.all();
    return view.render("blog/create", {
      post,
      categories,
    });
  }

  async store({ params, request, session, response }: HttpContextContract) {
    await this.handleRequest(params, request);
    session.flash({ success: "L'article a bien été créé" });
    return response.redirect().toRoute("home");
  }

  async show({ view, params, bouncer }: HttpContextContract) {
    // const post = await Post.findOrFail(params.id);
    const post = await Post.query()
      .preload("category")
      .where("id", params.id)
      .firstOrFail();
    await bouncer.authorize("editPost", post);
    const categories = await Category.all();
    return view.render("blog/show", {
      post,
      categories,
    });
  }

  async update({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    await this.handleRequest(params, request, bouncer);
    session.flash({ success: "L'article a bien été mis à jour." });
    return response.redirect().toRoute("home");
  }

  async destroy({ params, response, session }: HttpContextContract) {
    const post = await Post.findOrFail(params.id);
    await post.delete();
    session.flash({ success: "L'article a bien été supprimé." });
    return response.redirect().toRoute("home");
  }

  private async handleRequest(
    params: HttpContextContract["params"],
    request: HttpContextContract["request"],
    bouncer?: HttpContextContract["bouncer"]
  ) {
    const post = params.id ? await Post.findOrFail(params.id) : new Post();

    if (post.id && bouncer) {
      await bouncer.authorize("editPost", post);
    }
    const data = await request.validate(UpdatePostValidator);
    const thumbnail = request.file("thumbnailFile");
    if (thumbnail) {
      if (post.thumbnail) {
        await Drive.delete(post.thumbnail);
      }
      const newName = string.generateRandom(32) + "." + thumbnail.extname;
      await thumbnail.moveToDisk("./", { name: newName });
      post.thumbnail = newName;
    }
    post
      .merge({
        title: data.title,
        categoryId: data.categoryId,
        content: data.content,
        online: data.online || false,
      })
      .save();
  }
}
