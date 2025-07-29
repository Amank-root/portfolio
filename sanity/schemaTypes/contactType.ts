import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Get In Touch',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      initialValue:
        'Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form below or via my contact information.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform' },
            { name: 'url', type: 'url', title: 'URL' },
            { name: 'icon', type: 'string', title: 'Icon', description: 'Lucide icon name' },
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'formspreeEndpoint',
      title: 'Formspree Endpoint',
      type: 'string',
      description: 'Your Formspree form endpoint ID',
    }),
    defineField({
      name: 'recaptchaSiteKey',
      title: 'reCAPTCHA Site Key',
      type: 'string',
      description: 'Your Google reCAPTCHA site key',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'email',
    },
  },
})
