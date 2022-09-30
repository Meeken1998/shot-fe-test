import { EditorConfig } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Link from '@editorjs/link'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import SimpleImage from '@editorjs/simple-image'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Marker from '@editorjs/marker'

export const getConfigs = (el: HTMLElement): EditorConfig => ({
  holder: el,
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    link: Link,
    raw: Raw,
    simpleImage: SimpleImage,
    embed: Embed,
    quote: Quote,
    table: Table,
    marker: Marker,
  },
})
