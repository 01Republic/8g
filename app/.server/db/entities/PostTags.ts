import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";

@Index("IDX_822f68100a07acabf344a77d19", ["name"], {})
@Entity("post_tags")
export class PostTags extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ManyToMany(() => Posts, (posts) => posts.postTags)
  @JoinTable({
    name: "posts_tags_post_tags",
    joinColumns: [{ name: "postTagsId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "postsId", referencedColumnName: "id" }],
    schema: "payplo_staging",
  })
  posts: Posts[];
}
