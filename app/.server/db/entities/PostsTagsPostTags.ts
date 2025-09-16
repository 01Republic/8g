import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Posts } from "./Posts";

@Index("IDX_7ce1e6c75fa3b606868d9d6b48", ["postTagsId"], {})
@Index("IDX_ada056e232b1140ef5f327943d", ["postsId"], {})
@Entity("posts_tags_post_tags")
export class PostsTagsPostTags extends BaseEntity {
  @Column("int", { primary: true, name: "postsId" })
  postsId: number;

  @Column("int", { primary: true, name: "postTagsId" })
  postTagsId: number;

  @ManyToOne(() => Posts, (posts) => posts.postsTagsPostTags, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsId", referencedColumnName: "id" }])
  posts: Posts;
}
