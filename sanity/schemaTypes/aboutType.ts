import {defineField, defineType} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'About Me',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'blockContent',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
    }),
    defineField({
      name: 'experiences',
      title: 'Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Job Title'},
            {name: 'company', type: 'string', title: 'Company'},
            {name: 'startDate', type: 'date', title: 'Start Date'},
            {name: 'endDate', type: 'date', title: 'End Date'},
            {name: 'current', type: 'boolean', title: 'Current Position', initialValue: false},
            {name: 'description', type: 'text', title: 'Description'},
            {name: 'skills', type: 'array', of: [{type: 'string'}], title: 'Skills Used'},
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'company',
            },
          },
        }
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'degree', type: 'string', title: 'Degree'},
            {name: 'institution', type: 'string', title: 'Institution'},
            {name: 'startDate', type: 'date', title: 'Start Date'},
            {name: 'endDate', type: 'date', title: 'End Date'},
            {name: 'current', type: 'boolean', title: 'Currently Studying', initialValue: false},
            {name: 'description', type: 'text', title: 'Description'},
          ],
          preview: {
            select: {
              title: 'degree',
              subtitle: 'institution',
            },
          },
        }
      ],
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Interest'},
            {name: 'icon', type: 'string', title: 'Icon', description: 'Lucide icon name'},
          ],
          preview: {
            select: {
              title: 'name',
            },
          },
        }
      ],
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'profileImage',
    },
  },
})
