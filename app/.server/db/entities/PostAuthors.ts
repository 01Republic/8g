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

@Index("IDX_c8fe6246961bc8b0c06eea02fd", ["name"], {})
@Entity("post_authors")
export class PostAuthors extends BaseEntity {
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

  @Column("text", { name: "profileImg" })
  profileImg: string;

  @Column("text", { name: "introduce" })
  introduce: string;

  @ManyToMany(() => Posts, (posts) => posts.postAuthors)
  @JoinTable({
    name: "posts_authors_post_authors",
    joinColumns: [{ name: "postAuthorsId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "postsId", referencedColumnName: "id" }],
    schema: "payplo_staging",
  })
  posts: Posts[];
}
