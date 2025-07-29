import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title('Portfolio')
    .items([
      // Portfolio sections
      S.listItem()
        .title('Portfolio Content')
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
      // Blog sections
      S.listItem()
        .title('Blog Content')
        .child(
          S.list()
            .title('Blog Content')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        item =>
          item.getId() &&
          !['post', 'category', 'author', 'project', 'skill', 'about', 'contact', 'tag'].includes(item.getId()!)
      ),
    ])
