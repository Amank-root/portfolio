import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description shown in blog listing. Used for SEO meta description.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated read time in minutes',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Rich Text (Portable Text)', value: 'portableText' },
          { title: 'Markdown', value: 'markdown' },
        ],
        layout: 'radio',
      },
      initialValue: 'markdown',
    }),
    defineField({
      name: 'body',
      title: 'Rich Text Body',
      type: 'blockContent',
      hidden: ({ document }) => document?.contentType !== 'portableText',
    }),
    defineField({
      name: 'markdownBody',
      title: 'Markdown Body',
      type: 'text',
      rows: 30,
      description: 'Supports full Markdown including Mermaid diagrams (```mermaid) and tables',
      hidden: ({ document }) => document?.contentType !== 'markdown',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Defaults to post title if empty',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Defaults to excerpt if empty',
        },
        {
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          description: 'Defaults to cover image if empty',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { author, publishedAt } = selection
      return {
        ...selection,
        subtitle: `${author ? `by ${author}` : 'No author'} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'}`,
      }
    },
  },
})
