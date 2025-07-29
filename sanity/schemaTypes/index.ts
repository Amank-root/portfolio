import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { projectType } from './projectType'
import { tagType } from './tagType'
import { skillType } from './skillType'
import { aboutType } from './aboutType'
import { contactType } from './contactType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    projectType,
    tagType,
    skillType,
    aboutType,
    contactType,
  ],
}
