import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Posts } from "./Posts";

@Index("IDX_a734b6ac8fcfcd3c45f7639020", ["postAuthorsId"], {})
@Index("IDX_ea9fd5dde2899a535c83e359e6", ["postsId"], {})
@Entity("posts_authors_post_authors")
export class PostsAuthorsPostAuthors extends BaseEntity {
  @Column("int", { primary: true, name: "postsId" })
  postsId: number;

  @Column("int", { primary: true, name: "postAuthorsId" })
  postAuthorsId: number;

  @ManyToOne(() => Posts, (posts) => posts.postsAuthorsPostAuthors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsId", referencedColumnName: "id" }])
  posts: Posts;
}
