import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = S =>
  S.list()
    .title('Portfolio CMS')
    .items([
      S.listItem()
        .title('📁 Portfolio Content')
        .child(
          S.list()
            .title('Portfolio Content')
            .items([
              S.documentTypeListItem('project').title('Projects'),
              S.documentTypeListItem('skill').title('Skills'),
              S.documentTypeListItem('about').title('About'),
              S.documentTypeListItem('contact').title('Contact'),
              S.divider(),
              S.documentTypeListItem('tag').title('Tags'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('✍️ Blog Content')
        .child(
          S.list()
            .title('Blog Content')
            .items([
              S.documentTypeListItem('post').title('Blog Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('📊 Analytics & Engagement')
        .child(
          S.list()
            .title('Analytics')
            .items([
              S.documentTypeListItem('pageView').title('Page Views'),
              S.documentTypeListItem('blogReaction').title('Reactions'),
              S.documentTypeListItem('blogComment').title('Comments'),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        item =>
          item.getId() &&
          !['post', 'category', 'author', 'project', 'skill', 'about', 'contact', 'tag', 'pageView', 'blogReaction', 'blogComment'].includes(item.getId()!)
      ),
    ])
