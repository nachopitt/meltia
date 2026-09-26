import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260926144451 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "box_theme" drop constraint if exists "box_theme_slug_unique";`);
    this.addSql(`alter table if exists "body_catalog" drop constraint if exists "body_catalog_code_unique";`);
    this.addSql(`create table if not exists "body_catalog" ("id" text not null, "category" text not null, "code" text not null, "name" text not null, "outfit_description" text null, "preview_image_url" text null, "mesh_stl_url" text null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "body_catalog_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_body_catalog_code_unique" ON "body_catalog" ("code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_body_catalog_deleted_at" ON "body_catalog" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "box_theme" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "dieline_svg_url" text null, "card_template_url" text null, "preview_image_url" text null, "dimensions" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "box_theme_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_box_theme_slug_unique" ON "box_theme" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_box_theme_deleted_at" ON "box_theme" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "custom_order_spec" ("id" text not null, "line_item_id" text not null, "box_theme_id" text null, "collection_title" text not null, "dedication_headline" text null, "dedication_body" text null, "ai_illustration_url" text null, "print_dieline_pdf_url" text null, "print_cards_pdf_url" text null, "back_panel_mode" text not null default 'roster_grid', "status" text not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_order_spec_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_order_spec_deleted_at" ON "custom_order_spec" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "custom_figure" ("id" text not null, "character_name" text null, "is_primary" boolean not null default false, "body_catalog_id" text null, "original_photo_url" text null, "cropped_face_url" text null, "skin_filament" text null, "hair_filament" text null, "clothing_filament" text null, "accessories" jsonb null, "order_spec_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_figure_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_figure_order_spec_id" ON "custom_figure" ("order_spec_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_custom_figure_deleted_at" ON "custom_figure" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "custom_figure" add constraint "custom_figure_order_spec_id_foreign" foreign key ("order_spec_id") references "custom_order_spec" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "custom_figure" drop constraint if exists "custom_figure_order_spec_id_foreign";`);

    this.addSql(`drop table if exists "body_catalog" cascade;`);

    this.addSql(`drop table if exists "box_theme" cascade;`);

    this.addSql(`drop table if exists "custom_order_spec" cascade;`);

    this.addSql(`drop table if exists "custom_figure" cascade;`);
  }

}
