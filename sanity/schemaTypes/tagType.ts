import { defineField, defineType } from 'sanity'

export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Red', value: 'red' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Purple', value: 'purple' },
          { title: 'Pink', value: 'pink' },
          { title: 'Indigo', value: 'indigo' },
          { title: 'Gray', value: 'gray' },
        ],
      },
      initialValue: 'blue',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Programming Language', value: 'language' },
          { title: 'Framework', value: 'framework' },
          { title: 'Library', value: 'library' },
          { title: 'Tool', value: 'tool' },
          { title: 'Database', value: 'database' },
          { title: 'Platform', value: 'platform' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'other',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
})
