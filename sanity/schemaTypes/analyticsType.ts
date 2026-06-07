import { defineField, defineType } from 'sanity'

export const pageViewType = defineType({
  name: 'pageView',
  title: 'Page View',
  type: 'document',
  fields: [
    defineField({ name: 'path', title: 'Path', type: 'string' }),
    defineField({ name: 'blogSlug', title: 'Blog Slug', type: 'string' }),
    defineField({ name: 'viewedAt', title: 'Viewed At', type: 'datetime' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'device', title: 'Device', type: 'string' }),
    defineField({ name: 'referrer', title: 'Referrer', type: 'string' }),
    defineField({ name: 'sessionId', title: 'Session ID', type: 'string' }),
  ],
  preview: {
    select: { title: 'path', subtitle: 'viewedAt' },
  },
})

export const blogReactionType = defineType({
  name: 'blogReaction',
  title: 'Blog Reaction',
  type: 'document',
  fields: [
    defineField({ name: 'blogSlug', title: 'Blog Slug', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'type',
      title: 'Reaction Type',
      type: 'string',
      options: {
        list: [
          { title: '❤️ Love', value: 'love' },
          { title: '🔥 Fire', value: 'fire' },
          { title: '💡 Insightful', value: 'insightful' },
          { title: '🎉 Celebrate', value: 'celebrate' },
          { title: '🤔 Thinking', value: 'thinking' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({ name: 'sessionId', title: 'Session ID', type: 'string' }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'blogSlug', subtitle: 'type' },
  },
})

export const blogCommentType = defineType({
  name: 'blogComment',
  title: 'Blog Comment',
  type: 'document',
  fields: [
    defineField({ name: 'blogSlug', title: 'Blog Slug', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'content', title: 'Content', type: 'text', validation: Rule => Rule.required() }),
    defineField({ name: 'approved', title: 'Approved', type: 'boolean', initialValue: false }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'blogSlug' },
  },
})
