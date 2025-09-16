import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostLikes } from "./PostLikes";
import { PostUnlikes } from "./PostUnlikes";
import { PostVisits } from "./PostVisits";
import { Products } from "./Products";
import { PostsAuthorsPostAuthors } from "./PostsAuthorsPostAuthors";
import { PostsTagsPostTags } from "./PostsTagsPostTags";

@Entity("posts")
export class Posts {
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

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "thumbnailUrl", nullable: true })
  thumbnailUrl: string | null;

  @Column("varchar", { name: "seoTitle", length: 255 })
  seoTitle: string;

  @Column("text", { name: "seoDescription" })
  seoDescription: string;

  @Column("text", { name: "seoKeywords", nullable: true })
  seoKeywords: string | null;

  @Column("datetime", { name: "publishAt", nullable: true })
  publishAt: Date | null;

  @Column("int", { name: "visitCount", default: () => "'0'" })
  visitCount: number;

  @Column("int", { name: "likeCount", default: () => "'0'" })
  likeCount: number;

  @Column("int", { name: "unlikeCount", default: () => "'0'" })
  unlikeCount: number;

  @Column("text", { name: "notion_page_url", nullable: true })
  notionPageUrl: string | null;

  @OneToMany(() => PostLikes, (postLikes) => postLikes.post)
  postLikes: PostLikes[];

  @OneToMany(() => PostUnlikes, (postUnlikes) => postUnlikes.post)
  postUnlikes: PostUnlikes[];

  @OneToMany(() => PostVisits, (postVisits) => postVisits.post)
  postVisits: PostVisits[];

  @ManyToOne(() => Products, (products) => products.posts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @OneToMany(
    () => PostsAuthorsPostAuthors,
    (postsAuthorsPostAuthors) => postsAuthorsPostAuthors.posts
  )
  postsAuthorsPostAuthors: PostsAuthorsPostAuthors[];

  @OneToMany(
    () => PostsTagsPostTags,
    (postsTagsPostTags) => postsTagsPostTags.posts
  )
  postsTagsPostTags: PostsTagsPostTags[];
}
